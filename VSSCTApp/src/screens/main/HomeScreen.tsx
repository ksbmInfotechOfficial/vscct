import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  StatusBar,
  Animated,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { contentApi, userApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../lib/constants';

const { width } = Dimensions.get('window');

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function HomeScreen() {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const scrollY = useRef(new Animated.Value(0)).current;

  const fetchData = async () => {
    try {
      const [postsRes, categoriesRes] = await Promise.all([
        contentApi.getPosts(1, 10),
        contentApi.getCategories(),
      ]);
      setPosts(postsRes.data.data.posts || []);
      setCategories(categoriesRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Fetch user profile to get latest name
    userApi.getProfile().then(res => {
      if (res.data.data) updateUser(res.data.data);
    }).catch(console.error);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const QuickActionButton = ({ emoji, label, onPress, index }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.sequence([
        Animated.delay(index * 100),
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }, []);

    const handlePress = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
      onPress?.();
    };

    return (
      <AnimatedTouchable
        style={[
          styles.quickAction,
          {
            transform: [
              { scale: scaleAnim },
            ],
          },
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Text style={styles.quickActionEmoji}>{emoji}</Text>
        <Text style={styles.quickActionText}>{label}</Text>
      </AnimatedTouchable>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            {/* Menu Button */}
            <TouchableOpacity style={styles.menuButton} onPress={openDrawer}>
              <View style={styles.menuLine} />
              <View style={[styles.menuLine, styles.menuLineShort]} />
              <View style={styles.menuLine} />
            </TouchableOpacity>
            <View>
              <Text style={styles.greeting}>🙏 नमस्ते,</Text>
              <Text style={styles.userName}>{user?.name || 'भक्त'}</Text>
            </View>
          </View>
          
          <View style={styles.headerRight}>
            {/* Notification Bell */}
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Text style={styles.bellIcon}>🔔</Text>
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.avatarContainer}>
              <Image
                source={{ uri: 'https://vssct.com/wp-content/uploads/2023/04/logo-for-web-vssct.png' }}
                style={styles.avatar}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions with Animation */}
        <View style={styles.quickActions}>
          <QuickActionButton 
            emoji="📖" 
            label="प्रवचन" 
            index={0}
          />
          <QuickActionButton 
            emoji="🎵" 
            label="भजन"
            index={1}
          />
          <QuickActionButton 
            emoji="📅" 
            label="कार्यक्रम"
            onPress={() => navigation.navigate('Events')}
            index={2}
          />
          <QuickActionButton 
            emoji="🎬" 
            label="वीडियो"
            onPress={() => navigation.navigate('Videos')}
            index={3}
          />
        </View>

        {/* Donation Banner */}
        <TouchableOpacity 
          style={styles.donationBanner}
          onPress={() => navigation.navigate('Donation')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.donationGradient}
          >
            <Text style={styles.donationEmoji}>🙏</Text>
            <View style={styles.donationTextContainer}>
              <Text style={styles.donationTitle}>दान करें</Text>
              <Text style={styles.donationSubtitle}>धर्म कार्य में सहयोग</Text>
            </View>
            <Text style={styles.donationArrow}>→</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>श्रेणियां</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
      >
        {categories.slice(0, 8).map((category, index) => (
          <Animated.View
            key={category.id}
            style={{
              transform: [{
                translateX: scrollY.interpolate({
                  inputRange: [0, 100],
                  outputRange: [0, -index * 5],
                  extrapolate: 'clamp',
                }),
              }],
            }}
          >
            <TouchableOpacity style={styles.categoryChip}>
              <Text style={styles.categoryChipText}>{category.name}</Text>
              <View style={styles.categoryCount}>
                <Text style={styles.categoryCountText}>{category.count}</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );

  const PostCard = ({ item, index }) => {
    const cardScale = useRef(new Animated.Value(0.9)).current;
    const cardOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.spring(cardScale, {
          toValue: 1,
          friction: 8,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 400,
          delay: index * 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    const handlePress = () => {
      Animated.sequence([
        Animated.timing(cardScale, {
          toValue: 0.98,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.spring(cardScale, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
      
      navigation.navigate('PostDetail', { post: item });
    };

    return (
      <AnimatedTouchable
        style={[
          styles.postCard,
          index === 0 && styles.featuredPost,
          {
            transform: [{ scale: cardScale }],
            opacity: cardOpacity,
          },
        ]}
        activeOpacity={0.9}
        onPress={handlePress}
      >
        {item.featuredImage && (
          <Image
            source={{ uri: item.featuredImage }}
            style={index === 0 ? styles.featuredImage : styles.postImage}
          />
        )}
        <View style={styles.postContent}>
          <Text style={index === 0 ? styles.featuredTitle : styles.postTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.postExcerpt} numberOfLines={2}>
            {item.excerpt}
          </Text>
          <View style={styles.postMeta}>
            <Text style={styles.postDate}>
              {new Date(item.date).toLocaleDateString('hi-IN', {
                day: 'numeric',
                month: 'short',
              })}
            </Text>
            <View style={styles.readMoreButton}>
              <Text style={styles.readMoreText}>पढ़ें →</Text>
            </View>
          </View>
        </View>
      </AnimatedTouchable>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <Animated.FlatList
        data={posts}
        renderItem={({ item, index }) => <PostCard item={item} index={index} />}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <>
            {renderHeader()}
            {categories.length > 0 && renderCategories()}
            <Text style={styles.latestTitle}>नवीनतम पोस्ट</Text>
          </>
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
  header: {
    marginBottom: SPACING.md,
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  menuLine: {
    width: 24,
    height: 3,
    backgroundColor: COLORS.white,
    borderRadius: 2,
    marginVertical: 2,
  },
  menuLineShort: {
    width: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: COLORS.error,
    borderRadius: RADIUS.full,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    ...FONTS.tiny,
    color: COLORS.white,
    fontWeight: '700',
  },
  greeting: {
    ...FONTS.body,
    color: COLORS.white,
    opacity: 0.9,
  },
  userName: {
    ...FONTS.h2,
    color: COLORS.white,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    padding: 2,
    ...SHADOWS.md,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.full,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: SPACING.sm,
  },
  quickActionEmoji: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  quickActionText: {
    ...FONTS.caption,
    color: COLORS.white,
    fontWeight: '500',
  },
  donationBanner: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  donationGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  donationEmoji: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  donationTextContainer: {
    flex: 1,
  },
  donationTitle: {
    ...FONTS.bodyMedium,
    color: COLORS.textPrimary,
  },
  donationSubtitle: {
    ...FONTS.small,
    color: COLORS.textSecondary,
  },
  donationArrow: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
  },
  section: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  categoriesScroll: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    marginRight: SPACING.sm,
    ...SHADOWS.sm,
  },
  categoryChipText: {
    ...FONTS.smallMedium,
    color: COLORS.textPrimary,
  },
  categoryCount: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    marginLeft: SPACING.xs,
    paddingHorizontal: SPACING.xs,
    minWidth: 20,
    alignItems: 'center',
  },
  categoryCountText: {
    ...FONTS.tiny,
    color: COLORS.white,
    fontWeight: '600',
  },
  latestTitle: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  postCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  featuredPost: {
    ...SHADOWS.md,
  },
  postImage: {
    width: '100%',
    height: 150,
  },
  featuredImage: {
    width: '100%',
    height: 200,
  },
  postContent: {
    padding: SPACING.md,
  },
  postTitle: {
    ...FONTS.bodyMedium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  featuredTitle: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  postExcerpt: {
    ...FONTS.small,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postDate: {
    ...FONTS.caption,
    color: COLORS.textMuted,
  },
  readMoreButton: {
    backgroundColor: COLORS.primaryLight + '20',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  readMoreText: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
