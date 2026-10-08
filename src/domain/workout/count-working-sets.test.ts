// src/domain/workout/count-working-sets.test.ts
import type { SetEntry, WorkoutSession } from '@/domain/types/workout';
import { countWorkingSets } from '../workout/count-working-sets';

// ---------- Dados de teste ----------

const workingSet: SetEntry = { id: 's1', kind: 'weight-reps', isWarmup: false, weightKg: 80, reps: 10 };
const warmupSet: SetEntry = { id: 's2', kind: 'weight-reps', isWarmup: true, weightKg: 40, reps: 12 };

// Monta uma sessão de teste só com o que importa: as séries de cada exercício.
// Cada lista interna representa um exercício.
function makeSession(setsPerExercise: SetEntry[][]): WorkoutSession {
  return {
    id: 'session-test',
    startedAt: '2026-10-07T12:00:00.000Z',
    // map transforma cada lista de séries num SessionExercise.
    exercises: setsPerExercise.map((sets, index) => ({ exerciseId: `ex-${index}`, sets })),
  };
}


// ---------- Testes ----------

describe('countWorkingSets', () => {
  it('devolve 0 para uma sessão sem exercícios', () => {
    const session = makeSession([]);
    expect(countWorkingSets(session)).toBe(0);
  });

  it('conta as séries válidas de um exercício', () => {
    const session = makeSession([[workingSet, workingSet]]);
    expect(countWorkingSets(session)).toBe(2);
  });

  it('ignora as séries de aquecimento', () => {
    const session = makeSession([[warmupSet, workingSet]]);
    expect(countWorkingSets(session)).toBe(1);
  });

  it('soma as séries de vários exercícios', () => {
    const session = makeSession([[workingSet], [workingSet, workingSet]]);
    expect(countWorkingSets(session)).toBe(3);
  });
});