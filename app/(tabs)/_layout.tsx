import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const inactiveTintColor = colorScheme === 'dark' ? '#666' : '#999';
  const tabBarBg = colorScheme === 'dark' ? '#0a0a0a' : '#fafafa';
  const borderColor = colorScheme === 'dark' ? '#1f1f1f' : '#e5e5e5';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: inactiveTintColor,
        tabBarStyle: {
          backgroundColor: tabBarBg,
          borderTopColor: borderColor,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
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
          fontSize: 11,
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
          title: 'Issues',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="📋" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Projects',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon="📁" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
interface TabIconProps {
  icon: string;
  color: string;
  focused: boolean;
}

function TabIcon({ icon, focused }: TabIconProps) {
  const { Text } = require('react-native');
  
  return (
    <Text
      style={{
        fontSize: focused ? 22 : 20,
        opacity: focused ? 1 : 0.6,
      }}
    >
      {icon}
    </Text>
  );
}
