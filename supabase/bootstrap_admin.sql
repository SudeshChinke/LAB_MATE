-- Run once in the Supabase SQL Editor after the first admin has verified email.
-- Replace the value below with that exact email address.
update public.profiles as p
set role = 'admin', account_status = 'approved'
from auth.users as u
where p.id = u.id
  and lower(u.email) = lower('ADMIN_EMAIL@example.com')
  and u.email_confirmed_at is not null;
