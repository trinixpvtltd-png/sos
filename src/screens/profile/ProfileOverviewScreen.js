import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Colors, Gradients } from '../../theme/colors';
import { Radius, Spacing } from '../../theme/metrics';
import { useTypography } from '../../theme/typography';
import { SafeAreaView } from 'react-native-safe-area-context';

const AVATAR =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=60';

const ProfileLink = ({ icon, label, onPress, typography, rightLabel }) => (
  <TouchableOpacity style={styles.linkItem} onPress={onPress}>
    <View style={styles.linkIconBox}>
      <Feather name={icon} size={20} color={Colors.textPrimary} />
    </View>
    <Text style={[styles.linkLabel, { fontFamily: typography.semibold }]}>{label}</Text>
    <View style={styles.linkRight}>
      {rightLabel && <Text style={[styles.rightLabel, { fontFamily: typography.regular }]}>{rightLabel}</Text>}
      <Feather name="chevron-right" size={18} color={Colors.textMuted} />
    </View>
  </TouchableOpacity>
);

export const ProfileOverviewScreen = () => {
  const navigation = useNavigation();
  const typography = useTypography();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Home')}>
              <Feather name="chevron-left" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <View>
              <Text style={[styles.headerTitle, { fontFamily: typography.bold }]}>Profile</Text>
              <Text style={[styles.headerSubtitle, { fontFamily: typography.regular }]}>Manage your account</Text>
            </View>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Menu Sections */}
          <View style={styles.menuContainer}>
            <Text style={[styles.sectionTitle, { fontFamily: typography.bold }]}>Account Settings</Text>
            <ProfileLink
              icon="user"
              label="Personal Details"
              onPress={() => navigation.navigate('ProfilePersonal')}
              typography={typography}
            />
            <ProfileLink
              icon="heart"
              label="My Contributions"
              onPress={() => navigation.navigate('ProfileContribDetail')}
              typography={typography}
              rightLabel="₹12,400"
            />
            <ProfileLink
              icon="alert-triangle"
              label="SOS History"
              onPress={() => navigation.navigate('ProfileHistory')}
              typography={typography}
              rightLabel="Active"
            />
          </View>

          <View style={styles.menuContainer}>
            <Text style={[styles.sectionTitle, { fontFamily: typography.bold }]}>Support & Legal</Text>
            <ProfileLink
              icon="map-pin"
              label="Emergency Services"
              onPress={() => navigation.navigate('Home', { screen: 'AvailableService' })}
              typography={typography}
            />
            <ProfileLink
              icon="file-text"
              label="Terms & Conditions"
              onPress={() => { }}
              typography={typography}
            />
            <ProfileLink
              icon="info"
              label="About Sankatmochan"
              onPress={() => { }}
              typography={typography}
            />
          </View>

          <TouchableOpacity style={styles.logoutBtn}>
            <Feather name="log-out" size={20} color={Colors.primary} />
            <Text style={[styles.logoutText, { fontFamily: typography.bold }]}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 30,
    paddingBottom: Spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    marginRight: 4,
  },
  headerTitle: {
    fontSize: 26,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: -2,
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 120,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 24,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  idBadge: {
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  idText: {
    fontSize: 12,
    color: Colors.primary,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: Colors.textPrimary,
    borderRadius: 20,
    paddingVertical: 20,
    marginTop: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  menuContainer: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 16,
    marginLeft: 4,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  linkIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  linkLabel: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  linkRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 40,
    paddingVertical: 16,
    backgroundColor: Colors.primary + '10',
    borderRadius: 16,
  },
  logoutText: {
    color: Colors.primary,
    fontSize: 16,
  },
});

