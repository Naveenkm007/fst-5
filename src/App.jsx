import { useEffect, useMemo, useState } from 'react'
import './App.css'

const leaveTypes = {
  casual: { label: 'Casual leave', short: 'CL', color: 'coral', total: 12 },
  medical: { label: 'Medical leave', short: 'ML', color: 'blue', total: 10 },
}

const initialRequests = [
  { id: 1, type: 'casual', dates: '20 Sep 2026', days: 1, reason: 'Personal appointment', status: 'Approved' },
  { id: 2, type: 'medical', dates: '03 Sep - 04 Sep 2026', days: 2, reason: 'Routine check-up', status: 'Approved' },
]

const initialEvents = [
  { id: 1, time: 'Today, 09:42', title: 'Casual leave approved', detail: 'Your request for 20 Sep was approved.', tone: 'coral' },
  { id: 2, time: 'Yesterday, 16:18', title: 'Medical leave balance updated', detail: '2 days returned to your balance.', tone: 'blue' },
  { id: 3, time: '18 Sep, 10:05', title: 'Upcoming holiday', detail: 'Company day on 02 Oct 2026.', tone: 'yellow' },
]

function App() {
  const [activeView, setActiveView] = useState('overview')
  const [isApplyOpen, setIsApplyOpen] = useState(false)
  const [leaveType, setLeaveType] = useState('casual')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')
  const [requests, setRequests] = useState(initialRequests)
  const [events, setEvents] = useState(initialEvents)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const usedDays = useMemo(() => requests.reduce((totals, request) => ({ ...totals, [request.type]: totals[request.type] + request.days }), { casual: 0, medical: 0 }), [requests])
  const daysUntilReset = Math.max(0, Math.ceil((new Date('2026-12-31') - now) / 86400000))
  const nextReset = `${String(Math.max(0, Math.floor(((new Date('2026-12-31') - now) / 3600000) % 24))).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
  const formatDate = (date) => date ? new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

  const submitRequest = (event) => {
    event.preventDefault()
    if (!startDate || !endDate || new Date(endDate) < new Date(startDate)) return
    const days = Math.floor((new Date(`${endDate}T00:00:00`) - new Date(`${startDate}T00:00:00`)) / 86400000) + 1
    const newRequest = { id: Date.now(), type: leaveType, dates: startDate === endDate ? formatDate(startDate) : `${formatDate(startDate)} - ${formatDate(endDate)}`, days, reason: reason || 'No reason added', status: 'Pending' }
    setRequests((current) => [newRequest, ...current])
    setEvents((current) => [{ id: Date.now(), time: 'Just now', title: `${leaveTypes[leaveType].label} requested`, detail: `${days} ${days === 1 ? 'day' : 'days'} sent for approval.`, tone: leaveTypes[leaveType].color }, ...current])
    setIsApplyOpen(false)
    setStartDate('')
    setEndDate('')
    setReason('')
    setActiveView('requests')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">N</span><span><strong>new horizon</strong><small>college of engineering</small></span></div>
        <div className="workspace-label">CSE DEPARTMENT · 2026</div>
        <nav className="nav-list" aria-label="Main navigation">
          <button className={activeView === 'overview' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveView('overview')}><span>◈</span> Overview</button>
          <button className={activeView === 'requests' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveView('requests')}><span>▣</span> My requests <b>{requests.length}</b></button>
          <button className="nav-item" onClick={() => setIsApplyOpen(true)}><span>＋</span> Apply for leave</button>
        </nav>
        <div className="sidebar-bottom">
          <div className="help-box"><span className="help-icon">?</span><div><strong>Need a hand?</strong><small>Contact CSE office</small></div><span>↗</span></div>
          <div className="profile"><div className="avatar">NK</div><div><strong>Naveen Kumar KM</strong><small>CSE · 1NH24CS409</small></div><span className="more">•••</span></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div className="breadcrumb"><span>New Horizon</span><b>/</b><span>CSE</span><b>/</b><strong>Leave hub</strong></div><div className="top-actions"><span className="department-chip">CSE · 2024–28</span><span className="live-dot"></span><span>Synced just now</span><button className="icon-button" aria-label="Notifications">♢<i></i></button><button className="mobile-menu" aria-label="Open menu">☰</button></div></header>
        <div className="content-wrap">
          <section className="page-heading"><div><p className="eyebrow">NEW HORIZON COLLEGE OF ENGINEERING · CSE</p><h1>Good morning, Naveen <span>✦</span></h1><p className="heading-copy">Plan your CSE attendance and time off with clarity.</p></div><button className="primary-button" onClick={() => setIsApplyOpen(true)}><span>＋</span> Apply for leave</button></section>

          {activeView === 'overview' ? <>
            <section className="balance-grid">
              <div className="balance-card featured"><div className="card-top"><div><p className="card-kicker">Available leave</p><h2>{leaveTypes.casual.total - usedDays.casual} <small>days</small></h2></div><span className="card-icon">◒</span></div><div className="balance-line"><span><i className="legend coral"></i> Used <strong>{usedDays.casual} days</strong></span><span>12 total</span></div><div className="progress"><i style={{ width: `${(usedDays.casual / leaveTypes.casual.total) * 100}%` }}></i></div><p className="card-foot">Casual leave <span>Resets in {daysUntilReset} days</span></p></div>
              <div className="balance-card"><div className="card-top"><div><p className="card-kicker">Medical leave</p><h2>{leaveTypes.medical.total - usedDays.medical} <small>days</small></h2></div><span className="card-icon blue-icon">✚</span></div><div className="balance-line"><span><i className="legend blue"></i> Used <strong>{usedDays.medical} days</strong></span><span>10 total</span></div><div className="progress blue-progress"><i style={{ width: `${(usedDays.medical / leaveTypes.medical.total) * 100}%` }}></i></div><p className="card-foot">Medical leave <span>Resets in {daysUntilReset} days</span></p></div>
              <div className="balance-card total-card"><div className="card-top"><div><p className="card-kicker">Total remaining</p><h2>{22 - usedDays.casual - usedDays.medical} <small>days</small></h2></div><span className="card-icon yellow-icon">✦</span></div><div className="mini-stat"><span>Next reset</span><strong>{nextReset}</strong></div><div className="balance-line"><span>Across all leave types</span><span className="green-text">On track</span></div></div>
            </section>

            <section className="dashboard-grid"><div className="panel calendar-panel"><div className="panel-heading"><div><p className="eyebrow">Your time off</p><h2>September 2026</h2></div><div className="month-actions"><button aria-label="Previous month">‹</button><button aria-label="Next month">›</button></div></div><div className="calendar-week"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></div><div className="calendar-grid">{Array.from({ length: 30 }, (_, index) => { const day = index + 1; const leave = day === 20; const today = day === 21; return <div key={day} className={`calendar-day ${today ? 'today' : ''} ${leave ? 'leave-day' : ''}`}><span>{day}</span>{leave && <small>Leave</small>}</div> })}</div><div className="calendar-legend"><span><i className="legend coral"></i> Casual leave</span><span><i className="legend outline"></i> Today</span><span><i className="legend yellow"></i> Company holiday</span></div></div><div className="side-stack"><div className="panel timer-panel"><div className="panel-heading"><div><p className="eyebrow">Leave cycle</p><h2>Year-end reset</h2></div><span className="timer-symbol">◷</span></div><p className="timer-copy">Your leave balance refreshes at the end of the year.</p><div className="countdown"><div><strong>{daysUntilReset}</strong><span>days</span></div><b>:</b><div><strong>{nextReset.split(':')[0]}</strong><span>hours</span></div><b>:</b><div><strong>{nextReset.split(':')[1]}</strong><span>mins</span></div></div><div className="timer-bar"><i></i></div><div className="timer-meta"><span>01 Jan 2026</span><span>31 Dec 2026</span></div></div><div className="panel quick-panel"><div className="panel-heading"><div><p className="eyebrow">Quick action</p><h2>Plan ahead</h2></div><span className="spark">✦</span></div><p>Have a trip coming up? Block your days before they go.</p><button className="text-button" onClick={() => setIsApplyOpen(true)}>Request time off <span>→</span></button></div></div></section>
            <section className="lower-grid"><div className="panel requests-panel"><div className="panel-heading"><div><p className="eyebrow">Activity</p><h2>Recent requests</h2></div><button className="text-button" onClick={() => setActiveView('requests')}>View all <span>→</span></button></div><div className="request-list">{requests.slice(0, 3).map((request) => <div className="request-row" key={request.id}><span className={`request-badge ${leaveTypes[request.type].color}`}>{leaveTypes[request.type].short}</span><div className="request-detail"><strong>{leaveTypes[request.type].label}</strong><span>{request.dates} · {request.days} {request.days === 1 ? 'day' : 'days'}</span></div><span className={`status ${request.status.toLowerCase()}`}>{request.status}</span></div>)}</div></div><div className="panel events-panel"><div className="panel-heading"><div><p className="eyebrow">Live feed</p><h2>Events</h2></div><span className="event-pulse"></span></div><div className="event-list">{events.slice(0, 3).map((event) => <div className="event-row" key={event.id}><span className={`event-dot ${event.tone}`}></span><div><strong>{event.title}</strong><p>{event.detail}</p><small>{event.time}</small></div></div>)}</div></div></section>
          </> : <section className="panel requests-page"><div className="panel-heading"><div><p className="eyebrow">Leave history</p><h2>My requests</h2><p className="subtle">Every request you've submitted, in one place.</p></div><button className="primary-button" onClick={() => setIsApplyOpen(true)}><span>＋</span> Apply for leave</button></div><div className="request-table">{requests.map((request) => <div className="request-row" key={request.id}><span className={`request-badge ${leaveTypes[request.type].color}`}>{leaveTypes[request.type].short}</span><div className="request-detail"><strong>{leaveTypes[request.type].label}</strong><span>{request.dates} · {request.days} {request.days === 1 ? 'day' : 'days'} · {request.reason}</span></div><span className={`status ${request.status.toLowerCase()}`}>{request.status}</span></div>)}</div></section>}
        </div>
      </main>

      {isApplyOpen && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setIsApplyOpen(false)}><form className="modal" onSubmit={submitRequest}><div className="modal-heading"><div><p className="eyebrow">New request</p><h2>Apply for leave</h2></div><button type="button" className="close-button" onClick={() => setIsApplyOpen(false)} aria-label="Close">×</button></div><label>Leave type<div className="type-options">{Object.entries(leaveTypes).map(([key, type]) => <button type="button" key={key} className={`type-option ${leaveType === key ? 'selected' : ''}`} onClick={() => setLeaveType(key)}><span className={`request-badge ${type.color}`}>{type.short}</span><span><strong>{type.label}</strong><small>{type.total - usedDays[key]} days available</small></span><i>{leaveType === key ? '●' : '○'}</i></button>)}</div></label><div className="date-row"><label>Start date<input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} required /></label><label>End date<input type="date" value={endDate} min={startDate} onChange={(event) => setEndDate(event.target.value)} required /></label></div><label>Reason <span className="optional">Optional</span><textarea placeholder="Add a note for your manager..." value={reason} onChange={(event) => setReason(event.target.value)} rows="3"></textarea></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setIsApplyOpen(false)}>Cancel</button><button className="primary-button" type="submit">Submit request <span>→</span></button></div></form></div>}
    </div>
  )
}

export default App
