// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

// Mock StatusBar
jest.mock('react-native/Libraries/Components/StatusBar/StatusBar', () => 'StatusBar');

// Mock Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

// Mock Alert globally
global.Alert = {
  alert: jest.fn(),
};

// Mock useColorScheme
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  default: () => 'light',
}));

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock Date.now() for consistent testing
const mockDate = new Date('2024-01-01T12:00:00Z');
global.Date.now = jest.fn(() => mockDate.getTime());
