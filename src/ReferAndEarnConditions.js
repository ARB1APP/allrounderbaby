import React, { useState, useEffect } from 'react'; // Added useEffect for BackHandler
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Clipboard,
  Alert,
  useColorScheme,
  Share,
  Platform,
  Pressable,
  StatusBar, // Added StatusBar
  BackHandler, // Added BackHandler
} from 'react-native';
// Removed: import { Colors } from 'react-native/Libraries/NewAppScreen'; // Not needed with custom theming

// --- Theme Colors ---
const lightThemeColors = {
  screenBackground: '#F4F6F8', // Softer white
  cardBackground: '#FFFFFF',
  modalBackground: '#FFFFFF',
  textPrimary: '#1A202C',    // Darker primary text
  textSecondary: '#4A5568',  // Softer secondary text
  textMuted: '#718096',      // For less important text
  textSuccess: '#38A169',    // Success green for code
  primaryAction: 'rgba(20, 52, 164, 1)', // Your original primary
  primaryActionText: '#FFFFFF',
  secondaryActionBorder: '#CBD5E0', // Border for secondary buttons
  secondaryActionText: '#2D3748',
  linkColor: 'rgba(20, 52, 164, 1)',
  borderColor: '#E2E8F0',      // General border color
  iconColor: '#4A5568',
  bottomNavBackground: '#FFFFFF',
  bottomNavActiveTint: 'rgba(20, 52, 164, 1)',
  bottomNavInactiveTint: '#A0AEC0',
  bottomNavShadowColor: '#000000',
  radioButtonBorder: '#CBD5E0',
  radioButtonSelectedBackground: 'rgba(20, 52, 164, 1)',
  modalButtonShareBackground: '#4CAF50', // Your green
  modalButtonShareText: '#FFFFFF',
  modalButtonCloseBackground: '#E2E8F0',
  modalButtonCloseText: '#2D3748',
  overlayBackground: 'rgba(0,0,0,0.6)',
  statusBarContent: 'dark-content',
  elevation: 5,
};

const darkThemeColors = {
  screenBackground: '#1A202C', // Dark blue-gray
  cardBackground: '#2D3748',
  modalBackground: '#2D3748',
  textPrimary: '#E2E8F0',
  textSecondary: '#A0AEC0',
  textMuted: '#718096',
  textSuccess: '#68D391',    // Lighter green for dark mode
  primaryAction: 'rgba(40, 72, 184, 1)', // Slightly brighter primary for dark
  primaryActionText: '#E2E8F0',
  secondaryActionBorder: '#4A5568',
  secondaryActionText: '#CBD5E0',
  linkColor: '#63B3ED',        // Lighter blue for links
  borderColor: '#4A5568',
  iconColor: '#A0AEC0',
  bottomNavBackground: '#2D3748',
  bottomNavActiveTint: '#63B3ED',
  bottomNavInactiveTint: '#718096',
  bottomNavShadowColor: '#000000', // Less visible, border preferred
  radioButtonBorder: '#4A5568',
  radioButtonSelectedBackground: '#63B3ED',
  modalButtonShareBackground: '#38A169', // Darker green
  modalButtonShareText: '#E2E8F0',
  modalButtonCloseBackground: '#4A5568',
  modalButtonCloseText: '#E2E8F0',
  overlayBackground: 'rgba(0,0,0,0.7)',
  statusBarContent: 'light-content',
  elevation: 0, // Prefer borders in dark mode
};

