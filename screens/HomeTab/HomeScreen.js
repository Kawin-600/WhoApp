// screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) return;

      try {
        const response = await fetch('http://127.0.0.1:8000/api/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        const data = await response.json();
        if (response.ok) setUser(data.user || data);
      } catch (error) {
        console.log('⚠️ Error fetching user:', error);
      }
    }

    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>Welcome, User {user.name} 👋</Text>
          <Text style={styles.subtitle}>Glad to see you again</Text>
        </>
      ) : (
        <>
          
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 20 },
});
