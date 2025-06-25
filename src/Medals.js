import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
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
     alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
    color: '#000000',
  },
  placeholderContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  placeholderText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    lineHeight: 22,
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

const Medals = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Your Medals 🏅</Text>

        <View style={styles.placeholderContainer}>
           <Text style={styles.placeholderText}>
             You haven't earned any medals yet. Keep participating to collect them!
           </Text>
        </View>
      </ScrollView> 
    </View>
  );
};

export default Medals;
