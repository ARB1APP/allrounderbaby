import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  // useColorScheme // Removed useColorScheme
} from 'react-native';

// --- Hardcoded Style Values (Based on previous lightColors) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f2f2', // Hardcoded background
  },
  scrollContainer: {
     flexGrow: 1,
     paddingBottom: 90, // Increased padding to ensure last FAQ isn't hidden
     paddingHorizontal: 15, // Add horizontal padding
  },
  title: { // Main page title/header
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 25,
    color: '#000000',   // Hardcoded text color
  },
  faqItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#ffffff', // Hardcoded card background
    borderRadius: 8,
    borderWidth: 0, // No border in light mode equivalent
    // borderColor: '#ccc', // Not needed if borderWidth is 0
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333', // Hardcoded question color
    marginBottom: 8,
    lineHeight: 22,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#555555', // Hardcoded answer color
    lineHeight: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Hardcoded nav background
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000', // Hardcoded shadow color
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2, // Hardcoded light mode shadow opacity
    shadowRadius: 10, // Hardcoded light mode shadow radius
    elevation: 10, // Hardcoded light mode elevation
    // borderTopWidth: 0, // No top border in light mode equivalent
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


const FAQ = ({ navigation }) => {
  // Removed colorScheme, isDarkMode, colors, and getStyles call

  // Sample FAQ data
  const faqData = [
    { q: 'How does the Cashback for Feedback work?', a: 'Submit genuine feedback through our website form. Our team reviews it, and if approved based on quality, you receive cashback up to ₹1,000 (or specified amount) within 1-60 days.' },
    { q: 'How does the Refer and Earn program work?', a: 'Share your unique referral code. When someone signs up using your code and completes the required action (e.g., makes a purchase, subscribes), you both earn rewards as specified in the program terms.' },
    { q: 'How long does payment processing take?', a: 'Payments for cashback or referrals can take between 1 to 60 days to process and be transferred to your registered bank account.' },
    { q: 'Can I change my bank account details?', a: 'Yes, you can update your bank account details through the profile section on our website.' },
    { q: 'Are there charges for international payments?', a: 'Yes, if you receive payments in currencies like USD or EUR, standard bank transaction fees and currency conversion charges will apply. The final amount received will reflect these deductions.' },
    { q: 'Is the earned money taxable?', a: 'Yes, cashback and referral earnings are considered income and are subject to taxation according to your country\'s laws. For Indian residents, TDS may be applicable. Please consult a tax advisor for details.' },
  ];


  return (
    // Use hardcoded styles directly
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Frequently Asked Questions</Text>

        {faqData.map((item, index) => (
          <View key={index} style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Q: {item.q}</Text>
            <Text style={styles.faqAnswer}>A: {item.a}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};


export default FAQ;