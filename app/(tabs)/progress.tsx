import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWorkouts } from '@/hooks/use-workouts';
import { useMemo } from 'react';
import {
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProgressScreen() {
  const { workouts } = useWorkouts();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  // Calcular dados reais da semana com otimização
  const weekData = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    
    const thisWeekWorkouts = workouts.filter(w => {
      const workoutDate = new Date(w.created_at);
      return workoutDate >= startOfWeek && workoutDate < endOfWeek;
    }).length;
    
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfWeek.getDate() - 7);
    const lastWeekWorkouts = workouts.filter(w => {
      const workoutDate = new Date(w.created_at);
      return workoutDate >= startOfLastWeek && workoutDate < startOfWeek;
    }).length;
    
    const percentChange = lastWeekWorkouts > 0 
      ? ((thisWeekWorkouts - lastWeekWorkouts) / lastWeekWorkouts) * 100 
      : thisWeekWorkouts > 0 ? 100 : 0;
    
    const weekActivity = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + index);
      dayDate.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(dayDate);
      nextDay.setDate(dayDate.getDate() + 1);
      
      const hasWorkout = workouts.some(w => {
        const workoutDate = new Date(w.created_at);
        return workoutDate >= dayDate && workoutDate < nextDay;
      });
      
      return { day, active: hasWorkout };
    });
    
    const calories = (thisWeekWorkouts * 0.15).toFixed(1);
    const totalWorkouts = workouts.length;
    const avgWeeklyCalories = totalWorkouts > 0 
      ? ((totalWorkouts * 0.15) / Math.max(1, Math.ceil(totalWorkouts / 7))).toFixed(1) 
      : '0.0';
    
    return {
      thisWeekWorkouts,
      lastWeekWorkouts,
      percentChange,
      weekActivity,
      calories,
      avgWeeklyCalories,
    };
  }, [workouts]);
  
  const { thisWeekWorkouts, percentChange, weekActivity, calories, avgWeeklyCalories } = weekData;

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>Seu Progresso</ThemedText>
      </View>

      {workouts.length === 0 && (
        <View style={[styles.emptyCard, { backgroundColor: colors.backgroundCard }]}>
          <IconSymbol size={64} name="chart.bar.fill" color={colors.textSecondary} />
          <ThemedText style={[styles.emptyTitle, { color: colors.text }]}>
            Comece a treinar!
          </ThemedText>
          <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
            Seus dados de progresso aparecerão aqui assim que você registrar seu primeiro treino.
          </ThemedText>
        </View>
      )}

      {/* Cards de Progresso Semanal */}
      <View style={styles.section}>
        <View style={styles.progressCards}>
          <View style={[styles.progressCard, { backgroundColor: colors.backgroundCard }]}>
            <View style={[styles.progressIcon, { backgroundColor: colors.green + '20' }]}>
              <IconSymbol size={20} name="chart.line.uptrend.xyaxis" color={colors.green} />
            </View>
            <ThemedText style={[styles.progressLabel, { color: colors.textSecondary }]}>
              Esta semana
            </ThemedText>
            <ThemedText style={styles.progressValue}>{thisWeekWorkouts} treinos</ThemedText>
            <ThemedText style={[styles.progressChange, { color: colors.green }]}>
              +{percentChange.toFixed(0)}% vs semana anterior
            </ThemedText>
          </View>

          <View style={[styles.progressCard, { backgroundColor: colors.backgroundCard }]}>
            <View style={[styles.progressIcon, { backgroundColor: colors.orange + '20' }]}>
              <IconSymbol size={20} name="flame.fill" color={colors.orange} />
            </View>
            <ThemedText style={[styles.progressLabel, { color: colors.textSecondary }]}>
              Calorias
            </ThemedText>
            <ThemedText style={styles.progressValue}>{calories}k</ThemedText>
            <ThemedText style={[styles.progressChange, { color: colors.orange }]}>
              Média semanal
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Atividade Semanal */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Atividade Semanal</ThemedText>
        <View style={[styles.activityCard, { backgroundColor: colors.backgroundCard }]}>
          <View style={styles.activityGrid}>
            {weekActivity.map((item, index) => (
              <View key={index} style={styles.activityDay}>
                <View 
                  style={[
                    styles.activityIndicator,
                    { 
                      backgroundColor: item.active 
                        ? colors.accent 
                        : colors.backgroundCardLight 
                    }
                  ]}
                />
                <ThemedText style={[styles.dayLabel, { color: colors.textSecondary }]}>
                  {item.day}
                </ThemedText>
              </View>
            ))}
          </View>
          <View style={styles.activitySummary}>
            <ThemedText style={[styles.activityText, { color: colors.textSecondary }]}>
              Meta Semanal
            </ThemedText>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { 
                    backgroundColor: colors.accent,
                    width: '60%'
                  }
                ]} 
              />
            </View>
            <ThemedText style={[styles.activityText, { color: colors.textSecondary }]}>
              3/5 treinos
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Resumo de Treinos */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Resumo Geral</ThemedText>
        
        <View style={[styles.recordCard, { backgroundColor: colors.backgroundCard }]}>
          <View style={styles.recordHeader}>
            <View style={[styles.recordIcon, { backgroundColor: colors.blue + '20' }]}>
              <IconSymbol size={20} name="figure.strengthtraining.traditional" color={colors.blue} />
            </View>
            <View style={styles.recordInfo}>
              <ThemedText style={styles.recordName}>Total de Treinos</ThemedText>
              <ThemedText style={[styles.recordMeta, { color: colors.textSecondary }]}>
                Desde o início
              </ThemedText>
            </View>
          </View>
          <View style={styles.recordValue}>
            <ThemedText style={styles.recordNumber}>{workouts.length}</ThemedText>
            <ThemedText style={[styles.recordChange, { color: colors.green }]}>
              {thisWeekWorkouts} esta semana
            </ThemedText>
          </View>
        </View>

        <View style={[styles.recordCard, { backgroundColor: colors.backgroundCard }]}>
          <View style={styles.recordHeader}>
            <View style={[styles.recordIcon, { backgroundColor: colors.orange + '20' }]}>
              <IconSymbol size={20} name="calendar" color={colors.orange} />
            </View>
            <View style={styles.recordInfo}>
              <ThemedText style={styles.recordName}>Exercícios Totais</ThemedText>
              <ThemedText style={[styles.recordMeta, { color: colors.textSecondary }]}>
                Em todos os treinos
              </ThemedText>
            </View>
          </View>
          <View style={styles.recordValue}>
            <ThemedText style={styles.recordNumber}>
              {workouts.reduce((sum, w) => sum + (w.workout_exercises?.length || 0), 0)}
            </ThemedText>
            <ThemedText style={[styles.recordChange, { color: colors.blue }]}>
              exercícios realizados
            </ThemedText>
          </View>
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  progressCards: {
    flexDirection: 'row',
    gap: 12,
  },
  progressCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  progressIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
  },
  progressValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  progressChange: {
    fontSize: 12,
  },
  activityCard: {
    padding: 20,
    borderRadius: 16,
    gap: 20,
  },
  activityGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  activityDay: {
    alignItems: 'center',
    gap: 8,
  },
  activityIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  dayLabel: {
    fontSize: 12,
  },
  activitySummary: {
    gap: 8,
  },
  activityText: {
    fontSize: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  recordCard: {
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  recordIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordInfo: {
    gap: 4,
  },
  recordName: {
    fontSize: 16,
    fontWeight: '600',
  },
  recordMeta: {
    fontSize: 12,
  },
  recordValue: {
    alignItems: 'flex-end',
    gap: 4,
  },
  recordNumber: {
    fontSize: 20,
    fontWeight: '700',
  },
  recordChange: {
    fontSize: 12,
  },
  emptyCard: {
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
