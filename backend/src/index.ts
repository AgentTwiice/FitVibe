import express from 'express';
import cors from 'cors';
import { Data, todayISO } from './data';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/templates', (_req, res) => {
  res.json(Data.getTemplates());
});
app.post('/templates', (req, res) => {
  const t = Data.createTemplate(req.body);
  res.status(201).json(t);
});
app.delete('/templates/:id', (req, res) => {
  Data.deleteTemplate(req.params.id);
  res.json({ ok: true });
});

app.get('/schedule', (_req, res) => {
  res.json(Data.getSchedule());
});
app.patch('/schedule', (req, res) => {
  res.json(Data.setSchedule(req.body));
});

app.post('/workouts/start', (req, res) => {
  const { date = todayISO(), templateName } = req.body || {};
  res.status(201).json(Data.startWorkout(date, templateName));
});
app.get('/workouts', (req, res) => {
  const limit = Number(req.query.limit) || 20;
  res.json(Data.getWorkouts(limit));
});
app.get('/workouts/:id', (req, res) => {
  const w = Data.getWorkout(req.params.id);
  if (!w) return res.status(404).json({ error: 'not found' });
  res.json(w);
});
app.patch('/workouts/:id', (req, res) => {
  const w = Data.patchWorkout(req.params.id, req.body);
  if (!w) return res.status(404).json({ error: 'not found' });
  res.json(w);
});
app.post('/workouts/:id/exercises', (req, res) => {
  const ex = Data.addExercise(req.params.id, req.body.name);
  if (!ex) return res.status(404).json({ error: 'workout not found' });
  res.status(201).json(ex);
});
app.post('/workouts/:id/exercises/:exId/sets', (req, res) => {
  const s = Data.addSet(req.params.id, req.params.exId, req.body);
  if (!s) return res.status(404).json({ error: 'exercise not found' });
  res.status(201).json(s);
});

const port = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server listening on ${port}`);
  });
}

export default app;
