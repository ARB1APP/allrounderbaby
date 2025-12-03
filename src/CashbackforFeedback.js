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
  Dimensions,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const { width, height } = Dimensions.get('window');

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

const url = 'https://allrounderbaby-czh8hubjgpcxgrc7.canadacentral-01.azurewebsites.net/api/';

const createCashbackStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.screenBackground,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 17,
    textAlign: 'center',
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 0,
    fontWeight: '600',
    color: theme.textPrimary,
    lineHeight: 24,
  },
  headerTitl: {
    fontSize: 17,
    textAlign: 'center',
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 0,
    fontWeight: '400',
    color: theme.textPrimary,
    lineHeight: 24,
  },
  Thumbnail: {
    fontSize: 16,
    lineHeight: 24,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: theme.borderColor,
    marginHorizontal: 20,
    marginVertical: 20,
  },
  introParagraph: {
    marginHorizontal: 20,
    fontSize: 15,
    lineHeight: 22,
    color: theme.textSecondary,
    marginBottom: 5,
  },
  sectionHeader: {
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 12,
    fontSize: 24,
    fontWeight: '600',
  },
  listItem: {
    marginHorizontal: 10,
    fontSize: 15,
    lineHeight: 22,
    color: theme.textSecondary,
    marginBottom: 8,
  },
  emphasisText: {
    fontWeight: '600',
    color: theme.textPrimary,
  },
   emphasisTexts: {
    fontWeight: '800',
    color: theme.textPrimary,
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
  detailPoint: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.textSecondary,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  linkButton: {
    alignSelf: 'flex-end',
    marginHorizontal: 20,
    marginTop: 15,
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
    marginBottom: 25,
    backgroundColor: theme.cardBackground,
    borderRadius: 10,
    borderWidth: theme.elevation === 0 ? 1 : 0,
    borderColor: theme.borderColor,
    elevation: theme.elevation,
    shadowColor: theme.bottomNavShadowColor,
    shadowOffset: { width: 0, height: 2 },
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
    backgroundColor: theme.bottomNavBackground,
    paddingVertical: 10,
    bottom: 0,
    width: '100%',
    shadowColor: theme.bottomNavShadowColor,
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
    fontSize: 10,
    marginTop: 4,
    fontWeight: 'bold',
  },
  modalLikeContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: theme.cardBackground,
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 380,
  },
  modalContentMainDiv: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 0,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.accentColor,
  },
  modalContentClose: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.textMutedClose,
  },
  borderLine: {
    borderBottomWidth: 1,
    borderBottomColor: theme.borderColorD,
    marginVertical: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: theme.textPrimaryModal,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    backgroundColor: theme.accentColorbg,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5
  },
  modalButtonText: {
    color: theme.cardBackgroundText, 
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: theme.textMuted,
  },
});

const CashbackforFeedback = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkThemeColors : lightThemeColors;
  const styles = useMemo(() => createCashbackStyles(theme), [theme]);
  const [token, setToken] = useState(null);
  const [userId, setUserID] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [cashbackVideos, setCashbackVideos] = useState({});
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [selectedVideoGroup, setSelectedVideoGroup] = useState(null);
  const CASHBACK_FOLDER_ID = "3b7737b5e34740318231b0f1c0797b34";

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Home');
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);

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

    const name = await AsyncStorage.getItem('Name') || 'N/A';
    const email = await AsyncStorage.getItem('userEmail') || 'N/A';
    const phone = await AsyncStorage.getItem('phoneNumber') || 'N/A';
    const sessionId = await AsyncStorage.getItem('sessionId');
    const watermarkText = `Name: ${name}, Email: ${email}, Phone: ${phone}, Session: ${sessionId}`;
    const annotationObject = [{
      type: 'rtext',
      text: watermarkText,
      alpha: '0.60',
      color: '0xFFFFFF',
      size: '16',
      interval: '5000',
    }];

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

        if (!response.ok) {
          const errorData = await response.json();
          Alert.alert("Error", errorData.message || "Video not found or failed to get OTP.");
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
            cameFrom: 'Cashback for Feedback',
            sessionId: sessionId,
          });
        }
      }
    } catch (err) {
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
    navigation.navigate('Cashback for Feedback Conditions');
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
      <StatusBar barStyle={theme.statusBarContent} backgroundColor={theme.screenBackground} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>

        <View style={[styles.importantDetailsBox, { marginTop: 10, marginBottom: 10 }]}>
          <Text style={styles.headerTitle}>Get ₹1,000 / $10 Cashback </Text>
          <Text style={styles.headerTitle}>
            <Text style={styles.headerTitl}>for your genuine</Text> Feedback!
          </Text>
        </View>
        <View style={styles.sectionDivider} />

        <View style={styles.importantDetailsBox}>
          <TouchableOpacity onPress={handleThumbnailClick}>
            <Text style={styles.introParagraph}>
              <Text style={styles.Thumbnail}>One video window – Full width thumbnail will be provided</Text>
              {'\n'}{'\n'}
              <Text style={styles.emphasisTexts}>Upon click it will ask Hindi / English</Text>
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sectionDivider} />
        
        <View style={styles.importantDetailsBox}>
          <Text style={[styles.sectionHeader, { color: theme.accentColor }]}>How It Works?</Text>
          <Text style={styles.listItem}>
            <Text style={styles.emphasisText}>1. </Text>
            Login to our website and submit your feedback
          </Text>
          <Text style={styles.listItem}>
            <Text style={styles.emphasisText}>2. </Text>
            Our team reviews and verifies your submission
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

        <TouchableOpacity onPress={onPressKnowMoreButton} style={styles.linkButton}>
          <Text style={styles.linkText}>Know more</Text>
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

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Image source={require('../img/hometab.png')} style={[styles.navIcon, { tintColor: theme.bottomNavInactiveTint }]} />
          <Text style={[styles.navText, { color: theme.bottomNavInactiveTint }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image source={require('../img/feedbacktab.png')} style={[styles.navIcon, { tintColor: theme.bottomNavActiveTint }]} />
          <Text style={[styles.navText, { color: theme.bottomNavActiveTint }]}>Cashback for Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Refer and Earn')}>
          <Image source={require('../img/money.png')} style={[styles.navIcon, { tintColor: theme.bottomNavInactiveTint }]} />
          <Text style={[styles.navText, { color: theme.bottomNavInactiveTint }]}>Refer & Earn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('My Profile')}>
          <Image source={require('../img/proflie.png')} style={[styles.navIcon, { tintColor: theme.bottomNavInactiveTint }]} />
          <Text style={[styles.navText, { color: theme.bottomNavInactiveTint }]}>My Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CashbackforFeedback;
