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
  StatusBar, // Import StatusBar
  useColorScheme, // Import useColorScheme
} from 'react-native';
import { format } from 'date-fns';

// --- Theme Colors ---
const lightThemeColors = {
  screenBackground: '#dfe6ff',
  cardBackground: '#ffffff',
  cardBorder: 'transparent', // No border in light mode, elevation is used
  textPrimary: '#000000',
  textSecondary: '#333333', // For input text
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

  // Bottom Nav (if used on this screen)
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

// --- Dynamic Styles ---
const createMyOrdersStyles = (theme) => StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: theme.screenBackground, // Added for consistency
  },
  container: {
    flex: 1,
    backgroundColor: theme.screenBackground,
  },
  scrollContainer: {
     flexGrow: 1,
     paddingBottom: 20, // Adjusted default padding, can be increased if nav bar added
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
    borderColor: theme.cardBorder, // For dark mode primarily
    borderWidth: Platform.OS === 'android' && theme.elevation === 0 ? 1 : 0, // Add border if no elevation (typical for dark mode)
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
    color: theme.textPrimary, // Using textPrimary for labels
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
  // --- Bottom Nav Styles (if you add the JSX for it) ---
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
// --- End of Styles ---


const MyOrders = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkThemeColors : lightThemeColors;
  const styles = createMyOrdersStyles(theme); // Generate styles based on theme

  const [orderDate, setOrderDate] = useState('');

  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);
  const input5Ref = useRef(null);

  // Commented out as per original code, but can be used
  // useEffect(() => {
  //   const today = new Date();
  //   const formattedDate = format(today, 'dd/MM/yyyy');
  //   setOrderDate(formattedDate);
  // }, []);

   useEffect(() => {
    const backAction = () => {
        // console.log('Hardware back press detected');
        if (navigation.canGoBack()) {
            // console.log('Navigating back');
            navigation.navigate('My Profile'); // Or navigation.goBack(); if 'My Profile' is the immediate previous screen
        } else {
            // console.log('Cannot go back, staying on screen or navigating to Home');
            // Potentially navigate to a default screen if no back action is possible
            // navigation.navigate('Home'); // Example
        }
        return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
    );

    return () => {
        // console.log('Removing back handler');
        backHandler.remove();
        // No need to manage StatusBar.setHidden here unless it was explicitly set hidden
    };
  }, [navigation]);

  return (
    // KeyboardAvoidingView style now uses theme.screenBackground
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
                 placeholderTextColor={theme.inputPlaceholderText} // Themed placeholder
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
                 placeholderTextColor={theme.inputPlaceholderText} // Themed placeholder
                 returnKeyType="next"
                 value={orderDate}
                 onChangeText={setOrderDate} // Added to make it an actual controlled input if needed
                 editable={false} // Assuming this is display-only from your previous `value` use
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
                 placeholderTextColor={theme.inputPlaceholderText} // Themed placeholder
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
                 placeholderTextColor={theme.inputPlaceholderText} // Themed placeholder
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
                 placeholderTextColor={theme.inputPlaceholderText} // Themed placeholder
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
        {/* If you want a bottom navigation bar on this screen, you would add its JSX here */}
        {/* Example:
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
            <Image source={require('./path/to/home_icon.png')} style={[styles.navIcon, styles.inactiveIconOrActive]} />
            <Text style={styles.navTextOrActive}>Home</Text>
          </TouchableOpacity>
          // ... other nav items
        </View>
        */}
      </View>
    </KeyboardAvoidingView>
  );
};


export default MyOrders;