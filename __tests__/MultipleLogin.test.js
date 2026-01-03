import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a simple in-memory storage for testing
let mockStorage = {};

describe('Multiple Login Scenarios', () => {
  beforeEach(() => {
    // Clear mock storage before each test
    mockStorage = {};

    // Mock AsyncStorage methods
    AsyncStorage.setItem = jest.fn((key, value) => {
      mockStorage[key] = value;
      return Promise.resolve();
    });

    AsyncStorage.getItem = jest.fn((key) => {
      return Promise.resolve(mockStorage[key] || null);
    });

    AsyncStorage.removeItem = jest.fn((key) => {
      delete mockStorage[key];
      return Promise.resolve();
    });

    AsyncStorage.multiRemove = jest.fn((keys) => {
      keys.forEach(key => delete mockStorage[key]);
      return Promise.resolve();
    });
  });

  test('Should generate unique deviceId for each device', async () => {
    // Simulate first device login
    let deviceId1 = await AsyncStorage.getItem('deviceId');
    if (!deviceId1) {
      deviceId1 = Date.now().toString(36) + Math.random().toString(36).substring(2);
      await AsyncStorage.setItem('deviceId', deviceId1);
    }

    // Clear storage to simulate second device
    mockStorage = {};

    // Simulate second device login
    let deviceId2 = await AsyncStorage.getItem('deviceId');
    if (!deviceId2) {
      deviceId2 = Date.now().toString(36) + Math.random().toString(36).substring(2);
      await AsyncStorage.setItem('deviceId', deviceId2);
    }

    // Device IDs should be different
    expect(deviceId1).not.toBe(deviceId2);
    expect(deviceId1).toBeTruthy();
    expect(deviceId2).toBeTruthy();
  });

  test('Should maintain same deviceId on same device for multiple logins', async () => {
    const username = 'testuser';
    const password = 'testpass';

    // First login - generate deviceId
    let deviceId = await AsyncStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = Date.now().toString(36) + Math.random().toString(36).substring(2);
      await AsyncStorage.setItem('deviceId', deviceId);
    }
    const firstDeviceId = deviceId;

    // Save login session
    await AsyncStorage.setItem('token', 'token123');
    await AsyncStorage.setItem('userId', '1');
    await AsyncStorage.setItem('sessionId', 'session123');

    // Second login with same credentials on same device
    deviceId = await AsyncStorage.getItem('deviceId');
    const secondDeviceId = deviceId;

    // DeviceId should be the same
    expect(firstDeviceId).toBe(secondDeviceId);
  });

  test('Should handle re-login after logout on same device', async () => {
    const username = 'testuser';
    const password = 'testpass';

    // First login
    const deviceId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    await AsyncStorage.setItem('deviceId', deviceId);
    await AsyncStorage.setItem('token', 'token123');
    await AsyncStorage.setItem('userId', '1');
    await AsyncStorage.setItem('sessionId', 'session123');

    // Verify login data exists
    const token1 = await AsyncStorage.getItem('token');
    expect(token1).toBe('token123');

    // Logout - clear session data but keep deviceId
    const keysToRemove = ['token', 'sessionId', 'userId'];
    await AsyncStorage.multiRemove(keysToRemove);

    // Verify logout
    const tokenAfterLogout = await AsyncStorage.getItem('token');
    expect(tokenAfterLogout).toBeNull();

    // Verify deviceId is still there
    const deviceIdAfterLogout = await AsyncStorage.getItem('deviceId');
    expect(deviceIdAfterLogout).toBe(deviceId);

    // Re-login with same credentials
    await AsyncStorage.setItem('token', 'newtoken456');
    await AsyncStorage.setItem('userId', '1');
    await AsyncStorage.setItem('sessionId', 'newsession456');

    // Verify new session
    const token2 = await AsyncStorage.getItem('token');
    const deviceId2 = await AsyncStorage.getItem('deviceId');

    expect(token2).toBe('newtoken456');
    expect(deviceId2).toBe(deviceId); // Same device
  });

  test('Should store different sessions for same user on different devices', async () => {
    const username = 'testuser';
    const password = 'testpass';

    // Device 1 login
    const deviceId1 = 'device1_' + Date.now();
    const token1 = 'token_device1';
    const sessionId1 = 'session_device1';

    await AsyncStorage.setItem('deviceId', deviceId1);
    await AsyncStorage.setItem('token', token1);
    await AsyncStorage.setItem('sessionId', sessionId1);

    const device1Data = {
      deviceId: await AsyncStorage.getItem('deviceId'),
      token: await AsyncStorage.getItem('token'),
      sessionId: await AsyncStorage.getItem('sessionId'),
    };

    // Clear to simulate device 2
    mockStorage = {};

    // Device 2 login
    const deviceId2 = 'device2_' + Date.now();
    const token2 = 'token_device2';
    const sessionId2 = 'session_device2';

    await AsyncStorage.setItem('deviceId', deviceId2);
    await AsyncStorage.setItem('token', token2);
    await AsyncStorage.setItem('sessionId', sessionId2);

    const device2Data = {
      deviceId: await AsyncStorage.getItem('deviceId'),
      token: await AsyncStorage.getItem('token'),
      sessionId: await AsyncStorage.getItem('sessionId'),
    };

    // Verify different device data
    expect(device1Data.deviceId).not.toBe(device2Data.deviceId);
    expect(device1Data.token).not.toBe(device2Data.token);
    expect(device1Data.sessionId).not.toBe(device2Data.sessionId);
  });

  test('Should handle concurrent login attempts with same credentials', async () => {
    const username = 'testuser';
    const password = 'testpass';

    // Simulate concurrent login attempts
    const login1 = async () => {
      const deviceId = await AsyncStorage.getItem('deviceId') || 'device1';
      await AsyncStorage.setItem('deviceId', deviceId);
      await AsyncStorage.setItem('token', 'token1');
      return deviceId;
    };

    const login2 = async () => {
      const deviceId = await AsyncStorage.getItem('deviceId') || 'device2';
      await AsyncStorage.setItem('deviceId', deviceId);
      await AsyncStorage.setItem('token', 'token2');
      return deviceId;
    };

    // First login completes
    await login1();
    const deviceIdAfterLogin1 = await AsyncStorage.getItem('deviceId');
    const tokenAfterLogin1 = await AsyncStorage.getItem('token');

    expect(deviceIdAfterLogin1).toBeTruthy();
    expect(tokenAfterLogin1).toBe('token1');

    // Second login on same device overwrites
    await login2();
    const deviceIdAfterLogin2 = await AsyncStorage.getItem('deviceId');
    const tokenAfterLogin2 = await AsyncStorage.getItem('token');

    expect(deviceIdAfterLogin2).toBeTruthy();
    expect(tokenAfterLogin2).toBe('token2'); // Latest login wins
  });

  test('Should preserve remember me credentials across multiple login sessions', async () => {
    const username = 'testuser';
    const password = 'testpass';

    // First login with remember me
    await AsyncStorage.setItem('rememberedUsername', username);
    await AsyncStorage.setItem('rememberedPassword', password);
    await AsyncStorage.setItem('rememberMePreference', 'true');
    await AsyncStorage.setItem('token', 'token1');

    // Logout but keep remember me data
    await AsyncStorage.removeItem('token');

    // Verify remember me data persists
    const rememberedUsername = await AsyncStorage.getItem('rememberedUsername');
    const rememberedPassword = await AsyncStorage.getItem('rememberedPassword');

    expect(rememberedUsername).toBe(username);
    expect(rememberedPassword).toBe(password);

    // Second login (credentials should be pre-filled from remember me)
    await AsyncStorage.setItem('token', 'token2');

    // Remember me data should still be there
    const stillRemembered = await AsyncStorage.getItem('rememberedUsername');
    expect(stillRemembered).toBe(username);
  });
});
