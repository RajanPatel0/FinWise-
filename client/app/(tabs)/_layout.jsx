import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getMe } from '../../services/user';

function AvatarButton() {
  const router = useRouter();
  const [me, setMe] = useState(null);

  useEffect(() => { getMe().then(setMe).catch(() => {}); }, []);
  const letter = (me?.name || me?.email || 'U').charAt(0).toUpperCase();

  return (
    <Pressable onPress={() => router.push('/profile')} style={{ marginLeft: 12 }} hitSlop={10}>
      <Avatar.Text size={32} label={letter} />
    </Pressable>
  );
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#0066cc' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: true,                     // 👈 show header just for Home
          headerLeft: () => <AvatarButton />,    // 👈 avatar in the header
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen name="budget"  options={{ title: 'Budget',
        tabBarIcon: ({color,size}) => <MaterialCommunityIcons name="chart-pie" color={color} size={size} /> }} />
      <Tabs.Screen name="lessons" options={{ title: 'Lessons',
        tabBarIcon: ({color,size}) => <MaterialCommunityIcons name="book-open-page-variant" color={color} size={size} /> }} />
      <Tabs.Screen name="quiz"    options={{ title: 'Quiz',
        tabBarIcon: ({color,size}) => <MaterialCommunityIcons name="clipboard-check-outline" color={color} size={size} /> }} />
      <Tabs.Screen name="fraud"   options={{ title: 'Fraud',
        tabBarIcon: ({color,size}) => <MaterialCommunityIcons name="shield-alert-outline" color={color} size={size} /> }} />
    </Tabs>
  );
}
