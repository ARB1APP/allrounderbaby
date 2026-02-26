import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
  Alert,
  Linking,
  BackHandler,
  Image,
  Animated,
  Easing,
  StatusBar,
  useColorScheme,
  Platform,
} from 'react-native';
import ScreenScroll from './components/ScreenScroll';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { BASE_URL } from './config/api';

const lightThemeColors = {
  screenBackground: '#F4F6F8',
  textPrimary: '#1A202C',
  textSecondary: '#4A5568',
  textMuted: '#718096',
  accentColor: 'rgba(20, 52, 164, 1)',
  borderColor: '#E2E8F0',
  statusBarContent: 'dark-content',
};

const darkThemeColors = {
  screenBackground: '#1A202C',
  textPrimary: '#E2E8F0',
  textSecondary: '#A0AEC0',
  textMuted: '#718096',
  accentColor: 'rgba(40, 72, 184, 1)',
  borderColor: '#4A5568',
  statusBarContent: 'light-content',
};

const createCashbackConditionsStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBackground,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 30,
    marginTop: 5,
  },
  headerTitle: {
    fontSize: 17,
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
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
  introParagraph: {
    marginHorizontal: 20,
    fontSize: 15,
    lineHeight: 22,
    color: theme.textSecondary,
    marginBottom: 20,
    textAlign: 'justify',
  },
  sectionHeader: {
    marginHorizontal: 20,
    marginTop: 0,
    marginBottom: 10,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'justify',
  },
  listItem: {
    marginHorizontal: 20,
    fontSize: 15,
    lineHeight: 22,
    color: theme.textSecondary,
    marginBottom: 10,
    textAlign: 'left',
  },
  subListItem: {
    marginLeft: 35,
    marginRight: 20,
    fontSize: 15,
    lineHeight: 22,
    color: theme.textSecondary,
    marginBottom: 8,
    textAlign: 'left',
  },
  emphasisText: {
    fontWeight: '600',
    color: theme.textPrimary,
  },
  highlightText: {
    color: theme.accentColor,
    fontWeight: '600',
  },
  finalCallToAction: {
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
    fontSize: 15,
    lineHeight: 22,
    color: theme.textSecondary,
    textAlign: 'center',
  },
  logo: {
    marginVertical: 10,
    width: '100%',
    height: 180,
    resizeMode: 'contain',
    borderRadius: 14,
  },
  sectionlogo: {
    padding: 10,
    marginHorizontal: 16,
    position: 'relative',
    width: '92%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    overflow: 'hidden',
  },
  pulseShadow: { position: 'absolute', width: 80, height: 80, borderRadius: 40, left: '50%', top: '50%', zIndex: 2 },
  playButtonContainer: { position: 'absolute', left: '50%', top: '50%', zIndex: 3, transform: [{ translateX: -30 }, { translateY: -30 }] },
  playButtonCircle: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
  playButtonText: { color: '#1e90ff', fontSize: 26, marginLeft: 3, fontWeight: '600', marginBottom: 5 },
  Titlelogo: {
    marginTop: 2,
    width: 25,
    height: 25,
    padding: 10,
    resizeMode: 'contain',
    marginBottom: 0,
  },
  TitleText: {
    marginTop: 0,
    marginHorizontal: 0,
    marginBottom: 12,
    fontSize: 22,
    fontWeight: '700',
  },
  sectionHeaderFlex: {
    marginHorizontal: 20,
    flexDirection: 'row',
  },
  sectionBg1: {
    marginTop: 10,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  abouts: {
    fontSize: 28,
    color: '#003366',
    fontWeight: '700',
  },
  aboutsSpan: {
    color: '#0147AB',
  },
  sectionContainer: {
    padding: 10,
    marginVertical: 0,
    borderRadius: 12,
  },
  emailLink: {
    textDecorationLine: 'underline',
    color: '#0d6efd',
    fontSize: 15,
  },
  footerContainer: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  footerImageWrapper: {
    width: '92%',
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 6,
    marginBottom: 10,
  },
  footerImage: {
    width: '100%',
    height: 280,
    resizeMode: 'cover',
  },
  footerCaption: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  footerHeadline: {
    fontSize: 22,
    fontWeight: '700',
    color: '#003366',
    textAlign: 'center',
    marginVertical: 8,
  },
  footerLogo: {
    width: 220,
    height: 80,
    resizeMode: 'contain',
    marginTop: 8,
    marginBottom: 8,
  },
  footerTaglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  footerTaglineLeft: {
    color: '#d9534f',
    fontStyle: 'italic',
    marginRight: 6,
    fontWeight: '600',
  },
  footerTaglineRight: {
    color: '#2e8b57',
    fontStyle: 'italic',
    fontWeight: '600',
  },
  footerLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  footerLinkText: {
    color: '#2563eb',
    textDecorationLine: 'none',
    marginHorizontal: 8,
    fontSize: 13,
  },
  footerCopyright: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: { width: '80%', backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, borderRadius: 10, alignItems: 'center' },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(20, 52, 164, 1)',
    alignSelf: 'flex-start',
    paddingBottom: 6,
    // borderBottomWidth: 3,
    // borderBottomColor: '#0b4bd6',
    marginBottom: 6,
  },
  modalClose: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#777',
    position: 'relative',
    bottom: 5,
  },
  modalBodyText: {
    color: '#333',
    fontSize: 16,
    marginBottom: 20, textAlign: 'center'
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  modalButton: {
    flex: 0,
    width: 100,
    marginHorizontal: 8,
    backgroundColor: '#1434a4',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  borderLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: "100%",
    marginBottom: 15,
  },
});

