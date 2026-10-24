import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { supabase, supabaseConfigured } from './supabaseClient';

const years = {
  '2nd year': {
    pattern: 'SPPU 2024 Pattern · AY 2025–26',
    source: 'https://www.pvgcoet.ac.in/wp-content/uploads/2026/03/SE-E-TC-2024-Pattern.pdf',
    semesters: {
      'Semester III': [
        { code: 'PCC-201', name: 'Electronics Circuits', practicals: 0 },
        { code: 'PCC-202', name: 'Engineering Mathematics III', practicals: 0 },
        { code: 'PCC-203', name: 'Digital Electronics', practicals: 0 },
        { code: 'PCC-204', name: 'Electronics Circuits & Digital Electronics Lab', practicals: 8, lab: true },
        { code: 'OE-I', name: 'Open Elective I', practicals: 0, choice: 'Select the course offered by your college.' },
        { code: 'MDM-221', name: 'Data Structures & Algorithms', practicals: 0 },
        { code: 'MDM-222', name: 'Data Structures & Algorithms Lab', practicals: 8, lab: true },
        { code: 'EEM-231', name: 'Engineering Economics & Applications', practicals: 0 },
        { code: 'VEC-232', name: 'Universal Human Values & Professional Ethics', practicals: 0 },
        { code: 'CEP-241', name: 'Community Engagement Project', practicals: 1, lab: true },
      ],
      'Semester IV': [
        { code: 'PCC-251', name: 'Communication Engineering', practicals: 0 },
        { code: 'PCC-252', name: 'Signals and Systems', practicals: 0 },
        { code: 'PCC-253', name: 'Control Systems', practicals: 0 },
        { code: 'PCC-254', name: 'Communication Engineering Lab', practicals: 8, lab: true },
        { code: 'OE-II', name: 'Open Elective II', practicals: 0, choice: 'Select the course offered by your college.' },
        { code: 'MDM-271', name: 'Object-Oriented Programming', practicals: 0 },
        { code: 'PCC-255', name: 'Signals & Systems and Object-Oriented Programming Lab', practicals: 8, lab: true },
        { code: 'VSE-281', name: 'Electronics Skill Development Lab', practicals: 8, lab: true },
        { code: 'AEC-282', name: 'Modern Indian Languages (Marathi/Hindi)', practicals: 0 },
        { code: 'EEM-283', name: 'Entrepreneurship Skill Development', practicals: 0 },
        { code: 'VEC-284', name: 'Environment Awareness', practicals: 0 },
      ],
    },
  },
  '3rd year': {
    pattern: 'SPPU 2024 Pattern · AY 2026–27',
    source: 'https://www.scribd.com/document/1053274557/TE-E-TC-2024-Pattern',
    semesters: {
      'Semester V': [
        { code: 'PCC-301', name: 'Microcontrollers & Applications', practicals: 0 },
        { code: 'PCC-302', name: 'Cellular Network', practicals: 0 },
        { code: 'PCC-303', name: 'VLSI Design', practicals: 0 },
        { code: 'PCC-304', name: 'Microcontrollers & VLSI Design Lab', practicals: 10, lab: true },
        { code: 'PCC-305', name: 'Cellular Network Lab', practicals: 8, lab: true },
        { code: 'PEC-321', name: 'Elective I', practicals: 0, choice: 'Advanced Java · Computer Networks · DSP · Cloud Computing' },
        { code: 'PEC-322', name: 'Elective I Lab', practicals: 8, lab: true },
        { code: 'MDM-331', name: 'Minor: Machine Learning', practicals: 0 },
        { code: 'OLE-341', name: 'Open Elective', practicals: 0, choice: 'Choose from the options offered by your college.' },
        { code: 'ELC-342', name: 'Technical Seminar', practicals: 1, lab: true },
      ],
      'Semester VI': [
        { code: 'PCC-351', name: 'Embedded System Design', practicals: 0 },
        { code: 'PCC-352', name: 'Broadband Communication', practicals: 0 },
        { code: 'PCC-353', name: 'Embedded System Design Lab', practicals: 8, lab: true },
        { code: 'PCC-354', name: 'Broadband Communication Lab', practicals: 8, lab: true },
        { code: 'PEC-361', name: 'Elective II', practicals: 0, choice: 'Web Technology · Digital Image Processing · Network & Cyber Security · CMOS Process Technology' },
        { code: 'PEC-362', name: 'Elective III', practicals: 0, choice: 'Power Electronics · Robotics & Automation · Artificial Intelligence · Industrial IoT' },
        { code: 'PEC-363', name: 'Elective II & III Lab', practicals: 8, lab: true },
        { code: 'MDM-371', name: 'Minor: Database Management System', practicals: 0 },
        { code: 'VSE-372', name: 'Mini Project', practicals: 1, lab: true },
        { code: 'ELC-381', name: 'Internship / On-the-Job Training', practicals: 1, lab: true },
      ],
    },
  },
  '4th year': {
    pattern: 'SPPU 2019 Pattern · current B.E. syllabus (AY 2022–23)',
    source: 'https://www.pvgcoet.ac.in/wp-content/uploads/2026/03/B.E.-E-TC-2019-Pattern.pdf',
    note: 'The 2024 pattern is scheduled to reach B.E. in AY 2027–28. SPPU has not published its B.E. E&TC course list yet, so this section uses the current 2019 pattern.',
    semesters: {
      'Semester VII': [
        { code: '404181', name: 'Radiation & Microwave Theory', practicals: 0 },
        { code: '404182', name: 'VLSI Design and Technology', practicals: 0 },
        { code: '404183', name: 'Cloud Computing', practicals: 0 },
        { code: '404184', name: 'Elective 3', practicals: 0, choice: 'Biomedical Signal Processing · Industrial Drives & Automation · Android Development · Embedded System Design' },
        { code: '404185', name: 'Elective 4', practicals: 0, choice: 'Select the elective offered by your college.' },
        { code: '404186', name: 'Lab Practice 1 · RMT & Cloud Computing', practicals: 8, lab: true },
        { code: '404187', name: 'Lab Practice 2 · VLSI Design & Elective 3', practicals: 8, lab: true },
        { code: '404188', name: 'Project Stage I', practicals: 1, lab: true },
        { code: '404189', name: 'Mandatory Audit Course 7', practicals: 0 },
      ],
      'Semester VIII': [
        { code: '404191', name: 'Fiber Optic Communication', practicals: 0 },
        { code: '404192', name: 'Elective 5', practicals: 0, choice: 'Biomedical Signal Processing · Industrial Drives & Automation · Android Development · Embedded System Design · Mobile Computing' },
        { code: '404193', name: 'Elective 6', practicals: 0, choice: 'System on Chip · Nano Electronics · Remote Sensing · Digital Marketing · Open Elective' },
        { code: '404194', name: 'Innovation & Entrepreneurship', practicals: 0 },
        { code: '404195', name: 'Digital Business Management', practicals: 0 },
        { code: '404196', name: 'Fiber Optic Lab', practicals: 8, lab: true },
        { code: '404197', name: 'Lab Practice 3 · Elective 5', practicals: 8, lab: true },
        { code: '404198', name: 'Project Stage II', practicals: 1, lab: true },
      ],
    },
  },
};

