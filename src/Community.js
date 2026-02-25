import React from 'react';
import { StyleSheet, Text, View, ScrollView, StatusBar, SafeAreaView, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
 
const Community = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#2a3144' : Colors.lighter,
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar barStyle="light-content" backgroundColor="#1434A4" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={[styles.text, { color: isDarkMode ? Colors.white : Colors.black }]}>Community</Text>
      </ScrollView>
    </SafeAreaView>
  );
};
 
const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  text: { 
    fontSize: 20, 
    textAlign: 'center', 
    margin: 10,
  },
});
 
export default Community;