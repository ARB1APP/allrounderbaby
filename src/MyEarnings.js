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
  Linking
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { BASE_URL } from './config/api';

const lightThemeColors = {
  screenBackground: '#F0F2F5',
  cardBackground: '#ffffff',
  newcardBorder: '#ddd',
  cardBorder: 'transparent',
  textPrimary: '#000000',
  newtextPrimary: '#797670',
  textSecondary: '#333333',
  textMuted: '#000',
  amountColor: '#000000',
  buttonBackground: 'rgba(20, 52, 164, 1)',
  buttonTextColor: '#ffffff',
  inputBackground: '#ffffff',
  newbg: '#fff',
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
  newcardBorder: '#3A3A3A',
  newtextPrimary: '#E0E0E0',
  textPrimary: '#E0E0E0',
  textSecondary: '#B0B0B0',
  textMuted: '#fff',
  newbg: '#777777',
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
    padding: 0,
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
  bankBox: {
    marginBottom: 18,
  },
  bankLinkedLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.textPrimary,
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
  earningsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.textPrimary,
    marginVertical: 15,
    textAlign: 'left',
    marginLeft: 15,
  },
  totalEarningsCard: {
    backgroundColor: '#007bff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 0,
  },
  totalEarningsCardSecond: {
    backgroundColor: '#28a745',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 0,
  },
  totalEarningsText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalEarningsAmount: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  earningsBreakdownSection: {
    backgroundColor: theme.cardBackground,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 15,
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#000',
    borderColor: theme.newcardBorder,
    borderWidth: Platform.OS === 'android' && theme.elevationCard === 0 ? 1 : 0,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.newtextPrimary,
    marginBottom: 15,
    textDecorationColor: 'underline',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationThickness: 1,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  breakdownLabel: {
    fontSize: 14,
    color: theme.textPrimary,
    flex: 1,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.textPrimary,
  },
  subText: {
    fontSize: 12,
    color: theme.newtextPrimary,
    marginLeft: 15,
    marginBottom: 5,
  },
  feedbackLink: {
    color: 'rgba(20, 52, 164, 1)',
    textDecorationLine: 'underline',
  },
  paymentPendingText: {
    color: theme.textPrimary,
    fontWeight: 'bold',
  },
  noteText: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 0,
    color: 'rgba(20, 52, 164, 1)',
  },
  noteLabel: {
    fontWeight: 'bold',
  },
  noteSubText: {
    color: 'rgba(20, 52, 164, 1)',
    fontSize: 14,
  },
  noteparaText: {
    color: 'rgba(20, 52, 164, 1)',
    padding: 20,
    paddingTop: 0,
    paddingBottom: 0,
  },
});


