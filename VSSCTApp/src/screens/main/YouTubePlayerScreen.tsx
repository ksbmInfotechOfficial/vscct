import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Share,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import YoutubePlayer from 'react-native-youtube-iframe';
import { COLORS, FONTS, SPACING, RADIUS } from '../../lib/constants';

const { width, height } = Dimensions.get('window');

// Extract YouTube video ID from URL
const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function YouTubePlayerScreen({ route, navigation }) {
  const { url, title } = route.params || {};
  const [playing, setPlaying] = useState(true);
  
  const videoId = extractYouTubeId(url);

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setPlaying(false);
    }
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${title || 'VSSCT Video'}\n${url}`,
        title: title || 'VSSCT Video',
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  if (!videoId) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          style={styles.errorHeader}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </LinearGradient>
        <View style={styles.errorContent}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>वीडियो नहीं मिला</Text>
          <Text style={styles.errorText}>यह वीडियो लिंक मान्य नहीं है</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title || 'वीडियो'}
        </Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>📤</Text>
        </TouchableOpacity>
      </View>

      {/* Video Player */}
      <View style={styles.playerContainer}>
        <YoutubePlayer
          height={height * 0.35}
          width={width}
          play={playing}
          videoId={videoId}
          onChangeState={onStateChange}
          webViewProps={{
            androidLayerType: 'hardware',
          }}
        />
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.videoTitle}>{title || 'VSSCT वीडियो'}</Text>
        <Text style={styles.channelName}>VSSCT Official Channel</Text>
        
        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setPlaying(!playing)}
          >
            <Text style={styles.actionIcon}>{playing ? '⏸' : '▶️'}</Text>
            <Text style={styles.actionText}>{playing ? 'रोकें' : 'चलाएं'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionText}>शेयर</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryLight]}
          style={styles.channelCard}
        >
          <View style={styles.channelIcon}>
            <Text style={styles.channelIconText}>🙏</Text>
          </View>
          <View style={styles.channelInfo}>
            <Text style={styles.channelTitle}>VSSCT YouTube Channel</Text>
            <Text style={styles.channelDesc}>और वीडियो देखने के लिए सब्सक्राइब करें</Text>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.black,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: COLORS.white,
  },
  headerTitle: {
    ...FONTS.bodyMedium,
    color: COLORS.white,
    flex: 1,
    marginHorizontal: SPACING.md,
    textAlign: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonText: {
    fontSize: 18,
  },
  playerContainer: {
    backgroundColor: COLORS.black,
  },
  infoSection: {
    backgroundColor: COLORS.surfaceDark,
    padding: SPACING.lg,
  },
  videoTitle: {
    ...FONTS.h4,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  channelName: {
    ...FONTS.small,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    gap: SPACING.xs,
  },
  actionIcon: {
    fontSize: 18,
  },
  actionText: {
    ...FONTS.small,
    color: COLORS.white,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    gap: SPACING.md,
  },
  channelIcon: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelIconText: {
    fontSize: 24,
  },
  channelInfo: {
    flex: 1,
  },
  channelTitle: {
    ...FONTS.bodyMedium,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  channelDesc: {
    ...FONTS.small,
    color: COLORS.white,
    opacity: 0.8,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  errorHeader: {
    paddingTop: 50,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    alignItems: 'flex-start',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: COLORS.white,
  },
  errorContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  errorTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  errorText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },
});
