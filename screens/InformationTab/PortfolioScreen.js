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

  async function handleDelete() {
    if (!student || !student.id) {
      window.alert('❌ ไม่มีข้อมูลให้ลบ');
      return;
    }

    const confirmDelete = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?');
    if (!confirmDelete) {
      return;
    }

    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:8000/api/student/${student.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        window.alert('✅ ลบข้อมูลเรียบร้อยแล้ว');
        setStudent(null);
      } else {
        const data = await response.json();
        console.log('❌ Delete failed:', data);
        window.alert('❌ ลบข้อมูลไม่สำเร็จ');
      }
    } catch (error) {
      console.log('⚠️ Error deleting student:', error);
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

      <View style={styles.buttonRow}>
        <View style={student && student.first_name ? { flex: 1, marginRight: 10 } : { flex: 1 }}>
          <Button
            title={student && student.first_name ? '🖉 Edit Info' : '+ Add Info'}
            onPress={handleAddEdit}
            color={student && student.first_name ? '' : '#13795b'}
          />
        </View>

        {student && student.first_name && (
          <View style={{ flex: 1 }}>
            <Button
              title="🗑 Delete Info"
              onPress={handleDelete}
              color="#c1121f"
            />
          </View>
        )}
    </View>

      <View style={{ height: 20 }} />
      <Button
        title="→ Go to Education"
        onPress={() => navigation.navigate('Education')}
        color="#495057"
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 400,
    marginTop: 10,
  },
});
