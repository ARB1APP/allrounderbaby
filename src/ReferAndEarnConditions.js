import React, { useState, useEffect } from 'react';
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
  StatusBar,
  BackHandler,
} from 'react-native';
import ScreenScroll from './components/ScreenScroll';

const lightThemeColors = {
  screenBackground: '#F4F6F8',
  cardBackground: '#FFFFFF',
  modalBackground: '#FFFFFF',
  textPrimary: '#1A202C',
  textSecondary: '#4A5568',
  textMuted: '#718096',
  textSuccess: '#38A169',
  primaryAction: 'rgba(20, 52, 164, 1)',
  primaryActionText: '#FFFFFF',
  secondaryActionBorder: '#CBD5E0',
  secondaryActionText: '#2D3748',
  linkColor: 'rgba(20, 52, 164, 1)',
  borderColor: '#E2E8F0',
  iconColor: '#4A5568',
  bottomNavBackground: '#FFFFFF',
  bottomNavActiveTint: 'rgba(20, 52, 164, 1)',
  bottomNavInactiveTint: '#A0AEC0',
  bottomNavShadowColor: '#000000',
  radioButtonBorder: '#CBD5E0',
  radioButtonSelectedBackground: 'rgba(20, 52, 164, 1)',
  modalButtonShareBackground: '#4CAF50',
  modalButtonShareText: '#FFFFFF',
  modalButtonCloseBackground: '#E2E8F0',
  modalButtonCloseText: '#2D3748',
  overlayBackground: 'rgba(0,0,0,0.6)',
  statusBarContent: 'dark-content',
  elevation: 5,
};

const darkThemeColors = {
  screenBackground: '#1A202C',
  modalBackground: '#2D3748',
  textPrimary: '#E2E8F0',
  textSecondary: '#A0AEC0',
  textMuted: '#718096',
  textSuccess: '#68D391',
  primaryAction: 'rgba(40, 72, 184, 1)',
  primaryActionText: '#E2E8F0',
  secondaryActionBorder: '#4A5568',
  secondaryActionText: '#CBD5E0',
  linkColor: '#63B3ED',
  borderColor: '#4A5568',
  iconColor: '#A0AEC0',
  bottomNavBackground: '#2D3748',
  bottomNavActiveTint: '#63B3ED',
  bottomNavInactiveTint: '#718096',
  bottomNavShadowColor: '#000000',
  radioButtonBorder: '#4A5568',
  radioButtonSelectedBackground: '#63B3ED',
  modalButtonShareBackground: '#38A169',
  modalButtonShareText: '#E2E8F0',
  modalButtonCloseBackground: '#4A5568',
  modalButtonCloseText: '#E2E8F0',
  overlayBackground: 'rgba(0,0,0,0.7)',
  statusBarContent: 'light-content',
  elevation: 0,
};

const createReferAndEarnConditionsStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBackground,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: theme.borderColor,
    marginHorizontal: 20,
    marginVertical: 15,
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
    fontWeight: '600',
    color: theme.textPrimary,
  },
});


const ReferAndEarnConditions = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkThemeColors : lightThemeColors;
  const styles = createReferAndEarnConditionsStyles(theme);
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const backAction = () => {
      if (navigation && typeof navigation.canGoBack === 'function' && navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);
 

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.statusBarContent} backgroundColor={theme.screenBackground} />
      <ScreenScroll contentContainerStyle={styles.scrollViewContent}>


  <View style={styles.sectionDivider} />


        <View style={styles.sectionDivider} />

        <View style={styles.importantDetailsBox}>

           <Text style={[ styles.contentHeader, { color: isDarkMode ? '#fff' : '#1434a4' } ]}>Processing & Bank Details</Text>

         <Text style={styles.listItem}>
               <Text style={styles.boldText}>✔️</Text>  
               ️ Update your bank details after logging in to our website—this account will be used for your earning payout.
            </Text>

            <Text style={styles.listItem}>
               <Text style={styles.boldText}>✔️</Text>  
               ️  Cashback is processed within 1 to 60 days depending on transaction volume and verification time.
            </Text>
        </View>

         <View style={styles.sectionDivider} />
            <View style={styles.importantDetailsBox}>

                  <Text style={[ styles.contentHeader, { color: isDarkMode ? '#fff' : '#1434a4' } ]}>
                    International Payments & Charges
                   </Text>

                <Text style={styles.listItem}>
               <Text style={styles.boldText}>✔️</Text>  
               ️ For payments made in currencies other than INR, applicable transaction fees and currency conversion charges may apply
            </Text>

            <Text style={styles.listItem}>
               <Text style={styles.boldText}>✔️</Text>  
               ️   The final amount credited depends on your bank’s deductions and exchange rates.
            </Text>
          </View>

      <View style={styles.sectionDivider} />
       
         <View style={styles.sectionDivider} />
        <View style={styles.importantDetailsBox}>

              <Text style={[ styles.contentHeader, { color: isDarkMode ? '#fff' : '#1434a4' } ]}>
                   Tax & Compliance
                </Text>

           <Text style={styles.listItem}>
               <Text style={styles.boldText}>✔️</Text>  
               ️ Referral income is considered commission income and is subject to Indian tax laws.
            </Text>

            <Text style={styles.listItem}>
               <Text style={styles.boldText}>✔️</Text>  
               ️   Payouts may be withheld until PAN details are submitted to ensure tax compliance.
            </Text>

          <Text style={styles.listItem}>
               <Text style={styles.boldText}>✔️</Text>  
               ️   A TDS (Tax Deducted at Source) of 5% has been deducted under Section 194H of the Income Tax Act, 
                  1961. Payouts are made after tax deduction. 
                  You may claim credit for this TDS when filing your income tax return
                    {'\n'}{'\n'}
            </Text>

           

        <Text  style={styles.boldText}>For International Users:   {'\n'}</Text>

          <Text style={styles.listItem}>
               <Text style={styles.boldText}>✔️ </Text>  
                  You are responsible for reporting your referral income according to your local tax laws.
            </Text>

       <Text style={styles.listItem}>
               <Text style={styles.boldText}>✔️ </Text>  
                 We do not deduct or file international taxes on your behalf.
            </Text>
            
      </View>

      <View style={styles.sectionDivider} />
        <View style={styles.importantDetailsBox}>

              <Text style={[ styles.contentHeader, { color: isDarkMode ? '#fff' : '#1434a4' } ]}>Important Notes
           </Text>

            <Text style={styles.listItem}>
               <Text style={styles.boldText}>✔️ </Text>  
                 AllrounderBaby does not offer tax advice. Please consult your tax advisor.
            </Text>

            <Text style={styles.listItem}>
               <Text style={styles.boldText}>✔️ </Text>  
                  By receiving referral earnings, you agree to our Terms of Use and Privacy Policy.
            </Text>

            
      </View>
       <View style={styles.sectionDivider} />
        <View style={styles.importantDetailsBox}>
          <Text style={[styles.listItem, { textAlign: 'center' }]}>
                <Text style={styles.boldText}>
                  Science says children grow better with good friends—earn ₹3,000 / $30 by referring your child’s friends’ parents, and they get 10% OFF!
                  </Text>
            </Text>
        </View>
      </ScreenScroll>
    </View>
    
  );
};

export default ReferAndEarnConditions;
