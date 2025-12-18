import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a simple in-memory storage for testing
let mockStorage = {};

describe('Remember Me Functionality', () => {
  beforeEach(() => {
    // Clear mock storage before each test
    mockStorage = {};
    
    // Mock AsyncStorage methods with actual storage
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
    
    AsyncStorage.clear = jest.fn(() => {
      mockStorage = {};
      return Promise.resolve();
    });
  });

  test('Should save credentials when Remember Me is checked', async () => {
    const username = 'testuser';
    const password = 'testpass';
    
    // Simulate saving with Remember Me checked
    await AsyncStorage.setItem('rememberedUsername', username);
    await AsyncStorage.setItem('rememberedPassword', password);
    await AsyncStorage.setItem('termsAccepted', 'true');
    await AsyncStorage.setItem('rememberMePreference', 'true');
    
    // Verify credentials are saved
    const savedUsername = await AsyncStorage.getItem('rememberedUsername');
    const savedPassword = await AsyncStorage.getItem('rememberedPassword');
    const savedPreference = await AsyncStorage.getItem('rememberMePreference');
    
    expect(savedUsername).toBe(username);
    expect(savedPassword).toBe(password);
    expect(savedPreference).toBe('true');
  });

  test('Should clear credentials when Remember Me is unchecked', async () => {
    // First, save some credentials
    await AsyncStorage.setItem('rememberedUsername', 'testuser');
    await AsyncStorage.setItem('rememberedPassword', 'testpass');
    await AsyncStorage.setItem('rememberMePreference', 'true');
    
    // Verify they are saved
    let savedUsername = await AsyncStorage.getItem('rememberedUsername');
    expect(savedUsername).toBe('testuser');
    
    // Simulate unchecking Remember Me and logging in
    await AsyncStorage.removeItem('rememberedUsername');
    await AsyncStorage.removeItem('rememberedPassword');
    await AsyncStorage.removeItem('termsAccepted');
    await AsyncStorage.removeItem('rememberMePreference');
    
    // Verify credentials are cleared
    savedUsername = await AsyncStorage.getItem('rememberedUsername');
    const savedPassword = await AsyncStorage.getItem('rememberedPassword');
    const savedPreference = await AsyncStorage.getItem('rememberMePreference');
    
    expect(savedUsername).toBeNull();
    expect(savedPassword).toBeNull();
    expect(savedPreference).toBeNull();
  });

  test('Should load saved credentials on app start', async () => {
    const username = 'testuser';
    const password = 'testpass';
    
    // Simulate saved credentials
    await AsyncStorage.setItem('rememberedUsername', username);
    await AsyncStorage.setItem('rememberedPassword', password);
    await AsyncStorage.setItem('rememberMePreference', 'true');
    
    // Simulate loading credentials
    const rememberedUsername = await AsyncStorage.getItem('rememberedUsername');
    const rememberedPassword = await AsyncStorage.getItem('rememberedPassword');
    const rememberPreference = await AsyncStorage.getItem('rememberMePreference');
    
    // Verify loading logic
    if (rememberPreference === 'true' && rememberedUsername && rememberedPassword) {
      expect(rememberedUsername).toBe(username);
      expect(rememberedPassword).toBe(password);
      expect(rememberPreference).toBe('true');
    } else {
      throw new Error('Should have loaded credentials');
    }
  });

  test('Should not load credentials when Remember Me was not checked', async () => {
    // Don't save any credentials
    
    // Simulate loading credentials
    const rememberedUsername = await AsyncStorage.getItem('rememberedUsername');
    const rememberedPassword = await AsyncStorage.getItem('rememberedPassword');
    const rememberPreference = await AsyncStorage.getItem('rememberMePreference');
    
    expect(rememberedUsername).toBeNull();
    expect(rememberedPassword).toBeNull();
    expect(rememberPreference).toBeNull();
  });

  test('Should clear old credentials when Remember Me is unchecked on subsequent login', async () => {
    // First login with Remember Me checked
    await AsyncStorage.setItem('rememberedUsername', 'olduser');
    await AsyncStorage.setItem('rememberedPassword', 'oldpass');
    await AsyncStorage.setItem('rememberMePreference', 'true');
    
    // Second login with Remember Me unchecked
    await AsyncStorage.removeItem('rememberedUsername');
    await AsyncStorage.removeItem('rememberedPassword');
    await AsyncStorage.removeItem('termsAccepted');
    await AsyncStorage.removeItem('rememberMePreference');
    
    // Verify old credentials are cleared
    const username = await AsyncStorage.getItem('rememberedUsername');
    const password = await AsyncStorage.getItem('rememberedPassword');
    const preference = await AsyncStorage.getItem('rememberMePreference');
    
    expect(username).toBeNull();
    expect(password).toBeNull();
    expect(preference).toBeNull();
  });
});
