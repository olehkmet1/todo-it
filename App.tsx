import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TodoListComponent from './src/components/TodoListComponent';
import AddTodoComponent from './src/components/AddTodoComponent';
import EditTodoComponent from './src/components/EditTodoComponent';
import ThemeToggleComponent from './src/components/ThemeToggleComponent';
import TodoService from './src/services/TodoService';
import { Todo, TodoFormData } from './src/interfaces/Todo';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

function App(): React.JSX.Element {
  const { theme, isDark } = useTheme();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const loadedTodos = await TodoService.loadTodos();
      setTodos(loadedTodos);
    } catch (error) {
      Alert.alert('Error', 'Failed to load todos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTodo = async (todoData: TodoFormData) => {
    try {
      console.log('App: Adding todo with data:', todoData);
      const newTodo = await TodoService.addTodo(todoData);
      console.log('App: Received new todo:', newTodo);
      setTodos(prevTodos => {
        console.log('App: Previous todos count:', prevTodos.length);
        console.log('App: Previous todos IDs:', prevTodos.map(t => t.id));
        const updatedTodos = [...prevTodos, newTodo];
        console.log('App: Updated todos count:', updatedTodos.length);
        console.log('App: Updated todos IDs:', updatedTodos.map(t => t.id));
        return updatedTodos;
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to add todo');
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      const updatedTodo = await TodoService.toggleTodo(id);
      if (updatedTodo) {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === id ? updatedTodo : todo
          )
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update todo');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const success = await TodoService.deleteTodo(id);
      if (success) {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete todo');
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setIsEditModalVisible(true);
  };

  const handleSaveEdit = async (id: string, updates: Partial<Todo>) => {
    try {
      const updatedTodo = await TodoService.updateTodo(id, updates);
      if (updatedTodo) {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === id ? updatedTodo : todo
          )
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update todo');
    }
  };

  const handleCloseEdit = () => {
    setEditingTodo(null);
    setIsEditModalVisible(false);
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadTodos();
    } finally {
      setRefreshing(false);
    }
  }, []);

  const getCompletedCount = () => todos.filter(todo => todo.completed).length;
  const getTotalCount = () => todos.length;

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Loading todos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor={theme.colors.background} 
      />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <View>
          <Text style={[styles.title, { color: theme.colors.text }]}>TodoIt</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {getCompletedCount()} of {getTotalCount()} completed
          </Text>
        </View>
        <View style={styles.headerControls}>
          <ThemeToggleComponent />
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => setIsAddModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Todo List */}
      <TodoListComponent
        todos={todos}
        filter={filter}
        onToggle={handleToggleTodo}
        onDelete={handleDeleteTodo}
        onEdit={handleEditTodo}
        onFilterChange={setFilter}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {/* Add Todo Modal */}
      <AddTodoComponent
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAdd={handleAddTodo}
      />

      {/* Edit Todo Modal */}
      <EditTodoComponent
        visible={isEditModalVisible}
        todo={editingTodo}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

const AppWithTheme: React.FC = () => {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
};

export default AppWithTheme;
