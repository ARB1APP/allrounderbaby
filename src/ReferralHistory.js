import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  BackHandler,
  useColorScheme,
  Alert,
  StatusBar,
  ActivityIndicator, // Added ActivityIndicator for loading state
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Base URL for your API
const url = 'https://allrounderbaby-czh8hubjgpcxgrc7.canadacentral-01.azurewebsites.net/api/';

const ReferralHistory = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';

  // Define theme colors directly within the component for simplicity, matching ReferAndEarn
  const lightThemeColors = {
    screenBackground: '#F4F6F8',
    cardBackground: '#FFFFFF',
    textPrimary: '#1A202C',
    textSecondary: '#4A5568',
    textMuted: '#718096',
    textSuccess: '#38A169',
    borderColor: '#E2E8F0',
  };

  const darkThemeColors = {
    screenBackground: '#1A202C',
    cardBackground: '#2D3748',
    textPrimary: '#E2E8F0',
    textSecondary: '#A0AEC0',
    textMuted: '#718096',
    textSuccess: '#68D391',
    borderColor: '#4A5568',
  };

  const theme = isDarkMode ? darkThemeColors : lightThemeColors;

  const backgroundStyle = {
    backgroundColor: theme.screenBackground,
  };

  // State for referral history data, loading, token, and userId
  const [referralHistory, setReferralHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Start loading immediately
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  // Load user token and ID from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUserId = await AsyncStorage.getItem('userId');
        setToken(storedToken);
        setUserId(storedUserId);

        if (storedToken && storedUserId) {
          fetchReferralHistory(storedToken, storedUserId);
        } else {
          console.warn("Authentication: Token or User ID not found in AsyncStorage. Cannot fetch referral history.");
          setIsLoading(false); // Stop loading if credentials are missing
          Alert.alert("Authentication Required", "Please log in to view your referral history.");
        }
      } catch (error) {
        console.error("Failed to load user data from AsyncStorage:", error);
        setIsLoading(false);
        Alert.alert("Error", "Failed to load user data for authentication.");
      }
    };
    loadUserData();
  }, []); // Run once on component mount

  // Function to fetch referral history from the API
  const fetchReferralHistory = async (currentToken, currentUserId) => {
    // Ensure we have a token and userId before making the API call
    if (!currentToken || !currentUserId) {
      console.log("Skipping fetchReferralHistory: Token or User ID is missing.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    // Updated API endpoint as per the user's request
    const API_ENDPOINT = `${url}ReferralTransaction/ReferralTransactionList_Get_ByID?ReferralCodeFromUserID=${currentUserId}`;
    console.log(`Fetching referral history from: ${API_ENDPOINT}`);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Accept': 'application/json',
        },
      });

      console.log(`ReferralHistory API Response Status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        let errorData;
        const responseText = await response.text();
        try {
          errorData = JSON.parse(responseText);
        } catch (parseError) {
          errorData = { message: response.statusText, rawResponse: responseText };
        }
        console.error("ReferralHistory API Error:", errorData);
        Alert.alert("API Error", `Failed to load referral history: ${errorData.message || response.statusText}. Raw response: ${errorData.rawResponse || 'N/A'}`);
        setReferralHistory([]); // Clear history on error
        return;
      }

      const jsonResponse = await response.json();
      console.log("ReferralHistory Raw API Response:", jsonResponse);

      // --- CRITICAL CHANGE: Access jsonResponse.data ---
      if (jsonResponse && Array.isArray(jsonResponse.data)) {
        if (jsonResponse.data.length > 0) {
          setReferralHistory(jsonResponse.data);
          console.log("Referral history data successfully set.");
        } else {
          console.log("API returned data array, but it's empty.");
          setReferralHistory([]);
        }
      } else {
        console.log("API response does not contain a 'data' array or is in an unexpected format.");
        setReferralHistory([]); // Ensure it's an empty array if no data or invalid format
      }

    } catch (error) {
      console.error("Network or unexpected error fetching referral history:", error);
      Alert.alert("Network Error", `An unexpected error occurred: ${error.message}`);
      setReferralHistory([]); // Clear history on network error
    } finally {
      setIsLoading(false);
    }
  };


  // Back button handling
  useEffect(() => {
    const backAction = () => {
      console.log('Hardware back press detected on ReferralHistory screen');
      if (navigation.canGoBack()) {
        console.log('Navigating back to Refer and Earn');
        navigation.navigate('Refer and Earn');
      } else {
        console.log('Cannot go back, navigating to Home');
        navigation.navigate('Home'); // Fallback to Home if cannot go back
      }
      return true; // Prevent default behavior
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => {
      console.log('Removing back handler on ReferralHistory screen unmount');
      backHandler.remove();
      StatusBar.setHidden(false); // Ensure status bar is visible on exit
    };
  }, [navigation]); // Depend on navigation to re-attach if navigation object changes

  // Function for the button in case it's used (though backhandler covers it)
  const handlereferAndearnBackpress = () => {
    navigation.navigate('Refer and Earn');
  };

  return (
    <View style={[styles.container, backgroundStyle]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.screenBackground} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
            <TouchableOpacity onPress={handlereferAndearnBackpress} style={styles.backButton}>
                <Image source={require('../img/arrowicon.png')} style={[styles.backIcon, { tintColor: theme.textPrimary }]} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Referral History</Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.textPrimary} />
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading referral history...</Text>
          </View>
        ) : referralHistory.length > 0 ? (
          referralHistory.map((item, index) => (
            <View key={index} style={[styles.historyCard, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor }]}>
              <Text style={[styles.historyText, { color: theme.textPrimary }]}>
                Date: <Text style={styles.boldText}>{item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</Text>
              </Text>
              <Text style={[styles.historyText, { color: theme.textPrimary }]}>
                Email: <Text style={styles.boldText}>{item.email || 'N/A'}</Text>
              </Text>
              <Text style={[styles.historyText, { color: theme.textPrimary }]}>
                Phone Number: <Text style={styles.boldText}>{item.phoneNumber || 'N/A'}</Text>
              </Text>
              {/* Removed other fields as per user request */}
              {/* <Text style={[styles.historyText, { color: theme.textPrimary }]}>
                Amount: <Text style={styles.boldText}>{item.amount ? `₹${item.amount}` : 'N/A'}</Text>
              </Text> */}
            </View>
          ))
        ) : (
          <Text style={[styles.text, { color: theme.textSecondary }]}>No Data Found</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20, // Add some top padding
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    transform: [{ rotate: '180deg' }], // Rotate to make it a back arrow
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200, // Ensure loading indicator is visible
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
  },
  historyCard: {
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 5,
  },
  boldText: {
    fontWeight: '600',
  },

});

export default ReferralHistory;
