import React, { useState, useEffect, useRef, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Animated,
  Image,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../lib/constants';

const { width } = Dimensions.get('window');

// YouTube Channel ID for DevkinandanThakurJiMaharaj
const CHANNEL_ID = 'UCVnpfKMCNu0d0RMnhUdSi5A'; // Actual channel ID
const YOUTUBE_API_KEY = 'AIzaSyB_sample_key_replace_with_actual'; // Replace with actual API key

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
}

// Fallback mock videos from the channel
const MOCK_VIDEOS: YouTubeVideo[] = [
  {
    id: 'video1',
    title: '🙏 श्रीमद भागवत कथा - वृन्दावन | Day 1 | Shri Devkinandan Thakur Ji',
    description: 'श्रीमद भागवत कथा का प्रथम दिन - वृन्दावन से प्रसारित',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    publishedAt: new Date().toISOString(),
    channelTitle: 'Shri Devkinandan Thakur Ji Maharaj',
  },
  {
    id: 'video2',
    title: '🎵 राधे राधे भजन | Divine Bhajan | VSSCT',
    description: 'राधे राधे भजन - दिव्य संगीत',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    channelTitle: 'Shri Devkinandan Thakur Ji Maharaj',
  },
  {
    id: 'video3',
    title: '📖 भक्तमाल कथा | दिन 2 | Bhaktamal Katha',
    description: 'भक्तमाल कथा का दूसरा दिन',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    channelTitle: 'Shri Devkinandan Thakur Ji Maharaj',
  },
  {
    id: 'video4',
    title: '🙏 श्री राम कथा - मध्य प्रदेश | Ram Katha',
    description: 'श्री राम कथा - मध्य प्रदेश से प्रसारित',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    publishedAt: new Date(Date.now() - 259200000).toISOString(),
    channelTitle: 'Shri Devkinandan Thakur Ji Maharaj',
  },
  {
    id: 'video5',
    title: '🎬 वृन्दावन दर्शन | Vrindavan Darshan Live',
    description: 'वृन्दावन मंदिर का दिव्य दर्शन',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    publishedAt: new Date(Date.now() - 345600000).toISOString(),
    channelTitle: 'Shri Devkinandan Thakur Ji Maharaj',
  },
  {
    id: 'video6',
    title: '📿 आरती | Aarti - Priyakant Ju Temple',
    description: 'प्रियाकांत जू मंदिर की दिव्य आरती',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    publishedAt: new Date(Date.now() - 432000000).toISOString(),
    channelTitle: 'Shri Devkinandan Thakur Ji Maharaj',
  },
  {
    id: 'video7',
    title: '🙏 होली महोत्सव 2024 | Holi Celebration Vrindavan',
    description: 'होली महोत्सव - वृन्दावन',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    publishedAt: new Date(Date.now() - 518400000).toISOString(),
    channelTitle: 'Shri Devkinandan Thakur Ji Maharaj',
  },
  {
    id: 'video8',
    title: '📖 गीता सार | Gita Wisdom',
    description: 'गीता का सार - महाराज जी द्वारा',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    publishedAt: new Date(Date.now() - 604800000).toISOString(),
    channelTitle: 'Shri Devkinandan Thakur Ji Maharaj',
  },
  {
    id: 'video9',
    title: '🎵 कृष्ण भजन संग्रह | Krishna Bhajan Collection',
    description: 'भगवान कृष्ण के दिव्य भजन',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    publishedAt: new Date(Date.now() - 691200000).toISOString(),
    channelTitle: 'Shri Devkinandan Thakur Ji Maharaj',
  },
  {
    id: 'video10',
    title: '🙏 सत्संग | Satsang with Maharaj Ji',
    description: 'महाराज जी के साथ सत्संग',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    publishedAt: new Date(Date.now() - 777600000).toISOString(),
    channelTitle: 'Shri Devkinandan Thakur Ji Maharaj',
  },
];

