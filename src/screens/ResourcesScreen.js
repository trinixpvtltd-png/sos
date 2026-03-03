import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ResourceTransparencyPanel } from '../components/ResourceTransparencyPanel';
import { resources } from '../data/resources';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { useStrings } from '../localization/useStrings';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { EmptyStateCard } from '../components/EmptyStateCard';
import { LoadingSkeletonCard } from '../components/LoadingSkeletonCard';

export const ResourcesScreen = () => {
  const navigation = useNavigation();
  const typography = useTypography();
  const strings = useStrings();

  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [isResourceHandleOpen, setIsResourceHandleOpen] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timeout);
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(resources.map((item) => item.category).filter(Boolean)));
    return ['All', ...unique];
  }, []);

  const filteredResources = useMemo(() => resources.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    if (!matchesCategory) {
      return false;
    }

    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return true;
    }

    const blob = `${item.title} ${item.description} ${item.region} ${item.contact}`.toLowerCase();
    return blob.includes(query);
  }), [activeCategory, searchQuery]);

  const toggleFavorite = (resourceId) => {
    setFavorites((prev) => (
      prev.includes(resourceId)
        ? prev.filter((id) => id !== resourceId)
        : [...prev, resourceId]
    ));
  };

  const onCall = (item) => {
    if (/^\+?\d/.test(item.contact)) {
      Linking.openURL(`tel:${item.contact.replace(/\s/g, '')}`);
    } else {
      Alert.alert(strings.resources.actions.callTitle, strings.resources.actions.callNotAvailable);
    }
  };

  const onCopy = (item) => {
    Alert.alert(strings.resources.actions.copyTitle, `${strings.resources.actions.copySuccess}: ${item.contact}`);
  };

  const onShare = async (item) => {
    await Share.share({
      message: `${item.title} - ${item.contact}`,
    });
  };

  const openQuickLinkRoute = (screenName, params) => {
    navigation.navigate('Home', { screen: screenName, params });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { fontFamily: typography.bold }]}>{strings.resources.titleNew}</Text>
            <Text style={[styles.headerSubtitle, { fontFamily: typography.regular }]}>{strings.resources.subtitleNew}</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.quickLinksSection}>
          <View style={styles.quickLinksRow}>
            <TopActionButton
              label={strings.resources.quickLinks.resourceHandle}
              icon="activity"
              active={isResourceHandleOpen}
              onPress={() => setIsResourceHandleOpen((prev) => !prev)}
            />
            <TopActionButton
              label={strings.resources.quickLinks.availableService}
              icon="briefcase"
              onPress={() => openQuickLinkRoute('AvailableService')}
            />
          </View>
        </View>

        <SearchFilterBar
          searchValue={searchQuery}
          onChangeSearch={setSearchQuery}
          searchPlaceholder={strings.resources.searchPlaceholder}
          filters={categories}
          selectedFilter={activeCategory}
          onSelectFilter={setActiveCategory}
        />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {isResourceHandleOpen ? (
            <View style={styles.inlinePanelCard}>
              <ResourceTransparencyPanel />
            </View>
          ) : null}

          {isLoading ? (
            <>
              <LoadingSkeletonCard lines={3} />
              <LoadingSkeletonCard lines={3} />
              <LoadingSkeletonCard lines={3} />
            </>
          ) : filteredResources.length === 0 ? (
            <EmptyStateCard
              icon="search"
              title={strings.resources.emptyTitle}
              description={strings.resources.emptyDescription}
            />
          ) : (
            filteredResources.map((item) => {
              const favorite = favorites.includes(item.id);

              return (
                <View style={styles.card} key={item.id}>
                  <View style={styles.cardHead}>
                    <Text style={[styles.badge, { fontFamily: typography.semibold }]}>{item.category}</Text>
                    <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                      <Feather
                        name={favorite ? 'star' : 'star'}
                        size={16}
                        color={favorite ? '#E5A400' : Colors.textMuted}
                      />
                    </TouchableOpacity>
                  </View>

                  <Text style={[styles.cardTitle, { fontFamily: typography.bold }]}>{item.title}</Text>
                  <Text style={[styles.cardDescription, { fontFamily: typography.regular }]}>{item.description}</Text>
                  <Text style={[styles.cardMeta, { fontFamily: typography.regular }]}>
                    {item.region} | {item.contact}
                  </Text>

                  <View style={styles.actionRow}>
                    <ResourceAction icon="phone" label={strings.resources.actions.call} onPress={() => onCall(item)} />
                    <ResourceAction icon="copy" label={strings.resources.actions.copy} onPress={() => onCopy(item)} />
                    <ResourceAction icon="share-2" label={strings.resources.actions.share} onPress={() => onShare(item)} />
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const TopActionButton = ({ label, icon, onPress, active = false }) => {
  const typography = useTypography();

  return (
    <TouchableOpacity
      style={[styles.topActionButton, active && styles.topActionButtonActive]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Feather name={icon} size={16} color={Colors.textPrimary} />
      <Text style={[styles.topActionLabel, { fontFamily: typography.semibold }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const ResourceAction = ({ icon, label, onPress }) => {
  const typography = useTypography();

  return (
    <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
      <Feather name={icon} size={14} color={Colors.textPrimary} />
      <Text style={[styles.actionText, { fontFamily: typography.semibold }]}>{label}</Text>
    </TouchableOpacity>
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
    paddingHorizontal: Spacing.lg,
    paddingTop: 8,
    paddingBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 24,
  },
  headerSubtitle: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  quickLinksSection: {
    paddingHorizontal: Spacing.lg,
    gap: 8,
  },
  quickLinksRow: {
    flexDirection: 'row',
    gap: 10,
  },
  topActionButton: {
    flex: 1,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#E8E8EA',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  topActionButtonActive: {
    borderColor: '#F0A35B',
    backgroundColor: '#FFF3E7',
  },
  topActionLabel: {
    flexShrink: 1,
    color: Colors.textPrimary,
    fontSize: 12,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 95,
    gap: 10,
  },
  inlinePanelCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#E8E8EA',
    backgroundColor: '#fff',
    padding: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#E8E8EA',
    padding: 14,
    gap: 8,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    color: Colors.info,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: 17,
  },
  cardDescription: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  cardMeta: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  actionBtn: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E2E2E4',
    backgroundColor: '#F6F6F8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  actionText: {
    color: Colors.textPrimary,
    fontSize: 12,
  },
});
