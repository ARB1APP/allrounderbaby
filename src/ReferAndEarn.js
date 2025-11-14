import React, { useState, useEffect, useMemo } from 'react';
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
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const lightThemeColors = {
  screenBackground: '#F4F6F8',
  cardBackground: '#FFFFFF',
  modalBackground: '#FFFFFF',
  textPrimary: '#1A202C',
  textPrimaryModal: '#1A202C',
  textSecondary: '#4A5568',
  textSecondaryModal: '#000',
  textMuted: '#718096',
  textSuccess: '#38A169',
  primaryAction: 'rgba(20, 52, 164, 1)',
  primaryActionText: '#FFFFFF',
  secondaryActionBorder: '#CBD5E0',
  secondaryActionText: '#2D3748',
  linkColor: 'rgba(20, 52, 164, 1)',
  borderColor: '#E2E8F0',
  iconColor: '#4A5568',
  videoIconTint: 'rgba(20, 52, 164, 1)',
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
  borderColorD: '#ccc',
  elevation: 5,
};

const darkThemeColors = {
  screenBackground: '#1A202C',
  cardBackground: '#2D3748',
  modalBackground: '#2D3748',
  textPrimary: '#E2E8F0',
  textPrimaryModal: '#fff',
  textSecondary: '#A0AEC0',
  textSecondaryModal: '#fff',
  textMuted: '#718096',
  textSuccess: '#68D391',
  primaryAction: 'rgba(40, 72, 184, 1)',
  primaryActionText: '#E2E8F0',
  secondaryActionBorder: '#4A5568',
  secondaryActionText: '#CBD5E0',
  linkColor: '#63B3ED',
  borderColor: '#4A5568',
  iconColor: '#A0AEC0',
  videoIconTint: 'rgba(40, 72, 184, 1)',
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
  borderColorD: '#fff',
  elevation: 0,
};

const url = 'https://allrounderbaby-czh8hubjgpcxgrc7.canadacentral-01.azurewebsites.net/api/';