// Video Item Component
const VideoItem = memo(({ 
  item, 
  index, 
  onPress 
}: { 
  item: YouTubeVideo; 
  index: number; 
  onPress: (item: YouTubeVideo) => void;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Animated.View
      style={[
        styles.videoContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.videoCard}
        activeOpacity={0.9}
        onPress={() => onPress(item)}
      >
        <View style={styles.thumbnailContainer}>
          <Image
            source={{ uri: item.thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <View style={styles.playOverlay}>
            <View style={styles.playButton}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
          </View>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>LIVE</Text>
          </View>
        </View>
        
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.channelName}>{item.channelTitle}</Text>
          <Text style={styles.publishDate}>{formatDate(item.publishedAt)}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default function VideosScreen({ navigation }) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
    try {
      setError(null);
      
      // Try to fetch from YouTube API
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=10&type=video`
      );
      
      if (response.ok) {
        const data = await response.json();
        const formattedVideos: YouTubeVideo[] = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
          publishedAt: item.snippet.publishedAt,
          channelTitle: item.snippet.channelTitle,
        }));
        setVideos(formattedVideos);
      } else {
        // Use mock data as fallback
        console.log('Using mock videos as fallback');
        setVideos(MOCK_VIDEOS);
      }
    } catch (err) {
      console.log('YouTube API error, using mock data:', err);
      setVideos(MOCK_VIDEOS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVideos();
  };

  const handleVideoPress = (video: YouTubeVideo) => {
    navigation.navigate('YouTubePlayer', { 
      videoId: video.id,
      title: video.title,
      url: `https://www.youtube.com/watch?v=${video.id}`
    });
  };

  const renderVideo = ({ item, index }: { item: YouTubeVideo; index: number }) => (
    <VideoItem 
      item={item} 
      index={index} 
      onPress={handleVideoPress}
    />
  );

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <View style={styles.channelInfo}>
        <Image
          source={{ uri: 'https://vssct.com/wp-content/uploads/2023/04/logo-for-web-vssct.png' }}
          style={styles.channelLogo}
        />
        <View>
          <Text style={styles.channelTitle}>Shri Devkinandan Thakur Ji Maharaj</Text>
          <Text style={styles.channelSub}>@DevkinandanThakurJiMaharaj</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.subscribeButton}
        onPress={() => {
          // Open YouTube channel
          const url = 'https://www.youtube.com/@DevkinandanThakurJiMaharaj';
          // Linking.openURL(url);
        }}
      >
        <LinearGradient
          colors={['#FF0000', '#CC0000']}
          style={styles.subscribeGradient}
        >
          <Text style={styles.subscribeText}>▶ Subscribe</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📹</Text>
      <Text style={styles.emptyTitle}>कोई वीडियो नहीं</Text>
      <Text style={styles.emptyText}>
        कृपया बाद में पुनः प्रयास करें
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>वीडियो लोड हो रहे हैं...</Text>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>वीडियो</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <FlatList
        data={videos}
        renderItem={renderVideo}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
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
  listContent: {
    padding: SPACING.md,
  },
  headerContent: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  channelLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SPACING.md,
    backgroundColor: COLORS.border,
  },
  channelTitle: {
    ...FONTS.bodyMedium,
    color: COLORS.textPrimary,
  },
  channelSub: {
    ...FONTS.small,
    color: COLORS.textMuted,
  },
  subscribeButton: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  subscribeGradient: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  subscribeText: {
    ...FONTS.bodyMedium,
    color: COLORS.white,
  },
  videoContainer: {
    marginBottom: SPACING.md,
  },
  videoCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.border,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 24,
    color: COLORS.white,
    marginLeft: 4,
  },
  durationBadge: {
    position: 'absolute',
    bottom: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(255,0,0,0.9)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  durationText: {
    ...FONTS.tiny,
    color: COLORS.white,
    fontWeight: '700',
  },
  videoInfo: {
    padding: SPACING.md,
  },
  videoTitle: {
    ...FONTS.bodyMedium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    lineHeight: 22,
  },
  channelName: {
    ...FONTS.small,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  publishDate: {
    ...FONTS.caption,
    color: COLORS.textMuted,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
