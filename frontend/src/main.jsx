import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const sessions = [
  { time: '09:00', period: 'AM', course: 'Circuit Analysis', group: 'EC · Semester 3 · Batch A', room: 'Lab 204', status: 'In progress', initials: 'EC' },
  { time: '11:30', period: 'AM', course: 'Digital Systems', group: 'EC · Semester 5 · Batch B', room: 'Lab 204', status: 'Next up', initials: 'DS' },
  { time: '02:00', period: 'PM', course: 'Embedded Design', group: 'EC · Semester 5 · Batch A', room: 'Lab 207', status: 'Scheduled', initials: 'ED' },
];

const equipment = [
  { name: 'Oscilloscope', detail: 'Tektronix TBS1052B', available: 12, total: 16, tone: 'sage' },
  { name: 'Digital multimeter', detail: 'Fluke 17B+', available: 18, total: 20, tone: 'sage' },
  { name: 'Function generator', detail: 'Keysight 33500B', available: 3, total: 8, tone: 'amber' },
];

function Icon({ name, size = 18 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  const paths = {
    grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="1"/><rect x="13.5" y="3.5" width="7" height="7" rx="1"/><rect x="3.5" y="13.5" width="7" height="7" rx="1"/><rect x="13.5" y="13.5" width="7" height="7" rx="1"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    box: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v9l9 5 9-5V8M12 13v9"/></>,
    people: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.6-1.4-2.4 1.4-1.1a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.6 1.4 2.4-1.4 1.1a8 8 0 0 1 0 2Z" transform="translate(-1 -1) scale(1.08)"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    chevron: <path d="m8 10 4 4 4-4"/>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    flask: <><path d="M9 3h6M10 3v6l-5.8 9.2A2 2 0 0 0 5.9 21h12.2a2 2 0 0 0 1.7-2.8L14 9V3"/><path d="M8 15h8"/></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function App() {
  const date = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [tab, setTab] = React.useState('Today');
  const [inventory, setInventory] = React.useState(equipment);
  React.useEffect(() => {
    if (!apiUrl) return;
    fetch(`${apiUrl.replace(/\/$/, '')}/api/equipment`)
      .then(response => response.ok ? response.json() : Promise.reject(new Error('Inventory unavailable')))
      .then(items => setInventory(items.map(item => ({ ...item, tone: item.available / item.total < 0.5 ? 'amber' : 'sage' }))))
      .catch(() => setInventory(equipment));
  }, [apiUrl]);
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><Icon name="flask" size={20}/></span><span>labmate<span className="brand-period">.</span></span></div>
      <div className="workspace-label">WORKSPACE</div>
      <button className="lab-select"><span className="lab-avatar">EC</span><span className="lab-select-copy"><b>Electronics Lab</b><small>Engineering · Block B</small></span><Icon name="chevron" size={15}/></button>
      <nav className="nav-list" aria-label="Main navigation">
        <a className="nav-item active" href="#overview"><Icon name="grid"/>Overview<span className="nav-active-mark"/></a>
        <a className="nav-item" href="#schedule"><Icon name="calendar"/>Schedule</a>
        <a className="nav-item" href="#equipment"><Icon name="box"/>Equipment<span className="nav-count">24</span></a>
        <a className="nav-item" href="#students"><Icon name="people"/>Students</a>
      </nav>
      <div className="sidebar-bottom"><a className="nav-item" href="#settings"><Icon name="settings"/>Settings</a><div className="profile"><div className="profile-avatar">AS</div><span><b>Arjun Shah</b><small>Lab coordinator</small></span><button aria-label="Open profile menu" className="profile-menu"><Icon name="chevron" size={15}/></button></div></div>
    </aside>

    <main className="main-content" id="overview">
      <header className="topbar"><div className="breadcrumbs">Workspace <span>/</span> Overview</div><div className="topbar-actions"><button className="icon-button" aria-label="Search"><Icon name="search"/></button><button className="icon-button notification" aria-label="Notifications"><Icon name="bell"/><i/></button><div className="topbar-divider"/><span className="date-label">{date}</span></div></header>
      <section className="page-heading"><div><div className="eyebrow"><span className="live-dot"/>LAB OPERATIONS</div><h1>Good morning, Arjun<span className="heading-period">.</span></h1><p>Here’s what’s happening in your lab today.</p></div><button className="primary-button" onClick={() => setTab('New session')}><Icon name="plus" size={17}/>Create session</button></section>
      <section className="metrics-grid" aria-label="Lab summary">
        <article className="metric-card"><div className="metric-top"><span>SESSIONS TODAY</span><span className="metric-icon"><Icon name="calendar" size={16}/></span></div><div className="metric-value">06<span className="metric-unit"> / 08</span></div><div className="metric-foot"><span className="metric-line"><i style={{width:'75%'}}/></span><span>75% of schedule</span></div></article>
        <article className="metric-card"><div className="metric-top"><span>EQUIPMENT READY</span><span className="metric-icon"><Icon name="box" size={16}/></span></div><div className="metric-value">84<span className="metric-unit">%</span></div><div className="metric-foot"><span className="status-dot sage-dot"/>21 of 25 items available</div></article>
        <article className="metric-card"><div className="metric-top"><span>STUDENTS EXPECTED</span><span className="metric-icon"><Icon name="people" size={16}/></span></div><div className="metric-value">128</div><div className="metric-foot"><span className="metric-foot-muted">Across 4 batches today</span></div></article>
      </section>
      <div className="content-grid">
        <section className="panel schedule-panel" id="schedule">
          <div className="panel-heading"><div><div className="panel-kicker">YOUR DAY</div><h2>Lab schedule</h2></div><button className="text-button" onClick={() => setTab('Full schedule')}>Full schedule <Icon name="arrow" size={15}/></button></div>
          <div className="schedule-tabs">{['Today', 'Tomorrow', 'This week'].map(label => <button key={label} className={tab === label ? 'selected' : ''} onClick={() => setTab(label)}>{label}</button>)}</div>
          <div className="session-list">{sessions.map((session, index) => <article className="session-row" key={session.course}><div className="session-time"><b>{session.time}</b><span>{session.period}</span></div><div className="session-track"><i className={index === 0 ? 'track-active' : ''}/></div><div className="course-mark">{session.initials}</div><div className="session-info"><div className="session-title-line"><h3>{session.course}</h3>{index === 0 && <span className="pill in-progress">IN PROGRESS</span>}</div><p>{session.group}</p><span className="session-room"><span className="room-dot"/>{session.room}</span></div><button className="row-more" aria-label={`More options for ${session.course}`}>···</button></article>)}</div>
          <div className="schedule-footer"><span><span className="status-dot sage-dot"/>Lab is open</span><span>Last updated just now</span></div>
        </section>
        <section className="panel equipment-panel" id="equipment">
          <div className="panel-heading"><div><div className="panel-kicker">INVENTORY</div><h2>Equipment status</h2></div><button className="icon-button panel-search" aria-label="Search equipment"><Icon name="search" size={17}/></button></div>
          <div className="equipment-summary"><span>Items available</span><b>21 <small>/ 25</small></b></div>
          <div className="equipment-list">{inventory.map(item => <article className="equipment-row" key={item.id || item.name}><div className="equipment-glyph"><Icon name="box" size={18}/></div><div className="equipment-copy"><h3>{item.name}</h3><p>{item.detail || item.model}</p><div className="equipment-bar"><i className={item.tone} style={{width:`${(item.available/item.total)*100}%`}}/></div></div><div className="equipment-count"><b>{item.available}<small>/{item.total}</small></b><span className={`availability ${item.tone}`}>{item.tone === 'amber' ? 'Low stock' : 'Available'}</span></div></article>)}</div>
          <button className="inventory-link" onClick={() => setTab('Inventory')}><span>View all equipment</span><Icon name="arrow" size={15}/></button>
        </section>
      </div>
      <section className="notice-bar"><div className="notice-icon"><Icon name="clock" size={17}/></div><p><b>One item needs attention</b><span>Function generators are running low. Consider reviewing the inventory before the afternoon session.</span></p><button onClick={() => setTab('Inventory')}>Review <Icon name="arrow" size={14}/></button></section>
      <footer className="page-footer"><span>LabMate <span className="footer-dot">·</span> Lab operations, made clear.</span><span>{apiUrl ? 'API configured' : 'Preview mode · sample data'}</span></footer>
    </main>
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
