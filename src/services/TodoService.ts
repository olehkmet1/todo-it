import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo, TodoFormData } from '../interfaces/Todo';

const TODO_STORAGE_KEY = '@TodoIt:todos';

class TodoService {
  private todos: Todo[] = [];

  async loadTodos(): Promise<Todo[]> {
    try {
      const storedTodos = await AsyncStorage.getItem(TODO_STORAGE_KEY);
      if (storedTodos) {
        this.todos = JSON.parse(storedTodos).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
        }));
      }
      return this.todos;
    } catch (error) {
      console.error('Error loading todos:', error);
      return [];
    }
  }

  private async saveTodos(): Promise<void> {
    try {
      await AsyncStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(this.todos));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  }

  async addTodo(todoData: TodoFormData): Promise<Todo> {
    // Ensure we have the latest state from storage
    await this.loadTodos();
    
    const newTodo: Todo = {
      id: this.generateUniqueId(),
      ...todoData,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('Adding todo with ID:', newTodo.id);
    console.log('Current todos count before adding:', this.todos.length);
    
    this.todos.push(newTodo);
    await this.saveTodos();
    
    console.log('Current todos count after adding:', this.todos.length);
    console.log('All todos IDs:', this.todos.map(t => t.id));
    
    return newTodo;
  }

  private generateUniqueId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${random}`;
  }

  async updateTodo(id: string, updates: Partial<Todo>): Promise<Todo | null> {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index === -1) return null;

    this.todos[index] = {
      ...this.todos[index],
      ...updates,
      updatedAt: new Date(),
    };

    await this.saveTodos();
    return this.todos[index];
  }

  async deleteTodo(id: string): Promise<boolean> {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index === -1) return false;

    this.todos.splice(index, 1);
    await this.saveTodos();
    return true;
  }

  async toggleTodo(id: string): Promise<Todo | null> {
    return this.updateTodo(id, { completed: !this.todos.find(t => t.id === id)?.completed });
  }

  getTodosByFilter(filter: 'all' | 'active' | 'completed'): Todo[] {
    switch (filter) {
      case 'active':
        return this.todos.filter(todo => !todo.completed);
      case 'completed':
        return this.todos.filter(todo => todo.completed);
      default:
        return this.todos;
    }
  }

  getTodosByPriority(priority: 'low' | 'medium' | 'high'): Todo[] {
    return this.todos.filter(todo => todo.priority === priority);
  }

  getTodosByCategory(category: string): Todo[] {
    return this.todos.filter(todo => todo.category === category);
  }
}

export default new TodoService();
