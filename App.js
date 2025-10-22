import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// HomeTab
import HomeScreen from './screens/HomeTab/HomeScreen';
// InfomationTab
import PortfolioScreen from './screens/InformationTab/PortfolioScreen';
import AddinfoStudentScreen from './screens/InformationTab/AddinfoStudentScreen';
import EducationScreen from './screens/InformationTab/EducationScreen';
import AddEditEducationScreen from './screens/InformationTab/AddEditEducationScreen';
// UserTab
import SignInScreen from './screens/UserTab/SignInScreen';
import ProfileScreen from './screens/UserTab/ProfileScreen';
import RegisterScreen from './screens/UserTab/RegisterScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  // state เก็บสถานะผู้ใช้ล็อกอินอยู่หรือไม่
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true); // state สำหรับ SplashScreen หรือ loading

  useEffect(() => {
    // ตรวจสอบ Token จาก AsyncStorage ตอนเริ่ม App
    AsyncStorage.getItem('access_token')
      .then(token => {
        if (token) setIsSignedIn(true); // ถ้ามี token → login แล้ว
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null; // สามารถใส่ SplashScreen แทนได้

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="HomeTab">
          {() => <HomeTab isSignedIn={isSignedIn}/>}
        </Tab.Screen>
        <Tab.Screen name="InformationTab">
          {() => <InformationTab isSignedIn={isSignedIn} />}
        </Tab.Screen>
        <Tab.Screen name="UserTab">
          {() => <UserTab isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// ---------------- Home Tab ----------------
function HomeRequireLogin({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 10 }}>Welcome to My App</Text>
      <Text style={{ fontSize: 16, color: '#555', marginBottom: 20 }}>Please sign in to get started.</Text>
      <Button title="→ Go to Sign In" onPress={() => navigation.navigate('UserTab')} color= "#495057"/>
    </View>
  );
}

function HomeTab({ isSignedIn }) {
  return (
    <Stack.Navigator>
      {isSignedIn ? (
        <Stack.Screen name="Home" component={HomeScreen} />
      ) : (
        <Stack.Screen name="HomeRequireLogin">
          {props => <HomeRequireLogin {...props} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}

// ---------------- Information Tab ----------------
function InformationRequireLogin({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>Please sign in to get started.</Text>
      <Button title="→ Go to Sign In" onPress={() => navigation.navigate('UserTab')} color= "#495057"/>
    </View>
  );
}

function InformationTab({ isSignedIn }) {
  return (
    <Stack.Navigator>
      {isSignedIn ? (
        <>
          <Stack.Screen name="Portfolio" component={PortfolioScreen} />
          <Stack.Screen name="Education" component={EducationScreen} />
          <Stack.Screen name="AddinfoStudent" component={AddinfoStudentScreen} />
          <Stack.Screen name="AddEditEducation" component={AddEditEducationScreen} />
        </>
      ) : (
        <Stack.Screen name="InformationRequireLogin">
          {props => <InformationRequireLogin {...props} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}

// ---------------- User Tab ----------------
function UserTab({ isSignedIn, setIsSignedIn }) {
  return (
    <Stack.Navigator>
      {isSignedIn ? (
        // ถ้า login → แสดง ProfileScreen
        <Stack.Screen name="Profile">
          {() => <ProfileScreen setIsSignedIn={setIsSignedIn} />}
        </Stack.Screen>
      ) : (
        <>
          {/* ถ้ายังไม่ login → แสดง SignInScreen / RegisterScreen */}
          <Stack.Screen name="Signin">
            {props => <SignInScreen {...props} setIsSignedIn={setIsSignedIn} />}
          </Stack.Screen>
          <Stack.Screen name="Register">
            {props => <RegisterScreen {...props} setIsSignedIn={setIsSignedIn} />}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
}
