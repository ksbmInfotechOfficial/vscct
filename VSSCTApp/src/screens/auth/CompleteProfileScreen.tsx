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
  KeyboardAvoidingView,
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

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>
              Help us personalize your experience
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Full Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={COLORS.textMuted}
                value={form.name}
                onChangeText={(text) => handleInputChange('name', text)}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Date of Birth <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={COLORS.textMuted}
                value={form.dateOfBirth}
                onChangeText={(text) => handleInputChange('dateOfBirth', text)}
                keyboardType="numeric"
                maxLength={10}
                returnKeyType="next"
              />
            </View>

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
                    onPress={() => handleInputChange('gender', option.value)}
                    activeOpacity={0.7}
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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Caste</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your caste (optional)"
                placeholderTextColor={COLORS.textMuted}
                value={form.caste}
                onChangeText={(text) => handleInputChange('caste', text)}
                returnKeyType="next"
              />
            </View>

            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Address</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Street Address</Text>
              <TextInput
                style={styles.input}
                placeholder="House/Building, Street"
                placeholderTextColor={COLORS.textMuted}
                value={form.street}
                onChangeText={(text) => handleInputChange('street', text)}
                returnKeyType="next"
              />
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    City <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="City"
                    placeholderTextColor={COLORS.textMuted}
                    value={form.city}
                    onChangeText={(text) => handleInputChange('city', text)}
                    returnKeyType="next"
                  />
                </View>
              </View>
              <View style={styles.halfInput}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>District</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="District"
                    placeholderTextColor={COLORS.textMuted}
                    value={form.district}
                    onChangeText={(text) => handleInputChange('district', text)}
                    returnKeyType="next"
                  />
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    State <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="State"
                    placeholderTextColor={COLORS.textMuted}
                    value={form.state}
                    onChangeText={(text) => handleInputChange('state', text)}
                    returnKeyType="next"
                  />
                </View>
              </View>
              <View style={styles.halfInput}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Pincode</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Pincode"
                    placeholderTextColor={COLORS.textMuted}
                    value={form.pincode}
                    onChangeText={(text) => handleInputChange('pincode', text)}
                    keyboardType="numeric"
                    maxLength={6}
                    returnKeyType="done"
                  />
                </View>
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
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : SPACING.xl,
    paddingBottom: 40,
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
    minHeight: 48,
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
