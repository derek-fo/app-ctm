import type { Equipment, Id, MuscleGroup } from './common';

// Como as séries deste exercício são registradas.
export type TrackingType = 'weight-reps' | 'reps' | 'time';

// Uma "ficha" do catálogo de exercícios.
export interface Exercise {
  id: Id;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  trackingType: TrackingType;
  isCustom: boolean; // true = criado pelo usuário; false = veio da biblioteca
  notes?: string;
}