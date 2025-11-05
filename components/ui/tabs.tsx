import React from 'react';
import type { TabLayout, TabsTabProps } from 'tamagui';
import {
  SizableText,
  Tabs,
  YStack
} from 'tamagui';

export interface TabsAdvancedProps {
  value: string;
  onValueChange: (value: string) => void;
  tabs: Array<{ value: string; label: string }>;
  variant?: 'background' | 'underline';
}

export const TabsAdvanced = ({ value, onValueChange, tabs, variant = 'background' }: TabsAdvancedProps) => {
  const [tabState, setTabState] = React.useState<{
    currentTab: string;
    intentAt: TabLayout | null;
    activeAt: TabLayout | null;
    prevActiveAt: TabLayout | null;
  }>({
    activeAt: null,
    currentTab: value,
    intentAt: null,
    prevActiveAt: null,
  });

  React.useEffect(() => {
    setTabState((prev) => ({ ...prev, currentTab: value }));
  }, [value]);

  const setCurrentTab = (currentTab: string) => {
    setTabState((prev) => ({ ...prev, currentTab }));
    onValueChange(currentTab);
  };

  const setIntentIndicator = (intentAt: TabLayout | null) =>
    setTabState((prev) => ({ ...prev, intentAt }));

  const setActiveIndicator = (activeAt: TabLayout | null) =>
    setTabState((prev) => ({ ...prev, prevActiveAt: prev.activeAt, activeAt }));

  const { activeAt, intentAt, prevActiveAt, currentTab } = tabState;

  const direction = (() => {
    if (!activeAt || !prevActiveAt || activeAt.x === prevActiveAt.x) {
      return 0;
    }
    return activeAt.x > prevActiveAt.x ? -1 : 1;
  })();

  const handleOnInteraction: TabsTabProps['onInteraction'] = (type, layout) => {
    if (type === 'select') {
      setActiveIndicator(layout);
    } else {
      setIntentIndicator(layout);
    }
  };

  if (variant === 'underline') {
    return (
      <Tabs
        value={currentTab}
        onValueChange={setCurrentTab}
        orientation="horizontal"
        size="$4"
        height={50}
        flexDirection="column"
        activationMode="manual"
        backgroundColor="transparent"
        borderRadius={0}
      >
        <YStack>
          <Tabs.List
            disablePassBorderRadius
            loop={false}
            borderBottomLeftRadius={0}
            borderBottomRightRadius={0}
            paddingBottom="$1.5"
            borderColor="$color3"
            borderBottomWidth="$0.5"
            backgroundColor="transparent"
          >
            {tabs.map((tab) => (
              <Tabs.Tab
                key={tab.value}
                unstyled
                paddingHorizontal="$3"
                paddingVertical="$2"
                value={tab.value}
                onInteraction={handleOnInteraction}
                borderRadius="$5"
              >
                <SizableText>{tab.label}</SizableText>
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </YStack>
      </Tabs>
    );
  }

  return (
    <Tabs
      value={currentTab}
      onValueChange={setCurrentTab}
      orientation="horizontal"
      size="$4"
      padding="$2"
      height={50}
      flexDirection="column"
      activationMode="manual"
      backgroundColor="transparent"
      borderRadius={0}
      position="relative"
    >
      <YStack>
        <Tabs.List
          disablePassBorderRadius
          loop={false}
          gap="$2"
          backgroundColor="transparent"
        >
          {tabs.map((tab) => (
            <Tabs.Tab
              key={tab.value}
              unstyled
              paddingVertical="$2"
              paddingHorizontal="$3"
              value={tab.value}
              onInteraction={handleOnInteraction}
              borderRadius="$5"
            >
              <SizableText>{tab.label}</SizableText>
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </YStack>
    </Tabs>
  );
};