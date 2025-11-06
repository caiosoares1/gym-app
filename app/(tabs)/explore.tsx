import { ThemedText } from '@/components/themed-text';import { ThemedText } from '@/components/themed-text';

import { IconSymbol } from '@/components/ui/icon-symbol';import { ThemedView } from '@/components/themed-view';

import { Colors } from '@/constants/theme';import { IconSymbol } from '@/components/ui/icon-symbol';

import { useColorScheme } from '@/hooks/use-color-scheme';import { Colors } from '@/constants/theme';

import { useWorkouts } from '@/hooks/use-workouts';import { useColorScheme } from '@/hooks/use-color-scheme';

import { supabase } from '@/lib/supabase';import { useWorkouts } from '@/hooks/use-workouts';

import { router } from 'expo-router';import { supabase } from '@/lib/supabase';

import { useEffect, useState } from 'react';import { router } from 'expo-router';

import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';import { useEffect, useState } from 'react';

import { useSafeAreaInsets } from 'react-native-safe-area-context';import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {

  const colorScheme = useColorScheme();export default function ProfileScreen() {

  const colors = Colors[colorScheme ?? 'light'];  const colorScheme = useColorScheme();

  const insets = useSafeAreaInsets();  const colors = Colors[colorScheme ?? 'light'];

  const { workouts } = useWorkouts();  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState<string>('');  const { workouts } = useWorkouts();

  const [loading, setLoading] = useState(false);  const [email, setEmail] = useState<string>('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    loadUser();  useEffect(() => {

  }, []);    loadUser();

  }, []);

  async function loadUser() {

    const { data: { user } } = await supabase.auth.getUser();  async function loadUser() {

    if (user?.email) {    const { data: { user } } = await supabase.auth.getUser();

      setEmail(user.email);    if (user?.email) {

    }      setEmail(user.email);

  }    }

  }

  async function handleSignOut() {

    Alert.alert(  async function handleSignOut() {

      'Sair da Conta',    Alert.alert(

      'Deseja realmente sair?',      'Sair da Conta',

      [      'Deseja realmente sair?',

        { text: 'Cancelar', style: 'cancel' },      [

        {         { text: 'Cancelar', style: 'cancel' },

          text: 'Sair',         { 

          style: 'destructive',          text: 'Sair', 

          onPress: async () => {          style: 'destructive',

            setLoading(true);          onPress: async () => {

            const { error } = await supabase.auth.signOut();            setLoading(true);

            if (error) {            const { error } = await supabase.auth.signOut();

              Alert.alert('Erro', error.message);            if (error) {

              setLoading(false);              Alert.alert('Erro', error.message);

            } else {              setLoading(false);

              router.replace('/login');            } else {

            }              router.replace('/login');

          }            }

        }          }

      ]        }

    );      ]

  }    );

  }

  // Extrair nome do email ou usar nome padrão

  const userName = email ? email.split('@')[0] : 'João da Silva';  // Extrair nome do email ou usar nome padrão

  const userInitials = userName.substring(0, 2).toUpperCase();  const userName = email ? email.split('@')[0] : 'João da Silva';

  const memberSince = 'Janeiro 2024';  const userInitials = userName.substring(0, 2).toUpperCase();

  const memberSince = 'Janeiro 2024';

  // Stats

  const stats = {  // Stats

    workouts: workouts.length,  const stats = {

    streak: 7,    workouts: workouts.length,

    goals: 3,    streak: 7,

  };    goals: 3,

  };

  const achievements = [

    { icon: 'trophy', label: '10 Treinos', count: 10, color: colors.orange, locked: false },  const achievements = [

    { icon: 'trophy', label: '7 Dias', count: 7, color: colors.orange, locked: false },    { icon: 'trophy', label: '10 Treinos', count: 10, color: colors.orange },

    { icon: 'trophy', label: '30 Treinos', count: 30, color: colors.pink, locked: false },    { icon: 'trophy', label: '7 Dias', count: 7, color: colors.orange },

    { icon: 'trophy', label: '50 Treinos', count: 50, color: colors.icon, locked: true },    { icon: 'trophy', label: '30 Treinos', count: 30, color: colors.pink },

  ];    { icon: 'trophy', label: '50 Treinos', count: 50, color: colors.icon, locked: true },

  ];

  const goals = [

    { icon: 'target', label: 'Treinar 3x por semana', progress: 3, total: 5, color: colors.orange },  const goals = [

    { icon: 'figure.arms.open', label: 'Alcançar 80/100kg', progress: 80, total: 100, color: colors.blue },    { icon: 'target', label: 'Treinar 3x por semana', progress: 3, total: 5, color: colors.orange },

  ];    { icon: 'figure.arms.open', label: 'Alcançar 80/100kg', progress: 80, total: 100, color: colors.blue },

  ];

  return (

    <ScrollView   return (

      style={[styles.container, { backgroundColor: colors.background }]}    <ScrollView 

      contentContainerStyle={[styles.content, { paddingTop: insets.top }]}      style={[styles.container, { backgroundColor: colors.background }]}

      showsVerticalScrollIndicator={false}      contentContainerStyle={[styles.content, { paddingTop: insets.top }]}

    >      showsVerticalScrollIndicator={false}

      {/* Header */}    >

      <View style={styles.header}>      {/* Header com Avatar */}

        <ThemedText style={styles.title}>GymApp</ThemedText>      <View style={styles.header}>

        <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>        <ThemedText style={styles.title}>GymApp</ThemedText>

          Seu treino, seu ritmo        <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>

        </ThemedText>          Seu treino, seu ritmo

      </View>        </ThemedText>

      </View>

      {/* Card do Perfil */}

      <View style={[styles.profileCard, { backgroundColor: colors.backgroundCard }]}>      {/* Card do Perfil */}

        <View style={[styles.avatar, { backgroundColor: colors.accent }]}>      <View style={[styles.profileCard, { backgroundColor: colors.backgroundCard }]}>

          <ThemedText style={styles.avatarText}>{userInitials}</ThemedText>        <View style={[styles.avatar, { backgroundColor: colors.accent }]}>

        </View>          <ThemedText style={styles.avatarText}>{userInitials}</ThemedText>

        <ThemedText style={styles.userName}>{userName}</ThemedText>        </View>

        <ThemedText style={[styles.memberSince, { color: colors.textSecondary }]}>        <ThemedText style={styles.userName}>{userName}</ThemedText>

          Membro desde {memberSince}        <ThemedText style={[styles.memberSince, { color: colors.textSecondary }]}>

        </ThemedText>          Membro desde {memberSince}

        </ThemedText>

        {/* Stats Row */}

        <View style={styles.statsRow}>        {/* Stats Row */}

          <View style={styles.statItem}>        <View style={styles.statsRow}>

            <ThemedText style={styles.statNumber}>{stats.workouts}</ThemedText>          <View style={styles.statItem}>

            <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>            <ThemedText style={styles.statNumber}>{stats.workouts}</ThemedText>

              Treinos            <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>

            </ThemedText>              Treinos

          </View>            </ThemedText>

          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />          </View>

          <View style={styles.statItem}>          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

            <ThemedText style={styles.statNumber}>{stats.streak}</ThemedText>          <View style={styles.statItem}>

            <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>            <ThemedText style={styles.statNumber}>{stats.streak}</ThemedText>

              Sequência            <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>

            </ThemedText>              Sequência

          </View>            </ThemedText>

          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />          </View>

          <View style={styles.statItem}>          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

            <ThemedText style={styles.statNumber}>{stats.goals}</ThemedText>          <View style={styles.statItem}>

            <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>            <ThemedText style={styles.statNumber}>{stats.goals}</ThemedText>

              Metas            <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>

            </ThemedText>              Metas

          </View>            </ThemedText>

        </View>          </View>

      </View>        </View>

      </View>

      {/* Conquistas */}

      <View style={styles.section}>      {/* Conquistas */}

        <ThemedText style={styles.sectionTitle}>Conquistas</ThemedText>      <View style={styles.section}>

        <View style={styles.achievementsGrid}>        <ThemedText style={styles.sectionTitle}>Conquistas</ThemedText>

          {achievements.map((achievement, index) => (        <View style={styles.achievementsGrid}>

            <View           {achievements.map((achievement, index) => (

              key={index}            <View 

              style={[              key={index}

                styles.achievementCard,               style={[

                { backgroundColor: achievement.locked ? colors.backgroundCardLight : colors.backgroundCard }                styles.achievementCard, 

              ]}                { backgroundColor: achievement.locked ? colors.backgroundCardLight : colors.backgroundCard }

            >              ]}

              <View style={[styles.achievementIcon, { backgroundColor: achievement.color + (achievement.locked ? '40' : '20') }]}>            >

                <IconSymbol               <View style={[styles.achievementIcon, { backgroundColor: achievement.color + (achievement.locked ? '40' : '20') }]}>

                  size={24}                 <IconSymbol 

                  name={achievement.icon as any}                   size={24} 

                  color={achievement.locked ? colors.icon : achievement.color}                   name={achievement.icon as any} 

                />                  color={achievement.locked ? colors.icon : achievement.color} 

              </View>                />

              <ThemedText style={[styles.achievementLabel, achievement.locked && { opacity: 0.5 }]}>              </View>

                {achievement.label}              <ThemedText style={[styles.achievementLabel, achievement.locked && { opacity: 0.5 }]}>

              </ThemedText>                {achievement.label}

            </View>              </ThemedText>

          ))}            </View>

        </View>          ))}

      </View>        </View>

      </View>

      {/* Metas Atuais */}

      <View style={styles.section}>      {/* Metas Atuais */}

        <ThemedText style={styles.sectionTitle}>Metas Atuais</ThemedText>      <View style={styles.section}>

        {goals.map((goal, index) => (        <ThemedText style={styles.sectionTitle}>Metas Atuais</ThemedText>

          <View key={index} style={[styles.goalCard, { backgroundColor: colors.backgroundCard }]}>        {goals.map((goal, index) => (

            <View style={styles.goalHeader}>          <View key={index} style={[styles.goalCard, { backgroundColor: colors.backgroundCard }]}>

              <View style={[styles.goalIcon, { backgroundColor: goal.color + '20' }]}>            <View style={styles.goalHeader}>

                <IconSymbol size={20} name={goal.icon as any} color={goal.color} />              <View style={[styles.goalIcon, { backgroundColor: goal.color + '20' }]}>

              </View>                <IconSymbol size={20} name={goal.icon as any} color={goal.color} />

              <ThemedText style={styles.goalLabel}>{goal.label}</ThemedText>              </View>

              <IconSymbol size={20} name="chevron.right" color={colors.icon} />              <ThemedText style={styles.goalLabel}>{goal.label}</ThemedText>

            </View>              <IconSymbol size={20} name="chevron.right" color={colors.icon} />

            <View style={styles.goalProgress}>            </View>

              <View style={[styles.progressBar, { backgroundColor: colors.backgroundCardLight }]}>            <View style={styles.goalProgress}>

                <View               <View style={[styles.progressBar, { backgroundColor: colors.backgroundCardLight }]}>

                  style={[                <View 

                    styles.progressBarFill,                   style={[

                    {                     styles.progressBarFill, 

                      backgroundColor: goal.color,                    { 

                      width: `${(goal.progress / goal.total) * 100}%`                      backgroundColor: goal.color,

                    }                      width: `${(goal.progress / goal.total) * 100}%`

                  ]}                     }

                />                  ]} 

              </View>                />

              <ThemedText style={[styles.goalProgressText, { color: colors.textSecondary }]}>              </View>

                {goal.progress}/{goal.total} concluído              <ThemedText style={[styles.goalProgressText, { color: colors.textSecondary }]}>

              </ThemedText>                {goal.progress}/{goal.total} concluído

            </View>              </ThemedText>

          </View>            </View>

        ))}          </View>

      </View>        ))}

      </View>

      {/* Botão de Logout */}

      <TouchableOpacity       {/* Botão de Logout */}

        style={[styles.logoutButton, { backgroundColor: colors.error }]}      <TouchableOpacity 

        onPress={handleSignOut}        style={[styles.logoutButton, { backgroundColor: colors.error }]}

        disabled={loading}        onPress={handleSignOut}

      >        disabled={loading}

        <IconSymbol size={20} name="arrow.right.square.fill" color="#fff" />      >

        <ThemedText style={styles.logoutButtonText}>        <IconSymbol size={20} name="arrow.right.square.fill" color="#fff" />

          {loading ? 'Saindo...' : 'Sair da Conta'}        <ThemedText style={styles.logoutButtonText}>

        </ThemedText>          {loading ? 'Saindo...' : 'Sair da Conta'}

      </TouchableOpacity>        </ThemedText>

    </ScrollView>      </TouchableOpacity>

  );    </ScrollView>

}  );

}

