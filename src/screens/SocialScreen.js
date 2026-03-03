import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  RefreshControl,
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
import { SOCIAL_CATEGORIES, socialPosts } from '../data/socialPosts';
import { NGO_LEVELS } from '../data/ngos';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { useStrings } from '../localization/useStrings';
import { EmptyStateCard, LoadingSkeletonCard } from '../components';
import {
  SocialComposerCard,
  SocialFilterChips,
  SocialHighlightsRow,
  SocialPostCard,
  SocialSidebarLeft,
  SocialSidebarRight,
} from '../components/social';
import { useBreakpoints } from '../hooks/useBreakpoints';
import { useResponsiveScale } from '../hooks/useResponsiveScale';

const HIGHLIGHT_TO_FILTER = {
  nearbyAlerts: 'nearby',
  urgentCampaigns: 'relief',
  verifiedNgos: 'verified',
  medicalRequests: 'medical',
  shelterUpdates: 'relief',
  awarenessDrive: 'awareness',
};

const SCOPE_OPTIONS = ['all', NGO_LEVELS.DISTRICT, NGO_LEVELS.STATE, NGO_LEVELS.NATIONAL, NGO_LEVELS.GLOBAL];

const normalizePost = (post) => ({
  id: post.id,
  author: post.author || 'SOS Network',
  handle: post.handle || '@sos_network',
  body: post.body || '',
  imageUrl: post.imageUrl || null,
  raised: Number(post.raised || 0),
  goal: Number(post.goal || 0),
  location: post.location || 'Location not available',
  timestamp: post.timestamp || new Date().toISOString(),
  category: post.category || SOCIAL_CATEGORIES[0],
  isVerified: Boolean(post.isVerified),
  reactionsCount: Number(post.reactionsCount || 0),
  commentsCount: Number(post.commentsCount || 0),
  sharesCount: Number(post.sharesCount || 0),
  donorCount: Number(post.donorCount || 0),
  isUrgent: Boolean(post.isUrgent),
  isNearby: Boolean(post.isNearby),
  needsSupportInHours: Number(post.needsSupportInHours || 12),
  tags: Array.isArray(post.tags) ? post.tags : [],
  scope: post.scope || (post.isNearby ? NGO_LEVELS.DISTRICT : NGO_LEVELS.STATE),
  commentsPreview: Array.isArray(post.commentsPreview) ? post.commentsPreview : [],
});

const byNewest = (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();

const FEED_FILTERS = [
  'all',
  'verified',
  'relief',
  'medical',
  'awareness',
  'nearby',
  'saved',
];

const isReliefPost = (post) => {
  const category = String(post.category || '').toLowerCase();
  const tags = (post.tags || []).map((tag) => String(tag).toLowerCase());
  return (
    category.includes('relief')
    || category.includes('food')
    || post.isUrgent
    || tags.some((tag) => tag.includes('relief') || tag.includes('food'))
  );
};

const isMedicalPost = (post) => {
  const category = String(post.category || '').toLowerCase();
  const tags = (post.tags || []).map((tag) => String(tag).toLowerCase());
  return category.includes('medical') || tags.some((tag) => tag.includes('medical'));
};

const isAwarenessPost = (post) => {
  const category = String(post.category || '').toLowerCase();
  const tags = (post.tags || []).map((tag) => String(tag).toLowerCase());
  return category.includes('awareness') || category.includes('community') || tags.some((tag) => tag.includes('awareness'));
};

const filterByType = (post, activeFilter, savedMap) => {
  if (!FEED_FILTERS.includes(activeFilter)) return true;

  switch (activeFilter) {
    case 'saved':
      return Boolean(savedMap[post.id]);
    case 'verified':
      return post.isVerified;
    case 'relief':
      return isReliefPost(post);
    case 'medical':
      return isMedicalPost(post);
    case 'awareness':
      return isAwarenessPost(post);
    case 'nearby':
      return post.isNearby;
    case 'all':
    default:
      return true;
  }
};

const HeaderActionButton = ({ icon, onPress, accessibilityLabel }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.headerAction}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
  >
    <Feather name={icon} size={17} color={Colors.textPrimary} />
  </TouchableOpacity>
);

