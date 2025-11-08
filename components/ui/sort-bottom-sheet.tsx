import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ArrowDownWideNarrow, ArrowUpNarrowWide, Flame } from 'lucide-react-native';
import React, { memo, useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

export type SortOption = 'priority' | 'newest' | 'oldest';

interface SortBottomSheetProps {
  visible: boolean;
  currentSort: SortOption;
  onClose: () => void;
  onSelect: (sort: SortOption) => void;
}

interface SortOptionItem {
  value: SortOption;
  label: string;
  icon: React.ReactNode;
}

/**
 * Bottom sheet component for selecting sort options
 */
export const SortBottomSheet = memo<SortBottomSheetProps>(({
  visible,
  currentSort,
  onClose,
  onSelect,
}) => {
  const colorScheme = useColorScheme();
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  
  const slideAnim = useRef(new Animated.Value(300)).current;

  const modalBg = colorScheme === 'dark' ? '#1c1c1e' : '#ffffff';
  const borderColor = colorScheme === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)';

  const sortOptions: SortOptionItem[] = [
    {
      value: 'priority',
      label: 'Priority',
      icon: <Flame size={20} color={textColor} />,
    },
    {
      value: 'newest',
      label: 'Newest First',
      icon: <ArrowDownWideNarrow size={20} color={textColor} />,
    },
    {
      value: 'oldest',
      label: 'Oldest First',
      icon: <ArrowUpNarrowWide size={20} color={textColor} />,
    },
  ];

  useEffect(() => {
    if (visible) {
      // Reset to bottom position first, then animate up
      slideAnim.setValue(300);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleSelect = (option: SortOption) => {
    onSelect(option);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View 
          style={[
            styles.sheetContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View
            style={[
              styles.sheet,
              { backgroundColor: modalBg },
              Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: -4 },
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
            <View style={[styles.header, { borderBottomColor: borderColor }]}>
              <ThemedText style={styles.title}>Sort By</ThemedText>
            </View>

            {/* Options */}
            <View style={styles.optionsContainer}>
              {sortOptions.map((option, index) => {
                const isSelected = option.value === currentSort;
                return (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => handleSelect(option.value)}
                    style={[
                      styles.option,
                      index !== sortOptions.length - 1 && {
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
                    <View style={styles.optionContent}>
                      {option.icon}
                      <ThemedText
                        style={[
                          styles.optionText,
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
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
});

SortBottomSheet.displayName = 'SortBottomSheet';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    width: '100%',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  optionsContainer: {
    paddingTop: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 56,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

