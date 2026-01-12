import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  TextInput,
  Alert,
  Linking,
  Share,
  Dimensions,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../lib/constants';

const { width } = Dimensions.get('window');

const DONATION_AMOUNTS = [101, 251, 501, 1001, 2501, 5001, 11001, 21001];

// India Bank Details
const INDIA_BANKS = [
  {
    id: 'icici',
    name: 'ICICI Bank',
    icon: '🏦',
    accountName: 'Vishwa Shanti Sewa Charitable Trust',
    accountNo: '101701001038',
    ifsc: 'ICIC0001017',
    branch: 'ICICI Bank, Vrindavan, Mathura',
    upiId: 'vssct1@icici',
  },
  {
    id: 'sbi',
    name: 'State Bank of India',
    icon: '🏛️',
    accountName: 'Vishwa Shanti Sewa Charitable Trust',
    accountNo: '30880944453',
    ifsc: 'SBIN0006530',
    branch: 'Mandi Yard, Mathura (U.P.)',
  },
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    icon: '💳',
    accountName: 'Vishwa Shanti Sewa Charitable Trust',
    accountNo: '02687620000048',
    ifsc: 'HDFC0000268',
    branch: 'Opp. BSA College, Gaushala Road, Mathura (UP)',
  },
];

// International (FCRA) Bank Details
const INTERNATIONAL_BANK = {
  name: 'State Bank of India (FCRA)',
  icon: '🌍',
  accountName: 'Vishwa Shanti Sewa Charitable Trust',
  accountNo: '40073064483',
  branchCode: '00691',
  ifsc: 'SBIN0000691',
  branch: 'FCRA Cell, 4th Floor, State Bank of India, New Delhi Main Branch, 11, Sansad Marg, New Delhi-110001',
};

const UPI_ID = 'vssct1@icici';

