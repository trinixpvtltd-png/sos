import React, { useMemo, useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { ngos } from '../data/ngos';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { useStrings } from '../localization/useStrings';
import { useBreakpoints } from '../hooks';
import { useAppContext } from '../context/AppContext';

const TABS = ['overview', 'campaigns', 'updates', 'transparency', 'about'];

export const NgoDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const strings = useStrings();
  const typography = useTypography();
  const { isMdUp, isLgUp } = useBreakpoints();
  const { language, toggleLanguage } = useAppContext();
  const ngo = useMemo(() => ngos.find((item) => item.id === route.params?.ngoId), [route.params?.ngoId]);

  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedMap, setLikedMap] = useState({});
  const [expandedMap, setExpandedMap] = useState({});
  const [followed, setFollowed] = useState(false);
  const [banner, setBanner] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const flash = (message) => {
    setBanner(message);
    setTimeout(() => setBanner(''), 2200);
  };

  if (!ngo) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
              <Feather name="arrow-left" size={18} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.topTitle, { fontFamily: typography.semibold }]}>{strings.ngo.detail.title}</Text>
            <View style={styles.iconBtn} />
          </View>
          <View style={styles.emptyWrap}>
            <Text style={[styles.emptyTitle, { fontFamily: typography.bold }]}>{strings.ngo.detail.notFoundTitle}</Text>
            <Text style={[styles.emptyText, { fontFamily: typography.regular }]}>{strings.ngo.detail.notFoundDescription}</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const initials = ngo.name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  const scopeLabel = strings.ngo.scopeOptions[ngo.level] || ngo.level;
  const navItems = [
    { key: 'home', icon: 'home', label: strings.navigation.home },
    { key: 'social', icon: 'zap', label: strings.navigation.social },
    { key: 'ngo', icon: 'users', label: strings.navigation.ngo, active: true },
    { key: 'resources', icon: 'book', label: strings.navigation.resources },
    { key: 'revelation', icon: 'mic', label: strings.navigation.revelation },
    { key: 'history', icon: 'clock', label: strings.distress.historyTitle },
    { key: 'settings', icon: 'settings', label: strings.settings.title },
  ];
  const campaigns = [
    { id: 'c1', title: `${ngo.category} Relief`, body: ngo.description, raised: Math.round(ngo.raisedAmount), goal: Math.round(ngo.goalAmount), status: 'active' },
    { id: 'c2', title: `72 Hr ${scopeLabel} Response`, body: `Rapid deployment lanes are active for ${ngo.location}.`, raised: Math.round(ngo.raisedAmount * 0.62), goal: Math.max(Math.round(ngo.goalAmount * 0.7), 1), status: 'urgent' },
  ];
  const posts = [
    {
      id: 'p1',
      title: 'Field response update',
      body: `Ground volunteers verified urgent needs across ${ngo.location}. Priority kits, local transport support, and responder routes were updated for the next relief cycle.`,
      imageUrl: ngo.imageUrl,
      category: ngo.category,
      reactionsCount: 124,
      commentsCount: 18,
      sharesCount: 9,
      location: ngo.location,
      time: '3h ago',
      goal: campaigns[0].goal,
      raised: campaigns[0].raised,
      commentsPreview: [
        { id: 'cp1', author: 'District Volunteer Desk', text: 'Drop points have been updated for the next 4 hours.' },
        { id: 'cp2', author: 'Civic Support Group', text: 'Two extra vehicles are on standby.' },
      ],
    },
    {
      id: 'p2',
      title: 'Volunteer deployment',
      body: 'Community responders, health kits, and food packets have been redistributed. Additional volunteers are requested for evening support rotations and safe pickup coordination.',
      imageUrl: ngo.imageUrl,
      category: strings.ngo.detail.updatesTitle,
      reactionsCount: 89,
      commentsCount: 11,
      sharesCount: 6,
      location: ngo.location,
      time: 'Yesterday',
      commentsPreview: [
        { id: 'cp3', author: 'Field Ops Lead', text: 'Night shift roster is being shared with verified partners.' },
        { id: 'cp4', author: 'Medical Support Hub', text: 'Medicine inventory is stable for the next dispatch window.' },
      ],
    },
  ].filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return true;
    }
    return `${item.title} ${item.body} ${item.category} ${item.location}`.toLowerCase().includes(query);
  });

  const renderLeft = (extraStyle = null) => (
    <View style={[styles.card, extraStyle]}>
      <Text style={[styles.cardTitle, { fontFamily: typography.bold }]}>{strings.social.sidebars.leftTitle}</Text>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={[styles.navItem, item.active && styles.navItemActive]}
          onPress={() => {
            setIsMenuOpen(false);
            if (!item.active) {
              flash(strings.social.modals.comingSoonDescription);
            }
          }}
        >
          <Feather name={item.icon} size={16} color={item.active ? Colors.primary : Colors.textSecondary} />
          <Text style={[styles.navLabel, { fontFamily: typography.semibold }, item.active && styles.navLabelActive]}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPost = (post) => {
    const liked = Boolean(likedMap[post.id]);
    const expanded = Boolean(expandedMap[post.id]);
    const trim = post.body.length > 145;
    const bodyText = trim && !expanded ? `${post.body.slice(0, 145)}...` : post.body;
    const progress = post.goal ? Math.min(100, Math.round((post.raised / Math.max(1, post.goal)) * 100)) : 0;

    return (
      <View key={post.id} style={styles.card}>
        <View style={styles.postHeader}>
          <View style={styles.avatarSmall}><Text style={[styles.avatarSmallText, { fontFamily: typography.bold }]}>{initials}</Text></View>
          <View style={{ flex: 1 }}>
            <View style={styles.rowWrap}>
              <Text style={[styles.postAuthor, { fontFamily: typography.semibold }]}>{ngo.name}</Text>
              <Chip label={strings.social.feed.verifiedLabel} info />
            </View>
            <Text style={[styles.metaText, { fontFamily: typography.regular }]}>{post.time} | {post.location}</Text>
          </View>
          <View style={styles.postRight}>
            <Chip label={post.category} urgent={post.category === ngo.category} />
            <TouchableOpacity style={styles.moreBtn} onPress={() => flash(strings.social.modals.comingSoonDescription)}>
              <Feather name="more-horizontal" size={15} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.postTitle, { fontFamily: typography.semibold }]}>{post.title}</Text>
        <Text style={[styles.postBody, { fontFamily: typography.regular }]}>{bodyText}</Text>
        {trim ? (
          <TouchableOpacity onPress={() => setExpandedMap((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}>
            <Text style={[styles.linkText, { fontFamily: typography.semibold }]}>{expanded ? strings.social.feed.seeLess : strings.social.feed.seeMore}</Text>
          </TouchableOpacity>
        ) : null}
        <Image source={{ uri: post.imageUrl }} style={styles.postImage} resizeMode="cover" />

        {post.goal ? (
          <View style={styles.progressCard}>
            <View style={styles.rowWrap}>
              <Text style={[styles.progressStrong, { fontFamily: typography.bold }]}>Rs {post.raised.toLocaleString()}</Text>
              <Text style={[styles.progressDim, { fontFamily: typography.regular }]}>/ Rs {post.goal.toLocaleString()}</Text>
              <Text style={[styles.linkText, { fontFamily: typography.semibold }]}>{progress}%</Text>
            </View>
            <View style={styles.track}><View style={[styles.fill, { width: `${progress}%` }]} /></View>
          </View>
        ) : null}

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryText, { fontFamily: typography.regular }]}>{post.reactionsCount + (liked ? 1 : 0)} {strings.social.actions.like.toLowerCase()}</Text>
          <Text style={[styles.summaryText, { fontFamily: typography.regular }]}>{post.commentsCount} {strings.social.feed.commentsLabel}</Text>
          <Text style={[styles.summaryText, { fontFamily: typography.regular }]}>{post.sharesCount} {strings.social.feed.sharesLabel}</Text>
        </View>

        <View style={styles.actionsRow}>
          <ActionPill icon={liked ? 'heart' : 'thumbs-up'} label={liked ? strings.social.actions.liked : strings.social.actions.like} active={liked} onPress={() => setLikedMap((prev) => ({ ...prev, [post.id]: !prev[post.id] }))} />
          <ActionPill icon="message-circle" label={strings.social.actions.comment} onPress={() => flash(strings.social.modals.commentsDescription)} />
          <ActionPill icon="share-2" label={strings.social.actions.share} onPress={() => flash(strings.ngo.detail.messageShared)} />
          <ActionPill icon="heart" label={strings.social.actions.donate} onPress={() => flash(strings.social.modals.donateHint)} />
        </View>

        <View style={styles.commentsBox}>
          {post.commentsPreview.map((comment) => (
            <Text key={comment.id} style={[styles.commentLine, { fontFamily: typography.regular }]}>
              <Text style={{ fontFamily: typography.semibold }}>{comment.author}: </Text>{comment.text}
            </Text>
          ))}
          <Text style={[styles.linkText, { fontFamily: typography.semibold }]}>{strings.social.feed.viewAllComments}</Text>
          <View style={styles.commentInput}>
            <Feather name="message-square" size={14} color={Colors.textMuted} />
            <Text style={[styles.commentHint, { fontFamily: typography.regular }]}>{strings.social.feed.commentPlaceholder}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderCenter = () => (
    <View style={styles.centerCol}>
      <View style={styles.heroCard}>
        <Image source={{ uri: ngo.imageUrl }} style={styles.coverImage} resizeMode="cover" />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.24)']} style={styles.coverOverlay} />
        <View style={styles.profilePanel}>
          <View style={styles.avatar}>
            <Image source={{ uri: ngo.imageUrl }} style={styles.avatarImage} resizeMode="cover" />
            <View style={styles.avatarFallback}><Text style={[styles.avatarText, { fontFamily: typography.bold }]}>{initials}</Text></View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.rowWrap}>
              <Text style={[styles.heroName, { fontFamily: typography.bold }]}>{ngo.name}</Text>
              <Chip label={strings.social.feed.verifiedLabel} info />
            </View>
            <Text style={[styles.metaText, { fontFamily: typography.regular }]}>{ngo.category} | {ngo.location}</Text>
            <Text style={[styles.postBody, { fontFamily: typography.regular }]} numberOfLines={2}>{ngo.description}</Text>
            <View style={styles.actionsRow}>
              <ActionPill icon={followed ? 'check' : 'plus'} label={followed ? strings.ngo.detail.following : strings.ngo.detail.follow} active onPress={() => { setFollowed((prev) => !prev); flash(strings.ngo.detail.messageFollowed); }} />
              <ActionPill icon="heart" label={strings.ngo.detail.donate} onPress={() => { setActiveTab('campaigns'); flash(strings.social.modals.donateHint); }} />
              <ActionPill icon="share-2" label={strings.ngo.detail.share} onPress={() => flash(strings.ngo.detail.messageShared)} />
              <ActionPill icon="phone" label={strings.ngo.detail.contact} onPress={() => { setActiveTab('about'); flash(strings.ngo.detail.messageContact); }} />
            </View>
          </View>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
        {TABS.map((tab) => {
          const active = activeTab === tab;
          return (
            <TouchableOpacity key={tab} style={[styles.tab, active && styles.tabActive]} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, { fontFamily: typography.semibold }, active && styles.tabTextActive]}>{strings.ngo.detail.tabs[tab]}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.card}>
        <View style={styles.rowWrap}>
          <View style={styles.avatarSmall}><Text style={[styles.avatarSmallText, { fontFamily: typography.bold }]}>{initials}</Text></View>
          <TouchableOpacity style={styles.composerBox} onPress={() => flash(strings.social.modals.comingSoonDescription)}>
            <Text style={[styles.composerText, { fontFamily: typography.regular }]}>{strings.social.composer.prompt}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.actionsRow}>
          <ActionPill icon="plus-square" label={strings.common.add} onPress={() => flash(strings.social.modals.comingSoonDescription)} />
          <ActionPill icon="file-text" label={strings.navigation.revelation} onPress={() => navigation.navigate('Revelation')} />
          <ActionPill icon="alert-triangle" label={strings.social.composer.actions.alert} onPress={() => flash(strings.social.modals.comingSoonDescription)} />
        </View>
      </View>

      <View style={styles.sectionBlock}>
        <Text style={[styles.sectionHeading, { fontFamily: typography.bold }]}>{strings.social.highlights.title}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.highlightsRow}>
          {[
            { id: 'h1', icon: 'shield', title: strings.ngo.detail.campaignsTitle, meta: `${campaigns.length} active` },
            { id: 'h2', icon: 'users', title: strings.ngo.detail.beneficiariesLabel, meta: '4.8k supported' },
            { id: 'h3', icon: 'map-pin', title: strings.ngo.detail.operatingAreasTitle, meta: scopeLabel },
            { id: 'h4', icon: 'activity', title: strings.ngo.detail.responseTimeLabel, meta: '18 min avg' },
          ].map((item, index) => (
            <LinearGradient key={item.id} colors={index % 2 === 0 ? ['#FF4D4F', '#FF7A45'] : ['#FF9F0A', '#FFC53D']} style={styles.highlight}>
              <View style={styles.highlightIcon}><Feather name={item.icon} size={16} color="#fff" /></View>
              <Text style={[styles.highlightTitle, { fontFamily: typography.bold }]}>{item.title}</Text>
              <Text style={[styles.highlightMeta, { fontFamily: typography.regular }]}>{item.meta}</Text>
            </LinearGradient>
          ))}
        </ScrollView>
      </View>

      {activeTab === 'overview' ? (
        <>
          <View style={styles.card}>
            <Text style={[styles.cardTitle, { fontFamily: typography.semibold }]}>{strings.ngo.detail.missionTitle}</Text>
            <Text style={[styles.postBody, { fontFamily: typography.regular }]}>{ngo.description}</Text>
            <View style={styles.statsRow}>
              <StatMini label={strings.ngo.detail.campaignsLabel} value={String(campaigns.length)} />
              <StatMini label={strings.ngo.detail.beneficiariesLabel} value="4.8k" />
              <StatMini label={strings.ngo.detail.raisedLabel} value={`Rs ${Math.round(ngo.raisedAmount).toLocaleString()}`} />
            </View>
          </View>
          {posts.slice(0, 1).map(renderPost)}
        </>
      ) : null}

      {activeTab === 'campaigns'
        ? campaigns.map((item) => {
            const progress = Math.min(100, Math.round((item.raised / Math.max(1, item.goal)) * 100));
            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.rowWrap}>
                  <Text style={[styles.cardTitle, { fontFamily: typography.semibold }]}>{item.title}</Text>
                  <Chip label={strings.ngo.detail.campaignStatuses[item.status]} urgent={item.status === 'urgent'} />
                </View>
                <Text style={[styles.postBody, { fontFamily: typography.regular }]}>{item.body}</Text>
                <View style={styles.rowWrap}>
                  <Text style={[styles.progressStrong, { fontFamily: typography.bold }]}>Rs {item.raised.toLocaleString()}</Text>
                  <Text style={[styles.progressDim, { fontFamily: typography.regular }]}>/ Rs {item.goal.toLocaleString()}</Text>
                  <Text style={[styles.linkText, { fontFamily: typography.semibold }]}>{progress}%</Text>
                </View>
                <View style={styles.track}><View style={[styles.fill, { width: `${progress}%` }]} /></View>
                <View style={styles.actionsRow}>
                  <ActionPill icon="heart" label={strings.social.actions.donate} onPress={() => flash(strings.social.modals.donateHint)} />
                  <ActionPill icon="share-2" label={strings.social.actions.share} onPress={() => flash(strings.ngo.detail.messageShared)} />
                </View>
              </View>
            );
          })
        : null}

      {activeTab === 'updates' ? posts.map(renderPost) : null}

      {activeTab === 'transparency' ? (
        <>
          <View style={styles.card}>
            <Text style={[styles.cardTitle, { fontFamily: typography.semibold }]}>{strings.ngo.detail.transparencyTitle}</Text>
            {[
              { amount: 'Rs 18,500', purpose: 'medical kits', when: 'Today' },
              { amount: 'Rs 11,200', purpose: 'food relief packs', when: 'Yesterday' },
              { amount: 'Rs 7,600', purpose: 'volunteer transport', when: '2 days ago' },
            ].map((item, index) => (
              <View key={`${item.amount}-${index}`} style={[styles.allocRow, index > 0 && styles.allocBorder]}>
                <View style={styles.allocIcon}><Feather name="briefcase" size={14} color={Colors.primary} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.commentLine, { fontFamily: typography.regular }]}>{strings.ngo.detail.allocationLine.replace('{amount}', item.amount).replace('{purpose}', item.purpose)}</Text>
                  <Text style={[styles.metaText, { fontFamily: typography.regular }]}>{item.when}</Text>
                </View>
                <Chip label={strings.ngo.detail.proofBadge} />
              </View>
            ))}
          </View>
          <View style={styles.card}>
            <Text style={[styles.cardTitle, { fontFamily: typography.semibold }]}>{strings.ngo.detail.verificationTitle}</Text>
            <View style={styles.actionsRow}>
              <Chip label={strings.ngo.detail.proofBadge} />
              <Chip label="Ground partner" />
              <Chip label="Audit-ready" />
            </View>
          </View>
        </>
      ) : null}

      {activeTab === 'about' ? (
        <>
          <View style={styles.card}>
            <Text style={[styles.cardTitle, { fontFamily: typography.semibold }]}>{strings.ngo.detail.aboutTitle}</Text>
            <Text style={[styles.postBody, { fontFamily: typography.regular }]}>{strings.ngo.detail.aboutDescription}</Text>
          </View>
          <View style={styles.card}>
            <Text style={[styles.cardTitle, { fontFamily: typography.semibold }]}>{strings.ngo.detail.contactInfoTitle}</Text>
            <Text style={[styles.commentLine, { fontFamily: typography.regular }]}>ops@sankat-demo.org</Text>
            <Text style={[styles.commentLine, { fontFamily: typography.regular }]}>+91 98xxxxxx10</Text>
            <Text style={[styles.commentLine, { fontFamily: typography.regular }]}>{ngo.location}</Text>
            <Text style={[styles.commentLine, { fontFamily: typography.regular }]}>{scopeLabel} operations</Text>
          </View>
          <View style={styles.card}>
            <Text style={[styles.cardTitle, { fontFamily: typography.semibold }]}>{strings.ngo.detail.registrationTitle}</Text>
            <Text style={[styles.postBody, { fontFamily: typography.regular }]}>{strings.ngo.detail.registeredPlaceholder}</Text>
          </View>
        </>
      ) : null}
    </View>
  );

  const renderRight = () => (
    <View style={styles.rightCol}>
      <MiniWidget title={strings.social.sidebars.widgets.urgentCampaigns} lines={campaigns.map((item) => `${item.title} - ${Math.round((item.raised / Math.max(1, item.goal)) * 100)}% funded`)} />
      <MiniWidget title={strings.social.sidebars.widgets.nearbyResources} lines={['Medical desk - relief hub', 'Safe pickup lane - 2 checkpoints', 'Help docs - verified checklist']} />
      <MiniWidget title={strings.social.sidebars.widgets.trendingTags} tags={strings.social.sidebars.tags} />
      <MiniWidget title={strings.social.sidebars.widgets.safetyTips} lines={Object.values(strings.social.sidebars.tips)} />
      <MiniWidget title={strings.social.sidebars.widgets.topContributors} lines={['Relief Circle - Rs 42,000', 'Citizen Aid Desk - Rs 28,500', 'Metro Volunteers - Rs 17,800']} />
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FFF6F4', '#FFF9F2', '#F4F4F8']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <Feather name="arrow-left" size={18} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.brandWrap}>
            <Text
              style={[
                styles.brand,
                { fontFamily: typography.brand },
                !isMdUp && styles.brandCompact,
              ]}
              numberOfLines={1}
            >
              Sankat Mochan
            </Text>
            <Text style={[styles.topTitle, { fontFamily: typography.semibold }]} numberOfLines={1}>{strings.ngo.detail.title}</Text>
          </View>
          {isMdUp ? (
            <View style={styles.searchWrap}>
              <Feather name="search" size={16} color={Colors.textMuted} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={strings.social.searchPlaceholder}
                placeholderTextColor={Colors.textMuted}
                style={[styles.searchInput, { fontFamily: typography.regular }]}
              />
            </View>
          ) : null}
          {isLgUp ? (
            <View style={styles.topActions}>
              <ActionPill icon="plus-square" label={strings.common.add} onPress={() => flash(strings.social.modals.comingSoonDescription)} />
              <ActionPill icon="file-text" label={strings.navigation.revelation} onPress={() => navigation.navigate('Revelation')} />
              <ActionPill icon="alert-triangle" label={strings.social.composer.actions.alert} onPress={() => flash(strings.social.modals.comingSoonDescription)} />
            </View>
          ) : null}
          {!isLgUp ? (
            <TouchableOpacity style={styles.iconBtn} onPress={() => setIsMenuOpen(true)}>
              <Feather name="menu" size={18} color={Colors.textPrimary} />
            </TouchableOpacity>
          ) : null}
          {isMdUp ? (
            <TouchableOpacity style={styles.iconBtn} onPress={() => flash(strings.social.modals.notificationsDescription)}>
              <Feather name="bell" size={16} color={Colors.textPrimary} />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Profile', { screen: 'ProfileOverview' })}>
            <Feather name="user" size={16} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.langBtn, !isMdUp && styles.langBtnCompact]} onPress={toggleLanguage}>
            <Text style={[styles.langText, { fontFamily: typography.semibold }, !isMdUp && styles.langTextCompact]}>{language.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        {banner ? (
          <View style={styles.banner}>
            <Feather name="info" size={15} color={Colors.info} />
            <Text style={[styles.bannerText, { fontFamily: typography.regular }]}>{banner}</Text>
          </View>
        ) : null}

        <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
          {isLgUp ? (
            <View style={styles.layoutDesktop}>
              <View style={styles.leftDesk}>{renderLeft()}</View>
              <View style={styles.centerDesk}>{renderCenter()}</View>
              <View style={styles.rightDesk}>{renderRight()}</View>
            </View>
          ) : (
            <View style={styles.layoutMobile}>
              {renderCenter()}
              {renderRight()}
            </View>
          )}
        </ScrollView>

        <Modal
          visible={isMenuOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsMenuOpen(false)}
        >
          <View style={styles.drawerOverlay}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => setIsMenuOpen(false)}
            />
            <View style={styles.drawerWrap}>
              {renderLeft(styles.drawerCard)}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

const ActionPill = ({ icon, label, onPress, active = false }) => {
  const typography = useTypography();
  return (
    <TouchableOpacity style={[styles.pill, active && styles.pillActive]} onPress={onPress}>
      <Feather name={icon} size={13} color={active ? '#fff' : Colors.textPrimary} />
      <Text style={[styles.pillText, { fontFamily: typography.semibold }, active && styles.pillTextActive]} numberOfLines={1}>{label}</Text>
    </TouchableOpacity>
  );
};

const Chip = ({ label, urgent = false, info = false }) => {
  const typography = useTypography();
  return (
    <View style={[styles.chip, urgent && styles.chipUrgent, info && styles.chipInfo]}>
      <Text style={[styles.chipText, { fontFamily: typography.semibold }, urgent && styles.chipTextUrgent, info && styles.chipTextInfo]}>{label}</Text>
    </View>
  );
};

const StatMini = ({ label, value }) => {
  const typography = useTypography();
  return (
    <View style={styles.statMini}>
      <Text style={[styles.statMiniValue, { fontFamily: typography.bold }]}>{value}</Text>
      <Text style={[styles.statMiniLabel, { fontFamily: typography.regular }]}>{label}</Text>
    </View>
  );
};

const MiniWidget = ({ title, lines = [], tags = [] }) => {
  const typography = useTypography();
  return (
    <View style={styles.card}>
      <Text style={[styles.cardTitle, { fontFamily: typography.semibold }]}>{title}</Text>
      {lines.map((line, index) => (
        <Text key={`${title}-${index}`} style={[styles.commentLine, { fontFamily: typography.regular }]}>{line}</Text>
      ))}
      {tags.length ? (
        <View style={styles.actionsRow}>
          {tags.map((tag) => <Chip key={tag} label={tag} />)}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safeArea: { flex: 1 },
  topBar: { paddingHorizontal: Spacing.lg, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  brandWrap: { flexShrink: 1, minWidth: 0, maxWidth: 168 },
  brand: { color: Colors.primary, fontSize: 22, lineHeight: 22 },
  brandCompact: { fontSize: 18, lineHeight: 18 },
  topTitle: { color: Colors.textSecondary, fontSize: 12, marginTop: 2 },
  searchWrap: { flex: 1, minHeight: 42, borderRadius: Radius.md, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', backgroundColor: 'rgba(255,255,255,0.9)', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12 },
  searchInput: { flex: 1, color: Colors.textPrimary, fontSize: 12, paddingVertical: 8, outlineStyle: 'none' },
  topActions: { flexDirection: 'row', gap: 8 },
  langBtn: { minWidth: 48, height: 40, borderRadius: 20, borderWidth: 1, borderColor: `${Colors.primary}22`, backgroundColor: `${Colors.primary}10`, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  langText: { color: Colors.primary, fontSize: 12 },
  langBtnCompact: { minWidth: 40, width: 40, paddingHorizontal: 0 },
  langTextCompact: { fontSize: 10 },
  banner: { marginHorizontal: Spacing.lg, marginBottom: 10, borderRadius: Radius.md, borderWidth: 1, borderColor: `${Colors.info}25`, backgroundColor: `${Colors.info}10`, paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  bannerText: { flex: 1, color: Colors.info, fontSize: 12 },
  page: { paddingHorizontal: Spacing.lg, paddingBottom: 110 },
  layoutDesktop: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  layoutMobile: { gap: 14 },
  leftDesk: { width: '22%' },
  centerDesk: { width: '50%' },
  rightDesk: { width: '28%' },
  centerCol: { gap: 14 },
  rightCol: { gap: 12 },
  card: { borderRadius: Radius.lg, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', backgroundColor: 'rgba(255,255,255,0.9)', padding: 14, gap: 10 },
  cardTitle: { color: Colors.textPrimary, fontSize: 14 },
  navItem: { minHeight: 42, borderRadius: Radius.md, paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  navItemActive: { backgroundColor: `${Colors.primary}10`, borderWidth: 1, borderColor: `${Colors.primary}18` },
  navLabel: { flex: 1, color: Colors.textSecondary, fontSize: 13 },
  navLabelActive: { color: Colors.primary },
  heroCard: { borderRadius: Radius.lg, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', backgroundColor: 'rgba(255,255,255,0.88)', overflow: 'hidden' },
  coverImage: { width: '100%', height: 220 },
  coverOverlay: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 220 },
  profilePanel: { marginTop: -32, padding: 16, flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
  avatar: { width: 86, height: 86, borderRadius: 24, overflow: 'hidden', borderWidth: 3, borderColor: '#fff', backgroundColor: '#fff' },
  avatarImage: { width: '100%', height: '100%' },
  avatarFallback: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.18)' },
  avatarText: { color: '#fff', fontSize: 20 },
  heroName: { flex: 1, color: Colors.textPrimary, fontSize: 22 },
  rowWrap: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  metaText: { color: Colors.textMuted, fontSize: 11 },
  pill: { minHeight: 36, borderRadius: Radius.md, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', backgroundColor: 'rgba(255,255,255,0.92)', paddingHorizontal: 10, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
  pillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  pillText: { color: Colors.textPrimary, fontSize: 11, maxWidth: 100 },
  pillTextActive: { color: '#fff' },
  tabsRow: { gap: 8 },
  tab: { borderRadius: Radius.md, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', backgroundColor: 'rgba(255,255,255,0.9)', paddingVertical: 9, paddingHorizontal: 14 },
  tabActive: { borderColor: `${Colors.primary}22`, backgroundColor: `${Colors.primary}10` },
  tabText: { color: Colors.textSecondary, fontSize: 12 },
  tabTextActive: { color: Colors.primary },
  avatarSmall: { width: 42, height: 42, borderRadius: 21, backgroundColor: `${Colors.primary}14`, alignItems: 'center', justifyContent: 'center' },
  avatarSmallText: { color: Colors.primary, fontSize: 14 },
  composerBox: { flex: 1, minHeight: 44, borderRadius: Radius.md, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', backgroundColor: '#fff', justifyContent: 'center', paddingHorizontal: 12 },
  composerText: { color: Colors.textMuted, fontSize: 13 },
  sectionBlock: { gap: 10 },
  sectionHeading: { color: Colors.textPrimary, fontSize: 22 },
  highlightsRow: { gap: 10 },
  highlight: { width: 168, minHeight: 116, borderRadius: Radius.lg, padding: 14, gap: 10 },
  highlightIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center' },
  highlightTitle: { color: '#fff', fontSize: 15 },
  highlightMeta: { color: 'rgba(255,255,255,0.92)', fontSize: 12 },
  postHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  postAuthor: { color: Colors.textPrimary, fontSize: 14 },
  postRight: { alignItems: 'flex-end', gap: 6 },
  moreBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.04)', alignItems: 'center', justifyContent: 'center' },
  chip: { borderRadius: Radius.md, backgroundColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 8, paddingVertical: 5 },
  chipUrgent: { backgroundColor: `${Colors.primary}12` },
  chipInfo: { backgroundColor: `${Colors.info}12` },
  chipText: { color: Colors.textSecondary, fontSize: 10 },
  chipTextUrgent: { color: Colors.primary },
  chipTextInfo: { color: Colors.info },
  postTitle: { color: Colors.textPrimary, fontSize: 15 },
  postBody: { color: Colors.textSecondary, fontSize: 13, lineHeight: 20 },
  linkText: { color: Colors.primary, fontSize: 12 },
  postImage: { width: '100%', height: 208, borderRadius: Radius.md },
  progressCard: { borderRadius: Radius.md, backgroundColor: 'rgba(0,0,0,0.03)', padding: 10, gap: 8 },
  progressStrong: { color: Colors.textPrimary, fontSize: 14 },
  progressDim: { color: Colors.textMuted, fontSize: 12 },
  track: { height: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.08)', overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: Colors.primary },
  summaryRow: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(0,0,0,0.06)', paddingVertical: 8, flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  summaryText: { color: Colors.textMuted, fontSize: 12 },
  actionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  commentsBox: { gap: 8 },
  commentLine: { color: Colors.textSecondary, fontSize: 12, lineHeight: 18 },
  commentInput: { minHeight: 40, borderRadius: Radius.md, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', backgroundColor: 'rgba(0,0,0,0.02)', paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  commentHint: { flex: 1, color: Colors.textMuted, fontSize: 12 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statMini: { width: '48%', borderRadius: Radius.md, backgroundColor: 'rgba(0,0,0,0.03)', padding: 10, gap: 3 },
  statMiniValue: { color: Colors.textPrimary, fontSize: 13 },
  statMiniLabel: { color: Colors.textMuted, fontSize: 10 },
  allocRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  allocBorder: { borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' },
  allocIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: `${Colors.primary}12`, alignItems: 'center', justifyContent: 'center' },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.lg, gap: 8 },
  emptyTitle: { color: Colors.textPrimary, fontSize: 20, textAlign: 'center' },
  emptyText: { color: Colors.textMuted, fontSize: 13, textAlign: 'center' },
  drawerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.22)' },
  drawerWrap: { paddingTop: 84, paddingHorizontal: Spacing.lg, width: '100%', maxWidth: 360 },
  drawerCard: {
    backgroundColor: 'rgba(255,255,255,0.98)',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
  },
});
