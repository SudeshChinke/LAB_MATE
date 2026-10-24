import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { supabase, supabaseConfigured } from './supabaseClient';

const years = {
  '2nd year': {
    number: 2,
    pattern: 'SPPU 2024 Pattern · AY 2025–26',
    source: 'https://www.pvgcoet.ac.in/wp-content/uploads/2026/03/SE-E-TC-2024-Pattern.pdf',
    semesters: {
      'Semester III': [
        { code: 'PCC-204', lab: 'Electronics Circuits & Digital Electronics Lab', subject: 'Electronics Circuits' },
        { code: 'PCC-204', lab: 'Electronics Circuits & Digital Electronics Lab', subject: 'Digital Electronics' },
        { code: 'MDM-222', lab: 'Data Structures & Algorithms Lab', subject: 'Data Structures & Algorithms' },
      ],
      'Semester IV': [
        { code: 'PCC-254', lab: 'Communication Engineering Lab', subject: 'Communication Engineering' },
        { code: 'PCC-272', lab: 'Signals & Systems and Object-Oriented Programming Lab', subject: 'Signals & Systems' },
        { code: 'PCC-272', lab: 'Signals & Systems and Object-Oriented Programming Lab', subject: 'Object-Oriented Programming' },
        { code: 'VSE-281', lab: 'Electronics Skill Development Lab', subject: 'Electronics Skill Development' },
      ],
    },
  },
  '3rd year': {
    number: 3,
    pattern: 'SPPU 2024 Pattern · AY 2026–27',
    source: 'https://aissmscoe.com/wp-content/uploads/2026/07/TE_EandTC-_2024-PatR1_23062026.pdf',
    semesters: {
      'Semester V': [
        { code: 'PCC-304', lab: 'Microcontrollers & VLSI Design Lab', subject: 'Microcontrollers & Applications' },
        { code: 'PCC-304', lab: 'Microcontrollers & VLSI Design Lab', subject: 'VLSI Design' },
        { code: 'PCC-305', lab: 'Cellular Network Lab', subject: 'Cellular Network' },
        { code: 'PEC-322', lab: 'Elective I Lab', subject: 'Advanced Java Programming', elective: 'Elective I' },
        { code: 'PEC-322', lab: 'Elective I Lab', subject: 'Computer Networks', elective: 'Elective I' },
        { code: 'PEC-322', lab: 'Elective I Lab', subject: 'Digital Signal Processing', elective: 'Elective I' },
        { code: 'PEC-322', lab: 'Elective I Lab', subject: 'Cloud Computing', elective: 'Elective I' },
        { code: 'MDM-331', lab: 'Machine Learning Lab', subject: 'Machine Learning' },
      ],
      'Semester VI': [
        { code: 'PCC-353', lab: 'Embedded System Design Lab', subject: 'Embedded System Design' },
        { code: 'PCC-354', lab: 'Broadband Communication Lab', subject: 'Broadband Communication' },
        { code: 'PEC-363', lab: 'Elective II Lab', subject: 'Web Technology', elective: 'Elective II' },
        { code: 'PEC-363', lab: 'Elective II Lab', subject: 'Digital Image Processing', elective: 'Elective II' },
        { code: 'PEC-363', lab: 'Elective II Lab', subject: 'Network & Cyber Security', elective: 'Elective II' },
        { code: 'PEC-363', lab: 'Elective II Lab', subject: 'CMOS Process Technology', elective: 'Elective II' },
        { code: 'PEC-363', lab: 'Elective III Lab', subject: 'Power Electronics', elective: 'Elective III' },
        { code: 'PEC-363', lab: 'Elective III Lab', subject: 'Robotics & Automation', elective: 'Elective III' },
        { code: 'PEC-363', lab: 'Elective III Lab', subject: 'Artificial Intelligence', elective: 'Elective III' },
        { code: 'PEC-363', lab: 'Elective III Lab', subject: 'Industrial IoT', elective: 'Elective III' },
        { code: 'MDM-371', lab: 'Database Management System Lab', subject: 'Database Management System' },
        { code: 'VSE-372', lab: 'Mini Project', subject: 'Mini Project' },
      ],
    },
  },
  '4th year': {
    number: 4,
    pattern: 'SPPU 2019 Pattern · current B.E. syllabus (AY 2022–23)',
    source: 'https://www.pvgcoet.ac.in/wp-content/uploads/2026/03/B.E.-E-TC-2019-Pattern.pdf',
    note: 'The 2024 pattern is scheduled to reach B.E. in AY 2027–28. SPPU has not published its B.E. E&TC course list yet, so this section uses the current 2019 pattern.',
    semesters: {
      'Semester VII': [
        { code: '404186', lab: 'Lab Practice 1', subject: 'Radiation & Microwave Theory' },
        { code: '404186', lab: 'Lab Practice 1', subject: 'Cloud Computing' },
        { code: '404187', lab: 'Lab Practice 2', subject: 'VLSI Design' },
        { code: '404187', lab: 'Lab Practice 2', subject: 'Speech Processing', elective: 'Elective III' },
        { code: '404187', lab: 'Lab Practice 2', subject: 'PLC SCADA & Automation', elective: 'Elective III' },
        { code: '404187', lab: 'Lab Practice 2', subject: 'JavaScript', elective: 'Elective III' },
        { code: '404187', lab: 'Lab Practice 2', subject: 'Embedded System and RTOS', elective: 'Elective III' },
        { code: '404187', lab: 'Lab Practice 2', subject: 'Modernized IoT', elective: 'Elective III' },
        { code: '404188', lab: 'Project Stage I', subject: 'Project Stage I' },
      ],
      'Semester VIII': [
        { code: '404195', lab: 'Fiber Optic Lab', subject: 'Fiber Optic Communication' },
        { code: '404196', lab: 'Lab Practice 3', subject: 'Biomedical Signal Processing', elective: 'Elective V' },
        { code: '404196', lab: 'Lab Practice 3', subject: 'Industrial Drives and Control', elective: 'Elective V' },
        { code: '404196', lab: 'Lab Practice 3', subject: 'Android Development', elective: 'Elective V' },
        { code: '404196', lab: 'Lab Practice 3', subject: 'Embedded System Design', elective: 'Elective V' },
        { code: '404196', lab: 'Lab Practice 3', subject: 'Mobile Computing', elective: 'Elective V' },
        { code: '404197', lab: 'Project Stage II', subject: 'Project Stage II' },
      ],
    },
  },
};


