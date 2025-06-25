import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  useColorScheme,
  BackHandler,
  StatusBar,
} from 'react-native';

const lightThemeColors = {
  screenBackground: '#f1f2f2',
  cardBackground: '#ffffff',
  cardBorder: '#cccccc',
  textPrimary: '#000000',
  textSecondary: '#333333',
  textBody: '#666666',
  textTimestamp: '#999999',
  textPlaceholder: 'gray',
  unreadIndicator: 'rgba(20, 52, 164, 0.7)',
  unreadItemBackground: '#f8f9fa',
  shadowColor: '#000000',
  statusBarContent: 'dark-content',

  bottomNavBackground: '#ffffff',
  activeIconTint: 'rgba(20, 52, 164, 1)',
  inactiveIconTint: 'gray',
  activeNavText: 'rgba(20, 52, 164, 1)',
  inactiveNavText: 'gray',
};

const darkThemeColors = {
  screenBackground: '#121212',
  cardBackground: '#1E1E1E',
  cardBorder: '#3A3A3A',
  textPrimary: '#E0E0E0',
  textSecondary: '#D0D0D0',
  textBody: '#B0B0B0',
  textTimestamp: '#888888',
  textPlaceholder: '#777777',
  unreadIndicator: 'rgba(60, 102, 224, 0.8)',
  unreadItemBackground: '#252525',
  shadowColor: '#000000',
  statusBarContent: 'light-content',

  bottomNavBackground: '#1E1E1E',
  activeIconTint: 'rgba(60, 102, 224, 1)',
  inactiveIconTint: '#888888',
  activeNavText: 'rgba(60, 102, 224, 1)',
  inactiveNavText: '#888888',
};

const createMyNotificationsStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBackground,
  },
  scrollContainer: {
     flexGrow: 1,
     paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    color: theme.textPrimary,
    paddingHorizontal: 15,
  },
  placeholderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      minHeight: 200,
  },
  placeholderText: {
      fontSize: 16,
      color: theme.textPlaceholder,
      textAlign: 'center',
  },
  notificationItem: {
    backgroundColor: theme.cardBackground,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadBackground: {
    backgroundColor: theme.unreadItemBackground,
  },
  unreadIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.unreadIndicator,
      marginRight: 12,
  },
  notificationContent: {
     flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.textSecondary,
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 14,
    color: theme.textBody,
    lineHeight: 20,
    marginBottom: 6,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: theme.textTimestamp,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.bottomNavBackground,
    paddingVertical: 10,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: -2 },
  },
  navItem: { alignItems: 'center', flex: 1, },
  navIcon: { width: 25, height: 25, resizeMode: 'contain', },
  activeIcon: { tintColor: theme.activeIconTint, },
  inactiveIcon: { tintColor: theme.inactiveIconTint, },
  navTextActive: { color: theme.activeNavText, fontSize: 10, marginTop: 4, fontWeight: 'bold', textAlign: 'center', },
  navText: { color: theme.inactiveNavText, fontSize: 10, marginTop: 4, fontWeight: 'bold', textAlign: 'center', },
});

const MyNotifications = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkThemeColors : lightThemeColors;
  const styles = createMyNotificationsStyles(theme);

  useEffect(() => {
    const backAction = () => {
        if (navigation.canGoBack()) {
            navigation.navigate('My Profile');
        } else {
        }
        return true;
    };

    const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
    );

    return () => {
        backHandler.remove();
    };
  }, [navigation]);

  const notifications = [
    { id: 1, title: 'Feedback Approved!', body: 'Your recent feedback has been approved. Cashback of ₹500 is being processed.', timestamp: '2 hours ago', read: false },
    { id: 2, title: 'Referral Success!', body: 'Your referred friend John Doe has signed up! You both earned rewards.', timestamp: '1 day ago', read: false },
    { id: 3, title: 'Withdrawal Processed', body: 'Your withdrawal request of ₹3500 has been successfully processed.', timestamp: '3 days ago', read: true },
    { id: 4, title: 'New Feature: Medals', body: 'Check out the new Medals section in your profile to track your achievements!', timestamp: '1 week ago', read: true },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.statusBarContent} backgroundColor={theme.screenBackground} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {notifications.length === 0 ? (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>You have no notifications yet.</Text>
          </View>
        ) : (
          notifications.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.notificationItem,
                !item.read && styles.unreadBackground
              ]}
              onPress={() => {
                console.log('Notification pressed:', item.id);
              }}
            >
              {!item.read && <View style={styles.unreadIndicator} />}
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationBody}>{item.body}</Text>
                <Text style={styles.notificationTimestamp}>{item.timestamp}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default MyNotifications;
