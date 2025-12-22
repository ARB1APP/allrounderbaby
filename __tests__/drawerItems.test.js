import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

// Mock navigation props
const mockNavigation = {
  dispatch: jest.fn(),
  state: {
    index: 0,
    routes: [{ name: 'Home' }],
  },
};

// Mock required images
jest.mock('../img/home.png', () => 1);
jest.mock('../img/proflie.png', () => 2);
jest.mock('../img/about.png', () => 3);
jest.mock('../img/pr.png', () => 4);
jest.mock('../img/tm.png', () => 5);
jest.mock('../img/upadate.png', () => 6);
jest.mock('../img/info.png', () => 7);
jest.mock('../img/feedback.png', () => 8);
jest.mock('../img/call.png', () => 9);
jest.mock('../img/logout.png', () => 10);
jest.mock('../img/loginlogo.png', () => 11);

// Test suite for drawerItems

describe('Drawer Items', () => {
  it('should render App without crashing', () => {
    render(<App />);
  });

  it('should contain all expected drawer items', () => {
    // Import drawerItems directly from App.js
    const { drawerItems } = require('../App');
    const expectedKeys = [
      'home', 'profile', 'about', 'terms', 'privacy',
      'rate', 'version', 'feedback', 'contact', 'logout',
    ];
    expect(drawerItems.map(item => item.key)).toEqual(expectedKeys);
  });

  it('should have correct navigation targets', () => {
    const { drawerItems } = require('../App');
    const expectedTargets = [
      'Home', 'My Profile', 'About Us', 'Terms of Service', 'Privacy Policy',
      'Rate us / Update App', 'App Version', 'Get Help', 'Get Help', 'Login',
    ];
    expect(drawerItems.map(item => item.navigateTo)).toEqual(expectedTargets);
  });
});
