import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  BackHandler,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const lightThemeColors = {
  screenBackground: '#F0F2F5',
  cardBackground: '#ffffff',
  cardBorder: 'transparent',
  textPrimary: '#000000',
  textSecondary: '#333333',
  textMuted: '#888888',
  amountColor: '#000000',
  buttonBackground: 'rgba(20, 52, 164, 1)',
  buttonTextColor: '#ffffff',
  inputBackground: '#ffffff',
  inputBorderColor: '#ced4da',
  inputText: '#333333',
  inputPlaceholderText: '#999999',
  disabledInputBackground: '#f0f0f0',
  shadowColor: '#000000',
  shadowOpacityCard: 0.2,
  shadowRadiusCard: 4,
  elevationCard: 5,
  shadowOpacitySection: 0.15,
  shadowRadiusSection: 3,
  elevationSection: 4,
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
  textSecondary: '#B0B0B0',
  textMuted: '#777777',
  amountColor: '#E0E0E0',
  buttonBackground: 'rgba(30, 62, 174, 1)',
  buttonTextColor: '#FFFFFF',
  inputBackground: '#2C2C2C',
  inputBorderColor: '#4A4A4A',
  inputText: '#E0E0E0',
  inputPlaceholderText: '#777777',
  disabledInputBackground: '#252525',
  shadowColor: '#000000',
  shadowOpacityCard: 0.4,
  shadowRadiusCard: 5,
  elevationCard: 0,
  shadowOpacitySection: 0.3,
  shadowRadiusSection: 4,
  elevationSection: 0,
  statusBarContent: 'light-content',

  bottomNavBackground: '#1E1E1E',
  activeIconTint: 'rgba(60, 102, 224, 1)',
  inactiveIconTint: '#888888',
  activeNavText: 'rgba(60, 102, 224, 1)',
  inactiveNavText: '#888888',
};

const createMyEarningsStyles = (theme) => StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: theme.screenBackground,
  },
  container: {
    flex: 1,
    backgroundColor: theme.screenBackground,
  },
  scrollContainer: {
     flexGrow: 1,
     paddingBottom: 20,
  },
  card: {
    backgroundColor: theme.cardBackground,
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 15,
    elevation: theme.elevationCard,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.shadowOpacityCard,
    shadowRadius: theme.shadowRadiusCard,
    borderColor: theme.cardBorder,
    borderWidth: Platform.OS === 'android' && theme.elevationCard === 0 ? 1 : 0,
  },
  label: {
    fontSize: 16,
    color: theme.textMuted,
    textAlign: 'center',
    marginBottom: 2,
  },
  samillTitle:{
    fontSize: 12,
    textAlign: 'center',
    color: theme.textMuted,
    marginBottom: 10,
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: theme.amountColor,
  },
  withdrawButton: {
    backgroundColor: theme.buttonBackground,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 15,
  },
  withdrawButtonText: {
    color: theme.buttonTextColor,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  coinsTodayYesterday: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    gap: 15,
  },
  eranDetail:{
    flex: 1,
    alignItems: 'center',
  },
  coinsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: theme.textPrimary,
  },
  coinsLabel: {
    fontSize: 11,
    color: theme.textMuted,
    textAlign: 'center',
    lineHeight: 15,
  },
  minWithdrawalText: {
    fontSize: 12,
    color: theme.textMuted,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  transactionsSection: {
    marginHorizontal: 15,
    marginBottom: 20,
    backgroundColor: theme.cardBackground,
    borderRadius: 10,
    padding: 20,
    elevation: theme.elevationSection,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: theme.shadowOpacitySection,
    shadowRadius: theme.shadowRadiusSection,
    borderColor: theme.cardBorder,
    borderWidth: Platform.OS === 'android' && theme.elevationSection === 0 ? 1 : 0,
  },
  bankLinked: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: theme.textPrimary,
  },
  bankBox:{
    marginBottom: 18,
  },
  bankLinkedLabel:{
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.textPrimary,
  },
  input:{
    height: 45,
    backgroundColor: theme.inputBackground,
    borderColor: theme.inputBorderColor,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: theme.inputText,
  },
  disabledInput: {
    height: 45,
    backgroundColor: theme.disabledInputBackground,
    borderColor: theme.inputBorderColor,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: theme.inputText,
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
  },
  navItem: { alignItems: 'center', flex: 1, },
  navIcon: { width: 25, height: 25, resizeMode: 'contain', },
  activeIcon: { tintColor: theme.activeIconTint, },
  inactiveIcon: { tintColor: theme.inactiveIconTint, },
  navTextActive: { color: theme.activeNavText, fontSize: 10, marginTop: 4, fontWeight: 'bold', textAlign: 'center', },
  navText: { color: theme.inactiveNavText, fontSize: 10, marginTop: 4, fontWeight: 'bold', textAlign: 'center', },
});


