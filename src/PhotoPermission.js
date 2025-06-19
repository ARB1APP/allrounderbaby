import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  // useColorScheme, // Removed useColorScheme import
  Linking, // Import Linking to open app settings
  Platform, // To potentially tailor settings link
  BackHandler,
  StatusBar
} from 'react-native';
// If you plan to actually request permissions, you'll need a library like:
// import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

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
     justifyContent: 'center',
     alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#000000',   // Hardcoded text color
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
  },
  explanationCard: {
    backgroundColor: '#ffffff', // Hardcoded card background
    borderRadius: 12,
    paddingVertical: 35,
    paddingHorizontal: 25,
    width: '100%',
    alignItems: 'center',
    elevation: 5, // Hardcoded light mode elevation
    shadowColor: '#000', // Hardcoded shadow color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, // Hardcoded light mode shadow opacity
    shadowRadius: 5, // Hardcoded light mode shadow radius
  },
  permissionIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 25,
    // Optional tint for template icons:
    // tintColor: 'rgba(20, 52, 164, 1)', // Hardcoded active tint
  },
  explanationText: {
    fontSize: 15,
    color: '#555555', // Hardcoded secondary text color
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 15,
  },
  permissionButton: {
    backgroundColor: 'rgba(20, 52, 164, 1)', // Hardcoded button background
    paddingVertical: 13,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    marginBottom: 15,
    width: '90%',
    alignItems: 'center',
  },
  permissionButtonText: {
    color: '#ffffff', // Hardcoded button text color
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsLink: {
      fontSize: 14,
      color: 'rgba(20, 52, 164, 1)', // Hardcoded link color
      textDecorationLine: 'underline',
      marginTop: 10,
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


const PhotoPermission = ({ navigation }) => {
  // Removed colorScheme, isDarkMode, colors, and getStyles call

  // --- Placeholder Function for Requesting Permission ---
  const handleRequestPermission = async () => {
    console.log("Attempting to request photo permission...");
    // IMPORTANT: Implement actual permission request logic here
    alert("Please grant Photo Library access in your device Settings.");
    Linking.openSettings(); // Open settings directly
  };

  // --- Function to Open App Settings ---
  const openAppSettings = () => {
    Linking.openSettings();
  };

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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Photo Library Access Needed</Text>

        {/* Explanation Card */}
        <View style={styles.explanationCard}>
            <Image
                 source={require('../img/picture.png')}
                 style={styles.permissionIcon}
            />
           <Text style={styles.explanationText}>
             To upload a profile picture or share photos within the app, we need your permission to access the photo library.
           </Text>
           <Text style={styles.explanationText}>
             We value your privacy and will only access photos when you choose to upload them.
           </Text>

            {/* Action Buttons */}
            <TouchableOpacity style={styles.permissionButton} onPress={handleRequestPermission}>
                 <Text style={styles.permissionButtonText}>Allow Photo Access</Text>
             </TouchableOpacity>
            <TouchableOpacity onPress={openAppSettings}>
               <Text style={styles.settingsLink}>Open Settings</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};


export default PhotoPermission;