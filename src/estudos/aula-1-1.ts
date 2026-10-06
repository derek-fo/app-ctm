// src/estudos/aula-1-1.ts

// ---------- 1. União de literais: o "cardápio" ----------
type WeightUnit = 'kg' | 'lb';

// ---------- 2. Função com parâmetros e retorno tipados ----------
function formatWeight(weight: number, unit: WeightUnit): string {
  return `${weight} ${unit}`;
}

// ---------- 3. Interface: a "ficha de cadastro" ----------
interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  notes?: string; // opcional
}

// ---------- 4. Utility types: derivando tipos ----------
type NewExercise = Omit<Exercise, 'id'>;            // tudo, menos o id
type ExerciseChanges = Partial<NewExercise>;         // tudo opcional
type ExerciseSummary = Pick<Exercise, 'id' | 'name'>; // só id e nome

const unitLabels: Record<WeightUnit, string> = {
  kg: 'quilogramas',
  lb: 'libras',
};

// ---------- 5. União discriminada: a "pulseira" kind ----------
interface StrengthSet {
  kind: 'strength';
  weight: number;
  reps: number;
}

interface CardioSet {
  kind: 'cardio';
  distanceKm: number;
  durationSeconds: number;
}

interface TimedSet {
    kind: 'timed';
    durationSeconds: number;
}

type WorkoutSet = StrengthSet | CardioSet | TimedSet;

function summarizeSet(set: WorkoutSet): string {
  switch (set.kind) {
    case 'strength':
      // Aqui o TS sabe que "set" é StrengthSet.
      return `${set.weight} kg × ${set.reps}`;
    case 'cardio':
      // Aqui o TS sabe que "set" é CardioSet.
      return `${set.distanceKm} km em ${Math.round(set.durationSeconds / 60)} min`;
    case 'timed':
      // Aqui o TS sabe que "set" é TimedSet.
      return `${Math.round(set.durationSeconds)} s`;
  }
}

// ---------- 6. Narrowing com typeof: o "segurança na porta" ----------
function parseReps(input: string | number): number {
  if (typeof input === 'number') {
    return input;
  }
  const parsed = Number.parseInt(input, 10);
  // Se o texto não for um número, parseInt devolve NaN ("não é um número").
  return Number.isNaN(parsed) ? 0 : parsed;
}

// ---------- 7. Generic: o "pote com etiqueta em branco" ----------
function lastItem<T>(items: T[]): T | undefined {
  return items[items.length - 1];
}

// ---------- Usando tudo ----------
const squat: NewExercise = { name: 'Agachamento livre', muscleGroup: 'legs' };
const changes: ExerciseChanges = { notes: 'Manter a coluna neutra' };
const summary: ExerciseSummary = { id: 'ex-1', name: 'Supino reto' };
const session: WorkoutSet[] = [
    { reps: 10, weight: 80, kind: 'strength' },
    { reps: 8, weight: 80, kind: 'strength' },
    { distanceKm: 2, durationSeconds: 600, kind: 'cardio' },
    { durationSeconds: 60, kind: 'timed' },
]

function totalVolume(sets: WorkoutSet[]): number {
    return sets.reduce((total, set) => {
        if (set.kind === 'strength') {
            return total + (set.reps * set.weight);
        }
        return total;
    }, 0);
}

const last = lastItem(session);

console.log(totalVolume(session));

console.log(formatWeight(80, 'kg'));
console.log(unitLabels.lb);
console.log(squat.name, '-', changes.notes);
console.log(summary.name);
console.log(summarizeSet({ kind: 'strength', weight: 100, reps: 5 }));
console.log(summarizeSet({ kind: 'cardio', distanceKm: 2, durationSeconds: 600 }));
console.log(summarizeSet({ kind: 'timed', durationSeconds: 60 }));
console.log(parseReps('12'), parseReps(8), parseReps('abc'));

if (last) {
  console.log(summarizeSet(last));
}