const initialCounts = { students: 142, faculty: 8 };

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

  const handleSubmit = async event => {
    event.preventDefault();
    setMessage('');
    setError('');
    if (!supabase) {
      setError('Account sign-in is not configured yet. The dashboard is still in demo mode.');
      return;
    }
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || '').trim().toLowerCase();
    const password = String(form.get('password') || '');

    try {
      if (mode === 'signup') {
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

  return <div className="dialog-backdrop" role="presentation" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <section className="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <button className="dialog-close" onClick={onClose} aria-label="Close account dialog">×</button>
      <div className="section-kicker">LABMATE ACCOUNT</div>
      <h2 id="auth-title">{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h2>
      <p className="auth-intro">{mode === 'signup' ? 'Use your regular email address. We’ll send a verification link.' : 'Sign in with your verified email address.'}</p>
      {!supabaseConfigured && <div className="setup-notice">Account service setup is still being completed. You can explore the demo meanwhile.</div>}
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
        <label>Password<input name="password" type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} required minLength="8" /></label>
        {mode === 'signup' && accountType === 'student' && <div className="student-fields">
          <label>College roll number<input name="roll_number" autoComplete="off" required maxLength="40" /></label>
          <label>Academic year<select name="academic_year" defaultValue="2"><option value="2">2nd year</option><option value="3">3rd year</option><option value="4">4th year</option></select></label>
        </div>}
        {mode === 'signup' && accountType !== 'student' && <div className="setup-notice">Faculty access starts as pending and becomes available after admin approval.</div>}
        {message && <div className="form-message success" role="status">{message}</div>}
        {error && <div className="form-message error" role="alert">{error}</div>}
        <button className="auth-submit" type="submit" disabled={busy || !supabaseConfigured}>{busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}</button>
      </form>
      <div className="auth-switch">{mode === 'signup' ? 'Already registered?' : 'New to LabMate?'} <button onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setMessage(''); setError(''); }}>{mode === 'signup' ? 'Sign in' : 'Create an account'}</button></div>
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
  const [role, setRole] = React.useState('Faculty');
  const [counts, setCounts] = React.useState(initialCounts);
  const [selectedCode, setSelectedCode] = React.useState('PCC-301');
  const [uploads, setUploads] = React.useState({});
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
  const selectedCourse = courses.find(course => course.code === selectedCode) || courses[0];
  const materialList = [
    { name: 'Official syllabus', kind: 'Syllabus reference', url: yearData.source },
    ...(selectedCourse.lab ? [{ name: 'Lab / practical course', kind: 'Listed in the selected syllabus' }] : []),
    ...(selectedCourse.choice ? [{ name: selectedCourse.choice, kind: 'Elective options' }] : []),
    ...(uploads[selectedCourse.code] || []).map(name => ({ name, kind: 'Added in this session' })),
  ];
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const workspaceRole = profile ? (profile.role === 'student' ? 'Student' : profile.role === 'admin' ? 'Admin' : 'Faculty') : role;
  const canUpload = profile
    ? ['faculty', 'assistant_professor', 'admin'].includes(profile.role) && ['active', 'approved'].includes(profile.account_status)
    : role === 'Faculty';

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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthInitialized(true);
      if (!nextSession) setProfile(null);
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
    if (!apiUrl) return;
    fetch(apiUrl.replace(/\/$/, '') + '/api/overview')
      .then(response => response.ok ? response.json() : Promise.reject(new Error('Summary unavailable')))
      .then(summary => setCounts({ students: summary.students, faculty: summary.faculty }))
      .catch(() => setCounts(initialCounts));
  }, [apiUrl]);

  const chooseYear = nextYear => {
    setYear(nextYear);
    const firstSemester = Object.keys(years[nextYear].semesters)[0];
    setSemester(firstSemester);
    setSelectedCode(years[nextYear].semesters[firstSemester][0].code);
  };
  const handleUpload = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploads(current => ({
      ...current,
      [selectedCourse.code]: [...(current[selectedCourse.code] || []), file.name],
    }));
    event.target.value = '';
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
        <a className="nav-item active" href="#home"><Icon name="grid" />Overview</a>
        <a className="nav-item" href="#subjects"><Icon name="book" />Subjects</a>
        <a className="nav-item" href="#materials"><Icon name="file" />Materials</a>
        <a className="nav-item" href="#community"><Icon name="people" />People</a>
      </nav>
      <div className="sidebar-note"><span className="note-mark" />Start with the subjects and signups. Room planning can come later.</div>
      <div className="sidebar-bottom"><span className="year-label">ACADEMIC YEARS</span><div className="year-list">{Object.keys(years).map(item => <button key={item} onClick={() => chooseYear(item)} className={year === item ? 'year-link current' : 'year-link'}>{item}<span>{Object.keys(years[item].semesters).length}</span></button>)}</div><div className="profile"><div className="profile-avatar">{workspaceRole === 'Faculty' ? 'FC' : workspaceRole === 'Admin' ? 'AD' : 'ST'}</div><span><b>{profile?.full_name || (role === 'Faculty' ? 'Faculty preview' : 'Student preview')}</b><small>{profile ? workspaceRole : 'Demo workspace'}</small></span></div></div>
    </aside>

    <main className="main-content" id="home">
      <header className="topbar"><div className="breadcrumbs">LabMate <span>/</span> Overview</div><div className="topbar-actions">{profile ? <><span className="signed-in-name">{profile.full_name}<small>{workspaceRole}</small></span><button className="quiet-button" onClick={handleSignOut}>Sign out</button></> : <><label className="role-picker"><span>Demo as</span><select value={role} onChange={event => setRole(event.target.value)} aria-label="Choose a demo role"><option>Faculty</option><option>Student</option></select><Icon name="chevron" size={14} /></label><button className="quiet-button" onClick={() => { setAuthMode('signin'); setAuthOpen(true); }}>Sign in</button><button className="auth-top-button" onClick={() => { setAuthMode('signup'); setAuthOpen(true); }}>Create account</button></>}<button className="icon-button" aria-label="Search"><Icon name="search" size={17} /></button></div></header>
      <section className="page-heading"><div><div className="eyebrow">SPPU E&amp;TC <span>·</span> CURRICULUM BY YEAR</div><h1>Make room for learning<span className="heading-period">.</span></h1><p>Browse semester subjects, labs, practicals, and shared course material.</p></div><div className="year-switch" role="group" aria-label="Choose academic year">{Object.keys(years).map(item => <button key={item} onClick={() => chooseYear(item)} className={year === item ? 'selected' : ''}>{item}</button>)}</div></section>

      <section className="metrics-grid" id="community" aria-label="Signup overview">
        <article className="metric-card"><div className="metric-top"><span>STUDENT SIGNUPS</span><Icon name="people" size={17} /></div><div className="metric-value">{counts.students}<span className="metric-unit"> students</span></div><div className="metric-foot">Across the three active years</div></article>
        <article className="metric-card"><div className="metric-top"><span>FACULTY SIGNUPS</span><Icon name="people" size={17} /></div><div className="metric-value">{counts.faculty}<span className="metric-unit"> faculty</span></div><div className="metric-foot">Shared across subjects</div></article>
        <article className="metric-card"><div className="metric-top"><span>{semester.toUpperCase()} COURSES</span><Icon name="book" size={17} /></div><div className="metric-value">{courses.length}<span className="metric-unit"> courses</span></div><div className="metric-foot">Includes separately listed labs and projects</div></article>
      </section>

      <section className="access-rules" aria-label="Signup and approval rules">
        <article className="access-rule"><span className="access-icon"><Icon name="people" size={17} /></span><div><div className="section-kicker">STUDENT ACCESS</div><h2>Students can sign up</h2><p>Use their name, normal email address, and college roll number.</p></div><span className="rule-status open">SELF SIGNUP</span></article>
        <article className="access-rule"><span className="access-icon"><Icon name="book" size={17} /></span><div><div className="section-kicker">FACULTY ACCESS</div><h2>Admin approval required</h2><p>Faculty and assistant professors request access; an admin approves them.</p></div><span className="rule-status review">REVIEW</span></article>
      </section>
      {profile?.role === 'admin' && <ApprovalPanel client={supabase} />}

      <div className="section-heading" id="subjects"><div><div className="section-kicker">CURRICULUM</div><h2>{year} · {semester}</h2><p>Choose a course to see lab status, elective choices, and shared material.</p></div><a className="curriculum-tag" href={yearData.source} target="_blank" rel="noreferrer">{yearData.pattern} · source ↗</a></div>
      <div className="semester-switch" role="group" aria-label="Choose semester">{semesters.map(item => <button key={item} onClick={() => { setSemester(item); setSelectedCode(yearData.semesters[item][0].code); }} className={semester === item ? 'selected' : ''}>{item}</button>)}</div>
      {yearData.note && <p className="curriculum-note">{yearData.note}</p>}
      <div className="workspace-grid">
        <section className="subject-panel" aria-label="Subject list">
          <div className="panel-topline"><span>COURSE</span><span>TYPE</span></div>
          <div className="subject-list">{courses.map(course => <button key={course.code} onClick={() => setSelectedCode(course.code)} className={selectedCourse.code === course.code ? 'subject-row selected' : 'subject-row'}><span className="subject-code">{course.code}</span><span className="subject-name"><b>{course.name}</b><small>{course.lab ? 'Lab / practical / project' : course.choice ? 'Elective' : 'Theory'}</small></span><span className="practical-count">{course.lab ? 'Lab' : '—'}<small>{course.lab ? 'course' : 'theory'}</small></span><Icon name="arrow" size={15} /></button>)}</div>
          <div className="subject-footer"><span className="check-icon"><Icon name="check" size={14} /></span>{courses.filter(course => course.lab).length} lab, practical, or project courses in this semester</div>
        </section>

        <section className="detail-panel" id="materials">
          <div className="detail-heading"><div><div className="section-kicker">COURSE DETAILS</div><h2>{selectedCourse.name}</h2><p>{selectedCourse.code} <span>·</span> {year} · {semester}</p></div><span className="subject-glyph"><Icon name={selectedCourse.lab ? 'flask' : 'book'} size={20} /></span></div>
          <div className="detail-stats"><div><b>{selectedCourse.lab ? 'Yes' : '—'}</b><span>lab / practical course</span></div><div><b>{materialList.length}</b><span>references &amp; materials</span></div></div>
          <div className="material-heading"><h3>Practicals & materials</h3>{canUpload && <button className="upload-button" onClick={() => uploadInput.current?.click()}><Icon name="upload" size={15} />Add material</button>}</div>
          <input ref={uploadInput} className="file-input" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.png,.jpg,.jpeg" onChange={handleUpload} aria-label="Upload syllabus or practical material" />
          {canUpload && <p className="upload-hint">Add a syllabus, lab sheet, or experiment guide. This preview keeps filenames in this session only.</p>}
          {!canUpload && <p className="upload-hint">Materials shared by faculty for your practical work.</p>}
          <ul className="material-list">{materialList.map((material, index) => <li key={material.name + index}><span className="file-glyph"><Icon name="file" size={15} /></span><span className="file-name">{material.name}<small>{material.kind}</small></span>{material.url ? <a className="file-access" href={material.url} target="_blank" rel="noreferrer">Open ↗</a> : <span className="file-access">{role === 'Student' ? 'Available' : 'Shared'}</span>}</li>)}</ul>
          <div className="detail-bottom"><span>Faculty can add experiment sheets, notes, and syllabus material.</span><Icon name="arrow" size={15} /></div>
        </section>
      </div>
      <footer className="page-footer"><span>LabMate <span className="footer-dot">·</span> Make room for learning.</span><span>{apiUrl ? 'API configured' : 'Demo workspace · signup totals are examples'}</span></footer>
    </main>
    {authOpen && <AuthDialog mode={authMode} setMode={setAuthMode} onClose={() => setAuthOpen(false)} />}
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
