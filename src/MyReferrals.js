import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  useColorScheme,
  BackHandler,
  StatusBar,
  Platform,
} from 'react-native';

const lightThemeColors = {
  screenBackground: '#f1f2f2',
  cardBackground: '#ffffff',
  cardBorder: 'transparent',
  textPrimary: '#000000',
  textSecondary: 'gray',
  textPlaceholder: 'gray',
  shadowColor: '#000000',
  shadowOpacity: 0.15,
  shadowRadius: 3,
  elevation: 4,
  statusBarContent: 'light-content',
};

const darkThemeColors = {
  screenBackground: '#121212',
  cardBackground: '#1E1E1E',
  cardBorder: '#3A3A3A',
  textPrimary: '#E0E0E0',
  textSecondary: '#A0A0A0',
  textPlaceholder: '#888888',
  shadowColor: '#000000',
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 0,
  statusBarContent: 'light-content',
};

const createMyReferralsStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBackground,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
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
    minHeight: 200,
  },
  placeholderText: {
    fontSize: 16,
    color: theme.textPlaceholder,
    textAlign: 'center',
    lineHeight: 22,
  },
  listContainer: {
  },
  listHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.textPrimary,
    marginBottom: 15,
  },
  referralItem: {},
});

const MyReferrals = ({ navigation, route }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkThemeColors : lightThemeColors;
  const styles = createMyReferralsStyles(theme);

  const referrals = [
    { id: 'ref1', name: 'Alice Smith', date: '2023-10-25', status: 'Completed', earnings: '₹300' },
    { id: 'ref2', name: 'Bob Johnson', date: '2023-10-27', status: 'Pending', earnings: 'Pending' },
    { id: 'ref3', name: 'Charlie Brown', date: '2023-09-15', status: 'Completed', earnings: '₹300' },
    { id: 'ref4', name: 'Diana Prince', date: '2023-11-01', status: 'Pending', earnings: 'Pending' },
  ];

  useEffect(() => {
    const backAction = () => {
      if (navigation && typeof navigation.canGoBack === 'function' && navigation.canGoBack()) {
        navigation.navigate('My Profile');
        return true;
      }
      if (route && route.params && route.params.origin) {
        navigation.navigate(route.params.origin);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => {
      backHandler.remove();
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.statusBarContent} backgroundColor={theme.screenBackground} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>My Referrals</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{referrals.length}</Text>
            <Text style={styles.statLabel}>Total Referrals</Text>
            <Text style={styles.statLabel}>your referral code used</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{referrals.filter(r => r.status === 'Completed').length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
            <Text style={styles.statLabel}>Payout initiated</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{referrals.filter(r => r.status === 'Pending').length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
            <Text style={styles.statLabel}>Payout pending</Text>
          </View>
        </View>

        {referrals.length === 0 ? (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>You haven't referred anyone yet. Share your code to start earning!</Text>
          </View>
        ) : (<></>
        )}
      </ScrollView>
    </View>
  );
};

export default MyReferrals;
