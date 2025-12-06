import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { Colors, Gradients } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';

export const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <LinearGradient colors={Gradients.footer} style={styles.wrapper}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const icon = options.tabBarIcon || 'circle';
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.item}
            >
              <View style={[styles.iconCircle, isFocused && styles.iconCircleActive]}>
                <Feather
                  name={icon}
                  size={18}
                  color={isFocused ? '#fff' : Colors.textPrimary}
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.sm,
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    justifyContent: 'space-between',
    shadowColor: Colors.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
  },
  itemActive: {},
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5E6D8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  iconCircleActive: {
    backgroundColor: Colors.primary,
    shadowOpacity: 0.25,
  },
  label: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  labelActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
