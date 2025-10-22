import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function PortfolioScreen() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  async function fetchStudent() {
    const token = await AsyncStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/student', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setStudent(data || null);
      } else {
        console.log('❌ Fetch failed:', data);
      }
    } catch (error) {
      console.log('⚠️ Error fetching student:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudent();
  }, []);

  function handleAddEdit() {
    navigation.navigate('AddinfoStudent', {
      student: student,
      onSave: updated => setStudent(updated),
    });
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1, justifyContent: 'center' }]}>
      <Text style={styles.title}>Portfolio</Text>

      <View style={[styles.card, { width: 400 }]}>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>First Name:</Text>
          <Text style={styles.fieldValue}>{student?.first_name || 'ยังไม่มีข้อมูล'}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Last Name:</Text>
          <Text style={styles.fieldValue}>{student?.last_name || 'ยังไม่มีข้อมูล'}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Address:</Text>
          <Text style={styles.fieldValue}>{student?.address || 'ยังไม่มีข้อมูล'}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Tel:</Text>
          <Text style={styles.fieldValue}>{student?.tel || 'ยังไม่มีข้อมูล'}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Birthday:</Text>
          <Text style={styles.fieldValue}>{student?.birth_date || 'ยังไม่มีข้อมูล'}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Department:</Text>
          <Text style={styles.fieldValue}>{student?.department || 'ยังไม่มีข้อมูล'}</Text>
        </View>
      </View>

      <View style={{ height: 20 }} />
      <Button title={student ? 'Edit Info' : 'Add Info'} onPress={handleAddEdit} />

      <View style={{ height: 20 }} />
      <Button
        title="→ Go to Education"
        onPress={() => navigation.navigate('Education')}
        color= "#495057"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#fff',
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 8,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  fieldLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    width: 120,
    marginRight: 5,
  },
  fieldValue: {
    fontSize: 16,
    flexShrink: 1,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
});
