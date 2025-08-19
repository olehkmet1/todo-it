import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Todo } from '../interfaces/Todo';
import TodoItemComponent from './TodoItemComponent';
import SearchComponent from './SearchComponent';
import SortComponent, { SortOption } from './SortComponent';
import { useTheme } from '../theme/ThemeContext';

interface TodoListComponentProps {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (todo: Todo) => void;
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

const TodoListComponent: React.FC<TodoListComponentProps> = ({
  todos,
  filter,
  onToggle,
  onDelete,
  onEdit,
  onFilterChange,
  onRefresh,
  refreshing = false,
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');

  const filteredTodos = todos.filter((todo) => {
    // First apply filter
    const passesFilter = (() => {
      switch (filter) {
        case 'active':
          return !todo.completed;
        case 'completed':
          return todo.completed;
        default:
          return true;
      }
    })();

    // Then apply search
    const passesSearch = searchQuery === '' || 
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return passesFilter && passesSearch;
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      case 'title':
        return a.title.localeCompare(b.title);
      case 'completed':
        return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
      default:
        return 0;
    }
  });

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📝</Text>
      <Text style={styles.emptyTitle}>
        {filter === 'all' && 'No todos yet'}
        {filter === 'active' && 'No active todos'}
        {filter === 'completed' && 'No completed todos'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {filter === 'all' && 'Tap the + button to add your first todo'}
        {filter === 'active' && 'All your todos are completed! 🎉'}
        {filter === 'completed' && 'Complete some todos to see them here'}
      </Text>
    </View>
  );

  const renderTodoItem = useCallback(({ item }: { item: Todo }) => (
    <TodoItemComponent
      todo={item}
      onToggle={onToggle}
      onDelete={onDelete}
      onEdit={onEdit}
    />
  ), [onToggle, onDelete, onEdit]);

  const keyExtractor = useCallback((item: Todo) => item.id, []);

  const getFilterCount = (filterType: 'all' | 'active' | 'completed') => {
    switch (filterType) {
      case 'active':
        return todos.filter(todo => !todo.completed).length;
      case 'completed':
        return todos.filter(todo => todo.completed).length;
      default:
        return todos.length;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Search and Sort Controls */}
      <View style={styles.controlsContainer}>
        <View style={{ flex: 1 }}>
          <SearchComponent onSearch={setSearchQuery} />
        </View>
        <SortComponent currentSort={sortBy} onSortChange={setSortBy} />
      </View>

      {/* Filter Tabs */}
      <View style={[styles.filterContainer, { backgroundColor: theme.colors.surface }]}>
        {(['all', 'active', 'completed'] as const).map((filterType) => (
          <TouchableOpacity
            key={filterType}
            style={[
              styles.filterTab,
              filter === filterType && [styles.filterTabActive, { backgroundColor: theme.colors.primary }],
            ]}
            onPress={() => onFilterChange(filterType)}
          >
            <Text
              style={[
                styles.filterTabText,
                { color: theme.colors.textSecondary },
                filter === filterType && [styles.filterTabTextActive, { color: theme.colors.surface }],
              ]}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Text>
            <View style={[styles.filterCount, { backgroundColor: filter === filterType ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)' }]}>
              <Text
                style={[
                  styles.filterCountText,
                  { color: filter === filterType ? theme.colors.surface : theme.colors.textSecondary },
                ]}
              >
                {getFilterCount(filterType)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Todo List */}
      <FlatList
        data={sortedTodos}
        renderItem={renderTodoItem}
        keyExtractor={keyExtractor}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  filterTabActive: {
    backgroundColor: '#007AFF',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  filterTabTextActive: {
    color: '#ffffff',
  },
  filterCount: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  filterCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  filterCountTextActive: {
    color: '#ffffff',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
  separator: {
    height: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default TodoListComponent;
