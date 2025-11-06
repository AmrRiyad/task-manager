import { Toast, ToastProvider, ToastViewport, useToastState } from '@tamagui/toast';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YStack, useTheme } from 'tamagui';

export function AppToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider 
      duration={3000} 
      swipeDirection="right"
      native={false}
    >
      {children}
      <CurrentToast />
      <SafeToastViewport />
    </ToastProvider>
  );
}

function CurrentToast() {
  const toast = useToastState();
  const theme = useTheme();

  if (!toast || toast.isHandledNatively) {
    return null;
  }

  // Get toast type from customData or default to 'default'
  const toastType = (toast.customData as any)?.type || 'default';

  // Define colors based on toast type
  const getToastColors = () => {
    switch (toastType) {
      case 'success':
        return {
          backgroundColor: '#10b981',
          borderColor: '#059669',
        };
      case 'warning':
        return {
          backgroundColor: '#f59e0b',
          borderColor: '#d97706',
        };
      case 'error':
        return {
          backgroundColor: '#ef4444',
          borderColor: '#dc2626',
        };
      default:
        return {
          backgroundColor: theme.background?.val || '#fff',
          borderColor: theme.borderColor?.val || '#ddd',
        };
    }
  };

  const colors = getToastColors();
  const isColoredToast = toastType === 'success' || toastType === 'warning' || toastType === 'error';

  return (
    <Toast
      key={toast.id}
      duration={toast.duration}
      viewportName={toast.viewportName}
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      opacity={1}
      scale={1}
      y={0}
      animation="quick"
      backgroundColor={colors.backgroundColor}
      borderColor={colors.borderColor}
      borderWidth={1}
      borderRadius={12}
      padding={16}
      minWidth={300}
      maxWidth="90%"
      shadowColor="#000"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.25}
      shadowRadius={3.84}
      elevation={5}
    >
    <YStack gap={4} alignItems="center">
    <Toast.Title 
        color={isColoredToast ? '#fff' : undefined} 
        fontWeight="600"
        textAlign="center"
    >
        {toast.title}
    </Toast.Title>

    {toast.message && (
        <Toast.Description 
        color={isColoredToast ? '#fff' : undefined} 
        opacity={0.9}
        textAlign="center"
        >
        {toast.message}
        </Toast.Description>
    )}
    </YStack>
    </Toast>
  );
}

function SafeToastViewport() {
  const { bottom } = useSafeAreaInsets();
  return (
    <ToastViewport
    bottom={bottom + 20}
    left={0}
    right={0}
    alignItems="center"
    />
  );
}

