import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { CustomDrawerContent, drawerItems } from '../App';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const mockDispatch = jest.fn();
const mockNavigation = {
  dispatch: mockDispatch,
  state: {
    index: 0,
    routes: [{ name: 'Home' }],
  },
};
const mockTheme = {
  drawerItemActiveBackground: '#fff',
  drawerItemInactiveBackground: '#eee',
  drawerItemActiveLabelTint: '#000',
  drawerItemInactiveLabelTint: '#333',
  drawerItemActiveIconTint: '#000',
  drawerItemInactiveIconTint: '#333',
  drawerHeaderBackground: '#fff',
  drawerContentBackground: '#fff',
  drawerBorderColor: '#ccc',
  drawerFooterText: '#000',
  safeAreaBackground: '#fff',
};

describe('CustomDrawerContent sidebar navigation', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

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

  it.each(sidebarPageKeys)('should dispatch navigation for %s and back to Home', (key) => {
    const item = drawerItems.find(i => i.key === key);
    const { getByLabelText } = render(
      <SafeAreaProvider>
        <CustomDrawerContent
          theme={mockTheme}
          handleLogout={jest.fn()}
          navigation={mockNavigation}
          state={mockNavigation.state}
        />
      </SafeAreaProvider>
    );
    // Simulate sidebar item press
    fireEvent.press(getByLabelText(`drawer-item-${item.key}`));
    // Should dispatch navigation to Home + target page
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'RESET',
        payload: expect.objectContaining({
          index: 1,
          routes: [
            { name: 'Home' },
            { name: item.navigateTo, params: { source: item.label } },
          ],
        }),
      })
    );
    // Simulate back action: pressing Home
    fireEvent.press(getByLabelText('drawer-item-home'));
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'RESET',
        payload: expect.objectContaining({
          index: 0,
          routes: [
            { name: 'Home' },
          ],
        }),
      })
    );
  });
});
