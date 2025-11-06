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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WorkoutsScreen() {
  const { 
    workouts, 
    loading, 
    refreshing, 
    refreshWorkouts, 
    deleteWorkout 
  } = useWorkouts();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

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
    const exerciseCount = item.workout_exercises?.length || 0;
    
    return (
      <TouchableOpacity 
        style={[styles.workoutCard, { backgroundColor: colors.backgroundCard }]}
        onPress={() => router.push(`/workout/edit/${item.id}` as any)}
      >
        <View style={styles.workoutHeader}>
          <View style={styles.workoutInfo}>
            <ThemedText style={styles.workoutName}>{item.name}</ThemedText>
            <ThemedText style={[styles.workoutMeta, { color: colors.textSecondary }]}>
              {exerciseCount} exercícios • ~45 min
            </ThemedText>
          </View>
          <TouchableOpacity 
            style={[styles.deleteButton, { backgroundColor: colors.error + '20' }]}
            onPress={() => handleDeleteWorkout(item)}
          >
            <IconSymbol size={20} name="trash" color={colors.error} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Meus Treinos</ThemedText>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.accent }]}
          onPress={() => router.push('/workout/add' as any)}
        >
          <IconSymbol size={24} name="plus" color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={workouts}
        renderItem={renderWorkoutItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={refreshWorkouts}
            tintColor={colors.accent}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.backgroundCard }]}>
              <IconSymbol size={48} name="figure.strengthtraining.traditional" color={colors.textSecondary} />
            </View>
            <ThemedText style={styles.emptyText}>
              Nenhum treino cadastrado
            </ThemedText>
            <ThemedText style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Toque no + para criar seu primeiro treino!
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
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    gap: 12,
    paddingBottom: 100,
  },
  workoutCard: {
    padding: 16,
    borderRadius: 16,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutInfo: {
    flex: 1,
    gap: 4,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: '600',
  },
  workoutMeta: {
    fontSize: 14,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 100,
    gap: 16,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});
