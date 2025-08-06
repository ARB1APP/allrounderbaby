import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Dimensions, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

const AppColors = {
    light: {
        background: '#F4F7FC',
        card: '#FFFFFF',
        textPrimary: '#1A232E',
        textSecondary: '#6A737D',
        textTertiary: '#8A94A6',
        primary: 'rgba(20, 52, 164, 1)',
        accent: '#60b5f6',
        border: '#E9EEF2',
        icon: '#495057',
        danger: '#E40606',
        dangerText: '#FFFFFF',
        pointsBackground: 'rgba(20, 52, 164, 0.1)',
        pointsText: 'rgba(20, 52, 164, 1)',
        levelBadgeBackground: 'rgba(255, 165, 0, 0.15)',
        levelBadgeText: '#D97706',
        avatarBackground: 'rgba(20, 52, 164, 1)',
        avatarText: '#FFFFFF',
        bottomNavBackground: '#FFFFFF',
        bottomNavActiveTint: 'rgba(20, 52, 164, 1)',
        bottomNavInactiveTint: '#ADB5BD',
        sectionTitle: '#333B49',
    },
    dark: {
        background: '#1C222B',
        card: '#2A313C',
        textPrimary: '#E8EDF2',
        textSecondary: '#A0AEC0',
        textTertiary: '#718096',
        primary: '#60b5f6',
        accent: '#60b5f6',
        border: '#3D4450',
        icon: '#CBD5E0',
        danger: '#F04F4F',
        dangerText: '#1C222B',
        pointsBackground: 'rgba(96, 181, 246, 0.2)',
        pointsText: '#60b5f6',
        levelBadgeBackground: 'rgba(251, 211, 141, 0.15)',
        levelBadgeText: '#FBD38D',
        avatarBackground: '#60b5f6',
        avatarText: '#1C222B',
        bottomNavBackground: '#232A37',
        bottomNavActiveTint: '#60b5f6',
        bottomNavInactiveTint: '#718096',
        sectionTitle: '#C1CAD4',
    }
};


