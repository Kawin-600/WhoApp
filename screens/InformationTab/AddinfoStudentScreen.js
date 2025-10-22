import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddinfoStudentScreen({ route, navigation }) {
  const { student, onSave } = route.params || {};
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    address: '',
    tel: '',
    birth_date: '',
    department: '',
  });

  useEffect(() => {
    if (student) setForm({ ...student });
  }, [student]);

  function validateForm() {
    const { first_name, last_name, address, tel, birth_date, department } = form;

    // ตรวจสอบช่องว่าง
    if (!first_name || !last_name || !address || !tel || !birth_date || !department) {
      window.alert('ข้อมูลไม่ครบ\nกรุณากรอกข้อมูลให้ครบทุกช่อง');
      return false;
    }

    // ตรวจสอบรูปแบบวันที่ (YYYY/MM/DD)
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(birth_date)) {
      window.alert('รูปแบบวันที่ไม่ถูกต้อง\nกรุณากรอกวันเกิดในรูปแบบ YYYY-MM-DD');
      return false;
    }

    // ตรวจสอบเบอร์โทร (เฉพาะตัวเลข 10 หลัก)
    const telPattern = /^\d{10}$/;
    if (!telPattern.test(tel)) {
      window.alert('เบอร์โทรไม่ถูกต้อง\nกรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)');
      return false;
    }

    return true; // ผ่านทุกเงื่อนไข
  }

  async function saveStudent() {
     if (!validateForm()) return; // หยุดถ้ากรอกข้อมูลผิด
    const token = await AsyncStorage.getItem('access_token');
    if (!token) return;

    try {
      const method = student?.id ? 'PUT' : 'POST';
      const url = student?.id
        ? `http://127.0.0.1:8000/api/student/${student.id}`
        : 'http://127.0.0.1:8000/api/student';

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
        onSave(data); // ส่งข้อมูลกลับ PortfolioScreen
        navigation.goBack();
      } else {
        console.log('❌ Save failed:', data);
        window.alert('เกิดข้อผิดพลาด\n'+ data.message + '\nไม่สามารถบันทึกข้อมูลได้');
      }
    } catch (error) {
      console.log('⚠️ Error saving student:', error);
      window.alert('ข้อผิดพลาด\nไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    }
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1, justifyContent: 'center' }]}>
      <Text style={styles.title}>{student ? 'Edit Info' : 'Add Info'}</Text>
      <View style={[styles.card, { width: 600 }]}>
        <View style={styles.row}>
          <TextInput
            placeholder="First Name"
            value={form.first_name || ''}
            onChangeText={text => setForm({ ...form, first_name: text })}
            style={[styles.input, { marginRight: 10, flex: 1 }]}
          />
          <TextInput
            placeholder="Last Name"
            value={form.last_name || ''}
            onChangeText={text => setForm({ ...form, last_name: text })}
            style={[styles.input, { flex: 1 }]}
          />
        </View>

        <TextInput
          placeholder="Address"
          value={form.address || ''}
          onChangeText={text => setForm({ ...form, address: text })}
          style={[styles.input, { height: 90 }]}
          multiline
        />

        <View style={styles.row}>
          <TextInput
            placeholder="Tel"
            value={form.tel || ''}
            onChangeText={text => setForm({ ...form, tel: text })}
            style={[styles.input, { marginRight: 10, flex: 1 }]}
          />
          <TextInput
            placeholder="Birthday YYYY/MM/DD"
            value={form.birth_date || ''}
            onChangeText={text => setForm({ ...form, birth_date: text })}
            style={[styles.input, { flex: 1 }]}
            type="date" 
          />
        </View>

        <TextInput
          placeholder="Department"
          value={form.department || ''}
          onChangeText={text => setForm({ ...form, department: text })}
          style={styles.input}
        />
      </View>

      <View style={{ height: 20 }} />
      <Button title="Save" onPress={saveStudent} />
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
    borderColor: '#000',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
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
