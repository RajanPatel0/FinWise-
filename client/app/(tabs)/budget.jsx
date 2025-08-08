import React from 'react';
import { ScrollView } from 'react-native';
import BudgetCalculator from '../../components/BudgetCalculator';
import InvestmentSimulator from '../../components/InvestmentSimulator';

export default function Budget() {
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
      <BudgetCalculator />
      <InvestmentSimulator />
    </ScrollView>
  );
}
