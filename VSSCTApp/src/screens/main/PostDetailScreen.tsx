import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Share,
  Linking,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import WebView from 'react-native-webview';
import YoutubePlayer from 'react-native-youtube-iframe';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../lib/constants';

const { width, height } = Dimensions.get('window');

// Extract YouTube video ID from URL
const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Check if URL is YouTube
const isYouTubeUrl = (url: string): boolean => {
  return url?.includes('youtube.com') || url?.includes('youtu.be');
};

export default function PostDetailScreen({ route, navigation }) {
  const { post } = route.params;
  const [playing, setPlaying] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
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

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${post.title}\n\nVSSCT App से पढ़ें`,
        title: post.title,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleLinkPress = (url: string) => {
    if (isYouTubeUrl(url)) {
      // Will be handled inline
      return;
    }
    Linking.openURL(url);
  };

  const youtubeVideoId = post.videoUrl ? extractYouTubeId(post.videoUrl) : null;

  const renderContent = () => {
    // Parse HTML content and render
    const content = post.content || post.excerpt || '';
    
    // Simple HTML to text conversion for display
    const cleanContent = content
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"');

    return (
      <Text style={styles.contentText}>{cleanContent}</Text>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header Image */}
      <View style={styles.imageContainer}>
        {post.featuredImage ? (
          <Image source={{ uri: post.featuredImage }} style={styles.headerImage} />
        ) : (
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            style={styles.headerImage}
          />
        )}
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']}
          style={styles.imageOverlay}
        />
        
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        {/* Share Button */}
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>📤</Text>
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentCard}>
          {/* Category Badge */}
          {post.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{post.category}</Text>
            </View>
          )}
          
          {/* Title */}
          <Text style={styles.title}>{post.title}</Text>
          
          {/* Meta Info */}
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>📅</Text>
              <Text style={styles.metaText}>
                {new Date(post.date).toLocaleDateString('hi-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>
            {post.author && (
              <View style={styles.metaItem}>
                <Text style={styles.metaIcon}>✍️</Text>
                <Text style={styles.metaText}>{post.author}</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          {/* YouTube Video Player */}
          {youtubeVideoId && (
            <View style={styles.videoContainer}>
              <YoutubePlayer
                height={220}
                width={width - SPACING.lg * 2 - SPACING.md * 2}
                play={playing}
                videoId={youtubeVideoId}
                onChangeState={(state) => {
                  if (state === 'ended') {
                    setPlaying(false);
                  }
                }}
              />
            </View>
          )}

          {/* Content */}
          {renderContent()}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              <Text style={styles.tagsTitle}>टैग:</Text>
              <View style={styles.tagsList}>
                {post.tags.map((tag: string, index: number) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Related Posts Section */}
        <View style={styles.relatedSection}>
          <Text style={styles.relatedTitle}>और पढ़ें</Text>
          <TouchableOpacity style={styles.relatedCard}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryLight]}
              style={styles.relatedGradient}
            >
              <Text style={styles.relatedIcon}>📖</Text>
              <Text style={styles.relatedText}>और प्रवचन देखें</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ height: 50 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    height: height * 0.35,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: SPACING.lg,
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.white,
  },
  shareButton: {
    position: 'absolute',
    top: 50,
    right: SPACING.lg,
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    marginTop: -SPACING.xl * 2,
  },
  contentCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    marginHorizontal: SPACING.lg,
    padding: SPACING.lg,
    ...SHADOWS.lg,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryLight + '20',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.md,
  },
  categoryText: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontWeight: '600',
  },
  title: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  metaIcon: {
    fontSize: 14,
  },
  metaText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.lg,
  },
  videoContainer: {
    marginBottom: SPACING.lg,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: COLORS.black,
  },
  contentText: {
    ...FONTS.body,
    color: COLORS.textPrimary,
    lineHeight: 28,
  },
  tagsContainer: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  tagsTitle: {
    ...FONTS.smallMedium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  tag: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  tagText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  relatedSection: {
    marginTop: SPACING.lg,
    marginHorizontal: SPACING.lg,
  },
  relatedTitle: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  relatedCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  relatedGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  relatedIcon: {
    fontSize: 24,
  },
  relatedText: {
    ...FONTS.bodyMedium,
    color: COLORS.white,
  },
});
