import React, { useState, useRef, useEffect, useMemo } from 'react';
import { StatusBar, useWindowDimensions } from 'react-native';
import { StyleSheet, ScrollView, View, Image, Animated, Text, TouchableOpacity, Alert, ActivityIndicator, Pressable, useColorScheme, Platform, ToastAndroid, BackHandler, findNodeHandle } from 'react-native';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './config/api';

const url = BASE_URL;

const formatDuration = (totalSeconds) => {
    if (isNaN(totalSeconds) || totalSeconds < 0) return "--:--";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const StepListItem = React.forwardRef(
    ({ group, onPress, isCompleted, isLocked, isDarkMode, previousDisplay }, ref) => {

        const { stepNumber, displayStepNumber, hindiVideo, englishVideo } = group;
        if (!hindiVideo && !englishVideo) return null;

        const videoToShowDuration = englishVideo || hindiVideo;
        const durationText = videoToShowDuration?.length ? formatDuration(videoToShowDuration.length) : "";
        const itemStyle = isLocked ? styles.lockedDropdownItemBtn : (isCompleted ? styles.completedDropdownItemBtn : styles.dropdownItemBtn);
        return (
            <View ref={ref} collapsable={false}>
                <TouchableOpacity
                    style={itemStyle}
                    onPress={() => {
                        if (isLocked) {
                            const prevLabel = previousDisplay ?? 'previous';
                            Alert.alert('Step Locked', `Please complete Step ${prevLabel} to unlock this step.`);
                            return;
                        }
                        if (typeof onPress === 'function') onPress(stepNumber);
                    }}
                    activeOpacity={0.7}
                    accessible={true}
                    accessibilityRole="button"
                >
                    <Image
                        source={isCompleted ? require('../img/checkedimg.png') : require('../img/videoPlayer.png')}
                        style={styles.imageVideo}
                        resizeMode="cover"
                    />
                    <Text style={styles.dropdownItem}>{`Step ${displayStepNumber}`}</Text>
                    {durationText && (
                        <View style={styles.durationContainer}>
                            <Image
                                source={require('../img/timer.png')}
                                style={[styles.timerImage, { tintColor: '#FFD700' }]}
                                resizeMode="contain"
                            />
                            <Text style={[styles.durationText, { color: '#FFD700' }]}>
                                {durationText}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        );
    }
);

const VideoStepList = ({ groups, completedSteps, onStepPress, isDarkMode, stepRefs }) => {
    return (
        <View style={styles.dropdownContent}>
            {groups.map((group, index) => {
                const isFirstStep = index === 0;
                const previousStep = isFirstStep ? null : groups[index - 1];
                const isPreviousStepCompleted = isFirstStep || (previousStep && completedSteps[`step${previousStep.stepNumber}`]);
                const isLocked = !isPreviousStepCompleted;

                return (
                    <StepListItem
                        key={`step-group-${group.stepNumber}`}
                        ref={(el) => {
                            if (el) stepRefs.current[group.stepNumber] = el;
                        }}
                        group={group}
                        onPress={onStepPress}
                        isCompleted={completedSteps[`step${group.stepNumber}`] ?? false}
                        isLocked={isLocked}
                        isDarkMode={isDarkMode}
                        previousDisplay={previousStep?.displayStepNumber ?? previousStep?.apiStepNumber ?? previousStep?.stepNumber}
                    />
                );
            })}
        </View>
    );
};

const LevelModal = ({ levelName, children, onClose, isDarkMode, scrollRef, isLandscape, contentWidth }) => (
    <View style={styles.modalLikeContainer}>
        <Pressable
            style={[
                styles.fullScreenPressable,
                isLandscape ? { justifyContent: 'flex-start', paddingTop: 0 } : null
            ]}
            onPress={onClose}
        >
            <Pressable
                style={[
                    styles.modalLikeContentBox,
                    isLandscape ? { width: '70%', marginTop: 8, maxHeight: '96%' } : { width: contentWidth, marginTop: 8, maxHeight: '96%' }
                ]}
                onPress={() => { }}
            >
                <View style={[styles.modalContents, { backgroundColor: isDarkMode ? '#2a3144' : Colors.white }]}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalHeaderText}>{levelName}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView ref={scrollRef} style={styles.modalScrollView} contentContainerStyle={styles.modalScrollViewContent} nestedScrollEnabled={true}>
                        <View style={styles.videolist}>
                            {children}
                        </View>
                    </ScrollView>
                </View>
            </Pressable>
        </Pressable>
    </View>
);

const CategoryButton = ({ image, title, onPress, isOpen, isComplete, imagenestedStyle, modalMode, modalWidth }) => (
    <TouchableOpacity activeOpacity={1} onPress={onPress}>
        <View style={[
            styles.buttonNested,
            { marginBottom: isOpen ? 0 : 10 },
            modalMode ? { width: modalWidth || '100%', alignSelf: 'center', overflow: 'hidden' } : (modalMode && modalWidth ? { width: modalWidth, alignSelf: 'center' } : null)
        ]}>
            {(() => {
                if (modalMode) {
                    const baseImgHeight = (imagenestedStyle && imagenestedStyle.height) || styles.imagenested.height || 180;
                    const extraHeightFactor = 1.2;
                    const imgHeight = Math.round(baseImgHeight * extraHeightFactor);
                    const scale = 1.0;
                    const wrapperWidth = modalWidth || (imagenestedStyle && imagenestedStyle.width) || '100%';
                    if (typeof wrapperWidth === 'number') {
                        const imgWidth = Math.round(wrapperWidth * scale);
                        const imgHeightScaled = Math.round(imgHeight * scale);
                        const marginLeft = -Math.round((imgWidth - wrapperWidth) / 3.5);
                        return (
                            <View style={{ width: wrapperWidth, height: imgHeight, overflow: 'hidden' }}>
                                <Image source={image} style={{ width: imgWidth, height: imgHeightScaled, marginLeft }} resizeMode="cover" />
                            </View>
                        );
                    }
                    return <Image source={image} style={[{ width: '100%', height: imgHeight }]} resizeMode="cover" />;
                }
                return <Image source={image} style={[imagenestedStyle || styles.imagenested]} resizeMode="cover" />;
            })()}
            <View style={[styles.textOverlay, isComplete ? styles.completedCategoryOverlay : null]}>
                <Text style={styles.text}>{title}</Text>
            </View>
        </View>
    </TouchableOpacity>
);


const Dashboard = ({ navigation }) => {
    const isFocused = useIsFocused();
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    useEffect(() => {
        if (isFocused) {
            StatusBar.setBarStyle('light-content');
        }
    }, [isFocused]);
    const stepRefs = useRef({});
    const categoryRefs = useRef({});
    const [token, setToken] = useState(null);
    const [userId, setUserID] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [isVideoLoading, setIsVideoLoading] = useState(false);
    const [completedSteps, setCompletedSteps] = useState({});
    const [openCategory, setOpenCategory] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [activeLevel, setActiveLevel] = useState(null);
    const [selectedStepGroup, setSelectedStepGroup] = useState(null);
    const [topicCompletionTimes, setTopicCompletionTimes] = useState({});
    const [unlockedStepsThreshold, setUnlockedStepsThreshold] = useState(0);
    const [lastViewedRequest, setLastViewedRequest] = useState(null);
    const dataLoadedRef = useRef(false);

    const [levelToUnlock, setLevelToUnlock] = useState(null);
    const [middleLevelCompletionTime, setMiddleLevelCompletionTime] = useState(null);
    const [advancedLevelCompletionTime, setAdvancedLevelCompletionTime] = useState(null);
    const [videoData, setVideoData] = useState({});
    const scale1 = useRef(new Animated.Value(0)).current;
    const scale2 = useRef(new Animated.Value(0)).current;
    const scale3 = useRef(new Animated.Value(0)).current;
    const handOpacity = useRef(new Animated.Value(0)).current;
    const handPositionX = useRef(new Animated.Value(windowWidth * 0.6)).current;
    const handPositionY = useRef(new Animated.Value(windowHeight * 0.4)).current;
    const handScale = useRef(new Animated.Value(1)).current;
    const opacity = useRef(new Animated.Value(1)).current;
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = { backgroundColor: isDarkMode ? '#2a3144' : Colors.white };
    const textColorModal = { color: isDarkMode ? Colors.white : 'rgba(20, 52, 164, 1)' }
    const textColorModalPara = { color: isDarkMode ? Colors.white : '#2a3144' }
    const lastBackPressed = useRef(0);
    const levelModalScrollRef = useRef(null);

    useEffect(() => {
        const onBackPress = () => {
            if (!isFocused) return false;
            if (isModalVisible) {
                setIsModalVisible(false);
                return true;
            }

            if (openCategory) {
                setOpenCategory(null);
                return true;
            }

            if (activeLevel) {
                setActiveLevel(null);
                return true;
            }

            const now = Date.now();
            if (lastBackPressed.current && now - lastBackPressed.current < 2000) {
                try {
                    const exitModule = require('./utils/exitApp');
                    const exitFn = exitModule && (exitModule.default || exitModule.exitApp || exitModule);
                    if (typeof exitFn === 'function') exitFn();
                    else BackHandler.exitApp();
                } catch (e) {
                    BackHandler.exitApp();
                }
                return true;
            }

            lastBackPressed.current = now;
            if (Platform.OS === 'android') {
                ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
            } else {
                Alert.alert('', 'Press back again to exit');
            }
            return true;
        };

        const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => sub.remove();
    }, [isFocused, isModalVisible, openCategory, activeLevel]);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const tokenVal = await AsyncStorage.getItem('token');
                if (!tokenVal) {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        })
                    );
                }
            } catch (err) {
                console.error('Auth verify error on Dashboard:', err);
            }
        };
        if (isFocused) verifyAuth();
        return undefined;
    }, [isFocused, navigation]);

    const groupVideosByApiStep = (videoApiResponse) => {
        if (!videoApiResponse?.rows?.length) return [];
        const groups = {};
        videoApiResponse.rows.forEach(item => {
            if (!item.title) return;
            let apiStepNumber = null;
            let displayStepNumber = null;

            const stepMatch = item.title.match(/(?:step|stage)\s+(\d+)/i);
            const closureMatch = item.title.match(/closure/i);

            if (item.title.match(/foundation/i)) {
                apiStepNumber = 4; displayStepNumber = 'Foundation';
            } else if (item.title.match(/middle/i)) {
                apiStepNumber = 5; displayStepNumber = 'Middle';
            } else if (item.title.match(/advance/i)) {
                apiStepNumber = 6; displayStepNumber = 'Advance';
            } else if (closureMatch) {
                apiStepNumber = 99; displayStepNumber = 'Closure';
            } else if (stepMatch) {
                apiStepNumber = parseInt(stepMatch[1], 10);
                displayStepNumber = apiStepNumber;
            }

            if (apiStepNumber === null) return;

            if (!groups[apiStepNumber]) {
                groups[apiStepNumber] = {
                    displayStepNumber: displayStepNumber,
                    apiStepNumber: apiStepNumber,
                    hindiVideo: null,
                    englishVideo: null
                };
            }
            if (item.title.toLowerCase().includes('hindi')) {
                groups[apiStepNumber].hindiVideo = item;
            } else if (item.title.toLowerCase().includes('english')) {
                groups[apiStepNumber].englishVideo = item;
            }
        });
        return Object.values(groups).sort((a, b) => {
            return a.apiStepNumber - b.apiStepNumber;
        });
    };

    const groupedTrustData = useMemo(() => groupVideosByApiStep(videoData['trust']), [videoData['trust']]);
    const groupedLoveAndCareData = useMemo(() => groupVideosByApiStep(videoData['loveAndCare']), [videoData['loveAndCare']]);
    const groupedRespectData = useMemo(() => groupVideosByApiStep(videoData['respect']), [videoData['respect']]);
    const groupedFamiliarData = useMemo(() => groupVideosByApiStep(videoData['familiar']), [videoData['familiar']]);
    const groupedSpeechDevData = useMemo(() => groupVideosByApiStep(videoData['speechDevelopment']), [videoData['speechDevelopment']]);
    const groupedTruthData = useMemo(() => groupVideosByApiStep(videoData['truth']), [videoData['truth']]);
    const groupedSetBoundariesData = useMemo(() => groupVideosByApiStep(videoData['setBoundaries']), [videoData['setBoundaries']]);
    const groupedListenFollowData = useMemo(() => groupVideosByApiStep(videoData['listenFollow']), [videoData['listenFollow']]);
    const groupedCooperationData = useMemo(() => groupVideosByApiStep(videoData['cooperation']), [videoData['cooperation']]);
    const groupedImaginationData = useMemo(() => groupVideosByApiStep(videoData['imagination']), [videoData['imagination']]);
    const groupedHelpData = useMemo(() => groupVideosByApiStep(videoData['help']), [videoData['help']]);
    const groupedDiscussionData = useMemo(() => groupVideosByApiStep(videoData['discussion']), [videoData['discussion']]);
    const groupedNarrateData = useMemo(() => groupVideosByApiStep(videoData['narrate']), [videoData['narrate']]);
    const groupedEmotionsData = useMemo(() => groupVideosByApiStep(videoData['emotions']), [videoData['emotions']]);
    const groupedFeelingsData = useMemo(() => groupVideosByApiStep(videoData['feelings']), [videoData['feelings']]);
    const groupedKnowledgeData = useMemo(() => groupVideosByApiStep(videoData['knowledge']), [videoData['knowledge']]);
    const masterConfig = useMemo(() => {
        const config = {
            'trust': { name: 'TRUST', folderId: 'fa26d3b1719c47f89b3efc758ad107bd', groupedData: groupedTrustData, image: require('../img/trustimg.png'), prerequisiteCategory: null },
            'loveAndCare': { name: 'LOVE AND CARE', folderId: '9162ff33874a4418b21c46de3293d945', groupedData: groupedLoveAndCareData, image: require('../img/loveandcare.png'), prerequisiteCategory: 'trust' },
            'respect': { name: 'RESPECT', folderId: 'db26175c76ac4b27820ef71c7d8890e0', groupedData: groupedRespectData, image: require('../img/respact.png'), prerequisiteCategory: 'loveAndCare' },
            'familiar': { name: 'FAMILIAR', folderIds: ["a49ebdb1dea84474afc11d76c4c01591", "21a8a1aa9dbc4146b6565491628c07df"], groupedData: groupedFamiliarData, image: require('../img/familiarimg.png'), prerequisiteCategory: 'respect' },
            'speechDevelopment': { name: 'SPEECH DEVELOPMENT', folderId: '9d876b85b5544edca3c445cd771c947b', groupedData: groupedSpeechDevData, image: require('../img/2148552491.jpg'), prerequisiteCategory: 'familiar' },
            'truth': { name: 'TRUTH', folderId: 'b6a31ff3d0664ecb8f63d8019c55d6d2', groupedData: groupedTruthData, image: require('../img/truth.png'), prerequisiteCategory: 'speechDevelopment' },
            'setBoundaries': { name: 'SET BOUNDARIES', folderId: '7f46370118364fa0b155cf64eb2646d3', groupedData: groupedSetBoundariesData, image: require('../img/setboundries.png'), prerequisiteCategory: 'truth' },
            'listenFollow': { name: 'LISTEN & FOLLOW', folderId: '543998fdbee446cf922dd75864b00be1', groupedData: groupedListenFollowData, image: require('../img/listenandfollowinstructions.png'), prerequisiteCategory: 'setBoundaries' },
            'cooperation': { name: 'COOPERATION', folderId: '6df3edb0860349a98ec00c2ea51bbb93', groupedData: groupedCooperationData, image: require('../img/co-operation.png'), prerequisiteCategory: 'listenFollow' },
            'imagination': { name: 'IMAGINATION & PRETEND PLAY', folderId: '71bfcfe443d245e7983236752c3e9fbb', groupedData: groupedImaginationData, image: require('../img/imagineandpretendplay.png'), prerequisiteCategory: 'cooperation' },
            'help': { name: 'ASK HELP & GIVE HELP', folderId: 'e9db6fc2a5324f3ea1599b406e3d6556', groupedData: groupedHelpData, image: require('../img/Givehelpandaskhelp.png'), prerequisiteCategory: 'imagination' },
            'discussion': { name: 'DISCUSSION - Q&A', folderId: '190a4f4a8ea940b4b034d0047992913c', groupedData: groupedDiscussionData, image: require('../img/DiscussionQandA.png'), prerequisiteCategory: 'help' },
            'narrate': { name: 'ABLE TO NARRATE', folderId: 'c9830bc5eed04b18b0cd5919627ad818', groupedData: groupedNarrateData, image: require('../img/abletonarrate.png'), prerequisiteCategory: 'discussion' },
            'emotions': { name: 'EXPRESS EMOTIONS & BALANCE IT', folderId: 'a27799e2c148438ba450a80d546a9555', groupedData: groupedEmotionsData, image: require('../img/expressemotionandcontrol.png'), prerequisiteCategory: 'narrate' },
            'feelings': { name: 'FEELINGS OF OTHERS', folderId: '1471bf13c7f6490fb6f98ae846552a87', groupedData: groupedFeelingsData, image: require('../img/feelingofothers.png'), prerequisiteCategory: 'emotions' },
            'knowledge': { name: 'KNOWLEDGE & CURIOSITY', folderIds: ["053dc785919e42aa941e6ee070b55325", "945fe57ec6304dbda1f16a10c4d0e2f9"], groupedData: groupedKnowledgeData, image: require('../img/2148812268.jpg'), prerequisiteCategory: 'feelings' },
        };

        let cumulativeStepCount = 0;
        const categoryOrder = [
            'trust', 'loveAndCare', 'respect', 'familiar', 'speechDevelopment', 'truth',
            'setBoundaries', 'listenFollow', 'cooperation', 'imagination', 'help',
            'discussion', 'narrate', 'emotions', 'feelings', 'knowledge'
        ];

        categoryOrder.forEach(key => {
            const category = config[key];
            const baseStep = cumulativeStepCount;
            category.finalGroupedData = category.groupedData.map((video, index) => ({ ...video, stepNumber: baseStep + index + 1 }));
            cumulativeStepCount += category.groupedData.length;
        });
        return config;
    }, [
        videoData
    ]);

    useEffect(() => {
        if (levelToUnlock) {
            handleLevelPress(levelToUnlock, true);
            setLevelToUnlock(null);
        }
    }, [videoData, masterConfig]);

    useEffect(() => {
        if (!lastViewedRequest) {
            return;
        }

        if (activeLevel && activeLevel !== lastViewedRequest.level) {
            handleCloseModal();
            return;
        }

        if (!activeLevel) {
            handleLevelPress(lastViewedRequest.level);
            return;
        }

        if (activeLevel === lastViewedRequest.level) {
            handleCategoryPress(lastViewedRequest.category);
        }
    }, [lastViewedRequest, activeLevel]);


    useEffect(() => {
        if (!lastViewedRequest || !openCategory) return;

        const stepNumber = lastViewedRequest.step;

        const timer = setTimeout(() => {
            const stepRef = stepRefs.current[stepNumber];
            const scrollRef = levelModalScrollRef.current;

            if (stepRef && scrollRef) {
                const scrollNode = findNodeHandle(scrollRef) || (scrollRef.getInnerViewNode && scrollRef.getInnerViewNode());

                try {
                    stepRef.measureLayout(
                        scrollNode,
                        (x, y) => {
                            if (scrollRef && typeof scrollRef.scrollTo === 'function') {
                                scrollRef.scrollTo({
                                    y: Math.max(y - 20, 0),
                                    animated: true,
                                });
                            }
                            setLastViewedRequest(null);
                        },
                        (err) => {
                            console.log('measureLayout error', err);
                            if (scrollRef && typeof scrollRef.scrollTo === 'function') {
                                scrollRef.scrollTo({ y: 0, animated: true });
                            }
                            setLastViewedRequest(null);
                        }
                    );
                } catch (e) {
                    console.warn('measureLayout threw', e);
                    if (scrollRef && typeof scrollRef.scrollTo === 'function') {
                        scrollRef.scrollTo({ y: 0, animated: true });
                    }
                    setLastViewedRequest(null);
                }
            }
        }, 600);

        return () => clearTimeout(timer);
    }, [openCategory, lastViewedRequest]);



    const foundationKeys = ['trust', 'loveAndCare', 'respect', 'familiar'];
    const middleKeys = ['speechDevelopment', 'truth', 'setBoundaries', 'listenFollow'];
    const advancedKeys = ['cooperation', 'imagination', 'help', 'discussion', 'narrate', 'emotions', 'feelings', 'knowledge'];

    const getLevelForCategory = (categoryKey) => {
        if (foundationKeys.includes(categoryKey)) return 'foundation';
        if (middleKeys.includes(categoryKey)) return 'middle';
        if (advancedKeys.includes(categoryKey)) return 'advanced';
        return null;
    };

    const handleLastViewedPress = async () => {
        try {
            const lastViewedJson = await AsyncStorage.getItem('lastViewed');
            if (!lastViewedJson) {
                showToast("No last viewed topic found to continue from.");
                return;
            }

            const lastViewed = JSON.parse(lastViewedJson);
            let { category, step } = lastViewed || {};
            console.log("Last viewed data:", lastViewed);
            console.log("category:", category, "step:", step, "unlockedStepsThreshold:", unlockedStepsThreshold);
            const stepNum = typeof step === 'number' ? step : (step ? Number(step) : NaN);

            if (!Number.isNaN(stepNum) && (stepNum === 1001 || stepNum === 1002)) {
                if (unlockedStepsThreshold && Number.isFinite(unlockedStepsThreshold) && unlockedStepsThreshold > 0) {
                    const resolvedFromThreshold = getCategoryFromStep(unlockedStepsThreshold);
                    if (resolvedFromThreshold && masterConfig[resolvedFromThreshold]) {
                        const level = getLevelForCategory(resolvedFromThreshold);
                        if (level) {
                            setLastViewedRequest({ level, category: resolvedFromThreshold, step: unlockedStepsThreshold });
                            return;
                        }
                    }
                }
                handleIntroductionPress(stepNum === 1001 ? 1 : 2);
                return;
            }

            let resolvedCategory = category;
            if ((!resolvedCategory || !masterConfig[resolvedCategory]) && !Number.isNaN(stepNum)) {
                resolvedCategory = getCategoryFromStep(stepNum);
            }

            if (resolvedCategory && masterConfig[resolvedCategory]) {
                const level = getLevelForCategory(resolvedCategory);
                if (level) {
                    setLastViewedRequest({ level, category: resolvedCategory, step: stepNum });
                } else {
                    showToast("Could not find the level for your last viewed topic.");
                }
            } else {
                showToast("No last viewed topic found to continue from.");
            }
        } catch (error) {
            console.error("Failed to handle last viewed press:", error);
            //  Alert.alert("Error", "Could not retrieve your last viewed topic.");
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                await loadCompletedSteps();
                await loadMiddleLevelCompletionTime();
                await loadAdvancedLevelCompletionTime();
                await loadTopicCompletionTimes();

                const storedToken = await AsyncStorage.getItem('token');
                const storedUserId = await AsyncStorage.getItem('userId');
                if (storedToken && storedUserId) {
                    setToken(storedToken);
                    setUserID(storedUserId);
                    await fetchUserProgress(storedUserId, storedToken);
                    try {
                        await prefetchAllCategoryVideos(storedToken);
                    } catch (err) {
                        console.error('Prefetch after initial progress fetch failed:', err);
                    }
                } else {
                    setDataLoaded(true);
                }
            } catch (error) {
                console.error("Failed to load initial data:", error);
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Failed to load user data. Please try restarting the app.', ToastAndroid.LONG);
                } else {
                    Alert.alert('Failed to load user data. Please try restarting the app.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();

        const unsubscribe = navigation.addListener('focus', () => {
            if (!dataLoadedRef.current) {
                loadInitialData();
            }
        });

        return unsubscribe;
    }, [navigation]);

    useEffect(() => { dataLoadedRef.current = dataLoaded; }, [dataLoaded]);

    useEffect(() => {
        if (token && userId) {
            (async () => {
                try {
                    await fetchUserProgress(userId, token);
                    try {
                        await prefetchAllCategoryVideos(token);
                    } catch (err) {
                        console.error('Prefetch after token change failed:', err);
                    }
                } catch (e) {
                    console.error('fetchUserProgress on token change failed', e);
                }
            })();
        }
    }, [token, userId]);

    const getCategoryFromStep = (stepNumber) => {
        for (const categoryKey in masterConfig) {
            const category = masterConfig[categoryKey];
            if (category.finalGroupedData?.some(g => g.stepNumber === stepNumber)) {
                return categoryKey;
            }
        }
        return null;
    };

    const updateTopicCompletionTime = async (categoryKey, completionTime) => {
        try {
            const newCompletionTimes = { ...topicCompletionTimes, [categoryKey]: completionTime };
            setTopicCompletionTimes(newCompletionTimes);
            await AsyncStorage.setItem('topicCompletionTimes', JSON.stringify(newCompletionTimes));
        } catch (error) {
            console.error("Failed to save topic completion time:", error);
        }
    };

    const fetchUserProgress = async (userId, token) => {
        try {
            const deviceKey = await AsyncStorage.getItem('deviceKey');
            const endpoint = `${url}User/User_Deshboard_Data?id=${userId}&DeviceKey=${deviceKey}`;
            const response = await fetch(endpoint, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                console.error('Failed to fetch user progress:', response.statusText);
                return;
            }

            const result = await response.json();
            if (result.isSuccess && result.data) {
                const progressByStep = {};
                result.data.forEach(item => {
                    progressByStep[item.level_step] = item;
                });

                const savedLocalStepsJson = await AsyncStorage.getItem('completedSteps');
                const localCompletedSteps = savedLocalStepsJson ? JSON.parse(savedLocalStepsJson) : {};

                const savedLocalTopicTimesJson = await AsyncStorage.getItem('topicCompletionTimes');
                const localTopicTimes = savedLocalTopicTimesJson ? JSON.parse(savedLocalTopicTimesJson) : {};

                const newCompletedSteps = {};
                const newTopicCompletionTimes = {};
                let highestCompletedStep = 0;
                let loadcategory = null;
                let loadcategorystep = null;
                let mappedCategory = null;
                let mappedLocalCategoryStep = null;
                result.data.forEach(item => {
                    if (item.total_views > 0) {
                        newCompletedSteps[`step${item.level_step}`] = true;

                        if (
                            item.level_step !== 1001 &&
                            item.level_step !== 1002 &&
                            item.level_step > highestCompletedStep
                        ) {
                            highestCompletedStep = item.level_step;



                            if (item.stage_name) {
                                console.log("Processing stage name:", item.stage_name);
                                const name = item.stage_name.toString().trim();

                                const match = name.match(/^\s*([^\d]+?)\s*(\d+)?\s*$/);

                                if (match) {
                                    loadcategory = match[1].toLowerCase().trim();
                                    loadcategorystep = match[2] ? parseInt(match[2], 10) : null;

                                    const normalizeToKey = (str) => {
                                        if (!str) return null;
                                        let s = str.toLowerCase();
                                        s = s.replace(/&/g, ' and ');
                                        s = s.replace(/[^a-z0-9\s]/g, ' ');
                                        s = s.replace(/\s+/g, ' ').trim();
                                        const parts = s.split(' ');
                                        if (parts.length === 0) return null;
                                        const key = parts[0] + parts.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
                                        return key;
                                    };

                                    const normalizedKey = normalizeToKey(loadcategory);
                                    if (normalizedKey && masterConfig[normalizedKey]) {
                                        mappedCategory = normalizedKey;
                                    } else {
                                        const firstWord = loadcategory.split(' ')[0];
                                        if (firstWord && masterConfig[firstWord]) mappedCategory = firstWord;
                                        else mappedCategory = normalizedKey || loadcategory;
                                    }
                                    mappedLocalCategoryStep = loadcategorystep;
                                }
                            }
                        }
                    }

                });
                console.log("Mapped Category:", mappedCategory, "Mapped Local Step:", mappedLocalCategoryStep, "Highest Completed Step:", highestCompletedStep);

                if (mappedCategory) {
                    try {
                        const lastViewedObj = {
                            step: highestCompletedStep,
                            category: mappedCategory,
                            timestamp: new Date().toISOString()
                        };
                        await AsyncStorage.setItem('lastViewed', JSON.stringify(lastViewedObj));
                        console.log('Primed lastViewed from server progress:', lastViewedObj);
                    } catch (err) {
                        console.error('Failed to save last viewed info from server progress:', err);
                    }
                }

                if (mappedCategory && mappedLocalCategoryStep != null && masterConfig[mappedCategory]?.finalGroupedData) {
                    const groups = masterConfig[mappedCategory].finalGroupedData;
                    const matched = groups.find(g => Number(g.displayStepNumber) === Number(mappedLocalCategoryStep) || Number(g.apiStepNumber) === Number(mappedLocalCategoryStep));
                    if (matched) {
                        const globalStep = matched.stepNumber;
                        console.log('Resolved global step for', mappedCategory, mappedLocalCategoryStep, '->', globalStep);
                        if (globalStep > highestCompletedStep) {
                            highestCompletedStep = globalStep;
                        }
                    }
                }
                for (const categoryKey in masterConfig) {
                    const category = masterConfig[categoryKey];
                    if (category.finalGroupedData && !newTopicCompletionTimes[categoryKey]) {
                        const allSteps = category.finalGroupedData.map(g => `step${g.stepNumber}`);
                        const isCategoryComplete = allSteps.every(stepKey => newCompletedSteps[stepKey]);
                        if (isCategoryComplete) {
                            const stepNumbers = allSteps.map(s => parseInt(s.replace('step', '')));
                            const latestCompletion = Math.max(...stepNumbers.map(sn => new Date(progressByStep[sn]?.playedOn || 0).getTime()));
                            if (latestCompletion > 0) {
                                newTopicCompletionTimes[categoryKey] = new Date(latestCompletion).toISOString();
                            }
                        }
                    }
                }

                setUnlockedStepsThreshold(highestCompletedStep);

                const mergedCompletedSteps = { ...localCompletedSteps, ...newCompletedSteps };
                setCompletedSteps(mergedCompletedSteps);

                const mergedTopicTimes = { ...localTopicTimes, ...newTopicCompletionTimes };
                setTopicCompletionTimes(mergedTopicTimes);

                await AsyncStorage.setItem('completedSteps', JSON.stringify(mergedCompletedSteps));
                await AsyncStorage.setItem('topicCompletionTimes', JSON.stringify(mergedTopicTimes));
                setDataLoaded(true);
            }
        } catch (error) {
            console.error("Failed to fetch user progress:", error);
        }
    };

    const loadCompletedSteps = async () => {
        try {
            const savedSteps = await AsyncStorage.getItem('completedSteps');
            if (savedSteps !== null) {
                setCompletedSteps(JSON.parse(savedSteps));
            }
        } catch (error) {
            console.error("Failed to load completed steps from storage", error);
        }
    };

    const loadTopicCompletionTimes = async () => {
        try {
            const savedTimes = await AsyncStorage.getItem('topicCompletionTimes');
            if (savedTimes !== null) {
                setTopicCompletionTimes(JSON.parse(savedTimes));
            }
        } catch (error) {
            console.error("Failed to load topic completion times from storage", error);
        }
    };

    const loadMiddleLevelCompletionTime = async () => {
        try {
            const savedTime = await AsyncStorage.getItem('middleLevelCompletionTime');
            if (savedTime !== null) {
                setMiddleLevelCompletionTime(new Date(savedTime));
            }
        } catch (error) {
            console.error("Failed to load middle level completion time from storage", error);
        }
    };

    const loadAdvancedLevelCompletionTime = async () => {
        try {
            const savedTime = await AsyncStorage.getItem('advancedLevelCompletionTime');
            if (savedTime !== null) {
                setAdvancedLevelCompletionTime(new Date(savedTime));
            }
        } catch (error) {
            console.error("Failed to load advanced level completion time from storage", error);
        }
    };

    const saveCompletedStep = async (stepKey) => {
        try {
            const newCompletedSteps = { ...completedSteps, [stepKey]: true };
            setCompletedSteps(newCompletedSteps);
            await AsyncStorage.setItem('completedSteps', JSON.stringify(newCompletedSteps));
        } catch (error) {
            console.error("Failed to save completed step to storage", error);
        }
    };

    const startHandAnimation = () => {
        const targetX = windowWidth * 0.4;
        const targetY = windowHeight * 0.3;
        return Animated.loop(
            Animated.sequence([
                Animated.delay(1500),
                Animated.parallel([Animated.timing(handOpacity, { toValue: 1, duration: 300, useNativeDriver: true }), Animated.timing(handPositionX, { toValue: targetX, duration: 1000, useNativeDriver: true }), Animated.timing(handPositionY, { toValue: targetY, duration: 1000, useNativeDriver: true }),]),
                Animated.sequence([Animated.timing(handScale, { toValue: 0.85, duration: 150, useNativeDriver: true }), Animated.timing(handScale, { toValue: 1, duration: 150, useNativeDriver: true }),]),
                Animated.delay(300),
                Animated.parallel([Animated.timing(handOpacity, { toValue: 0, duration: 300, delay: 700, useNativeDriver: true }), Animated.timing(handPositionX, { toValue: windowWidth * 0.6, duration: 1000, useNativeDriver: true }), Animated.timing(handPositionY, { toValue: windowHeight * 0.4, duration: 1000, useNativeDriver: true }),]),
                Animated.delay(1000),
            ])
        );
    };

    useEffect(() => {
        const handAnimation = startHandAnimation();
        handAnimation.start();

        const blinkingAnimation = Animated.loop(
            Animated.sequence([Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }), Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),]), { iterations: 8 }
        );
        blinkingAnimation.start();

        Animated.timing(scale1, { toValue: 1, duration: 600, useNativeDriver: true }).start();
        Animated.timing(scale2, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }).start();
        Animated.timing(scale3, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }).start();

        return () => {
            try { handAnimation.stop(); } catch (e) { }
            try { blinkingAnimation.stop(); } catch (e) { }
        };
    }, []);

    const fetchVideos = async (folderIds, tokenParam) => {
        if (!Array.isArray(folderIds)) folderIds = [folderIds];
        const authToken = tokenParam || token;
        let allVideos = { rows: [] };
        for (const folderId of folderIds) {
            try {
                const endpoint = `${url}Vdocipher/GetAllVDOCipherVideosByFolderID?folderId=${folderId}`;
                const response = await fetch(endpoint, { headers: { 'Authorization': `Bearer ${authToken}`, 'Accept': 'application/json' } });
                if (!response.ok) throw new Error(`Failed to fetch videos for folder ${folderId}`);
                const data = await response.json();
                if (data && data.rows) { allVideos.rows.push(...data.rows); }
            } catch (error) {
                console.error(`Error fetching videos from folder ${folderId}:`, error);
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Could not load some videos. Please check your connection and try again.', ToastAndroid.LONG);
                } else {
                    Alert.alert('Could not load some videos. Please check your connection and try again.');
                }
            }
        }
        return allVideos;

    };


    const prefetchAllCategoryVideos = async (authToken) => {
        try {
            const keys = Object.keys(masterConfig || {});
            const fetched = {};
            for (const key of keys) {
                try {
                    if (!videoData[key]?.rows?.length) {
                        const folderIds = masterConfig[key].folderIds || [masterConfig[key].folderId];
                        const details = await fetchVideos(folderIds, authToken);
                        if (details && details.rows && details.rows.length) {
                            setVideoData(prev => ({ ...prev, [key]: details }));
                            fetched[key] = details;
                        }
                    }
                } catch (innerErr) {
                    console.error(`Prefetch failed for ${key}:`, innerErr);
                }
            }
            return fetched;
        } catch (err) {
            console.error('Failed to prefetch category videos:', err);
        }
    };

    const ensureCategoryDataIsLoaded = async (categoryKey) => {
        const config = masterConfig[categoryKey];
        if (config && !videoData[categoryKey]?.rows?.length) {
            setIsVideoLoading(true);
            const videoDetails = await fetchVideos(config.folderIds || [config.folderId]);
            setIsVideoLoading(false);
            if (videoDetails) {
                setVideoData(prevData => ({
                    ...prevData,
                    [categoryKey]: videoDetails
                }));
                return true;
            }
            return false;
        }
        return true;
    };

    const showToast = (message) => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.LONG);
        } else {
            Alert.alert('', message);
        }
    };

    const arePrerequisitesMet = async (categoryKey) => {
        const deviceKey = await AsyncStorage.getItem('deviceKey');
        const config = masterConfig[categoryKey];
        if (!config) return false;
        if (config.prerequisiteCategory) {
            const prereqConfig = masterConfig[config.prerequisiteCategory];
            if (prereqConfig) {
                const isPrereqDataLoaded = await ensureCategoryDataIsLoaded(config.prerequisiteCategory);
                if (!isPrereqDataLoaded) {
                    if (Platform.OS === 'android') {
                        ToastAndroid.show('Could not load prerequisite data. Please try again.', ToastAndroid.LONG);
                    } else {
                        Alert.alert('Could not load prerequisite data. Please try again.');
                    }
                    return false;
                }
                const allPrereqSteps = prereqConfig.finalGroupedData.map(g => `step${g.stepNumber}`);
                const areAllPrereqsCompleted = allPrereqSteps.every(stepKey => completedSteps[stepKey]);
                if (!areAllPrereqsCompleted) {
                    Alert.alert("Level Locked", `You must complete the "${prereqConfig.name}" stage before accessing this one.`);
                    return false;
                }
                const lastStepOfPrereq = prereqConfig.finalGroupedData[prereqConfig.finalGroupedData.length - 1];
                const lastStepNumber = lastStepOfPrereq.stepNumber;
                const DETAILS_ENDPOINT = `${url}User/User_Watch_Data_StepId?id=${userId}&level_step=${lastStepNumber}&DeviceKey=${deviceKey}`;
                try {
                    const response = await fetch(DETAILS_ENDPOINT, { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.isSuccess && data.data && data.data.length > 0) {
                            const completionDate = new Date(data.data[0].createOn);
                            let lockDurationHours = 0;
                            if (foundationKeys.includes(config.prerequisiteCategory)) lockDurationHours = 24;
                            else if (middleKeys.includes(config.prerequisiteCategory) || advancedKeys.includes(config.prerequisiteCategory)) lockDurationHours = 48;

                            if (lockDurationHours > 0) {
                                const hoursSinceCompletion = (new Date() - completionDate) / (1000 * 60 * 60);
                                if (hoursSinceCompletion < lockDurationHours) {

                                    Alert.alert("Topic Locked", `Great progress! Your next topic will unlock in ${lockDurationHours} hours. Use this time to practice what you’ve learned so far.`);
                                    return false;
                                } else {
                                    try {
                                        const notifKey = 'topicUnlockNotified';
                                        const notifiedJson = await AsyncStorage.getItem(notifKey);
                                        const notified = notifiedJson ? JSON.parse(notifiedJson) : {};
                                        if (!notified[categoryKey]) {
                                            showToast('Your next Topic is now unlocked. Start watching!');
                                            notified[categoryKey] = true;
                                            await AsyncStorage.setItem(notifKey, JSON.stringify(notified));
                                        }
                                    } catch (err) {
                                        console.error('Failed to persist unlock notification flag:', err);
                                        showToast('Your next Topic is now unlocked. Start watching!');
                                    }
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error checking time lock:", error);
                    if (Platform.OS === 'android') {
                        ToastAndroid.show('Could not verify topic lock status. Please try again.', ToastAndroid.LONG);
                    } else {
                        Alert.alert('Network Error', 'Could not verify topic lock status. Please try again.');
                    }
                    return false;
                }
            }
        }
        return true;
    };

    const handleCategoryPress = async (categoryKey) => {
        if (!dataLoaded) {
            showToast("Loading progress data...");
            return;
        }

        const canProceed = await arePrerequisitesMet(categoryKey);
        if (!canProceed) {
            setOpenCategory(null);
            return;
        }

        if (openCategory === categoryKey) {
            setOpenCategory(null);
            return;
        }

        const config = masterConfig[categoryKey];
        const isDataLoaded = await ensureCategoryDataIsLoaded(categoryKey);

        if (isDataLoaded) {
            setOpenCategory(categoryKey);
        } else {
            setIsVideoLoading(true);
            await ensureCategoryDataIsLoaded(categoryKey);
            setIsVideoLoading(false);
            setOpenCategory(categoryKey);
        }

        // AUTO SCROLL: wait for UI to render expanded content then measure and scroll
        setTimeout(() => {
            try {
                const categoryRef = categoryRefs.current[categoryKey];
                const scrollRef = levelModalScrollRef.current;

                if (categoryRef && scrollRef) {
                    const scrollNode = findNodeHandle(scrollRef);
                    if (typeof categoryRef.measureLayout === 'function') {
                        categoryRef.measureLayout(
                            scrollNode,
                            (x, y) => {
                                try {
                                    scrollRef.scrollTo({ y: Math.max(y - 10, 0), animated: true });
                                } catch (e) {
                                    console.warn('Failed to scroll to category:', e);
                                }
                            },
                            (err) => console.log('Scroll measurement failed', err)
                        );
                    } else if (categoryRef.measure) {
                        categoryRef.measure((x, y, width, height, pageX, pageY) => {
                            try {
                                scrollRef.scrollTo({ y: Math.max(pageY - 10, 0), animated: true });
                            } catch (e) {
                                console.warn('Failed to scroll to category (measure):', e);
                            }
                        });
                    }
                }
            } catch (e) {
                console.warn('Auto-scroll error:', e);
            }
        }, 300);
    };

    const handleDropdownItemClick = (stepNumber) => {
        const config = masterConfig[openCategory];
        if (!config) return;
        const group = config.finalGroupedData.find(g => g.stepNumber === stepNumber);
        if (group) {
            setSelectedStepGroup({ ...group, category: openCategory });
            setIsModalVisible(true);
        } else {
            // Alert.alert('Error', `Video group for step ${stepNumber} not found.`);
        }
    };

    const handleVideo = async (videoId, step, language) => {
        const deviceKey = await AsyncStorage.getItem('deviceKey');

        if (!selectedStepGroup) {
            //  Alert.alert('Error', 'No video selected. Please select a video first.');
            return;
        }

        if (step !== 1001 && step !== 1002) {
            const stepGroup = selectedStepGroup;
            const hindiVideoId = stepGroup?.hindiVideo?.id;
            const englishVideoId = stepGroup?.englishVideo?.id;
            let totalWatchCount = 0;

            try {
                const videoIdsForStep = [hindiVideoId, englishVideoId].filter(Boolean);
                for (const id of videoIdsForStep) {
                    const endpoint = `${url}User/User_Watch_Data?id=${userId}&video_id=${id}&DeviceKey=${deviceKey}`;
                    const response = await fetch(endpoint, {
                        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
                    });
                    if (response.ok) {
                        const result = await response.json();
                        if (result.isSuccess && result.data) {
                            totalWatchCount += result.data.reduce((sum, record) => sum + (Number(record.is_finished) || 0), 0);
                        }
                    }
                }

                if (totalWatchCount >= 4) {
                    Alert.alert("Limit Reached", ' You’ve reached the maximum limit for now. If any new update comes, we’ll notify you instantly.');
                    return;
                }
                const specificVideoEndpoint = `${url}User/User_Watch_Data?id=${userId}&video_id=${videoId}&DeviceKey=${deviceKey}`;
                const specificVideoResponse = await fetch(specificVideoEndpoint, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
                });
                if (specificVideoResponse.ok) {
                    const specificResult = await specificVideoResponse.json();
                    if (specificResult.isSuccess && specificResult.data) {
                        const languageRecord = specificResult.data.find(d => d.language.toLowerCase() === language.toLowerCase());
                        if (languageRecord && Number(languageRecord.is_finished) >= 3) {
                            Alert.alert("Limit Reached", `You have already watched the ${language} video for this step 3 times.`);
                            return;
                        }
                    } else if (!specificResult.isSuccess) {
                        showToast('Please try again.');
                        return;
                    }
                } else {
                    Alert.alert("Error", "Could not connect to the server to verify video watch count. Please check your internet connection and try again.");
                    return;
                }
            } catch (error) {
                console.error("Error fetching user watch data:", error);
                Alert.alert("Error", "An unexpected error occurred while checking video permissions.");
                return;
            }
        }

        setIsModalVisible(false);
        setIsVideoLoading(true);
        let total_time = 0;
        try {
            const videoDetails = await vdoCipherApi(videoId);
            if (videoDetails && videoDetails.length) {
                total_time = videoDetails.length;
            } else {
                console.warn(`Could not fetch video duration for videoId: ${videoId}. Defaulting to 0.`);
            }

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


            const requestBody = {
                UserId: userId ? parseInt(userId, 10) : null,
                VideoId: videoId,
                annotate: JSON.stringify(annotationObject),
            };

            const response = await fetch(`${url}Vdocipher/GetVideosFromVDOCipher_VideoId`, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(requestBody),
            });
            const status = response.status;
            const text = await response.text();
            let parsed = null;
            try { parsed = JSON.parse(text); } catch (e) { }
            if (!response.ok) {
                const msg = (parsed && (parsed.message || parsed.error)) || text || `HTTP ${status}`;
                console.error('VdoCipher POST failed', { status, body: text, parsed });
                throw new Error(msg || 'Video not found or failed to get OTP.');
            }
            const data = parsed || JSON.parse(text);

            await saveCompletedStep(`step${step}`);
            try {
                const lastViewedObj = {
                    step: step,
                    category: openCategory || selectedStepGroup?.category || null,
                    timestamp: new Date().toISOString()
                };
                await AsyncStorage.setItem('lastViewed', JSON.stringify(lastViewedObj));
            } catch (err) {
                console.error('Failed to save last viewed info:', err);
            }
            if (openCategory) {
                const category = masterConfig[openCategory];
                const allSteps = category.finalGroupedData.map(g => `step${g.stepNumber}`);
                const newCompletedSteps = { ...completedSteps, [`step${step}`]: true };
                const isCategoryComplete = allSteps.every(stepKey => newCompletedSteps[stepKey]);

                if (isCategoryComplete && !topicCompletionTimes[openCategory]) {
                    await updateTopicCompletionTime(openCategory, new Date().toISOString());
                }

                if (openCategory === 'listenFollow' && isCategoryComplete) {
                    if (!middleLevelCompletionTime) {
                        const completionTime = new Date();
                        setMiddleLevelCompletionTime(completionTime);
                        try {
                            await AsyncStorage.setItem('middleLevelCompletionTime', completionTime.toISOString());
                        } catch (error) {
                            console.error('Failed to save middle level completion time:', error);
                        }
                    }
                }

                if (openCategory === 'knowledge' && isCategoryComplete) {
                    if (!advancedLevelCompletionTime) {
                        const completionTime = new Date();
                        setAdvancedLevelCompletionTime(completionTime);
                        try {
                            await AsyncStorage.setItem('advancedLevelCompletionTime', completionTime.toISOString());
                        } catch (error) {
                            console.error('Failed to save advanced level completion time:', error);
                        }
                    }
                }
            }
            navigation.navigate('VideoPlayerScreen', {
                id: videoId,
                otp: data.otp,
                playbackInfo: data.playbackInfo,
                language: language,
                cameFrom: 'Dashboard',
                step: step,
                displayStep: selectedStepGroup?.displayStepNumber || selectedStepGroup?.apiStepNumber || selectedStepGroup?.stepNumber,
                total_time: total_time,
                stage_name: masterConfig[openCategory]?.name ?? 'Unknown'
            });
        } catch (err) {
            Alert.alert("Error", err.message);
        } finally {
            setIsVideoLoading(false);
        }
    };


    const vdoCipherApi = async (videoId) => {
        setIsVideoLoading(true);
        if (!videoId) {
            Alert.alert("Error", "Missing video ID to get details.");
            setIsVideoLoading(false);
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
                throw new Error("Failed to get video details.");
            }
            return await response.json();
        } catch (error) {
            //Alert.alert("API Error", `An unexpected error occurred: ${error.message}`);
            return null;
        } finally {
            setIsVideoLoading(false);
        }
    };

    const handleIntroductionPress = async (introType) => {
        if (introType === 2 && !completedSteps['step1001']) {
            Alert.alert("Locked", "Please complete Introduction I before starting Introduction II.");
            return;
        }

        const folderId = "8a15a7910bcb41a897b50111ec4f95d9";
        setIsVideoLoading(true);
        const videoDetails = await fetchVideos([folderId]);
        if (introType === 2) { }
        setIsVideoLoading(false);
        if (videoDetails?.rows?.length >= 4) {
            setVideoData(prevData => ({
                ...prevData,
                ['introduction']: videoDetails
            }));
            const group = introType === 1 ? { stepNumber: 1001, hindiVideo: videoDetails.rows[2], englishVideo: videoDetails.rows[3] } : { stepNumber: 1002, hindiVideo: videoDetails.rows[0], englishVideo: videoDetails.rows[1] };
            setSelectedStepGroup(group);
            setIsModalVisible(true);
        } else {
            Alert.alert("Video Data Error", `Not enough videos found for Introduction ${introType}.`);
        }
    };

    const handleLevelPress = async (level) => {
        const deviceKey = await AsyncStorage.getItem('deviceKey');
        if (!dataLoaded) {
            Alert.alert("Loading...", "Please wait until your progress is fully loaded.");
            return;
        }

        const loadLevelVideos = async (keys) => {
            const dataFetchPromises = keys
                .filter(key => !videoData[key]?.rows?.length)
                .map(key => fetchVideos(masterConfig[key].folderIds || [masterConfig[key].folderId]).then(details => ({ key, details })));

            if (dataFetchPromises.length > 0) {
                setIsVideoLoading(true);
                try {
                    const results = await Promise.all(dataFetchPromises);
                    setVideoData(prevData => {
                        const newData = { ...prevData };
                        results.forEach(({ key, details }) => {
                            if (details) newData[key] = details;
                        });
                        return newData;
                    });
                } finally {
                    setIsVideoLoading(false);
                }
            }
            return true;
        };

        const checkAndLoadPrerequisites = async (keys, levelName) => {
            const dataFetchPromises = keys
                .filter(key => !videoData[key]?.rows?.length)
                .map(key => fetchVideos(masterConfig[key].folderIds || [masterConfig[key].folderId]).then(details => ({ key, details })));

            if (dataFetchPromises.length > 0) {
                setIsVideoLoading(true);
                const results = await Promise.all(dataFetchPromises);
                setIsVideoLoading(false);

                setVideoData(prevData => {
                    const newData = { ...prevData };
                    results.forEach(({ key, details }) => {
                        if (details) newData[key] = details;
                    });
                    return newData;
                });

                setLevelToUnlock(level);
                return false;
            }

            const allPrereqSteps = keys.flatMap(key => masterConfig[key]?.finalGroupedData.map(g => `step${g.stepNumber}`) || []);

            const areAllPrereqsCompleted = allPrereqSteps.every(stepKey => completedSteps[stepKey]);

            if (!areAllPrereqsCompleted) {
                Alert.alert("Level Locked", `You must complete all steps in the ${levelName} Level to unlock this level.`);
                return false;
            }

            return true;
        };

        if (level === 'foundation') {
            if (!completedSteps['step1002']) {
                Alert.alert("Locked", "Please complete Introduction II before starting the Foundation Level.");
                return;
            }
            await loadLevelVideos(foundationKeys);
            const lastStepOfMiddle = "49";
            if (lastStepOfMiddle > 0) {
                const endpoint = `${url}User/User_Watch_Data_StepId?id=${userId}&level_step=${lastStepOfMiddle}&DeviceKey=${deviceKey}`;
                try {
                    const response = await fetch(endpoint, { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } });
                    if (response.ok) {
                        const result = await response.json();
                        if (result.isSuccess && result.data && result.data.length > 0) {
                            const completionDate = new Date(result.data[0].createOn);
                            const hoursSinceCompletion = (new Date() - completionDate) / (1000 * 60 * 60);
                            if (hoursSinceCompletion > 170) {
                                Alert.alert('You’ve reached the maximum limit for now. If any new update comes, we’ll notify you instantly.');
                                return;
                            }
                        }
                    }
                } catch (error) { console.error("Could not check foundation lock time", error); }
            }
            setActiveLevel(level);
        }
        if (level === 'middle') {
            const foundationComplete = await checkAndLoadPrerequisites(foundationKeys, 'Foundation');
            if (foundationComplete) {
                await loadLevelVideos(middleKeys);
                const StepOfAdvance = "84";
                if (StepOfAdvance > 0) {
                    const endpoint = `${url}User/User_Watch_Data_StepId?id=${userId}&level_step=${StepOfAdvance}&DeviceKey=${deviceKey}`;
                    try {
                        const response = await fetch(endpoint, { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } });
                        if (response.ok) {
                            const result = await response.json();
                            if (result.isSuccess && result.data && result.data.length > 0) {
                                const completionDate = new Date(result.data[0].createOn);
                                const hoursSinceCompletion = (new Date() - completionDate) / (1000 * 60 * 60);
                                if (hoursSinceCompletion > 170) {
                                    Alert.alert(" You’ve reached the maximum limit for now. If any new update comes, we’ll notify you instantly.");
                                    return;
                                }
                            }
                        }
                    } catch (error) { console.error("Could not check foundation lock time", error); }
                }
                setActiveLevel(level);
            }
            return;
        }
        if (level === 'advanced') {
            const foundationComplete = await checkAndLoadPrerequisites(foundationKeys, 'Foundation');
            if (!foundationComplete) {
                return;
            }
            const middleComplete = await checkAndLoadPrerequisites(middleKeys, 'Middle');
            if (middleComplete) {
                await loadLevelVideos(advancedKeys);
                setActiveLevel(level);
            }
        }
    };

    const handleCloseModal = () => {
        setActiveLevel(null);
        setOpenCategory(null);
    };

    const renderLevelModal = () => {
        if (!activeLevel) return null;

        const levelKeys = {
            foundation: foundationKeys,
            middle: middleKeys,
            advanced: advancedKeys,
        }[activeLevel];

        const levelName = `${activeLevel.charAt(0).toUpperCase() + activeLevel.slice(1)} Level`;

        const contentWidth = Math.max(280, Math.round(windowWidth * 0.9));
        return <LevelModal levelName={levelName} onClose={handleCloseModal} isDarkMode={isDarkMode} scrollRef={levelModalScrollRef} isLandscape={isLandscape} contentWidth={contentWidth}>{levelKeys.map((key, index) => {
            const config = masterConfig[key];
            if (!config) return null;
            const allSteps = config.finalGroupedData?.map(g => `step${g.stepNumber}`) || [];
            const isComplete = allSteps.length > 0 && allSteps.every(stepKey => completedSteps[stepKey]);
            const scrollPadding = 5;
            const innerPadding = scrollPadding * 2;
            const modalImageFullWidth = Math.max(240, contentWidth - innerPadding);
            const modalImagenestedStyle = isLandscape
                ? imagenestedStyle
                : { ...(imagenestedStyle || {}), width: modalImageFullWidth, height: Math.max(150, Math.round(modalImageFullWidth * 0.65)), alignSelf: 'center' };
            const modalWidthForItem = !isLandscape && index === 0 ? modalImageFullWidth : modalImageFullWidth;

            return (
                <View key={key} ref={(el) => (categoryRefs.current[key] = el)} collapsable={false}>
                    <CategoryButton image={config.image} title={config.name} onPress={() => handleCategoryPress(key)} isOpen={openCategory === key} isComplete={isComplete} imagenestedStyle={modalImagenestedStyle} modalMode={!isLandscape} modalWidth={modalWidthForItem} />
                    {openCategory === key && <VideoStepList groups={config.finalGroupedData} completedSteps={completedSteps} onStepPress={handleDropdownItemClick} isDarkMode={isDarkMode} stepRefs={stepRefs} />}
                </View>
            );
        })}</LevelModal>
    }
    useEffect(() => {
        if (lastViewedRequest) return;
        if (!levelModalScrollRef.current) return;
        const timeout = setTimeout(() => {
            try {
                levelModalScrollRef.current.scrollTo({
                    y: 0,
                    animated: true,
                });
            } catch (e) {
                console.warn('Failed to scroll level modal to top:', e);
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, [activeLevel]);


    const closeLanguageModal = () => setIsModalVisible(false);

    const isLevelComplete = (keys) => {
        if (!keys || !keys.length) return false;
        const allSteps = keys.flatMap(key => masterConfig[key]?.finalGroupedData.map(g => `step${g.stepNumber}`) || []);
        if (allSteps.length === 0) return false;
        return allSteps.every(stepKey => completedSteps[stepKey]);
    };

    if (isLoading) {
        return <View style={styles.loaderContainer}><ActivityIndicator size="large" /></View>;
    }

    const isLandscape = windowWidth > windowHeight;
    const portraitContentWidth = Math.max(280, Math.round(windowWidth * 0.9));

    const imageStyle = isLandscape
        ? { width: Math.max(120, Math.round(windowWidth * 0.8)), height: Math.max(480, Math.round(windowHeight * 0.72)), resizeMode: 'center', borderRadius: 5 }
        : { width: portraitContentWidth, height: 250, resizeMode: 'center', borderRadius: 5, alignSelf: 'center' };

    const portraitNestedHeight = Math.max(150, Math.round(portraitContentWidth * 0.6));
    const imagenestedStyle = isLandscape
        ? { width: imageStyle.width, height: imageStyle.height, borderRadius: 5, alignSelf: 'center' }
        : { width: '100%', height: portraitNestedHeight, borderRadius: 5, alignSelf: 'center' };

    return (
        <View style={[styles.container, backgroundStyle]}>
            <View style={styles.imageContainer}>
                <ScrollView showsVerticalScrollIndicator={false} >
                    <TouchableOpacity activeOpacity={1} onPress={() => handleIntroductionPress(1)}>
                        <Animated.View style={[styles.button, { transform: [{ scale: scale2 }], marginTop: 5 }]}>
                            <Image source={require('../img/Intro1.png')} style={imageStyle} resizeMode="cover" />
                            <View style={[completedSteps['step1001'] ? styles.completedCategoryOverlay : styles.textOverlay]}>
                                <Text style={styles.text}>Introduction I</Text>
                            </View>
                        </Animated.View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => handleIntroductionPress(2)}>
                        <Animated.View style={[styles.button, { transform: [{ scale: scale2 }], marginTop: 10 }]}>
                            <Image source={require('../img/Intro2.png')} style={imageStyle} resizeMode="cover" />
                            <View style={[completedSteps['step1002'] ? styles.completedCategoryOverlay : styles.textOverlay]}>
                                <Text style={styles.text}>Introduction II</Text>
                            </View>
                        </Animated.View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => handleLevelPress('foundation')}>
                        <Animated.View style={[styles.button, { transform: [{ scale: scale1 }], marginTop: 10 }]}>
                            <Image source={require('../img/foundationlevel.png')} style={imageStyle} resizeMode="cover" />
                            <View style={[styles.textOverlayTwo, isLevelComplete(foundationKeys) ? styles.completedTextOverlayTwo : null]}>
                                <Image source={require('../img/tap.png')} style={[styles.tabimage, { opacity: 0 }]} />
                                <Text style={styles.text}>Foundation Level</Text>
                                <Animated.Image source={require('../img/tap.png')} style={[styles.tabimage, { opacity }]} resizeMode="cover" />
                            </View>
                        </Animated.View>
                    </TouchableOpacity>
                    <Animated.Image source={require('../img/tap.png')} style={[styles.handImage, { opacity: handOpacity, transform: [{ translateX: handPositionX }, { translateY: handPositionY }, { scale: handScale }] }]} resizeMode="contain" pointerEvents="none" />
                    <TouchableOpacity activeOpacity={1} onPress={() => handleLevelPress('middle')}>
                        <Animated.View style={[styles.button, { transform: [{ scale: scale2 }], marginTop: 10 }]}>
                            <Image source={require('../img/middlelevel2.png')} style={imageStyle} resizeMode="cover" />
                            <View style={[styles.textOverlay, isLevelComplete(middleKeys) ? styles.completedCategoryOverlay : null]}>
                                <Text style={styles.text}>Middle Level</Text>
                            </View>
                        </Animated.View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => handleLevelPress('advanced')}>
                        <Animated.View style={[styles.button, { transform: [{ scale: scale3 }], marginTop: 10 }]}>
                            <Image source={require('../img/advancelevel.png')} style={imageStyle} resizeMode="cover" />
                            <View style={[styles.textOverlay, isLevelComplete(advancedKeys) ? styles.completedCategoryOverlay : null]}>
                                <Text style={styles.text}>Advanced Level</Text>
                            </View>
                        </Animated.View>
                    </TouchableOpacity>
                </ScrollView>
                {renderLevelModal()}
            </View>

            {isModalVisible && selectedStepGroup && (
                <View style={styles.modalLikeContainer}>
                    <Pressable style={[styles.modalContent, backgroundStyle]} onPress={() => { }}>
                        <View style={styles.modalContentMainDiv}>
                            <Text style={[styles.modalTitle, textColorModal]}>Select Language</Text>
                            <TouchableOpacity onPress={closeLanguageModal}><Text style={[styles.modalContentClose, textColorModalPara]}>✕</Text></TouchableOpacity>
                        </View>
                        <View style={styles.borderLine} />
                        <Text style={[styles.modalText, textColorModalPara]}>In which language would you like to watch this video?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.modalButton, !selectedStepGroup.hindiVideo && styles.disabledButton]} onPress={() => handleVideo(selectedStepGroup.hindiVideo.id, selectedStepGroup.stepNumber, 'hindi')} disabled={!selectedStepGroup.hindiVideo}><Text style={styles.modalButtonText}>Hindi</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, !selectedStepGroup.englishVideo && styles.disabledButton]} onPress={() => handleVideo(selectedStepGroup.englishVideo.id, selectedStepGroup.stepNumber, 'english')} disabled={!selectedStepGroup.englishVideo}><Text style={styles.modalButtonText}>English</Text></TouchableOpacity>
                        </View>
                    </Pressable>
                </View>
            )}
            {isVideoLoading && (<View style={styles.modalLikeContainer}><ActivityIndicator size="large" color="#FFFFFF" /><Text style={styles.loadingText}>Loading...</Text></View>)}
            {!activeLevel && !openCategory && !isModalVisible ? (
                <TouchableOpacity
                    style={[styles.customButton, isLandscape ? { marginRight: Math.round(windowWidth * 0.08) } : null]}
                    activeOpacity={0.7}
                    accessibilityLabel="Last Viewed"
                    onPress={handleLastViewedPress}
                >
                    <Text style={styles.arrowText}>Last Viewed</Text>
                </TouchableOpacity>
            ) : null}
        </View>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'transparent', },
    imageContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 10,
        gap: 10,
        backgroundColor: 'transparent',
    },

    button: { marginBottom: 0, position: 'relative', borderRadius: 5, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5, },
    buttonNested: { width: '100%', marginBottom: 0, position: 'relative', borderRadius: 5, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5, },
    image: { width: '100%', height: 250, resizeMode: 'center', borderRadius: 5, },
    imagenested: { width: '100%', height: 180, borderRadius: 5, alignSelf: 'center' },
    textOverlay: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'rgba(20, 52, 164, 0.9)', padding: 10, alignItems: 'center', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, },
    completedCategoryOverlay: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#4DB6AC', padding: 10, alignItems: 'center', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, },
    completedTextOverlayTwo: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#4DB6AC', padding: 10, alignItems: 'center', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, flexDirection: 'row', justifyContent: 'space-between', },
    lockedDropdownItemBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10, gap: 10, width: '100%', backgroundColor: 'rgba(20, 52, 164, 0.9)' },
    completedDropdownItemBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10, gap: 10, width: '100%', backgroundColor: '#4DB6AC' },
    textOverlayTwo: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'rgba(20, 52, 164, 0.9)', padding: 10, alignItems: 'center', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, flexDirection: 'row', justifyContent: 'space-between', },
    text: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
    dropdownContent: { borderBottomLeftRadius: 5, borderBottomRightRadius: 5, width: '100%', marginBottom: 10, paddingHorizontal: 0, },
    dropdownItemBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10, gap: 10, width: '100%', backgroundColor: 'rgba(20, 52, 164, 0.8)' },
    imageVideo: { width: 35, height: 35, borderRadius: 5 },
    durationContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' },
    timerImage: { width: 16, height: 16, marginRight: 4, },
    durationText: { color: 'white', fontSize: 14, },
    dropdownItem: { fontSize: 16, color: '#fff', fontWeight: '500', flex: 1 },
    modalContent: { width: '80%', backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, borderRadius: 10, alignItems: 'center' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    modalText: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
    modalButtons: { flexDirection: 'row', gap: 15 },
    modalButton: { backgroundColor: 'rgba(20, 52, 164, 1)', paddingVertical: 10, width: 100, borderRadius: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },
    disabledButton: { backgroundColor: '#a0a0a0' },
    modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center', },
    videolist: { paddingHorizontal: 0, width: '100%', },
    tabimage: { width: 25, height: 22 },
    modalContentClose: { color: '#000', fontSize: 16, fontWeight: 'bold', },
    modalContentMainDiv: { flexDirection: "row", justifyContent: "space-between", width: '100%', },
    borderLine: { borderBottomWidth: 1, borderBottomColor: "#ccc", width: "100%", marginBottom: 15 },
    loadingText: { marginTop: 10, color: '#FFFFFF', fontSize: 16, },
    modalContents: { backgroundColor: '#dee2e6', borderRadius: 10, overflow: 'hidden', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, },
    modalHeader: { width: '100%', paddingVertical: 10, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(20, 52, 164, 1)', backgroundColor: 'rgba(20, 52, 164, 1)', },
    modalHeaderText: { fontSize: 18, fontWeight: 'bold', color: '#fff', },
    closeButton: { padding: 5 },
    closeButtonText: { fontSize: 18, fontWeight: 'bold', color: '#fff', },
    modalScrollView: { flex: 1, width: '100%', },
    modalScrollViewContent: { paddingHorizontal: 5, paddingVertical: 10, },
    modalLikeContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center', zIndex: 1000, },
    fullScreenPressable: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', padding: 20, },
    modalLikeContentBox: { width: '95%', maxHeight: '95%', backgroundColor: '#dee2e6', borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5, },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    handImage: { position: 'absolute', width: 50, height: 50, zIndex: 10 },
    customButton: {
        position: 'absolute',
        bottom: 90,
        right: 20,
        backgroundColor: '#4DB6AC',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        zIndex: 50,
    },

    arrowText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold',
    },

});
export default Dashboard;