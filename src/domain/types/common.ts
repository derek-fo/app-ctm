export type Id = string;

export type WeightUnit = 'kg' | 'lb';
export type DistanceUnit = 'km' | 'mi';

export interface UnitPreferences {
  weight: WeightUnit;
  distance: DistanceUnit;
}

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'lower body'
  | 'core'
  | 'full-body';

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'machine'
  | 'cable'
  | 'bodyweight'
  | 'kettlebell'
  | 'band';