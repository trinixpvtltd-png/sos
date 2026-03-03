import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NGO_LEVELS, ngos } from '../data/ngos';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { useStrings } from '../localization/useStrings';
import { EmptyStateCard, LoadingSkeletonCard } from '../components';
import { SocialFilterChips } from '../components/social';

const SCOPE_OPTIONS = ['all', NGO_LEVELS.DISTRICT, NGO_LEVELS.STATE, NGO_LEVELS.NATIONAL, NGO_LEVELS.GLOBAL];

export const NgoScreen = () => {
  const typography = useTypography();
  const strings = useStrings();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScope, setSelectedScope] = useState('all');
  const [isScopeDropdownOpen, setIsScopeDropdownOpen] = useState(false);
  const [followedMap, setFollowedMap] = useState({});

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 480);
    return () => clearTimeout(timeout);
  }, []);

  const scopeLabels = strings.ngo.scopeOptions;

  const scopeTabs = useMemo(
    () => SCOPE_OPTIONS.map((scope) => ({ key: scope, label: scopeLabels[scope] || scope })),
    [scopeLabels],
  );

  const filteredNgos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return ngos.filter((ngo) => {
      const matchesScope = selectedScope === 'all' || ngo.level === selectedScope;
      if (!matchesScope) {
        return false;
      }

      if (!query) {
        return true;
      }

      const blob = `${ngo.name} ${ngo.category} ${ngo.description} ${ngo.location}`.toLowerCase();
      return blob.includes(query);
    });
  }, [searchQuery, selectedScope]);

  const toggleFollow = (ngoId) => {
    setFollowedMap((prev) => ({
      ...prev,
      [ngoId]: !prev[ngoId],
    }));
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFF5F4', '#FFF9F2', '#F2F2F7']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.topWrap}>
          <View style={styles.headerRow}>
            <View style={styles.headerTextWrap}>
              <Text style={[styles.headerTitle, { fontFamily: typography.bold }]}>{strings.ngo.titleNew}</Text>
              <Text style={[styles.headerSubtitle, { fontFamily: typography.regular }]}>{strings.ngo.subtitleNew}</Text>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.headerAction}
                onPress={() => setIsScopeDropdownOpen((prev) => !prev)}
                accessibilityRole="button"
                accessibilityLabel={strings.ngo.header.filter}
              >
                <Feather name="sliders" size={17} color={Colors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerAction}
                onPress={() => navigation.navigate('Profile', { screen: 'ProfileContribDetail', params: { mode: 'made' } })}
                accessibilityRole="button"
                accessibilityLabel={strings.ngo.header.history}
              >
                <Feather name="clock" size={17} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          {isScopeDropdownOpen ? (
            <View style={styles.scopeDropdownCard}>
              {SCOPE_OPTIONS.map((scope, index) => {
                const selected = selectedScope === scope;
                return (
                  <TouchableOpacity
                    key={scope}
                    onPress={() => {
                      setSelectedScope(scope);
                      setIsScopeDropdownOpen(false);
                    }}
                    style={[styles.scopeRow, index < SCOPE_OPTIONS.length - 1 && styles.scopeRowDivider]}
                  >
                    <Text
                      style={[
                        styles.scopeLabel,
                        { fontFamily: typography.semibold },
                        selected && styles.scopeLabelSelected,
                      ]}
                    >
                      {scopeLabels[scope] || scope}
                    </Text>
                    {selected ? <Feather name="check" size={16} color={Colors.primary} /> : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}

          <View style={styles.searchWrap}>
            <Feather name="search" size={17} color={Colors.textMuted} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={strings.ngo.searchPlaceholder}
              placeholderTextColor={Colors.textMuted}
              style={[styles.searchInput, { fontFamily: typography.regular }]}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.searchClearBtn}>
                <Feather name="x" size={14} color={Colors.textSecondary} />
              </TouchableOpacity>
            ) : null}
          </View>

          <SocialFilterChips
            tabs={scopeTabs}
            activeTab={selectedScope}
            onSelect={setSelectedScope}
          />

          {selectedScope !== 'all' ? (
            <View style={styles.filterFeedbackWrap}>
              <Text style={[styles.filterFeedbackText, { fontFamily: typography.semibold }]}>
                {strings.ngo.filterFeedback.replace('{level}', scopeLabels[selectedScope] || selectedScope)}
              </Text>
            </View>
          ) : null}
        </View>

        <ScrollView
          style={styles.bodyScroll}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={() => {
            if (isScopeDropdownOpen) {
              setIsScopeDropdownOpen(false);
            }
          }}
        >
          {isLoading ? (
            <View style={styles.loadingWrap}>
              <LoadingSkeletonCard lines={4} />
              <LoadingSkeletonCard lines={4} />
              <LoadingSkeletonCard lines={4} />
            </View>
          ) : filteredNgos.length ? (
            <View style={styles.feedList}>
              {filteredNgos.map((ngo) => {
                const progress = Math.min(100, Math.round((ngo.raisedAmount / Math.max(1, ngo.goalAmount)) * 100));
                const followed = Boolean(followedMap[ngo.id]);

                return (
                  <TouchableOpacity
                    key={ngo.id}
                    style={styles.card}
                    onPress={() => navigation.navigate('NgoDetail', { ngoId: ngo.id })}
                    activeOpacity={0.95}
                  >
                    {ngo.imageUrl ? <Image source={{ uri: ngo.imageUrl }} style={styles.cardImage} resizeMode="cover" /> : null}

                    <View style={styles.cardBody}>
                      <View style={styles.cardHead}>
                        <Text style={[styles.cardTitle, { fontFamily: typography.bold }]} numberOfLines={1}>{ngo.name}</Text>
                        <TouchableOpacity
                          style={[styles.followBtn, followed && styles.followBtnActive]}
                          onPress={() => toggleFollow(ngo.id)}
                        >
                          <Text
                            style={[
                              styles.followText,
                              { fontFamily: typography.semibold },
                              followed && styles.followTextActive,
                            ]}
                          >
                            {followed ? strings.ngo.following : strings.ngo.follow}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.metaRow}>
                        <View style={styles.badge}><Text style={[styles.badgeText, { fontFamily: typography.semibold }]}>{scopeLabels[ngo.level]}</Text></View>
                        <View style={styles.badgeAlt}><Text style={[styles.badgeTextAlt, { fontFamily: typography.semibold }]}>{ngo.category}</Text></View>
                      </View>

                      <Text style={[styles.desc, { fontFamily: typography.regular }]} numberOfLines={3}>{ngo.description}</Text>

                      <View style={styles.progressRow}>
                        <Text style={[styles.amountText, { fontFamily: typography.semibold }]}>Rs {ngo.raisedAmount.toLocaleString()}</Text>
                        <Text style={[styles.goalText, { fontFamily: typography.regular }]}>/ Rs {ngo.goalAmount.toLocaleString()}</Text>
                        <Text style={[styles.progressText, { fontFamily: typography.semibold }]}>{progress}%</Text>
                      </View>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${progress}%` }]} />
                      </View>

                      <Text style={[styles.locationText, { fontFamily: typography.regular }]}>
                        <Feather name="map-pin" size={12} color={Colors.textMuted} /> {ngo.location}
                      </Text>

                      <Text style={[styles.detailHint, { fontFamily: typography.semibold }]}>{strings.ngo.detail.openCase}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <EmptyStateCard
              icon="heart"
              title={strings.ngo.emptyTitle}
              description={strings.ngo.emptyDescription}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safeArea: { flex: 1 },
  topWrap: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 4,
    paddingBottom: Spacing.sm,
    gap: 10,
    zIndex: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  headerTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 26,
    lineHeight: 30,
  },
  headerSubtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerAction: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    backgroundColor: 'rgba(255,255,255,0.84)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scopeDropdownCard: {
    marginTop: -2,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: 'rgba(255,255,255,0.98)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  scopeRow: {
    minHeight: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scopeRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  scopeLabel: {
    color: Colors.textPrimary,
    fontSize: 14,
    textTransform: 'capitalize',
  },
  scopeLabelSelected: {
    color: Colors.primary,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: 'rgba(255,255,255,0.86)',
    paddingHorizontal: 12,
    minHeight: 46,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 13,
    paddingVertical: 8,
    outlineStyle: 'none',
  },
  searchClearBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterFeedbackWrap: {
    alignSelf: 'flex-start',
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255,59,48,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,59,48,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  filterFeedbackText: {
    color: Colors.primary,
    fontSize: 11,
  },
  bodyScroll: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 105,
  },
  loadingWrap: {
    gap: 10,
  },
  feedList: {
    gap: 10,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.09)',
    backgroundColor: 'rgba(255,255,255,0.78)',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardBody: {
    padding: 14,
    gap: 8,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 16,
  },
  followBtn: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.10)',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  followBtnActive: {
    borderColor: 'rgba(255,59,48,0.3)',
    backgroundColor: 'rgba(255,59,48,0.12)',
  },
  followText: {
    color: Colors.textPrimary,
    fontSize: 12,
  },
  followTextActive: {
    color: Colors.primary,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255,59,48,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: Colors.primary,
    fontSize: 10,
    textTransform: 'capitalize',
  },
  badgeAlt: {
    borderRadius: Radius.md,
    backgroundColor: 'rgba(0,122,255,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeTextAlt: {
    color: Colors.info,
    fontSize: 10,
  },
  desc: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  amountText: {
    color: Colors.textPrimary,
    fontSize: 13,
  },
  goalText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  progressText: {
    marginLeft: 'auto',
    color: Colors.primary,
    fontSize: 12,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  locationText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  detailHint: {
    color: Colors.primary,
    fontSize: 11,
  },
});
