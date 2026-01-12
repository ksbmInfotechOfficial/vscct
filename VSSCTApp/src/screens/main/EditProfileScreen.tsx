import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { userApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../lib/constants';

const GENDERS = [
  { value: 'male', label: '👨 पुरुष', labelEn: 'Male' },
  { value: 'female', label: '👩 महिला', labelEn: 'Female' },
  { value: 'other', label: '🧑 अन्य', labelEn: 'Other' },
];

export default function EditProfileScreen({ navigation }) {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  
  const [name, setName] = useState(user?.name || '');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState(user?.gender || '');
  const [caste, setCaste] = useState(user?.caste || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [district, setDistrict] = useState(user?.address?.district || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [pincode, setPincode] = useState(user?.address?.pincode || '');
  const [loading, setLoading] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Format existing date of birth
    if (user?.dateOfBirth) {
      const date = new Date(user.dateOfBirth);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      setDateOfBirth(`${day}/${month}/${year}`);
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const formatDateInput = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = '';
    
    if (cleaned.length > 0) {
      formatted = cleaned.substring(0, 2);
    }
    if (cleaned.length > 2) {
      formatted += '/' + cleaned.substring(2, 4);
    }
    if (cleaned.length > 4) {
      formatted += '/' + cleaned.substring(4, 8);
    }
    
    setDateOfBirth(formatted);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('त्रुटि', 'कृपया अपना नाम दर्ज करें');
      return;
    }

    if (!gender) {
      Alert.alert('त्रुटि', 'कृपया अपना लिंग चुनें');
      return;
    }

    setLoading(true);

    try {
      const response = await userApi.updateProfile({
        name: name.trim(),
        dateOfBirth,
        gender,
        caste: caste.trim(),
        address: {
          street: street.trim(),
          city: city.trim(),
          district: district.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
        },
      });

      if (response.data.success) {
        await updateUser(response.data.data);
        Alert.alert('सफल', 'प्रोफ़ाइल अपडेट हो गई', [
          { text: 'ठीक है', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('त्रुटि', 'प्रोफ़ाइल अपडेट करने में समस्या हुई');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, value, onChangeText, placeholder, keyboardType, maxLength }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
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
        <Text style={styles.headerTitle}>प्रोफ़ाइल संपादित करें</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.ScrollView
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Basic Info */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>मूल जानकारी</Text>
            
            <InputField
              label="नाम *"
              value={name}
              onChangeText={setName}
              placeholder="अपना पूरा नाम दर्ज करें"
            />

            <InputField
              label="जन्म तिथि"
              value={dateOfBirth}
              onChangeText={formatDateInput}
              placeholder="DD/MM/YYYY"
              keyboardType="numeric"
              maxLength={10}
            />

            {/* Gender Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>लिंग *</Text>
              <View style={styles.genderContainer}>
                {GENDERS.map((g) => (
                  <TouchableOpacity
                    key={g.value}
                    style={[
                      styles.genderButton,
                      gender === g.value && styles.genderButtonActive,
                    ]}
                    onPress={() => setGender(g.value)}
                  >
                    <Text style={[
                      styles.genderText,
                      gender === g.value && styles.genderTextActive,
                    ]}>
                      {g.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <InputField
              label="जाति"
              value={caste}
              onChangeText={setCaste}
              placeholder="जाति दर्ज करें (वैकल्पिक)"
            />
          </View>

          {/* Address */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>पता</Text>
            
            <InputField
              label="गली/मोहल्ला"
              value={street}
              onChangeText={setStreet}
              placeholder="गली या मोहल्ला"
            />

            <InputField
              label="शहर"
              value={city}
              onChangeText={setCity}
              placeholder="शहर का नाम"
            />

            <InputField
              label="जिला"
              value={district}
              onChangeText={setDistrict}
              placeholder="जिला"
            />

            <InputField
              label="राज्य"
              value={state}
              onChangeText={setState}
              placeholder="राज्य"
            />

            <InputField
              label="पिनकोड"
              value={pincode}
              onChangeText={setPincode}
              placeholder="पिनकोड"
              keyboardType="numeric"
              maxLength={6}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryDark]}
              style={styles.saveGradient}
            >
              <Text style={styles.saveText}>
                {loading ? 'सेव हो रहा है...' : '💾 सेव करें'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ height: 50 }} />
        </Animated.ScrollView>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  card: {
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
  inputGroup: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    ...FONTS.small,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  textInput: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    ...FONTS.body,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  genderButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.borderLight,
  },
  genderButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '15',
  },
  genderText: {
    ...FONTS.small,
    color: COLORS.textSecondary,
  },
  genderTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  saveButton: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.primary,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveGradient: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  saveText: {
    ...FONTS.bodyMedium,
    color: COLORS.white,
  },
});
