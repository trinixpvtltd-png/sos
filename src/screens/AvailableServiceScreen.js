import { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';
import { useStrings } from '../localization/useStrings';

const STATES = ['Delhi', 'Uttar Pradesh', 'Bihar', 'Jharkhand'];
const DISTRICTS = ['Gautam Buddha Nagar', 'Agra', 'Aligarh', 'Varanasi'];
const SERVICES = [
  { id: 'srv1', name: 'Police Helpline', desc: 'Dial 100 for police assistance' },
  { id: 'srv2', name: 'Women Helpline', desc: '181 Women Helpline' },
  { id: 'srv3', name: 'Food Helpline', desc: 'Food distribution support' },
  { id: 'srv4', name: 'Acid Helpline', desc: 'Immediate acid attack support' },
  { id: 'srv5', name: 'Welfare Helpline', desc: 'Welfare department escalation' },
  { id: 'srv6', name: 'Ambulance Helpline', desc: '108 Ambulance service' },
];

export const AvailableServiceScreen = () => {
  const typography = useTypography();
  const strings = useStrings();
  const [activeState, setActiveState] = useState(STATES[0]);
  const [activeDistrict, setActiveDistrict] = useState(DISTRICTS[0]);
  const [activeService, setActiveService] = useState(SERVICES[0]);
  const [openMenu, setOpenMenu] = useState(null);

  const renderSelect = (label, value, options, onSelect, menuKey) => (
    <View style={styles.selectColumn}>
      <Text style={[styles.heading, { fontFamily: typography.semibold }]}>{label}</Text>
      <TouchableOpacity
        style={styles.selectBox}
        activeOpacity={0.9}
        onPress={() => setOpenMenu(openMenu === menuKey ? null : menuKey)}
      >
        <Text style={[styles.selectValue, { fontFamily: typography.semibold }]} numberOfLines={2}>
          {value}
        </Text>
      </TouchableOpacity>
      {openMenu === menuKey ? (
        <View style={styles.dropdown}>
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  onSelect(item);
                  setOpenMenu(null);
                }}
              >
                <Text style={[styles.dropdownLabel, { fontFamily: typography.regular }]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#F1E5D9' }} />}
            style={{ maxHeight: 220 }}
          />
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.title, { fontFamily: typography.bold }]}>{strings.services.title}</Text>
      <View style={styles.selectStack}>
        {renderSelect(strings.services.states, activeState, STATES, setActiveState, 'state')}
        {renderSelect(strings.services.districts, activeDistrict, DISTRICTS, setActiveDistrict, 'district')}
        {renderSelect(
          strings.services.list,
          activeService?.name,
          SERVICES.map((s) => s.name),
          (name) => setActiveService(SERVICES.find((s) => s.name === name) ?? SERVICES[0]),
          'service',
        )}
      </View>

      {activeService ? (
        <View style={styles.detail}>
          <Text style={[styles.detailLabel, { fontFamily: typography.semibold }]}>
            Service: {activeService.name}
          </Text>
          <Text style={[styles.detailLabel, { fontFamily: typography.regular }]}>
            Helpline: {activeDistrict} / {activeState}
          </Text>
          <Text style={[styles.detailLabel, { fontFamily: typography.regular }]}>
            Description: {activeService.desc}
          </Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
  },
  title: {
    fontSize: 22,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  selectStack: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  selectColumn: {
    gap: Spacing.xs,
  },
  heading: {
    color: Colors.textPrimary,
    marginBottom: 0,
  },
  selectBox: {
    minHeight: 44,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#E4B67A',
    backgroundColor: '#fff',
    paddingHorizontal: Spacing.sm,
    justifyContent: 'center',
  },
  selectValue: {
    color: Colors.textPrimary,
  },
  dropdown: {
    marginTop: Spacing.xs,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E4B67A',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  dropdownLabel: {
    color: Colors.textPrimary,
  },
  detail: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E4B67A',
  },
  detailLabel: {
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
});
