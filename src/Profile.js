import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Dimensions, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { CommonActions } from '@react-navigation/native'; // Import CommonActions for navigation reset

const screenWidth = Dimensions.get('window').width;

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

  /**
   * Handles the logout process.
   * Clears user authentication data from AsyncStorage and navigates to the Login screen.
   */
  const handleLogout = async () => {
      try {
          // Clear user-specific data from AsyncStorage
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('userId');
          console.log('User session data cleared from AsyncStorage.');

          // Reset the navigation stack to only include the 'Login' screen
          navigation.dispatch(
              CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
              })
          );
      } catch (error) {
          console.error('Error during logout process:', error);
          // In a real application, you might want to show a user-friendly alert here
          // For example: Alert.alert("Logout Failed", "Could not clear session data. Please try again.");
      }
  };

  const ListItem = ({ iconSource, title, subtitle, onPress, isLast, showArrow = true, titleColor }) => (
    <TouchableOpacity onPress={onPress} style={styles.listItemWrapper}>
        <View style={styles.listItemRow}>
            <View style={styles.listItemMainContent}>
                <Image source={iconSource} style={[styles.listItemIcon, { tintColor: theme.icon }]} />
                <View style={styles.listItemTextContainer}>
                    <Text style={[styles.listItemTitle, { color: titleColor || theme.textPrimary }]}>{title}</Text>
                    {subtitle && <Text style={[styles.listItemSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>}
                </View>
            </View>
            {showArrow && <Image source={require('../img/arrowicon.png')} style={[styles.arrowicon, { tintColor: theme.textTertiary }]} />}
        </View>
        {!isLast && <View style={[styles.separator, { backgroundColor: theme.border }]} />}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>My Profile</Text>
          <TouchableOpacity style={[styles.pointButton, { backgroundColor: theme.pointsBackground }]}>
            <Image source={require('../img/pointBtn.png')} style={[styles.pointButtonIcon
            ]} />
            <Text style={[styles.pointButtonText, { color: theme.pointsText }]}>0</Text>
          </TouchableOpacity>
        </View>

        {/* User Info Card */}
        <TouchableOpacity 
            style={[
                styles.card, 
                { 
                    backgroundColor: theme.card, 
                    flexDirection: 'row', // Added
                    alignItems: 'center', // Added
                    justifyContent: 'space-between' // Added
                }
            ]}
        >
            <View style={styles.userInfoContainer}>
                <View style={[styles.avatar, { backgroundColor: theme.avatarBackground }]}>
                    <Text style={[styles.avatarText, { color: theme.avatarText }]}>AB</Text>
                </View>
                <View style={styles.userInfoTextContainer}>
                    <Text style={[styles.userName, { color: theme.textPrimary }]}>allrounderbaby185033</Text>
                    <View style={styles.levelBadgeContainer}>
                        <Image source={require('../img/two.png')} style={styles.levelBadgeIcon} />
                        <Text style={[styles.levelBadgeText, { color: theme.textSecondary }]}>Committed Parent</Text>
                        <View style={[styles.levelIndicator, { backgroundColor: theme.levelBadgeBackground }]}>
                            <Text style={[styles.levelIndicatorText, { color: theme.levelBadgeText }]}>L2</Text>
                        </View>
                    </View>
                </View>
            </View>
            <Image source={require('../img/arrowicon.png')} style={[styles.arrowicon, { tintColor: theme.textTertiary }]} />
        </TouchableOpacity>

        {/* Parent Info Card */}
        <TouchableOpacity 
            style={[
                styles.card, 
                { 
                    backgroundColor: theme.card,
                    flexDirection: 'row', // Added
                    alignItems: 'center', // Added
                    justifyContent: 'space-between' // Added
                }
            ]}
        >
            <View style={styles.parentInfoDetailContainer}> {/* Changed from userInfoContainer to avoid style conflicts if any, or ensure userInfoContainer is generic enough */}
                <Image source={require('../img/user.png')} style={[styles.infoIcon, { tintColor: theme.primary }]} />
                <View style={styles.userInfoTextContainer}> {/* Can be reused if structure is similar */}
                    <Text style={[styles.infoTitle, { color: theme.textPrimary }]}>Parent Name</Text>
                    <Text style={[styles.infoSubtitle, { color: theme.textSecondary }]}>Girl / Boy</Text>
                </View>
            </View>
            <Image source={require('../img/arrowicon.png')} style={[styles.arrowicon, { tintColor: theme.textTertiary }]} />
        </TouchableOpacity>

        {/* My Referrals Link */}
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

        {/* Settings Card */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.sectionTitle }]}>Settings</Text>
          <ListItem iconSource={require('../img/bell.png')} title="My Notifications" onPress={() => navigation.navigate('My Notifications')} />
          <ListItem iconSource={require('../img/earningmoney.png')} title="My Earnings" onPress={() => navigation.navigate('My Earnings')} />
          <ListItem iconSource={require('../img/cart.png')} title="My Orders" onPress={() => navigation.navigate('My Orders')} isLast={true} />
        </View>

        {/* Help and Support Card */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.sectionTitle }]}>Help and Support</Text>
          <ListItem 
            iconSource={require('../img/help.png')} 
            title="Get Help" 
            subtitle="Chat With Support" 
            onPress={() => navigation.navigate('Get Help')} 
            isLast={true}
          />
        </View>
        
        {/* Other Links Card */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <ListItem iconSource={require('../img/starfive.png')} title="Rate us 5 stars on the store" onPress={() => navigation.navigate('Rate us 5 stars on the store')} />
          <ListItem iconSource={require('../img/pr.png')} title="Terms of Service" onPress={() => navigation.navigate('Terms of Service')} />
          <ListItem iconSource={require('../img/tm.png')} title="Privacy Policy" onPress={() => navigation.navigate('Privacy Policy')} />
          <ListItem iconSource={require('../img/infoV.png')} title="App Version" onPress={() => navigation.navigate('App Version')} isLast={true} />
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
            style={[styles.logoutButton, { backgroundColor: isDarkMode ? theme.danger : theme.danger }]}
            onPress={handleLogout} 
        >
            <Image source={require('../img/logoutbtn.png')} style={[styles.logoutIcon, { tintColor: isDarkMode ? AppColors.dark.textPrimary : AppColors.light.card }]} />
            <Text style={[styles.logoutText, { color: isDarkMode ? AppColors.dark.textPrimary : AppColors.light.card }]}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { backgroundColor: theme.bottomNavBackground, borderTopColor: theme.border }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
            <Image source={require('../img/hometab.png')} style={[styles.navIcon, { tintColor: theme.bottomNavInactiveTint }]} />
            <Text style={[styles.navText, { color: theme.bottomNavInactiveTint }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Cashback for Feedback')}>
            <Image source={require('../img/feedbacktab.png')} style={[styles.navIcon, { tintColor: theme.bottomNavInactiveTint }]} />
            <Text style={[styles.navText, { color: theme.bottomNavInactiveTint, textAlign: 'center' }]}>Cashback</Text>
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
    paddingBottom: 80,
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
  // User Info specific container (left part of the card)
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Allow it to take space if the card is a row
    marginRight: 10, // Space before the arrow in the card
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
  userInfoTextContainer: { // Contains username/level or parent name/gender
    flex: 1, // Allows text to take available space
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
  // Parent Info specific container (left part of the card)
  parentInfoDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Allow it to take space if the card is a row
    marginRight: 10, // Space before the arrow in the card
  },
  infoIcon: { // Icon for Parent Name
      width: 40, 
      height: 40,
      marginRight: 15,
  },
  infoTitle: { // Parent Name
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 2,
      fontFamily: 'Lexend-VariableFont_wght',
  },
  infoSubtitle: { // Girl / Boy
      fontSize: 13,
      fontFamily: 'Lexend-VariableFont_wght',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    paddingHorizontal: 5, 
    fontFamily: 'Lexend-VariableFont_wght',
  },
  // ListItem styles
  listItemWrapper: {
    // No specific padding here, padding will be on listItemRow
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 5, // Inner padding for items within cards if needed
  },
  listItemMainContent: { // Container for icon and text
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Crucial for pushing arrow to the right
    marginRight: 10, // Space between text content and arrow
  },
  listItemIcon: {
    width: 24,
    height: 24,
    marginRight: 15,
    resizeMode: 'contain',
  },
  listItemTextContainer: { // Holds title and subtitle
    flex: 1, // Allows text to wrap or fill space correctly
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
    // Margin to align with the start of the text in listItemMainContent
    // Considers listItemRow's paddingHorizontal (5) + listItemIcon width (24) + listItemIcon marginRight (15)
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
    paddingVertical: 10,
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  navItem: { alignItems: 'center', flex: 1, paddingVertical: 5 },
  navIcon: { width: 24, height: 24, resizeMode: 'contain', marginBottom: 4 },
  navText: { fontSize: 10, fontWeight: '500', fontFamily: 'Lexend-VariableFont_wght',},
  navTextActive: { fontSize: 10, fontWeight: '700', fontFamily: 'Lexend-VariableFont_wght', },
});
export default Profile;
