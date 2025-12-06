import { useMemo, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useStrings } from '../localization/useStrings';
import { resources } from '../data/resources';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';

const categories = ['All', ...new Set(resources.map((item) => item.category))];

const ResourceCard = ({ item, typography }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.badge}>
        <Text style={[styles.badgeLabel, { fontFamily: typography.semibold }]}>{item.category}</Text>
      </View>
      <View style={styles.region}>
        <Feather name="map-pin" size={14} color={Colors.primary} />
        <Text style={[styles.regionLabel, { fontFamily: typography.regular }]}>{item.region}</Text>
      </View>
    </View>
    <Text style={[styles.cardTitle, { fontFamily: typography.bold }]}>{item.title}</Text>
    <Text style={[styles.cardDescription, { fontFamily: typography.regular }]}>{item.description}</Text>
    <View style={styles.metaRow}>
      <Feather name="phone" size={16} color={Colors.textMuted} />
      <Text style={[styles.metaText, { fontFamily: typography.semibold }]}>{item.contact}</Text>
    </View>
    <Text style={[styles.escalation, { fontFamily: typography.regular }]}>{item.escalation}</Text>
  </View>
);

export const ResourcesScreen = () => {
  const strings = useStrings();
  const typography = useTypography();
  const navigation = useNavigation();
  const [activeCategory, setActiveCategory] = useState('All');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerAnim] = useState(new Animated.Value(-Dimensions.get('window').width));

  const filteredResources = useMemo(() => {
    if (activeCategory === 'All') {
      return resources;
    }
    return resources.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.timing(drawerAnim, {
      toValue: 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(drawerAnim, {
      toValue: -Dimensions.get('window').width,
      duration: 200,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => setDrawerOpen(false));
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    closeDrawer();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.menuIcon} activeOpacity={0.9} onPress={openDrawer}>
          <Text style={[styles.menuText, { fontFamily: typography.semibold }]}>{'\u2261'}</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontFamily: typography.bold }]}>{strings.navigation.resources}</Text>
        <View style={{ width: 48 }} />
      </View>
      <FlatList
        contentContainerStyle={styles.list}
        data={filteredResources}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ResourceCard item={item} typography={typography} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />

      {drawerOpen ? (
        <View style={styles.overlay} pointerEvents="box-none">
          <BlurView intensity={28} tint="light" style={styles.blurOverlay} />
          <View style={styles.drawerRow}>
            <Animated.View style={[styles.drawer, { transform: [{ translateX: drawerAnim }] }]}>
              <Text style={[styles.drawerTitle, { fontFamily: typography.bold }]}>Navigate</Text>
              <View style={styles.drawerSection}>
                <Text style={[styles.drawerLabel, { fontFamily: typography.semibold }]}>Categories</Text>
                {categories.map((category) => {
                  const active = category === activeCategory;
                  return (
                    <TouchableOpacity
                      key={category}
                      style={[styles.drawerItem, active && styles.drawerItemActive]}
                      activeOpacity={0.9}
                      onPress={() => handleCategorySelect(category)}
                    >
                      <Text
                        style={[
                          styles.drawerItemText,
                          { fontFamily: typography.semibold },
                          active && styles.drawerItemTextActive,
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.drawerSection}>
                <Text style={[styles.drawerLabel, { fontFamily: typography.semibold }]}>Quick Links</Text>
                <TouchableOpacity
                  style={styles.drawerItem}
                  activeOpacity={0.9}
                  onPress={() => {
                    closeDrawer();
                    navigation.navigate('ResourceTransparency');
                  }}
                >
                  <Text style={[styles.drawerItemText, { fontFamily: typography.semibold }]}>
                    Resource Handle
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.drawerItem}
                  activeOpacity={0.9}
                  onPress={() => {
                    closeDrawer();
                    navigation.navigate('AvailableService');
                  }}
                >
                  <Text style={[styles.drawerItemText, { fontFamily: typography.semibold }]}>
                    Available Service
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
            <Pressable style={styles.scrim} onPress={closeDrawer} />
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F4E7D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    fontSize: 18,
    color: Colors.textPrimary,
  },
  list: {
    padding: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  headerTitle: {
    fontSize: 22,
    color: Colors.textPrimary,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: '#fff',
    shadowColor: Colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    backgroundColor: '#FDEFE3',
  },
  badgeLabel: {
    fontSize: 12,
    color: Colors.primary,
  },
  region: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  regionLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  cardTitle: {
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  metaText: {
    fontSize: 15,
    color: Colors.textPrimary,
  },
  escalation: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  separator: {
    height: Spacing.xl,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    zIndex: 10,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  drawerRow: {
    flex: 1,
    flexDirection: 'row',
  },
  drawer: {
    width: '65%',
    maxWidth: 380,
    backgroundColor: '#fff',
    borderTopRightRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    padding: Spacing.lg,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  scrim: {
    flex: 1,
  },
  drawerTitle: {
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  drawerSection: {
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  drawerLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  drawerItem: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
  },
  drawerItemActive: {
    backgroundColor: 'rgba(229,57,53,0.1)',
  },
  drawerItemText: {
    fontSize: 15,
    color: Colors.textPrimary,
  },
  drawerItemTextActive: {
    color: Colors.primary,
  },
});