const Profile = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? AppColors.dark : AppColors.light;

  const handleLogout = async () => {
      try {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('userId');
          console.log('User session data cleared from AsyncStorage.');

          navigation.dispatch(
              CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
              })
          );
      } catch (error) {
          console.error('Error during logout process:', error);
      }
  };

  const ListItem = ({ iconSource, title, subtitle, onPress, isLast, showArrow = true, titleColor }) => {
    const isSubtitleElement = React.isValidElement(subtitle);

    return (
      <TouchableOpacity onPress={onPress} style={styles.listItemWrapper}>
          <View style={styles.listItemRow}>
              <View style={styles.listItemMainContent}>
                  <Image source={iconSource} style={[styles.listItemIcon, { tintColor: theme.icon }]} />
                  <View style={styles.listItemTextContainer}>
                      <Text style={[styles.listItemTitle, { color: titleColor || theme.textPrimary }]}>{title}</Text>
                      {subtitle !== null && subtitle !== undefined && (
                          isSubtitleElement ? (
                              subtitle
                          ) : (
                              <Text style={[styles.listItemSubtitle, { color: theme.textSecondary }]}>{String(subtitle)}</Text>
                          )
                      )}
                  </View>
              </View>
              {showArrow && <Image source={require('../img/arrowicon.png')} style={[styles.arrowicon, { tintColor: theme.textTertiary }]} />}
          </View>
          {!isLast && <View style={[styles.separator, { backgroundColor: theme.border }]} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>My Profile</Text>
          {/* <TouchableOpacity style={[styles.pointButton, { backgroundColor: theme.pointsBackground }]}>
            <Image source={require('../img/pointBtn.png')} style={[styles.pointButtonIcon
            ]} />
            <Text style={[styles.pointButtonText, { color: theme.pointsText }]}>0</Text>
          </TouchableOpacity> */}
        </View>

        {/* <TouchableOpacity
            style={[
                styles.card,
                {
                    backgroundColor: theme.card,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }
            ]}
        >
            <View style={styles.userInfoContainer}>
                <View style={[styles.avatar, { backgroundColor: theme.avatarBackground }]}>
                    <Text style={[styles.avatarText, { color: theme.avatarText }]}>AB</Text>
                </View>
                <View style={styles.userInfoTextContainer}>
                    <Text style={[styles.userName, { color: theme.textPrimary }]}>AllrounderBaby (Name)</Text>
                </View>
            </View>
            <Image source={require('../img/arrowicon.png')} style={[styles.arrowicon, { tintColor: theme.textTertiary }]} />
        </TouchableOpacity> */}

        {/* <TouchableOpacity
            style={[
                styles.card,
                {
                    backgroundColor: theme.card,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }
            ]}
        >
            <View style={styles.parentInfoDetailContainer}>
                <Image source={require('../img/user.png')} style={[styles.infoIcon, { tintColor: theme.primary }]} />
                <View style={styles.userInfoTextContainer}>
                    <Text style={[styles.infoTitle, { color: theme.textPrimary }]}>Parent Name</Text>
                    <Text style={[styles.infoSubtitle, { color: theme.textSecondary }]}>Visionary Parent</Text>
                </View>
            </View>
            <Image source={require('../img/arrowicon.png')} style={[styles.arrowicon, { tintColor: theme.textTertiary }]} />
        </TouchableOpacity> */}

        <TouchableOpacity
            style={[styles.card, { backgroundColor: theme.card, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
            onPress={() => navigation.navigate('My Referrals')}
        >
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image source={require('../img/three-dots.png')} style={[styles.listItemIcon, { tintColor: theme.icon, marginRight: 15 }]} />
                <Text style={[styles.listItemTitle, { color: theme.textPrimary }]}>My Referrals</Text>
            </View>
            <Image source={require('../img/arrowicon.png')} style={[styles.arrowicon, { tintColor: theme.textTertiary }]} />
        </TouchableOpacity>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.sectionTitle }]}>Settings</Text>
          <ListItem iconSource={require('../img/bell.png')} title="My Notifications" onPress={() => navigation.navigate('My Notifications')} />

        <ListItem
            iconSource={require('../img/earningmoney.png')}
            title="My Earnings"
            subtitle={
              <View style={{ alignItems: 'center' }}>
                <Text
                  style={[
                    styles.infoSubtitle,
                    {
                      color: theme.textSecondary,
                      fontSize: 14,
                      textAlign: 'center',
                    },
                  ]}
                >
                  Refer more, Earn more !!
                </Text>
              </View>
            }
            onPress={() => navigation.navigate('My Earnings')}
          />

      <ListItem
          iconSource={require('../img/cart.png')}
          title="My Orders"
          subtitle={
            <View style={{ alignItems: 'center' }}>
              <Text
                style={[
                  styles.infoSubtitle,
                  {
                    color: theme.textSecondary,
                    fontSize: 14,
                    textAlign: 'center',
                  },
                ]}
              >
                View order history
              </Text>
            </View>
          }
          onPress={() => navigation.navigate('My Orders')}
        />
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.sectionTitle }]}>Help and Support</Text>
       <ListItem
          iconSource={require('../img/help.png')}
          title="Get Help"
          subtitle={
            <View style={{ alignItems: 'center' }}>
              <Text
                style={[
                  styles.infoSubtitle,
                  {
                    color: theme.textSecondary,
                    fontSize: 14,
                    textAlign: 'center',
                  },
                ]}
              >
                Chat With Support
              </Text>
            </View>
          }
          onPress={() => navigation.navigate('Get Help')}
          isLast={true}
        />
        </View>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
         <ListItem
            iconSource={require('../img/starfive.png')}
            title="Rate us 5 stars on the store"
            subtitle={
              <View style={{ alignItems: 'center' }}>
                <Text
                  style={[
                    styles.infoSubtitle,
                    {
                      color: theme.textSecondary,
                      fontSize: 15,
                    },
                  ]}
                >
                  Encourage users to leave a positive review
                </Text>
              </View>
            }
            onPress={() => navigation.navigate('Rate us 5 stars on the store')}
          />


          <ListItem iconSource={require('../img/pr.png')} title="Terms of Service" onPress={() => navigation.navigate('Terms of Service')} />
          <ListItem iconSource={require('../img/tm.png')} title="Privacy Policy" onPress={() => navigation.navigate('Privacy Policy')} />
          <ListItem iconSource={require('../img/infoV.png')} title="App Version" onPress={() => navigation.navigate('App Version')} isLast={true} />
        </View>

        <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: isDarkMode ? theme.danger : theme.danger }]}
            onPress={handleLogout}
        >
            <Image source={require('../img/logoutbtn.png')} style={[styles.logoutIcon, { tintColor: isDarkMode ? AppColors.dark.textPrimary : AppColors.light.card }]} />
            <Text style={[styles.logoutText, { color: isDarkMode ? AppColors.dark.textPrimary : AppColors.light.card }]}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>

      <View style={[styles.bottomNav, { backgroundColor: theme.bottomNavBackground, borderTopColor: theme.border }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
            <Image source={require('../img/hometab.png')} style={[styles.navIcon, { tintColor: theme.bottomNavInactiveTint }]} />
            <Text style={[styles.navText, { color: theme.bottomNavInactiveTint }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Cashback for Feedback')}>
            <Image source={require('../img/feedbacktab.png')} style={[styles.navIcon, { tintColor: theme.bottomNavInactiveTint }]} />
            <Text style={[styles.navText, { color: theme.bottomNavInactiveTint, textAlign: 'center' }]}>Cashback for Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Refer and Earn')}>
            <Image source={require('../img/money.png')} style={[styles.navIcon, { tintColor: theme.bottomNavInactiveTint }]} />
            <Text style={[styles.navText, { color: theme.bottomNavInactiveTint }]}>Refer & Earn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
            <Image source={require('../img/proflie.png')} style={[styles.navIcon, { tintColor: theme.bottomNavActiveTint }]} />
            <Text style={[styles.navTextActive, { color: theme.bottomNavActiveTint }]}>My Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContentContainer: {
    paddingBottom: 0,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Lexend-VariableFont_wght',
  },
  pointButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pointButtonIcon: {
    width: 18,
    height: 18,
    marginRight: 6,
  },
  pointButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Lexend-VariableFont_wght',
  },
  card: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Lexend-VariableFont_wght',
  },
  userInfoTextContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Lexend-VariableFont_wght',
  },
  levelBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelBadgeIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  levelBadgeText: {
    fontSize: 13,
    fontWeight: '500',
    marginRight: 8,
    fontFamily: 'Lexend-VariableFont_wght',
  },
  levelIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  levelIndicatorText: {
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Lexend-VariableFont_wght',
  },
  arrowicon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  parentInfoDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  infoIcon: {
      width: 40,
      height: 40,
      marginRight: 15,
  },
    infoIcons: {
      width: 20,
      height: 20,
      marginLeft: 10,
      marginRight: 15,
  },
  infoTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 2,
      fontFamily: 'Lexend-VariableFont_wght',
  },
  infoSubtitle: {
      fontSize: 13,
      fontFamily: 'Lexend-VariableFont_wght',
      marginLeft: '10%',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    paddingHorizontal: 5,
    fontFamily: 'Lexend-VariableFont_wght',
  },
  listItemWrapper: {
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 5,
  },
  listItemMainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  listItemIcon: {
    width: 24,
    height: 24,
    marginRight: 15,
    resizeMode: 'contain',
  },
  listItemTextContainer: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Lexend-VariableFont_wght',
  },
  listItemSubtitle: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: 'Lexend-VariableFont_wght',
  },
  separator: {
    height: 1,
    marginLeft: 5 + 24 + 15,
    marginVertical: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  logoutIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Lexend-VariableFont_wght',
  },
    bottomNav: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            backgroundColor: '#fff',
            paddingVertical: 10,
            bottom: 0,
            width: '100%',
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 20,
            elevation: 5,},
            navItem: {
            alignItems: 'center',
            paddingVertical: 5,
        },
        navIcon: {
            width: 24,
            height: 24,
            resizeMode: 'contain',
            marginBottom: 4,
        },
   navText: {
    color: 'gray',
    fontSize: 10,
    marginTop: 4,
    fontWeight: 'bold',
    },
  navTextActive: { fontSize: 10, fontWeight: '700', fontFamily: 'Lexend-VariableFont_wght', },
});
export default Profile;
