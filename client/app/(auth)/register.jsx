import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useRouter, Link } from 'expo-router';
import API from '../../services/api';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const router = useRouter();

  const submit = async () => {
    setErr(''); setLoading(true);
    try {
      await API.post('/auth/register', { email, password, name });
      router.replace('/(auth)/login');
    } catch (e) {
      setErr(e?.response?.data?.msg || e.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="headlineMedium" style={{ textAlign: 'center', marginBottom: 16 }}>Create account</Text>
      <TextInput mode="outlined" label="Name" value={name} onChangeText={setName} style={styles.input}/>
      <TextInput mode="outlined" label="Email" value={email} onChangeText={setEmail} style={styles.input}/>
      <TextInput mode="outlined" label="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input}/>
      {!!err && <Text style={{ color: 'red', marginBottom: 8 }}>{err}</Text>}
      <Button mode="contained" onPress={submit} loading={loading} disabled={loading}>Sign Up</Button>
      <Text style={{ textAlign: 'center', marginTop: 12 }}>
        Already have an account? <Link href="/(auth)/login">Log in</Link>
      </Text>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({ container:{flex:1,padding:16,backgroundColor:'#f2f2f2'}, input:{marginBottom:12} });
