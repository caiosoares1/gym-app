// Exercício da biblioteca
export interface Exercise {
  id: string;
  name: string;
  category: string;
  created_at: string;
}

// Treino
export interface Workout {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// Exercício dentro de um treino (com séries e repetições)
export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  sets: number;
  reps: number;
  order_index: number;
  created_at: string;
  // Dados joinados do exercício
  exercise?: Exercise;
}

// Treino completo com exercícios
export interface WorkoutWithExercises extends Workout {
  workout_exercises: WorkoutExercise[];
}

// Input para criar treino
export interface CreateWorkoutInput {
  name: string;
  exercises: {
    exercise_id: string;
    sets: number;
    reps: number;
    order_index: number;
  }[];
}

// Input para atualizar treino
export interface UpdateWorkoutInput {
  name: string;
  exercises: {
    id?: string; // Se existir, atualiza; se não, cria
    exercise_id: string;
    sets: number;
    reps: number;
    order_index: number;
  }[];
}
