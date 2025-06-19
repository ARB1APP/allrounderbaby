import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  BackHandler,
  StatusBar,
  useColorScheme,
  // useColorScheme // Removed useColorScheme import
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

// --- Hardcoded Style Values (Based on previous lightColors) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f2f2', // Hardcoded background
  },
  scrollContainer: {
     flexGrow: 1,
     paddingBottom: 90,
     paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 25,
    color: '#000000',   // Hardcoded heading color
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000', // Hardcoded heading color
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 15,
    color: '#333333', // Hardcoded paragraph text color
    lineHeight: 23,
    marginBottom: 15,
    textAlign: 'justify',
  },
  // --- Bottom Nav Styles (Hardcoded based on light mode) ---
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Hardcoded nav background
    paddingVertical: 10,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000', // Hardcoded shadow color
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2, // Hardcoded light mode shadow opacity
    shadowRadius: 10, // Hardcoded light mode shadow radius
    elevation: 10, // Hardcoded light mode elevation
    borderTopWidth: 0, // No top border in light mode equivalent
    // borderTopColor: '#ccc', // Not needed
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
    tintColor: 'rgba(20, 52, 164, 1)', // Hardcoded active tint
  },
  inactiveIcon: {
    tintColor: 'gray', // Hardcoded inactive tint
  },
  navTextActive: {
    color: 'rgba(20, 52, 164, 1)', // Hardcoded active text color
    fontSize: 10,
    marginTop: 4,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  navText: {
    color: 'gray', // Hardcoded inactive text color
    fontSize: 10,
    marginTop: 4,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
// --- End of Styles ---


const PrivacyPolicy = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#2a3144' : Colors.white,
  };
  // --- Placeholder Privacy Policy Content ---
  const policyContent = [
    { type: 'header', text: 'Introduction' },
    { type: 'paragraph', text: 'Welcome to Allrounderbaby.com. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.' },
    { type: 'header', text: 'Information We Collect' },
    { type: 'paragraph', text: 'We collect personal information that you voluntarily provide to us when registering at the App, expressing an interest in obtaining information about us or our products and services, when participating in activities on the App or otherwise contacting us.' },
    { type: 'paragraph', text: 'The personal information that we collect depends on the context of your interactions with us and the App, the choices you make and the products and features you use. The personal information we collect can include the following: Name, Email Address, Phone Number, Child\'s Information (if provided), Payment Data (processed securely by third parties).' },
    { type: 'header', text: 'How We Use Your Information' },
    { type: 'paragraph', text: 'We use personal information collected via our App for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.' },
    // Add more sections: Sharing Your Information, Security, Your Rights, Contact Us etc.
  ];
  // --- End Placeholder Content ---

     useEffect(() => {
            const backAction = () => {
                console.log('Hardware back press detected');
                if (navigation.canGoBack()) {
                    console.log('Navigating back');
                    navigation.navigate('My Profile');
                } else {
                    console.log('Cannot go back, staying on screen or navigating to Home');
                }
                return true;
            };
    
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction
            );
    
            return () => {
                console.log('Removing back handler');
                backHandler.remove();
                StatusBar.setHidden(false);
            };
        }, [navigation]);

  return (
    // Use hardcoded styles directly
    <View style={[styles.container, backgroundStyle]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={[styles.title, { color: isDarkMode ? Colors.white : Colors.black }]}>Privacy Policy</Text>

        {/* Render the policy content using hardcoded styles */}
        {policyContent.map((item, index) => {
          if (item.type === 'header') {
            return <Text key={index} style={[styles.sectionHeader, { color: isDarkMode ? Colors.white : Colors.black }]}>{item.text}</Text>;
          } else if (item.type === 'paragraph') {
            return <Text key={index} style={[styles.paragraph, { color: isDarkMode ? '#bcb9b9' : Colors.black }]}>{item.text}</Text>;
          }
          return null;
        })}

      </ScrollView>
    </View>
  );
};


export default PrivacyPolicy;