const ModalAction = ({ icon, label, onPress }) => {
  const typography = useTypography();

  return (
    <TouchableOpacity onPress={onPress} style={styles.modalActionBtn}>
      <Feather name={icon} size={15} color={Colors.primary} />
      <Text style={[styles.modalActionLabel, { fontFamily: typography.semibold }]}>{label}</Text>
    </TouchableOpacity>
  );
};

export const SocialScreen = () => {
  const typography = useTypography();
  const strings = useStrings();
  const navigation = useNavigation();
  const { isMdUp, isLgUp } = useBreakpoints();
  const { moderateScale } = useResponsiveScale();

  const searchInputRef = useRef(null);

  const [allPosts, setAllPosts] = useState(() => socialPosts.map(normalizePost).sort(byNewest));
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedScope, setSelectedScope] = useState('all');
  const [isScopeDropdownOpen, setIsScopeDropdownOpen] = useState(false);
  const [likedMap, setLikedMap] = useState({});
  const [savedMap, setSavedMap] = useState({});
  const [supportedMap, setSupportedMap] = useState({});
  const [expandedMap, setExpandedMap] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [toastMessage, setToastMessage] = useState('');
  const [modalState, setModalState] = useState({ type: null, post: null, actionKey: null });

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 520);
    return () => clearTimeout(timeout);
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? '' : current));
    }, 1700);
  };

  const openModal = (type, payload = {}) => {
    setModalState({ type, ...payload });
  };

  const closeModal = () => {
    setModalState({ type: null, post: null, actionKey: null });
  };

  const toggleMapValue = (setter, id) => {
    setter((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const failed = Math.random() < 0.18;
      setHasError(failed);
      if (!failed) {
        setAllPosts((prev) => [...prev].sort(byNewest));
      }
      setIsRefreshing(false);
    }, 820);
  };

  const feedTabs = useMemo(() => ([
    { key: 'all', label: strings.social.filters.all },
    { key: 'verified', label: strings.social.filters.verified },
    { key: 'relief', label: strings.social.filters.relief },
    { key: 'medical', label: strings.social.filters.medical },
    { key: 'awareness', label: strings.social.filters.awareness },
    { key: 'nearby', label: strings.social.filters.nearby },
  ]), [strings]);

  const scopeLabels = useMemo(() => strings.social.scopeOptions, [strings]);

  const activeFilterLabel = useMemo(() => {
    if (activeFilter === 'saved') {
      return strings.social.sidebars.links.savedPosts;
    }

    const tab = feedTabs.find((item) => item.key === activeFilter);
    return tab ? tab.label : strings.social.filters.all;
  }, [activeFilter, feedTabs, strings]);

  const selectedScopeLabel = scopeLabels[selectedScope] || scopeLabels.all;

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return allPosts.filter((post) => {
      const matchesScope = selectedScope === 'all' || post.scope === selectedScope;
      if (!matchesScope) {
        return false;
      }

      if (!filterByType(post, activeFilter, savedMap)) {
        return false;
      }

      if (!query) {
        return true;
      }

      const blob = [
        post.author,
        post.handle,
        post.body,
        post.location,
        post.category,
        ...(post.tags || []),
      ]
        .join(' ')
        .toLowerCase();

      return blob.includes(query);
    });
  }, [activeFilter, allPosts, savedMap, searchQuery, selectedScope]);

  const totalSaved = useMemo(
    () => Object.values(savedMap).filter(Boolean).length,
    [savedMap],
  );

  const titleSize = Math.max(19, Math.min(25, Math.round(moderateScale(21, 0.2))));
  const subtitleSize = Math.max(12, Math.min(15, Math.round(moderateScale(13, 0.14))));
  const leftWidth = isLgUp ? 216 : 188;
  const rightWidth = isLgUp ? 262 : 204;

  const filterFeedback = strings.social.filterFeedback.replace('{category}', activeFilterLabel);

  const handleHighlightSelect = (highlightKey) => {
    const mappedFilter = HIGHLIGHT_TO_FILTER[highlightKey] || 'all';
    setActiveFilter(mappedFilter);
  };

  const handleSelectScope = (scope) => {
    setSelectedScope(scope);
    setIsScopeDropdownOpen(false);
    showToast(strings.social.toasts.scopeUpdated.replace('{scope}', scopeLabels[scope] || scopeLabels.all));
  };

  const feedContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingList}>
          <LoadingSkeletonCard lines={5} />
          <LoadingSkeletonCard lines={4} />
          <LoadingSkeletonCard lines={5} />
        </View>
      );
    }

    if (hasError) {
      return (
        <EmptyStateCard
          icon="alert-circle"
          title={strings.social.states.errorTitle}
          description={strings.social.states.errorDescription}
          actionLabel={strings.social.states.retry}
          onAction={handleRefresh}
        />
      );
    }

    if (!filteredPosts.length) {
      return (
        <EmptyStateCard
          icon="search"
          title={strings.social.states.emptyTitle}
          description={strings.social.states.emptyDescription}
          actionLabel={strings.social.states.resetFilters}
          onAction={() => {
            setActiveFilter('all');
            setSelectedScope('all');
            setSearchQuery('');
          }}
        />
      );
    }

    return (
      <View style={styles.feedList}>
        {filteredPosts.map((post) => (
          <SocialPostCard
            key={post.id}
            post={post}
            isLiked={Boolean(likedMap[post.id])}
            isSupported={Boolean(supportedMap[post.id])}
            isSaved={Boolean(savedMap[post.id])}
            isExpanded={Boolean(expandedMap[post.id])}
            commentValue={commentDrafts[post.id] || ''}
            onToggleSave={() => toggleMapValue(setSavedMap, post.id)}
            onToggleLike={() => toggleMapValue(setLikedMap, post.id)}
            onToggleSupport={() => toggleMapValue(setSupportedMap, post.id)}
            onToggleExpand={() => toggleMapValue(setExpandedMap, post.id)}
            onOpenImage={() => openModal('image', { post })}
            onShare={() => openModal('share', { post })}
            onDonate={() => openModal('donate', { post })}
            onCommentFocus={() => openModal('comment', { post })}
            onOpenDetails={() => navigation.navigate('SocialPostDetail', { postId: post.id })}
            onChangeComment={(value) => {
              setCommentDrafts((prev) => ({
                ...prev,
                [post.id]: value,
              }));
            }}
          />
        ))}
      </View>
    );
  };

  const baseContent = (
    <>
      <SocialComposerCard
        onComposePress={() => openModal('compose')}
        onQuickAction={(actionKey) => openModal('compose', { actionKey })}
      />
      <SocialHighlightsRow onSelect={handleHighlightSelect} />
      {feedContent()}
    </>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFF5F4', '#FFF9F2', '#F2F2F7']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={[styles.topWrap, Platform.OS === 'web' && styles.topWrapSticky]}>
          <View style={styles.headerRow}>
            <View style={styles.headerTextWrap}>
              <Text
                numberOfLines={2}
                style={[styles.headerTitle, { fontFamily: typography.bold, fontSize: titleSize }]}
              >
                {strings.social.titleNew}
              </Text>
              <Text style={[styles.headerSubtitle, { fontFamily: typography.regular, fontSize: subtitleSize }]}>
                {strings.social.subtitleNew}
              </Text>
            </View>

            <View style={styles.headerActions}>
              <HeaderActionButton
                icon="sliders"
                onPress={() => setIsScopeDropdownOpen((prev) => !prev)}
                accessibilityLabel={strings.social.header.filter}
              />
              <HeaderActionButton
                icon="user"
                onPress={() => showToast(strings.social.toasts.profileSoon)}
                accessibilityLabel={strings.social.header.profile}
              />
            </View>
          </View>

          {isScopeDropdownOpen ? (
            <View style={styles.scopeDropdownCard}>
              {SCOPE_OPTIONS.map((scope, index) => {
                const isSelected = selectedScope === scope;
                return (
                  <TouchableOpacity
                    key={scope}
                    style={[styles.scopeRow, index < SCOPE_OPTIONS.length - 1 && styles.scopeRowDivider]}
                    onPress={() => handleSelectScope(scope)}
                  >
                    <Text
                      style={[
                        styles.scopeLabel,
                        { fontFamily: typography.semibold },
                        isSelected && styles.scopeLabelSelected,
                      ]}
                    >
                      {scopeLabels[scope] || scope}
                    </Text>
                    {isSelected ? <Feather name="check" size={16} color={Colors.primary} /> : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}

          <View style={styles.searchWrap}>
            <Feather name="search" size={17} color={Colors.textMuted} />
            <TextInput
              ref={searchInputRef}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={strings.social.searchPlaceholder}
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
            tabs={feedTabs}
            activeTab={activeFilter === 'saved' ? 'all' : activeFilter}
            onSelect={setActiveFilter}
          />

          <View style={styles.feedbackRow}>
            {selectedScope !== 'all' ? (
              <View style={styles.scopeFeedbackWrap}>
                <Text style={[styles.scopeFeedbackText, { fontFamily: typography.semibold }]}>
                  {strings.social.scopeFeedback.replace('{scope}', selectedScopeLabel)}
                </Text>
              </View>
            ) : null}

            {activeFilter !== 'all' ? (
              <View style={styles.filterFeedbackWrap}>
                <Text style={[styles.filterFeedbackText, { fontFamily: typography.semibold }]}>{filterFeedback}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <ScrollView
          style={styles.bodyScroll}
          contentContainerStyle={[styles.bodyContent, isMdUp && styles.bodyContentMd]}
          refreshControl={(
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
              progressBackgroundColor="#fff"
            />
          )}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={() => {
            if (isScopeDropdownOpen) {
              setIsScopeDropdownOpen(false);
            }
          }}
        >
          {isMdUp ? (
            <View style={styles.desktopLayout}>
              <View
                style={[
                  styles.leftColumn,
                  { width: leftWidth },
                  Platform.OS === 'web' ? styles.sidebarSticky : null,
                ]}
              >
                <SocialSidebarLeft
                  activeTab={activeFilter}
                  onSelectTab={setActiveFilter}
                  savedCount={totalSaved}
                />
              </View>

              <View style={styles.centerColumn}>{baseContent}</View>

              <View
                style={[
                  styles.rightColumn,
                  { width: rightWidth },
                  Platform.OS === 'web' ? styles.sidebarSticky : null,
                ]}
              >
                <SocialSidebarRight posts={filteredPosts} />
              </View>
            </View>
          ) : (
            <View style={styles.mobileColumn}>{baseContent}</View>
          )}
        </ScrollView>
      </SafeAreaView>

      {toastMessage ? (
        <View style={styles.toastWrap} pointerEvents="none">
          <Text style={[styles.toastText, { fontFamily: typography.semibold }]}>{toastMessage}</Text>
        </View>
      ) : null}

      <Modal
        transparent
        animationType="fade"
        visible={Boolean(modalState.type)}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={closeModal} />
          <View style={styles.modalCard}>
            {modalState.type === 'image' && modalState.post ? (
              <>
                <Text style={[styles.modalTitle, { fontFamily: typography.bold }]}>{strings.social.modals.imageTitle}</Text>
                <Image source={{ uri: modalState.post.imageUrl }} style={styles.modalImage} resizeMode="cover" />
                <Text style={[styles.modalDescription, { fontFamily: typography.regular }]} numberOfLines={2}>
                  {modalState.post.author}
                </Text>
              </>
            ) : null}

            {modalState.type === 'share' && modalState.post ? (
              <>
                <Text style={[styles.modalTitle, { fontFamily: typography.bold }]}>{strings.social.modals.shareTitle}</Text>
                <Text style={[styles.modalDescription, { fontFamily: typography.regular }]}>
                  {strings.social.modals.shareDescription.replace('{author}', modalState.post.author)}
                </Text>
                <View style={styles.modalActionsRow}>
                  <ModalAction
                    icon="copy"
                    label={strings.social.modals.shareOptions.copy}
                    onPress={() => showToast(strings.social.toasts.copyMock)}
                  />
                  <ModalAction
                    icon="send"
                    label={strings.social.modals.shareOptions.forward}
                    onPress={() => showToast(strings.social.toasts.shareMock)}
                  />
                </View>
              </>
            ) : null}

            {modalState.type === 'donate' && modalState.post ? (
              <>
                <Text style={[styles.modalTitle, { fontFamily: typography.bold }]}>{strings.social.modals.donateTitle}</Text>
                <Text style={[styles.modalDescription, { fontFamily: typography.regular }]}>
                  {strings.social.modals.donateDescription.replace('{author}', modalState.post.author)}
                </Text>
                <View style={styles.donationOptionsRow}>
                  {[500, 1000, 2500].map((amount) => (
                    <TouchableOpacity
                      key={amount}
                      style={styles.donationChip}
                      onPress={() => showToast(strings.social.toasts.donationMock.replace('{amount}', String(amount)))}
                    >
                      <Text style={[styles.donationChipText, { fontFamily: typography.semibold }]}>Rs {amount}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={[styles.modalHint, { fontFamily: typography.regular }]}>
                  {strings.social.modals.donateHint}
                </Text>
              </>
            ) : null}

            {modalState.type === 'compose' ? (
              <>
                <Text style={[styles.modalTitle, { fontFamily: typography.bold }]}>{strings.social.modals.comingSoonTitle}</Text>
                <Text style={[styles.modalDescription, { fontFamily: typography.regular }]}> 
                  {modalState.actionKey
                    ? strings.social.modals.comingSoonAction.replace(
                      '{action}',
                      strings.social.composer.actions[modalState.actionKey],
                    )
                    : strings.social.modals.comingSoonDescription}
                </Text>
              </>
            ) : null}

            {modalState.type === 'comment' ? (
              <>
                <Text style={[styles.modalTitle, { fontFamily: typography.bold }]}>{strings.social.modals.commentsTitle}</Text>
                <Text style={[styles.modalDescription, { fontFamily: typography.regular }]}>
                  {strings.social.modals.commentsDescription}
                </Text>
              </>
            ) : null}

            <TouchableOpacity style={styles.modalCloseBtn} onPress={closeModal}>
              <Text style={[styles.modalCloseText, { fontFamily: typography.semibold }]}>{strings.social.modals.close}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  topWrap: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 4,
    paddingBottom: Spacing.sm,
    gap: 10,
    zIndex: 15,
  },
  topWrapSticky: {
    position: 'sticky',
    top: 0,
    backgroundColor: 'rgba(242,242,247,0.95)',
    backdropFilter: 'blur(6px)',
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
    lineHeight: 30,
  },
  headerSubtitle: {
    color: Colors.textMuted,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  scopeFeedbackWrap: {
    alignSelf: 'flex-start',
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255,149,0,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,149,0,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  scopeFeedbackText: {
    color: Colors.secondary,
    fontSize: 11,
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
    paddingBottom: 110,
  },
  bodyContentMd: {
    paddingTop: 2,
  },
  mobileColumn: {
    gap: 10,
  },
  desktopLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  leftColumn: {
    gap: 10,
  },
  centerColumn: {
    flex: 1,
    minWidth: 320,
    gap: 10,
  },
  rightColumn: {
    gap: 10,
  },
  sidebarSticky: {
    position: 'sticky',
    top: 162,
    alignSelf: 'flex-start',
  },
  loadingList: {
    gap: 10,
  },
  feedList: {
    gap: 10,
  },
  toastWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 28,
    alignItems: 'center',
  },
  toastText: {
    backgroundColor: 'rgba(0,0,0,0.82)',
    color: '#fff',
    fontSize: 12,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 9,
    overflow: 'hidden',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: '#fff',
    padding: Spacing.md,
    gap: 10,
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
  },
  modalDescription: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  modalImage: {
    width: '100%',
    height: 220,
    borderRadius: Radius.md,
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  modalActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 10,
  },
  modalActionLabel: {
    color: Colors.textPrimary,
    fontSize: 12,
  },
  donationOptionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  donationChip: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,59,48,0.35)',
    backgroundColor: 'rgba(255,59,48,0.12)',
    paddingVertical: 10,
    alignItems: 'center',
  },
  donationChipText: {
    color: Colors.primary,
    fontSize: 12,
  },
  modalHint: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  modalCloseBtn: {
    marginTop: 4,
    alignSelf: 'flex-end',
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 12,
  },
});
