import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import BudgetCalculator from '../components/BudgetCalculator';
import InvestmentSimulator from '../components/InvestmentSimulator';

export default function Budget() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BudgetCalculator />
      <InvestmentSimulator />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 24, backgroundColor: '#f2f2f2' },
});
