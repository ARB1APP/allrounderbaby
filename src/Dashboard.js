import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { StyleSheet, ScrollView, View, Image, Animated, Dimensions, Text, TouchableOpacity, Modal, Alert, BackHandler, StatusBar, ActivityIndicator,Pressable, useColorScheme, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; // Import useRoute
import { Colors } from 'react-native/Libraries/NewAppScreen';
import NetInfo from '@react-native-community/netinfo';
import { VdoPlayerView } from 'vdocipher-rn-bridge';
import { interval } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_KEY, API_BASE_URL } from '@env'; // Import API_BASE_URL from environment variables

const { width, height } = Dimensions.get('window');
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const url = 'https://allrounderbaby-czh8hubjgpcxgrc7.canadacentral-01.azurewebsites.net/api/';


const Dashboard = ({ navigation }) => {
    const [selectedStepGroup, setSelectedStepGroup] = useState(null);
    const scale1 = useRef(new Animated.Value(0)).current;
    const scale2 = useRef(new Animated.Value(0)).current;
    const scale3 = useRef(new Animated.Value(0)).current;
    const scale4 = useRef(new Animated.Value(0)).current;
    const navigations = useNavigation();
    const route = useRoute(); // Initialize useRoute to get current route name
    const playerRef = useRef(null);
    const intervalRef = useRef(null);
    const totalDurationRef = useRef(0);
    const [hasVideoPlayed, setHasVideoPlayed] = useState(false);
    const [isVideoFlagChecked, setIsVideoFlagChecked] = useState(false);
    const [otpData, setOtpData] = useState(null);
    const [error, setError] = useState(null);
    const [isVideoLoading, setIsVideoLoading] = useState(false);
    const [isHindiVideoVisible, setIsHindiVideoVisible] = useState(false);
    const [webViewKey, setWebViewKey, ] = useState(0);
    const webviewRef = useRef(null);
    const [currentVideoId, setCurrentVideoId] = useState(null);
    const [isFoundationShortVideo, setIsFoundationShortVideo] = useState(false);
    const [isFoundationDropdownVisible, setFoundationDropdownVisible] = useState(false);
    const [isMiddleLevelDropdownVisible, setMiddleLevelDropdownVisible] = useState(false);
    const [isAdvancedLevelDropdownVisible, setAdvancedLevelDropdownVisible] = useState(false);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [isDropdownVisibles, setDropdownVisibles] = useState(false);
    const [isDropdownVisibleRespect, setDropdownVisibleRespect] = useState(false);
    const [isDropdownVisibleFamiliar, setDropdownVisibleFamiliar] = useState(false);
    const [isDropdownVisibleCooperationPress, setDropdownVisibleCooperationPress] = useState(false);
    const [isDropdownVisibleImgainationandPretendPlay, setDropdownVisibleImgainationandPretendPlay] = useState(false);
    const [isDropdownVisibleHelp, setDropdownVisibleHelp] = useState(false);
    const [isDropdownVisibleDiscussionQuestionsAnswers, setDropdownVisibleDiscussionQuestionsAnswers] = useState(false);
    const [isDropdownVisibleAbletoNarrate, setDropdownVisibleAbletoNarrate] = useState(false);
    const [isDropdownVisibleEmotionsBlance, setDropdownVisibleEmotionsBlance] = useState(false);
    const [isDropdownVisibleFeelingsofOthers, setDropdownVisibleFeelingsofOthers] = useState(false);
    const [isDropdownVisibleKnowledgeandCuriousitydevelopment, setDropdownVisibleKnowledgeandCuriousitydevelopment] = useState(false);
    const [isDropdownVisibleSpeechDevelopment, setSpeechDevelopment] = useState(false);
    const [isDropdownVisibleTruth, setTruth ]= useState(false);
    const [isDropdownVisibleSetBoundaries, setSetBoundaries] = useState(false);
    const [isDropdownVisibleListenFollowInstructions, setListenFollowInstructions] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedStep, setSelectedStep] = useState(null);
    const [isVideoVisibleStep_1, setIsVideoVisibleStep_1] = useState(false);
    const [preferredLanguage, setPreferredLanguage] = useState({});
    const [foundationLevelTrustVideos, setfoundationLevelTrustVideos] = useState({});
    const [foundationLevelLoveAndCareVideos, setfoundationLevelLoveAndCareVideos] = useState({});
    const [respectLevelVideos, setRespectLevelVideos] = useState({});
    const [familiarLevelVideos, setFamiliarLevelVideos] = useState({});
    const [speechDevelopmentVideos, setSpeechDevelopmentVideos] = useState({});

    const [introductionVideos, setintroductionVideos ] = useState({});
    const [introductionvideosshow, setIntroductionvideosshow ] = useState(false);
    const handOpacity = useRef(new Animated.Value(0)).current;
    const handPositionX = useRef(new Animated.Value(screenWidth * 0.6)).current;
    const handPositionY = useRef(new Animated.Value(screenHeight * 0.4)).current;
    const handScale = useRef(new Animated.Value(1)).current;
    const [token, setToken] = useState(null);
    const [userId, setUserID ] = useState(null);

    const [completedSteps, setCompletedSteps] = useState({});
    const isDarkMode = useColorScheme() === 'dark';


    const [isLoading, setIsLoading] = useState(true);
    const maxWatchedTimeRef = useRef(0);
    const hasTrackedView = useRef(false);


        const backgroundStyle = {
            backgroundColor: isDarkMode ? '#2a3144' : Colors.white,
        };
        const opacity = useRef(new Animated.Value(1)).current;

        const startHandAnimation = () => {
            const targetX = screenWidth * 0.4;
            const targetY = screenHeight * 0.3;
            Animated.loop(
                Animated.sequence([
                    Animated.delay(1500),

                    Animated.parallel([
                        Animated.timing(handOpacity, {
                            toValue: 1,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        Animated.timing(handPositionX, {
                            toValue: targetX,
                            duration: 1000,
                            useNativeDriver: true,
                        }),
                        Animated.timing(handPositionY, {
                            toValue: targetY,
                            duration: 1000,
                            useNativeDriver: true,
                        }),
                    ]),
                    Animated.sequence([
                        Animated.timing(handScale, {
                            toValue: 0.85,
                            duration: 150,
                            useNativeDriver: true,
                        }),
                        Animated.timing(handScale, {
                            toValue: 1,
                            duration: 150,
                            useNativeDriver: true,
                        }),
                    ]),
                    Animated.delay(300),
                    Animated.parallel([
                        Animated.timing(handOpacity, {
                            toValue: 0,
                            duration: 300,
                            delay: 700,
                            useNativeDriver: true,
                        }),
                        Animated.timing(handPositionX, {
                            toValue: screenWidth * 0.6,
                            duration: 1000,
                            useNativeDriver: true,
                        }),
                        Animated.timing(handPositionY, {
                            toValue: screenHeight * 0.4,
                            duration: 1000,
                            useNativeDriver: true,
                        }),
                    ]),
                    Animated.delay(1000),
                ])
            ).start();
        };

    const fetchCompletedStepsFromBackend = async (currentUserId, currentToken) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${url}UserProgress/GetCompletedStepsByUserId?userId=${currentUserId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${currentToken}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                let errorData = { message: `HTTP Error: ${response.status} ${response.statusText}` };
                try {
                    errorData = await response.json();
                } catch (parseError) {
                    console.error("Error parsing fetchCompletedStepsFromBackend error JSON:", parseError);
                }
                Alert.alert("Error", `Failed to load progress: ${errorData.message || response.statusText}`);
                setCompletedSteps({});
            } else {
                const data = await response.json();
                if (data && data.completedSteps) {
                    try {
                        setCompletedSteps(JSON.parse(data.completedSteps));
                    } catch (e) {
                        console.error("Failed to parse completedSteps from backend:", e);
                        setCompletedSteps(data.completedSteps);
                    }
                } else {
                    setCompletedSteps({});
                }
            }
        } catch (error) {
            Alert.alert("Network Error", `Could not retrieve saved progress: ${error.message}`);
            setCompletedSteps({});
        } finally {
            setIsLoading(false);
        }
    };

    const saveCompletedStepsToBackend = async (updatedCompletedSteps) => {
        if (!userId || !token) {
            return;
        }

        try {
            const response = await fetch(`${url}UserProgress/SaveCompletedSteps`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: userId,
                    completedSteps: JSON.stringify(updatedCompletedSteps)
                }),
            });

            if (!response.ok) {
                let errorData = { message: `HTTP Error: ${response.status} ${response.statusText}` };
                try {
                    errorData = await response.json();
                } catch (parseError) {
                    console.error("Error parsing saveCompletedStepsToBackend error JSON:", parseError);
                }
                Alert.alert("Error", `Failed to save progress: ${errorData.message || response.statusText}`);
            } else {
            }
        } catch (error) {
            Alert.alert("Network Error", `Could not save progress: ${error.message}`);
        }
    };

        useEffect(() => {
            const loadUserDataAndProgress = async () => {
                const storedToken = await AsyncStorage.getItem('token');
                const storedUserId = await AsyncStorage.getItem('userId');

                setUserID(storedUserId);
                setToken(storedToken);

                if (storedToken && storedUserId) {
                    await fetchCompletedStepsFromBackend(storedUserId, storedToken);
                } else {
                    setIsLoading(false);
                }

            };

            loadUserDataAndProgress();

        }, []);
        useEffect(() => {
            const checkVideoPlayed = async () => {
                const value = await AsyncStorage.getItem('foundationVideoPlayed');
                if (value === 'true') {
                setHasVideoPlayed(true);
                }
                setIsVideoFlagChecked(true);
            };
            checkVideoPlayed();
        }, []);
        useEffect(() => {
            startHandAnimation();
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
            { iterations: 8 }
        );
        blinkingAnimation.start(() => {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
                }).start();
            });
        return () => blinkingAnimation.stop();
        }, []);

        const handleFoundationPress = () => {
            setFoundationDropdownVisible(!isFoundationDropdownVisible);
        };

        const handleIntroductionOnePress = async () =>{
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
                const folderId = "8a15a7910bcb41a897b50111ec4f95d9";
                const DETAILS_ENDPOINT = `${url}Vdocipher/GetAllVDOCipherVideosByFolderID?folderId=${folderId}`;
                try {
                    const response = await fetch(
                        DETAILS_ENDPOINT,
                        {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Accept': 'application/json'
                            }
                        }
                    );
                    if (!response.ok) {
                        setIsVideoLoading(false);
                        let errorData = { message: `HTTP Error: ${response.status} ${response.statusText}` };
                        try {
                            errorData = await response.json();
                        } catch (parseError) {
                            console.error("Error parsing fetchCompletedStepsFromBackend error JSON:", parseError);
                        }
                        Alert.alert("API Error", `Failed to get video details: ${errorData.message || response.statusText}`);
                        return null;
                    }
                    const videoDetails = await response.json();
                    setintroductionVideos(videoDetails);
                    setIsVideoLoading(false);
                    if (videoDetails.rows && videoDetails.rows.length >= 4) {
                        setSelectedStepGroup({
                            stepNumber: 90, // Changed from 7 to 90 to avoid conflict
                            hindiVideo: videoDetails.rows[2],
                            englishVideo: videoDetails.rows[3],
                        });
                    } else {
                        Alert.alert("Video Data Error", "Not enough introduction videos found for Introduction I.");
                        return null;
                    }

                    setIsModalVisible(true);
                    setSelectedStep(90); // Changed from 7 to 90
                    return videoDetails;
                } catch (error) {
                    setIsVideoLoading(false);
                    Alert.alert("Network Error", `An unexpected error occurred: ${error.message}`);
                    return null;
                }
            }

        const handleIntroductionTwoPress = async () =>{
            console.log('handleIntroductionTwoPress called.');
            const netInfoState = await NetInfo.fetch();
            console.log('NetInfo state:', netInfoState);

            if (!netInfoState.isInternetReachable) {
                console.log('No internet connection detected.');
                Alert.alert(
                    "No Internet Connection",
                    "Please check your internet connection and try again."
                );
                return;
            }
            if (!token) {
                console.log('Authentication token not found.');
                Alert.alert("Authentication Error", "User not authenticated. Please log in again.");
                return;
            }
            setIsVideoLoading(true);
            const folderId = "8a15a7910bcb41a897b50111ec4f95d9";
            const DETAILS_ENDPOINT = `${url}Vdocipher/GetAllVDOCipherVideosByFolderID?folderId=${folderId}`;
            console.log('Fetching video details from:', DETAILS_ENDPOINT);
            try {
                const response = await fetch(
                                    DETAILS_ENDPOINT,
                                    {
                                        method: 'GET',
                                        headers: {
                                            'Authorization': `Bearer ${token}`,
                                            'Accept': 'application/json'
                                        }
                                    }
                                );
                console.log('API response status:', response.status);
                if (!response.ok) {
                    setIsVideoLoading(false);
                    let errorData = { message: `HTTP Error: ${response.status} ${response.statusText}` };
                    try {
                        errorData = await response.json();
                        console.log('API Error Data:', errorData);
                    } catch (parseError) {
                        errorData = { message: response.statusText };
                        console.log('Failed to parse API error response, using status text.');
                    }
                    Alert.alert("API Error", `Failed to get video details: ${errorData.message || response.statusText}`);
                    return null;
                }
                const videoDetails = await response.json();
                console.log('Video details fetched successfully:', videoDetails);
                setintroductionVideos(videoDetails);
                setIsVideoLoading(false);
                if (videoDetails.rows && videoDetails.rows.length >= 4) {
                    setSelectedStepGroup({
                        stepNumber: 91, // Changed from 8 to 91 to avoid conflict
                        hindiVideo: videoDetails.rows[0],
                        englishVideo: videoDetails.rows[1],
                    });
                } else {
                    console.log('Not enough introduction videos found for Introduction II. Rows:', videoDetails.rows?.length);
                    Alert.alert("Video Data Error", "Not enough introduction videos found for Introduction II.");
                    return null;
                }
                setIsModalVisible(true);
                setSelectedStep(91); // Changed from 8 to 91
                return videoDetails;

            } catch (error) {
                console.error('Catch block: An unexpected error occurred during fetch:', error);
                setIsVideoLoading(false);
                Alert.alert("Network Error", `An unexpected error occurred: ${error.message}`);
                return null;
            }
        }

    const handleMiddleLevelPress = () => {
        const allFoundationStepsCompleted = completedSteps.step19 && completedSteps.step20 && completedSteps.step21 && completedSteps.step22 && completedSteps.step23 && completedSteps.step24 && completedSteps.step25 && completedSteps.step26 && completedSteps.step27 && completedSteps.step28 && completedSteps.step29;
        if (!allFoundationStepsCompleted) {
            setMiddleLevelDropdownVisible(false);
            Alert.alert(
                "Incomplete Steps",
                `Please complete all "Foundation Level" steps first. Only then "Middle Level" will be unlocked !`
            );
        } else {
            setMiddleLevelDropdownVisible(true);
        }
    };

    const handleAdvancedLevelPress = () => {
        const allMiddleLevelStepsCompleted = completedSteps.step45 && completedSteps.step46 && completedSteps.step47 && completedSteps.step48 && completedSteps.step49;
        if (!allMiddleLevelStepsCompleted) {
            setAdvancedLevelDropdownVisible(false);
            Alert.alert(
                "Incomplete Steps",
                `Please complete all "Middle Level" steps first. Only then "Advanced Level" will be unlocked !`
            );
        } else {
            setAdvancedLevelDropdownVisible(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setFoundationDropdownVisible(false);
        setMiddleLevelDropdownVisible(false);
        setAdvancedLevelDropdownVisible(false);

        setDropdownVisible(false);
        setDropdownVisibles(false);
        setDropdownVisibleRespect(false);
        setDropdownVisibleFamiliar(false);
        setSpeechDevelopment(false);
        setTruth(false);
        setSetBoundaries(false);
        setListenFollowInstructions(false);
        setDropdownVisibleCooperationPress(false);
        setDropdownVisibleImgainationandPretendPlay(false);
        setDropdownVisibleHelp(false);
        setDropdownVisibleDiscussionQuestionsAnswers(false);
        setDropdownVisibleAbletoNarrate(false);
        setDropdownVisibleEmotionsBlance(false);
        setDropdownVisibleFeelingsofOthers(false);
        setDropdownVisibleKnowledgeandCuriousitydevelopment(false);
    };
    function handleBackButtonClick() {
        navigation.navigate('Home');
        return true;
    }
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
    };
}, [navigations]);
    useEffect(() => {
        Animated.timing(scale1, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();

        Animated.timing(scale2, {
            toValue: 1,
            duration: 600,
            delay: 200,
            useNativeDriver: true,
        }).start();

        Animated.timing(scale3, {
            toValue: 1,
            duration: 600,
            delay: 200,
            useNativeDriver: true,
        }).start();

        Animated.timing(scale4, {
            toValue: 1,
            duration: 600,
            delay: 200,
            useNativeDriver: true,
        }).start();
    }, []);

    const onPressHandleStep_Hindi = async (step) => {
        let videoId = "";
        if (step >=1 && step <=6){
            switch (step) {
                case 1: videoId = groupedStepsData.find(g => g.stepNumber === step)?.hindiVideo?.id; break;
                case 2: videoId = groupedStepsData.find(g => g.stepNumber === step)?.hindiVideo?.id; break;
                case 3: videoId = groupedStepsData.find(g => g.stepNumber === step)?.hindiVideo?.id; break;
                case 4: videoId = groupedStepsData.find(g => g.stepNumber === step)?.hindiVideo?.id; break;
                case 5: videoId = groupedStepsData.find(g => g.stepNumber === step)?.hindiVideo?.id; break;
                case 6: videoId = groupedStepsData.find(g => g.stepNumber === step)?.hindiVideo?.id; break;
            }
        } else if (step >=7 && step <=13){
            const hindiVideo = loveAndCareGroupedStepsData.find(g => g.stepNumber === step)?.hindiVideo;
            videoId = hindiVideo?.id;

        } else if (step >= 14 && step <= 18) {
            const hindiVideo = respectGroupedStepsData.find(g => g.stepNumber === step)?.hindiVideo;
            videoId = hindiVideo?.id;
        } else if (step >= 19 && step <= 29) {
            const hindiVideo = familiarGroupedStepsData.find(g => g.stepNumber === step)?.hindiVideo;
            videoId = hindiVideo?.id;
        } else if (step >= 30 && step <= 34) {
            const hindiVideo = speechDevGroupedStepsData.find(g => g.stepNumber === step)?.hindiVideo;
            videoId = hindiVideo?.id;
        } else if (step >= 35 && step <= 38) {
            const hindiVideo = truthGroupedStepsData.find(g => g.stepNumber === step)?.hindiVideo;
            videoId = hindiVideo?.id;
        } else if (step >= 39 && step <= 44) {
            const hindiVideo = setBoundariesGroupedStepsData.find(g => g.stepNumber === step)?.hindiVideo;
            videoId = hindiVideo?.id;
        } else if (step >= 45 && step <= 49) {
            const hindiVideo = listenFollowGroupedStepsData.find(g => g.stepNumber === step)?.hindiVideo;
            videoId = hindiVideo?.id;
        } else if (step >= 50 && step <= 54) {
            const hindiVideo = cooperationGroupedStepsData.find(g => g.stepNumber === step)?.hindiVideo;
            videoId = hindiVideo?.id;
        } else if (step >= 55 && step <= 59) {
            const hindiVideo = imaginationGroupedStepsData.find(g => g.stepNumber === step)?.hindiVideo;
            videoId = hindiVideo?.id;
        } else if (step >= 60 && step <= 64) {
            const hindiVideo = helpGroupedStepsData.find(g => g.stepNumber === step)?.hindiVideo;
            videoId = hindiVideo?.id;
        } else if (step >= 65 && step <= 68) {
            const hindiVideo = discussionGroupedStepsData.find(g => g.stepNumber === step)?.hindiVideo;
            videoId = hindiVideo?.id;
        } else if (step >= 69 && step <= 72) {
            const hindiVideo = ableToNarrateGroupedStepsData.find(g => g.stepNumber === step)?.hindiVideo;
            videoId = hindiVideo?.id;
        } else if (step >= 73 && step <= 76) {
            const hindiVideo = emotionsBalanceGroupedStepsData.find(g => g.stepNumber === step)?.hindiVideo;
            videoId = hindiVideo?.id;
        } else if (step >= 77 && step <= 81) {
            const hindiVideo = feelingsOfOthersGroupedStepsData.find(g => g.stepNumber === step)?.hindiVideo;
            videoId = hindiVideo?.id;
        } else if (step >= 82 && step <= 85) {
            const hindiVideo = knowledgeCuriosityGroupedStepsData.find(g => g.stepNumber === step)?.hindiVideo;
            videoId = hindiVideo?.id;
        }
        else if (step === 90) { // Changed from 7 to 90
            videoId = introductionVideos.rows[2]?.id;
        } else if (step === 91) { // Changed from 8 to 91
            videoId = introductionVideos.rows[0]?.id;
        }

        if (videoId) {
            handleVideo(videoId, step, 'hindi');
        } else {
            Alert.alert("Alert", "Video not found for this step and language.");
        }
    };

    const onPressHandleStep_English = async (step) => {
        let videoId = "";
         if (step >=1 && step <=6){
            switch (step) {
                case 1: videoId = groupedStepsData.find(g => g.stepNumber === step)?.englishVideo?.id; break;
                case 2: videoId = groupedStepsData.find(g => g.stepNumber === step)?.englishVideo?.id; break;
                case 3: videoId = groupedStepsData.find(g => g.stepNumber === step)?.englishVideo?.id; break;
                case 4: videoId = groupedStepsData.find(g => g.stepNumber === step)?.englishVideo?.id; break;
                case 5: videoId = groupedStepsData.find(g => g.stepNumber === step)?.englishVideo?.id; break;
                case 6: videoId = groupedStepsData.find(g => g.stepNumber === step)?.englishVideo?.id; break;
            }
        } else if (step >=7 && step <=13){
            const englishVideo = loveAndCareGroupedStepsData.find(g => g.stepNumber === step)?.englishVideo;
            videoId = englishVideo?.id;
        } else if (step >= 14 && step <= 18) {
            const englishVideo = respectGroupedStepsData.find(g => g.stepNumber === step)?.englishVideo;
            videoId = englishVideo?.id;
        } else if (step >= 19 && step <= 29) {
            const englishVideo = familiarGroupedStepsData.find(g => g.stepNumber === step)?.englishVideo;
            videoId = englishVideo?.id;
        } else if (step >= 30 && step <= 34) {
            const englishVideo = speechDevGroupedStepsData.find(g => g.stepNumber === step)?.englishVideo;
            videoId = englishVideo?.id;
        } else if (step >= 35 && step <= 38) {
            const englishVideo = truthGroupedStepsData.find(g => g.stepNumber === step)?.englishVideo;
            videoId = englishVideo?.id;
        } else if (step >= 39 && step <= 44) {
            const englishVideo = setBoundariesGroupedStepsData.find(g => g.stepNumber === step)?.englishVideo;
            videoId = englishVideo?.id;
        } else if (step >= 45 && step <= 49) {
            const englishVideo = listenFollowGroupedStepsData.find(g => g.stepNumber === step)?.englishVideo;
            videoId = englishVideo?.id;
        } else if (step >= 50 && step <= 54) {
            const englishVideo = cooperationGroupedStepsData.find(g => g.stepNumber === step)?.englishVideo;
            videoId = englishVideo?.id;
        } else if (step >= 55 && step <= 59) {
            const englishVideo = imaginationGroupedStepsData.find(g => g.stepNumber === step)?.englishVideo;
            videoId = englishVideo?.id;
        } else if (step >= 60 && step <= 64) {
            const englishVideo = helpGroupedStepsData.find(g => g.stepNumber === step)?.englishVideo;
            videoId = englishVideo?.id;
        } else if (step >= 65 && step <= 68) {
            const englishVideo = discussionGroupedStepsData.find(g => g.stepNumber === step)?.englishVideo;
            videoId = englishVideo?.id;
        } else if (step >= 69 && step <= 72) {
            const englishVideo = ableToNarrateGroupedStepsData.find(g => g.stepNumber === step)?.englishVideo;
            videoId = englishVideo?.id;
        } else if (step >= 73 && step <= 76) {
            const englishVideo = emotionsBalanceGroupedStepsData.find(g => g.stepNumber === step)?.englishVideo;
            videoId = englishVideo?.id;
        } else if (step >= 77 && step <= 81) {
            const englishVideo = feelingsOfOthersGroupedStepsData.find(g => g.stepNumber === step)?.englishVideo;
            videoId = englishVideo?.id;
        } else if (step >= 82 && step <= 85) {
            const englishVideo = knowledgeCuriosityGroupedStepsData.find(g => g.stepNumber === step)?.englishVideo;
            videoId = englishVideo?.id;
        }
        else if (step === 90) { // Changed from 7 to 90
            videoId = introductionVideos.rows[3]?.id;
        } else if (step === 91) { // Changed from 8 to 91
            videoId = introductionVideos.rows[1]?.id;
        }

        if (videoId) {
            handleVideo(videoId, step, 'english');
        } else {
            Alert.alert("Alert", "Video not found for this step and language.");
        }
    };


    const handleVideo = async (videoId, step, language) => {
        setIntroductionvideosshow(true);

        const netInfoState = await NetInfo.fetch();
        if (!netInfoState.isInternetReachable) {
            Alert.alert(
                "No Internet Connection",
                "Please check your internet connection and try again."
            );
            return;
        }

        setIsModalVisible(false);
        setIsVideoLoading(true);
        setPreferredLanguage(prev => ({ ...prev, [step]: language }));
        setCurrentVideoId(videoId);

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
            if(videoId != null && videoId != ""){
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
                        setIsVideoLoading(false);
                        Alert.alert("Message", "Video not found or failed to get OTP.");
                    } else {
                        const data = await response.json();
                        setOtpData(data);
                        setCompletedSteps(prev => {
                            const newCompletedSteps = { ...prev, [`step${step}`]: true};
                            saveCompletedStepsToBackend(newCompletedSteps);
                            return newCompletedSteps;
                        });

                        navigation.navigate('VideoPlayerScreen', {
                            id: videoId,
                            otp: data.otp,
                            playbackInfo: data.playbackInfo,
                            language: language,
                            step: step,
                            title: detailsData.title,
                            poster: detailsData.poster,
                            cameFrom: route.name, // <--- Here's the change: pass the current route name
                        });
                    }
                } else {
                    Alert.alert("Error", detailsData?.message || "Failed to fetch video details from Vdocipher API.");
                }
            }
            else{
                setError("Video not found");
                setIsVideoLoading(false);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setIsVideoLoading(false);
        } finally {
            setIsVideoLoading(false);
        }
    };

    const vdoCipher_api = async (videoId) => {
        const netInfoState =  await NetInfo.fetch();
        if (!netInfoState.isInternetReachable) {
            Alert.alert(
                "No Internet Connection",
                "Please check your internet connection and try again."
            );
            return { error: true, message: "No internet connection" };
        }
        setIsVideoLoading(true);

        if (!videoId) {
            Alert.alert("ErrorfetchVideoDetails: Missing videoId or API Key");
            return { error: true, message: "Missing videoId" };
        }
        const DETAILS_ENDPOINT = `${url}Vdocipher/GetVDOCipher_VideosDetails?videoId=${videoId}`;
        try {
            const response = await fetch(
                DETAILS_ENDPOINT,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                }
            );
            if (!response.ok) {
                setIsVideoLoading(false);
                let errorData;
                try {
                    errorData = await response.json();
                } catch (parseError) {
                    errorData = { message: response.statusText };
                }
                return { error: true, message: `Failed to get video details: ${errorData.message || response.statusText}` };
            }
            const videoDetails = await response.json();
            setIsVideoLoading(false);
            return videoDetails;

        } catch (error) {
            setIsLoading(false);
            return { error: true, message: `An unexpected error occurred: ${error.message}` };
        }
    }

    const handleTrustPress = async () => {
        setIsVideoLoading(true);

        setDropdownVisibles(false);
        setDropdownVisibleRespect(false);
        setDropdownVisibleFamiliar(false);

        const folderId = "fa26d3b1719c47f89b3efc758ad107bd";
        const DETAILS_ENDPOINT = `${url}Vdocipher/GetAllVDOCipherVideosByFolderID?folderId=${folderId}`;

        try {
            const response = await fetch(
                DETAILS_ENDPOINT,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (parseError) {
                    errorData = { message: response.statusText || 'Unknown error' };
                }
                Alert.alert("API Error", `Failed to load Trust videos: ${errorData.message}`);
                return;
            }

            const videoDetails = await response.json();
            setfoundationLevelTrustVideos(videoDetails);
            setDropdownVisible(prev => !prev);
        } catch (error) {
            Alert.alert("Network Error", `An unexpected error occurred while fetching Trust videos: ${error.message}`);
        } finally {
            setIsVideoLoading(false);
        }
    };

    const handlePressLoveAndCare = async () => {
        const allStepsCompleted = completedSteps.step1 && completedSteps.step2 && completedSteps.step3 && completedSteps.step4 && completedSteps.step5 && completedSteps.step6;

        if (!allStepsCompleted) {
            setDropdownVisibles(false);
            Alert.alert(
                "Incomplete Steps",
                `Please complete all "Trust" steps first. Only then "Love and Care" will be unlocked !`
            );
        } else {
            setIsVideoLoading(true);

            setDropdownVisible(false);
            setDropdownVisibleRespect(false);
            setDropdownVisibleFamiliar(false);

            const folderId = "9162ff33874a4418b21c46de3293d945"
            const DETAILS_ENDPOINT = `${url}Vdocipher/GetAllVDOCipherVideosByFolderID?folderId=${folderId}`;
            try {
                const response = await fetch(
                    DETAILS_ENDPOINT,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        }
                    }
                );
                if (!response.ok) {
                    setIsVideoLoading(false);
                    let errorData;
                    try {
                        errorData = await response.json();
                    } catch (parseError) {
                        errorData = { message: response.statusText };
                    }
                    Alert.alert("API Error", `Failed to load Love and Care videos: ${errorData.message}`);
                    return;
                }
                const videoDetails = await response.json();
                setfoundationLevelLoveAndCareVideos(videoDetails);
                setIsVideoLoading(false);
                setDropdownVisibles(prev => !prev);

            } catch (error) {
                setIsVideoLoading(false);
                Alert.alert("Network Error", `An unexpected error occurred while fetching Love and Care videos: ${error.message}`);
            }
        }
    };

    const handleRESPECT = async () => {
        const allStepsCompleted = completedSteps.step7 && completedSteps.step8 && completedSteps.step9 && completedSteps.step10 && completedSteps.step11 && completedSteps.step12 && completedSteps.step13;

        if (!allStepsCompleted) {
            setDropdownVisibleRespect(false);
            Alert.alert(
                "Incomplete Steps",
                `Please complete all "Love and Care" steps first. Only then "Respect" will be unlocked !`
            );
        } else {
            setIsVideoLoading(true);
            setDropdownVisible(false);
            setDropdownVisibles(false);
            setDropdownVisibleFamiliar(false);

            const folderId = "db26175c76ac4b27820ef71c7d8890e0"
            const DETAILS_ENDPOINT = `${url}Vdocipher/GetAllVDOCipherVideosByFolderID?folderId=${folderId}`;
            try {
                const response = await fetch(
                    DETAILS_ENDPOINT,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        }
                    }
                );
                if (!response.ok) {
                    setIsVideoLoading(false);
                    let errorData;
                    try {
                        errorData = await response.json();
                    } catch (parseError) {
                        errorData = { message: response.statusText };
                    }
                    Alert.alert("API Error", `Failed to load Respect videos: ${errorData.message}`);
                    return;
                }
                const videoDetails = await response.json();
                setRespectLevelVideos(videoDetails);
                setIsVideoLoading(false);
                setDropdownVisibleRespect(prev => !prev);
            } catch (error) {
                setIsVideoLoading(false);
                Alert.alert("Network Error", `An unexpected error occurred while fetching Respect videos: ${error.message}`);
            }
        }
    };

    const handleFamiliar = async () => {
        const allStepsCompleted = completedSteps.step14 && completedSteps.step15 && completedSteps.step16 && completedSteps.step17 && completedSteps.step18;
        if (!allStepsCompleted) {
            setDropdownVisibleFamiliar(false);
            Alert.alert(
                "Incomplete Steps",
                `Please complete all "Respect" steps first. Only then "Familiar" will be unlocked!`
            );
            return;
        }

        setIsVideoLoading(true);
        setDropdownVisible(false);
        setDropdownVisibles(false);
        setDropdownVisibleRespect(false);

        const folderIds = [
            "a49ebdb1dea84474afc11d76c4c01591",
            "21a8a1aa9dbc4146b6565491628c07df"
        ];

        const allVideos = [];

        try {
            for (const folderId of folderIds) {
                const DETAILS_ENDPOINT = `${url}Vdocipher/GetAllVDOCipherVideosByFolderID?folderId=${folderId}`;

                const response = await fetch(DETAILS_ENDPOINT, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    let errorData = {};
                    try {
                        errorData = await response.json();
                    } catch {
                    }
                    throw new Error(errorData.message || `Failed to load videos for folder ${folderId}`);
                }

                const jsonResponse = await response.json();

                if (jsonResponse && Array.isArray(jsonResponse.rows)) {
                    allVideos.push(...jsonResponse.rows);
                } else {
                    throw new Error(`Invalid response format from folder ${folderId}`);
                }
            }

            setFamiliarLevelVideos({ rows: allVideos });
            setDropdownVisibleFamiliar(prev => !prev);

        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setIsVideoLoading(false);
        }
    };
 const handleSpeechDevelopment = async () => {
        const allFamiliarStepsCompleted = completedSteps.step19 && completedSteps.step20 && completedSteps.step21 && completedSteps.step22 && completedSteps.step23 && completedSteps.step24 && completedSteps.step25 && completedSteps.step26 && completedSteps.step27 && completedSteps.step28 && completedSteps.step29;
        if (!allFamiliarStepsCompleted) {
            setSpeechDevelopment(false);
            Alert.alert(
                "Incomplete Steps",
                `Please complete all "Familiar" steps first. Only then "Speech Development" will be unlocked !`
            );
        } else {
            setIsVideoLoading(true);
            setTruth(false);
            setSetBoundaries(false);
            setListenFollowInstructions(false);

            const folderId = "9d876b85b5544edca3c445cd771c947b"
            const DETAILS_ENDPOINT = `${url}Vdocipher/GetAllVDOCipherVideosByFolderID?folderId=${folderId}`;
            try {
                const response = await fetch(
                    DETAILS_ENDPOINT,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        }
                    }
                );
                if (!response.ok) {
                    setIsVideoLoading(false);
                    let errorData;
                    try {
                        errorData = await response.json();
                    } catch (parseError) {
                        errorData = { message: response.statusText };
                    }
                    Alert.alert("API Error", `Failed to load Speech Development videos: ${errorData.message}`);
                    return;
                }
                const videoDetails = await response.json();
                setSpeechDevelopmentVideos(videoDetails);
                setIsVideoLoading(false);
                setSpeechDevelopment(prev => !prev);

            } catch (error) {
                setIsVideoLoading(false);
                Alert.alert("Network Error", `An unexpected error occurred while fetching Speech Development videos: ${error.message}`);
            }
        }
    };
    const handleTruth = async () => {
        const allStepsCompleted =  completedSteps.step30 && completedSteps.step31&& completedSteps.step32 && completedSteps.step33 && completedSteps.step34 ;
        if (!allStepsCompleted) {
            setTruth(false);
            Alert.alert(
                "Incomplete Steps",
                `Please complete all "Speech Development" steps first. Only then "Truth" will be unlocked !`
            );
        }else {
            setIsVideoLoading(true);

            setSpeechDevelopment(false);
            setSetBoundaries(false);
            setListenFollowInstructions(false);

            const folderId = "b6a31ff3d0664ecb8f63d8019c55d6d2"
            const DETAILS_ENDPOINT = `${url}Vdocipher/GetAllVDOCipherVideosByFolderID?folderId=${folderId}`;
            try {
                const response = await fetch(
                    DETAILS_ENDPOINT,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        }
                    }
                );
                if (!response.ok) {
                    setIsVideoLoading(false);
                    let errorData;
                    try {
                        errorData = await response.json();
                    } catch (parseError) {
                        errorData = { message: response.statusText };
                    }
                    Alert.alert("API Error", `Failed to load Truth videos: ${errorData.message}`);
                    return;
                }
                const videoDetails = await response.json();
                setTruthVideos(videoDetails);
                setIsVideoLoading(false);
                setTruth(prev => !prev);

            } catch (error) {
                setIsVideoLoading(false);
                Alert.alert("Network Error", `An unexpected error occurred while fetching Truth videos: ${error.message}`);
            }
        }
    }

    const handleSetBoundaries = async () => {
        const allStepsCompleted = completedSteps.step35 && completedSteps.step36 && completedSteps.step37 && completedSteps.step38;
        if (!allStepsCompleted) {
            setSetBoundaries(false);
            Alert.alert(
                "Incomplete Steps",
                `Please complete all "Truth" steps first. Only then "Set Boundaries" will be unlocked !`
            );
        } else {
            setIsVideoLoading(true);
            setSpeechDevelopment(false);
            setTruth(false);
            setListenFollowInstructions(false);

            const folderId = "7f46370118364fa0b155cf64eb2646d3"
            const DETAILS_ENDPOINT = `${url}Vdocipher/GetAllVDOCipherVideosByFolderID?folderId=${folderId}`;
            try {
                const response = await fetch(
                    DETAILS_ENDPOINT,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        }
                    }
                );
                if (!response.ok) {
                    setIsVideoLoading(false);
                    let errorData;
                    try {
                        errorData = await response.json();
                    } catch (parseError) {
                        errorData = { message: response.statusText };
                    }
                    Alert.alert("API Error", `Failed to load Set Boundaries videos: ${errorData.message}`);
                    return;
                }
                const videoDetails = await response.json();
                setSetBoundariesVideos(videoDetails);
                setIsVideoLoading(false);
                setSetBoundaries(prev => !prev);

            } catch (error) {
                setIsVideoLoading(false);
                Alert.alert("Network Error", `An unexpected error occurred while fetching Set Boundaries videos: ${error.message}`);
            }
        }
    }

    const handleListenFollowInstructions = async () => {
        const allStepsCompleted = completedSteps.step39 && completedSteps.step40 && completedSteps.step41 && completedSteps.step42 && completedSteps.step43 && completedSteps.step44;
        if (!allStepsCompleted) {
            setListenFollowInstructions(false);
            Alert.alert(
                "Incomplete Steps",
                `Please complete all "Set Boundaries" Steps first. Only then "Listen and Follow Instructions" will be unlocked !.`
            );
        } else {
            setIsVideoLoading(true);

            setSpeechDevelopment(false);
            setTruth(false);
            setSetBoundaries(false);

            const folderId = "543998fdbee446cf922dd75864b00be1"
            const DETAILS_ENDPOINT = `${url}Vdocipher/GetAllVDOCipherVideosByFolderID?folderId=${folderId}`;
            try {
                const response = await fetch(
                    DETAILS_ENDPOINT,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        }
                    }
                );
                if (!response.ok) {
                    setIsVideoLoading(false);
                    let errorData;
                    try {
                        errorData = await response.json();
                    } catch (parseError) {
                        errorData = { message: response.statusText };
                    }
                    Alert.alert("API Error", `Failed to load Listen & Follow Instructions videos: ${errorData.message}`);
                    return;
                }
                const videoDetails = await response.json();
                setListenFollowInstructionsVideos(videoDetails);
                setIsVideoLoading(false);
                setListenFollowInstructions(prev => !prev);

            } catch (error) {
                setIsVideoLoading(false);
                Alert.alert("Network Error", `An unexpected error occurred while fetching Listen & Follow Instructions videos: ${error.message}`);
            }
        }
    }

    const handleCooperationPress = async () => {
       const allStepsCompleted = completedSteps.step45 && completedSteps.step46 && completedSteps.step47 && completedSteps.step48 && completedSteps.step49 ;
        if (!allStepsCompleted) {
            setDropdownVisibleCooperationPress(false);
            Alert.alert(
                "Incomplete Steps",
                `Please complete all "Listen and Follow Instructions" Steps first. Only then "Cooperation" will be unlocked !`
            );
        }else {
            setIsVideoLoading(true);
            setDropdownVisibleImgainationandPretendPlay(false);
            setDropdownVisibleHelp(false);
            setDropdownVisibleDiscussionQuestionsAnswers(false);
            setDropdownVisibleAbletoNarrate(false);
            setDropdownVisibleEmotionsBlance(false);
            setDropdownVisibleFeelingsofOthers(false);
            setDropdownVisibleKnowledgeandCuriousitydevelopment(false);


            const folderId = "6df3edb0860349a98ec00c2ea51bbb93"
            const DETAILS_ENDPOINT = `${url}Vdocipher/GetAllVDOCipherVideosByFolderID?folderId=${folderId}`;
            try {
                const response = await fetch(
                    DETAILS_ENDPOINT,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        }
                    }
                );
                if (!response.ok) {
                    setIsVideoLoading(false);
                    let errorData;
                    try {
                        errorData = await response.json();
                    } catch (parseError) {
                        errorData = { message: response.statusText };
                    }
                    Alert.alert("API Error", `Failed to load Cooperation videos: ${errorData.message}`);
                    return;
                }
                const videoDetails = await response.json();
                setCooperationVideos(videoDetails);
                setIsVideoLoading(false);
                setDropdownVisibleCooperationPress(prev => !prev);

            } catch (error) {
                setIsVideoLoading(false);
                Alert.alert("Network Error", `An unexpected error occurred while fetching Cooperation videos: ${error.message}`);
            }
        }
    };

    const handleImgainationandPretendPlayPress = async () => {
        const allStepsCompleted = completedSteps.step50 && completedSteps.step51 && completedSteps.step52 && completedSteps.step53 && completedSteps.step54;
        if (!allStepsCompleted) {
            setDropdownVisibleImgainationandPretendPlay(false);
            Alert.alert(
                "Incomplete Steps",
                `Please complete all "Cooperation" Steps first. Only then "Imagination & Pretend Play" will be unlocked !`
            );
        }else {
            setIsVideoLoading(true);
            setDropdownVisibleCooperationPress(false);
            setDropdownVisibleHelp(false);
            setDropdownVisibleDiscussionQuestionsAnswers(false);
            setDropdownVisibleAbletoNarrate(false);
            setDropdownVisibleEmotionsBlance(false);
            setDropdownVisibleFeelingsofOthers(false);
            setDropdownVisibleKnowledgeandCuriositydevelopment(false);

            const folderId = "71bfcfe443d245e7983236752c3e9fbb"
            const DETAILS_ENDPOINT = `${url}Vdocipher/GetAllVDOCipherVideosByFolderID?folderId=${folderId}`;
            try {
                const response = await fetch(
                    DETAILS_ENDPOINT,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        }
                    }
                );
                if (!response.ok) {
                    setIsVideoLoading(false);
                    let errorData;
                    try {
                        errorData = await response.json();
                    } catch (parseError) {
                        errorData = { message: response.statusText };
                    }
                    Alert.alert("API Error", `Failed to load Imagination & Pretend Play videos: ${errorData.message}`);
                    return;
                }
                const videoDetails = await response.json();
                setImaginationVideos(videoDetails);
                setIsVideoLoading(false);
                setDropdownVisibleImgainationandPretendPlay(prev => !prev);

            } catch (error) {
                setIsVideoLoading(false);
                Alert.alert("Network Error", `An unexpected error occurred while fetching Imagination & Pretend Play videos: ${error.message}`);
            }
        }
    };

    const handleHelp = async () => {
        const allStepsCompleted = completedSteps.step55 && completedSteps.step56 && completedSteps.step57 && completedSteps.step58 && completedSteps.step59;
        if (!allStepsCompleted) {
            setDropdownVisibleHelp(false);
            Alert.alert(
                "Incomplete Steps",
                `Please complete all "Imagination & Pretend Play" Steps first. Only then "Ask Help & Give Help" will be unlocked !`
            );
        } else {
            setIsVideoLoading(true);
            setDropdownVisibleCooperationPress(false);
            setDropdownVisibleImgainationandPretendPlay(false);
            setDropdownVisibleDiscussionQuestionsAnswers(false);
            setDropdownVisibleAbletoNarrate(false);
            setDropdownVisibleEmotionsBlance(false);
            setDropdownVisibleFeelingsofOthers(false);
            setDropdownVisibleKnowledgeandCuriositydevelopment(false);

            const folderId = "e9db6fc2a5324f3ea1599b406e3d6556"
            const DETAILS_ENDPOINT = `${url}Vdocipher/GetAllVDOCipherVideosByFolderID?folderId=${folderId}`;
            try {
                const response = await fetch(
                    DETAILS_ENDPOINT,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        }
                    }
                );
                if (!response.ok) {
                    setIsVideoLoading(false);
                    let errorData;
                    try {
                        errorData = await response.json();
                    } catch (parseError) {
                        errorData = { message: response.statusText };
                    }
                    Alert.alert("API Error", `Failed to load Ask Help & Give Help videos: ${errorData.message}`);
                    return;
                }
                const videoDetails = await response.json();
                setHelpVideos(videoDetails);
                setIsVideoLoading(false);
                setDropdownVisibleHelp(prev => !prev);

            } catch (error) {
                setIsVideoLoading(false);
                Alert.alert("Network Error", `An unexpected error occurred while fetching Ask Help & Give Help videos: ${error.message}`);
            }
        }
    };

    const handleDiscussionQuestionsAnswers = async  () => {
        const allStepsCompleted = completedSteps.step60 && completedSteps.step61 && completedSteps.step62 && completedSteps.step63 && completedSteps.step64;
        if (!allStepsCompleted) {
            setDropdownVisibleDiscussionQuestionsAnswers(false);
            Alert.alert(
                "Incomplete Steps",
                `Please complete all "Ask Help & Give Help" Steps first. Only then "Discussion - Questions & Answers" will be unlocked !`
            );
        } else {
            setIsVideoLoading(true);
            setDropdownVisibleCooperationPress(false);
            setDropdownVisibleImgainationandPretendPlay(false);
            setDropdownVisibleHelp(false);
            setDropdownVisibleAbletoNarrate(false);
            setDropdownVisibleEmotionsBlance(false);
            setDropdownVisibleFeelingsofOthers(false);
            setDropdownVisibleKnowledgeandCuriositydevelopment(false);

            const folderId = "190a4f4a8ea940b4b034d0047992913c"
            const DETAILS_ENDPOINT = `${url}Vdocipher/GetAllVDOCipherVideosByFolderID?folderId=${folderId}`;
            try {
                const response = await fetch(
                    DETAILS_ENDPOINT,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        }
                    }
                );
                if (!response.ok) {
                    setIsVideoLoading(false);
                    let errorData;
                    try {
                        errorData = await response.json();
                    } catch (parseError) {
                        errorData = { message: response.statusText };
                    }
                    Alert.alert("API Error", `Failed to load Discussion - Questions & Answers videos: ${errorData.message}`);
                    return;
                }
                const videoDetails = await response.json();
                setDiscussionVideos(videoDetails);
                setIsVideoLoading(false);
                setDropdownVisibleDiscussionQuestionsAnswers(prev => !prev);

            } catch (error) {
                setIsVideoLoading(false);
                Alert.alert("Network Error", `An unexpected error occurred while fetching Discussion - Questions & Answers videos: ${error.message}`);
            }
        }
    };

    const handleAbletoNarrate = async () => {
        const allStepsCompleted = completedSteps.step65 && completedSteps.step66 && completedSteps.step67 && completedSteps.step68;
        if (!allStepsCompleted) {
            setDropdownVisibleAbletoNarrate(false);
            Alert.alert(
                "Incomplete Steps",
                `Please complete all "Discussion - Questions & Answers" Steps first. Only then "Able to Narrate" will be unlocked !`
            );
        } else {
            setIsVideoLoading(true);
            setDropdownVisibleCooperationPress(false);
            setDropdownVisibleImgainationandPretendPlay(false);
            setDropdownVisibleHelp(false);
            setDropdownVisibleDiscussionQuestionsAnswers(false);
            setDropdownVisibleEmotionsBlance(false);
            setDropdownVisibleFeelingsofOthers(false);
            setDropdownVisibleKnowledgeandCuriositydevelopment(false);

            const folderId = "c9830bc5eed04b18b0cd5919627ad818"
            const DETAILS_ENDPOINT = `${url}Vdocipher/GetAllVDOCipherVideosByFolderID?folderId=${folderId}`;
            try {
                const response = await fetch(
                    DETAILS_ENDPOINT,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        }
                    }
                );
                if (!response.ok) {
                    setIsVideoLoading(false);
                    let errorData;
                    try {
                        errorData = await response.json();
                    } catch (parseError) {
                        errorData = { message: response.statusText };
                    }
                    Alert.alert("API Error", `Failed to load Able to Narrate videos: ${errorData.message}`);
                    return;
                }
                const videoDetails = await response.json();
                setAbleToNarrateVideos(videoDetails);
                setIsVideoLoading(false);
                setDropdownVisibleAbletoNarrate(prev => !prev);

            } catch (error) {
                setIsVideoLoading(false);
                Alert.alert("Network Error", `An unexpected error occurred while fetching Able to Narrate videos: ${error.message}`);
            }
        }
    };

    const handleEmotionsBlance = async () => {
        const allStepsCompleted = completedSteps.step69 && completedSteps.step70 && completedSteps.step71 && completedSteps.step72;
        if (!allStepsCompleted) {
            setDropdownVisibleEmotionsBlance(false);
            Alert.alert(
                "Incomplete Steps",
                `Please complete all "Able to Narrate" Steps first. Only then "Express Emotions and Balance it" will be unlocked !`
            );
        } else {
            setIsVideoLoading(true);
            setDropdownVisibleCooperationPress(false);
            setDropdownVisibleImgainationandPretendPlay(false);
            setDropdownVisibleHelp(false);
            setDropdownVisibleDiscussionQuestionsAnswers(false);
            setDropdownVisibleAbletoNarrate(false);
            setDropdownVisibleFeelingsofOthers(false);
            setDropdownVisibleKnowledgeandCuriositydevelopment(false);

            const folderId = "a27799e2c148438ba450a80d546a9555"
            const DETAILS_ENDPOINT = `${url}Vdocipher/GetAllVDOCipherVideosByFolderID?folderId=${folderId}`;
            try {
                const response = await fetch(
                    DETAILS_ENDPOINT,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        }
                    }
                );
                if (!response.ok) {
                    setIsVideoLoading(false);
                    let errorData;
                    try {
                        errorData = await response.json();
                    } catch (parseError) {
                        errorData = { message: response.statusText };
                    }
                    Alert.alert("API Error", `Failed to load Express Emotions and Balance It videos: ${errorData.message}`);
                    return;
                }
                const videoDetails = await response.json();
                setEmotionsBalanceVideos(videoDetails);
                setIsVideoLoading(false);
                setDropdownVisibleEmotionsBlance(prev => !prev);

            } catch (error) {
                setIsVideoLoading(false);
                Alert.alert("Network Network Error", `An unexpected error occurred while fetching Express Emotions and Balance It videos: ${error.message}`);
            }
        }
    };

    const handleFeelingsofOthers = async () => {
        const allStepsCompleted = completedSteps.step73 && completedSteps.step74 && completedSteps.step75 && completedSteps.step76;
        if (!allStepsCompleted) {
            setDropdownVisibleFeelingsofOthers(false);
            Alert.alert(
                "Incomplete Steps",
                `Please complete all "Express Emotions and Balance it" Steps first. Only then "Feeling of Others" will be unlocked !`
            );
        } else {
            setIsVideoLoading(true);
            setDropdownVisibleCooperationPress(false);
            setDropdownVisibleImgainationandPretendPlay(false);
            setDropdownVisibleHelp(false);
            setDropdownVisibleDiscussionQuestionsAnswers(false);
            setDropdownVisibleAbletoNarrate(false);
            setDropdownVisibleEmotionsBlance(false);
            setDropdownVisibleKnowledgeandCuriositydevelopment(false);

            const folderId = "1471bf13c7f6490fb6f98ae846552a87"
            const DETAILS_ENDPOINT = `${url}Vdocipher/GetAllVDOCipherVideosByFolderID?folderId=${folderId}`;
            try {
                const response = await fetch(
                    DETAILS_ENDPOINT,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        }
                    }
                );
                if (!response.ok) {
                    setIsVideoLoading(false);
                    let errorData;
                    try {
                        errorData = await response.json();
                    } catch (parseError) {
                        errorData = { message: response.statusText };
                    }
                    Alert.alert("API Error", `Failed to load Feelings of Others videos: ${errorData.message}`);
                    return;
                }
                const videoDetails = await response.json();
                setFeelingsOfOthersVideos(videoDetails);
                setIsVideoLoading(false);
                setDropdownVisibleFeelingsofOthers(prev => !prev);

            } catch (error) {
                setIsVideoLoading(false);
                Alert.alert("Network Error", `An unexpected error occurred while fetching Feelings of Others videos: ${error.message}`);
            }
        }
    };

    const handleKnowledgeandCuriousitydevelopment = async () => {
        const allStepsCompleted = completedSteps.step77 && completedSteps.step78 && completedSteps.step79 && completedSteps.step80 && completedSteps.step81;
        if (!allStepsCompleted) {
            setDropdownVisibleKnowledgeandCuriousitydevelopment(false);
            Alert.alert(
                "Incomplete Steps",
                `Please complete all "Feeling of Others" Steps first. Only then "Knowledge & Curiosity Fevelopment" will be unlocked !`
            );
        } else {
            setIsVideoLoading(true);
            setDropdownVisibleCooperationPress(false);
            setDropdownVisibleImgainationandPretendPlay(false);
            setDropdownVisibleHelp(false);
            setDropdownVisibleDiscussionQuestionsAnswers(false);
            setDropdownVisibleAbletoNarrate(false);
            setDropdownVisibleEmotionsBlance(false);
            setDropdownVisibleFeelingsofOthers(false);

            const folderId = "053dc785919e42aa941e6ee070b55325"
            const DETAILS_ENDPOINT = `${url}Vdocipher/GetAllVDOCipherVideosByFolderID?folderId=${folderId}`;
            try {
                const response = await fetch(
                    DETAILS_ENDPOINT,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        }
                    }
                );
                if (!response.ok) {
                    setIsVideoLoading(false);
                    let errorData;
                    try {
                        errorData = await response.json();
                    } catch (parseError) {
                        errorData = { message: response.statusText };
                    }
                    Alert.alert("API Error", `Failed to load Knowledge & Curiosity Development videos: ${errorData.message}`);
                    return;
                }
                const videoDetails = await response.json();
                setKnowledgeCuriosityVideos(videoDetails);
                setIsVideoLoading(false);
                setDropdownVisibleKnowledgeandCuriousitydevelopment(prev => !prev);

            } catch (error) {
                setIsVideoLoading(false);
                Alert.alert("Network Error", `An unexpected error occurred while fetching Knowledge & Curiosity Development videos: ${error.message}`);
            }
        }
    };

    const [truthVideos, setTruthVideos] = useState({});
    const [setBoundariesVideos, setSetBoundariesVideos] = useState({});
    const [listenFollowInstructionsVideos, setListenFollowInstructionsVideos] = useState({});
    const [cooperationVideos, setCooperationVideos] = useState({});
    const [imaginationVideos, setImaginationVideos] = useState({});
    const [helpVideos, setHelpVideos] = useState({});
    const [discussionVideos, setDiscussionVideos] = useState({});
    const [ableToNarrateVideos, setAbleToNarrateVideos] = useState({});
    const [emotionsBalanceVideos, setEmotionsBalanceVideos] = useState({});
    const [feelingsOfOthersVideos, setFeelingsOfOthersVideos] = useState({});
    const [knowledgeCuriosityVideos, setKnowledgeCuriosityVideos] = useState({});

    const handleDropdownItemClick = (step) => {
        setSelectedStep(step);

        let groupToSelect = null;

        if (isDropdownVisible) {
            groupToSelect = groupedStepsData.find(g => g.stepNumber === step);
            if (groupToSelect && (step === 1 || completedSteps[`step${step - 1}`])) {
                setSelectedStepGroup(groupToSelect);
                setIsModalVisible(true);
            } else if (groupToSelect) {
                Alert.alert('Message !', `Please watch the previous video to unlock this video!`);
            } else {
                Alert.alert('Error', `Video group for step ${step} not found in Trust category.`);
            }
        } else if (isDropdownVisibles) {
            groupToSelect = loveAndCareGroupedStepsData.find(g => g.stepNumber === step);
            if (groupToSelect && (step === 7 || completedSteps[`step${step - 1}`])) {
                setSelectedStepGroup(groupToSelect);
                setIsModalVisible(true);
            } else if (groupToSelect) {
                Alert.alert('Message !', `Please watch the previous video to unlock this video!`);
            } else {
                Alert.alert('Error', `Video group for step ${step} not found in Love and Care category.`);
            }
        } else if (isDropdownVisibleRespect) {
            const group = respectGroupedStepsData.find(g => g.stepNumber === step);
            if (group && (step === 14 || completedSteps[`step${step - 1}`])) {
                setSelectedStepGroup(group);
                setIsModalVisible(true);
            } else if (group) {
                Alert.alert('Message !', `Please watch the previous video to unlock this video!`);
            } else {
                Alert.alert('Error', `Video group for step ${step} not found in Respect category.`);
            }
        } else if (isDropdownVisibleFamiliar) {
            const group = familiarGroupedStepsData.find(g => g.stepNumber === step);
            if (group && (step === 19 || completedSteps[`step${step - 1}`])) {
                setSelectedStepGroup(group);
                setIsModalVisible(true);
            } else if (group) {
                Alert.alert('Message !', `Please watch the previous video to unlock this video!`);
            } else {
                Alert.alert('Error', `Video group for step ${step} not found in Familiar category. Check API data.`);
            }
        } else if (isDropdownVisibleSpeechDevelopment) {
            const group = speechDevGroupedStepsData.find(g => g.stepNumber === step);
            if (group && (step === 30 || completedSteps[`step${step - 1}`])) {
                setSelectedStepGroup(group);
                setIsModalVisible(true);
            } else if (group) {
                Alert.alert('Message !', `Please watch the previous video to unlock this video!`);
            } else {
                Alert.alert('Error', `Video group for step ${step} not found in Speech Development category.`);
            }
        } else if (isDropdownVisibleTruth) {
            const group = truthGroupedStepsData.find(g => g.stepNumber === step);
            if (group && (step === 35 || completedSteps[`step${step - 1}`])) {
                setSelectedStepGroup(group);
                setIsModalVisible(true);
            } else if (group) {
                Alert.alert('Message !', `Please watch the previous video to unlock this video!`);
            } else {
                Alert.alert('Error', `Video group for step ${step} not found in Truth category.`);
            }
        } else if (isDropdownVisibleSetBoundaries) {
            const group = setBoundariesGroupedStepsData.find(g => g.stepNumber === step);
            if (group && (step === 39 || completedSteps[`step${step - 1}`])) {
                setSelectedStepGroup(group);
                setIsModalVisible(true);
            } else if (group) {
                Alert.alert('Message !', `Please watch the previous video to unlock this video!`);
            } else {
                Alert.alert('Error', `Video group for step ${step} not found in Set Boundaries category.`);
            }
        } else if (isDropdownVisibleListenFollowInstructions) {
            const group = listenFollowGroupedStepsData.find(g => g.stepNumber === step);
            if (group && (step === 45 || completedSteps[`step${step - 1}`])) {
                setSelectedStepGroup(group);
                setIsModalVisible(true);
            } else if (group) {
                Alert.alert('Message !', `Please watch the previous video to unlock this video!`);
            } else {
                Alert.alert('Error', `Video group for step ${step} not found in Listen & Follow Instructions category.`);
            }
        } else if (isDropdownVisibleCooperationPress) {
            const group = cooperationGroupedStepsData.find(g => g.stepNumber === step);
            if (group && (step === 50 || completedSteps[`step${step - 1}`])) {
                setSelectedStepGroup(group);
                setIsModalVisible(true);
            } else if (group) {
                Alert.alert('Message !', `Please watch the previous video to unlock this video!`);
            } else {
                Alert.alert('Error', `Video group for step ${step} not found in Cooperation category.`);
            }
        } else if (isDropdownVisibleImgainationandPretendPlay) {
            const group = imaginationGroupedStepsData.find(g => g.stepNumber === step);
            if (group && (step === 55 || completedSteps[`step${step - 1}`])) {
                setSelectedStepGroup(group);
                setIsModalVisible(true);
            } else if (group) {
                Alert.alert('Message !', `Please watch the previous video to unlock this video!`);
            } else {
                Alert.alert('Error', `Video group for step ${step} not found in Imagination & Pretend Play category.`);
            }
        } else if (isDropdownVisibleHelp) {
            const group = helpGroupedStepsData.find(g => g.stepNumber === step);
            if (group && (step === 60 || completedSteps[`step${step - 1}`])) {
                setSelectedStepGroup(group);
                setIsModalVisible(true);
            } else if (group) {
                Alert.alert('Message !', `Please watch the previous video to unlock this video!`);
            } else {
                Alert.alert('Error', `Video group for step ${step} not found in Ask Help & Give Help category.`);
            }
        } else if (isDropdownVisibleDiscussionQuestionsAnswers) {
            const group = discussionGroupedStepsData.find(g => g.stepNumber === step);
            if (group && (step === 65 || completedSteps[`step${step - 1}`])) {
                setSelectedStepGroup(group);
                setIsModalVisible(true);
            } else if (group) {
                Alert.alert('Message !', `Please watch the previous video to unlock this video!`);
            } else {
                Alert.alert('Error', `Video group for step ${step} not found in Discussion - Questions & Answers category.`);
            }
        } else if (isDropdownVisibleAbletoNarrate) {
            const group = ableToNarrateGroupedStepsData.find(g => g.stepNumber === step);
            if (group && (step === 69 || completedSteps[`step${step - 1}`])) {
                setSelectedStepGroup(group);
                setIsModalVisible(true);
            } else if (group) {
                Alert.alert('Message !', `Please watch the previous video to unlock this video!`);
            } else {
                Alert.alert('Error', `Video group for step ${step} not found in Able to Narrate category.`);
            }
        } else if (isDropdownVisibleEmotionsBlance) {
            const group = emotionsBalanceGroupedStepsData.find(g => g.stepNumber === step);
            if (group && (step === 73 || completedSteps[`step${step - 1}`])) {
                setSelectedStepGroup(group);
                setIsModalVisible(true);
            } else if (group) {
                Alert.alert('Message !', `Please watch the previous video to unlock this video!`);
            } else {
                Alert.alert('Error', `Video group for step ${step} not found in Express Emotions and Balance It category.`);
            }
        } else if (isDropdownVisibleFeelingsofOthers) {
            const group = feelingsOfOthersGroupedStepsData.find(g => g.stepNumber === step);
            if (group && (step === 77 || completedSteps[`step${step - 1}`])) {
                setSelectedStepGroup(group);
                setIsModalVisible(true);
            } else if (group) {
                Alert.alert('Message !', `Please watch the previous video to unlock this video!`);
            } else {
                Alert.alert('Error', `Video group for step ${step} not found in Feelings of Others category.`);
            }
        } else if (isDropdownVisibleKnowledgeandCuriositydevelopment) {
            const group = knowledgeCuriosityGroupedStepsData.find(g => g.stepNumber === step);
            if (group && (step === 82 || completedSteps[`step${step - 1}`])) {
                setSelectedStepGroup(group);
                setIsModalVisible(true);
            } else if (group) {
                Alert.alert('Message !', `Please watch the previous video to unlock this video!`);
            } else {
                Alert.alert('Error', `Video group for step ${step} not found in Knowledge & Curiosity Development category.`);
            }
        }
        else if (step === 90 || step === 91) { // Added condition for Introduction videos
             const introGroup = selectedStepGroup; // Use selectedStepGroup directly from introduction handlers
             if (introGroup) {
                 setSelectedStepGroup(introGroup);
                 setIsModalVisible(true);
             } else {
                 Alert.alert('Error', `Video group for Introduction step ${step} not found.`);
             }
        }
    };

    const disableFullscreen = () => {

        const hideFullscreenButtonScript = `
          const fullscreenButton = document.querySelector('.vdocipher-fullscreen-button');
          if (fullscreenButton) {
            fullscreenButton.style.display = 'none';
          }
        `;

        const preventFullscreenAPIScript = `
          document.addEventListener('fullscreenchange', function(event) {
            if (document.fullscreenElement) {
              document.exitFullscreen();
            }
          });

          document.addEventListener('webkitfullscreenchange', function(event) {
            if (document.webkitFullscreenElement) {
              document.webkitExitFullscreen();
            }
          });
        `;

        return hideFullscreenButtonScript + preventFullscreenAPIScript;
    };

    const closeLanguageModal = () =>{
        setIsModalVisible(false);
    };

    const handleWebViewLoad = () => {
        if (otpData) {
            const injectedScript = disableFullscreen();

            setTimeout(() => {
                if (webviewRef.current) {
                    webviewRef.current.injectJavaScript(`
                        const playPromise = document.querySelector('video').play();
                        if (playPromise !== undefined) {
                            playPromise.then(_ => {
                            })
                            .catch(error => {
                            });
                        }
                    `);
                    webviewRef.current.injectJavaScript(injectedScript);
                }
            }, 500);
        }
    };

    const groupedStepsData = useMemo(() => {
        const groups = {};
        foundationLevelTrustVideos?.rows?.forEach(item => {
            if (!item.title) return;
            const match = item.title.match(/step\s+(\d+)/i);
            const stepNumber = match ? parseInt(match[1], 10) : null;

            if (stepNumber === null) {
                return;
            }

            if (!groups[stepNumber]) {
                groups[stepNumber] = {
                    stepNumber: stepNumber,
                    displayStepNumber: stepNumber,
                    hindiVideo: null,
                    englishVideo: null,
                };
            }

            if (item.title.toLowerCase().includes('hindi')) {
                groups[stepNumber].hindiVideo = item;
            } else if (item.title.toLowerCase().includes('english')) {
                groups[stepNumber].englishVideo = item;
            }
        });
        return Object.values(groups).sort((a, b) => a.stepNumber - b.stepNumber);
    }, [foundationLevelTrustVideos]);

    const loveAndCareGroupedStepsData = useMemo(() => {
        const groups = {};
        foundationLevelLoveAndCareVideos?.rows?.forEach(item => {
            if (!item.title) return;
            const match = item.title.match(/step\s+(\d+)/i);
            const apiStepNumber = match ? parseInt(match[1], 10) : null;

            if (apiStepNumber === null) {
                return;
            }
            const globalStepNumber = 6 + apiStepNumber;

            if (!groups[globalStepNumber]) {
                groups[globalStepNumber] = {
                    stepNumber: globalStepNumber,
                    displayStepNumber: apiStepNumber,
                    hindiVideo: null,
                    englishVideo: null,
                };
            }

            if (item.title.toLowerCase().includes('hindi')) {
                groups[globalStepNumber].hindiVideo = item;
            } else if (item.title.toLowerCase().includes('english')) {
                groups[globalStepNumber].englishVideo = item;
            }
        });
        return Object.values(groups).sort((a, b) => a.stepNumber - b.stepNumber);
    }, [foundationLevelLoveAndCareVideos]);

    const respectGroupedStepsData = useMemo(() => {
        const groups = {};
        respectLevelVideos?.rows?.forEach(item => {
            if (!item.title) return;
            const match = item.title.match(/step\s+(\d+)/i);
            const apiStepNumber = match ? parseInt(match[1], 10) : null;

            if (apiStepNumber === null) {
                return;
            }
            const globalStepNumber = 13 + apiStepNumber;

            if (!groups[globalStepNumber]) {
                groups[globalStepNumber] = {
                    stepNumber: globalStepNumber,
                    displayStepNumber: apiStepNumber,
                    hindiVideo: null,
                    englishVideo: null,
                };
            }

            if (item.title.toLowerCase().includes('hindi')) {
                groups[globalStepNumber].hindiVideo = item;
            } else if (item.title.toLowerCase().includes('english')) {
                groups[globalStepNumber].englishVideo = item;
            }
        });
        return Object.values(groups).sort((a, b) => a.stepNumber - b.stepNumber);
    }, [respectLevelVideos]);

    const familiarGroupedStepsData = useMemo(() => {
        const tempVideoMap = new Map();
        let maxApiStepNumber = 0;

        familiarLevelVideos?.rows?.forEach(item => {
            if (!item.title) return;

            const match = item.title.match(/step\s+(\d+)/i);
            const apiStepNumber = match ? parseInt(match[1], 10) : null;

            if (apiStepNumber === null) {
                return;
            }

            maxApiStepNumber = Math.max(maxApiStepNumber, apiStepNumber);

            if (!tempVideoMap.has(apiStepNumber)) {
                tempVideoMap.set(apiStepNumber, { hindi: null, english: null });
            }

            const videoEntry = tempVideoMap.get(apiStepNumber);
            if (item.title.toLowerCase().includes('hindi')) {
                videoEntry.hindi = item;
            } else if (item.title.toLowerCase().includes('english')) {
                videoEntry.english = item;
            }
        });

        const groups = [];
        for (let i = 1; i <= maxApiStepNumber; i++) {
            const globalStepNumber = 18 + i;
            const videoEntry = tempVideoMap.get(i);

            if (videoEntry && (videoEntry.hindi || videoEntry.english)) {
                groups.push({
                    stepNumber: globalStepNumber,
                    displayStepNumber: i,
                    hindiVideo: videoEntry.hindi,
                    englishVideo: videoEntry.english,
                });
            } else {
            }
        }
        return groups.sort((a, b) => a.stepNumber - b.stepNumber);
    }, [familiarLevelVideos]);

    const speechDevGroupedStepsData = useMemo(() => {
        const groups = {};
        speechDevelopmentVideos?.rows?.forEach(item => {
            if (!item.title) return;
            const match = item.title.match(/step\s+(\d+)/i);
            const apiStepNumber = match ? parseInt(match[1], 10) : null;

            if (apiStepNumber === null) {
                return;
            }
            const globalStepNumber = 29 + apiStepNumber;

            if (!groups[globalStepNumber]) {
                groups[globalStepNumber] = {
                    stepNumber: globalStepNumber,
                    displayStepNumber: apiStepNumber,
                    hindiVideo: null,
                    englishVideo: null,
                };
            }

            if (item.title.toLowerCase().includes('hindi')) {
                groups[globalStepNumber].hindiVideo = item;
            } else if (item.title.toLowerCase().includes('english')) {
                groups[globalStepNumber].englishVideo = item;
            }
        });
        return Object.values(groups).sort((a, b) => a.stepNumber - b.stepNumber);
    }, [speechDevelopmentVideos]);

    const truthGroupedStepsData = useMemo(() => {
        const groups = {};
        truthVideos?.rows?.forEach(item => {
            if (!item.title) return;
            const match = item.title.match(/step\s+(\d+)/i);
            const apiStepNumber = match ? parseInt(match[1], 10) : null;

            if (apiStepNumber === null) {
                return;
            }
            const globalStepNumber = 34 + apiStepNumber;

            if (!groups[globalStepNumber]) {
                groups[globalStepNumber] = {
                    stepNumber: globalStepNumber,
                    displayStepNumber: apiStepNumber,
                    hindiVideo: null,
                    englishVideo: null,
                };
            }

            if (item.title.toLowerCase().includes('hindi')) {
                groups[globalStepNumber].hindiVideo = item;
            } else if (item.title.toLowerCase().includes('english')) {
                groups[globalStepNumber].englishVideo = item;
            }
        });
        return Object.values(groups).sort((a, b) => a.stepNumber - b.stepNumber);
    }, [truthVideos]);

    const setBoundariesGroupedStepsData = useMemo(() => {
        const groups = {};
        setBoundariesVideos?.rows?.forEach(item => {
            if (!item.title) return;
            const match = item.title.match(/step\s+(\d+)/i);
            const apiStepNumber = match ? parseInt(match[1], 10) : null;

            if (apiStepNumber === null) {
                return;
            }
            const globalStepNumber = 38 + apiStepNumber;

            if (!groups[globalStepNumber]) {
                groups[globalStepNumber] = {
                    stepNumber: globalStepNumber,
                    displayStepNumber: apiStepNumber,
                    hindiVideo: null,
                    englishVideo: null,
                };
            }

            if (item.title.toLowerCase().includes('hindi')) {
                groups[globalStepNumber].hindiVideo = item;
            } else if (item.title.toLowerCase().includes('english')) {
                groups[globalStepNumber].englishVideo = item;
            }
        });
        return Object.values(groups).sort((a, b) => a.stepNumber - b.stepNumber);
    }, [setBoundariesVideos]);

    const listenFollowGroupedStepsData = useMemo(() => {
        const groups = {};
        listenFollowInstructionsVideos?.rows?.forEach(item => {
            if (!item.title) return;
            const match = item.title.match(/step\s+(\d+)/i);
            const apiStepNumber = match ? parseInt(match[1], 10) : null;

            if (apiStepNumber === null) {
                return;
            }
            const globalStepNumber = 44 + apiStepNumber;

            if (!groups[globalStepNumber]) {
                groups[globalStepNumber] = {
                    stepNumber: globalStepNumber,
                    displayStepNumber: apiStepNumber,
                    hindiVideo: null,
                    englishVideo: null,
                };
            }

            if (item.title.toLowerCase().includes('hindi')) {
                groups[globalStepNumber].hindiVideo = item;
            } else if (item.title.toLowerCase().includes('english')) {
                groups[globalStepNumber].englishVideo = item;
            }
        });
        return Object.values(groups).sort((a, b) => a.stepNumber - b.stepNumber);
    }, [listenFollowInstructionsVideos]);

    const cooperationGroupedStepsData = useMemo(() => {
        const groups = {};
        cooperationVideos?.rows?.forEach(item => {
            if (!item.title) return;
            const match = item.title.match(/step\s+(\d+)/i);
            const apiStepNumber = match ? parseInt(match[1], 10) : null;

            if (apiStepNumber === null) {
                return;
            }
            const globalStepNumber = 49 + apiStepNumber;

            if (!groups[globalStepNumber]) {
                groups[globalStepNumber] = {
                    stepNumber: globalStepNumber,
                    displayStepNumber: apiStepNumber,
                    hindiVideo: null,
                    englishVideo: null,
                };
            }

            if (item.title.toLowerCase().includes('hindi')) {
                groups[globalStepNumber].hindiVideo = item;
            } else if (item.title.toLowerCase().includes('english')) {
                groups[globalStepNumber].englishVideo = item;
            }
        });
        return Object.values(groups).sort((a, b) => a.stepNumber - b.stepNumber);
    }, [cooperationVideos]);

    const imaginationGroupedStepsData = useMemo(() => {
        const groups = {};
        imaginationVideos?.rows?.forEach(item => {
            if (!item.title) return;
            const match = item.title.match(/step\s+(\d+)/i);
            const apiStepNumber = match ? parseInt(match[1], 10) : null;

            if (apiStepNumber === null) {
                return;
            }
            const globalStepNumber = 54 + apiStepNumber;

            if (!groups[globalStepNumber]) {
                groups[globalStepNumber] = {
                    stepNumber: globalStepNumber,
                    displayStepNumber: apiStepNumber,
                    hindiVideo: null,
                    englishVideo: null,
                };
            }

            if (item.title.toLowerCase().includes('hindi')) {
                groups[globalStepNumber].hindiVideo = item;
            } else if (item.title.toLowerCase().includes('english')) {
                groups[globalStepNumber].englishVideo = item;
            }
        });
        return Object.values(groups).sort((a, b) => a.stepNumber - b.stepNumber);
    }, [imaginationVideos]);

    const helpGroupedStepsData = useMemo(() => {
        const groups = {};
        helpVideos?.rows?.forEach(item => {
            if (!item.title) return;
            const match = item.title.match(/step\s+(\d+)/i);
            const apiStepNumber = match ? parseInt(match[1], 10) : null;

            if (apiStepNumber === null) {
                return;
            }
            const globalStepNumber = 59 + apiStepNumber;

            if (!groups[globalStepNumber]) {
                groups[globalStepNumber] = {
                    stepNumber: globalStepNumber,
                    displayStepNumber: apiStepNumber,
                    hindiVideo: null,
                    englishVideo: null,
                };
            }

            if (item.title.toLowerCase().includes('hindi')) {
                groups[globalStepNumber].hindiVideo = item;
            } else if (item.title.toLowerCase().includes('english')) {
                groups[globalStepNumber].englishVideo = item;
            }
        });
        return Object.values(groups).sort((a, b) => a.stepNumber - b.stepNumber);
    }, [helpVideos]);

    const discussionGroupedStepsData = useMemo(() => {
        const groups = {};
        discussionVideos?.rows?.forEach(item => {
            if (!item.title) return;
            const match = item.title.match(/step\s+(\d+)/i);
            const apiStepNumber = match ? parseInt(match[1], 10) : null;

            if (apiStepNumber === null) {
                return;
            }
            const globalStepNumber = 64 + apiStepNumber;

            if (!groups[globalStepNumber]) {
                groups[globalStepNumber] = {
                    stepNumber: globalStepNumber,
                    displayStepNumber: apiStepNumber,
                    hindiVideo: null,
                    englishVideo: null,
                };
            }

            if (item.title.toLowerCase().includes('hindi')) {
                groups[globalStepNumber].hindiVideo = item;
            } else if (item.title.toLowerCase().includes('english')) {
                groups[globalStepNumber].englishVideo = item;
            }
        });
        return Object.values(groups).sort((a, b) => a.stepNumber - b.stepNumber);
    }, [discussionVideos]);

    const ableToNarrateGroupedStepsData = useMemo(() => {
        const groups = {};
        ableToNarrateVideos?.rows?.forEach(item => {
            if (!item.title) return;
            const match = item.title.match(/step\s+(\d+)/i);
            const apiStepNumber = match ? parseInt(match[1], 10) : null;

            if (apiStepNumber === null) {
                return;
            }
            const globalStepNumber = 68 + apiStepNumber;

            if (!groups[globalStepNumber]) {
                groups[globalStepNumber] = {
                    stepNumber: globalStepNumber,
                    displayStepNumber: apiStepNumber,
                    hindiVideo: null,
                    englishVideo: null,
                };
            }

            if (item.title.toLowerCase().includes('hindi')) {
                groups[globalStepNumber].hindiVideo = item;
            } else if (item.title.toLowerCase().includes('english')) {
                groups[globalStepNumber].englishVideo = item;
            }
        });
        return Object.values(groups).sort((a, b) => a.stepNumber - b.stepNumber);
    }, [ableToNarrateVideos]);

    const emotionsBalanceGroupedStepsData = useMemo(() => {
        const groups = {};
        emotionsBalanceVideos?.rows?.forEach(item => {
            if (!item.title) return;
            const match = item.title.match(/step\s+(\d+)/i);
            const apiStepNumber = match ? parseInt(match[1], 10) : null;

            if (apiStepNumber === null) {
                return;
            }
            const globalStepNumber = 72 + apiStepNumber;

            if (!groups[globalStepNumber]) {
                groups[globalStepNumber] = {
                    stepNumber: globalStepNumber,
                    displayStepNumber: apiStepNumber,
                    hindiVideo: null,
                    englishVideo: null,
                };
            }

            if (item.title.toLowerCase().includes('hindi')) {
                groups[globalStepNumber].hindiVideo = item;
            } else if (item.title.toLowerCase().includes('english')) {
                groups[globalStepNumber].englishVideo = item;
            }
        });
        return Object.values(groups).sort((a, b) => a.stepNumber - b.stepNumber);
    }, [emotionsBalanceVideos]);

    const feelingsOfOthersGroupedStepsData = useMemo(() => {
        const groups = {};
        feelingsOfOthersVideos?.rows?.forEach(item => {
            if (!item.title) return;
            const match = item.title.match(/step\s+(\d+)/i);
            const apiStepNumber = match ? parseInt(match[1], 10) : null;

            if (apiStepNumber === null) {
                return;
            }
            const globalStepNumber = 76 + apiStepNumber;

            if (!groups[globalStepNumber]) {
                groups[globalStepNumber] = {
                    stepNumber: globalStepNumber,
                    displayStepNumber: apiStepNumber,
                    hindiVideo: null,
                    englishVideo: null,
                };
            }

            if (item.title.toLowerCase().includes('hindi')) {
                groups[globalStepNumber].hindiVideo = item;
            } else if (item.title.toLowerCase().includes('english')) {
                groups[globalStepNumber].englishVideo = item;
            }
        });
        return Object.values(groups).sort((a, b) => a.stepNumber - b.stepNumber);
    }, [feelingsOfOthersVideos]);

    const knowledgeCuriosityGroupedStepsData = useMemo(() => {
        const groups = {};
        knowledgeCuriosityVideos?.rows?.forEach(item => {
            if (!item.title) return;
            const match = item.title.match(/step\s+(\d+)/i);
            const apiStepNumber = match ? parseInt(match[1], 10) : null;

            if (apiStepNumber === null) {
                return;
            }
            const globalStepNumber = 81 + apiStepNumber;

            if (!groups[globalStepNumber]) {
                groups[globalStepNumber] = {
                    stepNumber: globalStepNumber,
                    displayStepNumber: apiStepNumber,
                    hindiVideo: null,
                    englishVideo: null,
                };
            }

            if (item.title.toLowerCase().includes('hindi')) {
                groups[globalStepNumber].hindiVideo = item;
            } else if (item.title.toLowerCase().includes('english')) {
                groups[globalStepNumber].englishVideo = item;
            }
        });
        return Object.values(groups).sort((a, b) => a.stepNumber - b.stepNumber);
    }, [knowledgeCuriosityVideos]);


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

      const handleInitFailure = (error) => {
        setIsLoading(false);
    };
        const handleLoadError = ({ errorDescription }) => {
        setIsLoading(false);
    };
    const handleError = ({ errorDescription }) => {
        setIsLoading(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };
    const handleEnded = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const handleLoaded = async (args) => {
        setIsLoading(false);

        if (playerRef.current && typeof playerRef.current.getDuration === 'function') {
            try {
                const duration = await playerRef.current.getDuration();
                if (duration && typeof duration === 'number' && duration > 0) {
                    totalDurationRef.current = duration;
                } else {
                }
            } catch (e) {
            }
        } else {
        }

        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
            if (intervalRef.current) clearInterval(intervalRef.current);

            intervalRef.current = setInterval(async () => {
                if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                    try {
                        const currentTime = await playerRef.current.getCurrentTime();
                         if (currentTime && typeof currentTime === 'number') {
                             if (currentTime > maxWatchedTimeRef.current) {
                                maxWatchedTimeRef.current = currentTime;
                             }
                         }
                    } catch (e) {
                        if (e.message && !e.message.toLowerCase().includes('player is null')) {
                        }
                    }
                } else {
                     if (intervalRef.current) clearInterval(intervalRef.current);
                     intervalRef.current = null;
                }
            }, 5000);
        } else {
        }
    };

    return (
        <View style={[styles.container, backgroundStyle]} >
            <View style={styles.imageContainer}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} >
                    <TouchableOpacity activeOpacity={1} onPress={handleIntroductionOnePress}>
                        <Animated.View style={[styles.button, { transform: [{ scale: scale2 }] }, { marginTop: 10 } ]}>
                            <Image source={require('../img/introductionone.jpg')} style={styles.image} resizeMode="cover" />
                            <View style={styles.textOverlay}>
                                <Text style={styles.text}>Introduction I</Text>
                            </View>
                        </Animated.View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={handleIntroductionTwoPress}>
                        <Animated.View style={[styles.button, { transform: [{ scale: scale2 }] }, { marginTop: 10 } ]}>
                            <Image source={require('../img/introductiontwo.jpg')} style={styles.image} resizeMode="cover" />
                            <View style={styles.textOverlay}>
                                <Text style={styles.text}>Introduction II</Text>
                            </View>
                        </Animated.View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={handleFoundationPress}>
                        <Animated.View style={[styles.button, { transform: [{ scale: scale1 }] }, { marginTop: 10 } ]}>
                            <Image source={require('../img/foundationlevel.png')} style={styles.image} resizeMode="cover" />
                            <View style={styles.textOverlayTwo}>
                                <Image source={require('../img/tap.png')} style={[styles.tabimage, { opacity: 0 }]} resizeMode="cover" />
                                    <Text style={styles.text}>Foundation Level</Text>
                                    <Animated.Image source={require('../img/tap.png')} style={[styles.tabimage, { opacity }]} resizeMode="cover" />
                            </View>
                        </Animated.View>
                    </TouchableOpacity>
                    <Animated.Image
                source={require('../img/tap.png')}
                style={[
                    styles.handImage,
                    {
                        opacity: handOpacity,
                        transform: [
                            { translateX: handPositionX },
                            { translateY: handPositionY },
                            { scale: handScale }
                        ]
                    }
                ]}
                resizeMode="contain"
                pointerEvents="none"
            />
                    <TouchableOpacity activeOpacity={1} onPress={handleMiddleLevelPress}>
                    <Animated.View style={[styles.button, { transform: [{ scale: scale2 }] }, { marginTop: 10 } ]}>
                            <Image source={require('../img/middlelevel2.png')} style={styles.image} resizeMode="cover" />
                            <View style={styles.textOverlay}>
                                <Text style={styles.text}>Middle Level</Text>
                            </View>
                        </Animated.View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={handleAdvancedLevelPress}>
                        <Animated.View style={[styles.button, { transform: [{ scale: scale3 }] }, { marginTop: 10 } ]}>
                            <Image source={require('../img/advancelevel.png')} style={styles.image} resizeMode="cover" />
                            <View style={styles.textOverlay}>
                                <Text style={styles.text}>Advanced Level</Text>
                            </View>
                        </Animated.View>
                    </TouchableOpacity>
                    </ScrollView>
                    {isFoundationDropdownVisible && (
                    <View style={[styles.modalLikeContainer]} >
                        <Pressable style={styles.fullScreenPressable} onPress={handleCloseModal}>
                            <TouchableOpacity activeOpacity={1} style={styles.modalLikeContentBox} onPress={() => {  }}>
                                <View style={[styles.modalContents, backgroundStyle]}>
                                    <View style={styles.modalHeader}>
                                        <Text style={styles.modalHeaderText}>Foundation Level</Text>
                                        <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                                            <Text style={styles.closeButtonText}>✕</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollView
                                        style={styles.modalScrollView}
                                        contentContainerStyle={styles.modalScrollViewContent}
                                        showsVerticalScrollIndicator={false}
                                    >
                                        <View style={styles.videolist}>
                                            <TouchableOpacity activeOpacity={1} onPress={handleTrustPress}>
                                                <Animated.View
                                                    style={[styles.buttonNested, {
                                                        transform: [{ scale: scale1 }],
                                                        marginBottom: isDropdownVisible ? 0 : 10
                                                    }]}
                                                >
                                                    <Image source={require('../img/trustimg.png')} style={styles.imagenested} resizeMode="cover" />
                                                    <View style={styles.textOverlay}>
                                                        <Text style={styles.text}>TRUST</Text>
                                                    </View>
                                                </Animated.View>
                                            </TouchableOpacity>
                                            {isDropdownVisible && (
                                                <View style={styles.dropdownContent}>
                                                    {groupedStepsData.map((group) => {
                                                        const { stepNumber, displayStepNumber, hindiVideo, englishVideo } = group;
                                                        const isCompleted = completedSteps[`step${stepNumber}`] ?? false;
                                                        const itemKey = `trust-step-group-${stepNumber}`;

                                                        if (!hindiVideo && !englishVideo) {
                                                            return null;
                                                        }

                                                        const videoToShowDuration = englishVideo || hindiVideo;
                                                        let durationText = "";
                                                        let hasDuration = false;

                                                        if (videoToShowDuration && videoToShowDuration.length !== undefined) {
                                                            durationText = formatDuration(videoToShowDuration.length);
                                                            hasDuration = true;
                                                        }

                                                        let stepDisplayText = `Step ${displayStepNumber}`;

                                                        return (
                                                            <TouchableOpacity
                                                                key={itemKey}
                                                                style={[
                                                                    styles.dropdownItemBtn,
                                                                    { backgroundColor: isCompleted ? '#4DB6AC' : 'rgba(20, 52, 164, 0.8)' }
                                                                ]}
                                                                onPress={() => handleDropdownItemClick(stepNumber)}
                                                            >
                                                                <Image
                                                                    source={isCompleted ? require('../img/checkedimg.png') : require('../img/videoPlayer.png')}
                                                                    style={styles.imageVideo}
                                                                    resizeMode="cover"
                                                                />

                                                                <Text style={styles.dropdownItem}>{stepDisplayText}</Text>

                                                                {hasDuration && (
                                                                    <View style={styles.durationContainer}>

                                                                        <Image
                                                                            source={require('../img/timer.png')}
                                                                            style={[
                                                                                styles.timerImage,
                                                                                { tintColor: isDarkMode ? '#FFD700' : '#FFD700' }
                                                                            ]}
                                                                            resizeMode="contain"
                                                                        />
                                                                        <Text style={[styles.durationText, { color: isDarkMode ? '#FFD700' : '#FFD700' }]}>
                                                                            {durationText}
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            )}

                                            <TouchableOpacity activeOpacity={1} onPress={handlePressLoveAndCare}>
                                                <Animated.View style={[styles.buttonNested, { transform: [{ scale: scale2 }], marginBottom: isDropdownVisibles ? 0 : 10 }]}>
                                                    <Image source={require('../img/loveandcare.png')} style={styles.imagenested} resizeMode="cover" />
                                                    <View style={styles.textOverlay}>
                                                        <Text style={styles.text}>LOVE AND CARE</Text>
                                                    </View>
                                                </Animated.View>
                                            </TouchableOpacity>
                                            {isDropdownVisibles && (
                                                <View style={styles.dropdownContent}>
                                                    {loveAndCareGroupedStepsData.map((group) => {
                                                        const { stepNumber, displayStepNumber, hindiVideo, englishVideo } = group;
                                                        const isCompleted = completedSteps[`step${stepNumber}`] ?? false;
                                                        const itemKey = `love-care-step-group-${stepNumber}`;

                                                        if (!hindiVideo && !englishVideo) {
                                                            return null;
                                                        }

                                                        const videoToShowDuration = englishVideo || hindiVideo;
                                                        let durationText = "";
                                                        let hasDuration = false;

                                                        if (videoToShowDuration && videoToShowDuration.length !== undefined) {
                                                            durationText = formatDuration(videoToShowDuration.length);
                                                            hasDuration = true;
                                                        }

                                                        let stepDisplayText = `Step ${displayStepNumber}`;

                                                        return (
                                                            <TouchableOpacity
                                                                key={itemKey}
                                                                style={[
                                                                    styles.dropdownItemBtn,
                                                                    { backgroundColor: isCompleted ? '#4DB6AC' : 'rgba(20, 52, 164, 0.8)' }
                                                                ]}
                                                                onPress={() => handleDropdownItemClick(stepNumber)}
                                                            >
                                                                <Image
                                                                    source={isCompleted ? require('../img/checkedimg.png') : require('../img/videoPlayer.png')}
                                                                    style={styles.imageVideo}
                                                                    resizeMode="cover"
                                                                />
                                                                <Text style={styles.dropdownItem}>{stepDisplayText}</Text>
                                                                {hasDuration && (
                                                                    <View style={styles.durationContainer}>
                                                                        <Image
                                                                            source={require('../img/timer.png')}
                                                                            style={[
                                                                                styles.timerImage,
                                                                                { tintColor: isDarkMode ? '#FFD700' : '#FFD700' }
                                                                            ]}
                                                                            resizeMode="contain"
                                                                        />
                                                                        <Text style={[styles.durationText, { color: isDarkMode ? '#FFD700' : '#FFD700' }]}>
                                                                            {durationText}
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            )}
                                            <TouchableOpacity activeOpacity={1} onPress={handleRESPECT}>
                                                <Animated.View style={[styles.buttonNested, { transform: [{ scale: scale3 }] }]}>
                                                    <Image source={require('../img/respact.png')} style={styles.imagenested} resizeMode="cover" />
                                                    <View style={styles.textOverlay}>
                                                        <Text style={styles.text}>RESPECT</Text>
                                                    </View>
                                                </Animated.View>
                                            </TouchableOpacity>
                                            {isDropdownVisibleRespect && (
                                                <View style={styles.dropdownContent}>
                                                    {respectGroupedStepsData.map((group) => {
                                                        const { stepNumber, displayStepNumber, hindiVideo, englishVideo } = group;
                                                        const isCompleted = completedSteps[`step${stepNumber}`] ?? false;
                                                        const itemKey = `respect-step-group-${stepNumber}`;

                                                        if (!hindiVideo && !englishVideo) {
                                                            return null;
                                                        }

                                                        const videoToShowDuration = englishVideo || hindiVideo;
                                                        let durationText = "";
                                                        let hasDuration = false;

                                                        if (videoToShowDuration && videoToShowDuration.length !== undefined) {
                                                            durationText = formatDuration(videoToShowDuration.length);
                                                            hasDuration = true;
                                                        }

                                                        let stepDisplayText = `Step ${displayStepNumber}`;

                                                        return (
                                                            <TouchableOpacity
                                                                key={itemKey}
                                                                style={[
                                                                    styles.dropdownItemBtn,
                                                                    { backgroundColor: isCompleted ? '#4DB6AC' : 'rgba(20, 52, 164, 0.8)' }
                                                                ]}
                                                                onPress={() => handleDropdownItemClick(stepNumber)}
                                                            >
                                                                <Image
                                                                    source={isCompleted ? require('../img/checkedimg.png') : require('../img/videoPlayer.png')}
                                                                    style={styles.imageVideo}
                                                                    resizeMode="cover"
                                                                />
                                                                <Text style={styles.dropdownItem}>{stepDisplayText}</Text>
                                                                {hasDuration && (
                                                                    <View style={styles.durationContainer}>
                                                                        <Image
                                                                            source={require('../img/timer.png')}
                                                                            style={[
                                                                                styles.timerImage,
                                                                                { tintColor: isDarkMode ? '#FFD700' : '#FFD700' }
                                                                            ]}
                                                                            resizeMode="contain"
                                                                        />
                                                                        <Text style={[styles.durationText, { color: isDarkMode ? '#FFD700' : '#FFD700' }]}>
                                                                            {durationText}
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            )}
                                            <TouchableOpacity activeOpacity={1} onPress={handleFamiliar} style={{ marginTop: 10 }}>
                                                <Animated.View style={[styles.buttonNested, { transform: [{ scale: scale4 }] }]}>
                                                    <Image source={require('../img/familiarimg.png')} style={styles.imagenested} resizeMode="cover" />
                                                    <View style={styles.textOverlay}>
                                                        <Text style={styles.text}>FAMILIAR</Text>
                                                    </View>
                                                </Animated.View>
                                            </TouchableOpacity>
                                            {isDropdownVisibleFamiliar && (
                                                <View style={[styles.dropdownContent, { marginTop: -0.5 }]}>
                                                    {familiarGroupedStepsData.map((group) => {
                                                        const { stepNumber, displayStepNumber, hindiVideo, englishVideo } = group;
                                                        const isCompleted = completedSteps[`step${stepNumber}`] ?? false;
                                                        const itemKey = `familiar-step-group-${stepNumber}`;

                                                        if (!hindiVideo && !englishVideo) {
                                                            return null;
                                                        }

                                                        const videoToShowDuration = englishVideo || hindiVideo;
                                                        let durationText = "";
                                                        let hasDuration = false;

                                                        if (videoToShowDuration && videoToShowDuration.length !== undefined) {
                                                            durationText = formatDuration(videoToShowDuration.length);
                                                            hasDuration = true;
                                                        }

                                                        let stepDisplayText = `Step ${displayStepNumber}`;

                                                        return (
                                                            <TouchableOpacity
                                                                key={itemKey}
                                                                style={[
                                                                    styles.dropdownItemBtn,
                                                                    { backgroundColor: isCompleted ? '#4DB6AC' : 'rgba(20, 52, 164, 0.8)' }
                                                                ]}
                                                                onPress={() => handleDropdownItemClick(stepNumber)}
                                                            >
                                                                <Image
                                                                    source={isCompleted ? require('../img/checkedimg.png') : require('../img/videoPlayer.png')}
                                                                    style={styles.imageVideo}
                                                                    resizeMode="cover"
                                                                />
                                                                <Text style={styles.dropdownItem}>{stepDisplayText}</Text>
                                                                {hasDuration && (
                                                                    <View style={styles.durationContainer}>
                                                                        <Image
                                                                            source={require('../img/timer.png')}
                                                                            style={[
                                                                                styles.timerImage,
                                                                                { tintColor: isDarkMode ? '#FFD700' : '#FFD700' }
                                                                            ]}
                                                                            resizeMode="contain"
                                                                        />
                                                                        <Text style={[styles.durationText, { color: isDarkMode ? '#FFD700' : '#FFD700' }]}>
                                                                            {durationText}
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            )}
                                        </View>
                                    </ScrollView>
                                </View>
                            </TouchableOpacity>
                        </Pressable>
                    </View>
                    )}

                    {isMiddleLevelDropdownVisible && (
                        <View style={styles.modalLikeContainer} >
                        <Pressable style={styles.fullScreenPressable} onPress={handleCloseModal}>
                            <TouchableOpacity activeOpacity={1} style={styles.modalLikeContentBox} onPress={() => {  }}>
                                <View style={[styles.modalContents, backgroundStyle]}>
                                    <View style={styles.modalHeader}>
                                        <Text style={styles.modalHeaderText}>Middle Level</Text>
                                        <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                                            <Text style={styles.closeButtonText}>✕</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <ScrollView
                                        style={styles.modalScrollView}
                                        contentContainerStyle={styles.modalScrollViewContent}
                                        showsVerticalScrollIndicator={false}
                                    >
                                        <View style={styles.videolist}>
                                            <TouchableOpacity activeOpacity={1} onPress={handleSpeechDevelopment}>
                                                <Animated.View
                                                    style={[styles.buttonNested, {
                                                        transform: [{ scale: scale1 }],
                                                        marginBottom: isDropdownVisibleSpeechDevelopment ? 0 : 10
                                                    }]}
                                                >
                                                    <Image source={require('../img/2148552491.jpg')} style={styles.imagenested} resizeMode="cover" />
                                                    <View style={styles.textOverlay}>
                                                        <Text style={styles.text}>SPEECH DEVELOPMENT​</Text>
                                                    </View>
                                                </Animated.View>
                                            </TouchableOpacity>
                                            {isDropdownVisibleSpeechDevelopment && (
                                                <View style={styles.dropdownContent}>
                                                    {speechDevGroupedStepsData.map((group) => {
                                                        const { stepNumber, displayStepNumber, hindiVideo, englishVideo } = group;
                                                        const isCompleted = completedSteps[`step${stepNumber}`] ?? false;
                                                        const itemKey = `speech-dev-step-group-${stepNumber}`;

                                                        if (!hindiVideo && !englishVideo) {
                                                            return null;
                                                        }

                                                        const videoToShowDuration = englishVideo || hindiVideo;
                                                        let durationText = "";
                                                        let hasDuration = false;

                                                        if (videoToShowDuration && videoToShowDuration.length !== undefined) {
                                                            durationText = formatDuration(videoToShowDuration.length);
                                                            hasDuration = true;
                                                        }

                                                        let stepDisplayText = `Step ${displayStepNumber}`;

                                                        return (
                                                            <TouchableOpacity
                                                                key={itemKey}
                                                                style={[
                                                                    styles.dropdownItemBtn,
                                                                    { backgroundColor: isCompleted ? '#4DB6AC' : 'rgba(20, 52, 164, 0.8)' }
                                                                ]}
                                                                onPress={() => handleDropdownItemClick(stepNumber)}
                                                            >
                                                                <Image
                                                                    source={isCompleted ? require('../img/checkedimg.png') : require('../img/videoPlayer.png')}
                                                                    style={styles.imageVideo}
                                                                    resizeMode="cover"
                                                                />

                                                                <Text style={styles.dropdownItem}>{stepDisplayText}</Text>

                                                                {hasDuration && (
                                                                    <View style={styles.durationContainer}>

                                                                        <Image
                                                                            source={require('../img/timer.png')}
                                                                            style={[
                                                                                styles.timerImage,
                                                                                { tintColor: isDarkMode ? '#FFD700' : '#FFD700' }
                                                                            ]}
                                                                            resizeMode="contain"
                                                                        />
                                                                        <Text style={[styles.durationText, { color: isDarkMode ? '#FFD700' : '#FFD700' }]}>
                                                                            {durationText}
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            )}
                                            <TouchableOpacity activeOpacity={1} onPress={handleTruth}>
                                                <Animated.View style={[styles.buttonNested, { transform: [{ scale: scale2 }], marginBottom: isDropdownVisibleTruth ? 0 : 10 }]}>
                                                    <Image source={require('../img/truth.png')} style={styles.imagenested} resizeMode="cover" />
                                                    <View style={styles.textOverlay}>
                                                        <Text style={styles.text}>TRUTH</Text>
                                                    </View>
                                                </Animated.View>
                                            </TouchableOpacity>
                                            {isDropdownVisibleTruth && (
                                                <View style={styles.dropdownContent}>
                                                    {truthGroupedStepsData.map((group) => {
                                                        const { stepNumber, displayStepNumber, hindiVideo, englishVideo } = group;
                                                        const isCompleted = completedSteps[`step${stepNumber}`] ?? false;
                                                        const itemKey = `truth-step-group-${stepNumber}`;

                                                        if (!hindiVideo && !englishVideo) {
                                                            return null;
                                                        }

                                                        const videoToShowDuration = englishVideo || hindiVideo;
                                                        let durationText = "";
                                                        let hasDuration = false;

                                                        if (videoToShowDuration && videoToShowDuration.length !== undefined) {
                                                            durationText = formatDuration(videoToShowDuration.length);
                                                            hasDuration = true;
                                                        }

                                                        let stepDisplayText = `Step ${displayStepNumber}`;

                                                        return (
                                                            <TouchableOpacity
                                                                key={itemKey}
                                                                style={[
                                                                    styles.dropdownItemBtn,
                                                                    { backgroundColor: isCompleted ? '#4DB6AC' : 'rgba(20, 52, 164, 0.8)' }
                                                                ]}
                                                                onPress={() => handleDropdownItemClick(stepNumber)}
                                                            >
                                                                <Image
                                                                    source={isCompleted ? require('../img/checkedimg.png') : require('../img/videoPlayer.png')}
                                                                    style={styles.imageVideo}
                                                                    resizeMode="cover"
                                                                />
                                                                <Text style={styles.dropdownItem}>{stepDisplayText}</Text>
                                                                {hasDuration && (
                                                                    <View style={styles.durationContainer}>
                                                                        <Image
                                                                            source={require('../img/timer.png')}
                                                                            style={[
                                                                                styles.timerImage,
                                                                                { tintColor: isDarkMode ? '#FFD700' : '#FFD700' }
                                                                            ]}
                                                                            resizeMode="contain"
                                                                        />
                                                                        <Text style={[styles.durationText, { color: isDarkMode ? '#FFD700' : '#FFD700' }]}>
                                                                            {durationText}
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            )}
                                            <TouchableOpacity activeOpacity={1} onPress={handleSetBoundaries}>
                                                <Animated.View style={[styles.buttonNested, { transform: [{ scale: scale3 }] }]}>
                                                    <Image source={require('../img/setboundries.png')} style={styles.imagenested} resizeMode="cover" />
                                                    <View style={styles.textOverlay}>
                                                        <Text style={styles.text}>SET BOUNDARIES​</Text>
                                                    </View>
                                                </Animated.View>
                                            </TouchableOpacity>
                                            {isDropdownVisibleSetBoundaries && (
                                                <View style={styles.dropdownContent}>
                                                    {setBoundariesGroupedStepsData.map((group) => {
                                                        const { stepNumber, displayStepNumber, hindiVideo, englishVideo } = group;
                                                        const isCompleted = completedSteps[`step${stepNumber}`] ?? false;
                                                        const itemKey = `set-boundaries-step-group-${stepNumber}`;

                                                        if (!hindiVideo && !englishVideo) {
                                                            return null;
                                                        }

                                                        const videoToShowDuration = englishVideo || hindiVideo;
                                                        let durationText = "";
                                                        let hasDuration = false;

                                                        if (videoToShowDuration && videoToShowDuration.length !== undefined) {
                                                            durationText = formatDuration(videoToShowDuration.length);
                                                            hasDuration = true;
                                                        }

                                                        let stepDisplayText = `Step ${displayStepNumber}`;

                                                        return (
                                                            <TouchableOpacity
                                                                key={itemKey}
                                                                style={[
                                                                    styles.dropdownItemBtn,
                                                                    { backgroundColor: isCompleted ? '#4DB6AC' : 'rgba(20, 52, 164, 0.8)' }
                                                                ]}
                                                                onPress={() => handleDropdownItemClick(stepNumber)}
                                                            >
                                                                <Image
                                                                    source={isCompleted ? require('../img/checkedimg.png') : require('../img/videoPlayer.png')}
                                                                    style={styles.imageVideo}
                                                                    resizeMode="cover"
                                                                />
                                                                <Text style={styles.dropdownItem}>{stepDisplayText}</Text>
                                                                {hasDuration && (
                                                                    <View style={styles.durationContainer}>
                                                                        <Image
                                                                            source={require('../img/timer.png')}
                                                                            style={[
                                                                                styles.timerImage,
                                                                                { tintColor: isDarkMode ? '#FFD700' : '#FFD700' }
                                                                            ]}
                                                                            resizeMode="contain"
                                                                        />
                                                                        <Text style={[styles.durationText, { color: isDarkMode ? '#FFD700' : '#FFD700' }]}>
                                                                            {durationText}
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            )}
                                            <TouchableOpacity activeOpacity={1} onPress={handleListenFollowInstructions} style={{ marginTop: 10 }}>
                                                <Animated.View style={[styles.buttonNested, { transform: [{ scale: scale4 }] }]}>
                                                    <Image source={require('../img/listenandfollowinstructions.png')} style={styles.imagenested} resizeMode="cover" />
                                                    <View style={styles.textOverlay}>
                                                        <Text style={styles.text}>LISTEN and Follow Instructions</Text>
                                                    </View>
                                                </Animated.View>
                                            </TouchableOpacity>
                                            {isDropdownVisibleListenFollowInstructions && (
                                                <View style={[styles.dropdownContent, { marginTop: -0.5 }]}>
                                                    {listenFollowGroupedStepsData.map((group) => {
                                                        const { stepNumber, displayStepNumber, hindiVideo, englishVideo } = group;
                                                        const isCompleted = completedSteps[`step${stepNumber}`] ?? false;
                                                        const itemKey = `listen-follow-step-group-${stepNumber}`;

                                                        if (!hindiVideo && !englishVideo) {
                                                            return null;
                                                        }

                                                        const videoToShowDuration = englishVideo || hindiVideo;
                                                        let durationText = "";
                                                        let hasDuration = false;

                                                        if (videoToShowDuration && videoToShowDuration.length !== undefined) {
                                                            durationText = formatDuration(videoToShowDuration.length);
                                                            hasDuration = true;
                                                        }

                                                        let stepDisplayText = `Step ${displayStepNumber}`;

                                                        return (
                                                            <TouchableOpacity
                                                                key={itemKey}
                                                                style={[
                                                                    styles.dropdownItemBtn,
                                                                    { backgroundColor: isCompleted ? '#4DB6AC' : 'rgba(20, 52, 164, 0.8)' }
                                                                ]}
                                                                onPress={() => handleDropdownItemClick(stepNumber)}
                                                            >
                                                                <Image
                                                                    source={isCompleted ? require('../img/checkedimg.png') : require('../img/videoPlayer.png')}
                                                                    style={styles.imageVideo}
                                                                    resizeMode="cover"
                                                                />
                                                                <Text style={styles.dropdownItem}>{stepDisplayText}</Text>
                                                                {hasDuration && (
                                                                    <View style={styles.durationContainer}>
                                                                        <Image
                                                                            source={require('../img/timer.png')}
                                                                            style={[
                                                                                styles.timerImage,
                                                                                { tintColor: isDarkMode ? '#FFD700' : '#FFD700' }
                                                                            ]}
                                                                            resizeMode="contain"
                                                                        />
                                                                        <Text style={[styles.durationText, { color: isDarkMode ? '#FFD700' : '#FFD700' }]}>
                                                                            {durationText}
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            )}
                                        </View>
                                    </ScrollView>
                                </View>
                            </TouchableOpacity>
                        </Pressable>
                    </View>

                    )}
                    {isAdvancedLevelDropdownVisible && (
                        <View style={styles.modalLikeContainer} >
                        <Pressable style={styles.fullScreenPressable} onPress={handleCloseModal}>
                            <TouchableOpacity activeOpacity={1} style={styles.modalLikeContentBox} onPress={() => {  }}>
                                <View style={[styles.modalContents, backgroundStyle]}>
                                    <View style={styles.modalHeader}>
                                        <Text style={styles.modalHeaderText}>Advanced Level</Text>
                                        <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                                            <Text style={styles.closeButtonText}>✕</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <ScrollView
                                        style={styles.modalScrollView}
                                        contentContainerStyle={styles.modalScrollViewContent}
                                        showsVerticalScrollIndicator={false}
                                    >
                                        <View style={styles.videolist}>
                                            <TouchableOpacity activeOpacity={1} onPress={handleCooperationPress}>
                                                <Animated.View
                                                    style={[styles.buttonNested, {
                                                        transform: [{ scale: scale1 }],
                                                        marginBottom: isDropdownVisibleCooperationPress ? 0 : 10
                                                    }]}
                                                >
                                                    <Image source={require('../img/co-operation.png')} style={styles.imagenested} resizeMode="cover" />
                                                    <View style={styles.textOverlay}>
                                                        <Text style={styles.text}>COOPERATION​</Text>
                                                    </View>
                                                </Animated.View>
                                            </TouchableOpacity>
                                            {isDropdownVisibleCooperationPress && (
                                                <View style={styles.dropdownContent}>
                                                    {cooperationGroupedStepsData.map((group) => {
                                                        const { stepNumber, displayStepNumber, hindiVideo, englishVideo } = group;
                                                        const isCompleted = completedSteps[`step${stepNumber}`] ?? false;
                                                        const itemKey = `cooperation-step-group-${stepNumber}`;

                                                        if (!hindiVideo && !englishVideo) {
                                                            return null;
                                                        }

                                                        const videoToShowDuration = englishVideo || hindiVideo;
                                                        let durationText = "";
                                                        let hasDuration = false;

                                                        if (videoToShowDuration && videoToShowDuration.length !== undefined) {
                                                            durationText = formatDuration(videoToShowDuration.length);
                                                            hasDuration = true;
                                                        }

                                                        let stepDisplayText = `Step ${displayStepNumber}`;

                                                        return (
                                                            <TouchableOpacity
                                                                key={itemKey}
                                                                style={[
                                                                    styles.dropdownItemBtn,
                                                                    { backgroundColor: isCompleted ? '#4DB6AC' : 'rgba(20, 52, 164, 0.8)' }
                                                                ]}
                                                                onPress={() => handleDropdownItemClick(stepNumber)}
                                                            >
                                                                <Image
                                                                    source={isCompleted ? require('../img/checkedimg.png') : require('../img/videoPlayer.png')}
                                                                    style={styles.imageVideo}
                                                                    resizeMode="cover"
                                                                />

                                                                <Text style={styles.dropdownItem}>{stepDisplayText}</Text>

                                                                {hasDuration && (
                                                                    <View style={styles.durationContainer}>

                                                                        <Image
                                                                            source={require('../img/timer.png')}
                                                                            style={[
                                                                                styles.timerImage,
                                                                                { tintColor: isDarkMode ? '#FFD700' : '#FFD700' }
                                                                            ]}
                                                                            resizeMode="contain"
                                                                        />
                                                                        <Text style={[styles.durationText, { color: isDarkMode ? '#FFD700' : '#FFD700' }]}>
                                                                            {durationText}
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            )}
                                            <TouchableOpacity activeOpacity={1} onPress={handleImgainationandPretendPlayPress}>
                                                <Animated.View style={[styles.buttonNested, { transform: [{ scale: scale2 }], marginBottom: isDropdownVisibleImgainationandPretendPlay ? 0 : 10 }]}>
                                                    <Image source={require('../img/imagineandpretendplay.png')} style={styles.imagenested} resizeMode="cover" />
                                                    <View style={styles.textOverlay}>
                                                        <Text style={styles.text}>IMAGINATION & PRETEND PLAY</Text>
                                                    </View>
                                                </Animated.View>
                                            </TouchableOpacity>
                                            {isDropdownVisibleImgainationandPretendPlay && (
                                                <View style={styles.dropdownContent}>
                                                    {imaginationGroupedStepsData.map((group) => {
                                                        const { stepNumber, displayStepNumber, hindiVideo, englishVideo } = group;
                                                        const isCompleted = completedSteps[`step${stepNumber}`] ?? false;
                                                        const itemKey = `imagination-step-group-${stepNumber}`;

                                                        if (!hindiVideo && !englishVideo) {
                                                            return null;
                                                        }

                                                        const videoToShowDuration = englishVideo || hindiVideo;
                                                        let durationText = "";
                                                        let hasDuration = false;

                                                        if (videoToShowDuration && videoToShowDuration.length !== undefined) {
                                                            durationText = formatDuration(videoToShowDuration.length);
                                                            hasDuration = true;
                                                        }

                                                        let stepDisplayText = `Step ${displayStepNumber}`;

                                                        return (
                                                            <TouchableOpacity
                                                                key={itemKey}
                                                                style={[
                                                                    styles.dropdownItemBtn,
                                                                    { backgroundColor: isCompleted ? '#4DB6AC' : 'rgba(20, 52, 164, 0.8)' }
                                                                ]}
                                                                onPress={() => handleDropdownItemClick(stepNumber)}
                                                            >
                                                                <Image
                                                                    source={isCompleted ? require('../img/checkedimg.png') : require('../img/videoPlayer.png')}
                                                                    style={styles.imageVideo}
                                                                    resizeMode="cover"
                                                                />
                                                                <Text style={styles.dropdownItem}>{stepDisplayText}</Text>
                                                                {hasDuration && (
                                                                    <View style={styles.durationContainer}>
                                                                        <Image
                                                                            source={require('../img/timer.png')}
                                                                            style={[
                                                                                styles.timerImage,
                                                                                { tintColor: isDarkMode ? '#FFD700' : '#FFD700' }
                                                                            ]}
                                                                            resizeMode="contain"
                                                                        />
                                                                        <Text style={[styles.durationText, { color: isDarkMode ? '#FFD700' : '#FFD700' }]}>
                                                                            {durationText}
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            )}
                                            <TouchableOpacity activeOpacity={1} onPress={handleHelp}>
                                                <Animated.View style={[styles.buttonNested, { transform: [{ scale: scale3 }] }]}>
                                                    <Image source={require('../img/Givehelpandaskhelp.png')} style={styles.imagenested} resizeMode="cover" />
                                                    <View style={styles.textOverlay}>
                                                        <Text style={styles.text}>ASK HELP & GIVE HELP​</Text>
                                                    </View>
                                                </Animated.View>
                                            </TouchableOpacity>
                                            {isDropdownVisibleHelp && (
                                                <View style={styles.dropdownContent}>
                                                    {helpGroupedStepsData.map((group) => {
                                                        const { stepNumber, displayStepNumber, hindiVideo, englishVideo } = group;
                                                        const isCompleted = completedSteps[`step${stepNumber}`] ?? false;
                                                        const itemKey = `help-step-group-${stepNumber}`;

                                                        if (!hindiVideo && !englishVideo) {
                                                            return null;
                                                        }

                                                        const videoToShowDuration = englishVideo || hindiVideo;
                                                        let durationText = "";
                                                        let hasDuration = false;

                                                        if (videoToShowDuration && videoToShowDuration.length !== undefined) {
                                                            durationText = formatDuration(videoToShowDuration.length);
                                                            hasDuration = true;
                                                        }

                                                        let stepDisplayText = `Step ${displayStepNumber}`;

                                                        return (
                                                            <TouchableOpacity
                                                                key={itemKey}
                                                                style={[
                                                                    styles.dropdownItemBtn,
                                                                    { backgroundColor: isCompleted ? '#4DB6AC' : 'rgba(20, 52, 164, 0.8)' }
                                                                ]}
                                                                onPress={() => handleDropdownItemClick(stepNumber)}
                                                            >
                                                                <Image
                                                                    source={isCompleted ? require('../img/checkedimg.png') : require('../img/videoPlayer.png')}
                                                                    style={styles.imageVideo}
                                                                    resizeMode="cover"
                                                                />
                                                                <Text style={styles.dropdownItem}>{stepDisplayText}</Text>
                                                                {hasDuration && (
                                                                    <View style={styles.durationContainer}>
                                                                        <Image
                                                                            source={require('../img/timer.png')}
                                                                            style={[
                                                                                styles.timerImage,
                                                                                { tintColor: isDarkMode ? '#FFD700' : '#FFD700' }
                                                                            ]}
                                                                            resizeMode="contain"
                                                                        />
                                                                        <Text style={[styles.durationText, { color: isDarkMode ? '#FFD700' : '#FFD700' }]}>
                                                                            {durationText}
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            )}
                                            <TouchableOpacity activeOpacity={1} onPress={handleDiscussionQuestionsAnswers} style={{ marginTop: 10 }}>
                                                <Animated.View style={[styles.buttonNested, { transform: [{ scale: scale4 }] }]}>
                                                    <Image source={require('../img/DiscussionQandA.png')} style={styles.imagenested} resizeMode="cover" />
                                                    <View style={styles.textOverlay}>
                                                        <Text style={styles.text}>DISCUSSION - QUESTIONS & ANSWERS</Text>
                                                    </View>
                                                </Animated.View>
                                            </TouchableOpacity>
                                            {isDropdownVisibleDiscussionQuestionsAnswers && (
                                                 <View style={styles.dropdownContent}>
                                                    {discussionGroupedStepsData.map((group) => {
                                                        const { stepNumber, displayStepNumber, hindiVideo, englishVideo } = group;
                                                        const isCompleted = completedSteps[`step${stepNumber}`] ?? false;
                                                        const itemKey = `discussion-step-group-${stepNumber}`;

                                                        if (!hindiVideo && !englishVideo) {
                                                            return null;
                                                        }

                                                        const videoToShowDuration = englishVideo || hindiVideo;
                                                        let durationText = "";
                                                        let hasDuration = false;

                                                        if (videoToShowDuration && videoToShowDuration.length !== undefined) {
                                                            durationText = formatDuration(videoToShowDuration.length);
                                                            hasDuration = true;
                                                        }

                                                        let stepDisplayText = `Step ${displayStepNumber}`;

                                                        return (
                                                            <TouchableOpacity
                                                                key={itemKey}
                                                                style={[
                                                                    styles.dropdownItemBtn,
                                                                    { backgroundColor: isCompleted ? '#4DB6AC' : 'rgba(20, 52, 164, 0.8)' }
                                                                ]}
                                                                onPress={() => handleDropdownItemClick(stepNumber)}
                                                            >
                                                                <Image
                                                                    source={isCompleted ? require('../img/checkedimg.png') : require('../img/videoPlayer.png')}
                                                                    style={styles.imageVideo}
                                                                    resizeMode="cover"
                                                                />
                                                                <Text style={styles.dropdownItem}>{stepDisplayText}</Text>
                                                                {hasDuration && (
                                                                    <View style={styles.durationContainer}>
                                                                        <Image
                                                                            source={require('../img/timer.png')}
                                                                            style={[
                                                                                styles.timerImage,
                                                                                { tintColor: isDarkMode ? '#FFD700' : '#FFD700' }
                                                                            ]}
                                                                            resizeMode="contain"
                                                                        />
                                                                        <Text style={[styles.durationText, { color: isDarkMode ? '#FFD700' : '#FFD700' }]}>
                                                                            {durationText}
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            )}
                                            <TouchableOpacity activeOpacity={1} onPress={handleAbletoNarrate} style={{ marginTop: 10 }}>
                                                <Animated.View style={[styles.buttonNested, { transform: [{ scale: scale4 }] }]}>
                                                    <Image source={require('../img/abletonarrate.png')} style={styles.imagenested} resizeMode="cover" />
                                                    <View style={styles.textOverlay}>
                                                        <Text style={styles.text}>ABLE TO NARRATE</Text>
                                                    </View>
                                                </Animated.View>
                                            </TouchableOpacity>
                                            {isDropdownVisibleAbletoNarrate && (
                                                <View style={styles.dropdownContent}>
                                                    {ableToNarrateGroupedStepsData.map((group) => {
                                                        const { stepNumber, displayStepNumber, hindiVideo, englishVideo } = group;
                                                        const isCompleted = completedSteps[`step${stepNumber}`] ?? false;
                                                        const itemKey = `able-narrate-step-group-${stepNumber}`;

                                                        if (!hindiVideo && !englishVideo) {
                                                            return null;
                                                        }

                                                        const videoToShowDuration = englishVideo || hindiVideo;
                                                        let durationText = "";
                                                        let hasDuration = false;

                                                        if (videoToShowDuration && videoToShowDuration.length !== undefined) {
                                                            durationText = formatDuration(videoToShowDuration.length);
                                                            hasDuration = true;
                                                        }

                                                        let stepDisplayText = `Step ${displayStepNumber}`;

                                                        return (
                                                            <TouchableOpacity
                                                                key={itemKey}
                                                                style={[
                                                                    styles.dropdownItemBtn,
                                                                    { backgroundColor: isCompleted ? '#4DB6AC' : 'rgba(20, 52, 164, 0.8)' }
                                                                ]}
                                                                onPress={() => handleDropdownItemClick(stepNumber)}
                                                            >
                                                                <Image
                                                                    source={isCompleted ? require('../img/checkedimg.png') : require('../img/videoPlayer.png')}
                                                                    style={styles.imageVideo}
                                                                    resizeMode="cover"
                                                                />
                                                                <Text style={styles.dropdownItem}>{stepDisplayText}</Text>
                                                                {hasDuration && (
                                                                    <View style={styles.durationContainer}>
                                                                        <Image
                                                                            source={require('../img/timer.png')}
                                                                            style={[
                                                                                styles.timerImage,
                                                                                { tintColor: isDarkMode ? '#FFD700' : '#FFD700' }
                                                                            ]}
                                                                            resizeMode="contain"
                                                                        />
                                                                        <Text style={[styles.durationText, { color: isDarkMode ? '#FFD700' : '#FFD700' }]}>
                                                                            {durationText}
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            )}
                                            <TouchableOpacity activeOpacity={1} onPress={handleEmotionsBlance} style={{ marginTop: 10 }}>
                                                <Animated.View style={[styles.buttonNested, { transform: [{ scale: scale4 }] }]}>
                                                    <Image source={require('../img/expressemotionandcontrol.png')} style={styles.imagenested} resizeMode="cover" />
                                                    <View style={styles.textOverlay}>
                                                        <Text style={styles.text}>EXPRESS EMOTIONS AND BALANCE IT</Text>
                                                    </View>
                                                </Animated.View>
                                            </TouchableOpacity>
                                            {isDropdownVisibleEmotionsBlance && (
                                                <View style={styles.dropdownContent}>
                                                    {emotionsBalanceGroupedStepsData.map((group) => {
                                                        const { stepNumber, displayStepNumber, hindiVideo, englishVideo } = group;
                                                        const isCompleted = completedSteps[`step${stepNumber}`] ?? false;
                                                        const itemKey = `emotions-balance-step-group-${stepNumber}`;

                                                        if (!hindiVideo && !englishVideo) {
                                                            return null;
                                                        }

                                                        const videoToShowDuration = englishVideo || hindiVideo;
                                                        let durationText = "";
                                                        let hasDuration = false;

                                                        if (videoToShowDuration && videoToShowDuration.length !== undefined) {
                                                            durationText = formatDuration(videoToShowDuration.length);
                                                            hasDuration = true;
                                                        }

                                                        let stepDisplayText = `Step ${displayStepNumber}`;

                                                        return (
                                                            <TouchableOpacity
                                                                key={itemKey}
                                                                style={[
                                                                    styles.dropdownItemBtn,
                                                                    { backgroundColor: isCompleted ? '#4DB6AC' : 'rgba(20, 52, 164, 0.8)' }
                                                                ]}
                                                                onPress={() => handleDropdownItemClick(stepNumber)}
                                                            >
                                                                <Image
                                                                    source={isCompleted ? require('../img/checkedimg.png') : require('../img/videoPlayer.png')}
                                                                    style={styles.imageVideo}
                                                                    resizeMode="cover"
                                                                />
                                                                <Text style={styles.dropdownItem}>{stepDisplayText}</Text>
                                                                {hasDuration && (
                                                                    <View style={styles.durationContainer}>
                                                                        <Image
                                                                            source={require('../img/timer.png')}
                                                                            style={[
                                                                                styles.timerImage,
                                                                                { tintColor: isDarkMode ? '#FFD700' : '#FFD700' }
                                                                            ]}
                                                                            resizeMode="contain"
                                                                        />
                                                                        <Text style={[styles.durationText, { color: isDarkMode ? '#FFD700' : '#FFD700' }]}>
                                                                            {durationText}
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            )}
                                            <TouchableOpacity activeOpacity={1} onPress={handleFeelingsofOthers} style={{ marginTop: 10 }}>
                                                <Animated.View style={[styles.buttonNested, { transform: [{ scale: scale4 }] }]}>
                                                    <Image source={require('../img/feelingofothers.png')} style={styles.imagenested} resizeMode="cover" />
                                                    <View style={styles.textOverlay}>
                                                        <Text style={styles.text}>FEELINGS OF OTHERS</Text>
                                                    </View>
                                                </Animated.View>
                                            </TouchableOpacity>
                                            {isDropdownVisibleFeelingsofOthers && (
                                                <View style={styles.dropdownContent}>
                                                    {feelingsOfOthersGroupedStepsData.map((group) => {
                                                        const { stepNumber, displayStepNumber, hindiVideo, englishVideo } = group;
                                                        const isCompleted = completedSteps[`step${stepNumber}`] ?? false;
                                                        const itemKey = `feelings-others-step-group-${stepNumber}`;

                                                        if (!hindiVideo && !englishVideo) {
                                                            return null;
                                                        }

                                                        const videoToShowDuration = englishVideo || hindiVideo;
                                                        let durationText = "";
                                                        let hasDuration = false;

                                                        if (videoToShowDuration && videoToShowDuration.length !== undefined) {
                                                            durationText = formatDuration(videoToShowDuration.length);
                                                            hasDuration = true;
                                                        }

                                                        let stepDisplayText = `Step ${displayStepNumber}`;

                                                        return (
                                                            <TouchableOpacity
                                                                key={itemKey}
                                                                style={[
                                                                    styles.dropdownItemBtn,
                                                                    { backgroundColor: isCompleted ? '#4DB6AC' : 'rgba(20, 52, 164, 0.8)' }
                                                                ]}
                                                                onPress={() => handleDropdownItemClick(stepNumber)}
                                                            >
                                                                <Image
                                                                    source={isCompleted ? require('../img/checkedimg.png') : require('../img/videoPlayer.png')}
                                                                    style={styles.imageVideo}
                                                                    resizeMode="cover"
                                                                />
                                                                <Text style={styles.dropdownItem}>{stepDisplayText}</Text>
                                                                {hasDuration && (
                                                                    <View style={styles.durationContainer}>
                                                                        <Image
                                                                            source={require('../img/timer.png')}
                                                                            style={[
                                                                                styles.timerImage,
                                                                                { tintColor: isDarkMode ? '#FFD700' : '#FFD700' }
                                                                            ]}
                                                                            resizeMode="contain"
                                                                        />
                                                                        <Text style={[styles.durationText, { color: isDarkMode ? '#FFD700' : '#FFD700' }]}>
                                                                            {durationText}
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            )}
                                            <TouchableOpacity activeOpacity={1} onPress={handleKnowledgeandCuriousitydevelopment} style={{ marginTop: 10 }}>
                                                <Animated.View style={[styles.buttonNested, { transform: [{ scale: scale4 }] }]}>
                                                    <Image source={require('../img/2148812268.jpg')} style={styles.imagenested} resizeMode="cover" />
                                                    <View style={styles.textOverlay}>
                                                        <Text style={styles.text}>KNOWLEDGE & CURIOUSITY DEVELOPMENT​</Text>
                                                    </View>
                                                </Animated.View>
                                            </TouchableOpacity>
                                            {isDropdownVisibleKnowledgeandCuriousitydevelopment && (
                                                <View style={styles.dropdownContent}>
                                                    {knowledgeCuriosityGroupedStepsData.map((group) => {
                                                        const { stepNumber, displayStepNumber, hindiVideo, englishVideo } = group;
                                                        const isCompleted = completedSteps[`step${stepNumber}`] ?? false;
                                                        const itemKey = `knowledge-curiosity-step-group-${stepNumber}`;

                                                        if (!hindiVideo && !englishVideo) {
                                                            return null;
                                                        }

                                                        const videoToShowDuration = englishVideo || hindiVideo;
                                                        let durationText = "";
                                                        let hasDuration = false;

                                                        if (videoToShowDuration && videoToShowDuration.length !== undefined) {
                                                            durationText = formatDuration(videoToShowDuration.length);
                                                            hasDuration = true;
                                                        }

                                                        let stepDisplayText = `Step ${displayStepNumber}`;

                                                        return (
                                                            <TouchableOpacity
                                                                key={itemKey}
                                                                style={[
                                                                    styles.dropdownItemBtn,
                                                                    { backgroundColor: isCompleted ? '#4DB6AC' : 'rgba(20, 52, 164, 0.8)' }
                                                                ]}
                                                                onPress={() => handleDropdownItemClick(stepNumber)}
                                                            >
                                                                <Image
                                                                    source={isCompleted ? require('../img/checkedimg.png') : require('../img/videoPlayer.png')}
                                                                    style={styles.imageVideo}
                                                                    resizeMode="cover"
                                                                />
                                                                <Text style={styles.dropdownItem}>{stepDisplayText}</Text>
                                                                {hasDuration && (
                                                                    <View style={styles.durationContainer}>
                                                                        <Image
                                                                            source={require('../img/timer.png')}
                                                                            style={[
                                                                                styles.timerImage,
                                                                                { tintColor: isDarkMode ? '#FFD700' : '#FFD700' }
                                                                            ]}
                                                                            resizeMode="contain"
                                                                        />
                                                                        <Text style={[styles.durationText, { color: isDarkMode ? '#FFD700' : '#FFD700' }]}>
                                                                            {durationText}
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            )}
                                        </View>
                                    </ScrollView>
                                </View>
                            </TouchableOpacity>
                        </Pressable>
                    </View>
                    )}
                </View>
                {isModalVisible && selectedStepGroup && (
                <View style={styles.modalLikeContainer} >
                    <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                        <View style={styles.modalContentMainDiv}>
                                    <Text style={styles.modalTitle}>Select Language</Text>
                                    <TouchableOpacity onPress={closeLanguageModal}>
                                        <Text style={styles.modalContentClose}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                        <View style={styles.borderLine} />
                        <Text style={styles.modalText}> In which language would you like to watch this Video?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.modalButton,
                                    !selectedStepGroup.hindiVideo && styles.disabledButton
                                ]}
                                onPress={() => {
                                    if (selectedStepGroup.hindiVideo) {
                                        handleVideo(selectedStepGroup.hindiVideo.id, selectedStepGroup.stepNumber, 'hindi');
                                        closeLanguageModal();
                                    }
                                }}
                                disabled={!selectedStepGroup.hindiVideo}>
                                <Text style={styles.modalButtonText}>Hindi</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.modalButton,
                                    !selectedStepGroup.englishVideo && styles.disabledButton
                                ]}
                                onPress={() => {
                                    if (selectedStepGroup.englishVideo) {
                                        handleVideo(selectedStepGroup.englishVideo.id, selectedStepGroup.stepNumber, 'english');
                                        closeLanguageModal();
                                    }
                                }}
                                disabled={!selectedStepGroup.englishVideo}>
                                <Text style={styles.modalButtonText}>English</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </View>
            )}

            <View style={[styles.bottomNav, backgroundStyle]}>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
                    <Image source={require('../img/hometab.png')} style={[styles.navIcon, { tintColor: isDarkMode ? '#60b5f6' : 'rgba(20, 52, 164, 1)' }]} />
                    <Text style={[styles.navTextActive, { color: isDarkMode ? '#60b5f6' : '#1434a4' }]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.navItem, styles.inactive]} onPress={() => navigation.navigate('Cashback for Feedback')}>
                    <Image source={require('../img/feedbacktab.png')} style={[styles.navIcon, { tintColor: 'gray' }]} />
                    <Text style={styles.navText}>Cashback for Feedback</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.navItem, styles.inactive]} onPress={() => navigation.navigate('Refer and Earn')}>
                    <Image source={require('../img/money.png')} style={[styles.navIcon, { tintColor: 'gray' }]} />
                    <Text style={styles.navText}>Refer & Earn</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.navItem, styles.inactive]} onPress={() => navigation.navigate('My Profile')}>
                    <Image source={require('../img/proflie.png')} style={[styles.navIcon, { tintColor: 'gray' }]} />
                    <Text style={styles.navText}>My Profile</Text>
                </TouchableOpacity>
            </View>
            {isVideoLoading && (
                <View style={styles.modalLikeContainer} >
                    <Pressable style={styles.smallFullScreenPressable}>
                        <ActivityIndicator size="large" color="#FFFFFF" />
                        <Text style={styles.loadingText}>Loading...</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5FCFF',},
    imageContainer: {  flex: 1, flexDirection: 'column', alignItems: 'center', paddingVertical: 10,gap:10 },
    button: { marginBottom: 0, position: 'relative', borderRadius: 5, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5, },
    image: { width: width - 20, height: height / 2, borderRadius: 5,},
    imagenested: { width: width - 48, height: height /2.8, borderRadius: 5,},
    textOverlay: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'rgba(20, 52, 164, 0.9)', padding: 10, alignItems: 'center', borderBottomLeftRadius: 5, borderBottomRightRadius: 5,},
    textOverlayTwo: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'rgba(20, 52, 164, 0.9)', padding: 10, alignItems: 'center', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, flexDirection: 'row', justifyContent: 'space-between',},
    text: { color: '#fff', fontSize: 16, fontWeight: 'bold',textAlign:'center' },
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
    inactive: {opacity: 0.5,},

    navTextActive: { color: 'rgba(20, 52, 164, 1)', fontSize: 10, marginTop: 4, fontWeight: 'bold', },

    dropdownContent: { borderBottomLeftRadius: 5, borderBottomRightRadius: 5, width: '100%', marginBottom: 10, paddingHorizontal: 0, },
    dropdownItemBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10, gap: 10, width: '100%', },
    imageVideo: { width: 35, height: 35, borderRadius: 5 },
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
    dropdownItem: { fontSize: 16, color: '#fff', fontWeight: '500' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { width: width * 0.8, backgroundColor: '#fff', paddingHorizontal: 20, paddingTop:10,paddingBottom:20, borderRadius: 10, alignItems: 'center' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    modalText: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
    modalButtons: { flexDirection: 'row', gap: 15 },
    modalButton: { backgroundColor: 'rgba(20, 52, 164, 1)', paddingVertical: 10, width: 100, borderRadius: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },
    modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' ,  textAlign: 'center', },
    video: { width: '100%', height: '100%' },
    fullScreenModalContainer: { flex: 1, backgroundColor: '#000', margin: 0,},
    fullScreenWebView: { flex: 1, width: '100%',  height: '100%', },
    videolist:{ paddingHorizontal: 10, width: '100%', },
    tabimage: { width: '25', height:22},
    modalContentClose:{color: '#000', fontSize: 16, fontWeight: 'bold',},
    modalContentMainDiv:{flexDirection: "row", justifyContent: "space-between", width:'100%',},
    borderLine:{borderBottomWidth: 1, borderBottomColor: "#ccc", width: "100%", marginBottom:15},
    loadingModalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)',},
    loadingText: { marginTop: 10, color: '#FFFFFF', fontSize: 16, },
    modalOverlay: { flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: 'rgba(0, 0, 0, 0.6)',},
    modalContentContainer: { width: '95%',maxHeight: '80%',backgroundColor: 'transparent',},
    modalContents: { backgroundColor: '#dee2e6',borderRadius: 10,overflow: 'hidden',width: '100%',height: '100%',display: 'flex',flexDirection: 'column',shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.25,shadowRadius: 4,elevation: 5,},
    modalHeader: { width: '100%',
        paddingVertical: 10,paddingHorizontal: 20,flexDirection: 'row',
        justifyContent: 'space-between',alignItems: 'center',borderBottomWidth: 1,
        borderBottomColor: 'rgba(20, 52, 164, 1)',backgroundColor: 'rgba(20, 52, 164, 1)',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin:0,
    },
    modalHeaderFirst: { flex: 1,position: 'absolute',width: '100%',
        paddingVertical: 0,paddingHorizontal: 10,flexDirection: 'row',
        justifyContent: 'space-between',alignItems: 'center',borderBottomWidth: 1,
        borderBottomColor: 'rgba(20, 52, 164, 1)',backgroundColor: 'rgba(0, 0, 0, 0.8)',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin:0,
    },
    modalHeaderText: { fontSize: 18,fontWeight: 'bold',color: '#fff',},
    closeButton: { padding: 5},
    closeButtonText: { fontSize: 18,fontWeight: 'bold',color: '#fff',},
    modalScrollView: { flex: 1,width: '100%',},
    modalScrollViewContent: { paddingHorizontal: 5,paddingVertical: 10,},
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
    player: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: 'transparent',
        padding:0,
    },
    fullScreenPressable: {
       position: 'absolute',
       top: 20,
       left: 0,
       right: 0,
       bottom: 20,
       flex: 1,
       justifyContent: 'flex-end',
       alignItems: 'center',
    },
    modalLikeContentBox: {
        width: '95%',
        height: '100%',
        maxHeight: '100%',
        backgroundColor: '#dee2e6',
        borderRadius: 10,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
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
    handImage: {
        position: 'absolute',
        width: 50,
        height: 50,
        zIndex: 10,
    },
     videoPlayer: {
    width: '100%',
    height: 250,
    backgroundColor: 'black',
  },
  anotherVideoStyle: {
    borderColor: 'red',
    borderWidth: 2,
  },
    loaderContainer: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1,
},
closeButtonModal: {
  position: 'absolute',
  top: 30,
  right: 10,
  zIndex: 10,
  backgroundColor: 'rgba(20, 52, 164, 1)',
  borderRadius: 20,
  paddingHorizontal: 12,
  paddingVertical:8,
},

closeButtonText: {
  color: '#fff',
  fontSize: 20,
  fontWeight: 'bold',
},
});
export default Dashboard;
