import type { Id } from './common';

export type CardioType = 'run' | 'walk' | 'ride';

// Uma atividade de cardio com GPS. A rota em si entra no Módulo 10.
export interface CardioActivity {
  id: Id;
  type: CardioType;
  startedAt: string; // UTC ISO 8601
  durationSeconds: number;
  distanceMeters: number; // metros: é o que o GPS entrega e evita casas decimais
  notes?: string;
}