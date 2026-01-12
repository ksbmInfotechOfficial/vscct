import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Animated,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { userApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../lib/constants';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [refreshing, setRefreshing] = useState(false);

  // Animations
  const headerScale = useRef(new Animated.Value(0.9)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(50)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fetch profile on mount
    fetchProfile();
    
    Animated.parallel([
      Animated.spring(headerScale, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(contentSlide, {
        toValue: 0,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userApi.getProfile();
      if (response.data.data) {
        await updateUser(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfile();
  };

  const handleLogout = () => {
    Alert.alert(
      'लॉगआउट',
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

  const MenuItem = ({ icon, label, onPress, danger, index }) => {
    const itemScale = useRef(new Animated.Value(0.9)).current;
    const itemOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
    // Fetch profile on mount
    fetchProfile();
    
      Animated.parallel([
        Animated.spring(itemScale, {
          toValue: 1,
          friction: 8,
          delay: 300 + index * 50,
          useNativeDriver: true,
        }),
        Animated.timing(itemOpacity, {
          toValue: 1,
          duration: 300,
          delay: 300 + index * 50,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    const handlePress = () => {
      Animated.sequence([
        Animated.timing(itemScale, {
          toValue: 0.95,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.spring(itemScale, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
      onPress?.();
    };

    return (
      <Animated.View
        style={{
          transform: [{ scale: itemScale }],
          opacity: itemOpacity,
        }}
      >
        <TouchableOpacity style={styles.menuItem} onPress={handlePress} activeOpacity={0.7}>
          <Text style={styles.menuIcon}>{icon}</Text>
          <Text style={[styles.menuLabel, danger && styles.dangerText]}>{label}</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <Animated.View
        style={[
          styles.headerContainer,
          {
            transform: [{ scale: headerScale }],
            opacity: headerOpacity,
          },
        ]}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          style={styles.header}
        >
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name[0].toUpperCase() : '🙏'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userPhone}>+91 {user?.phone}</Text>
          
          {user?.isProfileComplete && (
            <View style={styles.completeBadge}>
              <Text style={styles.completeBadgeText}>✓ प्रोफ़ाइल पूर्ण</Text>
            </View>
          )}
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        style={[
          styles.content,
          {
            transform: [{ translateY: contentSlide }],
            opacity: contentOpacity,
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>व्यक्तिगत जानकारी</Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Text style={styles.editButtonText}>✏️ संपादित करें</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>जन्म तिथि</Text>
            <Text style={styles.infoValue}>{formatDate(user?.dateOfBirth)}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>लिंग</Text>
            <Text style={styles.infoValue}>
              {user?.gender === 'male' ? '👨 पुरुष' : 
               user?.gender === 'female' ? '👩 महिला' : 
               user?.gender === 'other' ? '🧑 अन्य' : '-'}
            </Text>
          </View>

          {user?.caste && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>जाति</Text>
              <Text style={styles.infoValue}>{user.caste}</Text>
            </View>
          )}
        </View>

        {user?.address && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>पता</Text>
            <Text style={styles.addressText}>
              {[
                user.address.street,
                user.address.city,
                user.address.district,
                user.address.state,
                user.address.pincode,
              ].filter(Boolean).join(', ')}
            </Text>
          </View>
        )}

        <View style={styles.menuCard}>
          <MenuItem icon="🔔" label="सूचनाएं" onPress={() => navigation.navigate('Notifications')} index={0} />
          <MenuItem icon="💰" label="दान करें" onPress={() => navigation.navigate('Donation')} index={1} />
          <MenuItem icon="🌐" label="भाषा" onPress={() => {}} index={2} />
          <MenuItem icon="📞" label="संपर्क करें" onPress={() => {}} index={3} />
          <MenuItem icon="ℹ️" label="VSSCT के बारे में" onPress={() => {}} index={4} />
        </View>

        <View style={styles.menuCard}>
          <MenuItem icon="🚪" label="लॉगआउट" onPress={handleLogout} danger index={5} />
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    zIndex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: SPACING.xl,
    alignItems: 'center',
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.lg,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.primary,
  },
  userName: {
    ...FONTS.h2,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  userPhone: {
    ...FONTS.body,
    color: COLORS.white,
    opacity: 0.9,
  },
  completeBadge: {
    marginTop: SPACING.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  completeBadgeText: {
    ...FONTS.captionMedium,
    color: COLORS.white,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    marginTop: -SPACING.md,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cardTitle: {
    ...FONTS.bodyMedium,
    color: COLORS.textPrimary,
  },
  editButton: {
    backgroundColor: COLORS.primaryLight + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  editButtonText: {
    ...FONTS.caption,
    color: COLORS.primary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  infoLabel: {
    ...FONTS.small,
    color: COLORS.textSecondary,
  },
  infoValue: {
    ...FONTS.smallMedium,
    color: COLORS.textPrimary,
  },
  addressText: {
    ...FONTS.small,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  menuCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  menuLabel: {
    ...FONTS.body,
    color: COLORS.textPrimary,
    flex: 1,
  },
  menuArrow: {
    ...FONTS.h3,
    color: COLORS.textMuted,
  },
  dangerText: {
    color: COLORS.error,
  },
  version: {
    ...FONTS.caption,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginVertical: SPACING.lg,
  },
});
