import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, useColorScheme } from 'react-native';
import { getProfileData } from '@/data/profile';
import { ChevronRight, Settings, LogOut, Bell, Calendar, Info } from 'lucide-react-native';
import UserTypeSwitch from '@/components/UserTypeSwitch';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const [userType, setUserType] = React.useState('student');
  const profileData = getProfileData(userType);

  const bgColor = colorScheme === 'dark' ? '#111827' : '#F9FAFB';
  const cardBgColor = colorScheme === 'dark' ? '#1F2937' : '#FFFFFF';
  const textColor = colorScheme === 'dark' ? '#F9FAFB' : '#111827';
  const secondaryTextColor = colorScheme === 'dark' ? '#9CA3AF' : '#6B7280';
  const borderColor = colorScheme === 'dark' ? '#374151' : '#E5E7EB';

  const menuItems = [
    {
      id: 'settings',
      title: 'Settings',
      icon: <Settings size={20} color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'} />,
    },
    {
      id: 'notifications',
      title: 'Notification Preferences',
      icon: <Bell size={20} color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'} />,
    },
    {
      id: 'schedule',
      title: userType === 'student' ? 'Past Exams' : 'Past Surveillances',
      icon: <Calendar size={20} color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'} />,
    },
    {
      id: 'about',
      title: 'About the App',
      icon: <Info size={20} color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'} />,
    },
    {
      id: 'logout',
      title: 'Log Out',
      icon: <LogOut size={20} color="#EF4444" />,
      textColor: '#EF4444',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <UserTypeSwitch userType={userType} setUserType={setUserType} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={{ uri: profileData.avatar }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: textColor }]}>{profileData.name}</Text>
            <Text style={[styles.userRole, { color: secondaryTextColor }]}>
              {userType === 'student' ? `Student ID: ${profileData.studentId}` : `Teacher ID: ${profileData.teacherId}`}
            </Text>
            <Text style={[styles.userEmail, { color: secondaryTextColor }]}>
              {profileData.email}
            </Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: cardBgColor, borderColor: borderColor }]}>
          <Text style={[styles.cardTitle, { color: textColor }]}>
            {userType === 'student' ? 'Academic Information' : 'Department Information'}
          </Text>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: secondaryTextColor }]}>
              {userType === 'student' ? 'Program' : 'Department'}
            </Text>
            <Text style={[styles.infoValue, { color: textColor }]}>
              {userType === 'student' ? profileData.program : profileData.department}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: secondaryTextColor }]}>
              {userType === 'student' ? 'Year' : 'Position'}
            </Text>
            <Text style={[styles.infoValue, { color: textColor }]}>
              {userType === 'student' ? profileData.year : profileData.position}
            </Text>
          </View>
          
          {userType === 'student' && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: secondaryTextColor }]}>Group</Text>
              <Text style={[styles.infoValue, { color: textColor }]}>{profileData.group}</Text>
            </View>
          )}
        </View>

        <View style={[styles.menuCard, { backgroundColor: cardBgColor, borderColor: borderColor }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && styles.menuItemBorder,
                index < menuItems.length - 1 && { borderBottomColor: borderColor }
              ]}
            >
              <View style={styles.menuItemLeft}>
                {item.icon}
                <Text 
                  style={[
                    styles.menuItemText, 
                    { color: item.textColor || textColor }
                  ]}
                >
                  {item.title}
                </Text>
              </View>
              <ChevronRight size={20} color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
  },
  card: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  menuCard: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 32,
    borderWidth: 1,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
  },
});