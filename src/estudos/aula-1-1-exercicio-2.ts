
type Equipment = 'barbell' | "dumbbell" | "machine" | "bodyweight";

interface LibraryExercise {
  id: string;
  name: string;
  equipment: Equipment;
  notes?: string;
}

function equipmentLabel(equipment: Equipment): string {
  switch (equipment) {
    case 'barbell':
      return 'Barra';
    case 'dumbbell':
      return 'Halter';
    case 'machine':
      return 'Máquina';
    case 'bodyweight':
      return 'Peso corporal';
  }
}

type NewLibraryExercise = Omit<LibraryExercise, 'id'>;

const squat: NewLibraryExercise = {
    name: 'Agachamento smith',
    equipment: 'machine',
};

console.log(squat.name, '-', equipmentLabel(squat.equipment));