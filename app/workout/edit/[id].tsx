import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useExercises } from '@/hooks/use-exercises';
import { useWorkouts } from '@/hooks/use-workouts';
import { WorkoutWithExercises } from '@/types/workout';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface SelectedExercise {
  id?: string;
  exercise_id: string;
  exercise_name: string;
  sets: number;
  reps: number;
  order_index: number;
}

export default function EditWorkoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [workout, setWorkout] = useState<WorkoutWithExercises | null>(null);
  const [name, setName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { updateWorkout, getWorkoutById } = useWorkouts();
  const { exercises, exercisesByCategory, getCategories, getExerciseById } = useExercises();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    loadWorkout();
  }, [id]);

  async function loadWorkout() {
    try {
      const data = await getWorkoutById(id);
      
      if (!data) {
        throw new Error('Treino não encontrado');
      }

      setWorkout(data);
      setName(data.name);
      
      // Converter workout_exercises para SelectedExercise
      const exercises: SelectedExercise[] = (data.workout_exercises || []).map((we) => ({
        id: we.id,
        exercise_id: we.exercise_id,
        exercise_name: we.exercise?.name || 'Exercício desconhecido',
        sets: we.sets,
        reps: we.reps,
        order_index: we.order_index,
      }));
      
      setSelectedExercises(exercises);
    } catch (error: any) {
      Alert.alert('Erro', error.message);
      router.back();
    } finally {
      setLoading(false);
    }
  }

  function handleAddExercise(exercise: any) {
    const newExercise: SelectedExercise = {
      exercise_id: exercise.id,
      exercise_name: exercise.name,
      sets: 3,
      reps: 12,
      order_index: selectedExercises.length,
    };
    setSelectedExercises([...selectedExercises, newExercise]);
    setShowModal(false);
    setSelectedCategory(null);
  }

  function handleRemoveExercise(index: number) {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  }

  function updateExercise(index: number, field: 'sets' | 'reps', value: number) {
    const updated = [...selectedExercises];
    updated[index][field] = value;
    setSelectedExercises(updated);
  }

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert('Atenção', 'Digite um nome para o treino');
      return;
    }

    if (selectedExercises.length === 0) {
      Alert.alert('Atenção', 'Adicione pelo menos um exercício');
      return;
    }

    try {
      setSaving(true);
      await updateWorkout(id, {
        name,
        exercises: selectedExercises.map((ex, index) => ({
          exercise_id: ex.exercise_id,
          sets: ex.sets,
          reps: ex.reps,
          order_index: index,
        })),
      });
      router.back();
    } catch (error) {
      // Erro já tratado no hook
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.tint} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <ThemedText style={styles.backButton}>← Voltar</ThemedText>
            </TouchableOpacity>
            <ThemedText type="title">Editar Treino</ThemedText>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Nome do Treino *</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { 
                    color: colors.text, 
                    borderColor: colors.icon,
                    backgroundColor: colors.background 
                  }
                ]}
                placeholder="Ex: Treino A - Peito e Tríceps"
                placeholderTextColor={colors.icon}
                value={name}
                onChangeText={setName}
                editable={!saving}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Exercícios *</ThemedText>
              
              {selectedExercises.map((ex, index) => (
                <View key={index} style={[styles.exerciseCard, { borderColor: colors.icon }]}>
                  <View style={styles.exerciseHeader}>
                    <ThemedText style={styles.exerciseName}>{ex.exercise_name}</ThemedText>
                    <TouchableOpacity onPress={() => handleRemoveExercise(index)}>
                      <IconSymbol size={20} name="trash" color={colors.icon} />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.exerciseInputs}>
                    <View style={styles.smallInputGroup}>
                      <ThemedText style={styles.smallLabel}>Séries</ThemedText>
                      <TextInput
                        style={[styles.smallInput, { color: colors.text, borderColor: colors.icon }]}
                        keyboardType="number-pad"
                        value={String(ex.sets)}
                        onChangeText={(text) => updateExercise(index, 'sets', parseInt(text) || 0)}
                      />
                    </View>
                    
                    <View style={styles.smallInputGroup}>
                      <ThemedText style={styles.smallLabel}>Repetições</ThemedText>
                      <TextInput
                        style={[styles.smallInput, { color: colors.text, borderColor: colors.icon }]}
                        keyboardType="number-pad"
                        value={String(ex.reps)}
                        onChangeText={(text) => updateExercise(index, 'reps', parseInt(text) || 0)}
                      />
                    </View>
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={[styles.addExerciseButton, { borderColor: colors.tint }]}
                onPress={() => setShowModal(true)}
              >
                <ThemedText style={[styles.addExerciseText, { color: colors.tint }]}>
                  + Adicionar Exercício
                </ThemedText>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.saveButton,
                { backgroundColor: colors.buttonPrimary || colors.tint },
                saving && styles.buttonDisabled
              ]}
              onPress={handleSave}
              disabled={saving}
            >
              <IconSymbol size={22} name="checkmark.circle.fill" color={colors.buttonPrimaryText || '#fff'} />
              <ThemedText style={[
                styles.saveButtonText,
                { color: colors.buttonPrimaryText || '#fff' }
              ]}>
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de Seleção de Exercícios */}
      <Modal visible={showModal} animationType="slide" transparent={false}>
        <ThemedView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText type="title">Selecionar Exercício</ThemedText>
            <TouchableOpacity onPress={() => {
              setShowModal(false);
              setSelectedCategory(null);
            }}>
              <ThemedText style={styles.closeButton}>✕</ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedCategory === null ? (
              <>
                <ThemedText style={styles.modalTitle}>Escolha uma categoria:</ThemedText>
                {getCategories().map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[styles.categoryButton, { borderColor: colors.icon }]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <ThemedText style={styles.categoryButtonText}>{category}</ThemedText>
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <>
                <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                  <ThemedText style={styles.backButton}>← Voltar para categorias</ThemedText>
                </TouchableOpacity>
                <ThemedText style={styles.modalTitle}>{selectedCategory}</ThemedText>
                {exercisesByCategory[selectedCategory]?.map((exercise) => (
                  <TouchableOpacity
                    key={exercise.id}
                    style={[styles.exerciseButton, { borderColor: colors.icon }]}
                    onPress={() => handleAddExercise(exercise)}
                  >
                    <ThemedText style={styles.exerciseButtonText}>{exercise.name}</ThemedText>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </ScrollView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 30,
  },
  backButton: {
    fontSize: 16,
    marginBottom: 10,
    color: '#0a7ea4',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  exerciseCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    fontSize: 20,
  },
  exerciseInputs: {
    flexDirection: 'row',
    gap: 15,
  },
  smallInputGroup: {
    flex: 1,
  },
  smallLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  smallInput: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  addExerciseButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addExerciseText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  modalContainer: {
    flex: 1,
    paddingTop: 60,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  categoryButton: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  categoryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseButton: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  exerciseButtonText: {
    fontSize: 16,
  },
});