// --- Dynamic Styles ---
const createReferAndEarnConditionsStyles = (theme) => StyleSheet.create({
  // --- Main Container & ScrollView ---
  container: {
    flex: 1,
    backgroundColor: theme.screenBackground,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20, // Space for content, nav bar handled separately
  },
  // --- Typography ---
  titleText: {
    fontSize: 17, // Slightly smaller for balance
    textAlign: 'center',
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 0,
    fontWeight: '600', // Semi-bold
    color: theme.textPrimary,
    lineHeight: 24,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: theme.borderColor,
    marginHorizontal: 20,
    marginVertical: 15,
  },
  referralCodeLabel: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
    color: theme.textSecondary,
    marginTop: 20,
    marginBottom: 10,
  },
  referralCodeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  referralCodeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.textSuccess,
    borderBottomWidth: 2,
    borderStyle: 'dotted',
    borderColor: theme.textSuccess,
    paddingBottom: 2,
    marginRight: 15,
  },
  copyIcon: {
    width: 24,
    height: 24,
    tintColor: theme.iconColor,
  },
  // --- Buttons ---
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: theme.primaryAction,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: theme.elevation / 2, // Subtle shadow
    shadowColor: theme.bottomNavShadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: theme.cardBackground,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.secondaryActionBorder,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonTextPrimary: {
    color: theme.primaryActionText,
    fontWeight: '600',
    fontSize: 15,
  },
  buttonTextSecondary: {
    color: theme.secondaryActionText,
    fontWeight: '600',
    fontSize: 15,
  },
  lastUpdatedText: {
    textAlign: 'center',
    fontSize: 12,
    color: theme.textMuted,
    marginBottom: 20,
  },
  // --- Content Text ---
  contentParagraph: {
    marginHorizontal: 20,
    fontSize: 15,
    lineHeight: 22,
    color: theme.textSecondary,
    marginBottom: 10,
  },
  contentHeader: {
     marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 12,
    fontSize: 24,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  listItem: {
    marginHorizontal: 20,
    fontSize: 15,
    lineHeight: 22,
    color: theme.textSecondary,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: '600', // Use semi-bold for emphasis
    color: theme.textPrimary, // Make bold text stand out more
  },
  linkButton: {
    alignSelf: 'flex-end',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  linkText: {
    color: theme.linkColor,
    textDecorationLine: 'underline',
    fontSize: 15,
    fontWeight: '500',
  },
  // --- Video Links Section ---
  videoLinksContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30, // More space before bottom nav
    backgroundColor: theme.cardBackground,
    borderRadius: 10,
    borderWidth: theme.elevation === 0 ? 1 : 0, // Border for dark mode if no elevation
    borderColor: theme.borderColor,
    elevation: theme.elevation,
    shadowColor: theme.bottomNavShadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  videoLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  videoLinkItemInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoIcon: {
    width: 28,
    height: 28,
   // tintColor: theme.primaryAction, // Use primary color for icons
    marginRight: 12,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.textPrimary,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: theme.iconColor,
  },
  videoItemDivider: {
    height: 1,
    backgroundColor: theme.borderColor,
    marginHorizontal: 15,
  },

  // --- Bottom Navigation ---
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.bottomNavBackground,
    paddingVertical: Platform.OS === 'ios' ? 15 : 10, // Adjust padding for notch
    paddingBottom: Platform.OS === 'ios' ? 25 : 10, // Extra padding for home indicator
    borderTopWidth: 1,
    borderTopColor: theme.borderColor,
    // Shadow for light mode, border handled by borderTopWidth for dark
    shadowColor: theme.bottomNavShadowColor,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: theme.elevation > 0 ? 0.1 : 0,
    shadowRadius: theme.elevation > 0 ? 4 : 0,
    elevation: theme.elevation,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginBottom: 3,
  },
  navText: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  // --- Modal Styles (can be a separate StyleSheet if very large) ---
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.overlayBackground,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Ensure it's on top
  },
  modalView: {
    backgroundColor: theme.modalBackground,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 380,
    alignItems: 'center',
    elevation: 10, // Modal should always have some elevation/shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.textPrimary,
    flex: 1,
  },
  modalCloseButton: {
    padding: 5, // Make touch target larger
  },
  modalCloseIcon: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.iconColor,
  },
  radioGroupTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.textSecondary,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  radioGroupContainer: {
    width: '100%',
    marginBottom: 25,
  },
  radioButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8, // Increased padding for touchability
  },
  radioButtonOuter: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.radioButtonBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioButtonInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: theme.radioButtonSelectedBackground,
  },
  radioButtonLabel: {
    fontSize: 15,
    color: theme.textPrimary,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  modalButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    // elevation for buttons inside modal (subtle)
    elevation: 2,
    shadowColor: theme.bottomNavShadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  modalButtonText: {
    fontWeight: '600',
    fontSize: 15,
  },
  importantDetailsBox: {
    marginHorizontal: 20,
    marginTop: 0, 
    padding: 15,
    backgroundColor: theme.cardBackground, 
    borderRadius: 8,
    borderWidth: theme.elevation === 0 ? 1 : 0,
    borderColor: theme.borderColor,
    elevation: theme.elevation / 2, 
    shadowColor: theme.bottomNavShadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
});