export default function DonationScreen({ navigation }) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'india' | 'international'>('india');
  const [expandedBank, setExpandedBank] = useState<string | null>('icici');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const tabAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.timing(tabAnim, {
      toValue: activeTab === 'india' ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [activeTab]);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const getFinalAmount = () => {
    if (customAmount) return parseInt(customAmount) || 0;
    return selectedAmount || 0;
  };

  const handleUPIPayment = () => {
    const amount = getFinalAmount();
    if (amount < 1) {
      Alert.alert('राशि चुनें', 'कृपया दान की राशि चुनें');
      return;
    }

    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=VSSCT Trust&am=${amount}&cu=INR&tn=Donation to VSSCT`;
    
    Linking.canOpenURL(upiUrl).then(supported => {
      if (supported) {
        Linking.openURL(upiUrl);
      } else {
        Alert.alert(
          'UPI App नहीं मिला',
          'कृपया कोई UPI app इंस्टॉल करें (GPay, PhonePe, Paytm)',
        );
      }
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    Clipboard.setString(text);
    Alert.alert('✅ कॉपी हो गया', `${label} कॉपी हो गया`);
  };

  const handleShare = async () => {
    const bankInfo = activeTab === 'india' 
      ? INDIA_BANKS.map(bank => 
          `${bank.name}\nA/C: ${bank.accountNo}\nIFSC: ${bank.ifsc}\n${bank.upiId ? `UPI: ${bank.upiId}` : ''}`
        ).join('\n\n')
      : `${INTERNATIONAL_BANK.name}\nA/C: ${INTERNATIONAL_BANK.accountNo}\nIFSC: ${INTERNATIONAL_BANK.ifsc}`;
    
    try {
      await Share.share({
        message: `🙏 VSSCT Trust को दान करें\n\n${bankInfo}\n\nDonate to support religious activities.`,
        title: 'VSSCT Donation Details',
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const AmountButton = ({ amount }: { amount: number }) => {
    const isSelected = selectedAmount === amount;
    const buttonScale = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 0.95,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.spring(buttonScale, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
      handleAmountSelect(amount);
    };

    return (
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          style={[styles.amountButton, isSelected && styles.amountButtonSelected]}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Text style={[styles.amountText, isSelected && styles.amountTextSelected]}>
            ₹{amount.toLocaleString('en-IN')}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const BankCard = ({ bank, expanded, onToggle }) => {
    return (
      <View style={styles.bankCard}>
        <TouchableOpacity 
          style={styles.bankHeader}
          onPress={onToggle}
          activeOpacity={0.7}
        >
          <View style={styles.bankHeaderLeft}>
            <Text style={styles.bankIcon}>{bank.icon}</Text>
            <Text style={styles.bankName}>{bank.name}</Text>
          </View>
          <Text style={styles.expandIcon}>{expanded ? '−' : '+'}</Text>
        </TouchableOpacity>

        {expanded && (
          <View style={styles.bankDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>खाता धारक:</Text>
              <Text style={styles.detailValue}>{bank.accountName}</Text>
            </View>
            
            <View style={styles.detailRowCopyable}>
              <View>
                <Text style={styles.detailLabel}>खाता संख्या:</Text>
                <Text style={styles.detailValueLarge}>{bank.accountNo}</Text>
              </View>
              <TouchableOpacity 
                style={styles.copyButton}
                onPress={() => copyToClipboard(bank.accountNo, 'खाता संख्या')}
              >
                <Text style={styles.copyButtonText}>📋</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.detailRowCopyable}>
              <View>
                <Text style={styles.detailLabel}>IFSC Code:</Text>
                <Text style={styles.detailValueLarge}>{bank.ifsc}</Text>
              </View>
              <TouchableOpacity 
                style={styles.copyButton}
                onPress={() => copyToClipboard(bank.ifsc, 'IFSC Code')}
              >
                <Text style={styles.copyButtonText}>📋</Text>
              </TouchableOpacity>
            </View>

            {bank.branchCode && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Branch Code:</Text>
                <Text style={styles.detailValue}>{bank.branchCode}</Text>
              </View>
            )}

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>शाखा:</Text>
              <Text style={styles.detailValue}>{bank.branch}</Text>
            </View>

            {bank.upiId && (
              <View style={styles.upiSection}>
                <Text style={styles.upiLabel}>UPI ID:</Text>
                <View style={styles.upiRow}>
                  <Text style={styles.upiId}>{bank.upiId}</Text>
                  <TouchableOpacity 
                    style={styles.copyButton}
                    onPress={() => copyToClipboard(bank.upiId, 'UPI ID')}
                  >
                    <Text style={styles.copyButtonText}>📋</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

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
        <Text style={styles.headerTitle}>दान करें</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>📤</Text>
        </TouchableOpacity>
      </LinearGradient>

      <Animated.ScrollView
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroCard}>
          <Text style={styles.heroEmoji}>🙏</Text>
          <Text style={styles.heroTitle}>धर्म कार्य में सहयोग</Text>
          <Text style={styles.heroSubtitle}>
            विश्व शांति सेवा चेरिटेबल ट्रस्ट को दान करें
          </Text>
          <Text style={styles.heroDescription}>
            आपका दान धार्मिक कार्यों और समाज सेवा में उपयोग होगा
          </Text>
        </View>

        {/* Tab Switch - India / International */}
        <View style={styles.tabContainer}>
          <Animated.View 
            style={[
              styles.tabIndicator, 
              { 
                left: tabAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '50%'],
                })
              }
            ]} 
          />
          <TouchableOpacity 
            style={styles.tab}
            onPress={() => setActiveTab('india')}
          >
            <Text style={[styles.tabText, activeTab === 'india' && styles.tabTextActive]}>
              🇮🇳 भारत
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.tab}
            onPress={() => setActiveTab('international')}
          >
            <Text style={[styles.tabText, activeTab === 'international' && styles.tabTextActive]}>
              🌍 International
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'india' ? (
          <>
            {/* UPI Quick Pay Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🔹 UPI से दान करें</Text>
              
              {/* Amount Selection */}
              <View style={styles.amountGrid}>
                {DONATION_AMOUNTS.map((amount) => (
                  <AmountButton key={amount} amount={amount} />
                ))}
              </View>

              {/* Custom Amount */}
              <View style={styles.customAmountContainer}>
                <Text style={styles.rupeeSymbol}>₹</Text>
                <TextInput
                  style={styles.customAmountInput}
                  placeholder="अन्य राशि"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numeric"
                  value={customAmount}
                  onChangeText={handleCustomAmount}
                />
              </View>

              {/* UPI Pay Button */}
              <TouchableOpacity
                style={styles.upiPayButton}
                onPress={handleUPIPayment}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#00C853', '#009624']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.upiPayGradient}
                >
                  <Text style={styles.upiPayText}>
                    💳 UPI से Pay करें {getFinalAmount() > 0 ? `(₹${getFinalAmount().toLocaleString('en-IN')})` : ''}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.upiApps}>
                <Text style={styles.upiAppsText}>GPay • PhonePe • Paytm • BHIM</Text>
              </View>
            </View>

            {/* Bank Details Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🔹 बैंक खाते में दान करें</Text>
              <Text style={styles.sectionSubtitle}>NEFT / RTGS / IMPS के लिए</Text>
              
              {INDIA_BANKS.map((bank) => (
                <BankCard 
                  key={bank.id}
                  bank={bank}
                  expanded={expandedBank === bank.id}
                  onToggle={() => setExpandedBank(expandedBank === bank.id ? null : bank.id)}
                />
              ))}
            </View>
          </>
        ) : (
          /* International Donation Section */
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔹 International Donation</Text>
            <Text style={styles.sectionSubtitle}>For devotees outside India (FCRA Account)</Text>

            <View style={styles.fcraNotice}>
              <Text style={styles.fcraIcon}>📋</Text>
              <Text style={styles.fcraText}>
                This is FCRA registered account for receiving international donations
              </Text>
            </View>
            
            <BankCard 
              bank={INTERNATIONAL_BANK}
              expanded={true}
              onToggle={() => {}}
            />

            <View style={styles.swiftInfo}>
              <Text style={styles.swiftTitle}>Swift Code Information</Text>
              <Text style={styles.swiftText}>
                For SWIFT transfer, please contact your bank with the above details and SWIFT code of SBI.
              </Text>
            </View>
          </View>
        )}

        {/* Contact Info */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>📞 संपर्क करें</Text>
          <TouchableOpacity 
            style={styles.contactRow}
            onPress={() => Linking.openURL('tel:+917351112221')}
          >
            <Text style={styles.contactIcon}>📱</Text>
            <Text style={styles.contactText}>+91-7351112221</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.contactRow}
            onPress={() => Linking.openURL('tel:+917351113331')}
          >
            <Text style={styles.contactIcon}>📱</Text>
            <Text style={styles.contactText}>+91-7351113331</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.contactRow}
            onPress={() => Linking.openURL('mailto:info@vssct.com')}
          >
            <Text style={styles.contactIcon}>📧</Text>
            <Text style={styles.contactText}>info@vssct.com</Text>
          </TouchableOpacity>
        </View>

        {/* Address */}
        <View style={styles.addressSection}>
          <Text style={styles.addressTitle}>📍 पता</Text>
          <Text style={styles.addressText}>
            Chhatikara Vrindavan Road,{'\n'}
            Near Vaishno Devi Mandir,{'\n'}
            Shri Dham Vrindavan, U.P. - 281121
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </Animated.ScrollView>
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
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonText: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  heroCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  heroEmoji: {
    fontSize: 56,
    marginBottom: SPACING.sm,
  },
  heroTitle: {
    ...FONTS.h2,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  heroSubtitle: {
    ...FONTS.bodyMedium,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  heroDescription: {
    ...FONTS.small,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 4,
    marginBottom: SPACING.lg,
    position: 'relative',
    ...SHADOWS.sm,
  },
  tabIndicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    width: '50%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    zIndex: 1,
  },
  tabText: {
    ...FONTS.bodyMedium,
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    ...FONTS.small,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  amountButton: {
    width: (width - SPACING.lg * 2 - SPACING.sm * 3) / 4,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  amountButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  amountText: {
    ...FONTS.bodyMedium,
    color: COLORS.textPrimary,
    fontSize: 13,
  },
  amountTextSelected: {
    color: COLORS.white,
  },
  customAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  rupeeSymbol: {
    ...FONTS.h3,
    color: COLORS.textSecondary,
    marginRight: SPACING.sm,
  },
  customAmountInput: {
    flex: 1,
    ...FONTS.body,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.md,
  },
  upiPayButton: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  upiPayGradient: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  upiPayText: {
    ...FONTS.h4,
    color: COLORS.white,
  },
  upiApps: {
    alignItems: 'center',
  },
  upiAppsText: {
    ...FONTS.caption,
    color: COLORS.textMuted,
  },
  bankCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  bankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLORS.primaryLight + '10',
  },
  bankHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  bankName: {
    ...FONTS.bodyMedium,
    color: COLORS.textPrimary,
  },
  expandIcon: {
    ...FONTS.h3,
    color: COLORS.primary,
  },
  bankDetails: {
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  detailRow: {
    marginBottom: SPACING.md,
  },
  detailRowCopyable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  detailLabel: {
    ...FONTS.caption,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  detailValue: {
    ...FONTS.body,
    color: COLORS.textPrimary,
  },
  detailValueLarge: {
    ...FONTS.bodyMedium,
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  copyButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButtonText: {
    fontSize: 18,
  },
  upiSection: {
    backgroundColor: COLORS.success + '15',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
  },
  upiLabel: {
    ...FONTS.caption,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  upiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  upiId: {
    ...FONTS.h4,
    color: COLORS.success,
  },
  fcraNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning + '20',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
  },
  fcraIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  fcraText: {
    flex: 1,
    ...FONTS.small,
    color: COLORS.textPrimary,
  },
  swiftInfo: {
    backgroundColor: COLORS.info + '15',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
  },
  swiftTitle: {
    ...FONTS.bodyMedium,
    color: COLORS.info,
    marginBottom: SPACING.xs,
  },
  swiftText: {
    ...FONTS.small,
    color: COLORS.textSecondary,
  },
  contactSection: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  contactTitle: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  contactIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  contactText: {
    ...FONTS.body,
    color: COLORS.primary,
  },
  addressSection: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  addressTitle: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  addressText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
});
