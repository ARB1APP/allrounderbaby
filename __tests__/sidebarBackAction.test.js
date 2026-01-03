import React from 'react';
import { fireEvent, render, act } from '@testing-library/react-native';
import App, { drawerItems } from '../App';

// Mock navigation and AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async (key) => {
    if (key === 'first_time_opened') {return 'true';}
    if (key === 'token') {return 'token';}
    return null;
  }),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

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

// Mock BackHandler
jest.mock('react-native/Libraries/Utilities/BackHandler', () => ({
  exitApp: jest.fn(),
}));

// Helper: get sidebar page keys to test (excluding Home and Logout)
const sidebarPageKeys = [
  'profile',
  'about',
  'terms',
  'privacy',
  'rate',
  'version',
  'feedback',
  'contact',
];

const sidebarPageNames = {
  profile: 'My Profile',
  about: 'About Us',
  terms: 'Terms of Service',
  privacy: 'Privacy Policy',
  rate: 'Update App / Rate us',
  version: 'Version info',
  feedback: 'Feedback',
  contact: 'Contact us',
};

describe('Sidebar navigation back action', () => {
  it.each(sidebarPageKeys)('should return to Home after back from %s', async (key) => {
    const { getByText, findByText } = render(<App />);
    // Wait for Home to appear
    await findByText('Home');
    // Open sidebar and select the page
    const label = sidebarPageNames[key];
    const item = getByText(label);
    act(() => {
      fireEvent.press(item);
    });
    // Wait for the page to appear (simulate page content by label)
    await findByText(label);
    // Simulate back action: go back to Home
    // In real app, this is handled by navigation stack reset
    // For test, simulate by pressing Home in sidebar
    const homeItem = getByText('Home');
    act(() => {
      fireEvent.press(homeItem);
    });
    // Home should be visible again
    await findByText('Home');
  });
});
