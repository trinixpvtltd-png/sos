import { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Radius, Spacing } from '../theme/metrics';
import { useTypography } from '../theme/typography';

const normalizeFilters = (filters) => {
  if (!Array.isArray(filters)) return [];
  return filters
    .filter(Boolean)
    .map((item) => {
      if (typeof item === 'string') return { key: item, label: item };
      const key = item.key ?? item.value ?? item.id;
      const label = item.label ?? item.title ?? String(key ?? '');
      return { key: String(key), label: String(label) };
    })
    .filter((f) => f.key);
};

export const SearchFilterBar = ({
  searchValue,
  onChangeSearch,
  searchPlaceholder = 'Search...',
  filters = [],
  selectedFilter,
  onSelectFilter,
  defaultFiltersOpen = false,
}) => {
  const typography = useTypography();
  const [filtersOpen, setFiltersOpen] = useState(defaultFiltersOpen);

  const normalizedFilters = useMemo(() => normalizeFilters(filters), [filters]);
  const selectedKey = selectedFilter != null ? String(selectedFilter) : null;

  return (
    <View style={[styles.wrapper, filtersOpen && { zIndex: 1000 }]}>
      <View style={styles.row}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color={Colors.textSecondary} />
          <TextInput
            placeholder={searchPlaceholder}
            placeholderTextColor={Colors.textSecondary}
            style={[styles.searchInput, { fontFamily: typography.regular }]}
            value={searchValue}
            onChangeText={onChangeSearch}
          />
        </View>

        <TouchableOpacity
          style={[styles.filterButton, filtersOpen && styles.filterButtonActive]}
          onPress={() => setFiltersOpen((v) => !v)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Toggle filters"
        >
          <Feather name="sliders" size={20} color={filtersOpen ? Colors.primary : Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Active Filter Badge */}
      {selectedKey && selectedKey !== 'All' && (
        <View style={styles.activeFilterRow}>
          <View style={styles.activeBadge}>
            <Text style={[styles.activeBadgeText, { fontFamily: typography.bold }]}>
              {normalizedFilters.find(f => f.key === selectedKey)?.label || selectedKey}
            </Text>
            <TouchableOpacity
              onPress={() => onSelectFilter?.('All')}
              style={styles.clearBtn}
            >
              <Feather name="x-circle" size={16} color={Colors.primary} />
              <Text style={[styles.clearBtnText, { fontFamily: typography.bold }]}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Overlay Dropdown */}
      {filtersOpen && normalizedFilters.length > 0 ? (
        <View style={styles.dropdownOverlay}>
          <View style={styles.dropdownCard}>
            {normalizedFilters.map((filter, index) => {
              const isActive = selectedKey === filter.key;
              return (
                <TouchableOpacity
                  key={filter.key}
                  onPress={() => {
                    onSelectFilter?.(filter.key);
                    setFiltersOpen(false);
                  }}
                  style={[
                    styles.dropdownItem,
                    isActive && styles.dropdownItemActive,
                    index === 0 && { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
                    index === normalizedFilters.length - 1 && { borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
                    index !== normalizedFilters.length - 1 && styles.dropdownItemSeparator
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      { fontFamily: typography.semibold },
                      isActive && styles.dropdownTextActive,
                    ]}
                  >
                    {filter.label}
                  </Text>
                  {isActive && (
                    <Feather name="check" size={18} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: 12,
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingHorizontal: 20,
    height: 56,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.textPrimary,
    outlineStyle: 'none',
  },
  filterButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 72,
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 1000,
  },
  dropdownCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  dropdownItemSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f7',
  },
  dropdownItemActive: {
    backgroundColor: Colors.primary + '05',
  },
  dropdownText: {
    fontSize: 15,
    color: '#3A3A3C',
  },
  dropdownTextActive: {
    color: Colors.primary,
  },
  activeFilterRow: {
    paddingHorizontal: Spacing.lg,
    marginTop: -4,
    marginBottom: Spacing.sm,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    gap: 12,
  },
  activeBadgeText: {
    fontSize: 13,
    color: '#666',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  clearBtnText: {
    fontSize: 12,
    color: Colors.primary,
  },
});
