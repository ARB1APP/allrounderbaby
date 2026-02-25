import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  useColorScheme,
  StatusBar,
  BackHandler,
  Alert,
  Animated,
  Easing,
  ActivityIndicator,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import LinearGradient from 'react-native-linear-gradient';
import { BASE_URL } from './config/api';

// NOTE: width/height are computed inside the component with useWindowDimensions

const lightThemeColors = {
  screenBackground: '#F4F6F8',
  cardBackground: '#FFFFFF',
  cardBackgroundText: '#FFFFFF',
  textPrimary: '#1A202C',
  textPrimaryModal: '#1A202C',
  textSecondary: '#4A5568',
  textMuted: '#718096',
  textMutedClose: '#2a3144',
  accentColorbg: 'rgba(20, 52, 164, 1)',
  accentColor: 'rgba(20, 52, 164, 1)',
  linkColor: 'rgba(20, 52, 164, 1)',
  borderColor: '#E2E8F0',
  borderColorD: '#ccc',
  iconColor: '#4A5568',
  bottomNavBackground: '#FFFFFF',
  bottomNavActiveTint: 'rgba(20, 52, 164, 1)',
  bottomNavInactiveTint: '#A0AEC0',
  bottomNavShadowColor: '#000000',
  statusBarContent: 'dark-content',
  elevation: 5,
};

const darkThemeColors = {
  screenBackground: '#1A202C',
  cardBackground: '#2D3748',
  cardBackgroundText: '#FFFFFF',
  textPrimary: '#E2E8F0',
  textPrimaryModal: '#fff',
  textSecondary: '#A0AEC0',
  textMuted: '#718096',
  textMutedClose: '#fff',
  accentColorbg: 'rgba(20, 52, 164, 1)',
  accentColor: '#fff',
  linkColor: '#63B3ED',
  borderColor: '#4A5568',
  borderColorD: '#fff',
  iconColor: '#A0AEC0',
  bottomNavBackground: '#2D3748',
  bottomNavActiveTint: '#63B3ED',
  bottomNavInactiveTint: '#718096',
  bottomNavShadowColor: '#000000',
  statusBarContent: 'light-content',
  elevation: 0,
};

const url = BASE_URL;

const createCashbackStyles = (theme, windowWidth = 360) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.screenBackground },
  scrollViewContent: { flexGrow: 1, paddingBottom: 20 },
  gradientHeaderText: { fontSize: 17, textAlign: 'center', fontWeight: '600', color: '#1A202C', lineHeight: 24 },
  gradientHeaderSubText: { fontWeight: '400' },
  Thumbnail: { fontSize: 16, lineHeight: 24 },
  introParagraph: { marginHorizontal: 0, fontSize: 15, lineHeight: 22, color: theme.textSecondary, marginBottom: 5 },
  sectionHeader: { marginHorizontal: 0, marginTop: 0, marginBottom: 12, fontSize: 20, fontWeight: '600' },


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
  sectionDivider: { height: 1, backgroundColor: theme.borderColor, marginHorizontal: 20, marginVertical: 20 },
  listItem: { marginHorizontal: 10, fontSize: 16, lineHeight: 22, color: theme.textSecondary, },
  detailPoint: { fontSize: 15, lineHeight: 22, color: theme.textSecondary, marginBottom: 10, marginHorizontal: 10 },
  emphasisText: { fontWeight: '600', color: theme.textPrimary, fontSize: 16 },
  emphasisTexts: { fontWeight: '800', color: theme.textPrimary },
  sectionLinkDivider: { marginHorizontal: 0 },
  image: { width: Math.max(150, windowWidth - 40), height: 200, borderRadius: 5, alignSelf: 'center' },
  thumbnailWrapper: { width: Math.max(120, windowWidth - 70), height: 180, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  subListItem: { marginHorizontal: 10, fontSize: 15, lineHeight: 20, color: theme.textSecondary, marginBottom: 6 },
  finalCallToAction: { fontSize: 16, textAlign: 'center', color: theme.textPrimary, fontWeight: '600' },
  linkButton: { alignSelf: 'flex-end', marginHorizontal: 20, marginTop: 15, marginBottom: 20 },
  linkText: { color: theme.linkColor, textDecorationLine: 'underline', fontSize: 15, fontWeight: '500' },
  modalLikeContainer: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  modalContent: { backgroundColor: theme.cardBackground, borderRadius: 10, padding: 20, width: '90%', maxWidth: 380 },
  modalContentMainDiv: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 0 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: theme.accentColor },
  modalContentClose: { fontSize: 16, fontWeight: 'bold', color: theme.textMutedClose },
  borderLine: { borderBottomWidth: 1, borderBottomColor: theme.borderColorD, marginVertical: 10 },
  modalText: { fontSize: 16, textAlign: 'center', marginBottom: 20, color: theme.textPrimaryModal },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  modalButton: { backgroundColor: theme.accentColorbg, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, width: '45%', alignItems: 'center' },
  modalButtonText: { color: theme.cardBackgroundText, fontSize: 16, fontWeight: 'bold' },
  disabledButton: { backgroundColor: theme.textMuted },
  pulseShadow: { position: 'absolute', width: 80, height: 80, borderRadius: 40, left: '50%', top: '50%', zIndex: 2 },
  playButtonContainer: { position: 'absolute', left: '50%', top: '50%', zIndex: 3, transform: [{ translateX: -30 }, { translateY: -30 }] },
  playButtonCircle: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
  playButtonText: { color: '#1e90ff', fontSize: 26, marginLeft: 3, fontWeight: '600', marginBottom: 5, },
});