const AboutUs = ({ navigation, route }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkThemeColors : lightThemeColors;
  const styles = createCashbackConditionsStyles(theme);
  const isDarkMode = useColorScheme() === 'dark';
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const REFER_EARN_FOLDER_ID = '9ebe21e5639c440c930ba642a07d0a0b';

  const [isAboutModalVisible, setIsAboutModalVisible] = useState(false);
  const [referEarnVideos, setReferEarnVideos] = useState({});
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [selectedVideoGroup, setSelectedVideoGroup] = useState(null);
  useEffect(() => {
    const backAction = () => {
      if (navigation && typeof navigation.canGoBack === 'function' && navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }
      if (route && route.params && route.params.origin) {
        navigation.navigate(route.params.origin);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      backHandler.remove();
    };
  }, [navigation]);

  useEffect(() => {
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

  const fetchReferEarnVideos = async () => {
    const netInfoState = await NetInfo.fetch();
    if (!netInfoState.isInternetReachable) {
      Alert.alert('No Internet', 'Please check your internet connection.');
      return null;
    }
    const storedToken = await AsyncStorage.getItem('token');
    if (!storedToken) {
      Alert.alert('Login Required', 'Please log in to play this video.');
      return null;
    }
    setIsVideoLoading(true);
    try {
      const DETAILS_ENDPOINT = `${BASE_URL}Vdocipher/GetAllVDOCipherVideosByFolderID?folderId=${REFER_EARN_FOLDER_ID}`;
      const response = await fetch(DETAILS_ENDPOINT, {
        method: 'GET',
        headers: { Authorization: `Bearer ${storedToken}`, Accept: 'application/json' },
      });
      if (!response.ok) {
        Alert.alert('Error', 'Failed to load videos.');
        return null;
      }
      const json = await response.json();
      setReferEarnVideos(json);
      return json;
    } catch (err) {
      Alert.alert('Error', 'Unable to fetch videos.');
      return null;
    } finally {
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
      videos.push({ id: englishItem.id, title: 'English', language: 'english', poster: englishItem.poster, length: englishItem.length });
    }
    if (hindiItem) {
      videos.push({ id: hindiItem.id, title: 'Hindi', language: 'hindi', poster: hindiItem.poster, length: hindiItem.length });
    }
    return videos;
  }, [referEarnVideos]);

  const loadAndOpenModal = async () => {
    const data = await fetchReferEarnVideos();
    if (data) {
      if (playableReferEarnVideos.length > 0) {
        const hindiVideo = playableReferEarnVideos.find(v => v.language === 'hindi');
        const englishVideo = playableReferEarnVideos.find(v => v.language === 'english');
        const videoGroup = { hindiVideo: hindiVideo ? { id: hindiVideo.id, poster: hindiVideo.poster } : null, englishVideo: englishVideo ? { id: englishVideo.id, poster: englishVideo.poster } : null, stepNumber: 'refer-and-earn' };
        setSelectedVideoGroup(videoGroup);
        setIsAboutModalVisible(true);
      } else {
        Alert.alert('Videos Not Available', 'Refer & Earn videos could not be loaded.');
      }
    }
  };

  const vdoCipher_api = async (videoId, tokenToUse) => {
    const netInfoState = await NetInfo.fetch();
    if (!netInfoState.isInternetReachable) {
      return { error: true, message: 'No internet' };
    }
    setIsVideoLoading(true);
    if (!videoId) return { error: true, message: 'Missing videoId' };
    try {
      const DETAILS_ENDPOINT = `${BASE_URL}Vdocipher/GetVDOCipher_VideosDetails?videoId=${videoId}`;
      const response = await fetch(DETAILS_ENDPOINT, {
        method: 'GET',
        headers: { Authorization: `Bearer ${tokenToUse}`, Accept: 'application/json' },
      });
      if (!response.ok) {
        let errorData = {};
        try { errorData = await response.json(); } catch (e) { }
        return { error: true, message: errorData.message || 'Failed to get video details' };
      }
      const videoDetails = await response.json();
      return videoDetails;
    } catch (err) {
      return { error: true, message: err.message };
    }
  };

  const handleVideoPlayback = async (videoId, language, title, poster) => {
    const netInfoState = await NetInfo.fetch();
    if (!netInfoState.isInternetReachable) {
      Alert.alert('No Internet Connection', 'Please check your internet connection and try again.');
      return;
    }
    setIsVideoLoading(true);
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      Alert.alert('Authentication Error', 'User ID not available for watermark. Please log in again.');
      setIsVideoLoading(false);
      return;
    }
    const nameRaw = await AsyncStorage.getItem('Name');
    const emailRaw = await AsyncStorage.getItem('userEmail');
    const phoneRaw = await AsyncStorage.getItem('phoneNumber');
    const sessionIdRaw = await AsyncStorage.getItem('sessionId');
    const name = typeof nameRaw === 'string' ? nameRaw : JSON.stringify(nameRaw);
    const email = typeof emailRaw === 'string' ? emailRaw : JSON.stringify(emailRaw);
    const phone = typeof phoneRaw === 'string' ? phoneRaw : JSON.stringify(phoneRaw);
    const sessionId = typeof sessionIdRaw === 'string' ? sessionIdRaw : JSON.stringify(sessionIdRaw);
    const annotationObject = [
      { type: 'rtext', text: name, alpha: 0.5, color: '0xFFFFFF', size: 14, interval: 5000, skip: 2000, x: 20, y: 5 },
      { type: 'rtext', text: email, alpha: 0.4, color: '0x00FFFF', interval: 10000, skip: 1000, size: 14, x: 20, y: 15 },
      { type: 'rtext', text: phone, alpha: 0.4, color: '0x00FF00', interval: 10000, skip: 1000, size: 14, x: 20, y: 25 },
      { type: 'rtext', text: sessionId, alpha: 0.4, color: '0xFF00FF', interval: 10000, skip: 500, size: 14, x: 20, y: 35 },
    ];
    const requestBody = { UserId: parseInt(userId, 10), VideoId: videoId, annotate: JSON.stringify(annotationObject) };
    try {
      const detailsData = await vdoCipher_api(videoId, token);
      if (detailsData && !detailsData.error) {
        const response = await fetch(`${BASE_URL}Vdocipher/GetVideosFromVDOCipher_VideoId`, {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(requestBody),
        });
        const text = await response.text();
        const parsed = text ? JSON.parse(text) : null;
        if (!response.ok) {
          Alert.alert('Error', (parsed && (parsed.message || parsed.error)) || text || `HTTP ${response.status}`);
          setIsVideoLoading(false);
        } else {
          const data = parsed || JSON.parse(text);
          navigation.navigate('VideoPlayerScreen', { id: videoId, otp: data.otp, playbackInfo: data.playbackInfo, language, title, poster, cameFrom: 'About Us' });
          setIsVideoLoading(false);
        }
      } else {
        Alert.alert('Error', detailsData?.message || 'Failed to fetch video details');
        setIsVideoLoading(false);
      }
    } catch (err) {
      Alert.alert('Network Error', `An unexpected error occurred: ${err?.message || err}`);
      setIsVideoLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1434A4" />
      <ScreenScroll contentContainerStyle={styles.scrollViewContent}>
        <LinearGradient
          colors={['#A0F0D1', '#B0E5FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.sectionBg1}
        >
          <Text style={styles.abouts}>About <Text style={styles.aboutsSpan}>Us</Text> </Text>
        </LinearGradient>

        <TouchableOpacity onPress={loadAndOpenModal} activeOpacity={0.9} style={styles.sectionlogo}>
          <Image
            source={require('../img/aboutusimg.png')}
            style={styles.logo}
            accessibilityLabel="App Logo"
          />
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
        </TouchableOpacity>

        {/* Inline modal that matches the Refer & Earn language selector design */}
        <Modal visible={isAboutModalVisible} transparent animationType="fade" onRequestClose={() => setIsAboutModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Language</Text>
                <Pressable onPress={() => setIsAboutModalVisible(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </Pressable>
              </View>
              <View style={styles.borderLine} />
              <Text style={styles.modalBodyText}>In which language would you like to watch this video?</Text>
              {isVideoLoading && <ActivityIndicator size="small" color="#0b4bd6" style={{ marginBottom: 10 }} />}
              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={async () => {
                    setIsAboutModalVisible(false);
                    const youtubeHindi = 'https://www.youtube.com/watch?v=2puDfTtzl00';
                    try {
                      await Linking.openURL(youtubeHindi);
                    } catch (err) {
                      Alert.alert('Unable to open', 'Could not open YouTube link.');
                    }
                  }}
                >
                  <Text style={styles.modalButtonText}>Hindi</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={async () => {
                    setIsAboutModalVisible(false);
                    const youtubeEnglish = 'https://www.youtube.com/watch?v=TLJ5kiQJTGU';
                    try {
                      await Linking.openURL(youtubeEnglish);
                    } catch (err) {
                      Alert.alert('Unable to open', 'Could not open YouTube link.');
                    }
                  }}
                >
                  <Text style={styles.modalButtonText}>English</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <View style={[
          styles.sectionContainer,
          { backgroundColor: isDarkMode ? '#282c34' : '#ffffff' },
          { borderColor: isDarkMode ? '#444' : '#e0e0e0' }
        ]}>

          <Text style={[
            styles.sectionHeader,
            { color: isDarkMode ? '#fff' : '#1434a4' }
          ]}>Who We Are</Text>
          <Text style={styles.introParagraph}>
            <Text style={{ fontWeight: 'bold' }}>SarvaShine Allrounder Baby Solutions Private Limited,</Text> operating as <Text style={{ fontWeight: 'bold' }}>AllrounderBaby.com, </Text>
            is a global parenting platform that provides <Text style={{ fontWeight: 'bold' }}>science-backed early childhood development solutions. </Text>
            Our goal is to help parents nurture their child's <Text style={{ fontWeight: 'bold' }}>nine type of intelligence </Text>through simple, and research-driven methods.
          </Text>

          <Text style={styles.introParagraph}>
            We believe that the early years are the foundation of a child's future. By combining <Text style={{ fontWeight: 'bold' }}> neuroscience, psychology, and education, </Text>
            We empower parents to raise children who are happy, confident, emotionally strong, and well-rounded.
          </Text>

          <Text style={styles.introParagraph}>
            At AllrounderBaby.com, we are more than just a company we are a movement dedicated to making parenting <Text style={{ fontWeight: 'bold' }}> joyful, clear, and fulfilling </Text>for families worldwide.
          </Text>

        </View>
        <LinearGradient
          colors={['#D0E8FF', '#E6F7FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.sectionContainer,
            { borderColor: isDarkMode ? '#444' : '#e0e0e0' },
            { marginBottom: 30 }
          ]}
        >
          <View style={styles.sectionHeaderFlex}>
            <Text style={[
              styles.TitleText,
              { color: isDarkMode ? '#fff' : '#1434a4' }
            ]}>
              Our Vision
            </Text>
          </View>
          <Text style={[styles.introParagraph, { marginBottom: 10 }]}>
            At<Text style={{ fontWeight: 'bold' }}> SarvaShine Allrounder Baby Solutions Pvt. Ltd., </Text> our vision is to be the <Text style={{ fontWeight: 'bold' }}>world’s most trusted and happiness-driven </Text>
            early childhood development platform. We aim to redefine parenting globally by combining <Text style={{ fontWeight: 'bold' }}>innovation, science, and empathy </Text>to make holistic child development
            <Text style={{ fontWeight: 'bold' }}>accessible and effective </Text>for every family.
          </Text>
          <Text style={{ paddingHorizontal: 20 }}>
            <Text>We are committed to:</Text>
          </Text>
          <Text style={{ paddingHorizontal: 20, marginTop: 5, marginBottom: 20 }}>
            <Text style={{ color: 'green', fontWeight: 'bold', }}>✔ </Text>Every child is given the opportunity to <Text style={{ fontWeight: 'bold' }}>develop all dimensions of intelligence </Text>and thrive.
            {'\n'}
            {'\n'}
            <Text style={{ color: 'green', fontWeight: 'bold', }}>✔ </Text>Parents everywhere feel <Text style={{ fontWeight: 'bold' }}>empowered, confident, and supported </Text>in their parenting journey.
            {'\n'}
            {'\n'}
            <Text style={{ color: 'green', fontWeight: 'bold', }}>✔ </Text>Early childhood development is recognized as a priority worldwide, with tools and guidance that make parenting a <Text style={{ fontWeight: 'bold' }}>delightful experience.</Text>
          </Text>
        </LinearGradient>
        <LinearGradient
          colors={['#FFF5E6', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.sectionContainer,
            { borderColor: isDarkMode ? '#444' : '#e0e0e0' },
            { marginBottom: 30 }
          ]}
        >
          <View style={styles.sectionHeaderFlex}>
            <Text style={[
              styles.TitleText,
              { color: isDarkMode ? '#fff' : '#1434a4' }
            ]}>
              Our Mission
            </Text>
          </View>
          <Text style={[styles.introParagraph, { marginBottom: 5 }]}>
            At <Text style={{ fontWeight: 'bold' }}>AllrounderBaby.com, </Text>our mission is to <Text style={{ fontWeight: 'bold' }}>make early childhood development simple, practical, and accessible for every parent.</Text>
          </Text>
          <Text style={{ paddingHorizontal: 20 }}>
            <Text>We are committed to:</Text>
          </Text>
          <Text style={{ paddingHorizontal: 20, marginTop: 5, marginBottom: 20 }}>
            <Text style={{ color: 'green', fontWeight: 'bold', }}>✔ </Text><Text style={{ fontWeight: 'bold' }}>Cost-effective solutions </Text>so every family can give their child the best start in life.
            {'\n'}
            {'\n'}
            <Text style={{ color: 'green', fontWeight: 'bold', }}>✔ </Text>Creating<Text style={{ fontWeight: 'bold' }}> products and programs for parents </Text>that guide them to <Text style={{ fontWeight: 'bold' }}>nurture and awaken all nine types of intelligence</Text> in children aged <Text style={{ fontWeight: 'bold' }}>0–5 years.</Text>
            {'\n'}
            {'\n'}
            <Text style={{ color: 'green', fontWeight: 'bold', }}>✔ </Text>Offering <Text style={{ fontWeight: 'bold' }}>simple tools and short video guides in multiple languages, </Text>making parenting accessible to families worldwide.
            {'\n'}
            {'\n'}
            <Text style={{ color: 'green', fontWeight: 'bold', }}>✔ </Text>Providing <Text style={{ fontWeight: 'bold' }}> step-by-step guidance </Text>that parents can follow easily.
            {'\n'}
            {'\n'}
            <Text style={{ color: 'green', fontWeight: 'bold', }}>✔ </Text>Promoting <Text style={{ fontWeight: 'bold' }}>screen-free learning </Text>while helping children grow happy, confident, and well-rounded.
            {'\n'}
            {'\n'}
            <Text style={{ color: 'green', fontWeight: 'bold', }}>✔ </Text>Offering <Text style={{ fontWeight: 'bold' }}>financially rewarding programs </Text>such as <Text style={{ fontWeight: 'bold' }}>Refer & Earn </Text>and <Text style={{ fontWeight: 'bold' }}>Cashback for Feedback, </Text>helping parents save while actively participating in our community.
            {'\n'}
            {'\n'}
            Our goal is to empower parents with <Text style={{ fontWeight: 'bold' }}>practical tools, clear guidance, and financial support </Text>so they can raise <Text style={{ fontWeight: 'bold' }}>intelligent, emotionally strong, and well-rounded children, </Text>making parenting <Text style={{ fontWeight: 'bold' }}>joyful, effective, and stress-free.</Text>
          </Text>
        </LinearGradient>
        <View style={[
          styles.sectionContainer,
          { backgroundColor: isDarkMode ? '#282c34' : '#ffffff' },
          { borderColor: isDarkMode ? '#444' : '#e0e0e0' },
          { marginBottom: 30 }
        ]}>
          <Text style={[
            styles.sectionHeader,
            { color: isDarkMode ? '#fff' : '#1434a4' }
          ]}>Our Core Values</Text>
          <Text style={[styles.introParagraph, { marginBottom: 0 }]}>
            At <Text style={{ fontWeight: 'bold' }}>SarvaShine Allrounder Baby Solutions Pvt. Ltd., </Text>our core values define how we serve parents and shape the future of early childhood development:
          </Text>
          <Text style={[styles.introParagraph, { marginBottom: 0 }]}>
            {'\n'}
            <Text style={{ fontWeight: 'bold' }}>💙 Empathy-Driven Support – </Text>We understand the real challenges of parenting and provide practical, compassionate guidance for every family.
          </Text>
          <Text style={[styles.introParagraph, { marginBottom: 0 }]}>
            {'\n'}
            <Text style={{ fontWeight: 'bold' }}>🔬 Innovation & Research Excellence – </Text>All our products and programs are <Text style={{ fontWeight: 'bold' }}>research-backed </Text>and designed to effectively nurture children’s <Text style={{ fontWeight: 'bold' }}>nine types of intelligence.</Text>
          </Text>
          <Text style={[styles.introParagraph, { marginBottom: 0 }]}>
            {'\n'}
            <Text style={{ fontWeight: 'bold' }}>🤝 Integrity & Transparency – </Text>We deliver honest, ethical, and reliable parenting solutions, ensuring parents can trust us completely.
          </Text>
          <Text style={[styles.introParagraph, { marginBottom: 0 }]}>
            {'\n'}
            <Text style={{ fontWeight: 'bold' }}>🌍 Global Community & Collaboration – </Text>We connect parents, experts, and educators worldwide to build a <Text style={{ fontWeight: 'bold' }}>supportive, inspiring parenting network.</Text>
          </Text>
          <Text style={[styles.introParagraph, { marginBottom: 10 }]}>
            {'\n'}
            <Text style={{ fontWeight: 'bold' }}>🎉 Joyful & Practical Parenting – </Text>We make parenting a <Text style={{ fontWeight: 'bold' }}>delightful, rewarding experience,</Text> combining fun, learning, and real-life practicality.
          </Text>
        </View>
        <LinearGradient
          colors={['#DFFFEA', '#F0FFF5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.sectionContainer,
            { borderColor: isDarkMode ? '#444' : '#e0e0e0' },
            { marginBottom: 30 }
          ]}
        >
          <Text style={[
            styles.sectionHeader,
            { color: isDarkMode ? '#fff' : '#1434a4' }
          ]}>The AllRounder Method</Text>
          <Text style={[styles.introParagraph, { marginBottom: 0 }]}>
            At <Text style={{ fontWeight: 'bold' }}>AllrounderBaby.com, </Text>we created the <Text style={{ fontWeight: 'bold' }}>Ultimate Result-Oriented Videos—step-by-step guides focused entirely on “how” to awaken all nine types of intelligence</Text>  in children aged <Text style={{ fontWeight: 'bold' }}>0–5 years.</Text>
          </Text>
          <Text style={[styles.introParagraph, { marginBottom: 10 }]}>
            {'\n'}
            Our approach is <Text style={{ fontWeight: 'bold' }}>practical, simple, and powerful, </Text>designed to work for <Text style={{ fontWeight: 'bold' }}>every family worldwide,</Text> regardless of parenting style or lifestyle. These videos empower parents with <Text style={{ fontWeight: 'bold' }}>clear, actionable guidance, </Text>helping children grow into <Text style={{ fontWeight: 'bold' }}>happy, confident, and well-rounded individuals.</Text>
          </Text>
        </LinearGradient>
        <LinearGradient
          colors={['#FFF0E6', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.sectionContainer,
            { borderColor: isDarkMode ? '#444' : '#e0e0e0' },
            { marginBottom: 30 }
          ]}
        >
          <Text style={[
            styles.sectionHeader,
            { color: isDarkMode ? '#fff' : '#1434a4' }
          ]}>Our Story</Text>
          <Text style={[styles.introParagraph, { marginBottom: 0 }]}>
            Every great company begins with a powerful <Text style={{ fontWeight: 'bold' }}>WHY: parents deserve happiness, and children deserve the best start in life.</Text>
          </Text>
          <Text style={[styles.introParagraph, { marginBottom: 0 }]}>
            {'\n'}
            For most families, parenting often focuses on <Text style={{ fontWeight: 'bold' }}>basic baby milestones —</Text> changing <Text style={{ fontWeight: 'bold' }}>diapers, feeding, </Text>managing <Text style={{ fontWeight: 'bold' }}>sleep routines, tummy time, </Text>or celebrating when a child <Text style={{ fontWeight: 'bold' }}>sits, walks, </Text>or <Text style={{ fontWeight: 'bold' }}>speaks</Text> their first words. These are all
            <Text style={{ fontWeight: 'bold' }}>important and precious, </Text>but parenting should not be <Text style={{ fontWeight: 'bold' }}>limited </Text>to them.
          </Text>
          <Text style={[styles.introParagraph, { marginBottom: 0 }]}>
            {'\n'}
            Many parents still struggle with <Text style={{ fontWeight: 'bold' }}>conflicting advice</Text> and <Text style={{ fontWeight: 'bold' }}>uncertainty </Text>about how to nurture
            <Text style={{ fontWeight: 'bold' }}> newborns, toddlers, and preschoolers. </Text>Despite decades of <Text style={{ fontWeight: 'bold' }}>global research on early childhood development, </Text>
            families often do not know how to <Text style={{ fontWeight: 'bold' }}>apply science-backed methods </Text>in everyday life.
          </Text>
          <Text style={[styles.introParagraph, { marginBottom: 0 }]}>
            {'\n'}
            <Text style={{ fontWeight: 'bold' }}>Shubha Nayak, </Text>founder of <Text style={{ fontWeight: 'bold' }}>AllrounderBaby.com, </Text>asked a bigger question: What if parents could also
            <Text style={{ fontWeight: 'bold' }}>awaken a child’s intelligence </Text>during these early years — without  <Text style={{ fontWeight: 'bold' }}>pressure, stress, </Text>or <Text style={{ fontWeight: 'bold' }}>confusion?
            </Text>
          </Text>
          <Text style={[styles.introParagraph, { marginBottom: 0 }]}>
            {'\n'}
            By applying <Text style={{ fontWeight: 'bold' }}>research-backed parenting methods,</Text>it became clear that children can develop  <Text style={{ fontWeight: 'bold' }}>all nine types of intelligence </Text>when guided properly. This transforms
            <Text style={{ fontWeight: 'bold' }}>routine parenting </Text>into an <Text style={{ fontWeight: 'bold' }}>opportunity for growth, </Text>making the journey
            <Text style={{ fontWeight: 'bold' }}>less exhausting </Text> and <Text style={{ fontWeight: 'bold' }}>far more rewarding.</Text>
          </Text>
          <Text style={[styles.introParagraph, { marginBottom: 0 }]}>
            {'\n'}
            From a <Text style={{ fontWeight: 'bold' }}>personal initiative </Text> to a <Text style={{ fontWeight: 'bold' }}>global parenting movement, AllrounderBaby.com </Text>has empowered
            <Text style={{ fontWeight: 'bold' }}>thousands of parents </Text>to raise <Text style={{ fontWeight: 'bold' }}>happy, confident, and well-rounded children. </Text>
            Our programs are <Text style={{ fontWeight: 'bold' }}>practical, evidence-based, </Text>and <Text style={{ fontWeight: 'bold' }}>cost-effective, </Text>ensuring <Text style={{ fontWeight: 'bold' }}>every family </Text> can benefit.
          </Text>
          <Text style={[styles.introParagraph, { marginBottom: 20 }]}>
            {'\n'}
            Looking ahead, we aim to <Text style={{ fontWeight: 'bold' }}>empower parents, transform societies, </Text> and <Text style={{ fontWeight: 'bold' }}>help children thrive, </Text> making
            <Text style={{ fontWeight: 'bold' }}>early childhood development accessible, actionable, and joyful </Text> for all families.

          </Text>
        </LinearGradient>
        <LinearGradient
          colors={['#E6FFE6', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.sectionContainer,
            { borderColor: isDarkMode ? '#444' : '#e0e0e0' },
            { marginBottom: 30 }
          ]}
        >

          <Text style={[
            styles.sectionHeader,
            { color: isDarkMode ? '#fff' : '#1434a4' }
          ]}>About the Creator</Text>
          <View style={styles.footerContainer}>
            <View style={styles.footerImageWrapper}>
              <Image
                source={require('../img/newimg.jpeg')}
                style={styles.footerImage}
                accessibilityLabel="Founder and CEO"
              />
            </View>
          </View>
          <Text style={[styles.introParagraph, { textAlign: 'center', fontSize: 12, lineHeight: 15, marginBottom: 5, fontStyle: 'italic' }]}>Courtesy: Shubha Nayak with the late Dr. A.P.J. Abdul Kalam</Text>
          <Text style={[styles.introParagraph, { textAlign: 'center', fontSize: 12, lineHeight: 15, fontStyle: 'italic' }]}>(President of India, 2002–2007), Chennai (2013) (Personal Archive)</Text>
          <Text style={[styles.introParagraph, { marginBottom: 0 }]}><Text style={{ fontWeight: 'bold' }}>Shubha Nayak </Text>is the Founder and CEO of <Text style={{ fontWeight: 'bold' }}>Sarvashine Allrounder Baby Solution Pvt. Ltd., </Text>the company behind AllrounderBaby.com. An alumna of <Text style={{ fontWeight: 'bold' }}>NIT </Text>
            (National Institute of Technology -Raipur, India) and <Text style={{ fontWeight: 'bold' }}>BITS Pilani </Text>(Birla Institute of Technolohy & Sciences, India) with a background in <Text style={{ fontWeight: 'bold' }}>Biotechnology, </Text> Shubha began her career at Sankara Nethralaya’s Vision Research Foundation, where she had the honor of meeting
            <Text style={{ fontWeight: 'bold' }}>Dr. A.P.J. Abdul Kalam — </Text>a moment that inspired her lifelong commitment to <Text style={{ fontWeight: 'bold' }}>research and impact. </Text>After working in the healthcare domain at <Text style={{ fontWeight: 'bold' }}>IBM India Pvt. Ltd., </Text>Shubha’s journey into
            <Text style={{ fontWeight: 'bold' }}> parenthood </Text>led her to deep research on<Text style={{ fontWeight: 'bold' }}>  early childhood development </Text>
            and the <Text style={{ fontWeight: 'bold' }}>9 types of intelligence </Text>in children. Her scientific approach to parenting laid the foundation for <Text style={{ fontWeight: 'bold' }}>AllrounderBaby.com — </Text>
            a practical, research-backed program designed to help parents unlock their child’s <Text style={{ fontWeight: 'bold' }}>a practical, research-backed program designed to help parents unlock their child’s </Text>
          </Text>
        </LinearGradient>
        {/* <LinearGradient
          colors={['#FFFDE5', '#FFFFFF']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[
            styles.sectionContainer,
            { borderColor: isDarkMode ? '#444' : '#e0e0e0' },
          ]}
        >

          <View style={styles.footerContainer}>
            <View style={styles.footerImageWrapper}>
              <Image
                source={require('../img/Picture3.png')}
                style={styles.footerImage}
                accessibilityLabel="Baby image"
              />
            </View>
            <Text style={styles.footerCaption}>Courtesy: Dishaan, 8 months old, son of Shubha Nayak (Personal Archive)</Text>

            <Text style={styles.footerHeadline}>Give your child the gift of becoming an Allrounder!</Text>

            <Image
              source={require('../img/loginlogo.png')}
              style={styles.footerLogo}
              accessibilityLabel="AllrounderBaby logo"
            />

            <View style={styles.footerTaglineRow}>
              <Text style={styles.footerTaglineLeft}>Start Early,</Text>
              <Text style={styles.footerTaglineRight}>Shine Always!</Text>
            </View>

            <View style={styles.footerLinksRow}>
              <Text style={styles.footerLinkText}>Privacy Policy</Text>
              <Text style={{ color: '#9ca3af' }}>|</Text>
              <Text style={styles.footerLinkText}>Terms of Service</Text>
            </View>

            <Text style={styles.footerCopyright}>© 2025 Sarvashine Allrounder Baby Solutions Pvt. Ltd. All rights reserved.</Text>
          </View>

        </LinearGradient> */}
      </ScreenScroll>
    </View>
  );
};
export default AboutUs;
