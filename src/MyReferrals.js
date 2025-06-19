import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  // TouchableOpacity, // Not used in this version, but can be added for item interaction
  // Image, // Not used
  useColorScheme,
  BackHandler,
  StatusBar,
  Platform, // Added for platform-specific styling
} from 'react-native';
// Removed: import { Colors } from 'react-native/Libraries/NewAppScreen';

// --- Theme Colors ---
const lightThemeColors = {
  screenBackground: '#f1f2f2',
  cardBackground: '#ffffff',
  cardBorder: 'transparent', // No border in light mode for cards with elevation
  textPrimary: '#000000',
  textSecondary: 'gray',
  textPlaceholder: 'gray',
  statusCompletedBackground: '#388e3c',
  statusCompletedText: '#ffffff',
  statusPendingBackground: '#ffa000',
  statusPendingText: '#444444',
  shadowColor: '#000000',
  shadowOpacity: 0.15,
  shadowRadius: 3,
  elevation: 4,
  statusBarContent: 'dark-content',

  // Bottom Nav (if used)
  bottomNavBackground: '#ffffff',
  activeIconTint: 'rgba(20, 52, 164, 1)',
  inactiveIconTint: 'gray',
  activeNavText: 'rgba(20, 52, 164, 1)',
  inactiveNavText: 'gray',
};

const darkThemeColors = {
  screenBackground: '#121212',
  cardBackground: '#1E1E1E',
  cardBorder: '#3A3A3A', // Use border for cards in dark mode
  textPrimary: '#E0E0E0',
  textSecondary: '#A0A0A0',
  textPlaceholder: '#888888',
  statusCompletedBackground: '#2E7D32', // Slightly darker green for dark mode
  statusCompletedText: '#E0E0E0',
  statusPendingBackground: '#FF8F00', // Slightly darker orange for dark mode
  statusPendingText: '#E0E0E0',
  shadowColor: '#000000', // Shadows less prominent
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 0, // Prefer borders
  statusBarContent: 'light-content',

  // Bottom Nav (if used)
  bottomNavBackground: '#1E1E1E',
  activeIconTint: 'rgba(60, 102, 224, 1)',
  inactiveIconTint: '#888888',
  activeNavText: 'rgba(60, 102, 224, 1)',
  inactiveNavText: '#888888',
};

// --- Dynamic Styles ---
const createMyReferralsStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBackground,
  },
  scrollContainer: {
     flexGrow: 1,
     paddingBottom: 20, // Adjusted if no bottom nav
     paddingHorizontal: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    color: theme.textPrimary,
  },
  statsContainer: {
     flexDirection: 'row',
     justifyContent: 'space-around',
     backgroundColor: theme.cardBackground,
     paddingVertical: 15,
     borderRadius: 8,
     marginBottom: 25,
     elevation: theme.elevation,
     shadowColor: theme.shadowColor,
     shadowOffset: { width: 0, height: 1 },
     shadowOpacity: theme.shadowOpacity,
     shadowRadius: theme.shadowRadius,
     borderColor: theme.cardBorder,
     borderWidth: Platform.OS === 'android' && theme.elevation === 0 ? 1 : 0,
  },
  statBox: {
      alignItems: 'center',
  },
  statValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginBottom: 3,
  },
  statLabel: {
      fontSize: 12,
      color: theme.textSecondary,
  },
  placeholderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      minHeight: 200, // Ensure it's visible
  },
  placeholderText: {
      fontSize: 16,
      color: theme.textPlaceholder,
      textAlign: 'center',
      lineHeight: 22,
  },
  listContainer: {
     // No specific styles needed here if items are styled individually
  },
  listHeader: {
     fontSize: 18,
     fontWeight: 'bold',
     color: theme.textPrimary,
     marginBottom: 15,
  },
  referralItem: {
    backgroundColor: theme.cardBackground,
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: theme.elevation,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: theme.shadowOpacity,
    shadowRadius: theme.shadowRadius,
    borderColor: theme.cardBorder,
    borderWidth: Platform.OS === 'android' && theme.elevation === 0 ? 1 : 0,
  },
  referralInfo: {
     flex: 1,
     marginRight: 10,
  },
  referralName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.textPrimary,
    marginBottom: 4,
  },
  referralDate: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  referralStatusContainer: {
      alignItems: 'flex-end',
  },
  referralStatus: {
    fontSize: 13,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden', // Ensures borderRadius clips background
    textAlign: 'center',
  },
  statusCompleted: { // Only color, background is applied to the Text component itself
      color: theme.statusCompletedText,
      backgroundColor: theme.statusCompletedBackground,
  },
  statusPending: {
      color: theme.statusPendingText,
      backgroundColor: theme.statusPendingBackground,
  },
  referralEarnings: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 5,
  },
  // --- Bottom Nav Styles (Kept for consistency if added later) ---
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.bottomNavBackground, // Themed
    paddingVertical: 10,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // shadow/border for bottom nav would be themed similarly to cards
  },
  navItem: { alignItems: 'center', flex: 1, },
  navIcon: { width: 25, height: 25, resizeMode: 'contain', },
  activeIcon: { tintColor: theme.activeIconTint, },
  inactiveIcon: { tintColor: theme.inactiveIconTint, },
  navTextActive: { color: theme.activeNavText, fontSize: 10, marginTop: 4, fontWeight: 'bold', textAlign: 'center', },
  navText: { color: theme.inactiveNavText, fontSize: 10, marginTop: 4, fontWeight: 'bold', textAlign: 'center', },
});
// --- End of Styles ---


