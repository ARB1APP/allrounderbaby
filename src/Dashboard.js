import React, { useState, useRef, useEffect, useMemo } from 'react';
import { StyleSheet, ScrollView, View, Image, Animated, Dimensions, Text, TouchableOpacity, Modal, Alert, BackHandler, StatusBar, ActivityIndicator, Pressable, useColorScheme } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const url = 'https://allrounderbaby-czh8hubjgpcxgrc7.canadacentral-01.azurewebsites.net/api/';

const formatDuration = (totalSeconds) => {
    if (isNaN(totalSeconds) || totalSeconds < 0) return "--:--";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const StepListItem = ({ group, onPress, isCompleted, isLocked, isDarkMode }) => {
    const { stepNumber, displayStepNumber, hindiVideo, englishVideo } = group;
    if (!hindiVideo && !englishVideo) return null;

    const videoToShowDuration = englishVideo || hindiVideo;
    const durationText = videoToShowDuration?.length ? formatDuration(videoToShowDuration.length) : "";
    const itemStyle = isLocked ? styles.lockedDropdownItemBtn : (isCompleted ? styles.completedDropdownItemBtn : styles.dropdownItemBtn);
    return (
        <TouchableOpacity
            style={itemStyle}
            onPress={() => onPress(stepNumber)}
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
                        style={[styles.timerImage, { tintColor: isDarkMode ? '#FFD700' : '#FFD700' }]}
                        resizeMode="contain"
                    />
                    <Text style={[styles.durationText, { color: isDarkMode ? '#FFD700' : '#FFD700' }]}>
                        {durationText}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const VideoStepList = ({ groups, completedSteps, onStepPress, isDarkMode }) => {
    return (
        <View style={styles.dropdownContent}>
            {groups.map((group, index) => {
                const isFirstStep = index === 0;
                const previousStep = isFirstStep ? null : groups[index - 1];
                const isPreviousStepCompleted = isFirstStep || (previousStep && completedSteps[`step${previousStep.stepNumber}`]);
                const isLocked = !isPreviousStepCompleted;

                return (
                    <StepListItem key={`step-group-${group.stepNumber}`} group={group} onPress={onStepPress} isCompleted={completedSteps[`step${group.stepNumber}`] ?? false} isLocked={isLocked} isDarkMode={isDarkMode} />
                );
            })}
        </View>
    );
};

const LevelModal = ({ levelName, children, onClose, isDarkMode }) => (
    <View style={styles.modalLikeContainer}>
        <Pressable style={styles.fullScreenPressable} onPress={onClose}>
            <TouchableOpacity activeOpacity={1} style={styles.modalLikeContentBox} onPress={() => { }}>
                <View style={[styles.modalContents, { backgroundColor: isDarkMode ? '#2a3144' : Colors.white }]}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalHeaderText}>{levelName}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalScrollView} contentContainerStyle={styles.modalScrollViewContent}>
                        <View style={styles.videolist}>
                            {children}
                        </View>
                    </ScrollView>
                </View>
            </TouchableOpacity>
        </Pressable>
    </View>
);

const CategoryButton = ({ image, title, onPress, isOpen }) => (
    <TouchableOpacity activeOpacity={1} onPress={onPress}>
        <View style={[styles.buttonNested, { marginBottom: isOpen ? 0 : 10 }]}>
            <Image source={image} style={styles.imagenested} resizeMode="cover" />
            <View style={styles.textOverlay}>
                <Text style={styles.text}>{title}</Text>
            </View>
        </View>
    </TouchableOpacity>
);


const Dashboard = ({ navigation }) => {
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
    const [levelToUnlock, setLevelToUnlock] = useState(null);
    const [middleLevelCompletionTime, setMiddleLevelCompletionTime] = useState(null);
    const [advancedLevelCompletionTime, setAdvancedLevelCompletionTime] = useState(null);
    const [videoData, setVideoData] = useState({});
    const scale1 = useRef(new Animated.Value(0)).current;
    const scale2 = useRef(new Animated.Value(0)).current;
    const scale3 = useRef(new Animated.Value(0)).current;
    const handOpacity = useRef(new Animated.Value(0)).current;
    const handPositionX = useRef(new Animated.Value(screenWidth * 0.6)).current;
    const handPositionY = useRef(new Animated.Value(screenHeight * 0.4)).current;
    const handScale = useRef(new Animated.Value(1)).current;
    const opacity = useRef(new Animated.Value(1)).current;
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = { backgroundColor: isDarkMode ? '#2a3144' : Colors.white };
    const textColorModal = { color: isDarkMode ? Colors.white : 'rgba(20, 52, 164, 1)' }
    const textColorModalPara = { color: isDarkMode ? Colors.white : '#2a3144' }
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

    const foundationKeys = ['trust', 'loveAndCare', 'respect', 'familiar'];
    const middleKeys = ['speechDevelopment', 'truth', 'setBoundaries', 'listenFollow'];
    const advancedKeys = ['cooperation', 'imagination', 'help', 'discussion', 'narrate', 'emotions', 'feelings', 'knowledge'];

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                const storedToken = await AsyncStorage.getItem('token');
                const storedUserId = await AsyncStorage.getItem('userId');
                if (storedToken && storedUserId) {
                    setToken(storedToken);
                    setUserID(storedUserId);
                    await fetchUserProgress(storedUserId, storedToken);
                }
                await loadCompletedSteps();
                await loadMiddleLevelCompletionTime();
                await loadAdvancedLevelCompletionTime();
                await loadTopicCompletionTimes();
            } catch (error) {
                console.error("Failed to load initial data:", error);
                Alert.alert("Error", "Failed to load user data. Please try restarting the app.");
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();

           const unsubscribe = navigation.addListener('focus', () => {
            loadInitialData();
        }); 

        return unsubscribe;
    }, [navigation]);

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

                const newCompletedSteps = {};
                const newTopicCompletionTimes = {};
                let highestCompletedStep = 0;

                result.data.forEach(item => {
                    if (item.total_views > 0) {
                        newCompletedSteps[`step${item.level_step}`] = true;
                       if (item.level_step > highestCompletedStep) {
                            highestCompletedStep = item.level_step;
                        }
                    }
                });
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
                setCompletedSteps(newCompletedSteps);
                setTopicCompletionTimes(newTopicCompletionTimes);
                await AsyncStorage.setItem('completedSteps', JSON.stringify(newCompletedSteps));
                await AsyncStorage.setItem('topicCompletionTimes', JSON.stringify(newTopicCompletionTimes));
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
        const targetX = screenWidth * 0.4;
        const targetY = screenHeight * 0.3;
        Animated.loop(
            Animated.sequence([
                Animated.delay(1500),
                Animated.parallel([Animated.timing(handOpacity, { toValue: 1, duration: 300, useNativeDriver: true }), Animated.timing(handPositionX, { toValue: targetX, duration: 1000, useNativeDriver: true }), Animated.timing(handPositionY, { toValue: targetY, duration: 1000, useNativeDriver: true }),]),
                Animated.sequence([Animated.timing(handScale, { toValue: 0.85, duration: 150, useNativeDriver: true }), Animated.timing(handScale, { toValue: 1, duration: 150, useNativeDriver: true }),]),
                Animated.delay(300),
                Animated.parallel([Animated.timing(handOpacity, { toValue: 0, duration: 300, delay: 700, useNativeDriver: true }), Animated.timing(handPositionX, { toValue: screenWidth * 0.6, duration: 1000, useNativeDriver: true }), Animated.timing(handPositionY, { toValue: screenHeight * 0.4, duration: 1000, useNativeDriver: true }),]),
                Animated.delay(1000),
            ])
        ).start();
    };

    useEffect(() => {
        startHandAnimation();
        const blinkingAnimation = Animated.loop(
            Animated.sequence([Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }), Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),]), { iterations: 8 }
        );
        blinkingAnimation.start(() => { Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }).start(); });
        Animated.timing(scale1, { toValue: 1, duration: 600, useNativeDriver: true }).start();
        Animated.timing(scale2, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }).start();
        Animated.timing(scale3, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }).start(); return () => blinkingAnimation.stop();
    }, []);

    const fetchVideos = async (folderIds) => {
        if (!Array.isArray(folderIds)) folderIds = [folderIds];
        let allVideos = { rows: [] };
        for (const folderId of folderIds) {
            try {
                const endpoint = `${url}Vdocipher/GetAllVDOCipherVideosByFolderID?folderId=${folderId}`;
                const response = await fetch(endpoint, { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } });
                if (!response.ok) throw new Error(`Failed to fetch videos for folder ${folderId}`);
                const data = await response.json();
                if (data && data.rows) { allVideos.rows.push(...data.rows); }
            } catch (error) {
                console.error(`Error fetching videos from folder ${folderId}:`, error);
                Alert.alert("API Error", `Could not load some videos. Please check your connection and try again. Details: ${error.message}`);
            }
        }
        return allVideos;

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
    const arePrerequisitesMet = async (categoryKey) => {
        const deviceKey = await AsyncStorage.getItem('deviceKey');
        const config = masterConfig[categoryKey];
        if (!config) return false;
         if (config.prerequisiteCategory) {
            const prereqConfig = masterConfig[config.prerequisiteCategory];
            if (prereqConfig) {
                const isPrereqDataLoaded = await ensureCategoryDataIsLoaded(config.prerequisiteCategory);
                if (!isPrereqDataLoaded) {
                    Alert.alert("Error", "Could not load prerequisite data. Please try again.");
                    return false;
                }
                const updatedPrereqConfig = masterConfig[config.prerequisiteCategory];
                const allPrereqSteps = prereqConfig.finalGroupedData.map(g => `step${g.stepNumber}`);
                const areAllPrereqsCompleted = allPrereqSteps.every(stepKey => completedSteps[stepKey]);

                if (!areAllPrereqsCompleted) {
                    Alert.alert("Level Locked", `You must complete the "${prereqConfig.name}" stage before accessing this one.`);
                    return false;
                }

                const lastStepOfPrereq = prereqConfig.finalGroupedData[prereqConfig.finalGroupedData.length - 1];
                const lastStepNumber = lastStepOfPrereq.stepNumber;
console.log(userId, lastStepNumber, deviceKey);
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
                                    const hoursRemaining = Math.ceil(lockDurationHours - hoursSinceCompletion);
                                    Alert.alert("Topic Locked", `Great progress! Your next topic will unlock in ${lockDurationHours} hours. Use this time to practice what you’ve learned so far.`);
                                    return false;
                                } else {
                                    Alert.alert("Topic Unlocked!", `Your next Topic is now unlocked. Start watching!`);
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error checking time lock:", error);
                    Alert.alert("Network Error", "Could not verify topic lock status. Please try again.");
                    return false;
                }
            }
        }
        return true;
    };

    const handleCategoryPress = async (categoryKey) => {
        if (!dataLoaded) {
            Alert.alert("Please wait", "Loading progress data...");
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
    };

    const handleDropdownItemClick = (stepNumber) => {
        const config = masterConfig[openCategory];
        if (!config) return;
        const group = config.finalGroupedData.find(g => g.stepNumber === stepNumber);
        const groupIndex = config.finalGroupedData.findIndex(g => g.stepNumber === stepNumber);

        if (groupIndex > 0) {
            const previousStep = config.finalGroupedData[groupIndex - 1];
            const isPreviousStepCompleted = completedSteps[`step${previousStep.stepNumber}`];
            if (!isPreviousStepCompleted) {
                Alert.alert(
                    "Step Locked",
                    `Please complete Step ${previousStep.displayStepNumber} to unlock this step.`
                );
                return;
            }
        }
        if (group) {
            setSelectedStepGroup({ ...group, category: openCategory });
            setIsModalVisible(true);
        } else {
            Alert.alert('Error', `Video group for step ${stepNumber} not found.`);
        }
    };

    const handleVideo = async (videoId, step, language) => {
        const deviceKey = await AsyncStorage.getItem('deviceKey');

        if (step !== 90 && step !== 91) {
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
                            totalWatchCount += result.data.reduce((sum, record) => sum + (record.is_finished || 0), 0);
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
                        if (languageRecord && languageRecord.is_finished >= 3) {
                            Alert.alert("Limit Reached", `You have already watched the ${language} video for this step 3 times.`);
                            return;
                        }
                    } else if (!specificResult.isSuccess) {
                        Alert.alert("Error", `Could not verify video watch count: ${specificResult.message}. Please try again.`);
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

            const response = await fetch(`${url}Vdocipher/GetVideosFromVDOCipher_VideoId`, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(requestBody),
            });
            if (!response.ok) { throw new Error("Video not found or failed to get OTP."); }
            const data = await response.json();

            await saveCompletedStep(`step${step}`);
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
            Alert.alert("API Error", `An unexpected error occurred: ${error.message}`);
            return null;
        } finally {
            setIsVideoLoading(false);
        }
    };

    const handleIntroductionPress = async (introType) => {
        if (introType === 2 && !completedSteps['step90']) {
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
            const group = introType === 1 ? { stepNumber: 90, hindiVideo: videoDetails.rows[2], englishVideo: videoDetails.rows[3] } : { stepNumber: 91, hindiVideo: videoDetails.rows[0], englishVideo: videoDetails.rows[1] };
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
            if (!completedSteps['step91']) {
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

        return <LevelModal levelName={levelName} onClose={handleCloseModal} isDarkMode={isDarkMode}>{levelKeys.map(key => { const config = masterConfig[key]; if (!config) return null; return (<React.Fragment key={key}><CategoryButton image={config.image} title={config.name} onPress={() => handleCategoryPress(key)} isOpen={openCategory === key} />{openCategory === key && <VideoStepList groups={config.finalGroupedData} completedSteps={completedSteps} onStepPress={handleDropdownItemClick} isDarkMode={isDarkMode} />}</React.Fragment>); })}</LevelModal>
    }

    const closeLanguageModal = () => setIsModalVisible(false);

    if (isLoading) {
        return <View style={styles.loaderContainer}><ActivityIndicator size="large" /></View>;
    }

    return (
        <View style={[styles.container, backgroundStyle]}>
            <View style={styles.imageContainer}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <TouchableOpacity activeOpacity={1} onPress={() => handleIntroductionPress(1)}><Animated.View style={[styles.button, { transform: [{ scale: scale2 }], marginTop: 5 }]}><Image source={require('../img/Intro1.png')} style={styles.image} resizeMode="cover" /><View style={styles.textOverlay}><Text style={styles.text}>Introduction I</Text></View></Animated.View></TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => handleIntroductionPress(2)}><Animated.View style={[styles.button, { transform: [{ scale: scale2 }], marginTop: 10 }]}><Image source={require('../img/Intro2.png')} style={styles.image} resizeMode="cover" /><View style={styles.textOverlay}><Text style={styles.text}>Introduction II</Text></View></Animated.View></TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => handleLevelPress('foundation')}><Animated.View style={[styles.button, { transform: [{ scale: scale1 }], marginTop: 10 }]}><Image source={require('../img/foundationlevel.png')} style={styles.image} resizeMode="cover" /><View style={styles.textOverlayTwo}><Image source={require('../img/tap.png')} style={[styles.tabimage, { opacity: 0 }]} /><Text style={styles.text}>Foundation Level</Text><Animated.Image source={require('../img/tap.png')} style={[styles.tabimage, { opacity }]} resizeMode="cover" /></View></Animated.View></TouchableOpacity>
                    <Animated.Image source={require('../img/tap.png')} style={[styles.handImage, { opacity: handOpacity, transform: [{ translateX: handPositionX }, { translateY: handPositionY }, { scale: handScale }] }]} resizeMode="contain" pointerEvents="none" />
                    <TouchableOpacity activeOpacity={1} onPress={() => handleLevelPress('middle')}><Animated.View style={[styles.button, { transform: [{ scale: scale2 }], marginTop: 10 }]}><Image source={require('../img/middlelevel2.png')} style={styles.image} resizeMode="cover" /><View style={styles.textOverlay}><Text style={styles.text}>Middle Level</Text></View></Animated.View></TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={() => handleLevelPress('advanced')}><Animated.View style={[styles.button, { transform: [{ scale: scale3 }], marginTop: 10 }]}><Image source={require('../img/advancelevel.png')} style={styles.image} resizeMode="cover" /><View style={styles.textOverlay}><Text style={styles.text}>Advanced Level</Text></View></Animated.View></TouchableOpacity>
                </ScrollView>
                {renderLevelModal()}
            </View>

            {isModalVisible && selectedStepGroup && (<View style={styles.modalLikeContainer}><Pressable style={[styles.modalContent, backgroundStyle]} onPress={(e) => e.stopPropagation()}><View style={styles.modalContentMainDiv}><Text style={[styles.modalTitle, textColorModal]}>Select Language</Text><TouchableOpacity onPress={closeLanguageModal}><Text style={[styles.modalContentClose, textColorModalPara]}>✕</Text></TouchableOpacity></View><View style={styles.borderLine} /><Text style={[styles.modalText, textColorModalPara]}>In which language would you like to watch this video?</Text><View style={styles.modalButtons}><TouchableOpacity style={[styles.modalButton, !selectedStepGroup.hindiVideo && styles.disabledButton]} onPress={() => handleVideo(selectedStepGroup.hindiVideo.id, selectedStepGroup.stepNumber, 'hindi')} disabled={!selectedStepGroup.hindiVideo}><Text style={styles.modalButtonText}>Hindi</Text></TouchableOpacity><TouchableOpacity style={[styles.modalButton, !selectedStepGroup.englishVideo && styles.disabledButton]} onPress={() => handleVideo(selectedStepGroup.englishVideo.id, selectedStepGroup.stepNumber, 'english')} disabled={!selectedStepGroup.englishVideo}><Text style={styles.modalButtonText}>English</Text></TouchableOpacity></View></Pressable></View>)}
            <View style={[styles.bottomNav, backgroundStyle]}><TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}><Image source={require('../img/hometab.png')} style={[styles.navIcon, { tintColor: isDarkMode ? '#60b5f6' : 'rgba(20, 52, 164, 1)' }]} /><Text style={[styles.navTextActive, { color: isDarkMode ? '#60b5f6' : '#1434a4' }]}>Home</Text></TouchableOpacity><TouchableOpacity style={[styles.navItem, styles.inactive]} onPress={() => navigation.navigate('Cashback for Feedback')}><Image source={require('../img/feedbacktab.png')} style={[styles.navIcon, { tintColor: 'gray' }]} /><Text style={styles.navText}>Cashback for Feedback</Text></TouchableOpacity><TouchableOpacity style={[styles.navItem, styles.inactive]} onPress={() => navigation.navigate('Refer and Earn')}><Image source={require('../img/money.png')} style={[styles.navIcon, { tintColor: 'gray' }]} /><Text style={styles.navText}>Refer & Earn</Text></TouchableOpacity><TouchableOpacity style={[styles.navItem, styles.inactive]} onPress={() => navigation.navigate('My Profile')}><Image source={require('../img/proflie.png')} style={[styles.navIcon, { tintColor: 'gray' }]} /><Text style={styles.navText}>My Profile</Text></TouchableOpacity></View>
            {isVideoLoading && (<View style={styles.modalLikeContainer}><ActivityIndicator size="large" color="#FFFFFF" /><Text style={styles.loadingText}>Loading...</Text></View>)}
        </View>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5FCFF', },
    imageContainer: { flex: 1, flexDirection: 'column', alignItems: 'center', paddingVertical: 10, gap: 10 },
    button: { marginBottom: 0, position: 'relative', borderRadius: 5, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5, },
    buttonNested: { marginBottom: 0, position: 'relative', borderRadius: 5, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5, },
    image: { width: width - 20, height: 250, resizeMode: 'center', borderRadius: 5, },
    imagenested: { width: width - 48, height: height / 2.8, borderRadius: 5, },
    textOverlay: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'rgba(20, 52, 164, 0.9)', padding: 10, alignItems: 'center', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, },
    lockedDropdownItemBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10, gap: 10, width: '100%', backgroundColor: 'rgba(20, 52, 164, 0.9)' },
    completedDropdownItemBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10, gap: 10, width: '100%', backgroundColor: '#4DB6AC' },
    textOverlayTwo: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'rgba(20, 52, 164, 0.9)', padding: 10, alignItems: 'center', borderBottomLeftRadius: 5, borderBottomRightRadius: 5, flexDirection: 'row', justifyContent: 'space-between', },
    text: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
    bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 10, bottom: 0, width: '100%', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 20, elevation: 5, },
    navItem: { alignItems: 'center', paddingVertical: 5, },
    navIcon: { width: 24, height: 24, resizeMode: 'contain', marginBottom: 4, },
    navText: { color: 'gray', fontSize: 10, marginTop: 4, fontWeight: 'bold', },
    inactive: { opacity: 0.5, },
    navTextActive: { color: 'rgba(20, 52, 164, 1)', fontSize: 10, marginTop: 4, fontWeight: 'bold', },
    dropdownContent: { borderBottomLeftRadius: 5, borderBottomRightRadius: 5, width: '100%', marginBottom: 10, paddingHorizontal: 0, },
    dropdownItemBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10, gap: 10, width: '100%', backgroundColor: 'rgba(20, 52, 164, 0.8)' },
    imageVideo: { width: 35, height: 35, borderRadius: 5 },
    durationContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' },
    timerImage: { width: 16, height: 16, marginRight: 4, },
    durationText: { color: 'white', fontSize: 14, },
    dropdownItem: { fontSize: 16, color: '#fff', fontWeight: '500', flex: 1 },
    modalContent: { width: width * 0.8, backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, borderRadius: 10, alignItems: 'center' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    modalText: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
    modalButtons: { flexDirection: 'row', gap: 15 },
    modalButton: { backgroundColor: 'rgba(20, 52, 164, 1)', paddingVertical: 10, width: 100, borderRadius: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },
    disabledButton: { backgroundColor: '#a0a0a0' },
    modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center', },
    videolist: { paddingHorizontal: 10, width: '100%', },
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
});
export default Dashboard;