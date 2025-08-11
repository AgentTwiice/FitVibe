export type Template = { id: string; name: string; exercises: { name: string; sets: number; reps: number; load: number }[] };
export type WorkoutSet = { id: string; reps: number; weight: number; rpe?: number };
export type WorkoutExercise = { id: string; name: string; sets: WorkoutSet[] };
export type Workout = { id: string; date: string; templateName: string | null; notes: string; duration_sec: number; exercises: WorkoutExercise[] };
export type Schedule = { [day: string]: string };

const uid = () => Math.random().toString(36).slice(2,9);
const todayISO = () => new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10);

export interface Database {
  version: number;
  units: 'kg' | 'lb';
  schedule: Schedule;
  templates: Template[];
  workouts: Workout[];
}

export const DEFAULT_DB: Database = {
  version:1,
  units:'kg',
  schedule:{sun:'',mon:'Full Body',tue:'Push',wed:'',thu:'Pull',fri:'',sat:''},
  templates:[
    {id:uid(), name:'Full Body', exercises:[{name:'Back Squat',sets:3,reps:8,load:60},{name:'Bench Press',sets:3,reps:8,load:50},{name:'Lat Pulldown',sets:3,reps:10,load:40}]},
    {id:uid(), name:'Push', exercises:[{name:'Incline DB Press',sets:4,reps:10,load:22.5},{name:'Shoulder Press',sets:3,reps:8,load:35},{name:'Triceps Rope',sets:3,reps:12,load:25}]},
    {id:uid(), name:'Pull', exercises:[{name:'Deadlift',sets:3,reps:5,load:100},{name:'Seated Row',sets:3,reps:10,load:45},{name:'Hammer Curl',sets:3,reps:12,load:15}]}
  ],
  workouts:[]
};

let DB: Database = { ...DEFAULT_DB };

export const Data = {
  getTemplates(){ return DB.templates.slice().sort((a,b)=>a.name.localeCompare(b.name)); },
  createTemplate(t: Omit<Template,'id'>){ const nt={...t,id:uid()}; DB.templates.push(nt); return nt; },
  deleteTemplate(id:string){ DB.templates=DB.templates.filter(t=>t.id!==id); },
  getSchedule(){ return { ...DB.schedule }; },
  setSchedule(s:Schedule){ DB.schedule={...DB.schedule,...s}; return { ...DB.schedule }; },
  startWorkout(date:string, templateName?:string|null){ const w:Workout={id:uid(),date,templateName:templateName||null,notes:'',duration_sec:0,exercises:[]}; if(templateName){ const t=DB.templates.find(x=>x.name===templateName); if(t){ w.exercises = t.exercises.map(e=>({id:uid(),name:e.name,sets:[]})); } } DB.workouts.push(w); return w; },
  getWorkouts(limit=20){ const arr=DB.workouts.slice().sort((a,b)=>a.date<b.date?1:-1); return arr.slice(0,limit); },
  getWorkout(id:string){ return DB.workouts.find(w=>w.id===id); },
  patchWorkout(id:string, body:Partial<Workout>){ const w=DB.workouts.find(x=>x.id===id); if(!w) return undefined; Object.assign(w,body||{}); return w; },
  addExercise(workoutId:string, name:string){ const w=DB.workouts.find(x=>x.id===workoutId); if(!w) return undefined; const ex:WorkoutExercise={id:uid(),name,sets:[]}; w.exercises.push(ex); return ex; },
  addSet(workoutId:string, exId:string, body:{reps:number;weight:number;rpe?:number}){ const w=DB.workouts.find(x=>x.id===workoutId); const e=w?.exercises.find(x=>x.id===exId); if(!e) return undefined; const s:WorkoutSet={id:uid(),reps:body.reps,weight:body.weight,rpe:body.rpe}; e.sets.push(s); return s; }
};

export { uid, todayISO };
