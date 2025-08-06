import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  TextInput,
  Chip,
  Divider,
  List,
} from 'react-native-paper';
import { classifyFraud } from '../services/fraud';

const SCENARIOS = [
  {
    id: 'phishing',
    title: 'Phishing Email',
    example:
      'Your bank account is at risk. Verify now: http://fakebank-login.com',
  },
  {
    id: 'otp',
    title: 'OTP Request Scam',
    example:
      'We blocked a transaction. Send your OTP immediately to secure your funds.',
  },
  {
    id: 'social',
    title: 'Social Engineering',
    example:
      'Hi, I’m from IT support. Please share your password so I can fix your account.',
  },
];

export default function Fraud() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const handleClassify = async (text) => {
    try {
      const res = await classifyFraud(text);
      setResult(res);
      setHistory([{ text, ...res }, ...history]);
    } catch (e) {
      console.error(e);
      alert('Error calling fraud API');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        Fraud Awareness
      </Text>

      {/* Scenario Chips */}
      <FlatList
        horizontal
        data={SCENARIOS}
        keyExtractor={(s) => s.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scenarioList}
        renderItem={({ item }) => (
          <Chip
            style={styles.chip}
            onPress={() => {
              setInput(item.example);
              handleClassify(item.example);
            }}
          >
            {item.title}
          </Chip>
        )}
      />

      <Divider style={{ marginVertical: 12 }} />

      {/* Free-text input */}
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          label="Enter suspicious text or URL"
          value={input}
          onChangeText={setInput}
          mode="outlined"
          multiline
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={() => handleClassify(input)}
          disabled={!input.trim()}
          style={styles.button}
        >
          Classify
        </Button>
      </KeyboardAvoidingView>

      {/* Result Card */}
      {result && (
        <Card style={styles.card}>
          <Card.Title
            title={`Label: ${result.label.toUpperCase()}`}
            subtitle={`Confidence: ${(result.score * 100).toFixed(1)}%`}
          />
          <Card.Content>
            <Text>{result.explanation}</Text>
          </Card.Content>
        </Card>
      )}

      <Divider style={{ marginVertical: 12 }} />

      {/* History */}
      <Text variant="titleMedium" style={{ marginBottom: 8 }}>
        History
      </Text>
      <FlatList
        data={history}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <List.Item
            title={item.text}
            description={`→ ${item.label.toUpperCase()} @ ${(item.score * 100).toFixed(1)}%`}
            left={(props) => (
              <List.Icon
                {...props}
                icon={item.label === 'phish' ? 'alert' : 'check'}
              />
            )}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f2f2f2' },
  header: { textAlign: 'center', marginBottom: 16 },
  scenarioList: { paddingHorizontal: 4 },
  chip: { marginHorizontal: 4 },
  input: { marginBottom: 12, backgroundColor: 'white' },
  button: { marginBottom: 16 },
  card: { marginBottom: 16 },
});
