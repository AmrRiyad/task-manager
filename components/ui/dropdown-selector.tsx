import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ChevronsUpDown } from 'lucide-react-native';
import React, { memo, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

export interface DropdownOption {
  value: string;
  label: string;
  color?: string;
}

interface DropdownSelectorProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
}

/**
 * Dropdown selector component with icon, label, and dropdown menu
 */
export const DropdownSelector = memo<DropdownSelectorProps>(({
  icon,
  label,
  value,
  options,
  onChange,
}) => {
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const [isOpen, setIsOpen] = useState(false);

  // Get current option
  const currentOption = options.find((opt) => opt.value === value);

  // Colors
  const dropdownBg = colorScheme === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.05)';
  
  const modalBg = colorScheme === 'dark'
    ? '#1c1c1e'
    : '#ffffff';

  const borderColor = colorScheme === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)';

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* Label with Icon and Dropdown in same row */}
      <View style={styles.row}>
        {/* Label with Icon */}
        <View style={styles.labelRow}>
          {icon}
          <ThemedText style={styles.label}>{label}</ThemedText>
        </View>

        {/* Dropdown Trigger */}
        <TouchableOpacity
          onPress={() => setIsOpen(true)}
          style={[
            styles.dropdown,
            { backgroundColor: dropdownBg, borderColor },
          ]}
          activeOpacity={0.7}
        >
          {/* Current Value */}
          <View style={styles.currentValue}>
            {currentOption?.color && (
              <View
                style={[
                  styles.colorDot,
                  { backgroundColor: currentOption.color },
                ]}
              />
            )}
            <ThemedText style={styles.valueText}>
              {currentOption?.label || 'Select...'}
            </ThemedText>
          </View>

        {/* Chevron Icon */}
        <ChevronsUpDown size={16} color={textColor} opacity={0.6} />
        </TouchableOpacity>
      </View>

      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
        statusBarTranslucent
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <View
              style={[
                styles.dropdownMenu,
                { backgroundColor: modalBg },
                Platform.select({
                  ios: {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                  },
                  android: {
                    elevation: 12,
                  },
                }),
              ]}
            >
              {/* Header */}
              <View style={[styles.menuHeader, { borderBottomColor: borderColor }]}>
                <ThemedText style={styles.menuTitle}>{label}</ThemedText>
              </View>

              {/* Options List */}
              <ScrollView
                style={styles.menuScroll}
                showsVerticalScrollIndicator={false}
              >
                {options.map((option, index) => {
                  const isSelected = option.value === value;
                  return (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => handleSelect(option.value)}
                      style={[
                        styles.menuItem,
                        index !== options.length - 1 && {
                          borderBottomWidth: 1,
                          borderBottomColor: borderColor,
                        },
                        isSelected && {
                          backgroundColor: colorScheme === 'dark'
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(0, 0, 0, 0.03)',
                        },
                      ]}
                      activeOpacity={0.7}
                    >
                      <View style={styles.menuItemContent}>
                        {option.color && (
                          <View
                            style={[
                              styles.colorDot,
                              { backgroundColor: option.color },
                            ]}
                          />
                        )}
                        <ThemedText
                          style={[
                            styles.menuItemText,
                            isSelected && {
                              color: tintColor,
                              fontWeight: '600',
                            },
                          ]}
                        >
                          {option.label}
                        </ThemedText>
                      </View>
                      {isSelected && (
                        <View
                          style={[
                            styles.selectedIndicator,
                            { backgroundColor: tintColor },
                          ]}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
});

DropdownSelector.displayName = 'DropdownSelector';

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    minHeight: 40,
    minWidth: 150,
    maxWidth: 200,
  },
  currentValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  valueText: {
    fontSize: 14,
    fontWeight: '500',
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
  },
  dropdownMenu: {
    borderRadius: 16,
    maxHeight: 400,
    overflow: 'hidden',
  },
  menuHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  menuScroll: {
    maxHeight: 320,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '500',
  },
  selectedIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