const MyEarnings = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkThemeColors : lightThemeColors;
  const styles = createMyEarningsStyles(theme);

  const [token, setToken] = useState(null);
  const [userId, setUserID] = useState(null);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState(null); // Renamed userDetails to bankDetails for clarity

  // New states for earning details
  const [totalEarnings, setTotalEarnings] = useState('0.00');
  const [referralCount, setReferralCount] = useState(0);
  const [earningsPerReferral, setEarningsPerReferral] = useState(0); // This might need to be dynamically set based on API or logic
  const [feedbackEarnings, setFeedbackEarnings] = useState('0.00'); // This might need to be dynamically set based on API or logic

  const url = 'https://allrounderbaby-czh8hubjgpcxgrc7.canadacentral-01.azurewebsites.net/api/';


  const handleBankDetails = async (token, userId) => {
    if (!userId || !token) {
      console.log("handleBankDetails: Token or User ID not available for fetching bank details. Skipping API call.");
      return;
    }

    const DETAILS_ENDPOINT = `${url}BankDetails/BankTransaction_Get_BY_UserID?UserID=${userId}`;
    console.log(`handleBankDetails: Attempting to fetch from: ${DETAILS_ENDPOINT}`);
    // setIsLoading(true); // Loading starts in loadAllData

    try {
        const response = await fetch(DETAILS_ENDPOINT, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        console.log(`handleBankDetails: API Response Status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            let errorData;
            const responseText = await response.text();
            try {
                errorData = JSON.parse(responseText);
            } catch (parseError) {
                errorData = { message: response.statusText, rawResponse: responseText };
            }
            console.error("handleBankDetails: API Error Response:", errorData);
            Alert.alert("API Error", `Failed to load bank details: ${errorData.message || response.statusText}. Raw response: ${errorData.rawResponse || 'N/A'}`);
            return;
        }

        const jsonResponse = await response.json();
        console.log("handleBankDetails: Parsed JSON response for bank details:", jsonResponse);

        if (Array.isArray(jsonResponse) && jsonResponse.length > 0 && jsonResponse[0].data) {
            setBankDetails(jsonResponse[0].data);
            // This part assumes 'referal_Code' might still be present or needed for 'code' state,
            // even though the API endpoint is now for BankDetails.
            // Keeping the existing logic for referal_Code for now.
            // Based on your logs, 'referal_Code' is not directly in jsonResponse[0].
            // It might come from another user details API or be part of the 'data' object if available.
            // For now, removing this specific code setting from handleBankDetails to avoid confusion.
            // if (jsonResponse[0].referal_Code) {
            //     setCode(jsonResponse[0].referal_Code);
            //     console.log("handleBankDetails: Referral code successfully set:", jsonResponse[0].referal_Code);
            // } else {
            //     if (code === "Login Req." || code === "") setCode("N/A"); // Fallback if no code is found
            // }
        } else {
            console.log("handleBankDetails: Bank data not found or format is invalid (missing 'data' property or empty array).");
            Alert.alert("Data Error", "Bank data not found or format is invalid.");
            // if (code === "Login Req." || code === "") setCode("N/A"); // Avoid setting code here if it's from earnings
        }

    } catch (error) {
        console.error("handleBankDetails: Network or unexpected error:", error);
        Alert.alert("Network Error", `An unexpected error occurred during bank details fetch: ${error.message}`);
        // if (code === "Login Req." || code === "") setCode("Error"); // Avoid setting code here if it's from earnings
    } finally {
        // setIsLoading(false); // Managed by loadAllData
    }
  };


  const handleEarningDetails = async (token, userId) => {
    if (!userId || !token) {
        console.log("handleEarningDetails: Token or User ID not available for fetching earning details. Skipping API call.");
        return;
    }

    const DETAILS_ENDPOINT = `${url}ReferralTransaction/ReferralTransactionList_Get_ByID?ReferralCodeFromUserID=${userId}`;
    console.log(`handleEarningDetails: Attempting to fetch from: ${DETAILS_ENDPOINT}`);
    // setIsLoading(true); // Loading starts in loadAllData

    try {
        const response = await fetch(DETAILS_ENDPOINT, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        console.log(`handleEarningDetails: API Response Status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            let errorData;
            const responseText = await response.text();
            try {
                errorData = JSON.parse(responseText);
            } catch (parseError) {
                errorData = { message: response.statusText, rawResponse: responseText };
            }
            console.error("handleEarningDetails: API Error Response:", errorData);
            Alert.alert("API Error", `Failed to load earning details: ${errorData.message || response.statusText}. Raw response: ${errorData.rawResponse || 'N/A'}`);
            return;
        }

        const jsonResponse = await response.json();
        console.log("handleEarningDetails: Parsed JSON response for earning details:", jsonResponse);

        // Corrected condition: jsonResponse is an object, and jsonResponse.data is the array
        if (jsonResponse && Array.isArray(jsonResponse.data) && jsonResponse.data.length > 0) {
            const referralTransactions = jsonResponse.data;

            // Calculate total earnings by summing amounts
            const sumTotalEarnings = referralTransactions.reduce((sum, item) => sum + (item.amount || 0), 0);
            setTotalEarnings(sumTotalEarnings.toFixed(2));

            // Calculate referral count (number of items in the data array)
            setReferralCount(referralTransactions.length);

            // Set earnings per referral based on the first item's amount, or 0 if no transactions
            if (referralTransactions.length > 0 && referralTransactions[0].amount) {
                setEarningsPerReferral(referralTransactions[0].amount);
            } else {
                setEarningsPerReferral(0);
            }
            // Feedback earnings is not present in this data structure, it remains '0.00' or needs another API.
            setFeedbackEarnings('0.00');

            // Try to set referral code from the first item in the data array, if available
            if (referralTransactions.length > 0 && referralTransactions[0].referralCodeName) {
                setCode(referralTransactions[0].referralCodeName);
                console.log("handleEarningDetails: Referral code successfully set from earning details:", referralTransactions[0].referralCodeName);
            } else {
                console.log("handleEarningDetails: 'referralCodeName' property not found in earning details response 'data' object item, or is null/empty.");
                // Preserve existing 'code' if it's not "Login Req." or empty, otherwise set to "N/A"
                if (code === "Login Req." || code === "") setCode("N/A");
            }

        } else if (jsonResponse && jsonResponse.data && !Array.isArray(jsonResponse.data)) {
          console.warn("handleEarningDetails: Response contains a 'data' property, but it's not an array. Please verify API response structure for earning details.");
          Alert.alert("Data Format Warning", "Earning data format unexpected.");
          // Reset values if data format is unexpected
          setTotalEarnings('0.00');
          setReferralCount(0);
          setEarningsPerReferral(0);
          setFeedbackEarnings('0.00');
          if (code === "Login Req." || code === "") setCode("N/A");
        } else {
            console.log("handleEarningDetails: Earning data not found or format is invalid (missing 'data' property or empty array).");
            Alert.alert("Data Error", "Earning data not found or format is invalid.");
            // Reset values if no data
            setTotalEarnings('0.00');
            setReferralCount(0);
            setEarningsPerReferral(0);
            setFeedbackEarnings('0.00');
            if (code === "Login Req." || code === "") setCode("N/A");
        }

    } catch (error) {
        console.error("handleEarningDetails: Network or unexpected error:", error);
        Alert.alert("Network Error", `An unexpected error occurred during earning details fetch: ${error.message}`);
        // Reset values on network error
        setTotalEarnings('0.00');
        setReferralCount(0);
        setEarningsPerReferral(0);
        setFeedbackEarnings('0.00');
        if (code === "Login Req." || code === "") setCode("Error");
    } finally {
        // setIsLoading(false); // Managed by loadAllData
    }
  };

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

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUserId = await AsyncStorage.getItem('userId');
        setUserID(storedUserId);
        setToken(storedToken);
        if (storedToken && storedUserId) {
          setIsLoading(true);
          await Promise.all([
            handleBankDetails(storedToken, storedUserId),
            handleEarningDetails(storedToken, storedUserId)
          ]);
        } else {
          console.warn("Authentication: Token or User ID not found in AsyncStorage.");
          setCode("Login Req.");
        }
      } catch (error) {
        console.error("Error loading all user data from AsyncStorage or APIs:", error);
      } finally {
        setIsLoading(false); // Ensure loading is false after all attempts (success or failure)
      }
    };
    loadAllData();
  }, [token, userId]); // Dependency array to re-run if token/userId changes

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingContainer}
    >
      <StatusBar barStyle={theme.statusBarContent} backgroundColor={theme.screenBackground} />
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {isLoading ? (
            <ActivityIndicator size="large" color={theme.buttonBackground} style={{ marginTop: 50 }} />
          ) : (
            <>
              <View style={styles.card}>
                <Text style={styles.label}>Total Earnings (INR/USD/EUR)</Text>
                <Text style={styles.samillTitle}>Your Savings !</Text>
                <Text style={styles.amount}>{totalEarnings}</Text>
                <View style={styles.coinsTodayYesterday}>
                  <View style={styles.eranDetail}>
                    <Text style={styles.coinsValue}>
                      {referralCount} X {earningsPerReferral}
                    </Text>
                    <Text style={styles.coinsLabel}>Total no. of Referrals X Earnings from each Referral (Refer more ! Earn more !)</Text>
                  </View>
                  <View style={styles.eranDetail}>
                    <Text style={styles.coinsValue}>{feedbackEarnings}</Text>
                    <Text style={styles.coinsLabel}>Earnings from Feedback (Earn now ! Submit on website!)</Text>
                  </View>
                </View>
                <Text style={styles.minWithdrawalText}>Minimum 3000 is required for withdrawal</Text>
              </View>

              <View style={styles.transactionsSection}>
                <Text style={styles.bankLinked}>Current Linked Bank Account Details</Text>
                <View style={styles.bankBox}>
                  <Text style={styles.bankLinkedLabel}>Beneficiary Name</Text>
                  <TextInput
                    style={styles.disabledInput}
                    placeholder="Enter Beneficiary Name"
                    placeholderTextColor={theme.inputPlaceholderText}
                    editable={false}
                    value={bankDetails?.beneficiaryName || ''}
                  />
                </View>
                <View style={styles.bankBox}>
                  <Text style={styles.bankLinkedLabel}>Bank Name</Text>
                  <TextInput
                    style={styles.disabledInput}
                    placeholder="Enter Bank Name"
                    placeholderTextColor={theme.inputPlaceholderText}
                    editable={false}
                    value={bankDetails?.bankName || ''}
                  />
                </View>
                <View style={styles.bankBox}>
                  <Text style={styles.bankLinkedLabel}>Account Number</Text>
                  <TextInput
                    style={styles.disabledInput}
                    placeholder="Enter Account Number"
                    placeholderTextColor={theme.inputPlaceholderText}
                    keyboardType="numeric"
                    editable={false}
                    value={bankDetails?.accountNumber || ''}
                  />
                </View>
                <View style={styles.bankBox}>
                  <Text style={styles.bankLinkedLabel}>IFSC/SWIFT Code</Text>
                  <TextInput
                    style={styles.disabledInput}
                    placeholder="Enter IFSC/SWIFT Code"
                    placeholderTextColor={theme.inputPlaceholderText}
                    autoCapitalize="characters"
                    editable={false}
                    value={bankDetails?.ifsC_SWIFTCode || ''}
                  />
                </View>
                <View style={styles.bankBox}>
                  <Text style={styles.bankLinkedLabel}>PAN Number</Text>
                  <TextInput
                    style={styles.disabledInput}
                    placeholder="Enter PAN Number"
                    placeholderTextColor={theme.inputPlaceholderText}
                    autoCapitalize="characters"
                    editable={false}
                    value={bankDetails?.paN_no || ''}
                  />
                </View>
                <View style={styles.bankBox}>
                  <Text style={styles.bankLinkedLabel}>Payment Method</Text>
                  <TextInput
                    style={styles.disabledInput}
                    placeholder="Enter Withdraw Amount"
                    placeholderTextColor={theme.inputPlaceholderText}
                    autoCapitalize="characters"
                    editable={false}
                    value={bankDetails?.paymentMethod || ''}
                  />
                </View>
                <View style={styles.bankBox}>
                    <Text style={styles.bankLinkedLabel}>Referral Code</Text>
                    <TextInput
                        style={styles.disabledInput}
                        value={code}
                        editable={false}
                        placeholderTextColor={theme.inputPlaceholderText}
                    />
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MyEarnings;
