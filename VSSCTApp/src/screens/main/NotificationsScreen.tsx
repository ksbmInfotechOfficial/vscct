import React, { useState, useEffect, useRef, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Animated,
  Linking,
  RefreshControl,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../lib/constants';

interface Notification {
  id: string;
  title: string;
  body: string;
  data?: {
    type?: string;
    url?: string;
    postId?: string;
  };
  createdAt: Date;
  read: boolean;
}

// Mock notifications - will be replaced with actual FCM notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: '🙏 आज का प्रवचन',
    body: 'श्री महाराज जी का आज का विशेष प्रवचन अब उपलब्ध है। अभी सुनें।',
    data: { type: 'video', url: 'https://youtube.com/@DevkinandanThakurJiMaharaj' },
    createdAt: new Date(),
    read: false,
  },
  {
    id: '2',
    title: '📅 कार्यक्रम की सूचना',
    body: 'कल शाम 6 बजे विशेष भजन संध्या का आयोजन है।',
    data: { type: 'info' },
    createdAt: new Date(Date.now() - 86400000),
    read: false,
  },
  {
    id: '3',
    title: '🎵 नया भजन',
    body: 'नया भजन "राधे राधे" अब उपलब्ध है।',
    data: { type: 'video', url: 'https://youtube.com/watch?v=example' },
    createdAt: new Date(Date.now() - 172800000),
    read: true,
  },
  {
    id: '4',
    title: '🙏 दान का अवसर',
    body: 'मंदिर निर्माण में सहयोग करें। अभी दान करें।',
    data: { type: 'donation' },
    createdAt: new Date(Date.now() - 259200000),
    read: true,
  },
];

// Notification Item Component - moved outside to fix hooks issue
const NotificationItem = memo(({ 
  item, 
  index, 
  onPress, 
  formatTime 
}: { 
  item: Notification; 
  index: number; 
  onPress: (item: Notification) => void;
  formatTime: (date: Date) => string;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.notificationContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.notificationCard,
          !item.read && styles.unreadCard,
        ]}
        activeOpacity={0.8}
        onPress={() => onPress(item)}
      >
        {!item.read && <View style={styles.unreadDot} />}
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationBody} numberOfLines={2}>
            {item.body}
          </Text>
          <Text style={styles.notificationTime}>{formatTime(item.createdAt)}</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [refreshing, setRefreshing] = useState(false);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleNotificationPress = (notification: Notification) => {
    markAsRead(notification.id);
    
    const { data } = notification;
    if (!data) {
      Alert.alert('सूचना', notification.body);
      return;
    }

    try {
      switch (data.type) {
        case 'post':
          navigation.navigate('PostDetail', { 
            post: { 
              id: data.postId, 
              title: notification.title,
              content: notification.body 
            } 
          });
          break;
        case 'video':
        case 'url':
          if (data.url) {
            if (data.url.includes('youtube.com') || data.url.includes('youtu.be')) {
              navigation.navigate('YouTubePlayer', { url: data.url, title: notification.title });
            } else {
              Linking.openURL(data.url);
            }
          }
          break;
        case 'donation':
          navigation.navigate('Donation');
          break;
        case 'info':
        default:
          Alert.alert(notification.title, notification.body);
          break;
      }
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'कुछ गलत हो गया');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'अभी';
    if (minutes < 60) return `${minutes} मिनट पहले`;
    if (hours < 24) return `${hours} घंटे पहले`;
    if (days < 7) return `${days} दिन पहले`;
    return date.toLocaleDateString('hi-IN');
  };

  const renderNotification = ({ item, index }: { item: Notification; index: number }) => (
    <NotificationItem 
      item={item} 
      index={index} 
      onPress={handleNotificationPress}
      formatTime={formatTime}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🔔</Text>
      <Text style={styles.emptyTitle}>कोई सूचना नहीं</Text>
      <Text style={styles.emptyText}>
        नई सूचनाएं यहां दिखाई जाएंगी
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>सूचनाएं</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: COLORS.white,
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.white,
  },
  placeholder: {
    width: 40,
  },
  listContent: {
    padding: SPACING.lg,
    paddingTop: SPACING.md,
  },
  notificationContainer: {
    marginBottom: SPACING.md,
  },
  notificationCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  unreadCard: {
    backgroundColor: COLORS.primaryLight + '08',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    marginRight: SPACING.sm,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    ...FONTS.bodyMedium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  notificationBody: {
    ...FONTS.small,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  notificationTime: {
    ...FONTS.caption,
    color: COLORS.textMuted,
  },
  chevron: {
    ...FONTS.h2,
    color: COLORS.textMuted,
    marginLeft: SPACING.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
