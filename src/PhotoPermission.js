import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
  BackHandler,
  StatusBar
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f2f2',
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
    color: '#000000',
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
  },
  explanationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 35,
    paddingHorizontal: 25,
    width: '100%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  permissionIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 25,
  },
  explanationText: {
    fontSize: 15,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 15,
  },
  permissionButton: {
    backgroundColor: 'rgba(20, 52, 164, 1)',
    paddingVertical: 13,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    marginBottom: 15,
    width: '90%',
    alignItems: 'center',
  },
  permissionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsLink: {
      fontSize: 14,
      color: 'rgba(20, 52, 164, 1)',
      textDecorationLine: 'underline',
      marginTop: 10,
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

const PhotoPermission = ({ navigation, route }) => {
  const handleRequestPermission = async () => {
    alert("Please grant Photo Library access in your device Settings.");
    Linking.openSettings();
  };

  const openAppSettings = () => {
    Linking.openSettings();
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
              StatusBar.setHidden(false);
          };
      }, [navigation]);
      
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Photo Library Access Needed</Text>

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
