import AsyncStorage from '@react-native-async-storage/async-storage';
import TodoService from '../TodoService';
import { Todo, TodoFormData } from '../../interfaces/Todo';

// Mock AsyncStorage
const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('TodoService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockAsyncStorage.clear();
  });

  describe('Core Functionality', () => {
    it('should load todos from storage', async () => {
      const mockTodos = [
        {
          id: '1',
          title: 'Test Todo',
          description: 'Test Description',
          priority: 'high',
          category: 'Work',
          completed: false,
          createdAt: '2024-01-01T12:00:00.000Z',
          updatedAt: '2024-01-01T12:00:00.000Z',
        },
      ];

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockTodos));

      const result = await TodoService.loadTodos();

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Test Todo');
    });

    it('should add new todos', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockAsyncStorage.setItem.mockResolvedValue();

      const todoData: TodoFormData = {
        title: 'New Todo',
        priority: 'medium',
      };

      const result = await TodoService.addTodo(todoData);

      expect(result.title).toBe('New Todo');
      expect(result.completed).toBe(false);
      expect(result.id).toBeDefined();
    });

    it('should toggle todo completion', async () => {
      const existingTodo = {
        id: '1',
        title: 'Test Todo',
        completed: false,
        createdAt: '2024-01-01T12:00:00.000Z',
        updatedAt: '2024-01-01T12:00:00.000Z',
      };

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify([existingTodo]));
      mockAsyncStorage.setItem.mockResolvedValue();

      // Load todos first
      await TodoService.loadTodos();

      const result = await TodoService.toggleTodo('1');

      expect(result?.completed).toBe(true);
    });

    it('should delete todos', async () => {
      const existingTodos = [
        {
          id: '1',
          title: 'Todo 1',
          completed: false,
          createdAt: '2024-01-01T12:00:00.000Z',
          updatedAt: '2024-01-01T12:00:00.000Z',
        },
      ];

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(existingTodos));
      mockAsyncStorage.setItem.mockResolvedValue();

      // Load todos first
      await TodoService.loadTodos();

      const result = await TodoService.deleteTodo('1');

      expect(result).toBe(true);
    });
  });

  });
});
