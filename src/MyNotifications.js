import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Modal,
  Image,
  useColorScheme,
  Platform,
  Linking,
  AppState,
  BackHandler,
} from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const light = {
  bg: '#f1f2f2',
  card: '#ffffff',
  text: '#000',
  subText: '#666',
  border: '#ddd',
};

const popupLight = { bg: '#fff', text: '#000', allow: '#1a73e8', deny: '#444' };

const dark = {
  bg: '#121212',
  card: '#1E1E1E',
  text: '#fff',
  subText: '#aaa',
  border: '#333',
};

const popupDark = { bg: '#333', text: '#fff', allow: '#63B3ED', deny: '#ccc' };

const NotificationSettings = ({ navigation }) => {
  const mode = useColorScheme();
  const theme = mode === 'dark' ? dark : light;
  const popupTheme = mode === 'dark' ? popupDark : popupLight;

  const [notificationsEnabled, setNotificationsEnabled] = useState(false); 
  const [generalEnabled, setGeneralEnabled] = useState(true);
  const [showPermissionPopup, setShowPermissionPopup] = useState(false);

  const NOTIFICATION_PERMISSION = useMemo(() => {
    if (Platform.OS === 'ios') {
      return PERMISSIONS.IOS.NOTIFICATIONS;
    }
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      return PERMISSIONS.ANDROID.POST_NOTIFICATIONS;
    }
    return null; 
  }, []);

  const checkNotificationPermission = useCallback(async () => {
    if (!NOTIFICATION_PERMISSION) {
      setNotificationsEnabled(true);
      return;
    }
    const result = await check(NOTIFICATION_PERMISSION);
    const isGranted = result === RESULTS.GRANTED;
    setNotificationsEnabled(isGranted);
    if (!isGranted) {
      setGeneralEnabled(false);
    }
  }, [NOTIFICATION_PERMISSION]);

  useEffect(() => {
    checkNotificationPermission();
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkNotificationPermission();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [checkNotificationPermission]);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('My Profile');
      return true; 
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [navigation]);

  const handleToggleNotifications = async () => {
    if (!NOTIFICATION_PERMISSION) {
      Linking.openSettings();
      return;
    }
    const result = await check(NOTIFICATION_PERMISSION);
    switch (result) {
      case RESULTS.UNAVAILABLE:
        break;
      case RESULTS.DENIED:
        const requestResult = await request(NOTIFICATION_PERMISSION);
        if (requestResult === RESULTS.GRANTED) {
          setNotificationsEnabled(true);
        } else {
          setGeneralEnabled(false);
        }
        break;
      case RESULTS.GRANTED:
        Linking.openSettings();
        break;
      case RESULTS.BLOCKED:
        setShowPermissionPopup(true);
        break;
    }
  };

  const openSettings = () => {
    setShowPermissionPopup(false);
    Linking.openSettings();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('My Profile')} style={styles.backButton}>
          <Image
            source={require('../img/arrowicon.png')}
            style={[styles.backIcon, { tintColor: theme.text }]}
          />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Notification Settings</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleToggleNotifications}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={notificationsEnabled ? '#1a73e8' : '#f4f3f4'}
        />
      </View>

      <Text style={[styles.subtitle, { color: theme.subText }]}>Customize notification</Text>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>General</Text>
        <Switch
          value={generalEnabled}
          onValueChange={(newValue) => notificationsEnabled && setGeneralEnabled(newValue)}
          disabled={!notificationsEnabled}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={generalEnabled ? '#1a73e8' : '#f4f3f4'}
        />
      </View>

      <Modal transparent visible={showPermissionPopup} animationType="fade">
        <View style={[styles.popupOverlay]}>
          <View style={[styles.popupBox, { backgroundColor: popupTheme.bg }]}>
            <Text style={[styles.popupText, { color: popupTheme.text }]}>
              Allow <Text style={{ fontWeight: 'bold' }}>Allrounder Baby</Text> to send you notifications?
            </Text>
            <Text style={[styles.popupSubText, { color: theme.subText }]}>To enable notifications, you need to go to your device settings.</Text>
            <TouchableOpacity style={styles.popupButton} onPress={openSettings}>
              <Text style={[styles.popupButtonTextAllow, { color: popupTheme.allow }]}>Open Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.popupButton} onPress={() => setShowPermissionPopup(false)}>
              <Text style={[styles.popupButtonTextNo, { color: popupTheme.deny }]}>Not now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default NotificationSettings;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  backIcon: {
    width: 24,
    height: 24,
    transform: [{ rotate: '180deg' }],
  },
  title: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  subtitle: { marginTop: 15, marginBottom: 8, fontSize: 13 },
  card: {
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  cardTitle: { fontSize: 16, fontWeight: '600' },

  popupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupBox: {
    width: '80%',
    padding: 25,
    borderRadius: 14,
    alignItems: 'center',
  },
  popupText: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  popupSubText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  popupButton: {
    width: '100%',
    paddingVertical: 12,
  },
  popupButtonTextAllow: {
    color: '#1a73e8',
    textAlign: 'center',
    fontWeight: '600',
  },
  popupButtonTextNo: {
    color: '#444',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
  },
});
