import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Todo } from '../interfaces/Todo';
import { useTheme } from '../theme/ThemeContext';

interface TodoItemComponentProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (todo: Todo) => void;
}

const TodoItemComponent: React.FC<TodoItemComponentProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const { theme } = useTheme();
  const handleDelete = () => {
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this todo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(todo.id) },
      ]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme.colors.error;
      case 'medium':
        return theme.colors.warning;
      case 'low':
        return theme.colors.success;
      default:
        return theme.colors.success;
    }
  };

  return (
    <View 
      testID="todo-item"
      style={[
        styles.container, 
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        todo.completed && styles.completed
      ]}
    >
      <TouchableOpacity
        testID="checkbox"
        style={styles.toggleButton}
        onPress={() => onToggle(todo.id)}
      >
        <View style={[
          styles.checkbox, 
          { borderColor: theme.colors.border },
          todo.completed && [styles.checked, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]
        ]}>
          {todo.completed && <Text style={[styles.checkmark, { color: theme.colors.surface }]}>✓</Text>}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        testID="content"
        style={styles.content}
        onPress={() => onEdit?.(todo)}
        disabled={!onEdit}
      >
        <Text 
          testID="todo-title"
          style={[
            styles.title, 
            { color: theme.colors.text },
            todo.completed && [styles.completedText, { color: theme.colors.textSecondary }]
          ]}
        >
          {todo.title}
        </Text>
        {todo.description && (
          <Text style={[
            styles.description, 
            { color: theme.colors.textSecondary },
            todo.completed && [styles.completedText, { color: theme.colors.textSecondary }]
          ]}>
            {todo.description}
          </Text>
        )}
        <View style={styles.meta}>
          <View
            testID="priority-badge"
            style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(todo.priority) },
            ]}
          >
            <Text style={styles.priorityText}>{todo.priority}</Text>
          </View>
          {todo.category && (
            <Text style={[styles.category, { color: theme.colors.textSecondary }]}>{todo.category}</Text>
          )}
        </View>
      </TouchableOpacity>

      {onEdit && (
        <TouchableOpacity 
          testID="edit-button"
          style={styles.editButton} 
          onPress={() => onEdit(todo)}
        >
          <Text style={styles.editText}>✏️</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        testID="delete-button"
        style={[styles.deleteButton, { backgroundColor: theme.colors.error }]} 
        onPress={handleDelete}
      >
        <Text style={[styles.deleteText, { color: '#FFFFFF' }]}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  completed: {
    opacity: 0.6,
  },
  toggleButton: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999999',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  category: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  editText: {
    fontSize: 16,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff6b6b',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  deleteText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TodoItemComponent;