const ReferAndEarn = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkThemeColors : lightThemeColors;
  const styles = createReferAndEarnStyles(theme);
  const isDarkMode = useColorScheme() === 'dark';

  const [code, setCode] = useState("Loading...");
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedAge, setSelectedAge] = useState(null);
  const [token, setToken] = useState(null);
  const [userId, setUserID] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [referEarnVideos, setReferEarnVideos] = useState({});
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [selectedVideoGroup, setSelectedVideoGroup] = useState(null);

  const REFER_EARN_FOLDER_ID = "9ebe21e5639c440c930ba642a07d0a0b";

  useEffect(() => {
    const loadUserData = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUserId = await AsyncStorage.getItem('userId');
      setUserID(storedUserId);
      setToken(storedToken);
      if (storedToken && storedUserId) {
        handleRefrealcode(storedToken, storedUserId);
      } else {
        console.warn("Authentication: Token or User ID not found in AsyncStorage.");
        setCode("Login Req.");
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    if (token) {
      fetchReferEarnVideos(REFER_EARN_FOLDER_ID);
    }
  }, [token]);

  useEffect(() => {
    const backAction = () => {
      if (shareModalVisible) {
        closeShareModal();
        return true;
      }
      if (isLanguageModalVisible) {
        setIsLanguageModalVisible(false);
        return true;
      }
      navigation.navigate('Home');
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [shareModalVisible, isLanguageModalVisible, navigation]);

  const ageOptions = [
    { label: "0-1 year", value: "0-1" },
    { label: "1-2 years", value: "1-2" },
    { label: "2-3 years", value: "2-3" },
    { label: "3-4 years", value: "3-4" },
    { label: "4-5 years", value: "4-5" },
    { label: "5-6 years", value: "5-6" },
  ];

  const copyToClipboard = () => {
    if (code && code !== "Loading..." && code !== "N/A" && code !== "Login Req.") {
      Clipboard.setString(code);
      Alert.alert("Copied!", "Referral code copied to clipboard.");
    } else {
      Alert.alert("Information", "Referral code is not yet available or invalid.");
    }
  };

  const onPressKnowMoreButton = () => {
    navigation.navigate('Refer and Earn conditiions');
  };

  const onPressReferralHistoryBtn = () => {
    navigation.navigate('Referral History');
  };

  const openShareModal = () => {
    if (code && code !== "Loading..." && code !== "N/A" && code !== "Login Req.") {
      setSelectedAge(null);
      setShareModalVisible(true);
    } else {
      Alert.alert("Information", "Please wait for the referral code to load or ensure you are logged in before sharing.");
    }
  };

  const closeShareModal = () => {
    setShareModalVisible(false);
  };

  const performActualShare = async () => {
    if (!selectedAge) {
      Alert.alert("Please select", "Please select a child's age group before sharing.");
      return;
    }
    let shareMessage = `My referral code is: ${code}. Use it on AllrounderBaby.com for a 10% discount!`;
    shareMessage += ` (Age group: ${selectedAge} years)`;
    shareMessage += ` #AllrounderBaby #ReferAndEarn`;

    try {
      const result = await Share.share({ message: shareMessage });
      if (result.action === Share.sharedAction) {
        console.log('Code shared!', result.activityType ? `Via: ${result.activityType}` : '');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while sharing: ' + error.message);
    }
  };

  const fetchReferEarnVideos = async (folderId) => {
    const netInfoState = await NetInfo.fetch();
    if (!netInfoState.isInternetReachable) {
      Alert.alert(
        "No Internet Connection",
        "Please check your internet connection and try again."
      );
      return;
    }
    if (!token) {
      Alert.alert("Authentication Error", "User not authenticated. Please log in again.");
      return;
    }
    setIsVideoLoading(true);
    const DETAILS_ENDPOINT = `${url}Vdocipher/GetAllVDOCipherVideosByFolderID?folderId=${folderId}`;
    try {
      const response = await fetch(DETAILS_ENDPOINT, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (!response.ok) {
        let errorData = { message: `HTTP Error: ${response.status} ${response.statusText}` };
        try {
          errorData = await response.json();
        } catch (parseError) {
          errorData = { message: response.statusText };
        }
        Alert.alert("API Error", `Failed to get video details: ${errorData.message || response.statusText}`);
        return null;
      }
      const videoDetails = await response.json();
      console.log("Raw API Response for Refer & Earn Videos:", videoDetails);
      setReferEarnVideos(videoDetails);
      return videoDetails;
    } catch (error) {
      Alert.alert("Network Error", `An unexpected error occurred: ${error.message}`);
      return null;
    } finally {
      setIsVideoLoading(false);
    }
  };

  const vdoCipher_api = async (videoId) => {
    const netInfoState = await NetInfo.fetch();
    if (!netInfoState.isInternetReachable) {
      Alert.alert("No Internet Connection", "Please check your internet connection and try again.");
      return { error: true, message: "No internet connection" };
    }
    setIsVideoLoading(true);
    if (!videoId) {
      Alert.alert("Error", "Missing video ID to play the video.");
      return { error: true, message: "Missing videoId" };
    }
    const DETAILS_ENDPOINT = `${url}Vdocipher/GetVDOCipher_VideosDetails?videoId=${videoId}`;
    try {
      const response = await fetch(DETAILS_ENDPOINT, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          errorData = { message: response.statusText };
        }
        return {
          error: true,
          message: `Failed to get video details: ${errorData.message || response.statusText}`
        };
      }
      const videoDetails = await response.json();
      return videoDetails;
    } catch (error) {
      return {
        error: true,
        message: `An unexpected error occurred: ${error.message}`
      };
    } finally {
      // setIsVideoLoading(false);
    }
  };

  const handleRefrealcode = async (currentToken, currentUserId) => {
    const effectiveToken = currentToken || token;
    const effectiveUserId = currentUserId || userId;
    if (!effectiveToken || !effectiveUserId) {
      console.log("handleRefrealcode: Token or User ID not available for fetching referral code. Skipping API call.");
      setIsLoading(false);
      return;
    }
    const DETAILS_ENDPOINT = `${url}User/getUsersDetails_By_ID?userid=${effectiveUserId}`;
    console.log(`handleRefrealcode: Attempting to fetch from: ${DETAILS_ENDPOINT}`);
    setIsLoading(true);
    try {
      const response = await fetch(DETAILS_ENDPOINT, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${effectiveToken}`,
          'Accept': 'application/json'
        }
      });
      console.log(`handleRefrealcode: API Response Status: ${response.status} ${response.statusText}`);
      if (!response.ok) {
        let errorData;
        const responseText = await response.text();
        try {
          errorData = JSON.parse(responseText);
        } catch (parseError) {
          errorData = {
            message: response.statusText,
            rawResponse: responseText
          };
        }
        console.error("handleRefrealcode: API Error Response:", errorData);
        Alert.alert("API Error", `Failed to load user details: ${errorData.message || response.statusText}. Raw response: ${errorData.rawResponse || 'N/A'}`);
        setCode("Error");
        return;
      }
      const jsonResponse = await response.json();
      console.log("handleRefrealcode: Parsed JSON response for user details:", jsonResponse);
      if (Array.isArray(jsonResponse) && jsonResponse.length > 0) {
        setUserDetails(jsonResponse[0]);
        if (jsonResponse[0].referal_Code) {
          setCode(jsonResponse[0].referal_Code);
          console.log("handleRefrealcode: Referral code successfully set:", jsonResponse[0].referal_Code);
        } else {
          console.log("handleRefrealcode: 'referal_Code' property not found in user details response, or is null/empty.");
          setCode("N/A");
        }
      } else {
        console.log("handleRefrealcode: User data not found or format is invalid (not an array or empty array).");
        Alert.alert("Data Error", "User data not found or format is invalid.");
        setCode("N/A");
      }
    } catch (error) {
      console.error("handleRefrealcode: Network or unexpected error:", error);
      Alert.alert("Network Error", `An unexpected error occurred: ${error.message}`);
      setCode("Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoPlayback = async (videoId, language, title, poster) => {
    const netInfoState = await NetInfo.fetch();
    if (!netInfoState.isInternetReachable) {
      Alert.alert("No Internet Connection", "Please check your internet connection and try again.");
      return;
    }
    if (!userId) {
      Alert.alert("Authentication Error", "User ID not available for watermark. Please log in again.");
      setIsVideoLoading(false);
      return;
    }

    setIsVideoLoading(true);

    const sessionId = await AsyncStorage.getItem('sessionId');
    const watermarkText = `User: ${userId} Video: ${videoId} Session: ${sessionId}`;
    console.log("Watermark Text:", watermarkText);

    const annotationObject = [{
      type: 'rtext',
      text: watermarkText,
      alpha: '0.60',
      color: '0xFFFFFF',
      size: '16',
      interval: '5000',
    }];
    const requestBody = {
      userId: userId,
      videoId: videoId,
      annotate: JSON.stringify(annotationObject)
    };
    try {
      if (videoId) {
        const detailsData = await vdoCipher_api(videoId);
        if (detailsData && !detailsData.error) {
          const total_time = detailsData.length || 0;
          const response = await fetch(`${url}Vdocipher/GetVideosFromVDOCipher_VideoId`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
          });
          if (!response.ok) {
            const errorData = await response.json();
            Alert.alert("Error", errorData.message || "Video not found or failed to get OTP.");
            setIsVideoLoading(false);
          } else {
            const data = await response.json();
            navigation.navigate('VideoPlayerScreen', {
              id: videoId,
              otp: data.otp,
              playbackInfo: data.playbackInfo,
              language: language,
              title: title,
              poster: poster,
              total_time: total_time,
              cameFrom: 'Refer and Earn',
              sessionId: sessionId,
            });
            setIsVideoLoading(false);
          }
        } else {
          Alert.alert("Error", detailsData?.message || "Failed to fetch video details from Vdocipher API.");
          setIsVideoLoading(false);
        }
      } else {
        Alert.alert("Error", "Video not found.");
        setIsVideoLoading(false);
      }
    } catch (err) {
      Alert.alert("Network Error", `An unexpected error occurred: ${err.message}`);
      setIsVideoLoading(false);
    }
  };

  const playableReferEarnVideos = useMemo(() => {
    const videos = [];
    let englishItem = null;
    let hindiItem = null;
    referEarnVideos?.rows?.forEach(item => {
      if (item.title && item.title.toLowerCase().includes('refer and earn')) {
        if (item.title.toLowerCase().includes('english')) {
          englishItem = item;
        } else if (item.title.toLowerCase().includes('hindi')) {
          hindiItem = item;
        }
      }
    });
    if (englishItem) {
      videos.push({
        id: englishItem.id,
        title: 'English',
        language: 'english',
        poster: englishItem.poster,
        length: englishItem.length
      });
    }
    if (hindiItem) {
      videos.push({
        id: hindiItem.id,
        title: 'Hindi',
        language: 'hindi',
        poster: hindiItem.poster,
        length: hindiItem.length
      });
    }
    console.log("Playable Refer & Earn Videos after filtering:", videos);
    return videos;
  }, [referEarnVideos]);

  const handleThumbnailClickForReferAndEarn = () => {
    if (playableReferEarnVideos.length > 0) {
      const hindiVideo = playableReferEarnVideos.find(v => v.language === 'hindi');
      const englishVideo = playableReferEarnVideos.find(v => v.language === 'english');

      const videoGroup = {
        hindiVideo: hindiVideo ? { id: hindiVideo.id } : null,
        englishVideo: englishVideo ? { id: englishVideo.id } : null,
        stepNumber: 'refer-and-earn',
      };

      setSelectedVideoGroup(videoGroup);
      setIsLanguageModalVisible(true);
    } else {
      Alert.alert("Videos Not Available", "Refer & Earn videos could not be loaded. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.statusBarContent} backgroundColor={theme.screenBackground} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={[styles.importantDetailsBox, { marginTop: 10 }]}>
          <Text style={styles.titleText}>Earn ₹3,000 / $30 every time</Text>
          <Text style={styles.titleText}>Refer a friend & they get 10% OFF</Text>
        </View>
        <View style={styles.sectionDivider} />
        <View style={styles.importantDetailsBox}>
          <Text style={[styles.referralCodeLabel, { color: isDarkMode ? '#fff' : '#1434a4' }]}>Your Referral Code</Text>
          <View style={styles.referralCodeDisplay}>
            {isLoading ? (
              <ActivityIndicator size="small" color={theme.textPrimary} />
            ) : (
              <Text style={styles.referralCodeText}>{code}</Text>
            )}
            <TouchableOpacity onPress={copyToClipboard} disabled={isLoading || code === "N/A" || code === "Loading..." || code === "Error" || code === "Login Req."}>
              <Image source={require('../img/copy.png')} style={styles.copyIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={openShareModal} disabled={isLoading || code === "N/A" || code === "Loading..." || code === "Error" || code === "Login Req."}>
              <Text style={styles.buttonTextPrimary}>Share Code</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={onPressReferralHistoryBtn}>
              <Text style={styles.buttonTextSecondary}>Referral History</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.sectionDivider} />
        <View style={styles.importantDetailsBox}>
          <TouchableOpacity onPress={handleThumbnailClickForReferAndEarn}>
            <Text style={styles.contentParagraph}>
              <Text style={styles.introParagraph}>
                <Text style={styles.Thumbnail}>One video window – full width thumbnail will be provided</Text>
                {'\n'}{'\n'}
                <Text style={styles.emphasisTexts}>Upon click it will ask Hindi / English</Text>
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.importantDetailsBox, { marginTop: 20 }]}>
          <Text style={[styles.contentHeader, { color: isDarkMode ? '#fff' : '#1434a4' }]}>How to Refer & Earn?</Text>
          <Text style={styles.listItem}>
            <Text style={styles.boldText}>1.</Text>
            <Text> Invite friends using your referral code—share via WhatsApp, Email, or Social Media!</Text>
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.boldText}>2.</Text>
            <Text>Your friend joins using your referral code and gets 10% OFF on successful payment!</Text>
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.boldText}>3.</Text>
            <Text>Earn INR ₹3,000 / USD $30 every time your referral makes a verified purchase!</Text>
          </Text>
        </View>
        <View style={styles.sectionDivider} />

        <View style={styles.importantDetailsBox}>
          <Text style={[styles.sectionHeader, { color: isDarkMode ? '#fff' : '#1434a4' }]}>Important Details</Text>
          <Text style={styles.detailPoint}>
            <Text style={styles.emphasisText}>✔️ You earn every time your referral is successful.</Text>
          </Text>
          <Text style={styles.detailPoint}>
            <Text style={styles.emphasisText}>✔️ No limit to how much you can earn.</Text>
          </Text>
        </View>

        <TouchableOpacity onPress={onPressKnowMoreButton} style={styles.linkButton}>
          <Text style={styles.linkText}>Know more</Text>
        </TouchableOpacity>
      </ScrollView>
      {isLanguageModalVisible && selectedVideoGroup && (
        <Pressable style={styles.modalOverlay} onPress={() => setIsLanguageModalVisible(false)}>
          <Pressable style={styles.modalView} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity onPress={() => setIsLanguageModalVisible(false)} style={styles.modalCloseButton}>
                <Text style={styles.modalCloseIcon}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.borderLine} />
            <Text style={styles.radioGroupTitle}>In which language would you like to watch this video?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, !selectedVideoGroup?.hindiVideo && styles.disabledButton, { backgroundColor: theme.primaryAction }]}
                onPress={() => {
                  if (selectedVideoGroup?.hindiVideo) {
                    setIsLanguageModalVisible(false);
                    handleVideoPlayback(selectedVideoGroup.hindiVideo.id, 'hindi', 'Refer & Earn Video (Hindi)', null);
                  }
                }}
                disabled={!selectedVideoGroup?.hindiVideo}
              >
                <Text style={[styles.modalButtonText, { color: theme.primaryActionText }]}>Hindi</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, !selectedVideoGroup?.englishVideo && styles.disabledButton, { backgroundColor: theme.primaryAction }]}
                onPress={() => {
                  if (selectedVideoGroup?.englishVideo) {
                    setIsLanguageModalVisible(false);
                    handleVideoPlayback(selectedVideoGroup.englishVideo.id, 'english', 'Refer & Earn Video (English)', null);
                  }
                }}
                disabled={!selectedVideoGroup?.englishVideo}
              >
                <Text style={[styles.modalButtonText, { color: theme.primaryActionText }]}>English</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      )}
      {shareModalVisible && (
        <Pressable style={styles.modalOverlay} onPress={closeShareModal}>
          <Pressable style={styles.modalView} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Share Your Code</Text>
              <TouchableOpacity onPress={closeShareModal} style={styles.modalCloseButton}>
                <Text style={styles.modalCloseIcon}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.radioGroupTitle}>Select Child's Age Group:</Text>
            <View style={styles.radioGroupContainer}>
              {ageOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.radioButtonRow}
                  onPress={() => setSelectedAge(option.value)}
                >
                  <View style={styles.radioButtonOuter}>
                    {selectedAge === option.value && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <Text style={styles.radioButtonLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.modalButtonShareBackground }]}
                onPress={performActualShare}
              >
                <Text style={[styles.modalButtonText, { color: theme.modalButtonShareText }]}>Share Now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.modalButtonCloseBackground }]}
                onPress={closeShareModal}
              >
                <Text style={[styles.modalButtonText, { color: theme.modalButtonCloseText }]}>Close</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      )}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Image source={require('../img/hometab.png')} style={[styles.navIcon, { tintColor: theme.bottomNavInactiveTint }]} />
          <Text style={[styles.navText, { color: theme.bottomNavInactiveTint }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Cashback for Feedback')}>
          <Image source={require('../img/feedbacktab.png')} style={[styles.navIcon, { tintColor: theme.bottomNavInactiveTint }]} />
          <Text style={[styles.navText, { color: theme.bottomNavInactiveTint, textAlign: 'center' }]}>Cashback for Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image source={require('../img/money.png')} style={[styles.navIcon, { tintColor: theme.bottomNavActiveTint }]} />
          <Text style={[styles.navText, { color: theme.bottomNavActiveTint }]}>Refer & Earn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('My Profile')}>
          <Image source={require('../img/proflie.png')} style={[styles.navIcon, { tintColor: theme.bottomNavInactiveTint }]} />
          <Text style={[styles.navText, { color: theme.bottomNavInactiveTint }]}>My Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createReferAndEarnStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBackground,
  },
  Thumbnail: {
    fontSize: 17,
  },
  Willlist: {
    textAlign: 'center',
  },
  sectionHeader: {
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 12,
    fontSize: 24,
    fontWeight: '600',
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
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  borderLine: { borderBottomWidth: 1, borderBottomColor: theme.borderColorD, width: "100%", marginBottom: 15, },
  detailPoint: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.textSecondary,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  finalCallToAction: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  titleText: {
    fontSize: 17,
    textAlign: 'center',
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 0,
    fontWeight: '600',
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
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  referralCodeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  referralCodeText: {
    fontSize: 18,
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
    elevation: theme.elevation / 2,
    shadowColor: theme.bottomNavShadowColor,
    shadowOffset: {
      width: 0,
      height: 2
    },
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
  emphasisTexts: {
    fontWeight: '800',
    color: theme.textPrimary,
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
  videoLinksContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: theme.cardBackground,
    borderRadius: 10,
    borderWidth: theme.elevation === 0 ? 1 : 0,
    borderColor: theme.borderColor,
    elevation: theme.elevation,
    shadowColor: theme.bottomNavShadowColor,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    width: '100%',
  },
  videoLinkItemInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoIcon: {
    width: 28,
    height: 28,
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.modalBackground,
    paddingVertical: 10,
    bottom: 0,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
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
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.overlayBackground,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalView: {
    backgroundColor: theme.modalBackground,
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 380,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.textPrimaryModal,
    flex: 1,
  },
  modalCloseButton: {
    padding: 5,
  },
  modalCloseIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.textSecondaryModal,
  },
  radioGroupTitle: {
    fontSize: 16,
    color: theme.textSecondaryModal,
    marginBottom: 20,
    alignSelf: 'flex-start',
    textAlign: 'center',
  },
  radioGroupContainer: {
    width: '100%',
    marginBottom: 25,
  },
  radioButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
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
    elevation: 2,
    shadowColor: theme.bottomNavShadowColor,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  modalButtonText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  disabledButton: {
    backgroundColor: 'gray',
    opacity: 0.6
  }
});
export default ReferAndEarn;
