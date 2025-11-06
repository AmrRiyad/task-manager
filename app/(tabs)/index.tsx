import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TabsAdvanced } from '@/components/ui/tabs';
import { Task, useTasks } from '@/contexts/task-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useToastController } from '@tamagui/toast';
import { useRouter } from 'expo-router';
import { Pencil, SquarePen, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const { tasks, addTask, updateTask, deleteTask, toggleTask } = useTasks();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'in progress' | 'done'>('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'todo' as 'todo' | 'in progress' | 'done',
  });

  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const dividerColor = colorScheme === 'dark' ? '#2a2a2a' : '#e5e5e5';
  const toast = useToastController();

  const openModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
      });
    } else {
      setEditingTask(null);
      setFormData({ title: '', description: '', priority: 'medium', status: 'todo' });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingTask(null);
    setFormData({ title: '', description: '', priority: 'medium', status: 'todo' });
  };

  const saveTask = () => {
    if (!formData.title.trim()) {
      toast.show('Task title required', {
        message: 'Please enter a title for your task',
        customData: { type: 'warning' },
      });
      return;
    }

    if (editingTask) {
      updateTask(editingTask.id, {
        ...formData,
        completed: formData.status === 'done',
      });
      toast.show('Your task has been successfully updated', {
        customData: { type: 'success' },
      });
    } else {
      addTask({
        ...formData,
        completed: formData.status === 'done',
      });
      toast.show('Task created successfully', {
        customData: { type: 'success' },
      });
    }
    closeModal();
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    toast.show('Task deleted successfully', {
      customData: { type: 'success' },
    });
  };

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

  const filteredTasks = statusFilter === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === statusFilter);

  // Group tasks by status when showing all tasks
  const groupedTasks = statusFilter === 'all' 
    ? tasks.reduce((acc, task) => {
        if (!acc[task.status]) {
          acc[task.status] = [];
        }
        acc[task.status].push(task);
        return acc;
      }, {} as Record<string, Task[]>)
    : null;

  // Define status order for display
  const statusOrder: Array<'todo' | 'in progress' | 'done'> = ['todo', 'in progress', 'done'];

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'todo': return 'Todo';
      case 'in progress': return 'In Progress';
      case 'done': return 'Done';
      default: return status;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <ThemedView style={styles.header}>
        {/* Header Title and Add Task Button*/}
        <View style={styles.headerTop}>
          <ThemedText type="title" style={styles.headerTitle}>My Tasks</ThemedText>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => openModal()}
            activeOpacity={0.7}
          >
            <SquarePen size={24} color={tintColor} />
          </TouchableOpacity>
        </View>
        
        {/* Status Filter */}
        <View style={styles.filterContainer}>
          <TabsAdvanced
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}
            tabs={[
              { value: 'all', label: 'All Tasks' },
              { value: 'todo', label: 'Todo' },
              { value: 'in progress', label: 'In Progress' },
              { value: 'done', label: 'Done' },
            ]}
            variant="underline"
          />
        </View>
      </ThemedView>

      {/* Task List */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>
              {tasks.length === 0 ? 'No tasks yet!' : `No ${statusFilter === 'all' ? '' : statusFilter} tasks`}
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              {tasks.length === 0 
                ? 'Tap the button to create your first task'
                : 'Try selecting a different filter'}
            </ThemedText>
          </View>
        ) : statusFilter === 'all' && groupedTasks ? (
          <View style={styles.section}>
          {statusOrder.map((status, index) => {
            const statusTasks = groupedTasks[status] || [];
            if (statusTasks.length === 0) return null;

            return (
              <View key={status} style={styles.statusGroup}>
                {/* Only show divider if NOT the first group */}
                {index !== 0 && (
                  <View style={[styles.divider, { backgroundColor: dividerColor }]} />
                )}

                <ThemedText style={styles.statusGroupTitle}>
                  {getStatusLabel(status)}
                </ThemedText>

                {statusTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onEdit={openModal}
                    onDelete={handleDeleteTask}
                    getPriorityColor={getPriorityColor}
                    textColor={textColor}
                  />
                ))}
              </View>
            );
          })}
          </View>
        ) : (
          <View style={styles.section}>
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onEdit={openModal}
                onDelete={deleteTask}
                getPriorityColor={getPriorityColor}
                textColor={textColor}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add/Edit Task Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <ThemedText type="subtitle">
                {editingTask ? 'Edit Task' : 'New Task'}
              </ThemedText>
              <TouchableOpacity onPress={closeModal}>
                <ThemedText style={styles.closeButton}>✕</ThemedText>
              </TouchableOpacity>
            </View>

            {/* Modal Form */}
            <View style={styles.form}>
              {/* Title Input */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Title</ThemedText>
                <TextInput
                  style={[styles.input, { color: textColor, borderColor: '#ddd' }]}
                  placeholder="Enter task title"
                  placeholderTextColor="#999"
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                />
              </View>

              {/* Description Input */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Description</ThemedText>
                <TextInput
                  style={[styles.input, styles.textArea, { color: textColor, borderColor: '#ddd' }]}
                  placeholder="Enter task description"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                />
              </View>

              {/* Priority Input */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Priority</ThemedText>
                <View style={styles.priorityButtons}>
                  {(['low', 'medium', 'high'] as const).map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        styles.priorityButton,
                        formData.priority === priority && {
                          backgroundColor: getPriorityColor(priority),
                        }
                      ]}
                      onPress={() => setFormData({ ...formData, priority })}
                    >
                      <ThemedText
                        style={[
                          styles.priorityText,
                          formData.priority === priority && styles.priorityTextActive
                        ]}
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Status Input */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Status</ThemedText>
                <View style={styles.statusButtons}>
                  {(['todo', 'in progress', 'done'] as const).map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.statusButton,
                        { backgroundColor: backgroundColor },
                        formData.status === status && {
                          backgroundColor: getStatusColor(status),
                        }
                      ]}
                      onPress={() => setFormData({ ...formData, status })}
                    >
                      <ThemedText
                        style={[
                          styles.statusText,
                          { color: textColor },
                          formData.status === status && styles.statusTextActive
                        ]}
                      >
                        {status === 'in progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Modal Actions */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={closeModal}
                >
                  <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton, { backgroundColor: tintColor }]}
                  onPress={saveTask}
                >
                  <ThemedText style={styles.saveButtonText}>
                    {editingTask ? 'Update' : 'Create'}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </View>
  );
}

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  getPriorityColor: (priority: string) => string;
  textColor: string;
}

