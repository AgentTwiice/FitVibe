export async function getSchedule() {
  const res = await fetch('/api/schedule');
  return res.json();
}

export async function startWorkout(date: string, templateName?: string) {
  const res = await fetch('/api/workouts/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, templateName })
  });
  return res.json();
}

export async function getWorkouts(limit = 3) {
  const res = await fetch(`/api/workouts?limit=${limit}`);
  return res.json();
}
