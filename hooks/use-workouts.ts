import { supabase } from '@/lib/supabase';
import {
    CreateWorkoutInput,
    UpdateWorkoutInput,
    WorkoutWithExercises
} from '@/types/workout';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<WorkoutWithExercises[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  async function fetchWorkouts() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Silenciosamente não fazer nada se não estiver autenticado
        setWorkouts([]);
        setLoading(false);
        return;
      }

      // Buscar treinos com seus exercícios
      const { data, error } = await supabase
        .from('workouts')
        .select(`
          *,
          workout_exercises (
            *,
            exercise:exercises (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setWorkouts(data || []);
    } catch (error: any) {
      Alert.alert('Erro ao carregar treinos', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function refreshWorkouts() {
    setRefreshing(true);
    await fetchWorkouts();
    setRefreshing(false);
  }

  async function createWorkout(input: CreateWorkoutInput) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // 1. Criar o treino
      const { data: workout, error: workoutError } = await supabase
        .from('workouts')
        .insert([{
          user_id: user.id,
          name: input.name,
        }])
        .select()
        .single();

      if (workoutError) throw workoutError;

      // 2. Criar os exercícios do treino
      if (input.exercises.length > 0) {
        const exercisesToInsert = input.exercises.map(ex => ({
          workout_id: workout.id,
          exercise_id: ex.exercise_id,
          sets: ex.sets,
          reps: ex.reps,
          order_index: ex.order_index,
        }));

        const { error: exercisesError } = await supabase
          .from('workout_exercises')
          .insert(exercisesToInsert);

        if (exercisesError) throw exercisesError;
      }

      Alert.alert('Sucesso!', 'Treino criado com sucesso');
      await fetchWorkouts();
      return workout;
    } catch (error: any) {
      Alert.alert('Erro ao criar treino', error.message);
      throw error;
    }
  }

  async function updateWorkout(id: string, input: UpdateWorkoutInput) {
    try {
      // 1. Atualizar o treino
      const { error: workoutError } = await supabase
        .from('workouts')
        .update({ name: input.name })
        .eq('id', id);

      if (workoutError) throw workoutError;

      // 2. Deletar exercícios antigos
      const { error: deleteError } = await supabase
        .from('workout_exercises')
        .delete()
        .eq('workout_id', id);

      if (deleteError) throw deleteError;

      // 3. Inserir novos exercícios
      if (input.exercises.length > 0) {
        const exercisesToInsert = input.exercises.map(ex => ({
          workout_id: id,
          exercise_id: ex.exercise_id,
          sets: ex.sets,
          reps: ex.reps,
          order_index: ex.order_index,
        }));

        const { error: insertError } = await supabase
          .from('workout_exercises')
          .insert(exercisesToInsert);

        if (insertError) throw insertError;
      }

      Alert.alert('Sucesso!', 'Treino atualizado com sucesso');
      await fetchWorkouts();
    } catch (error: any) {
      Alert.alert('Erro ao atualizar treino', error.message);
      throw error;
    }
  }

  async function deleteWorkout(id: string) {
    try {
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setWorkouts(workouts.filter(w => w.id !== id));
      Alert.alert('Sucesso!', 'Treino excluído com sucesso');
    } catch (error: any) {
      Alert.alert('Erro ao excluir treino', error.message);
      throw error;
    }
  }

  async function getWorkoutById(id: string): Promise<WorkoutWithExercises | null> {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select(`
          *,
          workout_exercises (
            *,
            exercise:exercises (*)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      Alert.alert('Erro ao carregar treino', error.message);
      return null;
    }
  }

  return {
    workouts,
    loading,
    refreshing,
    fetchWorkouts,
    refreshWorkouts,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    getWorkoutById,
  };
}
