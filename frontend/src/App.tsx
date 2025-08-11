import { useEffect, useState } from 'react';
import { getSchedule, startWorkout, getWorkouts } from './api';

function Today() {
  const [schedule, setSchedule] = useState<any>({});
  const [recent, setRecent] = useState<any[]>([]);
  useEffect(() => {
    getSchedule().then(setSchedule);
    getWorkouts().then(setRecent);
  }, []);
  const weekday = ['sun','mon','tue','wed','thu','fri','sat'][new Date().getDay()];
  const templName = schedule[weekday] || '';
  return (
    <div className="grid">
      <div className="card">
        <div className="card-header">
          <div>
            <div className="title-xs">Today</div>
            <div className="pill">{new Date().toISOString().slice(0,10)}</div>
          </div>
          <div className="pill">{templName ? `Plan: ${templName}` : 'No plan'}</div>
        </div>
        <div className="row">
          <div>
            <div className="small muted">Tip</div>
            Log top sets, the app estimates 1RM for trends.
          </div>
          <div className="right">
            <button className="btn acc pill" onClick={async () => {
              const w = await startWorkout(new Date().toISOString().slice(0,10), templName || undefined);
              alert(`Workout started: ${w.id}`);
            }}>Start Workout</button>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><b>Recent</b></div>
        {recent.map((w:any) => (
          <div className="row" key={w.id}>
            <div><b>{w.date}</b> <span className="muted">{w.templateName || 'Freestyle'}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState('today');
  return (
    <>
      <header>
        <div className="bar">
          <div className="brand">
            <div className="logo"></div>
            <div className="name">FitVibe</div>
          </div>
          <div className="tabs" role="tablist" aria-label="Sections">
            <button className="tab" aria-selected={tab==='today'} onClick={() => setTab('today')}>Today</button>
            <button className="tab" aria-selected={tab==='plan'} onClick={() => setTab('plan')}>Plan</button>
          </div>
        </div>
      </header>
      <main id="app" className="grid">
        {tab==='today' && <Today />}
        {tab==='plan' && <div className="card">Plan coming soon</div>}
      </main>
    </>
  );
}
