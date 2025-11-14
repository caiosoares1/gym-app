import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useExercises } from '@/hooks/use-exercises';
import { useWorkouts } from '@/hooks/use-workouts';
import { Exercise } from '@/types/workout';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
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
  exercise_id: string;
  exercise_name: string;
  sets: number;
  reps: number;
  order_index: number;
}

export default function AddWorkoutScreen() {
  const [name, setName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { createWorkout } = useWorkouts();
  const { exercises, exercisesByCategory, getCategories, loading: loadingExercises } = useExercises();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const categories = useMemo(() => getCategories(), [exercises]);

  function handleAddExercise(exercise: Exercise) {
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
      setLoading(true);
      await createWorkout({
        name,
        exercises: selectedExercises.map(ex => ({
          exercise_id: ex.exercise_id,
          sets: ex.sets,
          reps: ex.reps,
          order_index: ex.order_index,
        })),
      });
      router.back();
    } catch (error) {
      // Erro já tratado no hook
    } finally {
      setLoading(false);
    }
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
            <ThemedText type="title">Novo Treino</ThemedText>
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
                editable={!loading}
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
                { backgroundColor: colors.accent },
                loading && styles.buttonDisabled
              ]}
              onPress={handleSave}
              disabled={loading}
              accessibilityLabel="Salvar treino"
              accessibilityHint="Salva o treino com os exercícios selecionados"
              accessibilityRole="button"
            >
              <IconSymbol size={22} name="checkmark.circle.fill" color={colors.buttonPrimaryText || '#fff'} />
              <ThemedText style={[
                styles.saveButtonText,
                { color: colors.buttonPrimaryText || '#fff' }
              ]}>
                {loading ? 'Salvando...' : 'Salvar Treino'}
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
              // Mostrar categorias
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
              // Mostrar exercícios da categoria
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  backButton: {
    fontSize: 16,
    marginBottom: 10,
    color: '#FF5722',
    fontWeight: '600',
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
    borderRadius: 12,
    fontSize: 16,
  },
  exerciseCard: {
    borderWidth: 0,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    fontWeight: '600',
  },
  addExerciseButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  addExerciseText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#FF5722',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '700',
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
    borderWidth: 0,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  exerciseButton: {
    borderWidth: 0,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
