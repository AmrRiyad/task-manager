import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TabsAdvanced } from '@/components/ui/tabs';
import { useThemeColor } from '@/hooks/use-theme-color';
import { SquarePen } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in progress' | 'done';
  completed: boolean;
  createdAt: Date;
}

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'in progress' | 'done'>('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'todo' as 'todo' | 'in progress' | 'done',
  });

  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

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
    if (!formData.title.trim()) return;

    if (editingTask) {
      setTasks(tasks.map(t => 
        t.id === editingTask.id 
          ? { ...t, ...formData, completed: formData.status === 'done' }
          : t
      ));
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        ...formData,
        completed: formData.status === 'done',
        createdAt: new Date(),
      };
      setTasks([newTask, ...tasks]);
    }
    closeModal();
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const newStatus = t.status === 'done' ? 'todo' : t.status === 'todo' ? 'in progress' : 'done';
        return { ...t, status: newStatus, completed: newStatus === 'done' };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffa726';
      case 'low': return '#66bb6a';
      default: return '#999';
    }
  };

  const filteredTasks = statusFilter === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === statusFilter);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <ThemedView style={styles.header}>
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
            <View style={styles.modalHeader}>
              <ThemedText type="subtitle">
                {editingTask ? 'Edit Task' : 'New Task'}
              </ThemedText>
              <TouchableOpacity onPress={closeModal}>
                <ThemedText style={styles.closeButton}>✕</ThemedText>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
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

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Status</ThemedText>
                <View style={styles.statusButtons}>
                  {(['todo', 'in progress', 'done'] as const).map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.statusButton,
                        formData.status === status && {
                          backgroundColor: tintColor,
                        }
                      ]}
                      onPress={() => setFormData({ ...formData, status })}
                    >
                      <ThemedText
                        style={[
                          styles.statusText,
                          formData.status === status && styles.statusTextActive
                        ]}
                      >
                        {status === 'in progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

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
  const isDone = task.status === 'done';
  return (
    <ThemedView style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            isDone && styles.checkboxCompleted,
            { borderColor: getPriorityColor(task.priority) }
          ]}
          onPress={() => onToggle(task.id)}
        >
          {isDone && <ThemedText style={styles.checkmark}>✓</ThemedText>}
        </TouchableOpacity>
        <View style={styles.taskContent}>
          <ThemedText
            style={[
              styles.taskTitle,
              isDone && styles.taskTitleCompleted
            ]}
          >
            {task.title}
          </ThemedText>
          {task.description ? (
            <ThemedText
              style={[
                styles.taskDescription,
                isDone && styles.taskDescriptionCompleted
              ]}
              numberOfLines={2}
            >
              {task.description}
            </ThemedText>
          ) : null}
          <View style={styles.taskMeta}>
            <View style={[styles.statusBadge, { backgroundColor: task.status === 'todo' ? '#94a3b8' : task.status === 'in progress' ? '#3b82f6' : '#10b981' }]}>
              <ThemedText style={styles.statusBadgeText}>
                {task.status === 'in progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </ThemedText>
            </View>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
              <ThemedText style={styles.priorityBadgeText}>
                {task.priority}
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.taskActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(task)}
        >
          <ThemedText style={styles.actionButtonText}>✏️</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDelete(task.id)}
        >
          <ThemedText style={styles.actionButtonText}>🗑️</ThemedText>
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
  },
  headerButton: {
    padding: 8,
  },
  filterContainer: {
    marginTop: 16,
    height: 50,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  taskCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
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
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxCompleted: {
    backgroundColor: '#4caf50',
    borderColor: '#4caf50',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  taskDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  taskDescriptionCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.4,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  actionButtonText: {
    fontSize: 18,
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
    color: '#fff',
  },
});