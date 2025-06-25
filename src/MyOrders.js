import React, { useEffect, useRef, useState } from 'react';
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
  BackHandler,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { format } from 'date-fns';

const lightThemeColors = {
  screenBackground: '#dfe6ff',
  cardBackground: '#ffffff',
  cardBorder: 'transparent',
  textPrimary: '#000000',
  textSecondary: '#333333',
  inputBackground: '#ffffff',
  inputBorderColor: '#ced4da',
  inputText: '#333333',
  inputPlaceholderText: '#999999',
  buttonBackground: 'rgba(20, 52, 164, 1)',
  buttonTextColor: '#ffffff',
  shadowColor: '#000000',
  shadowOpacity: 0.15,
  shadowRadius: 3,
  elevation: 4,
  statusBarContent: 'dark-content',

  bottomNavBackground: '#ffffff',
  bottomNavShadowColor: '#000',
  bottomNavShadowOpacity: 0.2,
  bottomNavShadowRadius: 10,
  bottomNavElevation: 10,
  bottomNavBorderTopColor: 'transparent',
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
  inputBackground: '#2C2C2C',   
  inputBorderColor: '#4A4A4A',
  inputText: '#E0E0E0',       
  inputPlaceholderText: '#777777',
  buttonBackground: 'rgba(30, 62, 174, 1)', 
  buttonTextColor: '#FFFFFF',
  shadowColor: '#000000', 
  shadowOpacity: 0.3, 
  shadowRadius: 5,  
  elevation: 0, 
  statusBarContent: 'light-content',
};

const createMyOrdersStyles = (theme) => StyleSheet.create({
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
  transactionsSection: {
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: theme.cardBackground,
    borderRadius: 10,
    padding: 20,
    elevation: theme.elevation,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: theme.shadowOpacity,
    shadowRadius: theme.shadowRadius,
    borderColor: theme.cardBorder,
    borderWidth: Platform.OS === 'android' && theme.elevation === 0 ? 1 : 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
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
    justifyContent: 'center',
  },
  downloadButton: {
     backgroundColor: theme.buttonBackground,
     paddingVertical: 10,
     paddingHorizontal: 15,
     borderRadius: 8,
     alignItems: 'center',
     marginTop: 5,
  },
  downloadButtonText: {
      color: theme.buttonTextColor,
      fontSize: 14,
      fontWeight: 'bold',
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
    shadowColor: theme.bottomNavShadowColor,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: theme.bottomNavShadowOpacity,
    shadowRadius: theme.bottomNavShadowRadius,
    elevation: theme.bottomNavElevation,
    borderTopWidth: Platform.OS === 'android' && theme.bottomNavElevation === 0 ? 1 : (Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0),
    borderTopColor: theme.bottomNavBorderTopColor,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  activeIcon: {
    tintColor: theme.activeIconTint,
  },
  inactiveIcon: {
    tintColor: theme.inactiveIconTint,
  },
  navTextActive: {
    color: theme.activeNavText,
    fontSize: 10,
    marginTop: 4,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  navText: {
    color: theme.inactiveNavText,
    fontSize: 10,
    marginTop: 4,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const MyOrders = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkThemeColors : lightThemeColors;
  const styles = createMyOrdersStyles(theme);

  const [orderDate, setOrderDate] = useState('');

  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);
  const input5Ref = useRef(null);

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
          <View style={styles.transactionsSection}>
            <Text style={styles.sectionTitle}>My Orders Details</Text>

            <View style={styles.bankBox}>
              <Text style={styles.bankLinkedLabel}>Order ID</Text>
              <TextInput
                 ref={input1Ref}
                 style={styles.input}
                 placeholder="Display Order ID"
                 placeholderTextColor={theme.inputPlaceholderText}
                 returnKeyType="next"
                 onSubmitEditing={() => {
                  input2Ref.current?.focus();
                }}
              />
            </View>
            <View style={styles.bankBox}>
              <Text style={styles.bankLinkedLabel}>Order Date</Text>
              <TextInput
                 ref={input2Ref}
                 style={styles.input}
                 placeholder="Display Order Date"
                 placeholderTextColor={theme.inputPlaceholderText}
                 returnKeyType="next"
                 value={orderDate}
                 onChangeText={setOrderDate}
                 editable={false}
                 onSubmitEditing={() => {
                  input3Ref.current?.focus();
                }}
              />
            </View>
            <View style={styles.bankBox}>
              <Text style={styles.bankLinkedLabel}>Amount Paid</Text>
              <TextInput
                ref={input3Ref}
                 style={styles.input}
                 placeholder="Display Amount Paid"
                 placeholderTextColor={theme.inputPlaceholderText}
                 keyboardType="numeric"
                 returnKeyType="next"
                 onSubmitEditing={() => {
                  input4Ref.current?.focus();
                }}
              />
            </View>
            <View style={styles.bankBox}>
              <Text style={styles.bankLinkedLabel}>Payment Method</Text>
              <TextInput
                ref={input4Ref}
                 style={styles.input}
                 placeholder="Display Payment Method"
                 placeholderTextColor={theme.inputPlaceholderText}
                 returnKeyType="next"
                 onSubmitEditing={() => {
                  input5Ref.current?.focus();
                }}
              />
            </View>
            <View style={styles.bankBox}>
              <Text style={styles.bankLinkedLabel}>Order Status (Completed/Pending/Failed)</Text>
              <TextInput
                ref={input5Ref}
                 style={styles.input}
                 placeholder="Display Order Status"
                 placeholderTextColor={theme.inputPlaceholderText}
                 returnKeyType="done"
              />
            </View>
            <View style={styles.bankBox}>
              <Text style={styles.bankLinkedLabel}>Invoice Download Option</Text>
              <TouchableOpacity style={styles.downloadButton}>
                 <Text style={styles.downloadButtonText}>Download Invoice</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MyOrders;
