import { createClient } from 'npm:@supabase/supabase-js@2.118.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, x-client-info, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  const authorization = request.headers.get('Authorization') || '';
  const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return json({ error: 'Sign in as an administrator to continue.' }, 401);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const publishableKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
    return json({ error: 'Account management is not configured on the server.' }, 500);
  }

  const callerClient = createClient(supabaseUrl, publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: { user }, error: authError } = await callerClient.auth.getUser(token);
  if (authError || !user) return json({ error: 'Your session is invalid. Sign in again.' }, 401);

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: actor, error: actorError } = await adminClient.from('profiles')
    .select('role,account_status')
    .eq('id', user.id)
    .maybeSingle();
  if (actorError) return json({ error: 'Could not confirm administrator access.' }, 500);
  if (actor?.role !== 'admin' || actor.account_status !== 'approved') {
    return json({ error: 'Only an approved administrator can remove accounts.' }, 403);
  }

  let body: { action?: string; userId?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'A valid request body is required.' }, 400);
  }
  if (body.action !== 'delete' || !body.userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.userId)) {
    return json({ error: 'Choose a valid student or faculty account.' }, 400);
  }
  if (body.userId === user.id) return json({ error: 'You cannot remove your own administrator account.' }, 400);

  const { data: target, error: targetError } = await adminClient.from('profiles')
    .select('id,role')
    .eq('id', body.userId)
    .maybeSingle();
  if (targetError) return json({ error: 'Could not load the selected account.' }, 500);
  if (!target || !['student', 'faculty', 'assistant_professor'].includes(target.role)) {
    return json({ error: 'Only student and faculty accounts can be removed here.' }, 404);
  }

  const [materialsResult, evidenceResult] = await Promise.all([
    adminClient.from('labmate_files').select('storage_path').eq('uploaded_by', target.id),
    adminClient.from('labmate_practical_evidence').select('storage_path').eq('student_id', target.id),
  ]);
  if (materialsResult.error || evidenceResult.error) {
    return json({ error: 'Could not prepare the account’s uploaded files for removal.' }, 500);
  }

  const filesByBucket = [
    { bucket: 'labmate-materials', paths: (materialsResult.data || []).map(file => file.storage_path) },
    { bucket: 'labmate-evidence', paths: (evidenceResult.data || []).map(file => file.storage_path) },
  ];
  for (const { bucket, paths } of filesByBucket) {
    for (let start = 0; start < paths.length; start += 100) {
      const { error } = await adminClient.storage.from(bucket).remove(paths.slice(start, start + 100));
      if (error) return json({ error: `Could not remove uploaded files from ${bucket}. No account was deleted.` }, 500);
    }
  }

  const { error: deleteError } = await adminClient.auth.admin.deleteUser(target.id);
  if (deleteError) return json({ error: `The account could not be deleted: ${deleteError.message}` }, 500);

  return json({ success: true });
});
