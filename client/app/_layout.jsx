import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../services/api';
import { AppState } from 'react-native';

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  const guard = async () => {
    const token = await AsyncStorage.getItem('JWT');
    if (token) API.defaults.headers.common.Authorization = `Bearer ${token}`;
    else delete API.defaults.headers.common.Authorization;

    const authed = !!token;
    const inAuth = segments[0] === '(auth)';

    if (!authed && !inAuth) router.replace('/(auth)/login');
    else if (authed && inAuth) router.replace('/(tabs)');
    if (!ready) setReady(true);
  };

  useEffect(() => { guard(); }, [segments]);
  useEffect(() => {
    const sub = AppState.addEventListener('change', s => { if (s === 'active') guard(); });
    return () => sub.remove();
  }, []);

  if (!ready) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: true, title: 'Profile' }} /> {/* 👈 add me */}
    </Stack>
  );
}
