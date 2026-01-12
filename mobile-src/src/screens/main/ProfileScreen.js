import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { userApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../lib/constants';

export default function ProfileScreen({ navigation }) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const MenuItem = ({ icon, label, onPress, danger }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={[styles.menuLabel, danger && styles.dangerText]}>{label}</Text>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );

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
            <Text style={styles.completeBadgeText}>✓ Profile Complete</Text>
          </View>
        )}
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date of Birth</Text>
            <Text style={styles.infoValue}>{formatDate(user?.dateOfBirth)}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>
              {user?.gender === 'male' ? '👨 Male' : 
               user?.gender === 'female' ? '👩 Female' : 
               user?.gender === 'other' ? '🧑 Other' : '-'}
            </Text>
          </View>

          {user?.caste && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Caste</Text>
              <Text style={styles.infoValue}>{user.caste}</Text>
            </View>
          )}
        </View>

        {user?.address && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Address</Text>
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
          <MenuItem icon="✏️" label="Edit Profile" onPress={() => {}} />
          <MenuItem icon="🔔" label="Notifications" onPress={() => {}} />
          <MenuItem icon="🌐" label="Language" onPress={() => {}} />
          <MenuItem icon="📞" label="Contact Us" onPress={() => {}} />
          <MenuItem icon="ℹ️" label="About VSSCT" onPress={() => {}} />
        </View>

        <View style={styles.menuCard}>
          <MenuItem icon="🚪" label="Logout" onPress={handleLogout} danger />
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
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
    alignItems: 'center',
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary,
  },
  userName: {
    ...FONTS.h3,
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
  cardTitle: {
    ...FONTS.bodyMedium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
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
    fontSize: 18,
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
