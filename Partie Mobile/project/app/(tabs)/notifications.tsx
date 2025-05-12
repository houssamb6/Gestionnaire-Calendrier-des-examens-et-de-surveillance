import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, useColorScheme } from 'react-native';
import { getNotifications, markNotificationAsRead } from '@/data/notifications';
import NotificationItem from '@/components/NotificationItem';
import UserTypeSwitch from '@/components/UserTypeSwitch';

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const [userType, setUserType] = useState('student');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, [userType]);

  const loadNotifications = () => {
    setLoading(true);
    // In a real app, this would be an API call
    const fetchedNotifications = getNotifications(userType);
    setNotifications(fetchedNotifications);
    setLoading(false);
  };

  const handleMarkAsRead = (notificationId) => {
    // Update the notification in our state
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true } 
        : notification
    );
    
    setNotifications(updatedNotifications);
    
    // In a real app, this would call an API
    markNotificationAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    
    setNotifications(updatedNotifications);
    
    // In a real app, this would call an API
    // markAllNotificationsAsRead(userType);
  };

  const bgColor = colorScheme === 'dark' ? '#111827' : '#F9FAFB';
  const textColor = colorScheme === 'dark' ? '#F9FAFB' : '#111827';
  const secondaryTextColor = colorScheme === 'dark' ? '#9CA3AF' : '#6B7280';

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <UserTypeSwitch userType={userType} setUserType={setUserType} />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.title, { color: textColor }]}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        
        {unreadCount > 0 && (
          <TouchableOpacity 
            style={styles.markAllButton}
            onPress={handleMarkAllAsRead}
          >
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <NotificationItem 
            notification={item} 
            onMarkAsRead={handleMarkAsRead}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: secondaryTextColor }]}>
              No notifications to display
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: '#FB8500',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  markAllButton: {
    padding: 8,
  },
  markAllText: {
    color: '#0A6EBD',
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
  },
});