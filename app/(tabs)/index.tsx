import { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export default function HomeScreen() {
  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  const pendingCount = tasks.filter((task) => !task.completed).length;

  const addTask = () => {
    const trimmedTask = taskInput.trim();

    if (!trimmedTask) {
      return;
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks((currentTasks) => [
      ...currentTasks,
      {
        id: Date.now(),
        title: trimmedTask,
        completed: false,
      },
    ]);
    setTaskInput('');
  };

  const toggleTask = (taskId: number) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (taskId: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerTextBlock}>
              <Text style={styles.eyebrow}>Pocket Tasks</Text>
              <Text style={styles.title}>Keep your day calm and clear.</Text>
              <Text style={styles.subtitle}>
                Add a task, finish it, and remove what is no longer needed.
              </Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{pendingCount} pending</Text>
            </View>
          </View>

          <View style={styles.inputCard}>
            <TextInput
              value={taskInput}
              onChangeText={setTaskInput}
              placeholder="What do you need to do?"
              style={styles.input}
              returnKeyType="done"
              onSubmitEditing={addTask}
              accessibilityLabel="Task name"
            />
            <Pressable
              onPress={addTask}
              style={styles.addButton}
              accessibilityRole="button"
              accessibilityLabel="Add task"
            >
              <Ionicons name="add" size={20} color="#ffffff" style={{ marginRight: 4 }} />
              <Text style={styles.addButtonText}>Add task</Text>
            </Pressable>
          </View>

          {tasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>✨</Text>
              <Text style={styles.emptyStateTitle}>Nothing here yet</Text>
              <Text style={styles.emptyStateText}>
                Your first task will appear here once you add it.
              </Text>
            </View>
          ) : (
            <FlatList
              data={tasks}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.list}
              renderItem={({ item: task }) => (
                <View
                  style={[styles.taskCard, task.completed && styles.taskCardCompleted]}
                >
                  <Pressable
                    onPress={() => toggleTask(task.id)}
                    style={styles.taskContent}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: task.completed }}
                    accessibilityLabel={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
                  >
                    <View style={[styles.checkbox, task.completed && styles.checkboxChecked]}>
                      {task.completed ? (
                        <Ionicons name="checkmark" size={16} color="#ffffff" />
                      ) : null}
                    </View>
                    <View style={styles.taskTextBlock}>
                      <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
                        {task.title}
                      </Text>
                      <Text style={styles.taskHint}>
                        {task.completed ? 'Completed' : 'Tap to mark complete'}
                      </Text>
                    </View>
                  </Pressable>

                  <Pressable
                    onPress={() => deleteTask(task.id)}
                    style={styles.deleteButton}
                    accessibilityRole="button"
                    accessibilityLabel={`Delete ${task.title}`}
                  >
                    <Ionicons name="trash-outline" size={20} color="#d5465a" />
                  </Pressable>
                </View>
              )}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7ff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerTextBlock: {
    flex: 1,
    gap: 6,
  },
  eyebrow: {
    color: '#5364ff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: {
    color: '#14213d',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  subtitle: {
    color: '#5f6b85',
    fontSize: 15,
    lineHeight: 22,
  },
  badge: {
    backgroundColor: '#e7ebff',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  badgeText: {
    color: '#3042b8',
    fontSize: 13,
    fontWeight: '600',
  },
  inputCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    gap: 12,
    shadowColor: '#1f2a44',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dfe5f3',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#14213d',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5364ff',
    borderRadius: 14,
    paddingVertical: 13,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    gap: 10,
  },
  emptyStateIcon: {
    fontSize: 32,
  },
  emptyStateTitle: {
    color: '#14213d',
    fontSize: 20,
    fontWeight: '700',
  },
  emptyStateText: {
    color: '#5f6b85',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  list: {
    gap: 12,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    shadowColor: '#1f2a44',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  taskCardCompleted: {
    backgroundColor: '#f3f6ff',
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#aeb8d1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#5364ff',
    borderColor: '#5364ff',
  },
  taskTextBlock: {
    flex: 1,
    gap: 2,
  },
  taskTitle: {
    color: '#14213d',
    fontSize: 16,
    fontWeight: '600',
  },
  taskTitleCompleted: {
    color: '#6a7698',
    textDecorationLine: 'line-through',
  },
  taskHint: {
    color: '#7f8ba6',
    fontSize: 12,
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