const ReferAndEarnConditions = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkThemeColors : lightThemeColors;
  const styles = createReferAndEarnConditionsStyles(theme);
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const backAction = () => {
        // console.log('Hardware back press detected on Conditions screen');
        if (navigation.canGoBack()) {
            // console.log('Navigating back to Refer and Earn');
            navigation.navigate('Refer and Earn'); // Explicitly navigate back
        } else {
            // console.log('Cannot go back, potentially stay or navigate to Home');
            // This case should ideally not happen if this screen is pushed onto a stack
        }
        return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
        // console.log('Removing back handler from Conditions screen');
        backHandler.remove();
        // StatusBar.setHidden(false); // Only if it was explicitly hidden
    };
  }, [navigation]);
 

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.statusBarContent} backgroundColor={theme.screenBackground} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
             <View style={[styles.importantDetailsBox, { marginTop: 10 }]}>
        <Text style={styles.titleText}>🎉 Refer & Earn – Get ₹3,000 / $30 / €30 + Your Friend Gets 10% Off! 🎉</Text>
        </View>

  <View style={styles.sectionDivider} />
        {/* <Text style={styles.lastUpdatedText}>Last updated: 21st April, 2025</Text> */}

        <View style={styles.importantDetailsBox}>

        <Text style={styles.contentParagraph}>
           We appreciate you sharing <Text style={styles.boldText}>AllrounderBaby.com</Text> 💖.
          with others! 💖 Please read the <Text style={styles.boldText}>detailed process and terms</Text> to understand how your referral rewards work.
        </Text>
        </View>

            <View style={[styles.importantDetailsBox, { marginTop: 20 }]}>

        <Text style={[ styles.contentHeader, { color: isDarkMode ? '#fff' : '#1434a4' } ]}>🔄 How to Refer & Earn?</Text>
            <Text style={styles.listItem}>
                <Text style={styles.boldText}>🟠 1️⃣ Invite Your Friends & Share Your Referral Code 📩</Text>
            </Text>
          <Text style={styles.listItem}>
                <Text style={styles.boldText}>🔗 Find & copy</Text> your referral code from the <Text style={styles.boldText}>Refer & Earn</Text> section of the app.
            </Text>
          <Text style={styles.listItem}>
                <Text style={styles.boldText}>📢 Share it</Text> with your friends, family, and fellow parents via <Text style={styles.boldText}>WhatsApp, Email, or Social Media.</Text>
          </Text>
         <Text style={styles.listItem}>
                <Text style={styles.boldText}>🟡 2️⃣ Your Friend Joins & Unlocks Benefits 🎓</Text>
            </Text>
              <Text style={styles.listItem}>
                💳 They must <Text style={styles.boldText}>purchase the program using your unique referral code</Text> and will receive <Text style={styles.boldText}>10% OFF!</Text>
            </Text>
            <Text style={styles.listItem}>
                ✅ A referral is <Text style={styles.boldText}>valid only if payment is successful –</Text> No discounts, refunds, or cancellations beyond the 10% referral discount.
            </Text>
         <Text style={styles.listItem}>
                <Text style={styles.boldText}>🟢 3️⃣ Your Earnings – ₹3,000 / $30 / €30 💰🎉</Text>
            </Text>
            <Text style={styles.listItem}>
                🎁 Once your friend’s payment is verified, <Text style={styles.boldText}>your referral reward is processed.</Text>
            </Text>
            <Text style={styles.listItem}>
                <Text style={styles.boldText}>✅ You earn every time</Text> someone uses your code to make a purchase!
            </Text>
