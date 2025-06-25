import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
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
  Platform,
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
// VdoPlayerView is not needed here anymore as video playback is moved to VideoPlayerScreen
// import { VdoPlayerView } from 'vdocipher-rn-bridge';

const { width, height } = Dimensions.get('window');

// Theme colors are directly used from the provided structure
const lightThemeColors = {
  screenBackground: '#F4F6F8',
  cardBackground: '#FFFFFF',
  textPrimary: '#1A202C',
  textSecondary: '#4A5568',
  textMuted: '#718096',
  accentColor: 'rgba(20, 52, 164, 1)',
  linkColor: 'rgba(20, 52, 164, 1)',
  borderColor: '#E2E8F0',
  iconColor: '#4A5568',
  videoIconTint: 'rgba(20, 52, 164, 1)',
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
  textPrimary: '#E2E8F0',
  textSecondary: '#A0AEC0',
  textMuted: '#718096',
  accentColor: 'rgba(40, 72, 184, 1)',
  linkColor: '#63B3ED',
  borderColor: '#4A5568',
  iconColor: '#A0AEC0',
  videoIconTint: 'rgba(40, 72, 184, 1)',
  bottomNavBackground: '#2D3748',
  bottomNavActiveTint: '#63B3ED',
  bottomNavInactiveTint: '#718096',
  bottomNavShadowColor: '#000000',
  statusBarContent: 'light-content',
  elevation: 0,
};

const url = 'https://allrounderbaby-czh8hubjgpcxgrc7.canadacentral-01.azurewebsites.net/api/';

