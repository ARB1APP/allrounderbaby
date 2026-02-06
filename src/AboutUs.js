import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,

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
    textAlign: 'left',
  },
  sectionHeader: {
    marginHorizontal: 20,
    marginTop: 0,
    marginBottom: 10,
    fontSize: 24,
    fontWeight: '700',
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
    height: 200,
    resizeMode: 'cover',
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
    flexDirection: 'row'
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
});

const AboutUs = ({ navigation, route }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkThemeColors : lightThemeColors;
  const styles = createCashbackConditionsStyles(theme);
  const isDarkMode = useColorScheme() === 'dark';
  const pulseAnim = useRef(new Animated.Value(0)).current;
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.statusBarContent} backgroundColor={theme.screenBackground} />
      <ScreenScroll contentContainerStyle={styles.scrollViewContent}>
        <LinearGradient
          colors={['#A0F0D1', '#B0E5FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.sectionBg1}
        >
          <Text style={styles.abouts}>About <Text style={styles.aboutsSpan}>Us</Text> </Text>
        </LinearGradient>

        <View style={styles.sectionlogo}>
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
        </View>
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
          ]}>Contact Us</Text>
          <Text style={[styles.introParagraph, { marginBottom: 0 }]}>At <Text style={{ fontWeight: 'bold' }}>AllrounderBaby.com, </Text>we are committed to providing <Text style={{ fontWeight: 'bold' }}>reliable support for parents. </Text>  For any questions, inquiries, or assistance, our team is available to help.</Text>
          <Text style={[styles.introParagraph, { marginTop: 5, marginBottom: 0, }]}>
            <Text style={{ fontWeight: 'bold' }}>📩 Email:  </Text><Text style={styles.emailLink}>support@allrounderbaby.com</Text>
          </Text>
          <Text style={[styles.introParagraph, { marginVertical: 5, }]}>We will respond <Text style={{ fontWeight: 'bold' }}>as promptly as possible.</Text></Text>

        </LinearGradient>
        <LinearGradient
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

        </LinearGradient>
      </ScreenScroll>
    </View>
  );
};
export default AboutUs;
