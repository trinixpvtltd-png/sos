import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/metrics';
import { ResourceTransparencyPanel } from '../components/ResourceTransparencyPanel';

export const ResourceTransparencyScreen = () => {
  const route = useRoute();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ResourceTransparencyPanel initialMode={route.params?.initialMode} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    padding: Spacing.lg,
  },
});
