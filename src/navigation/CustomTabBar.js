import React from 'react';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  interpolateColor,
} from 'react-native-reanimated';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';

const { width } = Dimensions.get('window');

export const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      <BlurView intensity={80} tint="light" style={styles.blurWrapper}>
        <View style={styles.bar}>
          {state.routes.filter(r => r.name !== 'Profile').map((route) => {
            const index = state.routes.findIndex(r => r.key === route.key);
            const { options } = descriptors[route.key];
            const icon = options.tabBarIcon || 'circle';
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                // Determine the initial screen for each stack
                let initialScreen;
                switch (route.name) {
                  case 'Home': initialScreen = 'HomeMain'; break;
                  case 'Profile': initialScreen = 'ProfileOverview'; break;
                  default: initialScreen = undefined;
                }

                navigation.navigate(route.name, {
                  screen: initialScreen,
                  initial: true
                });
              }
            };

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                style={styles.item}
              >
                <TabIcon icon={icon} isFocused={isFocused} />
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
};

const TabIcon = ({ icon, isFocused }) => {
  const progress = useSharedValue(isFocused ? 1 : 0);

  React.useEffect(() => {
    progress.value = withSpring(isFocused ? 1 : 0, {
      damping: 18,
      stiffness: 150,
    });
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['transparent', Colors.primary]
    );

    return {
      transform: [{ scale: 1 + progress.value * 0.1 }],
      backgroundColor,
    };
  });

  return (
    <Animated.View style={[styles.iconContainer, animatedStyle]}>
      <Feather
        name={icon}
        size={22}
        color={isFocused ? '#fff' : Colors.textSecondary}
      />
      {isFocused && <View style={styles.activeDot} />}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.9)',
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -5 },
  },
  blurWrapper: {
    flex: 1,
  },
  bar: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
});

