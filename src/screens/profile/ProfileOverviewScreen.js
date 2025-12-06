import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Gradients } from '../../theme/colors';
import { Radius, Spacing } from '../../theme/metrics';
import { useTypography } from '../../theme/typography';

const AVATAR =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=60';

const LINKS = [
  { label: 'Personal Details', route: 'ProfilePersonal' },
  { label: 'Contribution Made/Received', route: 'ProfileContribDetail' },
  { label: 'Distress Signal Count', route: 'DistressSignal' },
  { label: 'Services Available Near', route: 'AvailableService' },
  { label: 'Terms & Conditions' },
];

export const ProfileOverviewScreen = () => {
  const navigation = useNavigation();
  const typography = useTypography();

  return (
    <LinearGradient colors={Gradients.warmVertical} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={[styles.title, { fontFamily: typography.bold }]}>User ID: #56382382</Text>
        <Text style={[styles.subtitle, { fontFamily: typography.regular }]}>Name:</Text>
        <Image source={{ uri: AVATAR }} style={styles.avatar} />
        <View style={styles.links}>
          {LINKS.map((link) => (
            <TouchableOpacity
              key={link.label}
              style={styles.link}
              onPress={() => link.route && navigation.navigate(link.route)}
              activeOpacity={0.9}
            >
              <Text style={[styles.linkLabel, { fontFamily: typography.semibold }]}>
                {link.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    marginTop: Spacing.sm,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 6,
    borderColor: '#F3B56A',
    marginVertical: Spacing.sm,
  },
  links: {
    width: '100%',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  link: {
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: '#E8A85E',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  linkLabel: {
    color: '#fff',
    fontSize: 14,
  },
});
