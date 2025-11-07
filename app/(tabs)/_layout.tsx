import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Tabs } from 'expo-router';
import { ClipboardList, SettingsIcon } from 'lucide-react-native';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Tab layout component for bottom navigation
 */
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const inactiveTintColor = colorScheme === 'dark' ? '#666' : '#999';
  const borderColor = colorScheme === 'dark' ? '#1f1f1f' : '#e5e5e5';
  const insets = useSafeAreaInsets();

  // Calculate tab bar height with safe area insets
  const baseHeight = Platform.OS === 'ios' ? 88 : 64;
  const defaultBottomPadding = Platform.OS === 'ios' ? 24 : 0;
  const bottomPadding = Math.max(insets.bottom, defaultBottomPadding);
  const extraPadding = bottomPadding - defaultBottomPadding;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: inactiveTintColor,
        tabBarStyle: {
          backgroundColor: backgroundColor,
          borderTopColor: borderColor,
          borderTopWidth: 1,
          height: baseHeight + extraPadding,
          paddingTop: 2,
          paddingBottom: bottomPadding,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
            },
            android: {
              elevation: 8,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, focused, size }) => (
            <TabIcon 
              IconComponent={ClipboardList} 
              color={color} 
              focused={focused}
              size={size || 24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused, size }) => (
            <TabIcon 
              IconComponent={SettingsIcon} 
              color={color} 
              focused={focused}
              size={size || 24}
            />
          ),
        }}
      />
    </Tabs>
  );
}

/**
 * Tab icon component with focus animation
 */
interface TabIconProps {
  IconComponent: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  color: string;
  focused: boolean;
  size: number;
}

function TabIcon({ IconComponent, color, focused, size }: TabIconProps) {
  return (
    <IconComponent
      size={focused ? size : size * 0.9}
      color={color}
    />
  );
}
