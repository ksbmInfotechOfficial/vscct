import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { contentApi } from '../../lib/api';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../lib/constants';

export default function EventsScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await contentApi.getEvents(1, 20);
      setEvents(response.data.data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('hi-IN', { month: 'short' }),
      year: date.getFullYear(),
    };
  };

  const renderEvent = ({ item, index }) => {
    const startDate = formatDate(item.startDate);
    
    return (
      <TouchableOpacity
        style={styles.eventCard}
        activeOpacity={0.9}
      >
        <View style={styles.dateBox}>
          <Text style={styles.dateDay}>{startDate.day}</Text>
          <Text style={styles.dateMonth}>{startDate.month}</Text>
        </View>
        
        <View style={styles.eventContent}>
          <Text style={styles.eventTitle} numberOfLines={2}>{item.title}</Text>
          {item.venue && (
            <View style={styles.venueRow}>
              <Text style={styles.venueIcon}>📍</Text>
              <Text style={styles.venueText} numberOfLines={1}>{item.venue}</Text>
            </View>
          )}
          {item.description && (
            <Text style={styles.eventDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Events</Text>
        <Text style={styles.subtitle}>Upcoming programs and events</Text>
      </View>

      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id.toString()}
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
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>📅</Text>
              <Text style={styles.emptyText}>No upcoming events</Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 50,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
  },
  subtitle: {
    ...FONTS.small,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  listContent: {
    padding: SPACING.lg,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
    overflow: 'hidden',
  },
  dateBox: {
    width: 70,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
  },
  dateDay: {
    ...FONTS.h2,
    color: COLORS.white,
  },
  dateMonth: {
    ...FONTS.captionMedium,
    color: COLORS.white,
    opacity: 0.9,
  },
  eventContent: {
    flex: 1,
    padding: SPACING.md,
  },
  eventTitle: {
    ...FONTS.bodyMedium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  venueIcon: {
    fontSize: 12,
    marginRight: SPACING.xs,
  },
  venueText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    flex: 1,
  },
  eventDescription: {
    ...FONTS.small,
    color: COLORS.textMuted,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },
});
