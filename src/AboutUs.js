import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  BackHandler,
  Image,
  StatusBar,
  useColorScheme,
  Platform,
} from 'react-native';

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
    marginTop: 20,
    marginBottom: 20,
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
    width: 250,
    height: 150,
    resizeMode: 'cover',
    marginBottom: 15,
  },
  sectionlogo: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
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
    marginHorizontal: 10,
    marginBottom: 12,
    fontSize: 22,
    fontWeight: '700',
  },
  sectionHeaderFlex: {
    marginHorizontal: 20,
    flexDirection: 'row'
  },
  sectionContainer: {
    padding: 10,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
});

const AboutUs = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkThemeColors : lightThemeColors;
  const styles = createCashbackConditionsStyles(theme);
  const isDarkMode = useColorScheme() === 'dark';
  useEffect(() => {
    const backAction = () => {
      if (navigation.canGoBack()) {
        navigation.navigate('Cashback for Feedback');
      } else {
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      backHandler.remove();
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.statusBarContent} backgroundColor={theme.screenBackground} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={[
          styles.sectionContainer,
          { backgroundColor: isDarkMode ? '#282c34' : '#ffffff' },
          { borderColor: isDarkMode ? '#444' : '#e0e0e0' }
        ]}>
          <Text style={[
            styles.sectionHeader,
            { color: isDarkMode ? '#fff' : '#1434a4' }
          ]}>About us</Text>
          <Text style={styles.introParagraph}>
            At SarvaShine Allrounder Baby Solutions Private Limited, also known as AllrounderBaby.com, we are redefining the way parents nurture their little ones.
          </Text>
          <View style={styles.sectionlogo}>
            <Image
              source={require('../img/loveandcare.png')}
              style={styles.logo}
              accessibilityLabel="App Logo"
            />
          </View>
          <Text style={styles.introParagraph}>
            We are not just a company—we are a global parenting movement filled with warmth, happiness, and purpose. Our mission is to bring contentment into the journey of parenting while equipping moms and dads with cutting-edge tools and knowledge to give their children the best start in life.
          </Text>

          <Text style={styles.introParagraph}>
            We believe that, every child is a bundle of joy, laughter, and limitless potential. The early years are magical, and the way they are nurtured shapes the foundation of their future. Through our science-backed, holistic approach, we help parents unlock and develop their child's nine types of intelligence, ensuring they grow into happy, confident, well-behaved, and emotionally strong individuals. In a world that is rapidly evolving, raising a well-rounded, adaptable child is no longer a luxury—it is a necessity now.
          </Text>

        </View>
        <View style={styles.sectionDivider} />
        <View style={[
          styles.sectionContainer,
          { backgroundColor: isDarkMode ? '#282c34' : '#ffffff' },
          { borderColor: isDarkMode ? '#444' : '#e0e0e0' }
        ]}>
          <View style={styles.sectionHeaderFlex}>
            <Image
              source={require('../img/visionicon.png')}
              style={[
                styles.Titlelogo,
                { tintColor: isDarkMode ? '#fff' : '#1434a4' }
              ]}
              accessibilityLabel="Title Logo"
            />
            <Text style={[
              styles.TitleText,
              { color: isDarkMode ? '#fff' : '#1434a4' }
            ]}>
              Our Vision
            </Text>
          </View>
          <Text style={styles.introParagraph}>
            To be the world’s most trusted and happiness-driven early childhood development platform, revolutionizing parenting through innovation, science, and heart. We envision a future where every child is given the opportunity to shine, where parents feel empowered, and where holistic child development is not just accessible—but a delightful experience for every family.
          </Text>
        </View>
        <View style={[
          styles.sectionContainer,
          { backgroundColor: isDarkMode ? '#282c34' : '#ffffff' },
          { borderColor: isDarkMode ? '#444' : '#e0e0e0' }
        ]}>
          <View style={styles.sectionHeaderFlex}>
            <Image
              source={require('../img/target.png')}
              style={[
                styles.Titlelogo,
                { tintColor: isDarkMode ? '#fff' : '#1434a4' }
              ]}
              accessibilityLabel="Title Logo"
            />
            <Text style={[
              styles.TitleText,
              { color: isDarkMode ? '#fff' : '#1434a4' }
            ]}>
              Our Mission
            </Text>
          </View>
          <Text style={styles.introParagraph}>
            Our mission is simple yet powerful: To spread happiness in parenting while equipping parents with the knowledge, tools, and confidence to raise all-rounder children, who deserve to enjoy every aspect of life. We blend neuroscience, psychology, and early education principles to provide engaging, practical, and research-backed solutions that make parenting not just easier—but more fulfilling and fun.
          </Text>
        </View>
        <View style={styles.sectionDivider} />
        <View style={[
          styles.sectionContainer,
          { backgroundColor: isDarkMode ? '#282c34' : '#ffffff' },
          { borderColor: isDarkMode ? '#444' : '#e0e0e0' }
        ]}>
          <Text style={[
            styles.sectionHeader,
            { color: isDarkMode ? '#fff' : '#1434a4' }
          ]}>Our Core Values</Text>

          <View style={[
            styles.sectionContainer,
            { backgroundColor: isDarkMode ? '#282c34' : '#ffffff' },
            { borderColor: isDarkMode ? '#444' : '#e0e0e0' }
          ]}>
            <View style={styles.sectionHeaderFlex}>
              <Image
                source={require('../img/heart.png')}
                style={[
                  styles.Titlelogo,
                  { tintColor: isDarkMode ? '#fff' : '#dc3545' }
                ]}
                accessibilityLabel="Heart icon representing empathy"
              />
              <Text
                style={[
                  styles.TitleText,
                  { color: isDarkMode ? '#fff' : '#1434a4' }
                ]}
              >
                Empathy at the Core
              </Text>
            </View>

            <Text style={[
              styles.introParagraph,
              { color: isDarkMode ? '#fff' : '#4A5568' }
            ]}>
              We understand the joys and struggles of parenting firsthand. We uplift parents with warmth, kindness, and unwavering support.
            </Text>
          </View>

          <View style={[
            styles.sectionContainer,
            { backgroundColor: isDarkMode ? '#282c34' : '#ffffff' },
            { borderColor: isDarkMode ? '#444' : '#e0e0e0' }
          ]}>
            <View style={styles.sectionHeaderFlex}>
              <Image
                source={require('../img/lightbulb.png')}
                style={[
                  styles.Titlelogo,
                  { tintColor: isDarkMode ? '#fff' : '#ffc107' }
                ]}
                accessibilityLabel="Title Logo"
              />
              <Text style={[
                styles.TitleText,
                { color: isDarkMode ? '#fff' : '#1434a4' }
              ]}>
                Innovation & Science-Driven Excellence
              </Text>
            </View>
            <Text style={styles.introParagraph}>
              We integrate the latest research in child psychology, neuroscience, and education to create the best resources for families.
            </Text>
          </View>
          <View style={[
            styles.sectionContainer,
            { backgroundColor: isDarkMode ? '#282c34' : '#ffffff' },
            { borderColor: isDarkMode ? '#444' : '#e0e0e0' }
          ]}>

            <View style={styles.sectionHeaderFlex}>
              <Image
                source={require('../img/shield.png')}
                style={[
                  styles.Titlelogo,
                  { tintColor: isDarkMode ? '#fff' : '#198754' }
                ]}
                accessibilityLabel="Title Logo"
              />
              <Text style={[
                styles.TitleText,
                { color: isDarkMode ? '#fff' : '#1434a4' }
              ]}>
                Integrity & Transparency
              </Text>
            </View>
            <Text style={styles.introParagraph}>
              We are committed to ethical, honest, and research-backed parenting solutions—because every parent deserve the best.
            </Text>
          </View>
          <View style={[
            styles.sectionContainer,
            { backgroundColor: isDarkMode ? '#282c34' : '#ffffff' },
            { borderColor: isDarkMode ? '#444' : '#e0e0e0' }
          ]}>
            <View style={styles.sectionHeaderFlex}>
              <Image
                source={require('../img/usersgroup.png')}
                style={[
                  styles.Titlelogo,
                  { tintColor: isDarkMode ? '#fff' : '#0dcaf0' }
                ]}
                accessibilityLabel="Title Logo"
              />
              <Text style={[
                styles.TitleText,
                { color: isDarkMode ? '#fff' : '#1434a4' }
              ]}>
                Community & Collaboration
              </Text>
            </View>
            <Text style={styles.introParagraph}>
              We bring together parents, experts, and educators to create a happy, supportive, and inspiring global parenting network.
            </Text>
          </View>
          <View style={[
            styles.sectionContainer,
            { backgroundColor: isDarkMode ? '#282c34' : '#ffffff' },
            { borderColor: isDarkMode ? '#444' : '#e0e0e0' }
          ]}>
            <View style={styles.sectionHeaderFlex}>
              <Image
                source={require('../img/facesmile.png')}
                style={[
                  styles.Titlelogo,
                  { tintColor: isDarkMode ? '#fff' : '#0a58ca' }
                ]}
                accessibilityLabel="Title Logo"
              />
              <Text style={[
                styles.TitleText,
                { color: isDarkMode ? '#fff' : '#1434a4' }
              ]}>
                Spreading fulfillment in Parenting
              </Text>
            </View>
            <Text style={styles.introParagraph}>
              We believe that parenting should be an exciting adventure, full of laughter, learning, and love. Our approach is designed to make every moment with your child more memorable.
            </Text>
          </View>
        </View>
        <View style={styles.sectionDivider} />
        <View style={[
          styles.sectionContainer,
          { backgroundColor: isDarkMode ? '#282c34' : '#ffffff' },
          { borderColor: isDarkMode ? '#444' : '#e0e0e0' }
        ]}>
          <Text style={[
            styles.sectionHeader,
            { color: isDarkMode ? '#fff' : '#1434a4' }
          ]}>Our Objectives</Text>
          <Text style={styles.introParagraph}>
            ✅ To transform parenting through accessible, science- backed early childhood development programs that bring happiness to parents and children alike.
          </Text>
          <Text style={styles.introParagraph}>
            ✅ To help parents nurture and develop their child’s nine types of intelligence in a simple, engaging, and practical way.
          </Text>
          <Text style={styles.introParagraph}>
            ✅ To build a strong, supportive, and delightful global community where parents can share experiences, ask questions, and feel truly heard.
          </Text>
          <Text style={styles.introParagraph}>
            ✅ To collaborate with leading experts in neuroscience, psychology, and education, ensuring our resources remain at the forefront of early childhood development while promoting positive parenting experiences.
          </Text>
          <Text style={styles.introParagraph}>
            ✅ To bridge cultural and geographical gaps in parenting knowledge, making world-class child development resources available to all families—everywhere.
          </Text>
        </View>
        <View style={styles.sectionDivider} />
        <View style={[
          styles.sectionContainer,
          { backgroundColor: isDarkMode ? '#282c34' : '#ffffff' },
          { borderColor: isDarkMode ? '#444' : '#e0e0e0' }
        ]}>
          <Text style={[
            styles.sectionHeader,
            { color: isDarkMode ? '#fff' : '#1434a4' }
          ]}>Our Story</Text>
          <Text style={styles.introParagraph}>
            "Every great company starts with a powerful WHY, and ours is simple: Parents deserve happiness. Children deserve the best."
          </Text>
          <Text style={styles.introParagraph}>
            AllrounderBaby.com was founded on the belief that every child is a bright spark of happiness,
            intelligence, and potential—but only if given the right environment and opportunities.
            Our founder, Shubha Nayak, a visionary leader in modern parenting, saw a world where parents were overwhelmed with conflicting advice,
            struggling to find the best ways to nurture their little ones. Our team knew there had to be a better way—one that not only
            empowered parents but also made the journey joyful and stress-free.
          </Text>
          <Text style={styles.introParagraph}>
            That’s why SarvaShine Allrounder Baby Solutions Private Limited was born—to bring clarity, confidence, and happiness back into parenting. We blend science, culture, and real-world experience into practical, easy-to-follow, and cheerful programs that make a real difference in children's lives.
          </Text>
          <Text style={styles.introParagraph}>
            From a passion project to a global movement, we have helped thousands of parents worldwide raise happier, more intelligent, and well-rounded children. We are just getting started. The future belongs to the children, and we are here to ensure they shine brighter and smile wider than ever before.
          </Text>
        </View>
        <View style={styles.sectionDivider} />
        <View style={[
          styles.sectionContainer,
          { backgroundColor: isDarkMode ? '#282c34' : '#ffffff' },
          { borderColor: isDarkMode ? '#444' : '#e0e0e0' }
        ]}>
          <Text style={[
            styles.sectionHeader,
            { color: isDarkMode ? '#fff' : '#1434a4' }
          ]}>Join the Happiness Revolution</Text>
          <Text style={styles.introParagraph}>
            Parenting is evolving, and so should the way we nurture our little ones. Join the AllrounderBaby.com community today and be part of a movement that is shaping the next generation with love, laughter, and learning—one empowered parent at a time.
          </Text>
          <Text style={styles.introParagraph}>
            Let’s raise joyful, confident, curious, and compassionate children—together. 🎉✨
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};
export default AboutUs;
