import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { Colors } from '../theme/colors';
import { CustomTabBar } from './CustomTabBar';
import { HomeScreen } from '../screens/HomeScreen';
import { NgoScreen } from '../screens/NgoScreen';
import { SocialScreen } from '../screens/SocialScreen';
import { ResourcesScreen } from '../screens/ResourcesScreen';
import { RevelationScreen } from '../screens/RevelationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { ConfirmationScreen } from '../screens/ConfirmationScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { useStrings } from '../localization/useStrings';
import { useAppContext } from '../context/AppContext';
import { ProfileOverviewScreen } from '../screens/profile/ProfileOverviewScreen';
import { ContributionsScreen } from '../screens/profile/ContributionsScreen';
import { DistressHistoryScreen } from '../screens/profile/DistressHistoryScreen';
import { StartScreen } from '../screens/StartScreen';
import { OtpScreen } from '../screens/OtpScreen';
import { DistressSignalScreen } from '../screens/DistressSignalScreen';
import { AvailableServiceScreen } from '../screens/AvailableServiceScreen';
import { ResourceTransparencyScreen } from '../screens/ResourceTransparencyScreen';
import { ContributionDetailScreen } from '../screens/ContributionDetailScreen';
import { PersonalDetailScreen } from '../screens/PersonalDetailScreen';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.surface,
  },
};

const getTabConfig = (strings) => [
  {
    name: 'Ngo',
    component: NgoScreen,
    label: strings.navigation.ngo,
    icon: 'heart',
  },
  {
    name: 'Social',
    component: SocialScreen,
    label: strings.navigation.social,
    icon: 'twitter',
  },
  {
    name: 'Home',
    component: HomeScreen,
    label: strings.navigation.home,
    icon: 'home',
  },
  {
    name: 'Resources',
    component: ResourcesScreen,
    label: strings.navigation.resources,
    icon: 'clipboard-list',
  },
  {
    name: 'Revelation',
    component: RevelationScreen,
    label: strings.navigation.revelation,
    icon: 'headphones',
  },
];

const Tabs = () => {
  const strings = useStrings();
  const tabConfig = useMemo(() => getTabConfig(strings), [strings]);

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      {tabConfig.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{ tabBarLabel: tab.label, tabBarIcon: tab.icon }}
        />
      ))}
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
  <ProfileStack.Navigator>
    <ProfileStack.Screen
      name="ProfileOverview"
      component={ProfileScreen}
      options={{ title: 'Profile' }}
    />
    <ProfileStack.Screen
      name="ProfileContributions"
      component={ContributionsScreen}
      options={{ title: 'Contributions' }}
    />
    <ProfileStack.Screen
      name="ProfileHistory"
      component={DistressHistoryScreen}
      options={{ title: 'Distress History' }}
    />
    <ProfileStack.Screen
      name="ProfilePersonal"
      component={PersonalDetailScreen}
      options={{ title: 'Personal Detail' }}
    />
    <ProfileStack.Screen
      name="ProfileContribDetail"
      component={ContributionDetailScreen}
      options={{ title: 'Contributions' }}
    />
  </ProfileStack.Navigator>
);

const MainNavigator = () => (
  <RootStack.Navigator>
    <RootStack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
    <RootStack.Screen
      name="Profile"
      component={ProfileNavigator}
      options={{ headerShown: false }}
    />
    <RootStack.Screen name="Confirmation" component={ConfirmationScreen} />
    <RootStack.Screen
      name="DistressSignal"
      component={DistressSignalScreen}
      options={{ title: 'Distress Signal' }}
    />
    <RootStack.Screen
      name="AvailableService"
      component={AvailableServiceScreen}
      options={{ title: 'Available Service' }}
    />
    <RootStack.Screen
      name="ResourceTransparency"
      component={ResourceTransparencyScreen}
      options={{ title: 'Resource Transparency' }}
    />
    <RootStack.Screen
      name="ContributionDetail"
      component={ContributionDetailScreen}
      options={{ title: 'Contribution Detail' }}
    />
    <RootStack.Screen
      name="PersonalDetail"
      component={PersonalDetailScreen}
      options={{ title: 'Personal Detail' }}
    />
  </RootStack.Navigator>
);

export const AppNavigator = () => {
  const { isAuthenticated } = useAppContext();

  return (
    <NavigationContainer theme={navigationTheme}>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
