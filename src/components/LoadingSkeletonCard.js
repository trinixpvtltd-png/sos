import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Radius, Spacing } from '../theme/metrics';

export const LoadingSkeletonCard = ({ lines = 3 }) => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 650, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 650, useNativeDriver: true }),
      ]),
    );

    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={styles.lineLg} />
      {Array.from({ length: lines }).map((_, index) => (
        <View key={index} style={[styles.line, index === lines - 1 && styles.lineSm]} />
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: 10,
  },
  lineLg: {
    width: '60%',
    height: 18,
    borderRadius: 8,
    backgroundColor: '#EBEDF0',
  },
  line: {
    width: '100%',
    height: 12,
    borderRadius: 8,
    backgroundColor: '#EBEDF0',
  },
  lineSm: {
    width: '70%',
  },
});