const CashbackforFeedback = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkThemeColors : lightThemeColors;
  const isDarkMode = colorScheme === 'dark';
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const styles = useMemo(() => createCashbackStyles(theme, windowWidth), [theme, windowWidth]);

  const isLandscape = windowWidth > windowHeight;
  // Keep portrait sizes from styles; apply larger dimensions in landscape only
  const landscapeThumbWidth = Math.max(120, Math.round(windowWidth * 0.82));
  const landscapeThumbHeight = Math.max(420, Math.round(windowHeight * 0.85));
  const imageLocalStyle = isLandscape
    ? {
      width: windowWidth - 40, // match horizontal margin of importantDetailsBox
      height: Math.max(450, Math.round(windowHeight * 0.55)),
      borderRadius: 8, // match importantDetailsBox
      alignSelf: 'center',
    }
    : null;
  const thumbnailWrapperLocal = isLandscape
    ? { width: landscapeThumbWidth, height: landscapeThumbHeight, alignItems: 'center', justifyContent: 'center' }
    : null;
  const importantBoxLocal = isLandscape ? { minHeight: landscapeThumbHeight + 0 } : null;

  // responsive sizing for CASHBACK image to avoid cropping across devices
  const cashbackImageSource = require('../img/CASHBACK.png');
  const cashbackResolved = Image.resolveAssetSource(cashbackImageSource) || {};
  const cashbackAspect = (cashbackResolved.width && cashbackResolved.height) ? (cashbackResolved.width / cashbackResolved.height) : (16 / 9);
  const cbMaxWidth = Math.min(windowWidth - 40, windowWidth);
  let cbWidth = cbMaxWidth;
  let cbHeight = Math.round(cbWidth / cashbackAspect);
  const cbMaxHeight = Math.round(windowHeight * 0.75);
  if (cbHeight > cbMaxHeight) {
    cbHeight = cbMaxHeight;
    cbWidth = Math.round(cbHeight * cashbackAspect);
  }
  const responsiveCashbackStyle = { width: cbWidth, height: cbHeight, borderRadius: 8 };
  const [token, setToken] = useState(null);
  const [userId, setUserID] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [cashbackVideos, setCashbackVideos] = useState({});
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [selectedVideoGroup, setSelectedVideoGroup] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const CASHBACK_FOLDER_ID = "3b7737b5e34740318231b0f1c0797b34";

  useEffect(() => {
    const backAction = () => {
      if (isLanguageModalVisible) {
        setIsLanguageModalVisible(false);
        return true;
      }
      if (navigation && typeof navigation.canGoBack === 'function' && navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }
      try {
        if (navigation && typeof navigation.navigate === 'function') {
          navigation.navigate('Home');
          return true;
        }
      } catch (e) {
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation, isLanguageModalVisible]);

  useEffect(() => {
    const loadUserData = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUserId = await AsyncStorage.getItem('userId');
      setUserID(storedUserId);
      setToken(storedToken);
    };
    loadUserData();
  }, []);

  useEffect(() => {
    // continuous 2s shadow-wave: 0% -> 50% -> 100% mapped via interpolation
    const anim = Animated.loop(
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
        isInteraction: false,
      }),
      { iterations: -1 }
    );
    anim.start();
    return () => anim.stop();
  }, [pulseAnim]);

  useEffect(() => {
    if (token) {
      fetchCashbackVideos(CASHBACK_FOLDER_ID);
    }
  }, [token]);

  const fetchCashbackVideos = async (folderId) => {
    const netInfoState = await NetInfo.fetch();
    if (!netInfoState.isInternetReachable) {
      Alert.alert("No Internet Connection", "Please check your internet connection and try again.");
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
        const errorData = await response.json();
        Alert.alert("API Error", `Failed to get video details: ${errorData.message || response.statusText}`);
      } else {
        const videoDetails = await response.json();
        setCashbackVideos(videoDetails);
      }
    } catch (error) {
      Alert.alert("Network Error", `An unexpected error occurred: ${error.message}`);
    } finally {
      setIsVideoLoading(false);
    }
  };

  const vdoCipherApi = async (videoId) => {
    setIsVideoLoading(true);

    if (!videoId) {
      Alert.alert("Error", "Missing video ID to play the video.");
      return null;
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
        const errorData = await response.json();
        Alert.alert("API Error", `Failed to get video details: ${errorData.message || response.statusText}`);
        return null;
      }

      return await response.json();
    } catch (error) {
      Alert.alert("Network Error", `An unexpected error occurred: ${error.message}`);
      return null;
    } finally {
      setIsVideoLoading(false);
    }
  };

  const handleVideoPlayback = async (videoId, language, title, poster) => {
    const netInfoState = await NetInfo.fetch();
    if (!netInfoState.isInternetReachable) {
      Alert.alert("No Internet Connection", "Please check your internet connection and try again.");
      return;
    }

    setIsVideoLoading(true);

    const nameRaw = await AsyncStorage.getItem('Name');
    const emailRaw = await AsyncStorage.getItem('userEmail');
    const phoneRaw = await AsyncStorage.getItem('phoneNumber');
    const sessionIdRaw = await AsyncStorage.getItem('sessionId');

    const name = typeof nameRaw === 'string' ? nameRaw : JSON.stringify(nameRaw);
    const email = typeof emailRaw === 'string' ? emailRaw : JSON.stringify(emailRaw);
    const phone = typeof phoneRaw === 'string' ? phoneRaw : JSON.stringify(phoneRaw);
    const sessionId = typeof sessionIdRaw === 'string' ? sessionIdRaw : JSON.stringify(sessionIdRaw);

    console.log("Watermark Details:", { name, email, phone, sessionId });

    const startX = 20;
    const startY = 5;
    const spacing = 10;
    const maxY = 50;

    const annotationObject = [
      {
        type: 'rtext',
        text: name,
        alpha: 0.5,
        color: '0xFFFFFF',
        size: 14,
        interval: 5000,
        skip: 2000,
        x: startX,
        y: startY
      },
      {
        type: 'rtext',
        text: email,
        alpha: 0.4,
        color: '0x00FFFF',
        interval: 10000,
        skip: 1000,
        size: 14,
        x: startX,
        y: Math.min(startY + spacing, maxY)
      },
      {
        type: 'rtext',
        text: phone,
        alpha: 0.4,
        color: '0x00FF00',
        interval: 10000,
        skip: 1000,
        size: 14,
        x: startX,
        y: Math.min(startY + 1 * spacing, maxY)
      },
      {
        type: 'rtext',
        text: sessionId,
        alpha: 0.4,
        color: '0xFF00FF',
        interval: 10000,
        skip: 500,
        size: 14,
        x: startX,
        y: Math.min(startY + 2 * spacing, maxY)
      }
    ];

    console.log("Final Annotation Object:", annotationObject);


    console.log("Annotation Object:", JSON.stringify(annotationObject));
    const requestBody = {
      UserId: parseInt(userId, 10),
      VideoId: videoId,
      annotate: JSON.stringify(annotationObject)
    };
    try {
      if (!videoId) {
        Alert.alert("Error", "Video not found.");
        setIsVideoLoading(false);
        return;
      }

      if (!userId) {
        Alert.alert("Authentication Error", "User ID not available for watermark. Please log in again.");
        setIsVideoLoading(false);
        return;
      }

      const detailsData = await vdoCipherApi(videoId);
      if (detailsData) {
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

        const status = response.status;
        const text = await response.text();
        let parsed = null;
        try { parsed = JSON.parse(text); } catch (e) { /* not json */ }

        if (!response.ok) {
          const serverMsg = (parsed && (parsed.message || parsed.error)) || text || `HTTP ${status}`;
          console.error('VdoCipher POST failed', { status, body: text, parsed });
          Alert.alert("Error", serverMsg || "Video not found or failed to get OTP.");
        } else {
          const data = parsed || JSON.parse(text);
          navigation.navigate('VideoPlayerScreen', {
            id: videoId,
            otp: data.otp,
            playbackInfo: data.playbackInfo,
            language: language,
            title: title,
            poster: poster,
            total_time: total_time,
            cameFrom: 'Cashback for Feedback',
            sessionId: sessionId,
          });
        }
      }
    } catch (err) {
      console.error('VdoCipher request error', err);
      Alert.alert("Network Error", `An unexpected error occurred: ${err.message}`);
    } finally {
      setIsVideoLoading(false);
    }
  };

  const playableCashbackVideos = useMemo(() => {
    const videos = [];
    let englishCashbackItem = null;
    let hindiCashbackItem = null;

    cashbackVideos?.rows?.forEach(item => {
      if (item.title && item.title.toLowerCase().includes('100 cashback for feedback')) {
        if (item.title.toLowerCase().includes('english')) {
          englishCashbackItem = item;
        } else if (item.title.toLowerCase().includes('hindi')) {
          hindiCashbackItem = item;
        }
      }
    });

    if (englishCashbackItem) {
      videos.push({
        id: englishCashbackItem.id,
        title: 'English',
        language: 'english',
        poster: englishCashbackItem.poster,
      });
    }

    if (hindiCashbackItem) {
      videos.push({
        id: hindiCashbackItem.id,
        title: 'Hindi',
        language: 'hindi',
        poster: hindiCashbackItem.poster,
      });
    }

    return videos;
  }, [cashbackVideos]);

  const onPressKnowMoreButton = () => {
    setShowDetails(!showDetails);
  };

  const handleThumbnailClick = () => {
    if (playableCashbackVideos.length > 0) {
      const hindiVideo = playableCashbackVideos.find(v => v.language === 'hindi');
      const englishVideo = playableCashbackVideos.find(v => v.language === 'english');

      const videoGroup = {
        hindiVideo: hindiVideo ? { id: hindiVideo.id } : null,
        englishVideo: englishVideo ? { id: englishVideo.id } : null,
        stepNumber: 'cashback',
      };

      setSelectedVideoGroup(videoGroup);
      setIsLanguageModalVisible(true);
    } else {
      Alert.alert("Videos Not Available", "Cashback videos could not be loaded. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1434A4" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <LinearGradient
          colors={['#FFF8E5', '#FFFDEB']}
          style={[styles.importantDetailsBox, { marginTop: 10, marginBottom: 10 }]}>
          <Text style={styles.gradientHeaderText}>You get ₹1,000 / $10 Cashback </Text>
          <Text style={styles.gradientHeaderText}>
            <Text style={styles.gradientHeaderSubText}>for your genuine</Text> Feedback!
          </Text>
        </LinearGradient>
        <View style={styles.sectionDivider} />
        {isLandscape && (
          <View style={{ height: 15 }} />
        )}
        <View style={[styles.importantDetailsBox, importantBoxLocal, { padding: 0, marginVertical: 3 }]}>
          <TouchableOpacity onPress={handleThumbnailClick} activeOpacity={0.9} style={{ alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <View style={[styles.thumbnailWrapper, thumbnailWrapperLocal]}>
              <Image source={cashbackImageSource} style={[responsiveCashbackStyle, styles.image, imageLocalStyle]} resizeMode="contain" />
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.pulseShadow,
                  {
                    backgroundColor: 'rgba(30,144,255,1)',
                    opacity: pulseAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.7, 0.4, 0] }),
                    transform: [
                      { translateX: -40 },
                      { translateY: -40 },
                      { scale: pulseAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.36, 1.33] }) },
                    ],
                  },
                ]}
              />
              <View pointerEvents="none" style={styles.playButtonContainer}>
                <View style={[styles.playButtonCircle, { backgroundColor: isDarkMode ? '#fff' : '#fff' }]}>
                  <Text style={styles.playButtonText}>▶</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {isLandscape && (
          <View style={{ height: 15 }} />
        )}
        <View style={styles.sectionDivider} />

        <View style={styles.importantDetailsBox}>
          <Text style={[styles.sectionHeader, { color: theme.accentColor }]}>How It Works?</Text>
          <Text style={styles.listItem}>
            <Text style={styles.emphasisText}>1. </Text>
            Login to our website and submit your feedback
            {'\n'}
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.emphasisText}>2. </Text>
            Our team reviews and verifies your submission
            {'\n'}
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.emphasisText}>3. </Text>
            Get INR ₹1,000 / USD $10 cashback upon approval
          </Text>
        </View>
        <View style={styles.sectionDivider} />

        <View style={styles.importantDetailsBox}>
          <Text style={[styles.sectionHeader, { color: theme.accentColor }]}>Important Details</Text>
          <Text style={styles.detailPoint}>
            <Text style={styles.emphasisText}>One-time submission per user</Text> – Feedback can be submitted only once per account.
          </Text>
        </View>

        {showDetails && (
          <View style={styles.sectionLinkDivider} >
            <View style={styles.sectionDivider} />
            <View style={styles.importantDetailsBox}>
              <Text style={[
                styles.sectionHeader,
                { color: isDarkMode ? '#fff' : '#1434a4' }
              ]}>Submission & Review Process</Text>
              <Text style={styles.subListItem}>
                <Text style={styles.emphasisText}>✔️
                </Text> Feedback  must be submitted after logging in to our website .
                {'\n'}
              </Text>
              <Text style={styles.subListItem}>
                <Text style={styles.emphasisText}>✔️
                </Text> Our team will review and verify yourfeedback before
                approval.
                {'\n'}
              </Text>
              <Text style={styles.subListItem}>
                <Text style={styles.emphasisText}>✔️
                </Text> Cashback is issued only if the feedback is detailed, genuine, and approved.
                <Text style={styles.emphasisText}></Text>
              </Text>
            </View>
            <View style={styles.sectionDivider} />
            <View style={styles.importantDetailsBox}>
              <Text style={[
                styles.sectionHeader,
                { color: isDarkMode ? '#fff' : '#1434a4' }
              ]}>Bank Account & Payment Processing</Text>
              <Text style={styles.subListItem}>
                <Text style={styles.emphasisText}>✔️ </Text>
                Update your bank details after logging in to our website—this account will be used for your cashback payout.
                {'\n'}
              </Text>
              <Text style={styles.subListItem}>
                <Text style={styles.emphasisText}>✔️ </Text>
                Cashback is processed within 1 to 60 days after approval.
              </Text>
            </View>
            <View style={styles.sectionDivider} />
            <View style={styles.importantDetailsBox}>
              <Text style={[
                styles.sectionHeader,
                { color: isDarkMode ? '#fff' : '#1434a4' }
              ]}>International Participants</Text>
              <Text style={styles.subListItem}>
                <Text style={styles.emphasisText}>✔️ </Text>
                For payments made in currencies other than INR, applicable transaction fees and currency conversion charges may apply
                {'\n'}
              </Text>
              <Text style={styles.subListItem}>
                <Text style={styles.emphasisText}>✔️ </Text>
                The final amount credited depends on your bank’s deductions and exchange rates.
              </Text>
            </View>
            <View style={styles.sectionDivider} />
            <View style={styles.importantDetailsBox}>
              <Text style={[
                styles.sectionHeader,
                { color: isDarkMode ? '#fff' : '#1434a4' }
              ]}>Tax & Compliance</Text>
              <Text style={styles.subListItem}>
                <Text style={styles.emphasisText}>✔️ </Text>
                No TDS will be deducted under Section 194J of the Indian Income Tax Act, subject to applicable rules.
              </Text>
              <Text style={styles.subListItem}>{'\n'}
                <Text style={styles.emphasisText}>For International Users:</Text>
              </Text>
              <Text style={styles.subListItem}>
                <Text style={styles.emphasisText}>✔️ </Text>
                You are responsible for reporting and paying taxes in accordance with your local tax regulations.
                {'\n'}
              </Text>
              <Text style={styles.subListItem}>
                <Text style={styles.emphasisText}>✔️ </Text>
                Cashback is treated as commission income and may be taxable under the laws of your country.
              </Text>
            </View>
            <View style={styles.sectionDivider} />
            <View style={styles.importantDetailsBox}>
              <Text style={[
                styles.sectionHeader,
                { color: isDarkMode ? '#fff' : '#1434a4' }
              ]}>Important Notes</Text>
              <Text style={styles.subListItem}>
                <Text style={styles.emphasisText}>✔️ </Text>
                AllrounderBaby does not offer tax advice. Please consult your tax advisor.
                {'\n'}
              </Text>
              <Text style={styles.subListItem}>
                <Text style={styles.emphasisText}>✔️ </Text>
                By submitting feedback, you agree to our Terms of Use and Privacy Policy.
              </Text>
            </View>
            <View style={styles.sectionDivider} />
            <View style={styles.importantDetailsBox}>
              <Text style={styles.finalCallToAction}>
                Your feedback matters! Help us improve and get rewarded with cashback up to ₹1,000 / $10
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity onPress={onPressKnowMoreButton} style={styles.linkButton}>
          <Text style={styles.linkText}>{showDetails ? 'Know less' : 'Know more'}</Text>
        </TouchableOpacity>

      </ScrollView>

      {isLanguageModalVisible && selectedVideoGroup && (
        <Pressable style={styles.modalLikeContainer} onPress={() => setIsLanguageModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalContentMainDiv}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity onPress={() => setIsLanguageModalVisible(false)}>
                <Text style={styles.modalContentClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.borderLine} />
            <Text style={styles.modalText}>In which language would you like to watch this video?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, !selectedVideoGroup.hindiVideo && styles.disabledButton]}
                onPress={() => {
                  setIsLanguageModalVisible(false);
                  handleVideoPlayback(selectedVideoGroup.hindiVideo.id, 'hindi', 'Cashback Video (Hindi)', null);
                }}
                disabled={!selectedVideoGroup.hindiVideo}
              >
                <Text style={styles.modalButtonText}>Hindi</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, !selectedVideoGroup.englishVideo && styles.disabledButton]}
                onPress={() => {
                  setIsLanguageModalVisible(false);
                  handleVideoPlayback(selectedVideoGroup.englishVideo.id, 'english', 'Cashback Video (English)', null);
                }}
                disabled={!selectedVideoGroup.englishVideo}
              >
                <Text style={styles.modalButtonText}>English</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      )}
    </View>
  );
};
export default CashbackforFeedback;
