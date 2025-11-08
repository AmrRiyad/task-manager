import React from 'react';
import {
  Animated,
  LayoutChangeEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

export interface Tab {
  value: string;
  label: string;
  count?: number;
}

export interface CustomTabsProps {
  value: string;
  onValueChange: (value: string) => void;
  tabs: Tab[];
  variant?: 'background' | 'underline';
  activeColor?: string;
  inactiveColor?: string;
  backgroundColor?: string;
  underlineColor?: string;
  counterColor?: string;
}

interface TabLayout {
  x: number;
  width: number;
}

/**
 * Custom tabs component built from scratch for React Native/Expo
 * Supports background and underline variants with smooth animations
 */
export const CustomTabs: React.FC<CustomTabsProps> = ({
  value,
  onValueChange,
  tabs,
  variant = 'background',
  activeColor,
  inactiveColor,
  backgroundColor,
  underlineColor,
  counterColor,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Better default colors that are always visible
  const defaultActiveColor = activeColor || (isDark ? '#ffffff' : '#000000');
  const defaultInactiveColor = inactiveColor || (isDark ? '#a0a0a0' : '#8e8e93');
  const defaultBackgroundColor = backgroundColor || (isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)');
  const defaultUnderlineColor = underlineColor || (isDark ? '#ffffff' : '#007AFF');
  const defaultCounterColor = counterColor || (isDark ? '#000000' : '#ffffff');
  // Animation values
  const indicatorPosition = React.useRef(new Animated.Value(0)).current;
  const indicatorWidth = React.useRef(new Animated.Value(0)).current;

  // Store tab layouts
  const [tabLayouts, setTabLayouts] = React.useState<Map<string, TabLayout>>(new Map());

  /**
   * Handle tab layout measurements
   */
  const handleTabLayout = (tabValue: string, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setTabLayouts((prev) => {
      const next = new Map(prev);
      next.set(tabValue, { x, width });
      return next;
    });
  };

  /**
   * Animate indicator when active tab changes
   */
  React.useEffect(() => {
    const layout = tabLayouts.get(value);
    if (layout) {
      Animated.parallel([
        Animated.spring(indicatorPosition, {
          toValue: layout.x,
          useNativeDriver: false,
          tension: 300,
          friction: 30,
        }),
        Animated.spring(indicatorWidth, {
          toValue: layout.width,
          useNativeDriver: false,
          tension: 300,
          friction: 30,
        }),
      ]).start();
    }
  }, [value, tabLayouts, indicatorPosition, indicatorWidth]);

  /**
   * Handle tab press
   */
  const handleTabPress = (tabValue: string) => {
    if (tabValue !== value) {
      onValueChange(tabValue);
    }
  };

  /**
   * Render underline variant
   */
  if (variant === 'underline') {
    return (
      <View style={styles.underlineWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.underlineTabsContainer}
        >
          {tabs.map((tab) => {
            const isActive = tab.value === value;
            return (
              <TouchableOpacity
                key={tab.value}
                onPress={() => handleTabPress(tab.value)}
                onLayout={(event) => handleTabLayout(tab.value, event)}
                style={styles.underlineTab}
                activeOpacity={0.7}
              >
                <View style={styles.tabContent}>
                  <Text
                    style={[
                      styles.tabText,
                      {
                        color: isActive ? defaultActiveColor : defaultInactiveColor,
                        fontWeight: isActive ? '600' : '400',
                      },
                    ]}
                  >
                    {tab.label}
                  </Text>
                  {tab.count !== undefined && (
                    <View
                      style={[
                        styles.counter,
                        {
                          backgroundColor: isActive
                            ? defaultActiveColor
                            : defaultInactiveColor,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.counterText,
                          {
                            color: defaultCounterColor,
                          },
                        ]}
                      >
                        {tab.count}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        
        {/* Underline indicator */}
        <View style={[styles.underlineContainer, { borderBottomColor: isDark ? '#333' : '#e5e5e5' }]}>
          <Animated.View
            style={[
              styles.underlineIndicator,
              {
                backgroundColor: defaultUnderlineColor,
                transform: [{ translateX: indicatorPosition }],
                width: indicatorWidth,
              },
            ]}
          />
        </View>
      </View>
    );
  }

  /**
   * Render background variant (default)
   */
  return (
    <View style={[styles.container, styles.backgroundContainer]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.backgroundTabsContainer}
      >
        {/* Background indicator */}
        <Animated.View
          style={[
            styles.backgroundIndicator,
            {
              backgroundColor: defaultBackgroundColor,
              transform: [{ translateX: indicatorPosition }],
              width: indicatorWidth,
            },
          ]}
        />

        {tabs.map((tab) => {
          const isActive = tab.value === value;
          return (
            <TouchableOpacity
              key={tab.value}
              onPress={() => handleTabPress(tab.value)}
              onLayout={(event) => handleTabLayout(tab.value, event)}
              style={styles.backgroundTab}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: isActive ? defaultActiveColor : defaultInactiveColor,
                      fontWeight: isActive ? '600' : '400',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
                {tab.count !== undefined && (
                  <View
                    style={[
                      styles.counter,
                      {
                        backgroundColor: isActive
                          ? defaultActiveColor
                          : defaultInactiveColor,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.counterText,
                        {
                          color: defaultCounterColor,
                        },
                      ]}
                    >
                      {tab.count}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  backgroundContainer: {
    height: 44,
  },
  backgroundTabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    height: '100%',
  },
  backgroundTab: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    zIndex: 2,
  },
  backgroundIndicator: {
    position: 'absolute',
    height: '100%',
    borderRadius: 8,
    zIndex: 1,
  },
  underlineWrapper: {
    width: '100%',
    minHeight: 50,
  },
  underlineTabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
  },
  underlineTab: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    height: '100%',
  },
  underlineContainer: {
    height: 1,
    position: 'relative',
    width: '100%',
  },
  underlineIndicator: {
    position: 'absolute',
    height: 3,
    bottom: 0,
    borderRadius: 2,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    lineHeight: 20,
  },
  counter: {
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  counterText: {
    fontSize: 10,
    fontWeight: '600',
  },
});