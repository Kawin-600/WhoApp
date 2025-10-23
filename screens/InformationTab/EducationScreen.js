import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function EducationScreen() {
  const [education, setEducation] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  async function fetchEducation() {
    const token = await AsyncStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/education', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setEducation(data || null);
      } else {
        console.log('❌ Fetch failed:', data);
      }
    } catch (error) {
      console.log('⚠️ Error fetching education:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEducation();
  }, []);

  function handleAddEdit() {
    navigation.navigate('AddEditEducation', {
      education: education,
      onSave: updated => setEducation(updated),
    });
  }

  async function handleDelete() {
    if (!education || !education.id) {
      window.alert('❌ ไม่มีข้อมูลให้ลบ');
      return;
    }

    const confirmDelete = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?');
    if (!confirmDelete) {
      return;
    }

    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:8000/api/education/${education.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        window.alert('✅ ลบข้อมูลเรียบร้อยแล้ว');
        setEducation(null);
      } else {
        const data = await response.json();
        console.log('❌ Delete failed:', data);
        window.alert('❌ ลบข้อมูลไม่สำเร็จ');
      }
    } catch (error) {
      console.log('⚠️ Error deleting education:', error);
      window.alert('⚠️ เกิดข้อผิดพลาดขณะลบข้อมูล');
    }
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
      <Text style={styles.title}>Education</Text>

      <View style={[styles.card, { width: 400 }]}>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Primary School:</Text>
          <Text style={styles.fieldValue}>{education?.primary_school || 'ยังไม่มีข้อมูล'}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Middle School:</Text>
          <Text style={styles.fieldValue}>{education?.middle_school || 'ยังไม่มีข้อมูล'}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>High School:</Text>
          <Text style={styles.fieldValue}>{education?.high_school || 'ยังไม่มีข้อมูล'}</Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>University:</Text>
          <Text style={styles.fieldValue}>{education?.university || 'ยังไม่มีข้อมูล'}</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <View style={education && education.primary_school ? { flex: 1, marginRight: 10 } : { flex: 1 }}>
          <Button 
            title={education && education.primary_school ? '🖉 Edit Info' : '+ Add Info'} 
            onPress={handleAddEdit} 
            color={education && education.primary_school ? '' : '#13795b'}  
          />
        </View>

        {education && education.primary_school && (
          <>
            <View style={{ flex: 1 }}>
              <Button title="🗑 Delete Info" onPress={handleDelete} color="#dc3545" />
            </View>
          </>
        )}
      </View>

      <View style={{ height: 20 }} />
      <Button title="← Back to Portfolio" onPress={() => navigation.goBack()} color="#495057" />

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
    width: 150,
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 400,
    marginTop: 10,
  },
});
