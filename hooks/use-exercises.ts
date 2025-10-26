import { supabase } from '@/lib/supabase';
import { Exercise } from '@/types/workout';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [exercisesByCategory, setExercisesByCategory] = useState<Record<string, Exercise[]>>({});

  useEffect(() => {
    fetchExercises();
  }, []);

  async function fetchExercises() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('category, name');

      if (error) throw error;

      setExercises(data || []);
      
      // Agrupar por categoria
      const grouped = (data || []).reduce((acc, exercise) => {
        const category = exercise.category || 'Outros';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(exercise);
        return acc;
      }, {} as Record<string, Exercise[]>);
      
      setExercisesByCategory(grouped);
    } catch (error: any) {
      Alert.alert('Erro ao carregar exercícios', error.message);
    } finally {
      setLoading(false);
    }
  }

  function getExerciseById(id: string): Exercise | undefined {
    return exercises.find(ex => ex.id === id);
  }

  function getExercisesByCategory(category: string): Exercise[] {
    return exercisesByCategory[category] || [];
  }

  function getCategories(): string[] {
    return Object.keys(exercisesByCategory).sort();
  }

  return {
    exercises,
    exercisesByCategory,
    loading,
    fetchExercises,
    getExerciseById,
    getExercisesByCategory,
    getCategories,
  };
}
