import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image, // Kept in case you want to add icons later
  useColorScheme,
  BackHandler,
  StatusBar,
} from 'react-native';
// Removed: import { Colors } from 'react-native/Libraries/NewAppScreen'; // Not used with custom theming

// --- Theme Colors ---
const lightThemeColors = {
  screenBackground: '#f1f2f2', // Original light background
  cardBackground: '#ffffff', // For notification items
  cardBorder: '#cccccc', // Border for notification items
  textPrimary: '#000000', // For main titles
  textSecondary: '#333333', // For notification titles
  textBody: '#666666', // For notification body
  textTimestamp: '#999999',
  textPlaceholder: 'gray',
  unreadIndicator: 'rgba(20, 52, 164, 0.7)',
  unreadItemBackground: '#f8f9fa', // Optional: distinct unread item background
  shadowColor: '#000000', // For bottom nav if used
  statusBarContent: 'dark-content',

  // Bottom Nav (if used on this screen)
  bottomNavBackground: '#ffffff',
  activeIconTint: 'rgba(20, 52, 164, 1)',
  inactiveIconTint: 'gray',
  activeNavText: 'rgba(20, 52, 164, 1)',
  inactiveNavText: 'gray',
};

const darkThemeColors = {
  screenBackground: '#121212', // Dark background
  cardBackground: '#1E1E1E',   // Dark card for notification items
  cardBorder: '#3A3A3A',   // Darker border
  textPrimary: '#E0E0E0',    // Light text for main titles
  textSecondary: '#D0D0D0', // Light text for notification titles
  textBody: '#B0B0B0',    // Light text for notification body
  textTimestamp: '#888888',
  textPlaceholder: '#777777',
  unreadIndicator: 'rgba(60, 102, 224, 0.8)', // Brighter indicator
  unreadItemBackground: '#252525', // Optional: distinct unread item background for dark
  shadowColor: '#000000',
  statusBarContent: 'light-content',

  // Bottom Nav (if used on this screen)
  bottomNavBackground: '#1E1E1E',
  activeIconTint: 'rgba(60, 102, 224, 1)',
  inactiveIconTint: '#888888',
  activeNavText: 'rgba(60, 102, 224, 1)',
  inactiveNavText: '#888888',
};

// --- Dynamic Styles ---
const createMyNotificationsStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBackground,
  },
  scrollContainer: {
     flexGrow: 1,
     paddingBottom: 20, // Adjusted if no bottom nav present on this screen
  },
  title: { // If you decide to add a screen title
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
      minHeight: 200, // Ensure it takes some space if scrollview is short
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
  unreadBackground: { // Style for unread items, applied if item.read is false
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
  // --- Bottom Nav Styles (Kept for consistency if added later) ---
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
    // shadowOpacity, shadowRadius, elevation, borderTopColor would be themed
  },
  navItem: { alignItems: 'center', flex: 1, },
  navIcon: { width: 25, height: 25, resizeMode: 'contain', },
  activeIcon: { tintColor: theme.activeIconTint, },
  inactiveIcon: { tintColor: theme.inactiveIconTint, },
  navTextActive: { color: theme.activeNavText, fontSize: 10, marginTop: 4, fontWeight: 'bold', textAlign: 'center', },
  navText: { color: theme.inactiveNavText, fontSize: 10, marginTop: 4, fontWeight: 'bold', textAlign: 'center', },
});
// --- End of Styles ---


const MyNotifications = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkThemeColors : lightThemeColors;
  const styles = createMyNotificationsStyles(theme);

  useEffect(() => {
    const backAction = () => {
        // console.log('Hardware back press detected on MyNotifications');
        if (navigation.canGoBack()) {
            // console.log('Navigating back from MyNotifications');
            navigation.navigate('My Profile'); // Or navigation.goBack();
        } else {
            // console.log('Cannot go back from MyNotifications');
            // navigation.navigate('Home'); // Fallback if needed
        }
        return true; // Prevent default back behavior
    };

    const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
    );

    return () => {
        // console.log('Removing back handler from MyNotifications');
        backHandler.remove();
        // StatusBar.setHidden(false); // Only if it was specifically hidden for this screen
    };
  }, [navigation]);

  // --- Sample Data ---
  const notifications = [
    { id: 1, title: 'Feedback Approved!', body: 'Your recent feedback has been approved. Cashback of ₹500 is being processed.', timestamp: '2 hours ago', read: false },
    { id: 2, title: 'Referral Success!', body: 'Your referred friend John Doe has signed up! You both earned rewards.', timestamp: '1 day ago', read: false },
    { id: 3, title: 'Withdrawal Processed', body: 'Your withdrawal request of ₹3500 has been successfully processed.', timestamp: '3 days ago', read: true },
    { id: 4, title: 'New Feature: Medals', body: 'Check out the new Medals section in your profile to track your achievements!', timestamp: '1 week ago', read: true },
    // Add more notifications or leave empty to test placeholder
    // { id: 5, title: 'Test Read', body: 'This is a test read notification.', timestamp: '1 min ago', read: true },
  ];
  // --- End Sample Data ---

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.statusBarContent} backgroundColor={theme.screenBackground} />
      {/* <Text style={styles.title}>Notifications</Text> */}
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
                !item.read && styles.unreadBackground // Apply unread style if not read
              ]}
              onPress={() => {
                // Handle notification press, e.g., navigate or mark as read
                console.log('Notification pressed:', item.id);
                // Example: Mark as read (you'd update your state/data source here)
                // const updatedNotifications = notifications.map(n => n.id === item.id ? {...n, read: true} : n);
                // setNotifications(updatedNotifications); // If notifications were in state
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
      {/* If a bottom nav is needed on this screen, add its JSX here */}
    </View>
  );
};

export default MyNotifications;