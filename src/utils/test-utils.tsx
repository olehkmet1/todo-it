import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { ThemeProvider } from '../theme/ThemeContext';

// Custom render function that includes theme provider
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react-native';

// Override render method
export { customRender as render };

// Test data helpers
export const createMockTodo = (overrides = {}) => ({
  id: 'test-id-1',
  title: 'Test Todo',
  description: 'Test description',
  priority: 'medium' as const,
  category: 'Work',
  completed: false,
  createdAt: new Date('2024-01-01T12:00:00Z'),
  updatedAt: new Date('2024-01-01T12:00:00Z'),
  ...overrides,
});

export const createMockTodoFormData = (overrides = {}) => ({
  title: 'Test Todo',
  description: 'Test description',
  priority: 'medium' as const,
  category: 'Work',
  ...overrides,
});

// Async helper for waiting
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
