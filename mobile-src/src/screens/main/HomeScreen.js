import React, { useState, useEffect, useCallback } from 'react';
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
import { contentApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../lib/constants';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const user = useAuthStore((state) => state.user);

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
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>🙏 नमस्ते,</Text>
            <Text style={styles.userName}>{user?.name || 'भक्त'}</Text>
          </View>
          <TouchableOpacity style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://vssct.com/wp-content/uploads/2023/04/logo-for-web-vssct.png' }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <Text style={styles.quickActionEmoji}>📖</Text>
            <Text style={styles.quickActionText}>प्रवचन</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Text style={styles.quickActionEmoji}>🎵</Text>
            <Text style={styles.quickActionText}>भजन</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Events')}>
            <Text style={styles.quickActionEmoji}>📅</Text>
            <Text style={styles.quickActionText}>कार्यक्रम</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Text style={styles.quickActionEmoji}>🎬</Text>
            <Text style={styles.quickActionText}>वीडियो</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
      >
        {categories.slice(0, 8).map((category) => (
          <TouchableOpacity key={category.id} style={styles.categoryChip}>
            <Text style={styles.categoryChipText}>{category.name}</Text>
            <View style={styles.categoryCount}>
              <Text style={styles.categoryCountText}>{category.count}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderPost = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.postCard, index === 0 && styles.featuredPost]}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('PostDetail', { post: item })}
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
          {item.isLocked && (
            <View style={styles.lockedBadge}>
              <Text style={styles.lockedText}>🔒 Login to read</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <>
            {renderHeader()}
            {categories.length > 0 && renderCategories()}
            <Text style={styles.latestTitle}>Latest Posts</Text>
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
    paddingBottom: SPACING.xl,
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
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionEmoji: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  quickActionText: {
    ...FONTS.caption,
    color: COLORS.white,
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
  lockedBadge: {
    backgroundColor: COLORS.warningLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  lockedText: {
    ...FONTS.tiny,
    color: COLORS.warning,
  },
});
