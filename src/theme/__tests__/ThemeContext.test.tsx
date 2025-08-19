import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme } from '../ThemeContext';

// Mock AsyncStorage
const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

// Test component to access theme context
const TestComponent: React.FC = () => {
  const { theme, themeMode, setThemeMode, isDark } = useTheme();
  
  return (
    <View>
      <Text testID="theme-mode">{themeMode}</Text>
      <Text testID="is-dark">{isDark.toString()}</Text>
      <Text testID="background-color">{theme.colors.background}</Text>
      <TouchableOpacity testID="set-light" onPress={() => setThemeMode('light')}>
        <Text>Light</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="set-dark" onPress={() => setThemeMode('dark')}>
        <Text>Dark</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="set-system" onPress={() => setThemeMode('system')}>
        <Text>System</Text>
      </TouchableOpacity>
    </View>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAsyncStorage.clear();
  });

  describe('Basic Theme Functionality', () => {
    it('should render with default theme', () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(getByTestId('theme-mode')).toHaveTextContent('system');
    });

    it('should switch themes', async () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      fireEvent.press(getByTestId('set-dark'));

      await waitFor(() => {
        expect(getByTestId('theme-mode')).toHaveTextContent('dark');
      });
    });

    it('should persist theme selection', async () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      fireEvent.press(getByTestId('set-light'));

      await waitFor(() => {
        expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('@TodoIt:themeMode', 'light');
      });
    });
  });
});
