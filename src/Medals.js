import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  // useColorScheme // Removed useColorScheme import
} from 'react-native';

// --- Hardcoded Style Values (Based on previous lightColors) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f2f2', // Hardcoded background
  },
  scrollContainer: {
     flexGrow: 1,
     paddingBottom: 90, // Ensure content visible above nav bar
     paddingHorizontal: 20, // Add horizontal padding
     alignItems: 'center', // Center content horizontally
  },
  title: { // Main page title/header
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30, // More space before content
    color: '#000000',   // Hardcoded text color
  },
  placeholderContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  placeholderText: {
    fontSize: 16,
    color: 'gray', // Hardcoded secondary text color
    textAlign: 'center',
    lineHeight: 22,
  },
  // Example Styles for actual medals (uncomment and adapt if needed)
  /*
  medalsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center', // Or 'space-around'
      marginTop: 20,
  },
  medalItem: {
      alignItems: 'center',
      margin: 15,
      width: 100, // Adjust as needed
  },
  medalImage: {
      width: 60,
      height: 60,
      resizeMode: 'contain',
      marginBottom: 8,
  },
  medalName: {
      fontSize: 12,
      color: '#000000', // Hardcoded text color
      textAlign: 'center',
  },
  */
  // --- Bottom Nav Styles (Hardcoded based on light mode) ---
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Hardcoded nav background
    paddingVertical: 10,
    position: 'absolute', // Keep nav at bottom
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
    flex: 1, // Ensure items share space
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


const Medals = ({ navigation }) => {
  // Removed colorScheme, isDarkMode, colors, and getStyles call

  return (
    // Use hardcoded styles directly
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Your Medals 🏅</Text>

        {/* Placeholder for Medals content */}
        <View style={styles.placeholderContainer}>
           <Text style={styles.placeholderText}>
             You haven't earned any medals yet. Keep participating to collect them!
           </Text>
        </View>
         {/* Example of how medals might look (uncomment and adapt if needed) */}
         {/*
         <View style={styles.medalsGrid}>
             <View style={styles.medalItem}>
                 <Image source={require('../img/medal_icon_1.png')} style={styles.medalImage} />
                 <Text style={styles.medalName}>Feedback Champion</Text>
             </View>
             <View style={styles.medalItem}>
                  <Image source={require('../img/medal_icon_2.png')} style={styles.medalImage} />
                 <Text style={styles.medalName}>Referral Star</Text>
             </View>
             { // Add more medal items }
         </View>
         */}

      </ScrollView> 
    </View>
  );
};


export default Medals;