const styles = StyleSheet.create({

  container: {const styles = StyleSheet.create({

    flex: 1,  container: {

  },    flex: 1,

  content: {  },

    padding: 20,  content: {

    paddingBottom: 100,    padding: 20,

  },    paddingBottom: 100,

  header: {  },

    padding: 20,  header: {

    paddingBottom: 16,    padding: 20,

  },    paddingBottom: 16,

  title: {  },

    fontSize: 20,  title: {

    fontWeight: '700',    fontSize: 20,

  },    fontWeight: '700',

  subtitle: {  },

    fontSize: 14,  subtitle: {

    marginTop: 4,    fontSize: 14,

  },    marginTop: 4,

  profileCard: {  },

    padding: 24,  profileCard: {

    borderRadius: 16,    padding: 24,

    alignItems: 'center',    borderRadius: 16,

    marginBottom: 24,    alignItems: 'center',

  },    marginBottom: 24,

  avatar: {  },

    width: 80,  avatar: {

    height: 80,    width: 80,

    borderRadius: 40,    height: 80,

    justifyContent: 'center',    borderRadius: 40,

    alignItems: 'center',    justifyContent: 'center',

    marginBottom: 16,    alignItems: 'center',

  },    marginBottom: 16,

  avatarText: {  },

    fontSize: 32,  avatarText: {

    fontWeight: '700',    fontSize: 32,

    color: '#fff',    fontWeight: '700',

  },    color: '#fff',

  userName: {  },

    fontSize: 24,  userName: {

    fontWeight: '700',    fontSize: 24,

    marginBottom: 4,    fontWeight: '700',

  },    marginBottom: 4,

  memberSince: {  },

    fontSize: 14,  memberSince: {

    marginBottom: 24,    fontSize: 14,

  },    marginBottom: 24,

  statsRow: {  },

    flexDirection: 'row',  statsRow: {

    width: '100%',    flexDirection: 'row',

    justifyContent: 'space-around',    width: '100%',

    alignItems: 'center',    justifyContent: 'space-around',

  },    alignItems: 'center',

  statItem: {  },

    alignItems: 'center',  statItem: {

    gap: 4,    alignItems: 'center',

  },    gap: 4,

  statNumber: {  },

    fontSize: 24,  statNumber: {

    fontWeight: '700',    fontSize: 24,

  },    fontWeight: '700',

  statLabel: {  },

    fontSize: 12,  statLabel: {

  },    fontSize: 12,

  statDivider: {  },

    width: 1,  statDivider: {

    height: 32,    width: 1,

  },    height: 32,

  section: {  },

    marginBottom: 24,  section: {

  },    marginBottom: 24,

  sectionTitle: {  },

    fontSize: 20,  sectionTitle: {

    fontWeight: '700',    fontSize: 20,

    marginBottom: 16,    fontWeight: '700',

    paddingHorizontal: 20,    marginBottom: 16,

  },    paddingHorizontal: 20,

  achievementsGrid: {  },

    flexDirection: 'row',  achievementsGrid: {

    flexWrap: 'wrap',    flexDirection: 'row',

    paddingHorizontal: 20,    flexWrap: 'wrap',

    gap: 12,    paddingHorizontal: 20,

  },    gap: 12,

  achievementCard: {  },

    width: '47%',  achievementCard: {

    padding: 16,    width: '47%',

    borderRadius: 16,    padding: 16,

    alignItems: 'center',    borderRadius: 16,

    gap: 12,    alignItems: 'center',

  },    gap: 12,

  achievementIcon: {  },

    width: 48,  achievementIcon: {

    height: 48,    width: 48,

    borderRadius: 24,    height: 48,

    justifyContent: 'center',    borderRadius: 24,

    alignItems: 'center',    justifyContent: 'center',

  },    alignItems: 'center',

  achievementLabel: {  },

    fontSize: 12,  achievementLabel: {

    fontWeight: '600',    fontSize: 12,

    textAlign: 'center',    fontWeight: '600',

  },    textAlign: 'center',

  goalCard: {  },

    padding: 16,  goalCard: {

    borderRadius: 16,    padding: 16,

    marginBottom: 12,    borderRadius: 16,

    marginHorizontal: 20,    marginBottom: 12,

  },    marginHorizontal: 20,

  goalHeader: {  },

    flexDirection: 'row',  goalHeader: {

    alignItems: 'center',    flexDirection: 'row',

    marginBottom: 12,    alignItems: 'center',

    gap: 12,    marginBottom: 12,

  },    gap: 12,

  goalIcon: {  },

    width: 36,  goalIcon: {

    height: 36,    width: 36,

    borderRadius: 18,    height: 36,

    justifyContent: 'center',    borderRadius: 18,

    alignItems: 'center',    justifyContent: 'center',

  },    alignItems: 'center',

  goalLabel: {  },

    flex: 1,  goalLabel: {

    fontSize: 14,    flex: 1,

    fontWeight: '600',    fontSize: 14,

  },    fontWeight: '600',

  goalProgress: {  },

    gap: 8,  goalProgress: {

  },    gap: 8,

  progressBar: {  },

    height: 8,  progressBar: {

    borderRadius: 4,    height: 8,

    overflow: 'hidden',    borderRadius: 4,

  },    overflow: 'hidden',

  progressBarFill: {  },

    height: '100%',  progressBarFill: {

    borderRadius: 4,    height: '100%',

  },    borderRadius: 4,

  goalProgressText: {  },

    fontSize: 12,  goalProgressText: {

  },    fontSize: 12,

  logoutButton: {  },

    flexDirection: 'row',  logoutButton: {

    justifyContent: 'center',    flexDirection: 'row',

    alignItems: 'center',    justifyContent: 'center',

    padding: 16,    alignItems: 'center',

    borderRadius: 12,    padding: 16,

    marginHorizontal: 20,    borderRadius: 12,

    marginBottom: 40,    marginHorizontal: 20,

    gap: 8,    marginBottom: 40,

  },    gap: 8,

  logoutButtonText: {  },

    color: '#fff',  logoutButtonText: {

    fontSize: 16,    color: '#fff',

    fontWeight: '700',    fontSize: 16,

  },    fontWeight: '700',

});  },

});
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 20,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 15,
  },
  email: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionTitle: {
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    alignItems: 'center',
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 16,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 'auto',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
