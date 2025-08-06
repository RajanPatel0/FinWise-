import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Fraud() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🛡️ Fraud Awareness Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 18, fontWeight: 'bold' },
});
