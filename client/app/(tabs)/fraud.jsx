// client/app/(tabs)/fraud.jsx
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { TextInput, Button, Text, Chip, List, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { classify, fraudHistory } from '../../services/fraud';

const SCENARIOS = [
  { key: 'phishing', label: 'Phishing Email' },
  { key: 'otp',      label: 'OTP Request Scam' },
  { key: 'social',   label: 'Social Eng' },
];

export default function Fraud() {
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState('phishing');  // <-- define it
  const [items, setItems] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClassify = async () => {
    setLoading(true);
    try {
      const rec = await classify({ text: input, scenario: activeTab });
      setResult(rec);

      // prepend and persist a tiny local cache per scenario
      const updated = [rec, ...items].slice(0, 20);
      setItems(updated);
      await AsyncStorage.setItem(`history_${activeTab}`, JSON.stringify(updated)); // <-- use activeTab
    } catch (e) {
      console.log('classify error', e?.response?.status, e?.response?.data);
      alert('Error calling fraud API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    // first try server history
    fraudHistory(activeTab)
      .then((rows) => { if (!cancelled) setItems(rows || []); })
      .catch((e) => {
        console.log('history error', e?.response?.status, e?.response?.data);
        // fallback to cached local history if server call fails
        AsyncStorage.getItem(`history_${activeTab}`).then((s) => {
          if (!cancelled && s) {
            try { setItems(JSON.parse(s)); } catch {}
          }
        });
      });

    return () => { cancelled = true; };
  }, [activeTab]);

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>Fraud Awareness</Text>

      {/* scenario chips */}
      <View style={styles.row}>
        {SCENARIOS.map(s => (
          <Chip
            key={s.key}
            selected={activeTab === s.key}
            onPress={() => setActiveTab(s.key)}
            style={styles.chip}
          >
            {s.label}
          </Chip>
        ))}
      </View>

      <TextInput
        mode="outlined"
        label="Enter suspicious text or URL"
        value={input}
        onChangeText={setInput}
        style={{ marginHorizontal: 16, marginTop: 8 }}
      />

      <Button
        mode="contained"
        onPress={handleClassify}
        loading={loading}
        disabled={loading || !input.trim()}
        style={{ margin: 16 }}
      >
        Classify
      </Button>

      {loading && <ActivityIndicator style={{ marginTop: 4 }} />}

      {/* result card */}
      {result && (
        <List.Section>
          <List.Subheader>Result</List.Subheader>
          <List.Item
            title={`Label: ${String(result.label).toUpperCase()}`}
            description={`Confidence: ${(Number(result.score) * 100).toFixed(1)}%\n${result.explanation || ''}`}
            left={props => <List.Icon {...props} icon={result.label === 'phish' ? 'shield-alert' : 'shield-check'} />}
          />
        </List.Section>
      )}

      {/* history */}
      <List.Section>
        <List.Subheader>History</List.Subheader>
        {items.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#888' }}>No attempts yet. Take a quiz and save a result.</Text>
        ) : (
          items.map((r, i) => (
            <List.Item
              key={i}
              title={`${r.label?.toUpperCase()} • ${(Number(r.score) * 100).toFixed(0)}%`}
              description={r.text?.slice(0, 80) || ''}
              left={p => <List.Icon {...p} icon={r.label === 'phish' ? 'alert' : 'check'} />}
              right={() => <Text style={{ alignSelf: 'center', color: '#666' }}>{new Date(r.timestamp || Date.now()).toLocaleString()}</Text>}
            />
          ))
        )}
      </List.Section>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  header: { margin: 16, textAlign: 'center' },
  row: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16 },
  chip: { marginRight: 8, marginBottom: 8 },
});
