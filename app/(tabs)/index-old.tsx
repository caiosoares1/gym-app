import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWorkouts } from '@/hooks/use-workouts';
import { WorkoutWithExercises } from '@/types/workout';
import { router } from 'expo-router';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

export default function HomeScreen() {
  const { 
    workouts, 
    loading, 
    refreshing, 
    refreshWorkouts, 
    deleteWorkout 
  } = useWorkouts();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  function handleDeleteWorkout(workout: WorkoutWithExercises) {
    Alert.alert(
      'Excluir Treino',
      `Deseja realmente excluir "${workout.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => deleteWorkout(workout.id)
        }
      ]
    );
  }

  function renderWorkoutItem({ item }: { item: WorkoutWithExercises }) {
    const createdDate = new Date(item.created_at).toLocaleDateString('pt-BR');
    const exerciseCount = item.workout_exercises?.length || 0;
    
    return (
      <View style={[styles.workoutCard, { backgroundColor: colors.background, borderColor: colors.icon }]}>
        <View style={styles.workoutInfo}>
          <ThemedText type="subtitle">{item.name}</ThemedText>
          <ThemedText style={styles.exerciseCount}>
            {exerciseCount} exercício(s)
          </ThemedText>
          <ThemedText style={styles.date}>Criado em: {createdDate}</ThemedText>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => router.push(`/workout/edit/${item.id}` as any)}
          >
            <IconSymbol size={18} name="pencil" color="#fff" />
            <ThemedText style={styles.actionButtonText}>Editar</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteWorkout(item)}
          >
            <IconSymbol size={18} name="trash" color="#fff" />
            <ThemedText style={styles.actionButtonText}>Excluir</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Meus Treinos</ThemedText>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.buttonPrimary || colors.tint }]}
          onPress={() => router.push('/workout/add' as any)}
        >
          <IconSymbol size={20} name="plus.circle.fill" color={colors.buttonPrimaryText || '#fff'} />
          <ThemedText style={[styles.addButtonText, { color: colors.buttonPrimaryText || '#fff' }]}>
            Novo Treino
          </ThemedText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={workouts}
        renderItem={renderWorkoutItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshWorkouts} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              Nenhum treino cadastrado ainda.
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Toque em "+ Novo Treino" para começar!
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  workoutCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workoutInfo: {
    marginBottom: 15,
  },
  exerciseCount: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 5,
  },
  date: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 5,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  editButton: {
    backgroundColor: '#0a7ea4',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
  },
});
