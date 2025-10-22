import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ setIsSignedIn }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  async function Logout() {
    await AsyncStorage.removeItem('access_token');
    setIsSignedIn(false);
  }

  async function fetchUser() {
    const token = await AsyncStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user || data);
      } else {
        console.log('❌ Fetch user failed:', data);
      }
    } catch (error) {
      console.log('⚠️ Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>No user data found.</Text>
        <Button title="Sign Out" onPress={Logout} />
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <Text style={styles.title}>Profile</Text>

      <View style={[styles.card, { width: 300 }]}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.info}>{user.name}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.info}>{user.email}</Text>
      </View>

      <View style={{ height: 20 }} />

      <Button title="Sign Out" onPress={Logout} color="#d9534f" />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
  },
  list: {
    marginTop: 20,
    width: '60%',
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  itemDetail: {
    color: '#555',
  },
  noData: {
    marginTop: 10,
    textAlign: 'center',
    color: '#999',
  },
});
