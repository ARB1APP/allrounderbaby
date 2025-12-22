import React, { useState } from 'react';
import { navigationRef } from '../App';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, Image, StyleSheet, Dimensions, SafeAreaView } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 10;
const CARD_WIDTH = width - CARD_MARGIN * 2;
const CARD_HEIGHT = Math.round((CARD_WIDTH * 9) / 16);
const footerIconSize = Math.round(Math.max(18, Math.min(32, width * 0.06)));
const footerHeight = Math.round(Math.max(56, width * 0.12));
const footerFontSize = Math.round(Math.max(10, Math.min(14, width * 0.03)));

const FooterTab = ({ active, onPressTab }) => {
	return (
		<View style={styles.footerWrap} pointerEvents="box-none">
			<View style={styles.footerInner}>
				<TouchableOpacity style={styles.footerItem} onPress={() => onPressTab('Home')}>
					<View style={[styles.iconBg, active === 'Home' && styles.iconBgActive]}>
						<Image source={require('../img/home.png')} style={[styles.footerIcon, active === 'Home' && styles.footerIconActive]} />
					</View>
					<Text style={[styles.footerLabel, active === 'Home' && styles.footerLabelActive]}>Home</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.footerItem} onPress={() => onPressTab('Cashback')}>
					<Image source={require('../img/feedbacktab.png')} style={styles.footerIcon} />
					<Text style={styles.footerLabel}>Cashback</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.footerItem} onPress={() => onPressTab('Refer')}>
					<Image source={require('../img/usersgroup.png')} style={styles.footerIcon} />
					<Text style={styles.footerLabel}>Refer</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.footerItem} onPress={() => onPressTab('Profile')}>
					<Image source={require('../img/proflie.png')} style={styles.footerIcon} />
					<Text style={styles.footerLabel}>Profile</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const Card = ({ title, image, onPress }) => (
	<View style={styles.cardWrap}>
		<TouchableOpacity activeOpacity={0.85} onPress={onPress}>
			<ImageBackground source={image} style={styles.cardImage} imageStyle={{ borderRadius: 8 }}>
				<View style={styles.cardTitleWrap}>
					<Text style={styles.cardTitle}>{title}</Text>
				</View>
			</ImageBackground>
		</TouchableOpacity>
	</View>
);


const PreviewHome = ({ navigation }) => {
	// Hide this preview design on guest pages
	try {
		const guestPages = ['Login', 'LoginPage', 'Splash', 'TermsofServicewithoutLog', 'PrivacyPolicywithoutLog'];
		if (navigationRef && typeof navigationRef.isReady === 'function' && navigationRef.isReady()) {
			const rootState = navigationRef.getRootState && navigationRef.getRootState();
			if (rootState) {
				let state = rootState;
				while (state) {
					const idx = typeof state.index === 'number' ? state.index : 0;
					const route = state.routes && state.routes[idx];
					if (!route) break;
					if (guestPages.includes(route.name)) return null;
					state = route.state;
				}
			}
		}
	} catch (e) {
	}

	const [activeTab, setActiveTab] = useState('Home');

	const cards = [
		{ key: 'intro1', title: 'Introduction I', image: require('../img/introductionone.jpg') },
		{ key: 'intro2', title: 'Introduction II', image: require('../img/introductiontwo.jpg') },
		{ key: 'intro3', title: 'Introduction III', image: require('../img/introductionthree.jpg') },
		{ key: 'intro4', title: 'Introduction IV', image: require('../img/introductionfour.jpg') },
		{ key: 'family', title: 'Family Time', image: require('../img/family-spending-time-together-living-room_23-2148717954.jpg') },
	];

	const onPressTab = (name) => {
		setActiveTab(name);
		if (name === 'Home') return;
		if (name === 'Cashback') navigation.navigate && navigation.navigate('Cashback for Feedback');
		if (name === 'Refer') navigation.navigate && navigation.navigate('Refer and Earn');
		if (name === 'Profile') navigation.navigate && navigation.navigate('My Profile');
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Home</Text>
			</View>
			<ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: footerHeight + 12 }]}>
				{cards.map((c) => (
					<Card key={c.key} title={c.title} image={c.image} onPress={() => navigation.navigate && navigation.navigate('VideoPlayerScreen')} />
				))}
                
			</ScrollView>

			<FooterTab active={activeTab} onPressTab={onPressTab} />
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: { width: '100%', flex: 1, backgroundColor: '#f6f6f6' },
	header: { height: 56, backgroundColor: '#1434A4', justifyContent: 'center', paddingLeft: 16 },
	headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
	scroll: { padding: CARD_MARGIN },
	cardWrap: { marginBottom: 14, backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', elevation: 2 },
	cardImage: { width: CARD_WIDTH, height: CARD_HEIGHT, justifyContent: 'flex-end' },
	cardTitleWrap: { backgroundColor: 'rgba(20,52,164,0.95)', paddingVertical: 14, alignItems: 'center' },
	cardTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
	footerWrap: {  width: '100%', position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center' },
	footerInner: { width: '100%', flexDirection: 'row', backgroundColor: '#888', height: footerHeight,
        borderRadius: 0, alignItems: 'center', justifyContent: 'space-around', 
        paddingHorizontal: 12, shadowColor: '#000', shadowOpacity: 0.04, 
        shadowRadius: 6, elevation: 4, borderTopWidth: 1, 
        borderTopColor: '#eee' },
	footerItem: { alignItems: 'center', justifyContent: 'center' },
	footerIcon: { width: footerIconSize, height: footerIconSize, tintColor: '#ffffff' },
	footerIconActive: { tintColor: '#fff' },
	footerLabel: { fontSize: footerFontSize, color: '#ffffff', marginTop: 6 },
	footerLabelActive: { color: '#1434A4', fontWeight: '700' },
	iconBg: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' },
	iconBgActive: { backgroundColor: '#1434A4' },
});

export default PreviewHome;
