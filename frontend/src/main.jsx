import React from 'react';
import { createRoot } from 'react-dom/client';
import { Sparkles } from 'lucide-react';
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

const semesterIndex = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8 };
const semesterLabelForNumber = number => Object.keys(semesterIndex).find(key => semesterIndex[key] === Number(number)) || String(number);


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
    calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M7.5 3v4M16.5 3v4M4 9h16M8 13h2M14 13h2M8 16h2" /></>,
    chat: <><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l-2 2v-9.5A7.5 7.5 0 0 1 10.5 4h2A7.5 7.5 0 0 1 20 11.5Z" /><path d="M8 11h8M8 14h5" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4L7.3 15a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a8 8 0 0 1-.1 2Z" /></>,
  };
  return <svg {...props}>{paths[name]}</svg>;
}

function SparkleMark() {
  return <Sparkles className="brand-spark" aria-hidden="true" strokeWidth={2.3} />;
}

function AuthDialog({ mode, setMode, onClose }) {
  const [accountType, setAccountType] = React.useState('student');
  const [teachingSubjects, setTeachingSubjects] = React.useState([]);
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
        const chosenSubjects = teachingSubjects.map(subjectKey => {
          const [academic_year, semester, course_code, ...subjectParts] = subjectKey.split('::');
          return { branch: 'ENTC', academic_year: Number(academic_year), semester: Number(semester), course_code, subject_name: subjectParts.join('::') };
        });
        const metadata = {
          full_name: String(form.get('full_name') || '').trim(),
          account_type: accountType,
          roll_number: accountType === 'student' ? String(form.get('roll_number') || '').trim() : null,
          branch: accountType === 'student' ? String(form.get('branch') || '') : 'ENTC',
          academic_year: accountType === 'student' ? Number(form.get('academic_year')) : null,
          teaching_subjects: accountType === 'student' ? undefined : chosenSubjects,
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
      <div className="auth-brand"><span className="auth-brand-mark"><SparkleMark /></span><span><b>LabMate</b><small>COLLEGE LAB SPACE</small></span></div>
      <div className="section-kicker auth-kicker">{mode === 'signup' ? 'GET STARTED' : mode === 'signin' ? 'YOUR ACCOUNT' : 'ACCOUNT HELP'}</div>
      <h2 id="auth-title">{title}</h2>
      <p className="auth-intro">{intro}</p>
      {!supabaseConfigured && <div className="setup-notice">Account access is currently unavailable. Please try again later.</div>}
      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === 'signup' && <>
          <label>Account type
          <select value={accountType} onChange={event => { setAccountType(event.target.value); setTeachingSubjects([]); }}>
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
        {mode === 'signup' && accountType === 'student' && <>
          <div className="student-fields">
            <label className="student-branch">Branch<select name="branch" defaultValue="ENTC" required><option value="ENTC">Electronics &amp; Telecommunication (E&amp;TC)</option></select></label>
            <label>College roll number<input name="roll_number" autoComplete="off" required maxLength="40" /></label>
            <label>Current year<select name="academic_year" defaultValue="2"><option value="2">2nd year</option><option value="3">3rd year</option><option value="4">4th year</option></select></label>
          </div>
          <p className="branch-note">Your branch and year set which labs, experiments, and materials you can view.</p>
        </>}
        {mode === 'signup' && accountType !== 'student' && <>
          <p className="branch-note">Select every lab subject you teach. Another teacher may be assigned to the same subject.</p>
          <div className="teaching-subject-picker" role="group" aria-label="Choose lab subjects">
            {Object.entries(years).map(([yearLabel, data]) => <fieldset key={yearLabel}>
              <legend>{yearLabel}</legend>
              {Object.entries(data.semesters).map(([semesterLabel, semesterCourses]) => <div key={semesterLabel} className="teaching-semester">
                <b>{semesterLabel}</b>
                {semesterCourses.map(course => {
                  const semesterNo = semesterIndex[semesterLabel.split(' ').at(-1)];
                  const key = `${data.number}::${semesterNo}::${course.code}::${course.subject}`;
                  return <label key={key} className="teaching-option">
                    <input type="checkbox" checked={teachingSubjects.includes(key)} onChange={event => setTeachingSubjects(current => event.target.checked ? [...current, key] : current.filter(item => item !== key))} />
                    <span><b>{course.subject}</b><small>{course.code} · {semesterLabel}{course.elective ? ` · ${course.elective}` : ''}</small></span>
                  </label>;
                })}
              </div>)}
            </fieldset>)}
          </div>
          <div className="setup-notice">Faculty accounts remain pending until an admin approves them. You can update your assignments later in Settings.</div>
        </>}
        {message && <div className="form-message success" role="status">{message}</div>}
        {error && <div className="form-message error" role="alert">{error}</div>}
        <button className="auth-submit" type="submit" disabled={busy || !supabaseConfigured || (mode === 'signup' && accountType !== 'student' && teachingSubjects.length === 0)}>{busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : mode === 'forgot' ? 'Send reset link' : mode === 'recovery' ? 'Update password' : 'Sign in'}</button>
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
  const [scheduleEntries, setScheduleEntries] = React.useState([]);
  const [practicalRecords, setPracticalRecords] = React.useState([]);
  const [practicalEvidence, setPracticalEvidence] = React.useState([]);
  const [evidenceBusy, setEvidenceBusy] = React.useState('');
  const [studentRoster, setStudentRoster] = React.useState([]);
  const [progressBusy, setProgressBusy] = React.useState(false);
  const [progressError, setProgressError] = React.useState('');
  const [progressMessage, setProgressMessage] = React.useState('');
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
  const [facultySubjects, setFacultySubjects] = React.useState([]);
  const [facultySubjectsLoaded, setFacultySubjectsLoaded] = React.useState(false);
  const [chatSessions, setChatSessions] = React.useState([]);
  const [activeChatId, setActiveChatId] = React.useState('');
  const [chatMessages, setChatMessages] = React.useState([]);
  const [chatPrompt, setChatPrompt] = React.useState('');
  const [chatFile, setChatFile] = React.useState(null);
  const [chatBusy, setChatBusy] = React.useState(false);
  const [chatConfigured, setChatConfigured] = React.useState(null);
  const [chatError, setChatError] = React.useState('');
  const [chatMessage, setChatMessage] = React.useState('');
  const [assignmentDraft, setAssignmentDraft] = React.useState([]);
  const [settingsMessage, setSettingsMessage] = React.useState('');
  const [settingsError, setSettingsError] = React.useState('');
  const [authOpen, setAuthOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState('signup');
  const [activePage, setActivePage] = React.useState(() => {
    const requestedPage = window.location.hash.slice(1);
    return requestedPage === 'home' ? 'dashboard' : ['dashboard', 'labs', 'experiments', 'materials', 'timetable', 'progress', 'profile', 'settings', 'chat'].includes(requestedPage) ? requestedPage : 'dashboard';
  });
  React.useEffect(() => {
    const syncPage = () => {
      const requestedPage = window.location.hash.slice(1);
      setActivePage(requestedPage === 'home' ? 'dashboard' : ['dashboard', 'labs', 'experiments', 'materials', 'timetable', 'progress', 'profile', 'settings', 'chat'].includes(requestedPage) ? requestedPage : 'dashboard');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', syncPage);
    return () => window.removeEventListener('hashchange', syncPage);
  }, []);
  const pageTitle = { dashboard: 'Dashboard', labs: 'Labs', experiments: 'Experiments', materials: 'Materials', timetable: 'Timetable', progress: 'Attendance', profile: 'Profile', settings: 'Settings', chat: 'Study assistant' }[activePage];
  const uploadInput = React.useRef(null);
  const availableYears = Object.keys(years);
  const visibleYears = profile?.role === 'student'
    ? availableYears.filter(item => years[item].number === profile.academic_year)
    : ['faculty', 'assistant_professor'].includes(profile?.role) && facultySubjectsLoaded
      ? availableYears.filter(item => facultySubjects.some(subject => subject.academic_year === years[item].number))
      : availableYears;
  const yearData = years[year];
  const allSemesters = Object.keys(yearData.semesters);
  const semesters = ['faculty', 'assistant_professor'].includes(profile?.role) && facultySubjectsLoaded
    ? allSemesters.filter(item => facultySubjects.some(subject => subject.academic_year === yearData.number && subject.semester === semesterIndex[item.split(' ').at(-1)]))
    : allSemesters;
  const allCourses = yearData.semesters[semester] || yearData.semesters[semesters[0]];
  const courses = ['faculty', 'assistant_professor'].includes(profile?.role) && facultySubjectsLoaded
    ? allCourses.filter(course => facultySubjects.some(subject => subject.academic_year === yearData.number && subject.semester === semesterIndex[semester.split(' ').at(-1)] && subject.course_code === course.code && subject.subject_name === course.subject))
    : allCourses;
  const selectedCourse = courses.find(course => `${course.code}::${course.subject}` === selectedKey) || courses[0] || allCourses[0];
  const selectedExperimentIds = experiments.map(item => item.id).join(',');
  const semesterNumber = semesterIndex[semester.split(/\s+/).at(-1)] || null;
  const workspaceRole = profile?.role === 'student' ? 'Student' : profile?.role === 'assistant_professor' ? 'Assistant Professor' : profile?.role === 'admin' ? 'Admin' : profile ? 'Faculty' : '';
  const canManage = Boolean(profile && ['active', 'approved'].includes(profile.account_status) && (
    profile.role === 'admin' || (['faculty', 'assistant_professor'].includes(profile.role) && facultySubjects.some(subject =>
      subject.academic_year === yearData.number && subject.semester === semesterNumber && subject.branch === (profile.branch || 'ENTC') && subject.course_code === selectedCourse.code && subject.subject_name === selectedCourse.subject
    ))
  ));
  const canUpload = Boolean(canManage && ['faculty', 'assistant_professor', 'admin'].includes(profile.role));
  const now = new Date();
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const upcomingSchedule = scheduleEntries.filter(item => item.scheduled_on >= todayKey);
  const daysUntil = date => Math.round((new Date(`${date}T12:00:00`).getTime() - new Date(`${todayKey}T12:00:00`).getTime()) / 86400000);

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
      .select('id,full_name,email,role,account_status,roll_number,academic_year,branch,created_at')
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
    if (profile?.role !== 'student') return;
    const assignedYear = availableYears.find(item => years[item].number === profile.academic_year);
    if (!assignedYear) return;
    setYear(assignedYear);
    const firstSemester = Object.keys(years[assignedYear].semesters)[0];
    setSemester(firstSemester);
    const firstCourse = years[assignedYear].semesters[firstSemester][0];
    setSelectedKey(`${firstCourse.code}::${firstCourse.subject}`);
  }, [profile?.id, profile?.role, profile?.academic_year]);

  React.useEffect(() => {
    if (!supabase || !session || !profile || !['faculty', 'assistant_professor'].includes(profile.role)) {
      setFacultySubjects([]);
      setAssignmentDraft([]);
      setFacultySubjectsLoaded(Boolean(profile?.role !== 'faculty' && profile?.role !== 'assistant_professor'));
      return undefined;
    }
    let mounted = true;
    setFacultySubjectsLoaded(false);
    supabase.from('labmate_faculty_subjects')
      .select('id,branch,academic_year,semester,course_code,subject_name')
      .eq('faculty_id', profile.id)
      .then(({ data, error }) => {
        if (!mounted) return;
        const rows = data || [];
        setFacultySubjects(rows);
        setAssignmentDraft(rows.map(row => `${row.academic_year}::${row.semester}::${row.course_code}::${row.subject_name}`));
        if (!error && rows.length) {
          const currentAssigned = rows.some(row => row.academic_year === years[year]?.number && row.semester === semesterIndex[semester.split(' ').at(-1)]);
          const first = rows[0];
          if (!currentAssigned) {
            const firstYear = availableYears.find(item => years[item].number === first.academic_year);
            if (firstYear) setYear(firstYear);
            const firstSemester = Object.keys(years[availableYears.find(item => years[item].number === first.academic_year)]?.semesters || {})
              .find(label => ({ I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8 })[label.split(' ').at(-1)] === first.semester);
            if (firstSemester) setSemester(firstSemester);
            setSelectedKey(`${first.course_code}::${first.subject_name}`);
          }
        }
        if (error) setSettingsError(error.message);
        setFacultySubjectsLoaded(true);
      });
    return () => { mounted = false; };
  }, [session?.user?.id, profile?.id, profile?.role]);

  React.useEffect(() => {
    if (!supabase || !session || !profile) {
      setExperiments([]);
      return undefined;
    }
    let mounted = true;
    let query = supabase.from('labmate_experiments')
      .select('*')
      .eq('academic_year', yearData.number)
      .eq('semester', semesterNumber)
      .eq('course_code', selectedCourse.code)
      .eq('subject_name', selectedCourse.subject);
    if (profile.role === 'student') query = query.eq('branch', profile.branch);
    query.order('experiment_number', { ascending: true }).then(({ data, error }) => {
        if (!mounted) return;
        setExperiments(data || []);
        setWorkError(error?.message || '');
      });
    return () => { mounted = false; };
  }, [session?.user?.id, profile?.id, yearData.number, semesterNumber, selectedCourse.code, selectedCourse.subject]);

  React.useEffect(() => {
    if (!supabase || !session || !profile) {
      setScheduleEntries([]);
      return undefined;
    }
    let mounted = true;
    let query = supabase.from('labmate_experiments')
      .select('id,branch,academic_year,semester,course_code,lab_course,subject_name,elective_name,experiment_number,title,scheduled_on,notes')
      .eq('academic_year', yearData.number)
      .not('scheduled_on', 'is', null)
      .order('scheduled_on', { ascending: true });
    if (profile.role === 'student') query = query.eq('branch', profile.branch);
    query.then(({ data, error }) => {
      if (!mounted) return;
      setScheduleEntries(data || []);
      if (error) setProgressError(error.message);
    });
    return () => { mounted = false; };
  }, [session?.user?.id, profile?.id, profile?.branch, profile?.role, yearData.number]);

  React.useEffect(() => {
    if (!supabase || !session || !profile || !['progress', 'experiments'].includes(activePage) || !selectedExperimentIds) {
      setPracticalRecords([]);
      return undefined;
    }
    let mounted = true;
    supabase.from('labmate_practical_records')
      .select('id,student_id,experiment_id,attendance_status,attendance_date,completion_status,marked_by,updated_at')
      .in('experiment_id', selectedExperimentIds.split(','))
      .order('updated_at', { ascending: false })
      .then(({ data, error }) => {
        if (!mounted) return;
        setPracticalRecords(data || []);
        setProgressError(error?.message || '');
      });
    return () => { mounted = false; };
  }, [session?.user?.id, profile?.id, activePage, selectedExperimentIds]);

  React.useEffect(() => {
    if (!supabase || !session || !profile || activePage !== 'experiments' || !selectedExperimentIds) {
      setPracticalEvidence([]);
      return undefined;
    }
    let mounted = true;
    supabase.from('labmate_practical_evidence')
      .select('id,student_id,experiment_id,original_name,storage_path,content_type,file_size,created_at')
      .in('experiment_id', selectedExperimentIds.split(','))
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!mounted) return;
        setPracticalEvidence(data || []);
        if (error) setProgressError(error.message);
      });
    return () => { mounted = false; };
  }, [session?.user?.id, profile?.id, activePage, selectedExperimentIds]);

  React.useEffect(() => {
    if (!supabase || !session?.user?.id || !profile) {
      setChatSessions([]);
      setActiveChatId('');
      setChatMessages([]);
      return undefined;
    }
    let mounted = true;
    supabase.from('labmate_chat_sessions').select('id,title,created_at,updated_at')
      .order('updated_at', { ascending: false }).then(({ data, error }) => {
        if (!mounted) return;
        setChatSessions(data || []);
        if (error) setChatError(error.message);
      });
    return () => { mounted = false; };
  }, [session?.user?.id, profile?.id]);

  React.useEffect(() => {
    if (!supabase || !activeChatId || activePage !== 'chat') return undefined;
    let mounted = true;
    supabase.from('labmate_chat_messages').select('id,role,content,attachment_name,created_at')
      .eq('session_id', activeChatId).order('created_at', { ascending: true }).then(({ data, error }) => {
        if (!mounted) return;
        setChatMessages(data || []);
        if (error) setChatError(error.message);
      });
    return () => { mounted = false; };
  }, [activeChatId, activePage]);

  React.useEffect(() => {
    if (activePage !== 'chat') return undefined;
    let mounted = true;
    fetch('/api/chat').then(response => response.json()).then(result => {
      if (mounted) setChatConfigured(Boolean(result.configured));
    }).catch(() => { if (mounted) setChatConfigured(false); });
    return () => { mounted = false; };
  }, [activePage]);

  React.useEffect(() => {
    if (!supabase || !session || !profile || activePage !== 'progress' || !canManage) {
      setStudentRoster([]);
      return undefined;
    }
    let mounted = true;
    supabase.rpc('labmate_student_roster', {
      p_branch: profile.branch || 'ENTC',
      p_year: yearData.number,
    }).then(({ data, error }) => {
      if (!mounted) return;
      setStudentRoster(data || []);
      setProgressError(error?.message || '');
    });
    return () => { mounted = false; };
  }, [session?.user?.id, profile?.id, profile?.branch, activePage, canManage, yearData.number]);

  React.useEffect(() => {
    if (!supabase || !session || !profile) {
      setSharedFiles([]);
      return undefined;
    }
    let mounted = true;
    let query = supabase.from('labmate_files')
      .select('id,experiment_id,original_name,storage_path,content_type,file_size,uploaded_by,created_at')
      .eq('academic_year', yearData.number)
      .eq('semester', semesterNumber)
      .eq('course_code', selectedCourse.code)
      .eq('subject_name', selectedCourse.subject);
    if (profile.role === 'student') query = query.eq('branch', profile.branch);
    query.order('created_at', { ascending: false }).then(({ data, error }) => {
        if (!mounted) return;
        setSharedFiles(data || []);
        if (error) setWorkError(error.message);
      });
    return () => { mounted = false; };
  }, [session?.user?.id, profile?.id, yearData.number, semesterNumber, selectedCourse.code]);

  const chooseYear = nextYear => {
    if (profile?.role === 'student' && years[nextYear].number !== profile.academic_year) return;
    setYear(nextYear);
    const firstAssignment = ['faculty', 'assistant_professor'].includes(profile?.role)
      ? facultySubjects.find(subject => subject.academic_year === years[nextYear].number)
      : null;
    const firstSemester = firstAssignment
      ? Object.keys(years[nextYear].semesters).find(item => semesterIndex[item.split(' ').at(-1)] === firstAssignment.semester)
      : Object.keys(years[nextYear].semesters)[0];
    if (!firstSemester) return;
    setSemester(firstSemester);
    const firstCourse = firstAssignment
      ? years[nextYear].semesters[firstSemester].find(course => course.code === firstAssignment.course_code && course.subject === firstAssignment.subject_name)
      : years[nextYear].semesters[firstSemester][0];
    if (firstCourse) setSelectedKey(`${firstCourse.code}::${firstCourse.subject}`);
  };
  const chooseSemester = nextSemester => {
    setSemester(nextSemester);
    const firstAssignment = ['faculty', 'assistant_professor'].includes(profile?.role)
      ? facultySubjects.find(subject => subject.academic_year === yearData.number && subject.semester === semesterIndex[nextSemester.split(' ').at(-1)])
      : null;
    if (['faculty', 'assistant_professor'].includes(profile?.role) && !firstAssignment) return;
    const firstCourse = firstAssignment
      ? yearData.semesters[nextSemester].find(course => course.code === firstAssignment.course_code && course.subject === firstAssignment.subject_name)
      : yearData.semesters[nextSemester][0];
    if (firstCourse) setSelectedKey(`${firstCourse.code}::${firstCourse.subject}`);
  };

  const addExperiment = async event => {
    event.preventDefault();
    if (!supabase || !session?.user?.id || !canManage || !experimentDraft.title.trim()) return;
    setSaving(true);
    setWorkError('');
    setWorkMessage('');
    const experimentNumber = (experiments.at(-1)?.experiment_number || 0) + 1;
    const { data, error } = await supabase.from('labmate_experiments').insert({
      branch: profile.branch || 'ENTC',
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

  const savePracticalCompletion = async (experiment, checked) => {
    if (!supabase || !session?.user?.id || !profile || profile.role !== 'student') return;
    setProgressBusy(true);
    setProgressError('');
    setProgressMessage('');
    const existing = practicalRecords.find(item => item.experiment_id === experiment.id && item.student_id === session.user.id);
    const result = existing
      ? await supabase.from('labmate_practical_records')
        .update({ completion_status: checked ? 'completed' : 'not_started', updated_at: new Date().toISOString() })
        .eq('id', existing.id).select('*').single()
      : await supabase.from('labmate_practical_records').insert({
        student_id: session.user.id,
        experiment_id: experiment.id,
        completion_status: checked ? 'completed' : 'not_started',
      }).select('*').single();
    if (result.error) setProgressError(result.error.message);
    else {
      setPracticalRecords(current => current.some(item => item.id === result.data.id)
        ? current.map(item => item.id === result.data.id ? result.data : item)
        : [...current, result.data]);
      setProgressMessage(checked ? 'Experiment marked complete.' : 'Experiment marked incomplete.');
    }
    setProgressBusy(false);
  };

  const saveAttendance = async (student, experiment, status) => {
    if (!supabase || !session?.user?.id || !canManage) return;
    setProgressBusy(true);
    setProgressError('');
    setProgressMessage('');
    const existing = practicalRecords.find(item => item.experiment_id === experiment.id && item.student_id === student.id);
    const attendanceDate = todayKey;
    const values = {
      attendance_status: status,
      attendance_date: attendanceDate,
      marked_by: session.user.id,
      updated_at: new Date().toISOString(),
    };
    const result = existing
      ? await supabase.from('labmate_practical_records').update(values).eq('id', existing.id).select('*').single()
      : await supabase.from('labmate_practical_records').insert({
        student_id: student.id,
        experiment_id: experiment.id,
        ...values,
      }).select('*').single();
    if (result.error) setProgressError(result.error.message);
    else {
      setPracticalRecords(current => current.some(item => item.id === result.data.id)
        ? current.map(item => item.id === result.data.id ? result.data : item)
        : [...current, result.data]);
      setProgressMessage(`Attendance saved for ${student.full_name}.`);
    }
    setProgressBusy(false);
  };

  const uploadPracticalEvidence = async (experiment, event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length || !supabase || !session?.user?.id || profile?.role !== 'student') return;
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
    setEvidenceBusy(experiment.id);
    setProgressError('');
    setProgressMessage('');
    let uploadedCount = 0;
    for (const file of files) {
      if (file.size > 50 * 1024 * 1024) {
        setProgressError(`${file.name} is over the 50 MB upload limit.`);
        break;
      }
      const extension = file.name.split('.').pop()?.toLowerCase();
      const contentType = contentTypes[extension] || file.type;
      if (!Object.values(contentTypes).includes(contentType)) {
        setProgressError(`${file.name} is not a supported file type. Choose PDF, Office, text, ZIP, PNG, or JPEG.`);
        break;
      }
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `${session.user.id}/${experiment.id}/${crypto.randomUUID()}-${safeName}`;
      const { error: storageError } = await supabase.storage.from('labmate-evidence').upload(storagePath, file, { contentType, upsert: false });
      if (storageError) {
        setProgressError(storageError.message);
        break;
      }
      const { data, error } = await supabase.from('labmate_practical_evidence').insert({
        student_id: session.user.id,
        experiment_id: experiment.id,
        original_name: file.name,
        storage_path: storagePath,
        content_type: contentType,
        file_size: file.size,
      }).select('id,student_id,experiment_id,original_name,storage_path,content_type,file_size,created_at').single();
      if (error) {
        await supabase.storage.from('labmate-evidence').remove([storagePath]);
        setProgressError(error.message);
        break;
      }
      setPracticalEvidence(current => [data, ...current]);
      uploadedCount += 1;
    }
    if (uploadedCount > 0) setProgressMessage(`${uploadedCount} evidence file${uploadedCount === 1 ? '' : 's'} uploaded.`);
    setEvidenceBusy('');
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
    const storagePath = `${session.user.id}/${profile.branch || 'ENTC'}/${yearData.number}/${semesterNumber}/${selectedCourse.code}/${safeSubject}/${crypto.randomUUID()}-${safeName}`;
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
      branch: profile.branch || 'ENTC',
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

  const openPracticalEvidence = async file => {
    const { data, error } = await supabase.storage.from('labmate-evidence').createSignedUrl(file.storage_path, 3600);
    if (error) setProgressError(error.message);
    else window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
  };

  const deleteSharedFile = async file => {
    if (!supabase || !canManage) return;
    setSaving(true);
    setWorkError('');
    setWorkMessage('');
    const { error: storageError } = await supabase.storage.from('labmate-materials').remove([file.storage_path]);
    if (storageError) {
      setWorkError(storageError.message);
      setSaving(false);
      return;
    }
    const { error } = await supabase.from('labmate_files').delete().eq('id', file.id);
    if (error) setWorkError(error.message);
    else {
      setSharedFiles(current => current.filter(item => item.id !== file.id));
      setWorkMessage('Shared file deleted.');
    }
    setSaving(false);
  };

  const saveTeacherAssignments = async () => {
    if (!supabase || !profile || !['faculty', 'assistant_professor'].includes(profile.role)) return;
    setSettingsError('');
    setSettingsMessage('');
    setSaving(true);
    const currentKeys = new Set(facultySubjects.map(row => `${row.academic_year}::${row.semester}::${row.course_code}::${row.subject_name}`));
    const nextKeys = new Set(assignmentDraft);
    const newRows = assignmentDraft.filter(key => !currentKeys.has(key)).map(key => {
      const [academic_year, semester, course_code, ...subject] = key.split('::');
      return { faculty_id: profile.id, branch: 'ENTC', academic_year: Number(academic_year), semester: Number(semester), course_code, subject_name: subject.join('::') };
    });
    if (newRows.length) {
      const { error } = await supabase.from('labmate_faculty_subjects').insert(newRows);
      if (error) {
        setSettingsError(error.message);
        setSaving(false);
        return;
      }
    }
    const removed = facultySubjects.filter(row => !nextKeys.has(`${row.academic_year}::${row.semester}::${row.course_code}::${row.subject_name}`));
    if (removed.length) {
      const { error } = await supabase.from('labmate_faculty_subjects').delete().in('id', removed.map(row => row.id));
      if (error) {
        setSettingsError(error.message);
        setSaving(false);
        return;
      }
    }
    const { data, error } = await supabase.from('labmate_faculty_subjects').select('id,branch,academic_year,semester,course_code,subject_name').eq('faculty_id', profile.id);
    if (error) setSettingsError(error.message);
    else {
      setFacultySubjects(data || []);
      setAssignmentDraft((data || []).map(row => `${row.academic_year}::${row.semester}::${row.course_code}::${row.subject_name}`));
      setSettingsMessage('Your lab assignments are saved.');
    }
    setSaving(false);
  };

  const createChatSession = async () => {
    if (!supabase || !profile) return null;
    const { data, error } = await supabase.from('labmate_chat_sessions').insert({ user_id: profile.id, title: 'New chat' }).select('id,title,created_at,updated_at').single();
    if (error) {
      setChatError(error.message);
      return null;
    }
    setChatSessions(current => [data, ...current]);
    setActiveChatId(data.id);
    setChatMessages([]);
    return data;
  };

  const openChatSession = async id => {
    setChatError('');
    setActiveChatId(id);
  };

  const deleteChatSession = async id => {
    if (!supabase) return;
    const { error } = await supabase.from('labmate_chat_sessions').delete().eq('id', id);
    if (error) setChatError(error.message);
    else {
      const rest = chatSessions.filter(item => item.id !== id);
      setChatSessions(rest);
      if (activeChatId === id) {
        setActiveChatId(rest[0]?.id || '');
        setChatMessages([]);
      }
    }
  };

  const sendChatMessage = async event => {
    event.preventDefault();
    const text = chatPrompt.trim();
    if ((!text && !chatFile) || !supabase || !session?.access_token || chatBusy) return;
    const fileType = chatFile?.type || '';
    const allowedType = /^(image\/(png|jpeg|webp)|application\/pdf|audio\/(mpeg|mp4|wav|webm|ogg|aac|flac)|video\/(mp4|webm|quicktime|mpeg))$/.test(fileType);
    if (chatFile && !allowedType) {
      setChatError('Use a PDF, common image, audio, or video file.');
      return;
    }
    setChatBusy(true);
    setChatError('');
    setChatMessage('');
    let targetId = activeChatId;
    if (!targetId) {
      const created = await createChatSession();
      targetId = created?.id;
    }
    if (!targetId) { setChatBusy(false); return; }
    let attachment = null;
    if (chatFile) {
      if (chatFile.size > 2.5 * 1024 * 1024) {
        setChatError('For multimodal chat, choose a file under 2.5 MB. This keeps requests within the free hosting limit.');
        setChatBusy(false);
        return;
      }
      attachment = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(',')[1]);
        reader.onerror = () => reject(new Error('Could not read that file.'));
        reader.readAsDataURL(chatFile);
      }).catch(error => { setChatError(error.message); return null; });
      if (!attachment) { setChatBusy(false); return; }
    }
    const messageText = text || `Please analyze the attached file: ${chatFile.name}`;
    const { data: userMessage, error: saveUserError } = await supabase.from('labmate_chat_messages').insert({
      session_id: targetId, user_id: profile.id, role: 'user', content: messageText, attachment_name: chatFile?.name || null,
    }).select('id,role,content,attachment_name,created_at').single();
    if (saveUserError) {
      setChatError(saveUserError.message);
      setChatBusy(false);
      return;
    }
    setChatMessages(current => [...current, userMessage]);
    const title = text.slice(0, 64) || (chatFile?.name || 'Study chat').slice(0, 64);
    const selectedSession = chatSessions.find(item => item.id === targetId);
    if (!selectedSession || selectedSession.title === 'New chat') {
      await supabase.from('labmate_chat_sessions').update({ title, updated_at: new Date().toISOString() }).eq('id', targetId);
      setChatSessions(current => current.map(item => item.id === targetId ? { ...item, title, updated_at: new Date().toISOString() } : item));
    }
    const history = [...chatMessages, userMessage].slice(-12).map(item => ({ role: item.role, parts: [{ text: item.content }] }));
    if (chatFile) history[history.length - 1].parts.push({ inlineData: { mimeType: fileType, data: attachment } });
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ contents: history }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'The study assistant could not answer right now.');
      const { data: modelMessage, error: saveModelError } = await supabase.from('labmate_chat_messages').insert({
        session_id: targetId, user_id: profile.id, role: 'model', content: result.text,
      }).select('id,role,content,attachment_name,created_at').single();
      if (saveModelError) throw saveModelError;
      setChatMessages(current => [...current, modelMessage]);
      setChatSessions(current => current.map(item => item.id === targetId ? { ...item, updated_at: new Date().toISOString() } : item).sort((a, b) => b.updated_at.localeCompare(a.updated_at)));
      setChatPrompt('');
      setChatFile(null);
      setChatMessage('Reply saved to this chat.');
    } catch (error) {
      setChatError(error.message || 'The study assistant could not answer right now.');
    } finally {
      setChatBusy(false);
    }
  };

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut();
  };

  if (!authInitialized || profileLoading) return <div className="account-state"><div className="account-state-card"><span className="brand-mark"><SparkleMark /></span><p>Loading your LabMate account…</p></div></div>;
  if (session && (!profile || !['active', 'approved'].includes(profile.account_status))) return <div className="account-state"><div className="account-state-card">
    <span className="brand-mark"><SparkleMark /></span>
    <div className="section-kicker">LABMATE ACCOUNT</div>
    <h1>{profileError ? 'Account setup problem' : profile?.account_status === 'rejected' ? 'Request not approved' : profile?.role === 'student' ? 'Confirm your email' : 'Waiting for admin approval'}</h1>
    <p>{profileError ? 'We could not load your account details. Please try signing in again.' : profile?.account_status === 'rejected' ? 'Your access request was declined. Please contact your college admin for help.' : profile?.role === 'student' ? 'Confirm your email address, then sign in to open your workspace.' : 'Your email is verified. An admin must approve faculty access before the workspace opens.'}</p>
    {profileError && <p className="account-error">{profileError}</p>}
    <button className="auth-submit" onClick={handleSignOut}>Sign out</button>
  </div></div>;

  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#dashboard" aria-label="LabMate home"><span className="brand-mark"><SparkleMark /></span><span>labmate<span className="brand-period">.</span></span></a>
      <div className="workspace-label">YOUR COLLEGE</div>
      <div className="college-select"><span className="college-avatar">E</span><span><b>Electronics &amp; Telecommunication</b><small>SPPU · academic workspace</small></span></div>
      <nav className="nav-list" aria-label="Main navigation">
        <a className={activePage === 'dashboard' ? 'nav-item active' : 'nav-item'} href="#dashboard"><Icon name="grid" /><span className="nav-label">Dashboard</span></a>
        <a className={activePage === 'labs' ? 'nav-item active' : 'nav-item'} href="#labs"><Icon name="flask" /><span className="nav-label">Labs</span></a>
        <a className={activePage === 'experiments' ? 'nav-item active' : 'nav-item'} href="#experiments"><Icon name="book" /><span className="nav-label">Experiments</span></a>
        <a className={activePage === 'timetable' ? 'nav-item active' : 'nav-item'} href="#timetable"><Icon name="calendar" /><span className="nav-label">Timetable</span></a>
        <a className={activePage === 'progress' ? 'nav-item active' : 'nav-item'} href="#progress"><Icon name="check" /><span className="nav-label">Attendance</span></a>
        <a className={activePage === 'materials' ? 'nav-item active' : 'nav-item'} href="#materials"><Icon name="file" /><span className="nav-label">Materials</span></a>
        {profile && <a className={activePage === 'chat' ? 'nav-item active' : 'nav-item'} href="#chat"><Icon name="chat" /><span className="nav-label">Study assistant</span></a>}
        {profile && <a className={activePage === 'profile' ? 'nav-item active' : 'nav-item'} href="#profile"><Icon name="people" /><span className="nav-label">Profile</span></a>}
        {profile && <a className={activePage === 'settings' ? 'nav-item active' : 'nav-item'} href="#settings"><Icon name="settings" /><span className="nav-label">Settings</span></a>}
      </nav>
      <div className="sidebar-note"><span className="note-mark" />Only syllabus lab and practical courses appear here.</div>
      <div className="sidebar-bottom"><span className="year-label">ACADEMIC YEARS</span><div className="year-list">{visibleYears.map(item => <button key={item} onClick={() => chooseYear(item)} className={year === item ? 'year-link current' : 'year-link'}>{item}<span>{Object.keys(years[item].semesters).length}</span></button>)}</div><div className="profile"><div className="profile-avatar">{workspaceRole === 'Faculty' ? 'FC' : workspaceRole === 'Admin' ? 'AD' : profile ? 'ST' : '—'}</div><span><b>{profile?.full_name || 'Not signed in'}</b><small>{profile ? workspaceRole : 'Sign in for files and schedules'}</small></span></div></div>
    </aside>

    <main className="main-content">
      <header className="topbar">
        <div className="breadcrumbs">LabMate <span>/</span> {pageTitle}</div>
        <div className="topbar-actions">
          {profile ? <><span className="signed-in-name">{profile.full_name}<small>{workspaceRole}</small></span><button className="quiet-button" onClick={handleSignOut}>Sign out</button></> : <><button className="quiet-button" onClick={() => { setAuthMode('signin'); setAuthOpen(true); }}>Sign in</button><button className="auth-top-button" onClick={() => { setAuthMode('signup'); setAuthOpen(true); }}>Create account</button></>}
        </div>
      </header>

      {activePage === 'dashboard' && <>
        <section className="page-heading dashboard-heading">
          <div><div className="eyebrow">SPPU E&amp;TC <span>·</span> LABMATE</div><h1>Dashboard<span className="heading-period">.</span></h1><p>{profile ? 'Welcome, ' + profile.full_name + '. Pick up where you left off.' : 'Your labs, experiments, and shared course materials in one place.'}</p></div>
          <div className="year-switch" role="group" aria-label="Choose academic year">{visibleYears.map(item => <button key={item} onClick={() => chooseYear(item)} className={year === item ? 'selected' : ''}>{item}</button>)}</div>
        </section>
        <div className="dashboard-context"><span className="section-kicker">CURRENT VIEW</span><b>{year} · {semester}</b><div className="semester-switch" role="group" aria-label="Choose semester">{semesters.map(item => <button key={item} onClick={() => chooseSemester(item)} className={semester === item ? 'selected' : ''}>{item}</button>)}</div></div>
        <section className="metrics-grid" aria-label="Semester overview">
          <article className="metric-card"><div className="metric-top"><span>LAB COURSES</span><Icon name="flask" size={17} /></div><div className="metric-value">{courses.length}<span className="metric-unit"> in {semester}</span></div><div className="metric-foot">For {year}</div></article>
          <article className="metric-card"><div className="metric-top"><span>EXPERIMENTS</span><Icon name="book" size={17} /></div><div className="metric-value">{profile ? experiments.length : '—'}<span className="metric-unit"> {profile ? 'listed' : 'sign in'}</span></div><div className="metric-foot">For the selected lab</div></article>
          <article className="metric-card"><div className="metric-top"><span>SHARED FILES</span><Icon name="file" size={17} /></div><div className="metric-value">{profile ? sharedFiles.length : '—'}<span className="metric-unit"> {profile ? 'files' : 'sign in'}</span></div><div className="metric-foot">For the selected lab</div></article>
        </section>
        <section className="dashboard-section reminder-section">
          <div className="section-heading"><div><div className="section-kicker">COMING UP</div><h2>Practical reminders</h2><p>Dates set by faculty for your year.</p></div><a className="quiet-button" href="#timetable">Full timetable</a></div>
          {!profile && <p className="empty-list">Sign in to see your practical dates.</p>}
          {profile && upcomingSchedule.length === 0 && <p className="empty-list">No future practical dates are scheduled yet.</p>}
          {profile && upcomingSchedule.length > 0 && <ul className="reminder-list">{upcomingSchedule.slice(0, 3).map(item => {
            const remaining = daysUntil(item.scheduled_on);
            return <li key={item.id}><span className="reminder-date">{new Date(`${item.scheduled_on}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span><span className="reminder-copy"><b>{item.title}</b><small>{item.subject_name} · {item.lab_course}</small></span><span className={remaining <= 3 ? 'reminder-count soon' : 'reminder-count'}>{remaining === 0 ? 'Today' : remaining === 1 ? 'Tomorrow' : `In ${remaining} days`}</span></li>;
          })}</ul>}
        </section>
        <section className="dashboard-section">
          <div className="section-heading"><div><div className="section-kicker">QUICK ACCESS</div><h2>Go to a feature</h2><p>Each area has its own page.</p></div></div>
          <div className="dashboard-links">
            <a className="dashboard-link" href="#labs"><span className="dashboard-link-icon"><Icon name="flask" size={18} /></span><span><b>Labs</b><small>Browse courses and choose a lab</small></span><Icon name="arrow" size={16} /></a>
            <a className="dashboard-link" href="#experiments"><span className="dashboard-link-icon"><Icon name="book" size={18} /></span><span><b>Experiments</b><small>View schedules and experiment details</small></span><Icon name="arrow" size={16} /></a>
            <a className="dashboard-link" href="#timetable"><span className="dashboard-link-icon"><Icon name="calendar" size={18} /></span><span><b>Timetable</b><small>Upcoming practical dates and reminders</small></span><Icon name="arrow" size={16} /></a>
            {profile && <a className="dashboard-link" href="#progress"><span className="dashboard-link-icon"><Icon name="check" size={18} /></span><span><b>Attendance</b><small>View or record in-person lab attendance</small></span><Icon name="arrow" size={16} /></a>}
            <a className="dashboard-link" href="#materials"><span className="dashboard-link-icon"><Icon name="file" size={18} /></span><span><b>Materials</b><small>Open files shared by lab teachers</small></span><Icon name="arrow" size={16} /></a>
            {profile && <a className="dashboard-link" href="#chat"><span className="dashboard-link-icon"><Icon name="chat" size={18} /></span><span><b>Study assistant</b><small>Ask questions about lab work and study files</small></span><Icon name="arrow" size={16} /></a>}
            {profile && <a className="dashboard-link" href="#profile"><span className="dashboard-link-icon"><Icon name="people" size={18} /></span><span><b>Profile</b><small>View your account details</small></span><Icon name="arrow" size={16} /></a>}
            {profile && <a className="dashboard-link" href="#settings"><span className="dashboard-link-icon"><Icon name="settings" size={18} /></span><span><b>Settings</b><small>Personal preferences and lab assignments</small></span><Icon name="arrow" size={16} /></a>}
          </div>
        </section>
        {profile?.role === 'admin' && <ApprovalPanel client={supabase} />}
      </>}

      {activePage === 'labs' && <>
        <section className="page-heading">
          <div><div className="eyebrow">SPPU E&amp;TC <span>·</span> CURRICULUM</div><h1>Labs<span className="heading-period">.</span></h1><p>Choose an academic year, semester, and lab course.</p></div>
          <div className="year-switch" role="group" aria-label="Choose academic year">{visibleYears.map(item => <button key={item} onClick={() => chooseYear(item)} className={year === item ? 'selected' : ''}>{item}</button>)}</div>
        </section>
        <div className="section-heading"><div><div className="section-kicker">LAB COURSES</div><h2>{year} · {semester}</h2><p>Select a lab to view its experiments or materials.</p></div><a className="curriculum-tag" href={yearData.source} target="_blank" rel="noreferrer">{yearData.pattern} · source ↗</a></div>
        <div className="semester-switch" role="group" aria-label="Choose semester">{semesters.map(item => <button key={item} onClick={() => chooseSemester(item)} className={semester === item ? 'selected' : ''}>{item}</button>)}</div>
        {yearData.note && <p className="curriculum-note">{yearData.note}</p>}
        <section className="subject-panel labs-panel" aria-label="Lab course list">
          <div className="panel-topline"><span>LAB COURSE · SUBJECT</span><span>CODE</span></div>
        <div className="subject-list">{courses.map(course => {
            const key = course.code + '::' + course.subject;
            return <button key={key} onClick={() => { setSelectedKey(key); window.location.hash = 'experiments'; }} className={selectedCourse.code === course.code && selectedCourse.subject === course.subject ? 'subject-row selected' : 'subject-row'} aria-label={`Open ${course.subject} experiments`}>
              <span className="subject-name"><b>{course.subject}{course.elective ? ` (${course.elective})` : ''}</b></span><span className="subject-code">{course.code}</span><Icon name="arrow" size={15} />
            </button>;
          })}</div>
          <div className="subject-footer"><span className="check-icon"><Icon name="check" size={14} /></span>{courses.length} lab sections in this semester</div>
        </section>
        <div className="labs-next-actions"><span>Selected subject: <b>{selectedCourse.subject}{selectedCourse.elective ? ` (${selectedCourse.elective})` : ''}</b></span><a className="quiet-button" href="#materials">View materials</a></div>
      </>}

      {activePage === 'experiments' && <>
        <section className="page-heading">
          <div><div className="eyebrow">LABMATE <span>·</span> COURSE WORK</div><h1>Experiments<span className="heading-period">.</span></h1><p>Review experiment details and dates for the selected lab.</p></div>
        </section>
        <div className="course-context"><div><span className="section-kicker">SELECTED SUBJECT</span><b>{selectedCourse.subject}{selectedCourse.elective ? ` (${selectedCourse.elective})` : ''}</b><small>{selectedCourse.code} · {year} · {semester}</small></div><a className="quiet-button" href="#labs">Change lab</a></div>
        <section className="detail-panel page-detail-panel">
          <section className="experiment-section">
            <div className="material-heading"><div><div className="section-kicker">SCHEDULE</div><h2>Experiments &amp; schedule</h2></div><a className="syllabus-link" href={yearData.source} target="_blank" rel="noreferrer">Syllabus ↗</a></div>
            {!profile && <p className="empty-list">Sign in to view this experiment schedule.</p>}
            {profile && workError && <p className="form-message error" role="alert">{workError}</p>}
            {profile && workMessage && <p className="form-message success" role="status">{workMessage}</p>}
            {profile && experiments.length === 0 && <p className="empty-list">No experiments have been entered for this lab yet.</p>}
            {profile && experiments.length > 0 && <ol className="experiment-list">{experiments.map(experiment => <li key={experiment.id}>
              {editingExperiment?.id === experiment.id ? <form className="experiment-form" onSubmit={saveExperiment}>
                <label>Experiment name<input value={editingExperiment.title} onChange={event => setEditingExperiment(current => ({ ...current, title: event.target.value }))} required maxLength="500" /></label>
                <label>Scheduled date<input type="date" value={editingExperiment.scheduled_on || ''} onChange={event => setEditingExperiment(current => ({ ...current, scheduled_on: event.target.value }))} /></label>
                <label>Notes<textarea value={editingExperiment.notes || ''} onChange={event => setEditingExperiment(current => ({ ...current, notes: event.target.value }))} rows="2" /></label>
                <div className="form-actions"><button className="upload-button" disabled={saving}>Save changes</button><button type="button" className="quiet-button" onClick={() => setEditingExperiment(null)}>Cancel</button></div>
              </form> : <div className="experiment-item"><div><b>Experiment {experiment.experiment_number} · {experiment.title}</b><small>{experiment.scheduled_on ? 'Scheduled ' + new Date(experiment.scheduled_on + 'T12:00:00').toLocaleDateString() : 'Date not set'}{experiment.notes ? ' · ' + experiment.notes : ''}</small></div>{profile?.role === 'student' && <label className="experiment-check"><input type="checkbox" checked={practicalRecords.some(item => item.experiment_id === experiment.id && item.student_id === session?.user?.id && item.completion_status === 'completed')} onChange={event => savePracticalCompletion(experiment, event.target.checked)} disabled={progressBusy} /><span>Completed</span></label>}{canManage && <button className="quiet-button" onClick={() => setEditingExperiment({ id: experiment.id, title: experiment.title, scheduled_on: experiment.scheduled_on || '', notes: experiment.notes || '' })}>Edit</button>}</div>}
              {profile?.role === 'student' && <div className="experiment-evidence">
                <p>Attach your practical file or output screenshot for this experiment.</p>
                <input className="evidence-input" type="file" multiple accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.png,.jpg,.jpeg" aria-label={`Upload practical evidence for ${experiment.title}`} onChange={event => uploadPracticalEvidence(experiment, event)} disabled={evidenceBusy === experiment.id} />
                {evidenceBusy === experiment.id && <small className="evidence-hint">Uploading…</small>}
                {practicalEvidence.filter(item => item.experiment_id === experiment.id && item.student_id === session?.user?.id).map(file => <span className="experiment-file" key={file.id}>{file.original_name} <button className="file-access" onClick={() => openPracticalEvidence(file)}>Open ↗</button></span>)}
              </div>}
            </li>)}</ol>}
            {profile && canManage && <form className="experiment-form add-experiment-form" onSubmit={addExperiment}>
              <h3>Add an experiment</h3>
              <label>Experiment name<input value={experimentDraft.title} onChange={event => setExperimentDraft(current => ({ ...current, title: event.target.value }))} placeholder="Enter the syllabus experiment" required maxLength="500" /></label>
              <div className="form-row"><label>Scheduled date<input type="date" value={experimentDraft.scheduled_on} onChange={event => setExperimentDraft(current => ({ ...current, scheduled_on: event.target.value }))} /></label><label>Notes<input value={experimentDraft.notes} onChange={event => setExperimentDraft(current => ({ ...current, notes: event.target.value }))} placeholder="Optional" maxLength="1000" /></label></div>
              <button className="upload-button" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Add experiment'}</button>
            </form>}
          </section>
        </section>
      </>}

      {activePage === 'timetable' && <>
        <section className="page-heading">
          <div><div className="eyebrow">LABMATE <span>·</span> SCHEDULE</div><h1>Timetable<span className="heading-period">.</span></h1><p>Upcoming practical dates set by your faculty.</p></div>
          <a className="quiet-button" href="#labs">Browse labs</a>
        </section>
        <section className="schedule-panel">
          <div className="schedule-panel-heading"><div><div className="section-kicker">{year.toUpperCase()} · SPPU E&amp;TC</div><h2>Upcoming practicals</h2></div><span>{upcomingSchedule.length} scheduled</span></div>
          {!profile && <p className="empty-list">Sign in to see timetable dates for your branch and year.</p>}
          {profile && upcomingSchedule.length === 0 && <p className="empty-list">Nothing scheduled yet. Faculty dates will appear here when they add them to an experiment.</p>}
          {profile && upcomingSchedule.length > 0 && <ol className="schedule-list">{upcomingSchedule.map(item => {
            const remaining = daysUntil(item.scheduled_on);
            const semesterLabel = ({ 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII', 8: 'VIII' })[item.semester] || item.semester;
            return <li key={item.id}>
              <div className="schedule-date"><b>{new Date(`${item.scheduled_on}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric' })}</b><span>{new Date(`${item.scheduled_on}T12:00:00`).toLocaleDateString('en-IN', { month: 'short' })}</span></div>
              <div className="schedule-details"><span className="section-kicker">{item.course_code} · SEMESTER {semesterLabel}</span><h3>{item.title}</h3><p>{item.subject_name} <span>·</span> {item.lab_course}</p>{item.notes && <small>{item.notes}</small>}</div>
              <span className={remaining <= 3 ? 'reminder-count soon' : 'reminder-count'}>{remaining === 0 ? 'Today' : remaining === 1 ? 'Tomorrow' : `In ${remaining} days`}</span>
            </li>;
          })}</ol>}
        </section>
        <p className="schedule-footnote">The timetable updates when faculty add or edit an experiment date. Check here for upcoming practical reminders.</p>
      </>}

      {activePage === 'progress' && <>
        <section className="page-heading">
          <div><div className="eyebrow">LABMATE <span>·</span> SUBJECT TRACKING</div><h1>Attendance<span className="heading-period">.</span></h1><p>{canManage ? 'Record attendance in the lab using each student’s name and roll number.' : 'View attendance recorded by your faculty for each practical.'}</p></div>
        </section>
        <div className="course-context"><div><span className="section-kicker">SELECT SUBJECT</span><select className="progress-subject-select" aria-label="Choose subject for attendance" value={selectedKey} onChange={event => setSelectedKey(event.target.value)}>{courses.map(course => <option key={`${course.code}::${course.subject}`} value={`${course.code}::${course.subject}`}>{course.subject}{course.elective ? ` (${course.elective})` : ''}</option>)}</select><small>{year} · {semester}</small></div><a className="quiet-button" href="#labs">Browse labs</a></div>
        {profile && progressError && <p className="form-message error" role="alert">{progressError}</p>}
        {profile && progressMessage && <p className="form-message success" role="status">{progressMessage}</p>}
        {!profile && <p className="empty-list">Sign in to view subject attendance and practical progress.</p>}
        {profile && experiments.length === 0 && <p className="empty-list">No experiments are listed for this subject yet.</p>}
        {profile && experiments.length > 0 && <section className="progress-list" aria-label="Attendance for selected subject">
          <div className="progress-explainer">Attendance is recorded by approved faculty in person. Match the student’s name and college roll number and, when available, check their college ID before marking present. Students cannot edit attendance.</div>
          {experiments.map(experiment => {
            const ownRecord = practicalRecords.find(item => item.experiment_id === experiment.id && item.student_id === session?.user?.id);
            const attendanceName = { not_marked: 'Not marked', present: 'Present', absent: 'Absent', late: 'Late' };
            return <article className="progress-experiment" key={experiment.id}>
              <div className="progress-experiment-heading"><div><span className="section-kicker">EXPERIMENT {experiment.experiment_number}{experiment.scheduled_on ? ` · ${new Date(`${experiment.scheduled_on}T12:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : ''}</span><h2>{experiment.title}</h2></div>{!canManage && <span className="attendance-status">{attendanceName[ownRecord?.attendance_status || 'not_marked']}</span>}</div>
              {canManage && <div className="roster-list">
                {studentRoster.length === 0 && <p className="empty-list">No active students are registered in this year yet.</p>}
                {studentRoster.map(student => {
                  const record = practicalRecords.find(item => item.experiment_id === experiment.id && item.student_id === student.id);
                  return <div className="roster-row" key={student.id}>
                    <div className="roster-person"><b>{student.full_name}</b><small>College roll no. {student.roll_number}</small></div>
                    <select aria-label={`Attendance for ${student.full_name}, roll number ${student.roll_number}`} value={record?.attendance_status || 'not_marked'} onChange={event => saveAttendance(student, experiment, event.target.value)} disabled={progressBusy}>
                      <option value="not_marked">Mark attendance</option><option value="present">Present</option><option value="absent">Absent</option><option value="late">Late</option>
                    </select>
                  </div>;
                })}
              </div>}
            </article>;
          })}
        </section>}
      </>}

      {activePage === 'materials' && <>
        <section className="page-heading">
          <div><div className="eyebrow">LABMATE <span>·</span> COURSE WORK</div><h1>Materials<span className="heading-period">.</span></h1><p>Open files shared by faculty for your lab subjects.</p></div>
        </section>
        <div className="course-context"><div><span className="section-kicker">SUBJECT</span><select className="progress-subject-select" aria-label="Choose subject materials" value={selectedKey} onChange={event => setSelectedKey(event.target.value)}>{courses.map(course => <option key={`${course.code}::${course.subject}`} value={`${course.code}::${course.subject}`}>{course.subject}{course.elective ? ` (${course.elective})` : ''}</option>)}</select><small>{year} · {semester}</small></div><a className="quiet-button" href="#labs">Choose semester</a></div>
        <section className="detail-panel page-detail-panel">
          <section className="materials-section page-materials-section" aria-label="Shared course files">
            <div className="material-heading"><div><div className="section-kicker">COURSE LIBRARY</div><h2>Shared course files</h2></div>{canUpload && <button className="upload-button" onClick={() => uploadInput.current?.click()} disabled={saving}><Icon name="upload" size={15} />Upload file</button>}</div>
            <input ref={uploadInput} className="file-input" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.png,.jpg,.jpeg" onChange={handleUpload} aria-label="Upload course material" />
            <p className="upload-hint">{canUpload ? 'Teachers assigned to this subject can share course files (up to 50 MB).' : 'Only files shared by approved teachers appear here.'}</p>
            {profile && workError && <p className="form-message error" role="alert">{workError}</p>}
            {profile && workMessage && <p className="form-message success" role="status">{workMessage}</p>}
            {profile && sharedFiles.length === 0 && <p className="empty-list">No files have been shared for this lab yet.</p>}
            {profile && sharedFiles.length > 0 && <ul className="material-list">{sharedFiles.map(file => <li key={file.id}><span className="file-glyph"><Icon name="file" size={15} /></span><span className="file-name">{file.original_name}<small>{(file.file_size / (1024 * 1024)).toFixed(2)} MB · {new Date(file.created_at).toLocaleDateString()}</small></span><button className="file-access" onClick={() => openSharedFile(file)}>Open ↗</button>{canManage && <button className="file-delete" onClick={() => deleteSharedFile(file)} disabled={saving}>Delete</button>}</li>)}</ul>}
          </section>
        </section>
      </>}

      {activePage === 'profile' && <section className="profile-page">
        {profile ? <>
          <section className="page-heading"><div><div className="eyebrow">MY ACCOUNT <span>·</span> LABMATE</div><h1>Profile<span className="heading-period">.</span></h1><p>Your LabMate account details.</p></div></section>
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
                <div><dt>Branch</dt><dd>Electronics &amp; Telecommunication (E&amp;TC)</dd></div>
                <div><dt>College roll number</dt><dd>{profile.roll_number}</dd></div>
                <div><dt>Academic year</dt><dd>{profile.academic_year}{profile.academic_year === 2 ? 'nd' : profile.academic_year === 3 ? 'rd' : 'th'} year</dd></div>
              </>}
              {['faculty', 'assistant_professor'].includes(profile.role) && <>
                <div><dt>Branch</dt><dd>Electronics &amp; Telecommunication (E&amp;TC)</dd></div>
                <div><dt>Teaching subjects</dt><dd>{facultySubjects.length ? facultySubjects.map(item => `${item.subject_name}${item.elective_name ? ` (${item.elective_name})` : ''} · Year ${item.academic_year} · Semester ${semesterLabelForNumber(item.semester)}`).join('; ') : 'No lab subjects assigned yet'}</dd></div>
              </>}
              <div><dt>Member since</dt><dd>{profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' }) : '—'}</dd></div>
              <div><dt>Workspace</dt><dd>SPPU E&amp;TC · LabMate</dd></div>
            </dl>
          </div>
        </> : <section className="page-heading"><div><div className="eyebrow">MY ACCOUNT</div><h1>Profile<span className="heading-period">.</span></h1><p>Sign in to view your account details.</p><button className="auth-top-button" onClick={() => { setAuthMode('signin'); setAuthOpen(true); }}>Sign in</button></div></section>}
      </section>}

      {activePage === 'settings' && <section className="settings-page">
        <section className="page-heading"><div><div className="eyebrow">MY ACCOUNT <span>·</span> PREFERENCES</div><h1>Settings<span className="heading-period">.</span></h1><p>Manage your account and teaching preferences.</p></div></section>
        {!profile && <p className="empty-list">Sign in to manage your settings.</p>}
        {profile && <>
          <section className="settings-card"><div className="settings-card-heading"><div><div className="section-kicker">ACCOUNT</div><h2>Sign-in security</h2></div></div>
            <p className="settings-description">Password reset instructions can be sent to <b>{profile.email}</b>.</p>
            <button className="quiet-button" onClick={async () => {
              setSettingsError(''); setSettingsMessage('');
              const { error } = await supabase.auth.resetPasswordForEmail(profile.email, { redirectTo: window.location.origin });
              if (error) setSettingsError(error.message); else setSettingsMessage('If this account is eligible, password reset instructions are on the way.');
            }}>Send password reset link</button>
            {settingsMessage && <p className="form-message success" role="status">{settingsMessage}</p>}
            {settingsError && <p className="form-message error" role="alert">{settingsError}</p>}
          </section>
          {['faculty', 'assistant_professor'].includes(profile.role) && <section className="settings-card"><div className="settings-card-heading"><div><div className="section-kicker">TEACHING</div><h2>Assigned lab subjects</h2><p>You can add or remove subjects. Other approved teachers can share a subject with you.</p></div></div>
            <div className="settings-subjects">
              {Object.entries(years).map(([yearName, data]) => <fieldset key={yearName}><legend>{yearName}</legend>
                {Object.entries(data.semesters).map(([semesterName, items]) => <div key={semesterName} className="teaching-semester"><b>{semesterName}</b>
                  {items.map(course => {
                    const key = `${data.number}::${semesterIndex[semesterName.split(' ').at(-1)]}::${course.code}::${course.subject}`;
                    return <label className="teaching-option" key={key}><input type="checkbox" checked={assignmentDraft.includes(key)} onChange={event => setAssignmentDraft(current => event.target.checked ? [...current, key] : current.filter(item => item !== key))} /><span><b>{course.subject}{course.elective ? ` (${course.elective})` : ''}</b><small>{course.code} · {semesterName}</small></span></label>;
                  })}
                </div>)}
              </fieldset>)}
            </div>
            {settingsError && <p className="form-message error" role="alert">{settingsError}</p>}
            {settingsMessage && <p className="form-message success" role="status">{settingsMessage}</p>}
            <button className="upload-button" onClick={saveTeacherAssignments} disabled={saving || assignmentDraft.length === 0}>{saving ? 'Saving…' : 'Save lab assignments'}</button>
          </section>}
          <section className="settings-card"><div className="settings-card-heading"><div><div className="section-kicker">GENERAL</div><h2>Your workspace</h2></div></div>
            <dl className="profile-facts settings-facts"><div><dt>Account</dt><dd>{workspaceRole} · {profile.account_status}</dd></div><div><dt>Academic workspace</dt><dd>SPPU · Electronics &amp; Telecommunication</dd></div><div><dt>Current view</dt><dd>{year} · {semester}</dd></div></dl>
          </section>
        </>}
      </section>}

      {activePage === 'chat' && <section className="chat-page">
        <section className="page-heading"><div><div className="eyebrow">LABMATE <span>·</span> GEMINI</div><h1>Study assistant<span className="heading-period">.</span></h1><p>Ask about concepts, experiment steps, or attach a small study file.</p></div><button className="upload-button" onClick={createChatSession} disabled={!profile || chatBusy}><Icon name="plus" size={15} />New chat</button></section>
        {chatConfigured === false && <div className="chat-setup-notice" role="status"><b>Gemini needs one setup step.</b><span>Add <code>GEMINI_API_KEY</code> in Vercel → Project Settings → Environment Variables, then redeploy. The key stays on the server.</span></div>}
        {!profile && <p className="empty-list">Sign in to save chats and use the study assistant.</p>}
        {profile && <div className="chat-layout">
          <aside className="chat-sidebar"><div className="chat-sidebar-heading"><b>Saved chats</b><span>{chatSessions.length}</span></div>
            {chatSessions.length === 0 && <p className="empty-list">No chats yet.</p>}
            <ul>{chatSessions.map(item => <li key={item.id} className={activeChatId === item.id ? 'active' : ''}><button onClick={() => openChatSession(item.id)}>{item.title}</button><button className="chat-delete" aria-label={`Delete ${item.title}`} onClick={() => deleteChatSession(item.id)}>×</button></li>)}</ul>
          </aside>
          <section className="chat-conversation" aria-label="Saved study conversation">
            {!activeChatId ? <div className="chat-empty"><Icon name="chat" size={30} /><h2>Start a study chat</h2><p>Your conversations are saved to your account. Use the attachment option for a PDF, image, audio, or video clip.</p><button className="quiet-button" onClick={createChatSession}>Start new chat</button></div> : <div className="chat-messages">
              {chatMessages.length === 0 && <div className="chat-empty"><h2>What are you studying?</h2><p>Try asking for an explanation of an experiment or a concept.</p></div>}
              {chatMessages.map(item => <article key={item.id} className={`chat-bubble ${item.role}`}><span>{item.role === 'user' ? profile.full_name : 'LabMate study assistant'}</span><p>{item.content}</p>{item.attachment_name && <small>Attachment: {item.attachment_name}</small>}</article>)}
              {chatBusy && <article className="chat-bubble model"><span>LabMate study assistant</span><p>Thinking…</p></article>}
            </div>}
            {chatError && <p className="form-message error" role="alert">{chatError}</p>}
            {chatMessage && <p className="form-message success" role="status">{chatMessage}</p>}
            <form className="chat-composer" onSubmit={sendChatMessage}>
              {chatFile && <div className="chat-file-chip">{chatFile.name}<button type="button" aria-label="Remove attachment" onClick={() => setChatFile(null)}>×</button></div>}
              <textarea value={chatPrompt} onChange={event => setChatPrompt(event.target.value)} rows="3" maxLength="16000" placeholder="Ask a question about your studies…" aria-label="Your study question" disabled={!activeChatId && chatSessions.length > 0 && chatBusy} />
              <div className="chat-composer-actions"><label className="chat-attach">Attach file<input type="file" accept="image/png,image/jpeg,image/webp,application/pdf,audio/mpeg,audio/mp4,audio/wav,audio/webm,audio/ogg,audio/aac,audio/flac,video/mp4,video/webm,video/quicktime,video/mpeg" onChange={event => setChatFile(event.target.files?.[0] || null)} /></label><small>PDF, image, audio, or video · up to 2.5 MB</small><button className="upload-button" disabled={chatBusy || chatConfigured !== true || (!chatPrompt.trim() && !chatFile)}>{chatBusy ? 'Sending…' : 'Send'}</button></div>
            </form>
            <p className="chat-privacy-note">Gemini free-tier requests may be used by Google to improve its products. Do not attach sensitive personal information.</p>
          </section>
        </div>}
      </section>}

      <footer className="page-footer"><span>LabMate <span className="footer-dot">·</span> SPPU E&amp;TC lab workspace.</span><span>{profile ? 'Signed in as ' + workspaceRole : 'Sign in to view experiments and shared files.'}</span></footer>
    </main>
    {authOpen && <AuthDialog mode={authMode} setMode={setAuthMode} onClose={() => setAuthOpen(false)} />}
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);

