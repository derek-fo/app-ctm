// src/domain/workout/count-working-sets.ts
import type { WorkoutSession } from '@/domain/types/workout';

// Conta as séries válidas da sessão: as que não são aquecimento.
export function countWorkingSets(session: WorkoutSession): number {
  let count = 0;

  for (const sessionExercise of session.exercises) {
    for (const set of sessionExercise.sets) {
      if (!set.isWarmup) {
        count += 1;
      }
    }
  }

  return count;
}