import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { getUpcomingExams } from '@/data/exams';
import ExamCard from '@/components/ExamCard';
import UserTypeSwitch from '@/components/UserTypeSwitch';

export default function ScheduleScreen() {
  const colorScheme = useColorScheme();
  const [userType, setUserType] = useState('student');
  const [upcomingExams, setUpcomingExams] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(() => {
    // Load exams when the screen is focused
    loadExams();
    
    // Set the header title
    navigation.setOptions({
      title: userType === 'student' ? 'My Exam Schedule' : 'My Surveillance Schedule',
    });
  });

  const loadExams = () => {
    // This would fetch from an API in a real app
    const exams = getUpcomingExams(userType);
    setUpcomingExams(exams);
  };

  const bgColor = colorScheme === 'dark' ? '#111827' : '#F9FAFB';
  const textColor = colorScheme === 'dark' ? '#F9FAFB' : '#111827';
  const secondaryTextColor = colorScheme === 'dark' ? '#9CA3AF' : '#6B7280';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <UserTypeSwitch userType={userType} setUserType={setUserType} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              {userType === 'student' ? 'Upcoming Exams' : 'Upcoming Surveillances'}
            </Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => {
                // Navigate to full schedule view
              }}
            >
              <Text style={[styles.viewAllText, { color: '#0A6EBD' }]}>View All</Text>
              <ChevronRight size={16} color="#0A6EBD" />
            </TouchableOpacity>
          </View>
          
          {upcomingExams.length > 0 ? (
            upcomingExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} userType={userType} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: secondaryTextColor }]}>
                {userType === 'student' 
                  ? 'No upcoming exams scheduled'
                  : 'No upcoming surveillances scheduled'}
              </Text>
            </View>
          )}
        </View>
        
        {userType === 'teacher' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Student Information
            </Text>
            {/* Student information would go here */}
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: secondaryTextColor }]}>
                Select a surveillance to view student information
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
  },
});