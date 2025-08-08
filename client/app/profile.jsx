import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Card, Button, List, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMe } from '../services/user';

export default function Profile() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try { const data = await getMe(); setMe(data); }
      finally { setLoading(false); }
    })();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('JWT');
    router.replace('/(auth)/login');
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 24 }} />;

  return (
    <SafeAreaView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Your Profile" />
        <Card.Content>
          <List.Item title="Name"  description={me?.name || '-'} left={p => <List.Icon {...p} icon="account" />} />
          <List.Item title="Email" description={me?.email}      left={p => <List.Icon {...p} icon="email" />} />
        </Card.Content>
        <Card.Actions>
          <Button onPress={logout}>Log out</Button>
        </Card.Actions>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f4f5f7' },
  card: { borderRadius: 16 }
});
