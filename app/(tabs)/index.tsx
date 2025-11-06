import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWorkouts } from '@/hooks/use-workouts';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { workouts, loading, refreshWorkouts } = useWorkouts();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  // Estatísticas
  const stats = {
    daysStreak: 7,
    monthWorkouts: workouts.length,
    goalsAchieved: 3,
    totalWorkouts: 45,
  };

  // Treino do dia (exemplo - pegar o primeiro)
  const todayWorkout = workouts[0];

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.headerTop}>
            <IconSymbol size={28} name="figure.strengthtraining.traditional" color={colors.accent} />
            <ThemedText style={styles.logo}>GymApp</ThemedText>
          </View>
          <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
            Seu treino, seu ritmo
          </ThemedText>
        </View>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.accent }]}
          onPress={() => router.push('/workout/add' as any)}
        >
          <IconSymbol size={24} name="plus" color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Saudação */}
      <View style={styles.greeting}>
        <ThemedText style={styles.greetingDate}>
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </ThemedText>
        <ThemedText style={styles.greetingText}>Olá, Atleta! 💪</ThemedText>
        <ThemedText style={[styles.greetingSubtext, { color: colors.textSecondary }]}>
          Pronto para treinar hoje?
        </ThemedText>
      </View>

      {/* Cards de Estatísticas */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: colors.backgroundCard }]}>
          <View style={[styles.statIcon, { backgroundColor: colors.accent + '20' }]}>
            <IconSymbol size={24} name="flame" color={colors.accent} />
          </View>
          <ThemedText style={styles.statValue}>{stats.daysStreak}</ThemedText>
          <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
            Dias seguidos
          </ThemedText>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.backgroundCard }]}>
          <View style={[styles.statIcon, { backgroundColor: colors.cyan + '20' }]}>
            <IconSymbol size={24} name="chart.bar" color={colors.cyan} />
          </View>
          <ThemedText style={styles.statValue}>{stats.monthWorkouts}/{stats.monthWorkouts + 3}</ThemedText>
          <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
            Treinos do mês
          </ThemedText>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.backgroundCard }]}>
          <View style={[styles.statIcon, { backgroundColor: colors.orange + '20' }]}>
            <IconSymbol size={24} name="trophy" color={colors.orange} />
          </View>
          <ThemedText style={styles.statValue}>{stats.goalsAchieved}</ThemedText>
          <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
            Objetivos alcançados
          </ThemedText>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.backgroundCard }]}>
          <View style={[styles.statIcon, { backgroundColor: colors.pink + '20' }]}>
            <IconSymbol size={24} name="calendar" color={colors.pink} />
          </View>
          <ThemedText style={styles.statValue}>{stats.totalWorkouts}</ThemedText>
          <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
            Total de treinos
          </ThemedText>
        </View>
      </View>

      {/* Treino de Hoje */}
      {todayWorkout && (
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Treino de Hoje</ThemedText>
          <View style={[styles.todayCard, { backgroundColor: colors.backgroundCard }]}>
            <View style={styles.todayCardHeader}>
              <View>
                <ThemedText style={styles.todayWorkoutName}>{todayWorkout.name}</ThemedText>
                <ThemedText style={[styles.todayWorkoutInfo, { color: colors.textSecondary }]}>
                  {todayWorkout.workout_exercises?.length || 0} exercícios • ~45 min
                </ThemedText>
              </View>
              <View style={[styles.flameIcon, { backgroundColor: colors.accent + '20' }]}>
                <IconSymbol size={24} name="flame.fill" color={colors.accent} />
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.startButton, { backgroundColor: colors.accent }]}
              onPress={() => router.push(`/workout/edit/${todayWorkout.id}` as any)}
            >
              <ThemedText style={styles.startButtonText}>Iniciar Treino</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Ações Rápidas */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Ações Rápidas</ThemedText>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: colors.backgroundCard }]}
            onPress={() => router.push('/workout/add' as any)}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.purple + '20' }]}>
              <IconSymbol size={28} name="plus" color={colors.purple} />
            </View>
            <ThemedText style={styles.actionLabel}>Novo Treino</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: colors.backgroundCard }]}
            onPress={() => {/* Navigate to history */}}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.blue + '20' }]}>
              <IconSymbol size={28} name="chart.bar.doc.horizontal" color={colors.blue} />
            </View>
            <ThemedText style={styles.actionLabel}>Histórico</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    marginBottom: 24,
  },
  greetingDate: {
    fontSize: 14,
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  greetingSubtext: {
    fontSize: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  todayCard: {
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  todayCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  todayWorkoutName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  todayWorkoutInfo: {
    fontSize: 14,
  },
  flameIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});
