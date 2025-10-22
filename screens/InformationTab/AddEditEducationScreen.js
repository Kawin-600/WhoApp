import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddEditEducationScreen({ route, navigation }) {
  const { education, onSave } = route.params || {};
  const [form, setForm] = useState({
    primary_school: '',
    middle_school: '',
    high_school: '',
    university: '',
  });

  useEffect(() => {
    if (education) setForm({ ...education });
  }, [education]);

  async function saveEducation() {
    const token = await AsyncStorage.getItem('access_token');
    if (!token) return;

    // ตรวจสอบข้อมูลเบื้องต้น
    if (!form.primary_school || !form.middle_school || !form.high_school || !form.university) {
      window.alert('❌ Error\nกรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    try {
      const hasEducation = !!education?.id;
      const method = hasEducation ? 'PUT' : 'POST';
      const url = hasEducation
        ? `http://127.0.0.1:8000/api/education/${education.id}`
        : 'http://127.0.0.1:8000/api/education';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        onSave(data); // ส่งข้อมูลกลับ EducationScreen
        navigation.goBack();
      } else {
        console.log('❌ Save failed:', data);
        window.alert('❌ Save failed\n'+ JSON.stringify(data));
      }
    } catch (error) {
      console.log('⚠️ Error saving education:', error);
      window.alert('⚠️ Error\nเกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1, justifyContent: 'center' }]}>
      <Text style={styles.title}>{education ? 'Edit Education' : 'Add Education'}</Text>
      <View style={[styles.card, { width: 600 }]}>
        <TextInput
          placeholder="Primary School"
          value={form.primary_school || ''}
          onChangeText={text => setForm({ ...form, primary_school: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Middle School"
          value={form.middle_school || ''}
          onChangeText={text => setForm({ ...form, middle_school: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="High School"
          value={form.high_school || ''}
          onChangeText={text => setForm({ ...form, high_school: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="University"
          value={form.university || ''}
          onChangeText={text => setForm({ ...form, university: text })}
          style={styles.input}
        />
      </View>

      <View style={{ height: 20 }} />
      <Button title="Save" onPress={saveEducation} />
      <View style={{ height: 10 }} />
      <Button title="Cancel" onPress={() => navigation.goBack()} color="gray" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: '#000', // กรอบดำ
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
});