const MyEarnings = ({ navigation, route }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkThemeColors : lightThemeColors;
  const styles = createMyEarningsStyles(theme);

  const [token, setToken] = useState(null);
  const [userId, setUserID] = useState(null);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState(null);

  const [totalEarnings, setTotalEarnings] = useState('0.00');
  const [referralCount, setReferralCount] = useState(0);
  const [earningsPerReferral, setEarningsPerReferral] = useState(3000);
  const [feedbackEarnings, setFeedbackEarnings] = useState('0.00');
  const [pendingReferralCount, setPendingReferralCount] = useState(2);

  const url = BASE_URL;

  useFocusEffect(
    React.useCallback(() => {
      const loadAllData = async () => {
        try {
          const storedToken = await AsyncStorage.getItem('token');
          const storedUserId = await AsyncStorage.getItem('userId');

          if (storedToken && storedUserId) {
            setUserID(storedUserId);
            setToken(storedToken);
            await Promise.all([
              handleBankDetails(storedToken, storedUserId),
              handleEarningDetails(storedToken, storedUserId),
              handleFeedbackEarnings(storedToken, storedUserId)
            ]);
          } else {
          }
        } catch (error) {
          console.error("Failed to load data from storage", error);
        } finally {
          setIsLoading(false);
        }
      };
      setIsLoading(true);
      loadAllData();

    }, [])
  );

  useEffect(() => {
    const calculatedTotal = (referralCount * earningsPerReferral) + parseFloat(feedbackEarnings);
    setTotalEarnings(calculatedTotal.toFixed(2));
  }, [referralCount, earningsPerReferral, feedbackEarnings]);


  const handleBankDetails = async (token, userId) => {
    if (!userId || !token) {
       return;
    }

    const DETAILS_ENDPOINT = `${url}MyProfile/MyProfileDetails_Get_ByID?UserID=${userId}`;
    setIsLoading(true);

    try {
      const response = await fetch(DETAILS_ENDPOINT, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`handleBankDetails: Error fetching profile data: ${response.status} - ${errorText}`);
        setBankDetails(null);
        return;
      }

      const result = await response.json();
      if (result && result.data) {
        const details = {
          country: result.data.country,
          paymentMethod: result.data.paymentMethod,
          accountHolderName: result.data.accountHolderName,
          bankName: result.data.bankName,
          accountNumber: result.data.accountNumberIBAN,
          ifscSwiftCode: result.data.ifscCodeSwift,
          bankCountry: result.data.bankCountry,
          currencyToReceive: result.data.currencyToReceive,
          purpose: result.data.purpose,
          upiId: result.data.upiId,
          upiName: result.data.upiName,
          panNumber: result.data.panNumber,
        };
        setBankDetails(details);
      } else {
         setBankDetails(null);
      }
    } catch (error) {
      console.error("handleBankDetails: Network or unexpected error:", error);
      setBankDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEarningDetails = async (token, userId) => {
    if (!userId || !token) {
       return;
    }

    const DETAILS_ENDPOINT = `${url}ReferralTransaction/ReferralTransactionList_Get_ByID?ReferralCodeFromUserID=${userId}`;
 
    try {
      const response = await fetch(DETAILS_ENDPOINT, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        let errorData;
        const responseText = await response.text();
        try {
          errorData = JSON.parse(responseText);
        } catch (parseError) {
          errorData = { message: response.statusText, rawResponse: responseText };
        }
        console.error("handleEarningDetails: API Error Response:", errorData);
        setReferralCount(0);
        setEarningsPerReferral(3000);
        if (code === "Login Req." || code === "") setCode("N/A");
        return;
      }

      const jsonResponse = await response.json();
      if (jsonResponse && Array.isArray(jsonResponse.data) && jsonResponse.data.length > 0) {
        const referralTransactions = jsonResponse.data;

        const initiatedReferrals = referralTransactions.filter(
          (ref) => ref.status === 'Payment Initiated'
        );
        const pendingReferrals = referralTransactions.filter(
          (ref) => ref.status === 'Payment Pending'
        );


        setReferralCount(initiatedReferrals.length);
        setPendingReferralCount(pendingReferrals.length);


        setEarningsPerReferral(3000);

        if (referralTransactions.length > 0 && referralTransactions[0].referralCodeName) {
          setCode(referralTransactions[0].referralCodeName);
         } else {
           if (code === "Login Req." || code === "") setCode("N/A");
        }

      } else if (jsonResponse && jsonResponse.data && !Array.isArray(jsonResponse.data)) {
        console.warn("handleEarningDetails: Response contains a 'data' property, but it's not an array. Please verify API response structure for earning details.");

        setReferralCount(0);
        setEarningsPerReferral(3000); 
        setPendingReferralCount(0);
        if (code === "Login Req." || code === "") setCode("N/A");
      } else {
         setReferralCount(0);
        setEarningsPerReferral(3000);
        setPendingReferralCount(0);
        if (code === "Login Req." || code === "") setCode("N/A");
      }

    } catch (error) {
      console.error("handleEarningDetails: Network or unexpected error:", error);
      Alert.alert("Error", "Could not load your referral earnings. Please check your connection and try again.");
      setReferralCount(0);
      setEarningsPerReferral(3000);
      setPendingReferralCount(0);
      if (code === "Login Req." || code === "") setCode("Error");
    } finally {
    }
  };

  const handleFeedbackEarnings = async (currentToken, currentUserId) => {
    if (!currentUserId || !currentToken) {
       return;
    }

    const FEEDBACK_ENDPOINT = `${url}MyProfile/cashback-processed?userId=${currentUserId}`;
 
    try {
      const response = await fetch(FEEDBACK_ENDPOINT, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        setFeedbackEarnings('0.00');
        return;
      }

      const jsonResponse = await response.json();
        if (jsonResponse.code === 200) {
        setFeedbackEarnings('1000.00');
      } else if (jsonResponse.code === 404) {
        setFeedbackEarnings('0.00');
      } else {
         setFeedbackEarnings('0.00');
      }

    } catch (error) {
      console.error("handleFeedbackEarnings: Network or unexpected error:", error);
      setFeedbackEarnings('0.00');
    }
  };

  const handleFeedbackLinkPress = () => {
    const feedbackUrl = 'https://allrounderbaby.com/feedback';
    Linking.openURL(feedbackUrl).catch(err => {
      console.error("Couldn't load page", err);
      Alert.alert('Error', 'Unable to open feedback page. Please try again later.');
    });
  };


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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingContainer}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1434A4" />
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
                <Text style={styles.earningsHeader}>My Earnings</Text>

                <View style={styles.totalEarningsCard}>
                  <Text style={styles.totalEarningsText}>A. Total Earnings (INR): &nbsp;
                    <Text style={styles.totalEarningsAmount}>₹ {parseFloat(totalEarnings).toLocaleString('en-IN')}</Text>
                  </Text>
                </View>
                <View style={styles.earningsBreakdownSection}>
                  <Text style={styles.breakdownTitle}>Earnings Breakdown:</Text>

                  <View style={styles.breakdownItem}>
                    <Text style={styles.breakdownLabel}>
                      1) Number of Referrals (Payment <Text style={{ color: '#5f9b3d' }}>Initiated</Text>)
                    </Text>
                    <Text style={styles.breakdownValue}>{referralCount}</Text>
                  </View>

                  <View style={styles.breakdownItem}>
                    <Text style={styles.breakdownLabel}>2) Earnings from Referrals:</Text>
                    <Text style={styles.breakdownValue}>{referralCount * earningsPerReferral}</Text>
                  </View>
                  <Text style={styles.subText}>(Fixed rate: ₹{earningsPerReferral.toLocaleString('en-IN')} per referral)</Text>

                  <View style={styles.breakdownItem}>
                    <Text style={styles.breakdownLabel}>3) Earnings from Feedback:</Text>
                    <Text style={styles.breakdownValue}>₹ {parseFloat(feedbackEarnings).toLocaleString('en-IN')}</Text>
                  </View>
                  <Text style={styles.subText}>
                    (Fixed amount: ₹1,000 – one-time only)
                    <Text style={styles.feedbackLink} onPress={handleFeedbackLinkPress}> submit your feedback!</Text>
                  </Text>

                  <View style={styles.breakdownItem}>
                    <Text style={styles.breakdownLabel}>
                      4) Number of Referrals (Payment <Text style={{ color: '#dc3545' }}>Pending</Text>):
                    </Text>
                    <Text style={[styles.breakdownValue, styles.paymentPendingText]}>{pendingReferralCount}</Text>
                  </View>
                </View>

                <View style={styles.totalEarningsCardSecond}>
                  <Text style={styles.totalEarningsText}>A. Total Earnings (USD): &nbsp;
                    <Text style={styles.totalEarningsAmount}>$ {parseFloat(totalEarnings).toLocaleString('en-IN')}</Text>
                  </Text>
                </View>
                <View style={styles.earningsBreakdownSection}>
                  <Text style={styles.breakdownTitle}>Earnings Breakdown:</Text>

                  <View style={styles.breakdownItem}>
                    <Text style={styles.breakdownLabel}>
                      1) Number of Referrals (Payment <Text style={{ color: '#5f9b3d' }}>Initiated</Text>)
                    </Text>
                    <Text style={styles.breakdownValue}>{referralCount}</Text>
                  </View>

                  <View style={styles.breakdownItem}>
                    <Text style={styles.breakdownLabel}>2) Earnings from Referrals:</Text>
                    <Text style={styles.breakdownValue}>{referralCount * earningsPerReferral}</Text>
                  </View>
                  <Text style={styles.subText}>(Fixed rate: ${earningsPerReferral.toLocaleString('en-IN')} per referral)</Text>

                  <View style={styles.breakdownItem}>
                    <Text style={styles.breakdownLabel}>3) Earnings from Feedback:</Text>
                    <Text style={styles.breakdownValue}>$ {parseFloat(feedbackEarnings).toLocaleString('en-IN')}</Text>
                  </View>
                  <Text style={styles.subText}>
                    (Fixed amount: $1,000 – one-time only)
                    <Text style={styles.feedbackLink} onPress={handleFeedbackLinkPress}> submit your feedback!</Text>
                  </Text>

                  <View style={styles.breakdownItem}>
                    <Text style={styles.breakdownLabel}>
                      4) Number of Referrals (Payment <Text style={{ color: '#dc3545' }}>Pending</Text>):
                    </Text>
                    <Text style={[styles.breakdownValue, styles.paymentPendingText]}>{pendingReferralCount}</Text>
                  </View>
                </View>
                <Text style={styles.noteText}>
                  <Text>
                    <Text style={styles.noteLabel}>Note:</Text>
                    &nbsp;
                    <Text style={styles.noteSubText}>
                      Please update your Profile and bank account details after logging in to our website.
                    </Text>
                  </Text>
                </Text>
                <Text style={styles.noteparaText}>
                  So, we can transfer the following amounts to you:
                </Text>
                <Text style={styles.noteparaText}>
                  (a) Earnings from referrals
                </Text>
                <Text style={[styles.noteparaText, { marginBottom: 20 }]}>
                  (b) Cashback from feedback
                </Text>
              </View>

              <View style={styles.transactionsSection}>
                <Text style={styles.bankLinked}>Linked Bank Account Details for Receiving Payment</Text>

                {bankDetails ? (
                  <>
                    <View style={styles.bankBox}>
                      <Text style={styles.bankLinkedLabel}>Country</Text>
                      <TextInput
                        style={styles.disabledInput}
                        value={bankDetails.country || 'N/A'}
                        editable={false}
                      />
                    </View>

                    <View style={styles.bankBox}>
                      <Text style={styles.bankLinkedLabel}>Payment Method</Text>
                      <TextInput
                        style={styles.disabledInput}
                        value={bankDetails.paymentMethod || 'N/A'}
                        editable={false}
                      />
                    </View>

                    {bankDetails.paymentMethod === 'upi' && (
                      <>
                        <View style={styles.bankBox}>
                          <Text style={styles.bankLinkedLabel}>UPI ID</Text>
                          <TextInput
                            style={styles.disabledInput}
                            value={bankDetails.upiId || 'N/A'}
                            editable={false}
                          />
                        </View>
                        <View style={styles.bankBox}>
                          <Text style={styles.bankLinkedLabel}>Name as per UPI ID</Text>
                          <TextInput
                            style={styles.disabledInput}
                            value={bankDetails.upiName || 'N/A'}
                            editable={false}
                          />
                        </View>
                      </>
                    )}

                    {bankDetails.paymentMethod === 'bank' && (
                      <>
                        <View style={styles.bankBox}>
                          <Text style={styles.bankLinkedLabel}>Name as per bank account</Text>
                          <TextInput
                            style={styles.disabledInput}
                            value={bankDetails.accountHolderName || 'N/A'}
                            editable={false}
                          />
                        </View>
                        <View style={styles.bankBox}>
                          <Text style={styles.bankLinkedLabel}>Bank Name</Text>
                          <TextInput
                            style={styles.disabledInput}
                            value={bankDetails.bankName || 'N/A'}
                            editable={false}
                          />
                        </View>
                        <View style={styles.bankBox}>
                          <Text style={styles.bankLinkedLabel}>Account Number</Text>
                          <TextInput
                            style={styles.disabledInput}
                            value={bankDetails.accountNumber || 'N/A'}
                            keyboardType="numeric"
                            editable={false}
                          />
                        </View>
                        <View style={styles.bankBox}>
                          <Text style={styles.bankLinkedLabel}>IFSC/SWIFT Code</Text>
                          <TextInput
                            style={styles.disabledInput}
                            value={bankDetails.ifscSwiftCode || 'N/A'}
                            autoCapitalize="characters"
                            editable={false}
                          />
                        </View>
                        <View style={styles.bankBox}>
                          <Text style={styles.bankLinkedLabel}>Bank country</Text>
                          <TextInput
                            style={styles.disabledInput}
                            value={bankDetails.bankCountry || 'N/A'}
                            autoCapitalize="characters"
                            editable={false}
                          />
                        </View>
                        <View style={styles.bankBox}>
                          <Text style={styles.bankLinkedLabel}>Currency to Recieve</Text>
                          <TextInput
                            style={styles.disabledInput}
                            value={bankDetails.currencyToReceive || 'N/A'}
                            autoCapitalize="characters"
                            editable={false}
                          />
                        </View>
                        <View style={styles.bankBox}>
                          <Text style={styles.bankLinkedLabel}>Purpose</Text>
                          <TextInput
                            style={styles.disabledInput}
                            value={bankDetails.purpose || 'N/A'}
                            autoCapitalize="characters"
                            editable={false}
                          />
                        </View>
                        {bankDetails.country && bankDetails.country.toLowerCase() === 'india' && (
                          <View style={styles.bankBox}>
                            <Text style={styles.bankLinkedLabel}>Permanent Account Num (PAN)</Text>
                            <TextInput
                              style={styles.disabledInput}
                              value={bankDetails.panNumber || 'N/A'}
                              autoCapitalize="characters"
                              editable={false}
                            />
                          </View>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <Text style={{ textAlign: 'center', color: theme.textSecondary }}>No bank details linked. Please link your bank account.</Text>
                )}
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};
export default MyEarnings;