function Icon({ name, size = 18 }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  const paths = {
    grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="1" /><rect x="13.5" y="3.5" width="7" height="7" rx="1" /><rect x="3.5" y="13.5" width="7" height="7" rx="1" /><rect x="13.5" y="13.5" width="7" height="7" rx="1" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5z" /><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20M8 7h8M8 10h6" /></>,
    flask: <><path d="M9 3h6M10 3v6l-5.8 9.2A2 2 0 0 0 5.9 21h12.2a2 2 0 0 0 1.7-2.8L14 9V3" /><path d="M8 15h8" /></>,
    people: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    upload: <><path d="M12 16V4m0 0L7 9m5-5 5 5" /><path d="M4 16v4h16v-4" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
    chevron: <path d="m8 10 4 4 4-4" />,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    file: <><path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10z" /><path d="M13 3v7h7M8 14h8M8 17h6" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return <svg {...props}>{paths[name]}</svg>;
}

function AuthDialog({ mode, setMode, onClose }) {
  const [accountType, setAccountType] = React.useState('student');
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const changeMode = nextMode => {
    setMode(nextMode);
    setMessage('');
    setError('');
    setShowPassword(false);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setMessage('');
    setError('');
    if (!supabase) {
      setError('Account access is currently unavailable. Please contact your LabMate administrator.');
      return;
    }
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || '').trim().toLowerCase();
    const password = String(form.get('password') || '');

    try {
      if (mode === 'forgot') {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (resetError) throw resetError;
        setMessage('If a LabMate account uses that email, a password reset link will be sent.');
      } else if (mode === 'recovery') {
        const confirmation = String(form.get('confirm_password') || '');
        if (password !== confirmation) throw new Error('The passwords do not match.');
        const { error: updateError } = await supabase.auth.updateUser({ password });
        if (updateError) throw updateError;
        setMessage('Your password has been updated. You can close this window.');
      } else if (mode === 'signup') {
        const metadata = {
          full_name: String(form.get('full_name') || '').trim(),
          account_type: accountType,
          roll_number: accountType === 'student' ? String(form.get('roll_number') || '').trim() : null,
          academic_year: accountType === 'student' ? Number(form.get('academic_year')) : null,
        };
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: metadata,
            emailRedirectTo: window.location.origin,
          },
        });
        if (signUpError) throw signUpError;
        if (data.session) {
          onClose();
        } else {
          setMessage(accountType === 'student'
            ? 'Check your inbox and confirm your email before signing in.'
            : 'Check your inbox to confirm your email. Your access request will wait for admin approval.');
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        onClose();
      }
    } catch (authError) {
      setError(authError.message || 'We could not complete that request. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const title = mode === 'signup' ? 'Create your account'
    : mode === 'forgot' ? 'Reset your password'
      : mode === 'recovery' ? 'Choose a new password'
        : 'Welcome back';
  const intro = mode === 'signup' ? 'Use your regular email address. We’ll send a verification link.'
    : mode === 'forgot' ? 'Enter your email and we’ll send a password reset link if there is an account for it.'
      : mode === 'recovery' ? 'Choose a new password for your LabMate account.'
        : 'Sign in with your verified email address.';

  return <div className="dialog-backdrop" role="presentation" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <section className="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <button className="dialog-close" onClick={onClose} aria-label="Close account dialog">×</button>
      <div className="section-kicker">LABMATE ACCOUNT</div>
      <h2 id="auth-title">{title}</h2>
      <p className="auth-intro">{intro}</p>
      {!supabaseConfigured && <div className="setup-notice">Account access is currently unavailable. Please try again later.</div>}
      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === 'signup' && <>
          <label>Account type
            <select value={accountType} onChange={event => setAccountType(event.target.value)}>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="assistant_professor">Assistant professor</option>
            </select>
          </label>
          <label>Full name<input name="full_name" autoComplete="name" required minLength="2" maxLength="120" /></label>
        </>}
        <label>Email address<input name="email" type="email" autoComplete="email" required /></label>
        {['signup', 'signin', 'recovery'].includes(mode) && <label>{mode === 'recovery' ? 'New password' : 'Password'}
          <span className="password-field">
            <input name="password" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} required minLength="8" />
            <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(current => !current)}>{showPassword ? 'Hide' : 'Show'}</button>
          </span>
        </label>}
        {mode === 'recovery' && <label>Confirm new password
          <span className="password-field">
            <input name="confirm_password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required minLength="8" />
            <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(current => !current)}>{showPassword ? 'Hide' : 'Show'}</button>
          </span>
        </label>}
        {mode === 'signup' && accountType === 'student' && <div className="student-fields">
          <label>College roll number<input name="roll_number" autoComplete="off" required maxLength="40" /></label>
          <label>Academic year<select name="academic_year" defaultValue="2"><option value="2">2nd year</option><option value="3">3rd year</option><option value="4">4th year</option></select></label>
        </div>}
        {mode === 'signup' && accountType !== 'student' && <div className="setup-notice">Faculty access starts as pending and becomes available after admin approval.</div>}
        {message && <div className="form-message success" role="status">{message}</div>}
        {error && <div className="form-message error" role="alert">{error}</div>}
        <button className="auth-submit" type="submit" disabled={busy || !supabaseConfigured}>{busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : mode === 'forgot' ? 'Send reset link' : mode === 'recovery' ? 'Update password' : 'Sign in'}</button>
      </form>
      {mode === 'signin' && <div className="auth-forgot"><button onClick={() => changeMode('forgot')}>Forgot your password?</button></div>}
      {mode === 'recovery'
        ? <div className="auth-switch"><button onClick={onClose}>Return to LabMate</button></div>
        : <div className="auth-switch">{mode === 'forgot' ? 'Remembered your password?' : mode === 'signup' ? 'Already registered?' : 'New to LabMate?'} <button onClick={() => changeMode(mode === 'signup' ? 'signin' : mode === 'signin' ? 'signup' : 'signin')}>{mode === 'signup' ? 'Sign in' : mode === 'signin' ? 'Create an account' : 'Back to sign in'}</button></div>}
    </section>
  </div>;
}

