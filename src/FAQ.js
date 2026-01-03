import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f2f2',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 90,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 25,
    color: '#000000',
  },
  faqItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 0,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    lineHeight: 22,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
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
    tintColor: 'rgba(20, 52, 164, 1)',
  },
  inactiveIcon: {
    tintColor: 'gray',
  },
  navTextActive: {
    color: 'rgba(20, 52, 164, 1)',
    fontSize: 10,
    marginTop: 4,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  navText: {
    color: 'gray',
    fontSize: 10,
    marginTop: 4,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const FAQ = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#2a3144' : '#f1f2f2',
  };

  const faqData = [
    { q: 'How does the Cashback for Feedback work?', a: 'Submit genuine feedback through our website form. Our team reviews it, and if approved based on quality, you receive cashback up to ₹1,000 (or specified amount) within 1-60 days.' },
    { q: 'How does the Refer and Earn program work?', a: 'Share your unique referral code. When someone signs up using your code and completes the required action (e.g., makes a purchase, subscribes), you both earn rewards as specified in the program terms.' },
    { q: 'How long does payment processing take?', a: 'Payments for cashback or referrals can take between 1 to 60 days to process and be transferred to your registered bank account.' },
    { q: 'Can I change my bank account details?', a: 'Yes, you can update your bank account details through the profile section on our website.' },
    { q: 'Are there charges for international payments?', a: 'Yes, if you receive payments in currencies like USD or EUR, standard bank transaction fees and currency conversion charges will apply. The final amount received will reflect these deductions.' },
    { q: 'Is the earned money taxable?', a: 'Yes, cashback and referral earnings are considered income and are subject to taxation according to your country\'s laws. For Indian residents, TDS may be applicable. Please consult a tax advisor for details.' },
  ];

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Frequently Asked Questions</Text>

        {faqData.map((item, index) => (
          <View key={index} style={[styles.faqItem, { backgroundColor: isDarkMode ? '#3d4450' : '#FFFFFF' }]}>
            <Text style={[styles.faqQuestion, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Q: {item.q}</Text>
            <Text style={[styles.faqAnswer, { color: isDarkMode ? '#CBD5E0' : '#4A5568' }]}>A: {item.a}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FAQ;
