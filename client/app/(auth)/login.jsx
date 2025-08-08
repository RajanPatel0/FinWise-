import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useRouter, Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../services/api'; // your axios instance

export default function LoginScreen() {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const router = useRouter();

  const submit = async () => {
    setErr(''); setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      const token = data?.access_token;
      if (!token) throw new Error('No token returned');
      await AsyncStorage.setItem('JWT', token);
      router.replace('/(tabs)'); // root guard will keep you there
    } catch (e) {
      setErr(e?.response?.data?.msg || e.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="headlineMedium" style={{ textAlign: 'center', marginBottom: 16 }}>Log in to FinWise</Text>
      <TextInput mode="outlined" label="Email" value={email} onChangeText={setEmail} style={styles.input}/>
      <TextInput mode="outlined" label="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input}/>
      {!!err && <Text style={{ color: 'red', marginBottom: 8 }}>{err}</Text>}
      <Button mode="contained" onPress={submit} loading={loading} disabled={loading}>Log In</Button>
      <Text style={{ textAlign: 'center', marginTop: 12 }}>
        New here? <Link href="/(auth)/register">Create account</Link>
      </Text>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({ container:{flex:1,padding:16,backgroundColor:'#f2f2f2'}, input:{marginBottom:12} });
