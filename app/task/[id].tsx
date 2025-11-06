import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, CheckCircle2, Circle, Clock, Flag, Pencil, Trash2 } from 'lucide-react-native';
import { Platform, ScrollView } from 'react-native';
import { Button, Card, H1, H3, Paragraph, Separator, XStack, YStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in progress' | 'done';
  completed: boolean;
  createdAt: Date;
}

export default function TaskDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; task: string }>();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  // Parse the task from params
  let task: Task | null = null;
  try {
    if (params.task) {
      task = JSON.parse(params.task);
    }
  } catch (e) {
    console.error('Error parsing task:', e);
  }

  if (!task) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <H3>Task not found</H3>
        <Button onPress={() => router.back()} marginTop="$4">
          Go Back
        </Button>
      </ThemedView>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffa726';
      case 'low': return '#66bb6a';
      default: return '#999';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return '#999';
      case 'in progress': return '#fbbf24';
      case 'done': return '#10b981';
      default: return '#999';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'todo': return 'Todo';
      case 'in progress': return 'In Progress';
      case 'done': return 'Done';
      default: return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const priorityColor = getPriorityColor(task.priority);
  const statusColor = getStatusColor(task.status);
  const isDone = task.status === 'done';

  return (
    <ThemedView style={{ flex: 1, backgroundColor }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Back Button */}
        <XStack
          alignItems="center"
          paddingTop={Platform.OS === 'ios' ? insets.top : 20}
          paddingHorizontal="$4"
          paddingBottom="$3"
          gap="$3"
        >
          <Button
            unstyled
            onPress={() => router.back()}
            padding="$2"
            borderRadius="$6"
            pressStyle={{ opacity: 0.7 }}
            backgroundColor={colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}
          >
            <ArrowLeft size={24} color={textColor} />
          </Button>
          <H3 flex={1} numberOfLines={1} ellipsizeMode="tail">
            Task Details
          </H3>
        </XStack>

        <YStack padding="$4" gap="$4">
          {/* Title Card */}
          <Card
            elevate
            size="$4"
            bordered
            backgroundColor={colorScheme === 'dark' ? '$background' : '$background'}
            borderColor={colorScheme === 'dark' ? '$borderColor' : '$borderColor'}
          >
            <Card.Header padded>
              <H1
                fontSize="$9"
                fontWeight="700"
                textDecorationLine={isDone ? 'line-through' : 'none'}
                opacity={isDone ? 0.6 : 1}
                color={textColor}
              >
                {task.title}
              </H1>
            </Card.Header>
          </Card>

          {/* Status and Priority Row */}
          <XStack gap="$3" flexWrap="wrap">
            {/* Status Badge */}
            <Card
              size="$3"
              bordered
              backgroundColor={statusColor + '15'}
              borderColor={statusColor}
              flex={1}
              minWidth={120}
            >
              <Card.Header padded>
                <XStack alignItems="center" gap="$2">
                  {task.status === 'done' ? (
                    <CheckCircle2 size={18} color={statusColor} />
                  ) : task.status === 'in progress' ? (
                    <Clock size={18} color={statusColor} />
                  ) : (
                    <Circle size={18} color={statusColor} />
                  )}
                  <YStack gap="$1">
                    <Paragraph fontSize="$2" color="$color10" fontWeight="500">
                      Status
                    </Paragraph>
                    <Paragraph fontSize="$4" fontWeight="600" color={statusColor}>
                      {getStatusLabel(task.status)}
                    </Paragraph>
                  </YStack>
                </XStack>
              </Card.Header>
            </Card>

            {/* Priority Badge */}
            <Card
              size="$3"
              bordered
              backgroundColor={priorityColor + '15'}
              borderColor={priorityColor}
              flex={1}
              minWidth={120}
            >
              <Card.Header padded>
                <XStack alignItems="center" gap="$2">
                  <Flag size={18} color={priorityColor} />
                  <YStack gap="$1">
                    <Paragraph fontSize="$2" color="$color10" fontWeight="500">
                      Priority
                    </Paragraph>
                    <Paragraph fontSize="$4" fontWeight="600" color={priorityColor}>
                      {getPriorityLabel(task.priority)}
                    </Paragraph>
                  </YStack>
                </XStack>
              </Card.Header>
            </Card>
          </XStack>

          {/* Description Card */}
          <Card
            elevate
            size="$4"
            bordered
            backgroundColor={colorScheme === 'dark' ? '$background' : '$background'}
            borderColor={colorScheme === 'dark' ? '$borderColor' : '$borderColor'}
          >
            <Card.Header padded>
              <YStack gap="$3">
                <H3 fontSize="$6" fontWeight="600" color={textColor}>
                  Description
                </H3>
                <Separator />
                <Paragraph
                  fontSize="$4"
                  lineHeight="$6"
                  color={textColor}
                  opacity={task.description ? 0.8 : 0.5}
                >
                  {task.description || 'No description provided'}
                </Paragraph>
              </YStack>
            </Card.Header>
          </Card>

          {/* Created Date Card */}
          <Card
            size="$3"
            bordered
            backgroundColor={colorScheme === 'dark' ? '$background' : '$background'}
            borderColor={colorScheme === 'dark' ? '$borderColor' : '$borderColor'}
          >
            <Card.Header padded>
              <XStack alignItems="center" gap="$3">
                <Calendar size={20} color={textColor} opacity={0.6} />
                <YStack gap="$1" flex={1}>
                  <Paragraph fontSize="$2" color="$color10" fontWeight="500">
                    Created
                  </Paragraph>
                  <Paragraph fontSize="$3" color={textColor} opacity={0.8}>
                    {formatDate(task.createdAt)}
                  </Paragraph>
                </YStack>
              </XStack>
            </Card.Header>
          </Card>

          {/* Action Buttons */}
          <XStack gap="$3" marginTop="$2">
            <Button
              flex={1}
              theme="blue"
              size="$4"
              borderRadius="$6"
              onPress={() => {
                // Navigate to edit screen or open edit modal
                router.back();
                // You can pass edit action through params or use a global state
              }}
            >
              <XStack alignItems="center" gap="$2">
                <Pencil size={18} color="#fff" />
                <Paragraph color="#fff" fontWeight="600">
                  Edit
                </Paragraph>
              </XStack>
            </Button>
            <Button
              flex={1}
              theme="red"
              size="$4"
              borderRadius="$6"
              onPress={() => {
                router.back();
                // You can pass delete action through params or use a global state
              }}
            >
              <XStack alignItems="center" gap="$2">
                <Trash2 size={18} color="#fff" />
                <Paragraph color="#fff" fontWeight="600">
                  Delete
                </Paragraph>
              </XStack>
            </Button>
          </XStack>
        </YStack>
      </ScrollView>
    </ThemedView>
  );
}

