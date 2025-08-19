/**
 * @format
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

test('renders correctly', () => {
  const { getByText } = render(<App />);
  
  // Check if the loading text is rendered initially
  expect(getByText('Loading todos...')).toBeTruthy();
});
