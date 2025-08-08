// client/components/InvestmentSimulator.jsx

import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Dimensions } from 'react-native';
import { TextInput, Title, Paragraph } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function InvestmentSimulator() {
  const [monthly, setMonthly] = useState('100');
  const [rate, setRate]       = useState('7');
  const [years, setYears]     = useState('10');
  const [data, setData]       = useState({
    labels: ['0','1'],
    datasets: [{ data: [0, 0] }],
  });

  useEffect(() => {
    // 1) parse inputs, defaulting to safe minimums
    const m = parseFloat(monthly) || 0;
    const r = (parseFloat(rate) || 0) / 100 / 12;
    const yearCount = Math.max(1, parseInt(years, 10) || 1);
    const totalMonths = yearCount * 12;

    // 2) build monthly balances
    const balances = [];
    let bal = 0;
    for (let i = 1; i <= totalMonths; i++) {
      bal = (bal + m) * (1 + r);
      balances.push(+bal.toFixed(2));
    }

    // 3) build X-axis labels: ["0","1",...,"N"]
    let labels = Array.from(
      { length: yearCount + 1 },
      (_, i) => `${i}`
    );

    // 4) pick one data-point each year
    let points = [0, ...balances.filter((_, idx) => (idx + 1) % 12 === 0)];

    // 5) guard against <2 points (divide-by-zero in chart-kit)
    if (points.length < 2) {
      if (points.length === 1) {
        points = [points[0], points[0]];
      } else {
        points = [0, 0];
      }
      labels = points.map((_, i) => `${i}`);
    }

    setData({ labels, datasets: [{ data: points }] });
  }, [monthly, rate, years]);

  // 6) Safely grab final balance:
  const raw = data.datasets?.[0]?.data ?? [];
  const last = raw.length > 0 ? raw[raw.length - 1] : 0;

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.header}>Investment Simulator</Title>

      <TextInput
        label="Monthly Contribution ($)"
        value={monthly}
        onChangeText={setMonthly}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="Annual Return (%)"
        value={rate}
        onChangeText={setRate}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="Horizon (years)"
        value={years}
        onChangeText={setYears}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
      />

      <LineChart
        data={data}
        width={screenWidth - 32}
        height={260}
        yAxisLabel="$"
        formatXLabel={x => `${x}y`}
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(33,150,243,${opacity})`,
          labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          propsForDots: { r: '3', stroke: '#2196f3', strokeWidth: '1' },
        }}
        bezier
        style={styles.chart}
      />

      <Paragraph style={styles.footer}>
        Final Balance: ${last.toLocaleString()}
      </Paragraph>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  header:     { textAlign: 'center', marginBottom: 16 },
  input:      { marginBottom: 16 },
  chart:      { marginVertical: 16, borderRadius: 8 },
  footer:     { textAlign: 'center', fontWeight: 'bold', marginTop: 8 },
});
