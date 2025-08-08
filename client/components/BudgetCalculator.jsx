// client/components/BudgetCalculator.jsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function BudgetCalculator() {
  const [income, setIncome] = useState('');
  const [numbers, setNumbers] = useState({ needs: 0, wants: 0, savings: 0 });

  // Recompute whenever income changes
  useEffect(() => {
    const val = parseFloat(income) || 0;
    setNumbers({
      needs: +(val * 0.5).toFixed(2),
      wants: +(val * 0.3).toFixed(2),
      savings: +(val * 0.2).toFixed(2),
    });
  }, [income]);

  // Pie chart data
  const chartData = [
    { name: 'Needs (50%)', amount: numbers.needs, color: '#4caf50', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Wants (30%)', amount: numbers.wants, color: '#2196f3', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Savings (20%)', amount: numbers.savings, color: '#ff9800', legendFontColor: '#333', legendFontSize: 12 },
  ];

  return (
    <View style={styles.container}>
      <Title style={styles.header}>Budget Breakdown</Title>

      <TextInput
        label="Monthly Income"
        value={income}
        onChangeText={setIncome}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
      />

      <PieChart
        data={chartData}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="16"
        absolute
      />

      <View style={styles.cardsRow}>
        <Card style={[styles.card, { borderLeftColor: '#4caf50' }]}>
          <Card.Content>
            <Title>Needs</Title>
            <Paragraph>${numbers.needs}</Paragraph>
          </Card.Content>
        </Card>

        <Card style={[styles.card, { borderLeftColor: '#2196f3' }]}>
          <Card.Content>
            <Title>Wants</Title>
            <Paragraph>${numbers.wants}</Paragraph>
          </Card.Content>
        </Card>

        <Card style={[styles.card, { borderLeftColor: '#ff9800' }]}>
          <Card.Content>
            <Title>Savings</Title>
            <Paragraph>${numbers.savings}</Paragraph>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { textAlign: 'center', marginBottom: 16 },
  input: { marginBottom: 24 },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    marginHorizontal: 4,
    borderLeftWidth: 8,
  },
});