function ApprovalPanel({ client }) {
  const [pending, setPending] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [notice, setNotice] = React.useState('');
  const [error, setError] = React.useState('');

  const loadPending = React.useCallback(async () => {
    setLoading(true);
    setError('');
    const { data, error: queryError } = await client.from('profiles')
      .select('id,full_name,email,role,created_at')
      .eq('account_status', 'pending')
      .in('role', ['faculty', 'assistant_professor'])
      .order('created_at', { ascending: true });
    if (queryError) setError(queryError.message);
    else setPending(data || []);
    setLoading(false);
  }, [client]);

  React.useEffect(() => { loadPending(); }, [loadPending]);

  const updateStatus = async (id, status) => {
    setNotice('');
    setError('');
    const { error: updateError } = await client.from('profiles').update({ account_status: status }).eq('id', id);
    if (updateError) setError(updateError.message);
    else {
      setNotice(status === 'approved' ? 'Access approved.' : 'Request declined.');
      loadPending();
    }
  };

  return <section className="approval-panel" aria-label="Faculty access requests">
    <div className="approval-heading"><div><div className="section-kicker">ADMIN</div><h2>Faculty access requests</h2></div><button className="quiet-button" onClick={loadPending}>Refresh</button></div>
    {notice && <p className="form-message success" role="status">{notice}</p>}
    {error && <p className="form-message error" role="alert">{error}</p>}
    {loading ? <p className="empty-approvals">Loading requests…</p> : pending.length === 0 ? <p className="empty-approvals">No faculty requests need review.</p> : <ul className="approval-list">{pending.map(person => <li key={person.id}>
      <div><b>{person.full_name}</b><span>{person.email}</span><small>{person.role === 'assistant_professor' ? 'Assistant professor' : 'Faculty'}</small></div>
      <div className="approval-actions"><button onClick={() => updateStatus(person.id, 'approved')}>Approve</button><button className="decline" onClick={() => updateStatus(person.id, 'rejected')}>Decline</button></div>
    </li>)}</ul>}
  </section>;
}

