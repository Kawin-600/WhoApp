import React, { useState } from 'react';
import { Text, View, TextInput, Button } from 'react-native';
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
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Sign In</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          width: 300,
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          width: 300,
          borderWidth: 1,
          padding: 10,
          marginBottom: 20,
          borderRadius: 5,
        }}
      />
      <Button title={loading ? 'Loading...' : 'Sign In'} onPress={Login} disabled={loading} />

      <View style={{ height: 10 }} />

      <Button
        title="→ Go to Register"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
}
