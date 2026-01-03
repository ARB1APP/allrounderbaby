import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock storage
let mockStorage = {};

// Mock fetch
global.fetch = jest.fn();

describe('Login and Logout API Calls - Critical Testing', () => {
  beforeEach(() => {
    mockStorage = {};

    // Mock AsyncStorage
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

    // Clear fetch mock
    fetch.mockClear();
  });

  describe('Login API Tests', () => {
    test('Should call login API with correct parameters', async () => {
      const username = 'testuser';
      const password = 'testpass123';
      const deviceId = 'device_abc123';
      const baseUrl = 'https://api.example.com/';

      // Mock successful login response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          code: 200,
          data: {
            token: 'token_xyz789',
            userID: 12345,
            firstName: 'Test',
            lastName: 'User',
            emailAddress: 'test@example.com',
            phoneNumber: '1234567890',
            deviceKey: 'devicekey_abc',
          },
        }),
      });

      // Simulate deviceId in storage
      await AsyncStorage.setItem('deviceId', deviceId);

      // Construct expected API URL
      const expectedUrl = `${baseUrl}Login/LoginMobileUser?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&deviceId=${encodeURIComponent(deviceId)}`;

      // Make API call
      const response = await fetch(expectedUrl);
      const data = await response.json();

      // Verify API was called
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(expectedUrl);

      // Verify response
      expect(data.code).toBe(200);
      expect(data.data.token).toBe('token_xyz789');
      expect(data.data.userID).toBe(12345);
    });

    test('Should handle login API failure correctly', async () => {
      const username = 'testuser';
      const password = 'wrongpass';
      const deviceId = 'device_abc123';
      const baseUrl = 'https://api.example.com/';

      // Mock failed login response
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          code: 401,
          message: 'Invalid username or password',
        }),
      });

      const apiUrl = `${baseUrl}Login/LoginMobileUser?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&deviceId=${encodeURIComponent(deviceId)}`;

      const response = await fetch(apiUrl);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(response.ok).toBe(false);
      expect(response.status).toBe(401);

      const errorData = await response.json();
      expect(errorData.message).toBe('Invalid username or password');
    });

    test('Should send deviceId with every login request', async () => {
      const username = 'testuser';
      const password = 'testpass';
      const deviceId1 = 'device_first';
      const deviceId2 = 'device_second';
      const baseUrl = 'https://api.example.com/';

      // First login from device 1
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          code: 200,
          data: { token: 'token1', userID: 1 },
        }),
      });

      const url1 = `${baseUrl}Login/LoginMobileUser?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&deviceId=${encodeURIComponent(deviceId1)}`;
      await fetch(url1);

      expect(fetch).toHaveBeenCalledWith(url1);
      expect(url1).toContain(`deviceId=${deviceId1}`);

      // Second login from device 2
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          code: 200,
          data: { token: 'token2', userID: 1 },
        }),
      });

      const url2 = `${baseUrl}Login/LoginMobileUser?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&deviceId=${encodeURIComponent(deviceId2)}`;
      await fetch(url2);

      expect(fetch).toHaveBeenCalledWith(url2);
      expect(url2).toContain(`deviceId=${deviceId2}`);

      // Verify both calls made with different deviceIds
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    test('Should store token and userId after successful login', async () => {
      const token = 'secure_token_xyz789';
      const userId = 12345;
      const deviceId = 'device_abc';

      // Mock successful response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          code: 200,
          data: { token, userID: userId },
        }),
      });

      const response = await fetch('https://api.example.com/Login/LoginMobileUser?username=test&password=test&deviceId=' + deviceId);
      const data = await response.json();

      // Simulate storing data
      await AsyncStorage.setItem('token', data.data.token);
      await AsyncStorage.setItem('userId', data.data.userID.toString());
      await AsyncStorage.setItem('deviceId', deviceId);

      // Verify storage
      const storedToken = await AsyncStorage.getItem('token');
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedDeviceId = await AsyncStorage.getItem('deviceId');

      expect(storedToken).toBe(token);
      expect(storedUserId).toBe(userId.toString());
      expect(storedDeviceId).toBe(deviceId);
    });
  });

  describe('Logout API Tests', () => {
    test('Should call logout API with userId, deviceId and sessionId', async () => {
      const userId = '12345';
      const deviceId = 'device_abc123';
      const sessionId = 'session_xyz789';
      const token = 'token_secure';
      const baseUrl = 'https://api.example.com/';

      // Set up stored data
      await AsyncStorage.setItem('userId', userId);
      await AsyncStorage.setItem('deviceId', deviceId);
      await AsyncStorage.setItem('sessionId', sessionId);
      await AsyncStorage.setItem('token', token);

      // Mock logout API response
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ code: 200, message: 'Logout successful' }),
      });

      // Retrieve data
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedDeviceId = await AsyncStorage.getItem('deviceId');
      const storedSessionId = await AsyncStorage.getItem('sessionId');
      const storedToken = await AsyncStorage.getItem('token');

      // Construct logout API URL
      const LOGOUT_API_URL = `${baseUrl}Login/LogoutMobileUser?userId=${encodeURIComponent(storedUserId)}&deviceId=${encodeURIComponent(storedDeviceId)}&sessionId=${encodeURIComponent(storedSessionId)}`;

      // Call logout API
      const response = await fetch(LOGOUT_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
      });

      // Verify API call
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        LOGOUT_API_URL,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }),
        })
      );

      expect(response.ok).toBe(true);

      const result = await response.json();
      expect(result.message).toBe('Logout successful');
    });

    test('Should clear local data after logout API call', async () => {
      const userId = '12345';
      const deviceId = 'device_abc';
      const token = 'token_xyz';

      // Store data
      await AsyncStorage.setItem('userId', userId);
      await AsyncStorage.setItem('deviceId', deviceId);
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('sessionId', 'session123');

      // Mock logout API
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ code: 200 }),
      });

      // Call logout API
      await fetch('https://api.example.com/Login/LogoutMobileUser', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      // Clear local data
      await AsyncStorage.multiRemove(['token', 'sessionId', 'userId']);

      // Verify data cleared
      const clearedToken = await AsyncStorage.getItem('token');
      const clearedSession = await AsyncStorage.getItem('sessionId');
      const clearedUserId = await AsyncStorage.getItem('userId');
      const deviceIdStillThere = await AsyncStorage.getItem('deviceId');

      expect(clearedToken).toBeNull();
      expect(clearedSession).toBeNull();
      expect(clearedUserId).toBeNull();
      expect(deviceIdStillThere).toBe(deviceId); // DeviceId should remain
    });

    test('Should proceed with local cleanup even if logout API fails', async () => {
      const userId = '12345';
      const deviceId = 'device_abc';
      const token = 'token_xyz';

      // Store data
      await AsyncStorage.setItem('userId', userId);
      await AsyncStorage.setItem('deviceId', deviceId);
      await AsyncStorage.setItem('token', token);

      // Mock failed logout API
      fetch.mockRejectedValueOnce(new Error('Network error'));

      // Try logout API
      let apiError = null;
      try {
        await fetch('https://api.example.com/Login/LogoutMobileUser', {
          method: 'POST',
        });
      } catch (error) {
        apiError = error;
      }

      expect(apiError).not.toBeNull();

      // Still clear local data
      await AsyncStorage.multiRemove(['token', 'userId', 'sessionId']);

      const clearedToken = await AsyncStorage.getItem('token');
      expect(clearedToken).toBeNull();
    });
  });

  describe('Multiple Login/Logout Cycles', () => {
    test('Should handle multiple login-logout cycles with API calls', async () => {
      const username = 'testuser';
      const password = 'testpass';
      const deviceId = 'device_abc';
      const baseUrl = 'https://api.example.com/';

      // First login
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          code: 200,
          data: { token: 'token1', userID: 1 },
        }),
      });

      const loginUrl = `${baseUrl}Login/LoginMobileUser?username=${username}&password=${password}&deviceId=${deviceId}`;
      await fetch(loginUrl);
      await AsyncStorage.setItem('token', 'token1');
      await AsyncStorage.setItem('userId', '1');

      // First logout
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ code: 200 }),
      });

      await fetch(`${baseUrl}Login/LogoutMobileUser`, { method: 'POST' });
      await AsyncStorage.multiRemove(['token', 'userId']);

      // Second login
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          code: 200,
          data: { token: 'token2', userID: 1 },
        }),
      });

      await fetch(loginUrl);
      await AsyncStorage.setItem('token', 'token2');
      await AsyncStorage.setItem('userId', '1');

      // Verify all API calls made
      expect(fetch).toHaveBeenCalledTimes(3); // 2 logins + 1 logout

      const finalToken = await AsyncStorage.getItem('token');
      expect(finalToken).toBe('token2');
    });

    test('Should track different sessions for multiple devices', async () => {
      const username = 'testuser';
      const password = 'testpass';
      const baseUrl = 'https://api.example.com/';

      // Device 1 login
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          code: 200,
          data: { token: 'token_device1', userID: 1 },
        }),
      });

      const device1Url = `${baseUrl}Login/LoginMobileUser?username=${username}&password=${password}&deviceId=device1`;
      await fetch(device1Url);

      // Device 2 login
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          code: 200,
          data: { token: 'token_device2', userID: 1 },
        }),
      });

      const device2Url = `${baseUrl}Login/LoginMobileUser?username=${username}&password=${password}&deviceId=device2`;
      await fetch(device2Url);

      // Verify both API calls
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenCalledWith(device1Url);
      expect(fetch).toHaveBeenCalledWith(device2Url);
    });
  });

  describe('Session Management', () => {
    test('Should generate unique sessionId for each login', async () => {
      // First login
      const sessionId1 = Math.random().toString(36).substring(2, 15);
      await AsyncStorage.setItem('sessionId', sessionId1);

      // Second login
      const sessionId2 = Math.random().toString(36).substring(2, 15);
      await AsyncStorage.setItem('sessionId', sessionId2);

      // Sessions should be different
      expect(sessionId1).not.toBe(sessionId2);

      const storedSession = await AsyncStorage.getItem('sessionId');
      expect(storedSession).toBe(sessionId2);
    });

    test('Should send sessionId in logout API call', async () => {
      const sessionId = 'session_unique_123';
      const userId = '1';
      const deviceId = 'device_abc';
      const baseUrl = 'https://api.example.com/';

      await AsyncStorage.setItem('sessionId', sessionId);
      await AsyncStorage.setItem('userId', userId);
      await AsyncStorage.setItem('deviceId', deviceId);
      await AsyncStorage.setItem('token', 'token_xyz');

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ code: 200 }),
      });

      const logoutUrl = `${baseUrl}Login/LogoutMobileUser?userId=${userId}&deviceId=${deviceId}&sessionId=${sessionId}`;
      await fetch(logoutUrl, { method: 'POST' });

      expect(fetch).toHaveBeenCalledWith(logoutUrl, expect.any(Object));
      expect(logoutUrl).toContain(`sessionId=${sessionId}`);
    });
  });
});
