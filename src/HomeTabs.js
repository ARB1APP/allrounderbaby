import React, { useEffect } from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../src/Dashboard';
import ChasCashbackforFeedback from '../src/CashbackforFeedback';
import ReferAndEarn from '../src/ReferAndEarn';
import Profile from '../src/Profile';
const Tab = createBottomTabNavigator();

const HomeTabs = () => {

  const [otp, setOtp] = useState(null);
  const [playbackInfo, setPlaybackInfo] = useState(null);

  useEffect(() => {
    const fetchVdoCipherData = async () => {
      
      try {
        const videoId = "c88fb7568e814d0e852f74387fe9aa61";
        const response = await fetch(`https://dev.vdocipher.com/api/videos/${videoId}`); 
        const data = await response.json();
        setOtp(data.otp);
        setPlaybackInfo(data.playbackInfo);
      } catch (error) {
        console.error('Error fetching VdoCipher data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVdoCipherData();
  }, [videoId]);

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