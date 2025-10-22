import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function SignInScreen({ setIsSignedIn }) {
  const navigation = useNavigation(); // ได้ navigation object

  const [email, setEmail] = useState('Kawin1@gmail.com');
  const [password, setPassword] = useState('Kawin1@gmail.com');
  const [loading, setLoading] = useState(false);

  async function Login() {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      await AsyncStorage.setItem('access_token', data); // เก็บ Token
      setIsSignedIn(true); // อัปเดต state ให้ UserTab ไป ProfileScreen
    } else {
      alert(JSON.stringify(data));
    }
  } catch (err) {
    alert(err.message);
  }
}

  return (
    <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1, justifyContent: 'center' }]}>
      <Text style={styles.title}>Sign In</Text>

      {/* กล่อง card เหมือน AddinfoScreen */}
      <View style={[styles.card, { width: 350 }]}>
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
      </View>

      <View style={{ height: 20 }} />
      <Button 
        title={loading ? 'Loading...' : 'Sign In'} 
        onPress={Login} 
        disabled={loading}
      />

      <View style={{ height: 10 }} />
      <Button
        title="→ Go to Register"
        onPress={() => navigation.navigate('Register')}
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