const CashbackforFeedback = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkThemeColors : lightThemeColors;
  const styles = createCashbackStyles(theme);
  const isDarkMode = useColorScheme() === 'dark';
  // Using `navigation` prop directly instead of `useNavigation()` to avoid potential confusion
  // const navigations = useNavigation();


  const [token, setToken] = useState(null);
  const [userId, setUserID] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [cashbackVideos, setCashbackVideos] = useState({});

  // All in-page video playback states, refs, and related callbacks are removed.

  // Opacity for blinking loading text (if still needed for general loading)
  const opacity = useRef(new Animated.Value(1)).current;

  // Folder ID for cashback videos
  const CASHBACK_FOLDER_ID = "3b7737b5e34740318231b0f1c0797b34";

  // BackHandler now only handles navigation, as no in-page player needs closing
  useEffect(() => {
    const backAction = () => {
      // Navigate to 'Home' which is where the Dashboard is registered in App.js
      // If 'Cashback for Feedback' is a top-level screen, this should bring the user back to the main app flow.
      navigation.navigate('Home');
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUserId = await AsyncStorage.getItem('userId');
      setUserID(storedUserId);
      setToken(storedToken);
    };
    loadUserData();
  }, []);

  // Fetch cashback videos once token is available
  useEffect(() => {
    if (token) {
      fetchCashbackVideos(CASHBACK_FOLDER_ID);
    }
  }, [token]);

  // Blinking animation for loading text (if used)
  useEffect(() => {
    const blinkingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    );
    blinkingAnimation.start();
    return () => blinkingAnimation.stop();
  }, []);

  // Function to fetch all VDOCipher videos by folder ID
  const fetchCashbackVideos = async (folderId) => {
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
      setCashbackVideos(videoDetails);
      return videoDetails;
    } catch (error) {
      Alert.alert("Network Error", `An unexpected error occurred: ${error.message}`);
      return null;
    } finally {
      setIsVideoLoading(false);
    }
  };

  // Function to get VDOCipher video details for playback
  const vdoCipher_api = async (videoId) => {
    const netInfoState = await NetInfo.fetch();
    if (!netInfoState.isInternetReachable) {
      Alert.alert(
        "No Internet Connection",
        "Please check your internet connection and try again."
      );
      return { error: true, message: "No internet connection" };
    }

    // Set loading state as we're preparing to load the video on a new screen
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
        return { error: true, message: `Failed to get video details: ${errorData.message || response.statusText}` };
      }

      const videoDetails = await response.json();
      return videoDetails;
    } catch (error) {
      return { error: true, message: `An unexpected error occurred: ${error.message}` };
    } finally {
      // Loading is turned off after navigation or error
    }
  };

  // Handles navigation to the VideoPlayerScreen with the fetched details
  const handleVideoPlayback = async (videoId, language, title, poster) => {
    const netInfoState = await NetInfo.fetch();
    if (!netInfoState.isInternetReachable) {
      Alert.alert(
        "No Internet Connection",
        "Please check your internet connection and try again."
      );
      return;
    }

    setIsVideoLoading(true); // Indicate loading as we fetch video details

    const annotationObject = [
      {
        type: 'rtext',
        text: '{AllRounderBaby}',
        alpha: '0.60',
        color: '0xFF0000',
        size: '20',
        interval: '5000',
      },
    ];

    const requestBody = {
      userId: userId,
      videoId: videoId,
      annotate: JSON.stringify(annotationObject)
    };

    try {
      if (videoId) {
        const detailsData = await vdoCipher_api(videoId);
        if (detailsData && !detailsData.error) {
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
            setIsVideoLoading(false); // Turn off loading on error
          } else {
            const data = await response.json();
            navigation.navigate('VideoPlayerScreen', { // Correct navigation name
              id: videoId,
              otp: data.otp,
              playbackInfo: data.playbackInfo,
              language: language,
              title: title,
              poster: poster,
              cameFrom: 'Cashback for Feedback', // <--- THIS IS THE CORRECT NAME (with spaces)
            });
            setIsVideoLoading(false); // Turn off loading once navigation is initiated
          }
        } else {
          Alert.alert("Error", detailsData?.message || "Failed to fetch video details from Vdocipher API.");
          setIsVideoLoading(false); // Turn off loading on error
        }
      } else {
        Alert.alert("Error", "Video not found.");
        setIsVideoLoading(false); // Turn off loading on error
      }
    } catch (err) {
      Alert.alert("Network Error", `An unexpected error occurred: ${err.message}`);
      setIsVideoLoading(false); // Turn off loading on error
    }
  };

  // This function is no longer strictly necessary if not showing duration on list,
  // but kept for completeness if needed elsewhere.
  const formatDuration = (totalSeconds) => {
    if (isNaN(totalSeconds) || totalSeconds < 0) {
      return "--:--";
    }
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  // Memoized list of playable cashback videos
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
        length: englishCashbackItem.length
      });
    }

    if (hindiCashbackItem) {
      videos.push({
        id: hindiCashbackItem.id,
        title: 'Hindi',
        language: 'hindi',
        poster: hindiCashbackItem.poster,
        length: hindiCashbackItem.length
      });
    }

    return videos;
  }, [cashbackVideos]);

  // Navigate to Cashback for Feedback Conditions screen
  const onPressKnowMoreButton = () => {
    navigation.navigate('Cashback for Feedback Conditions');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.statusBarContent} backgroundColor={theme.screenBackground} />

      {/* Main content for Cashback for Feedback */}
      <>
        <View style={[styles.importantDetailsBox, { marginTop: 10 }]}>
          <Text style={styles.headerTitle}>🎉 Give Feedback & Get ₹1,000 / $10 / €10 Cashback! 🎉</Text>
        </View>
        <View style={styles.sectionDivider} />

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.importantDetailsBox}>
            <Text style={styles.introParagraph}>
              Your feedback is precious!💖 Help us to evolve <Text style={styles.emphasisText}>Allrounderbaby.com</Text> and get rewarded with cashback up to <Text style={styles.emphasisText}>₹1,000 / $10 / €10 !</Text> 💰
            </Text>
          </View>
          <View style={styles.sectionDivider} />
          <View style={styles.importantDetailsBox}>
            <Text style={[
              styles.sectionHeader,
              { color: isDarkMode ? '#fff' : '#1434a4' }
            ]}>🛠 How It Works?</Text>
            <Text style={styles.listItem}>
              <Text style={styles.emphasisText}>� 1️⃣ Submit Your Feedback on Our Website ✍️</Text>
            </Text>
            <Text style={styles.subListItem}>
              💬 Share your <Text style={styles.emphasisText}>detailed experience</Text> about the program.
            </Text>
            <Text style={styles.listItem}>
              <Text style={styles.emphasisText}>🟡 2️⃣ Get Up to ₹1,000 / $10 / €10 Cashback! 💰🎉</Text>
            </Text>
            <Text style={styles.subListItem}>
              🎁 The cashback amount will be <Text style={styles.emphasisText}>credited to your account upon approval.</Text>
            </Text>
          </View>
          <View style={styles.sectionDivider} />

          <View style={styles.importantDetailsBox}>
            <Text style={[
              styles.sectionHeader,
              { color: isDarkMode ? '#fff' : '#1434a4' }
            ]}>📌 Important Details</Text>
            <Text style={styles.detailPoint}>
              <Text style={styles.emphasisText}>✅ One-time submission per user</Text> – You can submit feedback <Text style={styles.emphasisText}>only once.</Text>
            </Text>
            <Text style={styles.detailPoint}>
              <Text style={styles.emphasisText}>✅ Cashback is processed within 1 to 60 days after approval.</Text>
            </Text>
            <Text style={[styles.detailPoint, styles.finalCallToAction]}>
              <Text style={styles.emphasisText}>📲 Visit our website now & submit your feedback! 🚀</Text>
            </Text>
          </View>

          <TouchableOpacity onPress={onPressKnowMoreButton} style={styles.linkButton}>
            <Text style={styles.linkText}>Know more</Text>
          </TouchableOpacity>

          <View style={styles.videoLinksContainer}>
            {/* Show loading indicator if videos are being fetched */}
            {isVideoLoading && playableCashbackVideos.length === 0 ? (
                <View style={styles.loadingMessageContainer}>
                    <ActivityIndicator size="small" color={theme.textSecondary} />
                    <Text style={[styles.introParagraph, { textAlign: 'center', paddingVertical: 10, color: theme.textSecondary }]}>Loading videos...</Text>
                </View>
            ) : playableCashbackVideos.length > 0 ? (
              playableCashbackVideos.map((video, index) => {
                return (
                  <React.Fragment key={video.id || index}>
                    <TouchableOpacity
                      style={styles.videoLinkItem}
                      onPress={() => handleVideoPlayback(video.id, video.language, video.title, video.poster)}
                    >
                      <View style={styles.videoLinkItemInner}>
                          <Image source={require('../img/play.png')}  style={styles.videoIcon} />
                        <Text style={styles.videoTitle}>{video.title}</Text>
                      </View>

                      <Image source={require('../img/arrowicon.png')} style={styles.arrowIcon} />
                    </TouchableOpacity>
                    {index < playableCashbackVideos.length - 1 && (
                      <View style={styles.videoItemDivider} />
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <Text style={[styles.introParagraph, { textAlign: 'center', paddingVertical: 20 }]}>No cashback videos available.</Text>
            )}
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
            <Image source={require('../img/hometab.png')} style={[styles.navIcon, { tintColor: theme.bottomNavInactiveTint }]} />
            <Text style={[styles.navText, { color: theme.bottomNavInactiveTint }]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Image source={require('../img/feedbacktab.png')} style={[styles.navIcon, { tintColor: theme.bottomNavActiveTint }]} />
            <Text style={[styles.navText, { color: theme.bottomNavActiveTint}]}>Cashback for Feedback</Text>
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
      </>
    </View>
  );
};

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
  subListItem: {
    marginLeft: 15,
    marginRight: 20,
    fontSize: 15,
    lineHeight: 22,
    color: theme.textSecondary,
    marginBottom: 8,
  },
  emphasisText: {
    fontWeight: '600',
    color: theme.textPrimary,
  },
  highlightText: {
    color: theme.accentColor,
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
  finalCallToAction: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
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
    minHeight: 100, // Ensure there's space for loading indicator if no videos initially
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
    width: '100%', // Ensure it takes full width of its container
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

  // Remaining styles (modal, loading, duration etc.) are kept as they might be used elsewhere
  modalLikeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  modalButton: {
    backgroundColor: 'rgba(20, 52, 164, 1)',
    paddingVertical: 10,
    width: 100,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContentClose: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContentMainDiv: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: '100%',
  },
  borderLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
    marginBottom: 15,
  },
  smallFullScreenPressable: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    bottom: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 16,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  timerImage: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  durationText: {
    color: 'white',
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: 'gray',
  },
});

export default CashbackforFeedback;