function TaskCard({ task, onToggle, onEdit, onDelete, getPriorityColor, textColor }: TaskCardProps) {
  const router = useRouter();
  const isDone = task.status === 'done';
  const backgroundColor = useThemeColor({}, 'background');
  
  const getStatusCircle = () => {
    switch (task.status) {
      case 'todo':
        return (
          <View style={styles.statusCircleTodo} />
        );
      case 'in progress':
        return (
          <View style={styles.statusCircleInProgress}>
            <View style={[styles.statusCircleHalfFilled, { backgroundColor }]} />
          </View>
        );
      case 'done':
        return (
          <View style={styles.statusCircleDone} />
        );
      default:
        return <View style={styles.statusCircleTodo} />;
    }
  };

  const handleCardPress = () => {
    router.push({
      pathname: '/task/[id]',
      params: {
        id: task.id,
      },
    });
  };

  return (
    <ThemedView style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <TouchableOpacity
          onPress={() => onToggle(task.id)}
          style={styles.statusCircleContainer}
        >
          {getStatusCircle()}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.taskContent}
          onPress={handleCardPress}
          activeOpacity={0.7}
        >
          <ThemedText
            style={[
              styles.taskTitle,
              isDone && styles.taskTitleCompleted
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {task.title}
          </ThemedText>
        </TouchableOpacity>
      </View>
      <View style={styles.taskActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(task)}
        >
          <Pencil size={16} color={textColor} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDelete(task.id)}
        >
          <Trash2 size={16} color={textColor} />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
    includeFontPadding: false,
  },
  headerButton: {
    padding: 8,
  },
  filterContainer: {
    marginTop: 16,
    height: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: '600',
    opacity: 0.4,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    opacity: 0.3,
  },
  section: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  statusGroup: {
    marginBottom: 10,
  },
  statusGroupTitle: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
    opacity: 0.6,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    marginBottom: 12,
  },
  taskCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  taskHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusCircleContainer: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCircleTodo: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#999',
    backgroundColor: 'transparent',
  },
  statusCircleInProgress: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fbbf24',
    backgroundColor: '#fbbf24',
    overflow: 'hidden',
    position: 'relative',
  },
  statusCircleHalfFilled: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '50%',
    height: '100%',
  },
  statusCircleDone: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10b981',
    borderWidth: 0,
  },
  taskContent: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
    paddingVertical: 4,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '500',
    flexShrink: 1,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    fontSize: 24,
    fontWeight: '300',
    opacity: 0.6,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  priorityTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    // backgroundColor set dynamically
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});