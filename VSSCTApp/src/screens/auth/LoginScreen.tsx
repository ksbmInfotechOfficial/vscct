import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { authApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../lib/constants';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState('phone');
  const [loading, setLoading] = useState(false);
  const [otpPreview, setOtpPreview] = useState('');
  const [countdown, setCountdown] = useState(0);
  
  const otpRefs = useRef([]);
  const setAuth = useAuthStore((state) => state.setAuth);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const cardSlide = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(cardSlide, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (otpPreview && step === 'otp') {
      const otpDigits = otpPreview.split('');
      setOtp(otpDigits.length === 6 ? otpDigits : ['', '', '', '', '', '']);
    }
  }, [otpPreview, step]);

  const animateStepChange = () => {
    slideAnim.setValue(50);
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handleSendOtp = async () => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.sendOtp(cleanPhone);
      const preview = response?.data?.data?.otp;
      setOtpPreview(preview || '');
      setStep('otp');
      setCountdown(30);
      animateStepChange();
      setTimeout(() => otpRefs.current[0]?.focus(), 300);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(d => d) && newOtp.join('').length === 6) {
      setTimeout(() => handleVerifyOtp(newOtp.join('')), 100);
    }
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (otpCode) => {
    const code = otpCode || otp.join('');
    if (code.length !== 6) {
      Alert.alert('Error', 'Please enter complete 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const response = await authApi.verifyOtp(cleanPhone, code);
      const { user, accessToken, refreshToken, isNewUser } = response.data.data;
      
      await setAuth(user, accessToken, refreshToken);
      
      // Navigation handled by AppNavigator based on authStore
      if (isNewUser || !user.isProfileComplete) {
        // Will auto-navigate via AppNavigator
      }
    } catch (error) {
      Alert.alert('Verification Failed', error.response?.data?.message || 'Invalid OTP');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const renderPhoneStep = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.stepTitle}>Welcome to VSSCT</Text>
      <Text style={styles.stepSubtitle}>Enter your mobile number to continue</Text>
      
      <View style={styles.phoneInputContainer}>
        <View style={styles.countryCodeBox}>
          <Text style={styles.flag}>🇮🇳</Text>
          <Text style={styles.countryCode}>+91</Text>
        </View>
        <TextInput
          style={styles.phoneInput}
          placeholder="Mobile Number"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="phone-pad"
          maxLength={10}
          value={phone}
          onChangeText={setPhone}
          autoFocus
        />
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.buttonDisabled]}
        onPress={handleSendOtp}
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
            <Text style={styles.buttonText}>Get OTP</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        By continuing, you agree to our Terms of Service and Privacy Policy
      </Text>
    </Animated.View>
  );

  const renderOtpStep = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.stepTitle}>Verify OTP</Text>
      <Text style={styles.stepSubtitle}>
        Enter the 6-digit code sent to{'\n'}
        <Text style={styles.phoneHighlight}>+91 {phone}</Text>
      </Text>

      {otpPreview ? (
        <View style={styles.otpPreviewBadge}>
          <Text style={styles.otpPreviewLabel}>🔐 Dev OTP</Text>
          <Text style={styles.otpPreviewValue}>{otpPreview}</Text>
        </View>
      ) : null}

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => otpRefs.current[index] = ref}
            style={[styles.otpBox, digit && styles.otpBoxFilled]}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={(e) => handleOtpKeyPress(e, index)}
            selectTextOnFocus
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.buttonDisabled]}
        onPress={() => handleVerifyOtp()}
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
            <Text style={styles.buttonText}>Verify & Continue</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.resendContainer}>
        {countdown > 0 ? (
          <Text style={styles.countdownText}>Resend OTP in {countdown}s</Text>
        ) : (
          <TouchableOpacity onPress={handleSendOtp}>
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.changePhoneButton}
        onPress={() => {
          setStep('phone');
          setOtp(['', '', '', '', '', '']);
          setOtpPreview('');
          animateStepChange();
        }}
      >
        <Text style={styles.changePhoneText}>← Change Phone Number</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <View style={styles.bgPattern}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.logoSection, { opacity: fadeAnim, transform: [{ scale: logoScale }] }]}>
            <View style={styles.logoWrapper}>
              <Image
                source={{ uri: 'https://vssct.com/wp-content/uploads/2023/04/logo-for-web-vssct.png' }}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.brandName}>VSSCT</Text>
            <Text style={styles.brandTagline}>विश्व शांति सेवा चेरिटेबल ट्रस्ट</Text>
          </Animated.View>

          <Animated.View style={[styles.card, { transform: [{ translateY: cardSlide }] }]}>
            {step === 'phone' ? renderPhoneStep() : renderOtpStep()}
          </Animated.View>
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
  bgPattern: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.08,
  },
  circle1: {
    width: 300,
    height: 300,
    backgroundColor: COLORS.primary,
    top: -100,
    right: -80,
  },
  circle2: {
    width: 200,
    height: 200,
    backgroundColor: COLORS.accent,
    bottom: 100,
    left: -60,
  },
  circle3: {
    width: 150,
    height: 150,
    backgroundColor: COLORS.gradientEnd,
    top: height * 0.4,
    right: -50,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: SPACING.xl,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.lg,
    marginBottom: SPACING.md,
  },
  logo: {
    width: 70,
    height: 70,
  },
  brandName: {
    ...FONTS.h1,
    color: COLORS.primary,
    letterSpacing: 2,
  },
  brandTagline: {
    ...FONTS.small,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.lg,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepTitle: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  stepSubtitle: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 24,
  },
  phoneHighlight: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: SPACING.lg,
  },
  countryCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  flag: {
    fontSize: 20,
    marginRight: SPACING.xs,
  },
  countryCode: {
    ...FONTS.bodyMedium,
    color: COLORS.textPrimary,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    ...FONTS.h4,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    letterSpacing: 2,
  },
  primaryButton: {
    width: '100%',
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  gradientButton: {
    paddingVertical: SPACING.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    ...FONTS.bodySemiBold,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  disclaimer: {
    ...FONTS.caption,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingHorizontal: SPACING.md,
  },
  otpPreviewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warningLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.warning,
  },
  otpPreviewLabel: {
    ...FONTS.captionMedium,
    color: COLORS.warning,
    marginRight: SPACING.sm,
  },
  otpPreviewValue: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    letterSpacing: 4,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.xs,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceAlt,
    textAlign: 'center',
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
  otpBoxFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  resendContainer: {
    marginBottom: SPACING.md,
  },
  countdownText: {
    ...FONTS.small,
    color: COLORS.textMuted,
  },
  resendText: {
    ...FONTS.smallMedium,
    color: COLORS.primary,
  },
  changePhoneButton: {
    paddingVertical: SPACING.sm,
  },
  changePhoneText: {
    ...FONTS.smallMedium,
    color: COLORS.textSecondary,
  },
});
