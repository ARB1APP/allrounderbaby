import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { format } from 'date-fns';

const lightThemeColors = {
  screenBackground: '#dfe6ff',
  cardBackground: '#ffffff',
  cardBorder: 'transparent',
  textPrimary: '#000000',
  textSecondary: '#333333',
  inputBackground: '#ffffff',
  inputBorderColor: '#ced4da',
  inputText: '#333333',
  inputPlaceholderText: '#999999',
  buttonBackground: 'rgba(20, 52, 164, 1)',
  buttonTextColor: '#ffffff',
  shadowColor: '#000000',
  shadowOpacity: 0.15,
  shadowRadius: 3,
  elevation: 4,
  statusBarContent: 'light-content',

};

const darkThemeColors = {
  screenBackground: '#121212',
  cardBackground: '#1E1E1E',
  cardBorder: '#3A3A3A',
  textPrimary: '#E0E0E0',
  textSecondary: '#B0B0B0',
  inputBackground: '#2C2C2C',
  inputBorderColor: '#4A4A4A',
  inputText: '#E0E0E0',
  inputPlaceholderText: '#777777',
  buttonBackground: 'rgba(30, 62, 174, 1)',
  buttonTextColor: '#FFFFFF',
  shadowColor: '#000000',
  shadowOpacity: 0.3,
  shadowRadius: 5,
  elevation: 0,
  statusBarContent: 'light-content',
};

const createMyOrdersStyles = (theme) => StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: theme.screenBackground,
  },
  container: {
    flex: 1,
    backgroundColor: theme.screenBackground,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  headerRow: {
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.textPrimary,
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: theme.inputBackground,
    borderColor: theme.inputBorderColor,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: theme.inputText,
    marginRight: 10,
  },
  filterButton: {
    width: 110,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.inputBorderColor,
    backgroundColor: theme.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterText: {
    color: theme.inputText,
  },
  ordersList: {
    paddingHorizontal: 15,
  },
  orderCard: {
    backgroundColor: theme.cardBackground,
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    elevation: theme.elevation,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: theme.shadowOpacity,
    shadowRadius: theme.shadowRadius,
    borderColor: theme.cardBorder,
    borderWidth: Platform.OS === 'android' && theme.elevation === 0 ? 1 : 0,
  },
  orderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderIdText: {
    fontWeight: '700',
    color: theme.textPrimary,
  },
  placedDateText: {
    color: theme.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
  },
  statusText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.inputBorderColor,
  },
  productImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#e9eef8',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontWeight: '600',
    color: theme.textPrimary,
  },
  productQty: {
    color: theme.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  productPrice: {
    fontWeight: '700',
    color: theme.textPrimary,
  },
  orderFooter: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  invoiceText: {
    color: theme.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    flexShrink: 0,
    marginTop: 6,
  },
  ghostButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  primaryButton: {
    backgroundColor: theme.buttonBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  ghostButtonText: { color: '#fff', fontWeight: '700' },
  primaryButtonText: { color: theme.buttonTextColor, fontWeight: '700' },
});

const MyOrders = ({ navigation, route }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkThemeColors : lightThemeColors;
  const styles = createMyOrdersStyles(theme);
  const [query, setQuery] = useState('');

  const sampleOrders = [
    {
      id: 'ORD12345',
      placedOn: new Date(2024, 2, 15),
      status: 'Delivered',
      statusColor: '#2dbb6e',
      items: [
        { id: 'p1', name: 'Intelligent Baby Kit', qty: 1, price: 8000 },
      ],
    },
  ];

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
    return () => backHandler.remove();
  }, [navigation]);

  const renderStatus = (status, color) => (
    <View style={[styles.statusBadge, { backgroundColor: color || '#6c757d' }]}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );

  const OrderCard = ({ order }) => {
    const total = order.items.reduce((s, it) => s + it.price * it.qty, 0);
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeaderRow}>
          <View>
            <Text style={styles.orderIdText}>Order ID: #{order.id}</Text>
            <Text style={styles.placedDateText}>Placed on: {format(order.placedOn, 'dd MMM yyyy')}</Text>
          </View>
          {renderStatus(order.status, order.statusColor)}
        </View>

        {order.items.map((it) => (
          <View key={it.id} style={styles.productRow}>
            <Image source={{ uri: 'https://via.placeholder.com/80' }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{it.name}</Text>
              <Text style={styles.productQty}>Qty: {it.qty}</Text>
            </View>
            <Text style={styles.productPrice}>
              ₹{(it.price * it.qty).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
          </View>
        ))}

        <View style={styles.orderFooter}>
          <Text style={styles.invoiceText}>Order Total: ₹{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.ghostButton} onPress={() => { /* view invoice */ }}>
              <Text style={styles.ghostButtonText}>View Invoice</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={() => { /* leave review */ }}>
              <Text style={styles.primaryButtonText}>Leave a Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingContainer}>
      <StatusBar barStyle={theme.statusBarContent} backgroundColor={theme.screenBackground} />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={[{ paddingLeft: 8, paddingRight: 7 }]}>
            <View style={styles.headerRow}>
              <Text style={styles.sectionTitle}>My Orders</Text>
            </View>

            <View style={styles.searchRow}>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search by Order ID or Product Name..."
                placeholderTextColor={theme.inputPlaceholderText}
                style={styles.searchInput}
              />
              <TouchableOpacity style={styles.filterButton} onPress={() => { /* open filter */ }}>
                <Text style={styles.filterText}>All Orders</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.ordersList}>
              {sampleOrders.filter(o => {
                if (!query) {return true;}
                const q = query.toLowerCase();
                if (o.id.toLowerCase().includes(q)) {return true;}
                return o.items.some(i => i.name.toLowerCase().includes(q));
              }).map(o => (
                <OrderCard key={o.id} order={o} />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MyOrders;
