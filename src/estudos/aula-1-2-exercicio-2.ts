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

console.log('Séries válidas:', countWorkingSets(session));