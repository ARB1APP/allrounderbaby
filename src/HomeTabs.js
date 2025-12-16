import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../src/Dashboard';
import ChasCashbackforFeedback from '../src/CashbackforFeedback';
import ReferAndEarn from '../src/ReferAndEarn';
import Profile from '../src/Profile';
const Tab = createBottomTabNavigator();

const HomeTabs = () => {

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let imageSource;
          if (route.name === 'Home') {
            imageSource = require('../img/hometab.png');
          } else if (route.name === 'Cashback for Feedback') {
            imageSource = require('../img/feedbacktab.png');
          } else if (route.name === 'Refer & Earn') {
            imageSource = require('../img/money.png');
          } else if (route.name === 'Profile') {
            imageSource = require('../img/proflie.png');
          }
          return <Image source={imageSource} style={{ width: size, height: size, tintColor: color }} />;
        },
        tabBarActiveTintColor: '#1434A4',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Dashboard} />
      <Tab.Screen name="Cashback for Feedback" component={ChasCashbackforFeedback} />
      <Tab.Screen name="Refer & Earn" component={ReferAndEarn} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};
export default HomeTabs;