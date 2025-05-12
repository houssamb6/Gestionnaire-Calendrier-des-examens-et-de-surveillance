import { StyleSheet, Text, View, TouchableOpacity, useColorScheme } from 'react-native';
import { Clock } from 'lucide-react-native';

export default function NotificationItem({ notification, onMarkAsRead }) {
  const colorScheme = useColorScheme();
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) {
      return diffDay === 1 ? '1 day ago' : `${diffDay} days ago`;
    } else if (diffHour > 0) {
      return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
    } else if (diffMin > 0) {
      return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
    } else {
      return 'Just now';
    }
  };

  const cardBgColor = colorScheme === 'dark' ? '#1F2937' : '#FFFFFF';
  const textColor = colorScheme === 'dark' ? '#F9FAFB' : '#111827';
  const secondaryTextColor = colorScheme === 'dark' ? '#9CA3AF' : '#6B7280';
  const unreadIndicatorColor = '#0A6EBD';
  const borderColor = colorScheme === 'dark' ? '#374151' : '#E5E7EB';
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: cardBgColor,
          borderColor: borderColor,
          opacity: notification.read ? 0.8 : 1
        }
      ]}
      onPress={() => {
        if (!notification.read) {
          onMarkAsRead(notification.id);
        }
      }}
    >
      {!notification.read && <View style={[styles.unreadIndicator, { backgroundColor: unreadIndicatorColor }]} />}
      
      <View style={styles.content}>
        <Text style={[
          styles.title, 
          { color: textColor },
          notification.read && styles.readTitle
        ]}>
          {notification.title}
        </Text>
        
        <Text style={[styles.message, { color: secondaryTextColor }]}>
          {notification.message}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.timestamp}>
            <Clock size={14} color={secondaryTextColor} />
            <Text style={[styles.timestampText, { color: secondaryTextColor }]}>
              {formatDate(notification.timestamp)}
            </Text>
          </View>
          
          {!notification.read && (
            <TouchableOpacity 
              style={styles.markReadButton}
              onPress={() => onMarkAsRead(notification.id)}
            >
              <Text style={styles.markReadText}>Mark as read</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  unreadIndicator: {
    width: 4,
    alignSelf: 'stretch',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  readTitle: {
    fontWeight: '500',
  },
  message: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timestampText: {
    fontSize: 12,
  },
  markReadButton: {
    padding: 6,
  },
  markReadText: {
    color: '#0A6EBD',
    fontSize: 12,
    fontWeight: '500',
  },
});