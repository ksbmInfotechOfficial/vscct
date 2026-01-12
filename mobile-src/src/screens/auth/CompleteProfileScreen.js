import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { userApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../lib/constants';

export default function CompleteProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    caste: '',
    street: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
  });
  
  const updateUser = useAuthStore((state) => state.updateUser);

  const genderOptions = [
    { value: 'male', label: 'Male', emoji: '👨' },
    { value: 'female', label: 'Female', emoji: '👩' },
    { value: 'other', label: 'Other', emoji: '🧑' },
  ];

  const handleSubmit = async () => {
    if (!form.name || !form.dateOfBirth || !form.gender || !form.city || !form.state) {
      Alert.alert('Required Fields', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await userApi.updateProfile({
        name: form.name,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        caste: form.caste,
        address: {
          street: form.street,
          city: form.city,
          district: form.district,
          state: form.state,
          pincode: form.pincode,
        },
      });
      
      await updateUser(response.data.data);
      navigation.replace('MainTabs');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, required, ...props }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={COLORS.textMuted}
        {...props}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            Help us personalize your experience
          </Text>
        </View>

        <View style={styles.card}>
          <InputField
            label="Full Name"
            required
            placeholder="Enter your name"
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
          />

          <InputField
            label="Date of Birth"
            required
            placeholder="DD/MM/YYYY"
            value={form.dateOfBirth}
            onChangeText={(text) => setForm({ ...form, dateOfBirth: text })}
            keyboardType="numeric"
          />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Gender <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.genderContainer}>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.genderButton,
                    form.gender === option.value && styles.genderButtonActive,
                  ]}
                  onPress={() => setForm({ ...form, gender: option.value })}
                >
                  <Text style={styles.genderEmoji}>{option.emoji}</Text>
                  <Text
                    style={[
                      styles.genderLabel,
                      form.gender === option.value && styles.genderLabelActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <InputField
            label="Caste"
            placeholder="Enter your caste (optional)"
            value={form.caste}
            onChangeText={(text) => setForm({ ...form, caste: text })}
          />

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Address</Text>

          <InputField
            label="Street Address"
            placeholder="House/Building, Street"
            value={form.street}
            onChangeText={(text) => setForm({ ...form, street: text })}
          />

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <InputField
                label="City"
                required
                placeholder="City"
                value={form.city}
                onChangeText={(text) => setForm({ ...form, city: text })}
              />
            </View>
            <View style={styles.halfInput}>
              <InputField
                label="District"
                placeholder="District"
                value={form.district}
                onChangeText={(text) => setForm({ ...form, district: text })}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <InputField
                label="State"
                required
                placeholder="State"
                value={form.state}
                onChangeText={(text) => setForm({ ...form, state: text })}
              />
            </View>
            <View style={styles.halfInput}>
              <InputField
                label="Pincode"
                placeholder="Pincode"
                value={form.pincode}
                onChangeText={(text) => setForm({ ...form, pincode: text })}
                keyboardType="numeric"
                maxLength={6}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Complete Profile</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : SPACING.xl,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    ...FONTS.smallMedium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  required: {
    color: COLORS.error,
  },
  input: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    ...FONTS.body,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    gap: SPACING.xs,
  },
  genderButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  genderEmoji: {
    fontSize: 18,
  },
  genderLabel: {
    ...FONTS.smallMedium,
    color: COLORS.textSecondary,
  },
  genderLabelActive: {
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.lg,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  halfInput: {
    flex: 1,
  },
  submitButton: {
    marginTop: SPACING.lg,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
  },
  gradientButton: {
    paddingVertical: SPACING.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    ...FONTS.bodySemiBold,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
});
