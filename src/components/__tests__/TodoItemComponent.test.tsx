import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { render, createMockTodo } from '../../utils/test-utils';
import TodoItemComponent from '../TodoItemComponent';

// Mock Alert
const mockAlert = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TodoItemComponent', () => {
  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (overrides = {}) => {
    const todo = createMockTodo(overrides);
    return render(
      <TodoItemComponent
        todo={todo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );
  };

  describe('Core Functionality', () => {
    it('should render todo correctly', () => {
      const { getByText } = renderComponent({
        title: 'Test Todo',
        description: 'Test Description',
      });

      expect(getByText('Test Todo')).toBeTruthy();
      expect(getByText('Test Description')).toBeTruthy();
    });

    it('should handle user interactions', () => {
      const { getByTestId } = renderComponent();

      // Test toggle
      const checkbox = getByTestId('checkbox');
      fireEvent.press(checkbox);
      expect(mockOnToggle).toHaveBeenCalledWith('test-id-1');

      // Test edit
      const content = getByTestId('content');
      fireEvent.press(content);
      expect(mockOnEdit).toHaveBeenCalledWith(createMockTodo());
    });

    it('should show completed state', () => {
      const { getByText } = renderComponent({ completed: true });
      expect(getByText('✓')).toBeTruthy();
    });

    it('should show priority badge', () => {
      const { getByText } = renderComponent({ priority: 'high' });
      expect(getByText('high')).toBeTruthy();
    });
  });
});
