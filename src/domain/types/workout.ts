import type { Id } from './common';

// ---------- O PLANO (a ficha do personal) ----------

// Um exercício dentro de uma rotina, com as metas planejadas.
export interface TemplateExercise {
  exerciseId: Id; // aponta para o catálogo; não é uma cópia do exercício
  targetSets: number;
  targetReps?: number; // metas opcionais: dependem do tipo de exercício
  targetWeightKg?: number;
  targetDurationSeconds?: number;
  restSeconds: number;
}

export interface WorkoutTemplate {
  id: Id;
  name: string; // ex.: "Treino A — Peito e Tríceps"
  exercises: TemplateExercise[];
  createdAt: string; // instante em UTC, formato ISO 8601 (detalhes no Módulo 8)
}

// ---------- O REGISTRO (o que foi feito de verdade) ----------

// Campos comuns a qualquer série.
export interface BaseSetEntry {
  id: Id;
  isWarmup: boolean; // séries de aquecimento não contam nas métricas
}

export interface WeightRepsSetEntry extends BaseSetEntry {
  kind: 'weight-reps';
  weightKg: number; // sempre em kg por dentro
  reps: number;
}

export interface RepsSetEntry extends BaseSetEntry {
  kind: 'reps';
  reps: number;
}

export interface TimeSetEntry extends BaseSetEntry {
  kind: 'time';
  durationSeconds: number;
}

// A união discriminada: a "pulseira" kind diz quais campos existem.
export type SetEntry = WeightRepsSetEntry | RepsSetEntry | TimeSetEntry;

// Um exercício dentro de uma sessão, com as séries realmente feitas.
export interface SessionExercise {
  exerciseId: Id;
  sets: SetEntry[];
}

export interface WorkoutSession {
  id: Id;
  templateId?: Id; // ausente em treinos livres, sem rotina
  startedAt: string; // UTC ISO 8601
  endedAt?: string; // ausente enquanto o treino está em andamento
  exercises: SessionExercise[];
  notes?: string;
}