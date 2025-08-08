import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Let's Start Making This FinWise</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 20, fontWeight: 'bold' },
});
