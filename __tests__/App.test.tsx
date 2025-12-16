import 'react-native';
import React from 'react';
import App from '../App';

import {it} from '@jest/globals';

import renderer, {act, ReactTestRenderer} from 'react-test-renderer';

it('renders correctly', async () => {
  let component: ReactTestRenderer | undefined;
  await act(async () => {
    component = renderer.create(<App />);
    // Wait for any async operations to complete
    await new Promise(resolve => setTimeout(resolve, 100));
  });
  
  // Clean up
  if (component) {
    await act(async () => {
      component!.unmount();
    });
  }
});