</View>
        <View style={styles.sectionDivider} />

            <View style={styles.importantDetailsBox}>

       <Text style={[ styles.contentHeader, { color: isDarkMode ? '#fff' : '#1434a4' } ]}>💳 Payment Processing & Bank Details</Text>
        <Text style={styles.listItem}>
            🔹 Your reward will be credited to the <Text style={styles.boldText}>same bank account used for your initial program payment.</Text>
        </Text>
        <Text style={styles.listItem}>🔹 Need to change it? Visit our website to update your account details.</Text>
            <Text style={styles.listItem}>
                🔹 Payments are processed within <Text style={styles.boldText}>1 to 60 days,</Text> depending on transaction volume and verification time.
            </Text>
</View>
         <View style={styles.sectionDivider} />
        <View style={styles.importantDetailsBox}>

              <Text style={[ styles.contentHeader, { color: isDarkMode ? '#fff' : '#1434a4' } ]}>🌍 International Payments & Charges</Text>
              <Text style={styles.listItem}>
                🔹 For rewards in <Text style={styles.boldText}>USD or EUR or any other currency,</Text> currency conversion & transaction fees may apply.
            </Text>
            <Text style={styles.listItem}>
                🔹 The final amount depends on real-time exchange rates and deductions from banks/payment providers.
            </Text>
      </View>

      <View style={styles.sectionDivider} />
        <View style={styles.importantDetailsBox}>

             <Text style={[ styles.contentHeader, { color: isDarkMode ? '#fff' : '#1434a4' } ]}>📑 Annual Earnings & PAN Requirement (India Only)</Text>
              <Text style={styles.listItem}>
                🔹 Payouts may be withheld until PAN is submitted for tax compliance.
            </Text>
      </View>
         <View style={styles.sectionDivider} />
        <View style={styles.importantDetailsBox}>

              <Text style={[ styles.contentHeader, { color: isDarkMode ? '#fff' : '#1434a4' } ]}>📌 Tax Information</Text>
                <Text style={styles.listItem}><Text style={styles.boldText}>For Indian Residents:</Text></Text>
            <Text style={styles.listItem}>
                {/* Corrected duplicate text and improved clarity */}
                🔹 Referral income is typically processed within <Text style={styles.boldText}>1 to 60 days,</Text> subject to transaction volume and verification.
            </Text>
            <Text style={styles.listItem}>
                🔹 <Text style={styles.boldText}>TDS (Tax Deducted at Source)</Text> may apply. Payouts are made post-tax deduction.
            </Text>
              <Text style={styles.listItem}><Text style={styles.boldText}>🌎 For International Referrals:</Text></Text>
            <Text style={styles.listItem}>
                🔹 You are responsible for reporting your referral income as per your local tax laws.
            </Text>
            <Text style={styles.listItem}>
                🔹 We do not deduct or file international taxes on your behalf.
            </Text>
           
      </View>

      <View style={styles.sectionDivider} />
        <View style={styles.importantDetailsBox}>

              <Text style={[ styles.contentHeader, { color: isDarkMode ? '#fff' : '#1434a4' } ]}>📝 Good to Know</Text>
              <Text style={styles.listItem}>
                🔹 Refer to our <Text style={styles.boldText}>Terms of Use</Text> and <Text style={styles.boldText}>Privacy Policy</Text> for full program details.
            </Text>
            <Text style={styles.listItem}>
                🔹 <Text style={styles.boldText}>AllrounderBaby.com</Text> does not offer tax advice. Please consult a professional for personalized guidance.
            </Text>
      </View>
       <View style={styles.sectionDivider} />
        <View style={styles.importantDetailsBox}>
          <Text style={[styles.listItem, { textAlign: 'center' }]}>
                <Text style={styles.boldText}>📲  Ready to start earning? Head to the “Refer & Earn” section in your app and share your code now!  🚀</Text>
            </Text>
        </View>
      </ScrollView>
    </View>
    
  );
};

export default ReferAndEarnConditions;