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
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f2f2',
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
    color: '#000000',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 23,
    marginBottom: 15,
    textAlign: 'justify',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    borderTopWidth: 0,
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

const PrivacyPolicy = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#2a3144' : Colors.white,
  };
  const policyContent = [
    { type: 'header', text: 'Introduction' },
    { type: 'paragraph', text: 'Welcome to Allrounderbaby.com. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.' },
    { type: 'header', text: 'Information We Collect' },
    { type: 'paragraph', text: 'We collect personal information that you voluntarily provide to us when registering at the App, expressing an interest in obtaining information about us or our products and services, when participating in activities on the App or otherwise contacting us.' },
    { type: 'paragraph', text: 'The personal information that we collect depends on the context of your interactions with us and the App, the choices you make and the products and features you use. The personal information we collect can include the following: Name, Email Address, Phone Number, Child\'s Information (if provided), Payment Data (processed securely by third parties).' },
    { type: 'header', text: 'How We Use Your Information' },
    { type: 'paragraph', text: 'We use personal information collected via our App for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.' },
  ];

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
    <View style={[styles.container, backgroundStyle]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={[styles.title, { color: isDarkMode ? Colors.white : Colors.black }]}>Privacy Policy</Text>

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
