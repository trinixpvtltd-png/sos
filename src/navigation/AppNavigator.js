import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import * as Linking from 'expo-linking';
import { Colors } from '../theme/colors';
import { CustomTabBar } from './CustomTabBar';
import {
  AvailableServiceScreen,
  ConfirmationScreen,
  ContributionDetailScreen,
  DistressHistoryScreen,
  DistressSignalScreen,
  HomeScreen,
  LoginScreen,
  NgoScreen,
  OtpScreen,
  PersonalDetailScreen,
  ProfileScreen,
  ResourcesScreen,
  ResourceTransparencyScreen,
  RevelationScreen,
  SocialScreen,
  StartScreen,
  ContributionsScreen,
} from '../screens';
import { useStrings } from '../localization/useStrings';
import { useAppContext } from '../context/AppContext';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();

const HomeNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeMain" component={HomeScreen} />
    <HomeStack.Screen name="DistressSignal" component={DistressSignalScreen} />
    <HomeStack.Screen name="ContributionDetail" component={ContributionDetailScreen} />
    <HomeStack.Screen name="AvailableService" component={AvailableServiceScreen} />
    <HomeStack.Screen name="ResourceTransparency" component={ResourceTransparencyScreen} />
  </HomeStack.Navigator>
);

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.surface,
  },
};

const profileLinkingConfig = {
  screens: {
    ProfileOverview: '',
    ProfileContributions: 'contributions',
    ProfileHistory: 'history',
    ProfilePersonal: 'details',
    ProfileContribDetail: 'contribution/:mode?',
  },
};

const homeLinkingConfig = {
  screens: {
    HomeMain: '',
    DistressSignal: 'distress',
    ContributionDetail: 'contribution/:mode?',
    AvailableService: 'available-service',
    ResourceTransparency: 'resource-transparency',
  },
};

const authenticatedLinkingConfig = {
  initialRouteName: 'Tabs',
  screens: {
    Tabs: {
      path: '',
      screens: {
        Ngo: 'ngo',
        Social: 'social',
        Home: {
          path: 'home',
          screens: homeLinkingConfig.screens,
        },
        Resources: 'resources',
        Revelation: 'revelation',
        Profile: {
          path: 'profile',
          screens: profileLinkingConfig.screens,
        },
      },
    },
    Confirmation: 'confirmation',
    PersonalDetail: 'personal-detail',
  },
};

const authFlowLinkingConfig = {
  initialRouteName: 'Start',
  screens: {
    Start: '',
    Otp: 'otp',
    Login: 'login',
  },
};

const getTabConfig = (strings) => [
  {
    name: 'Ngo',
    component: NgoScreen,
    label: strings.navigation.ngo,
    icon: 'users',
  },
  {
    name: 'Social',
    component: SocialScreen,
    label: strings.navigation.social,
    icon: 'zap',
  },
  {
    name: 'Home',
    component: HomeNavigator,
    label: strings.navigation.home,
    icon: 'grid',
  },
  {
    name: 'Resources',
    component: ResourcesScreen,
    label: strings.navigation.resources,
    icon: 'book',
  },
  {
    name: 'Revelation',
    component: RevelationScreen,
    label: strings.navigation.revelation,
    icon: 'mic',
  },
];

const Tabs = () => {
  const strings = useStrings();
  const tabConfig = useMemo(() => getTabConfig(strings), [strings]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        unmountOnBlur: true,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
      initialRouteName="Home"
    >
      {tabConfig.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{ tabBarLabel: tab.label, tabBarIcon: tab.icon }}
        />
      ))}
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Start" component={StartScreen} />
    <AuthStack.Screen name="Otp" component={OtpScreen} />
    <AuthStack.Screen name="Login" component={LoginScreen} />
  </AuthStack.Navigator>
);

const ProfileNavigator = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen
      name="ProfileOverview"
      component={ProfileScreen}
    />
    <ProfileStack.Screen
      name="ProfileContributions"
      component={ContributionsScreen}
    />
    <ProfileStack.Screen
      name="ProfileHistory"
      component={DistressHistoryScreen}
    />
    <ProfileStack.Screen
      name="ProfilePersonal"
      component={PersonalDetailScreen}
    />
    <ProfileStack.Screen
      name="ProfileContribDetail"
      component={ContributionDetailScreen}
    />
  </ProfileStack.Navigator>
);

const MainNavigator = () => (
  <RootStack.Navigator screenOptions={{ headerShown: false }}>
    <RootStack.Screen name="Tabs" component={Tabs} />
    <RootStack.Screen name="Confirmation" component={ConfirmationScreen} />
    <RootStack.Screen
      name="PersonalDetail"
      component={PersonalDetailScreen}
    />
  </RootStack.Navigator>
);

export const AppNavigator = () => {
  const { isAuthenticated } = useAppContext();
  const linking = useMemo(() => ({
    prefixes: [
      Linking.createURL('/'),
      'http://localhost:8081',
      'http://localhost:19006',
    ],
    config: isAuthenticated ? authenticatedLinkingConfig : authFlowLinkingConfig,
  }), [isAuthenticated]);

  return (
    <NavigationContainer theme={navigationTheme} linking={linking}>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
