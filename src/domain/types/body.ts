import type { Id } from './common';

// Uma medição do corpo num dia. Todos os campos de medida são opcionais:
// o usuário pode registrar só o peso, ou só a cintura.
export interface BodyMeasurement {
  id: Id;
  measuredAt: string; // UTC ISO 8601
  weightKg?: number;
  bodyFatPercent?: number;
  waistCm?: number;
  chestCm?: number;
  armCm?: number;
  thighCm?: number;
}