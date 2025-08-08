// client/components/QuizCard.jsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, RadioButton, Button } from 'react-native-paper';

export function QuizCard({ 
  question, 
  options, 
  selectedIndex, 
  onSelect, 
  onNext, 
  isLast 
}) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="headlineSmall" style={styles.question}>
          {question}
        </Text>

        <RadioButton.Group
          onValueChange={val => onSelect(parseInt(val, 10))}
          value={String(selectedIndex)}
        >
          {options.map((opt, i) => (
            <View key={i} style={styles.optionRow}>
              <RadioButton value={String(i)} />
              <Text onPress={() => onSelect(i)} style={styles.optionText}>
                {opt}
              </Text>
            </View>
          ))}
        </RadioButton.Group>

        <Button
          mode="contained"
          onPress={onNext}
          disabled={selectedIndex === null}
          style={styles.nextButton}
        >
          {isLast ? 'See Results' : 'Next'}
        </Button>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { margin: 16, padding: 8 },
  question: { marginBottom: 16 },
  optionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  optionText: { fontSize: 16 },
  nextButton: { marginTop: 16 },
});
