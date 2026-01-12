import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Linking,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useAuthStore } from '../store/authStore';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../lib/constants';

interface DrawerItemProps {
  icon: string;
  label: string;
  onPress: () => void;
  badge?: number;
  danger?: boolean;
  index: number;
}

const DrawerItem: React.FC<DrawerItemProps> = ({ icon, label, onPress, badge, danger, index }) => {
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }],
      }}
    >
      <TouchableOpacity style={styles.drawerItem} onPress={onPress} activeOpacity={0.7}>
        <Text style={styles.drawerItemIcon}>{icon}</Text>
        <Text style={[styles.drawerItemLabel, danger && styles.dangerText]}>{label}</Text>
        {badge && badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function CustomDrawerContent(props: any) {
  const { navigation } = props;
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'क्या आप लॉगआउट करना चाहते हैं?',
      [
        { text: 'नहीं', style: 'cancel' },
        {
          text: 'हां',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const openYouTube = () => {
    Linking.openURL('https://www.youtube.com/@VSSCTOfficial');
  };

  const openWebsite = () => {
    Linking.openURL('https://vssct.com');
  };

  const openWhatsApp = () => {
    Linking.openURL('https://wa.me/919876543210?text=नमस्ते, मुझे VSSCT के बारे में जानकारी चाहिए');
  };

  const menuItems = [
    {
      icon: '🏠',
      label: 'होम',
      onPress: () => navigation.navigate('HomeTabs', { screen: 'Home' }),
    },
    {
      icon: '📅',
      label: 'कार्यक्रम',
      onPress: () => navigation.navigate('HomeTabs', { screen: 'Events' }),
    },
    {
      icon: '🔔',
      label: 'सूचनाएं',
      onPress: () => navigation.navigate('Notifications'),
      badge: 3,
    },
    {
      icon: '📖',
      label: 'प्रवचन',
      onPress: () => navigation.navigate('HomeTabs', { screen: 'Home' }),
    },
    {
      icon: '🎵',
      label: 'भजन',
      onPress: () => navigation.navigate('HomeTabs', { screen: 'Home' }),
    },
    {
      icon: '🎬',
      label: 'वीडियो',
      onPress: () => navigation.navigate('Videos'),
    },
    {
      icon: '💰',
      label: 'दान करें',
      onPress: () => navigation.navigate('Donation'),
    },
    {
      icon: '👤',
      label: 'प्रोफ़ाइल',
      onPress: () => navigation.navigate('HomeTabs', { screen: 'Profile' }),
    },
  ];

  const socialItems = [
    {
      icon: '▶️',
      label: 'YouTube Channel',
      onPress: openYouTube,
    },
    {
      icon: '🌐',
      label: 'वेबसाइट',
      onPress: openWebsite,
    },
    {
      icon: '💬',
      label: 'WhatsApp',
      onPress: openWhatsApp,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={styles.header}
      >
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://vssct.com/wp-content/uploads/2023/04/logo-for-web-vssct.png' }}
            style={styles.logo}
          />
        </View>
        <Text style={styles.orgName}>VSSCT</Text>
        <Text style={styles.orgTagline}>विजय संत संस्कृति चैरिटेबल ट्रस्ट</Text>
        
        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>
              {user?.name ? user.name[0].toUpperCase() : '🙏'}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user?.name || 'भक्त'}</Text>
            <Text style={styles.userPhone}>+91 {user?.phone}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Menu Items */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>मुख्य मेनू</Text>
          {menuItems.map((item, index) => (
            <DrawerItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              onPress={item.onPress}
              badge={item.badge}
              index={index}
            />
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>सोशल मीडिया</Text>
          {socialItems.map((item, index) => (
            <DrawerItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              onPress={item.onPress}
              index={menuItems.length + index}
            />
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <DrawerItem
            icon="🚪"
            label="लॉगआउट"
            onPress={handleLogout}
            danger
            index={menuItems.length + socialItems.length}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
          <Text style={styles.footerText}>Made with ❤️ for VSSCT</Text>
        </View>
      </DrawerContentScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    padding: 5,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.full,
  },
  orgName: {
    ...FONTS.h2,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  orgTagline: {
    ...FONTS.small,
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: SPACING.lg,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    width: '100%',
  },
  userAvatar: {
    width: 45,
    height: 45,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  userAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    ...FONTS.bodyMedium,
    color: COLORS.white,
  },
  userPhone: {
    ...FONTS.small,
    color: COLORS.white,
    opacity: 0.8,
  },
  scrollContent: {
    paddingTop: SPACING.md,
  },
  section: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  sectionTitle: {
    ...FONTS.caption,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.md,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.xs,
  },
  drawerItemIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  drawerItemLabel: {
    ...FONTS.body,
    color: COLORS.textPrimary,
    flex: 1,
  },
  dangerText: {
    color: COLORS.error,
  },
  badge: {
    backgroundColor: COLORS.error,
    borderRadius: RADIUS.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  badgeText: {
    ...FONTS.tiny,
    color: COLORS.white,
    fontWeight: '700',
  },
  chevron: {
    ...FONTS.h4,
    color: COLORS.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
  },
  footer: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  footerText: {
    ...FONTS.caption,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
});
