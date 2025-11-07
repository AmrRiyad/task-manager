import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Save, Trash2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Platform, ScrollView, TextInput } from 'react-native';
import { Button, Card, H3, Input, Paragraph, Separator, XStack, YStack } from 'tamagui';

import { ThemedView } from '@/components/themed-view';
import { useTasks } from '@/contexts/task-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useToastController } from '@tamagui/toast';

export default function TaskDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { getTask, updateTask, deleteTask } = useTasks();
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const toast = useToastController();

  const task = params.id ? getTask(params.id) : null;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'todo' as 'todo' | 'in progress' | 'done',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
      });
    }
  }, [task]);

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

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast.show('Task title required', {
        message: 'Please enter a title for your task',
        customData: { type: 'warning' },
      });
      return;
    }

    updateTask(task.id, {
      ...formData,
      completed: formData.status === 'done',
    });

    toast.show('Task updated successfully', {
      customData: { type: 'success' },
    });

    router.back();
  };

  const handleDelete = () => {
    deleteTask(task.id);
    toast.show('Task deleted successfully', {
      customData: { type: 'success' },
    });
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  const priorityColor = getPriorityColor(formData.priority);
  const statusColor = getStatusColor(formData.status);

  return (
    <ThemedView style={{ flex: 1, backgroundColor }}>
      <ScrollView
        style={{ flex: 1, backgroundColor }}
        contentContainerStyle={{ paddingBottom: 40, backgroundColor }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Back Button */}
        <XStack
          alignItems="center"
          paddingTop={Platform.OS === 'ios' ? 60 : 40}
          paddingHorizontal={20}
          paddingBottom={20}
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
          <H3 
            flex={1} 
            numberOfLines={1} 
            ellipsizeMode="tail"
            fontSize={32}
            fontWeight="700"
            lineHeight={40}
            color={textColor}
          >
            Edit Task
          </H3>
          <XStack>
            <Button
              unstyled
              onPress={handleSave}
              padding="$2"
              borderRadius="$5"
              pressStyle={{ opacity: 0.7 }}
              backgroundColor={colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : tintColor + '20'}
            >
              <Save size={24} color={tintColor} />
            </Button>
          </XStack>
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
              <YStack gap="$2">
                <Paragraph fontSize="$2" color="$color10" fontWeight="500">
                  Title
                </Paragraph>
                <Input
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                  placeholder="Enter task title"
                  fontSize="$6"
                  fontWeight="700"
                  borderWidth={1}
                  borderColor={colorScheme === 'dark' ? '$borderColor' : '$borderColor'}
                  backgroundColor={colorScheme === 'dark' ? '$backgroundHover' : '$backgroundHover'}
                  color={textColor}
                  placeholderTextColor={colorScheme === 'dark' ? '$color8' : '$color8'}
                />
              </YStack>
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
                <YStack gap="$2" width="100%">
                  <Paragraph fontSize="$2" color="$color10" fontWeight="500">
                    Status
                  </Paragraph>
                  <XStack gap="$2" flexWrap="wrap">
                    {(['todo', 'in progress', 'done'] as const).map((status) => {
                      const statusColorOption = getStatusColor(status);
                      return (
                        <Button
                          key={status}
                          flex={1}
                          minWidth={90}
                          size="$3"
                          borderRadius="$4"
                          backgroundColor={formData.status === status ? statusColorOption : 'transparent'}
                          borderWidth={1}
                          borderColor={statusColorOption}
                          onPress={() => setFormData({ ...formData, status })}
                          pressStyle={{ opacity: 0.7 }}
                        >
                          <Paragraph
                            fontSize="$3"
                            fontWeight="600"
                            color={formData.status === status ? '#fff' : statusColorOption}
                          >
                            {getStatusLabel(status)}
                          </Paragraph>
                        </Button>
                      );
                    })}
                  </XStack>
                </YStack>
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
                <YStack gap="$2" width="100%">
                  <Paragraph fontSize="$2" color="$color10" fontWeight="500">
                    Priority
                  </Paragraph>
                  <XStack gap="$2" flexWrap="wrap">
                    {(['low', 'medium', 'high'] as const).map((priority) => {
                      const priorityColorOption = getPriorityColor(priority);
                      return (
                        <Button
                          key={priority}
                          flex={1}
                          minWidth={80}
                          size="$3"
                          borderRadius="$4"
                          backgroundColor={formData.priority === priority ? priorityColorOption : 'transparent'}
                          borderWidth={1}
                          borderColor={priorityColorOption}
                          onPress={() => setFormData({ ...formData, priority })}
                          pressStyle={{ opacity: 0.7 }}
                        >
                          <Paragraph
                            fontSize="$3"
                            fontWeight="600"
                            color={formData.priority === priority ? '#fff' : priorityColorOption}
                          >
                            {getPriorityLabel(priority)}
                          </Paragraph>
                        </Button>
                      );
                    })}
                  </XStack>
                </YStack>
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
                <TextInput
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Enter task description"
                  multiline
                  numberOfLines={6}
                  style={{
                    fontSize: 16,
                    lineHeight: 24,
                    color: textColor,
                    minHeight: 120,
                    textAlignVertical: 'top',
                    padding: 12,
                    borderWidth: 1,
                    borderColor: colorScheme === 'dark' ? '#333' : '#ddd',
                    borderRadius: 8,
                    backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  }}
                  placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
                />
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

          {/* Delete Button */}
          <XStack gap="$3" marginTop="$2">
            <Button
              flex={1}
              theme="red"
              size="$4"
              borderRadius="$6"
              onPress={handleDelete}
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
