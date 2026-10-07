type Id = string;

type WeightUnit = 'kg' | 'lb';
type DistanceUnit = 'km' | 'mi';

interface UnitPreferences {
  weight: WeightUnit;
  distance: DistanceUnit;
}

type MuscleGroup =
  'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'lower body' | 'core' | 'full-body';

type Equipment =
  'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight' | 'kettlebell' | 'band';

// Como as séries deste exercício são registradas.
type TrackingType = 'weight-reps' | 'reps' | 'time';

// Uma "ficha" do catálogo de exercícios.
interface Exercise {
  id: Id;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  trackingType: TrackingType;
  isCustom: boolean; // true = criado pelo usuário; false = veio da biblioteca
  notes?: string;
}

// ---------- O PLANO (a ficha do personal) ----------

// Um exercício dentro de uma rotina, com as metas planejadas.
interface TemplateExercise {
  exerciseId: Id; // aponta para o catálogo; não é uma cópia do exercício
  targetSets: number;
  targetReps?: number; // metas opcionais: dependem do tipo de exercício
  targetWeightKg?: number;
  targetDurationSeconds?: number;
  restSeconds: number;
}

interface WorkoutTemplate {
  id: Id;
  name: string; // ex.: "Treino A — Peito e Tríceps"
  exercises: TemplateExercise[];
  createdAt: string; // instante em UTC, formato ISO 8601 (detalhes no Módulo 8)
}

// ---------- O REGISTRO (o que foi feito de verdade) ----------

// Campos comuns a qualquer série.
interface BaseSetEntry {
  id: Id;
  isWarmup: boolean; // séries de aquecimento não contam nas métricas
}

interface WeightRepsSetEntry extends BaseSetEntry {
  kind: 'weight-reps';
  weightKg: number; // sempre em kg por dentro
  reps: number;
}

interface RepsSetEntry extends BaseSetEntry {
  kind: 'reps';
  reps: number;
}

interface TimeSetEntry extends BaseSetEntry {
  kind: 'time';
  durationSeconds: number;
}

// A união discriminada: a "pulseira" kind diz quais campos existem.
type SetEntry = WeightRepsSetEntry | RepsSetEntry | TimeSetEntry;

// Um exercício dentro de uma sessão, com as séries realmente feitas.
interface SessionExercise {
  exerciseId: Id;
  sets: SetEntry[];
}

interface WorkoutSession {
  id: Id;
  templateId?: Id; // ausente em treinos livres, sem rotina
  startedAt: string; // UTC ISO 8601
  endedAt?: string; // ausente enquanto o treino está em andamento
  exercises: SessionExercise[];
  notes?: string;
}

const exercises: Exercise[] = [
  {
    id: 'ex-bench',
    name: 'Supino reto',
    muscleGroup: 'chest',
    equipment: 'barbell',
    trackingType: 'weight-reps',
    isCustom: false,
  },
  {
    id: 'ex-dips',
    name: 'Paralelas',
    muscleGroup: 'triceps',
    equipment: 'bodyweight',
    trackingType: 'reps',
    isCustom: false,
  },
  {
    id: 'ex-plank',
    name: 'Prancha',
    muscleGroup: 'core',
    equipment: 'bodyweight',
    trackingType: 'time',
    isCustom: false,
  },
];

// O plano: a ficha do Treino A aponta para o catálogo pelos IDs.
const treinoA: WorkoutTemplate = {
  id: 'tpl-a',
  name: 'Treino A — Peito e Tríceps',
  createdAt: '2026-10-06T13:00:00.000Z',
  exercises: [
    { exerciseId: 'ex-bench', targetSets: 3, targetReps: 10, targetWeightKg: 80, restSeconds: 90 },
    { exerciseId: 'ex-dips', targetSets: 3, targetReps: 12, restSeconds: 60 },
  ],
};

const session: WorkoutSession = {
  id: 'ses-1',
  templateId: 'tpl-a', // TODO 1: esta sessão segue o Treino A
  startedAt: '2026-10-06T22:00:00.000Z',
  endedAt: '2026-10-06T22:10:00.000Z',
  exercises: [
    {
      exerciseId: 'ex-bench',
      sets: [
        { id: 's1', kind: 'weight-reps', isWarmup: true, weightKg: 40, reps: 12 },
        { id: 's2', kind: 'weight-reps', isWarmup: false, weightKg: 80, reps: 10 },
        { id: 's3', kind: 'weight-reps', isWarmup: false, weightKg: 80, reps: 9 },
        { id: 's4', kind: 'weight-reps', isWarmup: false, weightKg: 77.5, reps: 8 },
      ],
    },
    {
      exerciseId: 'ex-dips',
      sets: [
        { id: 's5', kind: 'reps', isWarmup: false, reps: 12 },
        { id: 's6', kind: 'reps', isWarmup: false, reps: 10 },
        { id: 's7', kind: 'reps', isWarmup: false, reps: 8 },
      ],
    },
  ],
};

function findExerciseName(exercises: Exercise[], id: Id): string {
  const exercise = exercises.find((ex) => ex.id === id);
  if (!exercise) {
    return 'Exercício não encontrado';
  }
  return exercise.name;
}

function countWorkingSets(session: WorkoutSession): number {
  let count = 0;
  const exercises = session.exercises;
  for (const exercise of exercises) {
    for (const set of exercise.sets) {
      if (!set.isWarmup) {
        count++;
      }
    }
  }
  return count;
}

function formatWeight(weightKg: number, unit: WeightUnit): string {
  if (unit === 'kg') {
    return `${weightKg} kg`;
  } else {
    return `${(weightKg * 2.20462).toFixed(1)} lb`;
  }
}

function describeSet(set: SetEntry, unit: WeightUnit): string {
  let text: string;

  switch (set.kind) {
    case 'weight-reps':
      text = `${formatWeight(set.weightKg, unit)} × ${set.reps}`;
      break;
    case 'reps':
      text = `${set.reps} reps`;
      break;
    case 'time':
      text = `${set.durationSeconds} s`;
      break;
  }

  if (set.isWarmup) {
    text += ' (aquecimento)';
  }

  return text;
}

function printSession(session: WorkoutSession, exercises: Exercise[], unit: WeightUnit): void {
  for (const sessionExercise of session.exercises) {
    console.log(findExerciseName(exercises, sessionExercise.exerciseId));
    console.log('--------------------');
    for (const set of sessionExercise.sets) {
        console.log('  ' + describeSet(set, unit))
    }
  }
}

printSession(session, exercises, 'lb');
/* console.log('Séries válidas:', countWorkingSets(session));

console.log(findExerciseName(exercises, 'ex-err'));
console.log(formatWeight(80, 'kg'));
console.log(formatWeight(80, 'lb'));

console.log(
  describeSet({ id: 's1', kind: 'weight-reps', isWarmup: true, weightKg: 40, reps: 12 }, 'kg') + ' (aquecimento)',
);

console.log('Séries válidas:', countWorkingSets(session));

console.log(findExerciseName(exercises, 'ex-err'));
console.log(formatWeight(80, 'kg'));
console.log(formatWeight(80, 'lb'));

console.log(treinoA.name, '-', treinoA.exercises.length, 'exercícios');
console.log('Catálogo com', exercises.length, 'exercícios');
*/