import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWorkouts } from '@/hooks/use-workouts';
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

  // Dados da semana (exemplo)
  const weekActivity = [
    { day: 'Seg', active: true },
    { day: 'Ter', active: true },
    { day: 'Qua', active: true },
    { day: 'Qui', active: false },
    { day: 'Sex', active: false },
    { day: 'Sáb', active: false },
    { day: 'Dom', active: false },
  ];

  const thisWeekWorkouts = 3;
  const lastWeekWorkouts = 2;
  const percentChange = ((thisWeekWorkouts - lastWeekWorkouts) / lastWeekWorkouts) * 100;

  const calories = 2.4;
  const avgWeeklyCalories = 2.1;

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

      {/* Recordes Pessoais */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Recordes Pessoais</ThemedText>
        
        <View style={[styles.recordCard, { backgroundColor: colors.backgroundCard }]}>
          <View style={styles.recordHeader}>
            <View style={[styles.recordIcon, { backgroundColor: colors.blue + '20' }]}>
              <IconSymbol size={20} name="figure.strengthtraining.traditional" color={colors.blue} />
            </View>
            <View style={styles.recordInfo}>
              <ThemedText style={styles.recordName}>Supino Reto</ThemedText>
              <ThemedText style={[styles.recordMeta, { color: colors.textSecondary }]}>
                Peso máximo
              </ThemedText>
            </View>
          </View>
          <View style={styles.recordValue}>
            <ThemedText style={styles.recordNumber}>80kg</ThemedText>
            <ThemedText style={[styles.recordChange, { color: colors.green }]}>
              +5kg este mês
            </ThemedText>
          </View>
        </View>

        <View style={[styles.recordCard, { backgroundColor: colors.backgroundCard }]}>
          <View style={styles.recordHeader}>
            <View style={[styles.recordIcon, { backgroundColor: colors.blue + '20' }]}>
              <IconSymbol size={20} name="figure.strengthtraining.traditional" color={colors.blue} />
            </View>
            <View style={styles.recordInfo}>
              <ThemedText style={styles.recordName}>Agachamento</ThemedText>
              <ThemedText style={[styles.recordMeta, { color: colors.textSecondary }]}>
                Peso máximo
              </ThemedText>
            </View>
          </View>
          <View style={styles.recordValue}>
            <ThemedText style={styles.recordNumber}>120kg</ThemedText>
            <ThemedText style={[styles.recordChange, { color: colors.green }]}>
              +10kg este mês
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
});
