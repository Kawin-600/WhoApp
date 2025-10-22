import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen({ setIsSignedIn }) {
  const navigation = useNavigation(); // ได้ navigation object
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // state สำหรับยืนยัน password
  const [loading, setLoading] = useState(false);

  async function Register() {
    if (!name || !email || !password) {
      window.alert('Error', 'Please fill all fields');
      return;
    }

    // ตรวจสอบ password confirmation
    if (password !== confirmPassword) {
      window.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('access_token', data);
        setIsSignedIn(true); // แค่ตั้ง isSignedIn = true UserTab จะเปลี่ยนไป ProfileScreen อัตโนมัติ
      } else {
        window.alert('Register Failed', data.message || JSON.stringify(data));
      }
    } catch (error) {
      window.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1, justifyContent: 'center' }]}>
      <Text style={styles.title}>Register</Text>

      <View style={[styles.card, { width: 600 }]}>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>

      <View style={{ height: 20 }} />
      <Button title={loading ? 'Loading...' : 'Register'} onPress={Register} disabled={loading} />

      <View style={{ height: 10 }} />
      <Button title="← Back to Sign In" onPress={() => navigation.goBack()} color= "#495057" />
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
