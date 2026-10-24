import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const years = {
  '2nd year': [
    { code: 'CS 201', name: 'Data Structures', practicals: 8, materials: ['Course syllabus', 'Practical 01 · Arrays', 'Practical 02 · Linked lists'] },
    { code: 'CS 202', name: 'Object-Oriented Programming', practicals: 10, materials: ['Course syllabus', 'Practical 01 · Classes & objects'] },
    { code: 'CS 203', name: 'Database Systems', practicals: 8, materials: ['Course syllabus', 'Practical 01 · SQL basics'] },
    { code: 'CS 204', name: 'Digital Logic', practicals: 6, materials: ['Course syllabus', 'Practical 01 · Logic gates'] },
    { code: 'CS 205', name: 'Computer Organization', practicals: 6, materials: ['Course syllabus', 'Lab guide · Getting started'] },
  ],
  '3rd year': [
    { code: 'CS 301', name: 'Java Programming', practicals: 10, materials: ['Course syllabus', 'Practical 01 · Java setup', 'Practical 02 · Classes & objects'] },
    { code: 'CS 302', name: 'Operating Systems', practicals: 8, materials: ['Course syllabus', 'Practical 01 · Linux commands'] },
    { code: 'CS 303', name: 'Computer Networks', practicals: 8, materials: ['Course syllabus', 'Practical 01 · Network tools'] },
    { code: 'CS 304', name: 'Web Technologies', practicals: 10, materials: ['Course syllabus', 'Practical 01 · HTML & CSS'] },
    { code: 'CS 305', name: 'Software Engineering', practicals: 6, materials: ['Course syllabus', 'Lab guide · Project brief'] },
  ],
  '4th year': [
    { code: 'CS 401', name: 'Cloud Computing', practicals: 8, materials: ['Course syllabus', 'Practical 01 · Cloud foundations'] },
    { code: 'CS 402', name: 'Machine Learning', practicals: 10, materials: ['Course syllabus', 'Practical 01 · Data preparation'] },
    { code: 'CS 403', name: 'Cybersecurity', practicals: 8, materials: ['Course syllabus', 'Practical 01 · Security essentials'] },
    { code: 'CS 404', name: 'Distributed Systems', practicals: 6, materials: ['Course syllabus', 'Practical 01 · Service basics'] },
    { code: 'CS 405', name: 'Major Project Lab', practicals: 12, materials: ['Course syllabus', 'Project brief', 'Review checklist'] },
  ],
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

function App() {
  const [year, setYear] = React.useState('3rd year');
  const [role, setRole] = React.useState('Faculty');
  const [counts, setCounts] = React.useState(initialCounts);
  const [selectedCode, setSelectedCode] = React.useState('CS 301');
  const [uploads, setUploads] = React.useState({});
  const uploadInput = React.useRef(null);
  const courses = years[year];
  const selectedCourse = courses.find(course => course.code === selectedCode) || courses[0];
  const materialList = [...selectedCourse.materials, ...(uploads[selectedCourse.code] || [])];
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  React.useEffect(() => {
    if (!apiUrl) return;
    fetch(apiUrl.replace(/\/$/, '') + '/api/overview')
      .then(response => response.ok ? response.json() : Promise.reject(new Error('Summary unavailable')))
      .then(summary => setCounts({ students: summary.students, faculty: summary.faculty }))
      .catch(() => setCounts(initialCounts));
  }, [apiUrl]);

  const chooseYear = nextYear => {
    setYear(nextYear);
    setSelectedCode(years[nextYear][0].code);
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

  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#home" aria-label="LabMate home"><span className="brand-mark"><Icon name="flask" size={19} /></span><span>labmate<span className="brand-period">.</span></span></a>
      <div className="workspace-label">YOUR COLLEGE</div>
      <button className="college-select"><span className="college-avatar">C</span><span><b>Computer Science</b><small>Academic workspace</small></span><Icon name="chevron" size={15} /></button>
      <nav className="nav-list" aria-label="Main navigation">
        <a className="nav-item active" href="#home"><Icon name="grid" />Overview</a>
        <a className="nav-item" href="#subjects"><Icon name="book" />Subjects</a>
        <a className="nav-item" href="#materials"><Icon name="file" />Materials</a>
        <a className="nav-item" href="#community"><Icon name="people" />People</a>
      </nav>
      <div className="sidebar-note"><span className="note-mark" />Start with the subjects and signups. Room planning can come later.</div>
      <div className="sidebar-bottom"><span className="year-label">ACADEMIC YEARS</span><div className="year-list">{Object.keys(years).map(item => <button key={item} onClick={() => chooseYear(item)} className={year === item ? 'year-link current' : 'year-link'}>{item}<span>{years[item].length}</span></button>)}</div><div className="profile"><div className="profile-avatar">{role === 'Faculty' ? 'FC' : 'ST'}</div><span><b>{role === 'Faculty' ? 'Faculty preview' : 'Student preview'}</b><small>Demo workspace</small></span></div></div>
    </aside>

    <main className="main-content" id="home">
      <header className="topbar"><div className="breadcrumbs">LabMate <span>/</span> Overview</div><div className="topbar-actions"><label className="role-picker"><span>Viewing as</span><select value={role} onChange={event => setRole(event.target.value)} aria-label="Choose a demo role"><option>Faculty</option><option>Student</option></select><Icon name="chevron" size={14} /></label><button className="icon-button" aria-label="Search"><Icon name="search" size={17} /></button></div></header>
      <section className="page-heading"><div><div className="eyebrow">ACADEMIC WORKSPACE <span>·</span> SAMPLE CURRICULUM</div><h1>Make room for learning<span className="heading-period">.</span></h1><p>Subjects, practicals, and course materials in one place.</p></div><div className="year-switch" role="group" aria-label="Choose academic year">{Object.keys(years).map(item => <button key={item} onClick={() => chooseYear(item)} className={year === item ? 'selected' : ''}>{item}</button>)}</div></section>

      <section className="metrics-grid" id="community" aria-label="Signup overview">
        <article className="metric-card"><div className="metric-top"><span>STUDENT SIGNUPS</span><Icon name="people" size={17} /></div><div className="metric-value">{counts.students}<span className="metric-unit"> students</span></div><div className="metric-foot">Across the three active years</div></article>
        <article className="metric-card"><div className="metric-top"><span>FACULTY SIGNUPS</span><Icon name="people" size={17} /></div><div className="metric-value">{counts.faculty}<span className="metric-unit"> faculty</span></div><div className="metric-foot">Shared across subjects</div></article>
        <article className="metric-card"><div className="metric-top"><span>{year.toUpperCase()} SUBJECTS</span><Icon name="book" size={17} /></div><div className="metric-value">05<span className="metric-unit"> subjects</span></div><div className="metric-foot">Each includes practical work</div></article>
      </section>

      <section className="access-rules" aria-label="Signup and approval rules">
        <article className="access-rule"><span className="access-icon"><Icon name="people" size={17} /></span><div><div className="section-kicker">STUDENT ACCESS</div><h2>Students can sign up</h2><p>Use their name, normal email address, and college roll number.</p></div><span className="rule-status open">SELF SIGNUP</span></article>
        <article className="access-rule"><span className="access-icon"><Icon name="book" size={17} /></span><div><div className="section-kicker">FACULTY ACCESS</div><h2>Admin approval required</h2><p>Faculty and assistant professors request access; an admin approves them.</p></div><span className="rule-status review">REVIEW</span></article>
      </section>

      <div className="section-heading" id="subjects"><div><div className="section-kicker">CURRICULUM</div><h2>{year} subjects</h2><p>Choose a subject to see its practicals and shared material.</p></div><span className="curriculum-tag">Demo curriculum · update to your syllabus</span></div>
      <div className="workspace-grid">
        <section className="subject-panel" aria-label="Subject list">
          <div className="panel-topline"><span>SUBJECT</span><span>PRACTICALS</span></div>
          <div className="subject-list">{courses.map(course => <button key={course.code} onClick={() => setSelectedCode(course.code)} className={selectedCourse.code === course.code ? 'subject-row selected' : 'subject-row'}><span className="subject-code">{course.code}</span><span className="subject-name"><b>{course.name}</b><small>{course.materials.length + (uploads[course.code]?.length || 0)} learning materials</small></span><span className="practical-count">{course.practicals}<small>practicals</small></span><Icon name="arrow" size={15} /></button>)}</div>
          <div className="subject-footer"><span className="check-icon"><Icon name="check" size={14} /></span>Five subjects per academic year</div>
        </section>

        <section className="detail-panel" id="materials">
          <div className="detail-heading"><div><div className="section-kicker">SUBJECT DETAILS</div><h2>{selectedCourse.name}</h2><p>{selectedCourse.code} <span>·</span> {year}</p></div><span className="subject-glyph"><Icon name="flask" size={20} /></span></div>
          <div className="detail-stats"><div><b>{selectedCourse.practicals}</b><span>practical sessions</span></div><div><b>{materialList.length}</b><span>shared materials</span></div></div>
          <div className="material-heading"><h3>Practicals & materials</h3>{role === 'Faculty' && <button className="upload-button" onClick={() => uploadInput.current?.click()}><Icon name="upload" size={15} />Add material</button>}</div>
          <input ref={uploadInput} className="file-input" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.png,.jpg,.jpeg" onChange={handleUpload} aria-label="Upload syllabus or practical material" />
          {role === 'Faculty' && <p className="upload-hint">Add a syllabus, lab sheet, or experiment guide. This preview keeps filenames in this session only.</p>}
          {role === 'Student' && <p className="upload-hint">Materials shared by faculty for your practical work.</p>}
          <ul className="material-list">{materialList.map((material, index) => <li key={material + index}><span className="file-glyph"><Icon name="file" size={15} /></span><span className="file-name">{material}<small>{material.toLowerCase().includes('syllabus') ? 'Syllabus' : 'Practical resource'}</small></span><span className="file-access">{role === 'Student' ? 'Available' : 'Shared'}</span></li>)}</ul>
          <div className="detail-bottom"><span>For next term, add the actual subject names and faculty roster.</span><Icon name="arrow" size={15} /></div>
        </section>
      </div>
      <footer className="page-footer"><span>LabMate <span className="footer-dot">·</span> Make room for learning.</span><span>{apiUrl ? 'API configured' : 'Demo workspace · signup totals are examples'}</span></footer>
    </main>
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