const MyReferrals = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkThemeColors : lightThemeColors;
  const styles = createMyReferralsStyles(theme);

  // --- Sample Data ---
  const referrals = [
    { id: 'ref1', name: 'Alice Smith', date: '2023-10-25', status: 'Completed', earnings: '₹300' },
    { id: 'ref2', name: 'Bob Johnson', date: '2023-10-27', status: 'Pending', earnings: 'Pending' },
    { id: 'ref3', name: 'Charlie Brown', date: '2023-09-15', status: 'Completed', earnings: '₹300' },
    { id: 'ref4', name: 'Diana Prince', date: '2023-11-01', status: 'Pending', earnings: 'Pending' },
    // { id: 'ref5', name: 'Eve Adams', date: '2023-08-01', status: 'Completed', earnings: '₹300' },
  ];
  // --- End Sample Data ---

  useEffect(() => {
    const backAction = () => {
        // console.log('Hardware back press detected on MyReferrals');
        if (navigation.canGoBack()) {
            // console.log('Navigating back from MyReferrals');
            navigation.navigate('My Profile'); // Or navigation.goBack();
        } else {
            // console.log('Cannot go back from MyReferrals');
            // navigation.navigate('Home'); // Fallback if needed
        }
        return true; // Prevent default back behavior
    };

    const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
    );

    return () => {
        // console.log('Removing back handler from MyReferrals');
        backHandler.remove();
        // StatusBar.setHidden(false); // Only if it was specifically hidden
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.statusBarContent} backgroundColor={theme.screenBackground} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>My Referrals</Text>

        {/* Stats Summary */}
        <View style={styles.statsContainer}>
           <View style={styles.statBox}>
               <Text style={styles.statValue}>{referrals.length}</Text>
               <Text style={styles.statLabel}>Total Referrals</Text>
           </View>
           <View style={styles.statBox}>
               <Text style={styles.statValue}>{referrals.filter(r => r.status === 'Completed').length}</Text>
               <Text style={styles.statLabel}>Completed</Text>
           </View>
           <View style={styles.statBox}>
               <Text style={styles.statValue}>{referrals.filter(r => r.status === 'Pending').length}</Text>
               <Text style={styles.statLabel}>Pending</Text>
           </View>
        </View>

        {/* Referral List or Placeholder */}
        {referrals.length === 0 ? (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>You haven't referred anyone yet. Share your code to start earning!</Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
             <Text style={styles.listHeader}>Referral History</Text>
             {referrals.map((item) => (
                <View key={item.id} style={styles.referralItem}>
                   <View style={styles.referralInfo}>
                      <Text style={styles.referralName}>{item.name}</Text>
                      <Text style={styles.referralDate}>{item.date}</Text>
                   </View>
                   <View style={styles.referralStatusContainer}>
                      <Text style={[
                         styles.referralStatus,
                         item.status === 'Completed' ? styles.statusCompleted : styles.statusPending
                      ]}>
                         {item.status}
                      </Text>
                      {item.status === 'Completed' && <Text style={styles.referralEarnings}>{item.earnings}</Text>}
                   </View>
                </View>
             ))}
          </View>
        )}
      </ScrollView>
      {/* If a bottom nav is needed, add its JSX here */}
    </View>
  );
};

export default MyReferrals;