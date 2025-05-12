import { StyleSheet, Text, View, TouchableOpacity, useColorScheme } from 'react-native';
import { Calendar, Clock, MapPin, BookOpen, Users } from 'lucide-react-native';

export default function ExamCard({ exam, userType }) {
  const colorScheme = useColorScheme();
  
  const cardBgColor = colorScheme === 'dark' ? '#1F2937' : '#FFFFFF';
  const textColor = colorScheme === 'dark' ? '#F9FAFB' : '#111827';
  const secondaryTextColor = colorScheme === 'dark' ? '#9CA3AF' : '#6B7280';
  const borderColor = colorScheme === 'dark' ? '#374151' : '#E5E7EB';
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  
  // Format time for display
  const formatTime = (start, end) => {
    return `${start} - ${end}`;
  };
  
  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: cardBgColor, borderColor: borderColor }]}
      onPress={() => {
        // Navigate to exam details
      }}
    >
      <View style={styles.header}>
        <Text style={[styles.subject, { color: textColor }]}>{exam.subject}</Text>
        {userType === 'teacher' && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{exam.studentCount} students</Text>
          </View>
        )}
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Calendar size={18} color={secondaryTextColor} />
          <Text style={[styles.detailText, { color: secondaryTextColor }]}>
            {formatDate(exam.date)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Clock size={18} color={secondaryTextColor} />
          <Text style={[styles.detailText, { color: secondaryTextColor }]}>
            {formatTime(exam.startTime, exam.endTime)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <MapPin size={18} color={secondaryTextColor} />
          <Text style={[styles.detailText, { color: secondaryTextColor }]}>
            Room {exam.room}
          </Text>
        </View>
        
        {userType === 'student' && (
          <View style={styles.detailRow}>
            <BookOpen size={18} color={secondaryTextColor} />
            <Text style={[styles.detailText, { color: secondaryTextColor }]}>
              {exam.type}
            </Text>
          </View>
        )}
        
        {userType === 'teacher' && (
          <View style={styles.detailRow}>
            <Users size={18} color={secondaryTextColor} />
            <Text style={[styles.detailText, { color: secondaryTextColor }]}>
              {exam.groups.join(', ')}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subject: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  badge: {
    backgroundColor: '#48CAE4',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '500',
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
  },
});