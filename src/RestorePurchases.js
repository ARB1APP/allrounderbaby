import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';

const RestorePurchases = ({ navigation }) => { 
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.text}>Restore Purchases</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f2f2',},
  text: { fontSize: 20, textAlign: 'center', margin: 10, },
  bottomNav: {flexDirection: 'row',justifyContent: 'space-around',alignItems: 'center', backgroundColor: '#fff',paddingVertical: 10,bottom: 0, width: '100%',borderTopLeftRadius: 20,borderTopRightRadius: 20,shadowColor: '#000',shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2,shadowRadius: 20,elevation: 5,},
  navItem: { alignItems: 'center', },
  inactive: { opacity: 0.5, },
  navIcon: { width: 25, height: 25, resizeMode: 'contain',},
  navTextActive: { color: 'rgba(20, 52, 164, 1)', fontSize: 10, marginTop: 4, fontWeight:'bold',},
  navText: { color: 'gray', fontSize: 10, marginTop: 4, fontWeight:'bold', },
});

export default RestorePurchases;
