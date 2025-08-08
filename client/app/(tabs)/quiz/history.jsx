// client/app/(tabs)/quiz/history.jsx
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { List, Title, Text } from 'react-native-paper';
import { fetchQuizHistory } from '../../../services/quiz';

export default function QuizHistory() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    fetchQuizHistory()
      .then(setItems)
      .catch(e => setErr(e?.response?.data?.msg || e.message));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Title style={styles.header}>Past Quiz Attempts</Title>
      {!!err && <Text style={{ color: 'red', textAlign: 'center' }}>{err}</Text>}
      <ScrollView>
        {items.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 24 }}>
            No attempts yet. Take a quiz and save a result.
          </Text>
        ) : items.map((r, i) => (
          <List.Item
            key={i}
            title={`${r.score} / ${r.total}`}
            description={new Date(r.timestamp).toLocaleString()}
            left={props => <List.Icon {...props} icon="history" />}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  header: { margin: 16, textAlign: 'center' },
});
