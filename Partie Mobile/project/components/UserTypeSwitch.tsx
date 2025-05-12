import { StyleSheet, View, TouchableOpacity, Text, useColorScheme } from 'react-native';

export default function UserTypeSwitch({ userType, setUserType }) {
  const colorScheme = useColorScheme();
  
  const bgColor = colorScheme === 'dark' ? '#1F2937' : '#F3F4F6';
  const activeColor = colorScheme === 'dark' ? '#111827' : '#FFFFFF';
  const textColor = colorScheme === 'dark' ? '#F9FAFB' : '#111827';
  const inactiveTextColor = colorScheme === 'dark' ? '#9CA3AF' : '#6B7280';
  
  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <TouchableOpacity
        style={[
          styles.option,
          userType === 'student' && [styles.activeOption, { backgroundColor: activeColor }]
        ]}
        onPress={() => setUserType('student')}
      >
        <Text
          style={[
            styles.optionText,
            { color: userType === 'student' ? textColor : inactiveTextColor }
          ]}
        >
          Student
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.option,
          userType === 'teacher' && [styles.activeOption, { backgroundColor: activeColor }]
        ]}
        onPress={() => setUserType('teacher')}
      >
        <Text
          style={[
            styles.optionText,
            { color: userType === 'teacher' ? textColor : inactiveTextColor }
          ]}
        >
          Teacher
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 4,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  option: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeOption: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  optionText: {
    fontWeight: '500',
    fontSize: 14,
  },
});