function App() {
  const [year, setYear] = React.useState('3rd year');
  const [semester, setSemester] = React.useState('Semester V');
  const [selectedKey, setSelectedKey] = React.useState('PCC-304::Microcontrollers & Applications');
  const [experiments, setExperiments] = React.useState([]);
  const [sharedFiles, setSharedFiles] = React.useState([]);
  const [workMessage, setWorkMessage] = React.useState('');
  const [workError, setWorkError] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [experimentDraft, setExperimentDraft] = React.useState({ title: '', scheduled_on: '', notes: '' });
  const [editingExperiment, setEditingExperiment] = React.useState(null);
  const [session, setSession] = React.useState(null);
  const [authInitialized, setAuthInitialized] = React.useState(!supabase);
  const [profile, setProfile] = React.useState(null);
  const [profileLoading, setProfileLoading] = React.useState(Boolean(supabase));
  const [profileError, setProfileError] = React.useState('');
  const [authOpen, setAuthOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState('signup');
  const uploadInput = React.useRef(null);
  const yearData = years[year];
  const semesters = Object.keys(yearData.semesters);
  const courses = yearData.semesters[semester] || yearData.semesters[semesters[0]];
  const selectedCourse = courses.find(course => `${course.code}::${course.subject}` === selectedKey) || courses[0];
  const semesterNumber = ({ I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8 })[semester.split(/\s+/).at(-1)] || null;
  const workspaceRole = profile?.role === 'student' ? 'Student' : profile?.role === 'assistant_professor' ? 'Assistant Professor' : profile?.role === 'admin' ? 'Admin' : profile ? 'Faculty' : '';
  const canManage = Boolean(profile && ['faculty', 'assistant_professor', 'admin'].includes(profile.role) && ['active', 'approved'].includes(profile.account_status));
  const canUpload = Boolean(profile && ['active', 'approved'].includes(profile.account_status));

  React.useEffect(() => {
    if (!supabase) {
      setProfileLoading(false);
      return undefined;
    }
    let mounted = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (error) setProfileError(error.message);
      setSession(data.session);
      setAuthInitialized(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setAuthInitialized(true);
      if (!nextSession) setProfile(null);
      if (event === 'PASSWORD_RECOVERY') {
        setAuthMode('recovery');
        setAuthOpen(true);
      }
      setProfileError('');
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  React.useEffect(() => {
    if (!supabase || !authInitialized) return undefined;
    if (!session?.user?.id) {
      setProfile(null);
      setProfileLoading(false);
      return undefined;
    }
    let mounted = true;
    setProfileLoading(true);
    supabase.from('profiles')
      .select('id,full_name,email,role,account_status,roll_number,academic_year')
      .eq('id', session.user.id)
      .single()
      .then(({ data, error }) => {
        if (!mounted) return;
        setProfile(data || null);
        setProfileError(error?.message || '');
        setProfileLoading(false);
      });
    return () => { mounted = false; };
  }, [authInitialized, session?.user?.id]);

  React.useEffect(() => {
    if (!supabase || !session || !profile) {
      setExperiments([]);
      return undefined;
    }
    let mounted = true;
    supabase.from('labmate_experiments')
      .select('*')
      .eq('academic_year', yearData.number)
      .eq('semester', semesterNumber)
      .eq('course_code', selectedCourse.code)
      .eq('subject_name', selectedCourse.subject)
      .order('experiment_number', { ascending: true })
      .then(({ data, error }) => {
        if (!mounted) return;
        setExperiments(data || []);
        setWorkError(error?.message || '');
      });
    return () => { mounted = false; };
  }, [session?.user?.id, profile?.id, yearData.number, semesterNumber, selectedCourse.code, selectedCourse.subject]);

  React.useEffect(() => {
    if (!supabase || !session || !profile) {
      setSharedFiles([]);
      return undefined;
    }
    let mounted = true;
    supabase.from('labmate_files')
      .select('id,experiment_id,original_name,storage_path,content_type,file_size,uploaded_by,created_at')
      .eq('academic_year', yearData.number)
      .eq('semester', semesterNumber)
      .eq('course_code', selectedCourse.code)
      .eq('subject_name', selectedCourse.subject)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!mounted) return;
        setSharedFiles(data || []);
        if (error) setWorkError(error.message);
      });
    return () => { mounted = false; };
  }, [session?.user?.id, profile?.id, yearData.number, semesterNumber, selectedCourse.code]);

  const chooseYear = nextYear => {
    setYear(nextYear);
    const firstSemester = Object.keys(years[nextYear].semesters)[0];
    setSemester(firstSemester);
    const firstCourse = years[nextYear].semesters[firstSemester][0];
    setSelectedKey(`${firstCourse.code}::${firstCourse.subject}`);
  };
  const chooseSemester = nextSemester => {
    setSemester(nextSemester);
    const firstCourse = yearData.semesters[nextSemester][0];
    setSelectedKey(`${firstCourse.code}::${firstCourse.subject}`);
  };

  const addExperiment = async event => {
    event.preventDefault();
    if (!supabase || !session?.user?.id || !canManage || !experimentDraft.title.trim()) return;
    setSaving(true);
    setWorkError('');
    setWorkMessage('');
    const experimentNumber = (experiments.at(-1)?.experiment_number || 0) + 1;
    const { data, error } = await supabase.from('labmate_experiments').insert({
      academic_year: yearData.number,
      semester: semesterNumber,
      course_code: selectedCourse.code,
      lab_course: selectedCourse.lab,
      subject_name: selectedCourse.subject,
      elective_name: selectedCourse.elective || null,
      experiment_number: experimentNumber,
      title: experimentDraft.title.trim(),
      scheduled_on: experimentDraft.scheduled_on || null,
      notes: experimentDraft.notes.trim() || null,
      created_by: session.user.id,
      updated_by: session.user.id,
    }).select('*').single();
    if (error) setWorkError(error.message);
    else {
      setExperiments(current => [...current, data].sort((a, b) => a.experiment_number - b.experiment_number));
      setExperimentDraft({ title: '', scheduled_on: '', notes: '' });
      setWorkMessage('Experiment added to this lab.');
    }
    setSaving(false);
  };

  const saveExperiment = async event => {
    event.preventDefault();
    if (!supabase || !session?.user?.id || !canManage || !editingExperiment) return;
    setSaving(true);
    setWorkError('');
    setWorkMessage('');
    const { data, error } = await supabase.from('labmate_experiments').update({
      title: editingExperiment.title.trim(),
      scheduled_on: editingExperiment.scheduled_on || null,
      notes: editingExperiment.notes.trim() || null,
      updated_by: session.user.id,
      updated_at: new Date().toISOString(),
    }).eq('id', editingExperiment.id).select('*').single();
    if (error) setWorkError(error.message);
    else {
      setExperiments(current => current.map(item => item.id === data.id ? data : item));
      setEditingExperiment(null);
      setWorkMessage('Experiment details and date saved.');
    }
    setSaving(false);
  };

  const handleUpload = async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';
    if (!supabase || !session?.user?.id || !canUpload) return;
    if (file.size > 50 * 1024 * 1024) {
      setWorkError('This file is over the 50 MB upload limit.');
      return;
    }
    const extension = file.name.split('.').pop()?.toLowerCase();
    const contentTypes = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ppt: 'application/vnd.ms-powerpoint',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      txt: 'text/plain',
      zip: 'application/zip',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
    };
    const contentType = contentTypes[extension] || file.type;
    if (!contentType) {
      setWorkError('Choose a PDF, Office document, text file, ZIP, or image.');
      return;
    }
    setSaving(true);
    setWorkError('');
    setWorkMessage('');
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const safeSubject = selectedCourse.subject.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${session.user.id}/${yearData.number}/${semesterNumber}/${selectedCourse.code}/${safeSubject}/${crypto.randomUUID()}-${safeName}`;
    const { error: storageError } = await supabase.storage.from('labmate-materials').upload(storagePath, file, {
      contentType,
      upsert: false,
    });
    if (storageError) {
      setWorkError(storageError.message);
      setSaving(false);
      return;
    }
    const { data, error } = await supabase.from('labmate_files').insert({
      uploaded_by: session.user.id,
      academic_year: yearData.number,
      semester: semesterNumber,
      course_code: selectedCourse.code,
      subject_name: selectedCourse.subject,
      elective_name: selectedCourse.elective || null,
      original_name: file.name,
      storage_path: storagePath,
      content_type: contentType,
      file_size: file.size,
      experiment_id: null,
    }).select('id,experiment_id,original_name,storage_path,content_type,file_size,uploaded_by,created_at').single();
    if (error) {
      await supabase.storage.from('labmate-materials').remove([storagePath]);
      setWorkError(error.message);
    } else {
      setSharedFiles(current => [data, ...current]);
      setWorkMessage('File uploaded and shared with this course.');
    }
    setSaving(false);
  };

  const openSharedFile = async file => {
    const { data, error } = await supabase.storage.from('labmate-materials').createSignedUrl(file.storage_path, 3600);
    if (error) setWorkError(error.message);
    else window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut();
  };

  if (!authInitialized || profileLoading) return <div className="account-state"><div className="account-state-card"><span className="brand-mark"><Icon name="flask" size={19} /></span><p>Loading your LabMate account…</p></div></div>;
  if (session && (!profile || !['active', 'approved'].includes(profile.account_status))) return <div className="account-state"><div className="account-state-card">
    <span className="brand-mark"><Icon name="flask" size={19} /></span>
    <div className="section-kicker">LABMATE ACCOUNT</div>
    <h1>{profileError ? 'Account setup problem' : profile?.account_status === 'rejected' ? 'Request not approved' : profile?.role === 'student' ? 'Confirm your email' : 'Waiting for admin approval'}</h1>
    <p>{profileError ? 'We could not load your account details. Please try signing in again.' : profile?.account_status === 'rejected' ? 'Your access request was declined. Please contact your college admin for help.' : profile?.role === 'student' ? 'Confirm your email address, then sign in to open your workspace.' : 'Your email is verified. An admin must approve faculty access before the workspace opens.'}</p>
    {profileError && <p className="account-error">{profileError}</p>}
    <button className="auth-submit" onClick={handleSignOut}>Sign out</button>
  </div></div>;

  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#home" aria-label="LabMate home"><span className="brand-mark"><Icon name="flask" size={19} /></span><span>labmate<span className="brand-period">.</span></span></a>
      <div className="workspace-label">YOUR COLLEGE</div>
      <button className="college-select"><span className="college-avatar">E</span><span><b>Electronics &amp; Telecommunication</b><small>SPPU · academic workspace</small></span><Icon name="chevron" size={15} /></button>
      <nav className="nav-list" aria-label="Main navigation">
        <a className="nav-item active" href="#subjects"><Icon name="flask" />Labs</a>
        <a className="nav-item" href="#experiments"><Icon name="book" />Experiments</a>
        <a className="nav-item" href="#materials"><Icon name="file" />Materials</a>
        {profile && <a className="nav-item" href="#profile"><Icon name="people" />Profile</a>}
      </nav>
      <div className="sidebar-note"><span className="note-mark" />Only syllabus lab and practical courses appear here.</div>
      <div className="sidebar-bottom"><span className="year-label">ACADEMIC YEARS</span><div className="year-list">{Object.keys(years).map(item => <button key={item} onClick={() => chooseYear(item)} className={year === item ? 'year-link current' : 'year-link'}>{item}<span>{Object.keys(years[item].semesters).length}</span></button>)}</div><div className="profile"><div className="profile-avatar">{workspaceRole === 'Faculty' ? 'FC' : workspaceRole === 'Admin' ? 'AD' : profile ? 'ST' : '—'}</div><span><b>{profile?.full_name || 'Not signed in'}</b><small>{profile ? workspaceRole : 'Sign in for files and schedules'}</small></span></div></div>
    </aside>

    <main className="main-content" id="home">
      <header className="topbar"><div className="breadcrumbs">LabMate <span>/</span> Labs</div><div className="topbar-actions">{profile ? <><span className="signed-in-name">{profile.full_name}<small>{workspaceRole}</small></span><button className="quiet-button" onClick={handleSignOut}>Sign out</button></> : <><button className="quiet-button" onClick={() => { setAuthMode('signin'); setAuthOpen(true); }}>Sign in</button><button className="auth-top-button" onClick={() => { setAuthMode('signup'); setAuthOpen(true); }}>Create account</button></>}</div></header>
      <section className="page-heading"><div><div className="eyebrow">SPPU E&amp;TC <span>·</span> LABS &amp; PRACTICALS</div><h1>LabMate<span className="heading-period">.</span></h1><p>Semester lab courses, syllabus experiments, schedules, and shared files.</p></div><div className="year-switch" role="group" aria-label="Choose academic year">{Object.keys(years).map(item => <button key={item} onClick={() => chooseYear(item)} className={year === item ? 'selected' : ''}>{item}</button>)}</div></section>

      <section className="metrics-grid" aria-label="Semester lab overview">
        <article className="metric-card"><div className="metric-top"><span>{semester.toUpperCase()} LAB COURSES</span><Icon name="flask" size={17} /></div><div className="metric-value">{courses.length}<span className="metric-unit"> lab sections</span></div><div className="metric-foot">Combined syllabus labs are split by subject</div></article>
        <article className="metric-card"><div className="metric-top"><span>EXPERIMENTS</span><Icon name="book" size={17} /></div><div className="metric-value">{profile ? experiments.length : '—'}<span className="metric-unit"> {profile ? 'listed' : 'sign in'}</span></div><div className="metric-foot">Dates and details maintained by faculty</div></article>
        <article className="metric-card"><div className="metric-top"><span>SHARED FILES</span><Icon name="file" size={17} /></div><div className="metric-value">{profile ? sharedFiles.length : '—'}<span className="metric-unit"> {profile ? 'files' : 'sign in'}</span></div><div className="metric-foot">Stored for the selected lab course</div></article>
      </section>
      {profile?.role === 'admin' && <ApprovalPanel client={supabase} />}

      <div className="section-heading" id="subjects"><div><div className="section-kicker">LAB COURSES</div><h2>{year} · {semester}</h2><p>Choose a lab section to see its experiments and shared material.</p></div><a className="curriculum-tag" href={yearData.source} target="_blank" rel="noreferrer">{yearData.pattern} · source ↗</a></div>
      <div className="semester-switch" role="group" aria-label="Choose semester">{semesters.map(item => <button key={item} onClick={() => chooseSemester(item)} className={semester === item ? 'selected' : ''}>{item}</button>)}</div>
      {yearData.note && <p className="curriculum-note">{yearData.note}</p>}
      <div className="workspace-grid">
        <section className="subject-panel" aria-label="Lab course list">
          <div className="panel-topline"><span>LAB COURSE · SUBJECT</span><span>CODE</span></div>
          <div className="subject-list">{courses.map(course => {
            const key = `${course.code}::${course.subject}`;
            return <button key={key} onClick={() => setSelectedKey(key)} className={selectedCourse.code === course.code && selectedCourse.subject === course.subject ? 'subject-row selected' : 'subject-row'}>
              <span className="subject-name"><b>{course.lab}</b><small>{course.elective ? `${course.elective} (${course.subject})` : course.subject}</small></span><span className="subject-code">{course.code}</span><Icon name="arrow" size={15} />
            </button>;
          })}</div>
          <div className="subject-footer"><span className="check-icon"><Icon name="check" size={14} /></span>{courses.length} lab sections in this semester</div>
        </section>

        <section className="detail-panel" id="materials">
          <div className="detail-heading"><div><div className="section-kicker">LAB COURSE</div><h2>{selectedCourse.lab}</h2><p>{selectedCourse.code} · {selectedCourse.elective ? `${selectedCourse.elective} (${selectedCourse.subject})` : selectedCourse.subject} · {year} · {semester}</p></div><span className="subject-glyph"><Icon name="flask" size={20} /></span></div>
          <div className="detail-stats"><div><b>{experiments.length}</b><span>experiments listed</span></div><div><b>{sharedFiles.length}</b><span>shared files</span></div></div>
          <section className="experiment-section" id="experiments">
            <div className="material-heading"><h3>Experiments &amp; schedule</h3><a className="syllabus-link" href={yearData.source} target="_blank" rel="noreferrer">Syllabus ↗</a></div>
            {!profile && <p className="empty-list">Sign in to view the experiment schedule and shared course files.</p>}
            {profile && workError && <p className="form-message error" role="alert">{workError}</p>}
            {profile && workMessage && <p className="form-message success" role="status">{workMessage}</p>}
            {profile && experiments.length === 0 && <p className="empty-list">No experiments have been entered for this lab yet.</p>}
            {profile && experiments.length > 0 && <ol className="experiment-list">{experiments.map(experiment => <li key={experiment.id}>
              {editingExperiment?.id === experiment.id ? <form className="experiment-form" onSubmit={saveExperiment}>
                <label>Experiment name<input value={editingExperiment.title} onChange={event => setEditingExperiment(current => ({ ...current, title: event.target.value }))} required maxLength="500" /></label>
                <label>Scheduled date<input type="date" value={editingExperiment.scheduled_on || ''} onChange={event => setEditingExperiment(current => ({ ...current, scheduled_on: event.target.value }))} /></label>
                <label>Notes<textarea value={editingExperiment.notes || ''} onChange={event => setEditingExperiment(current => ({ ...current, notes: event.target.value }))} rows="2" /></label>
                <div className="form-actions"><button className="upload-button" disabled={saving}>Save changes</button><button type="button" className="quiet-button" onClick={() => setEditingExperiment(null)}>Cancel</button></div>
              </form> : <div className="experiment-item"><div><b>Experiment {experiment.experiment_number} · {experiment.title}</b><small>{experiment.scheduled_on ? `Scheduled ${new Date(`${experiment.scheduled_on}T12:00:00`).toLocaleDateString()}` : 'Date not set'}{experiment.notes ? ` · ${experiment.notes}` : ''}</small></div>{canManage && <button className="quiet-button" onClick={() => setEditingExperiment({ id: experiment.id, title: experiment.title, scheduled_on: experiment.scheduled_on || '', notes: experiment.notes || '' })}>Edit</button>}</div>}
            </li>)}</ol>}
            {profile && canManage && <form className="experiment-form add-experiment-form" onSubmit={addExperiment}>
              <h4>Add an experiment</h4>
              <label>Experiment name<input value={experimentDraft.title} onChange={event => setExperimentDraft(current => ({ ...current, title: event.target.value }))} placeholder="Enter the syllabus experiment" required maxLength="500" /></label>
              <div className="form-row"><label>Scheduled date<input type="date" value={experimentDraft.scheduled_on} onChange={event => setExperimentDraft(current => ({ ...current, scheduled_on: event.target.value }))} /></label><label>Notes<input value={experimentDraft.notes} onChange={event => setExperimentDraft(current => ({ ...current, notes: event.target.value }))} placeholder="Optional" maxLength="1000" /></label></div>
              <button className="upload-button" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Add experiment'}</button>
            </form>}
          </section>
          <section className="materials-section" aria-label="Shared course files">
            <div className="material-heading"><h3>Shared course files</h3>{canUpload && <button className="upload-button" onClick={() => uploadInput.current?.click()} disabled={saving}><Icon name="upload" size={15} />Upload file</button>}</div>
            <input ref={uploadInput} className="file-input" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.png,.jpg,.jpeg" onChange={handleUpload} aria-label="Upload course material" />
            <p className="upload-hint">{canUpload ? 'Students and faculty can share practical sheets, notes, and syllabus material (up to 50 MB).' : 'Shared files are available after you sign in with an approved account.'}</p>
            {profile && sharedFiles.length === 0 && <p className="empty-list">No files have been shared for this lab yet.</p>}
            {profile && sharedFiles.length > 0 && <ul className="material-list">{sharedFiles.map(file => <li key={file.id}><span className="file-glyph"><Icon name="file" size={15} /></span><span className="file-name">{file.original_name}<small>{(file.file_size / (1024 * 1024)).toFixed(2)} MB · {new Date(file.created_at).toLocaleDateString()}</small></span><button className="file-access" onClick={() => openSharedFile(file)}>Open ↗</button></li>)}</ul>}
          </section>
        </section>
      </div>
      {profile && <section className="profile-section" id="profile" aria-labelledby="profile-title">
        <div className="profile-section-heading">
          <div><div className="section-kicker">MY ACCOUNT</div><h2 id="profile-title">Profile</h2><p>Your LabMate account details.</p></div>
        </div>
        <div className="profile-card">
          <div className="profile-identity">
            <span className="profile-avatar-large" aria-hidden="true">{(profile.full_name || 'LabMate').split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase()}</span>
            <div><h3>{profile.full_name}</h3><p>{profile.email}</p></div>
            <span className="profile-status">{profile.account_status === 'active' ? 'Active' : profile.account_status === 'approved' ? 'Approved' : profile.account_status === 'pending' ? 'Pending approval' : 'Not approved'}</span>
          </div>
          <dl className="profile-facts">
            <div><dt>Account type</dt><dd>{workspaceRole}</dd></div>
            <div><dt>Email</dt><dd>{profile.email}</dd></div>
            {profile.role === 'student' && <>
              <div><dt>College roll number</dt><dd>{profile.roll_number}</dd></div>
              <div><dt>Academic year</dt><dd>{profile.academic_year}{profile.academic_year === 2 ? 'nd' : profile.academic_year === 3 ? 'rd' : 'th'} year</dd></div>
            </>}
          </dl>
        </div>
      </section>}
      <footer className="page-footer"><span>LabMate <span className="footer-dot">·</span> SPPU E&amp;TC lab workspace.</span><span>{profile ? `Signed in as ${workspaceRole}` : 'Sign in to view experiments and shared files.'}</span></footer>
    </main>
    {authOpen && <AuthDialog mode={authMode} setMode={setAuthMode} onClose={() => setAuthOpen(false)} />}
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
