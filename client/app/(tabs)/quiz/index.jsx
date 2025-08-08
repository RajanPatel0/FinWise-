// client/app/(tabs)/quiz.jsx
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Text as RNText } from 'react-native';
import { Text, Button, Title, Paragraph } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { quizzes } from '../../../constants/quizzes';
import { QuizCard } from '../../../components/QuizCard';
import { submitQuiz } from '../../../services/quiz';

export default function QuizScreen() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const current = quizzes[index];
  const isLast  = index === quizzes.length - 1;

  const handleNext = async () => {
    const isCorrect = selected === current.correctIndex;
const nextScore = isCorrect ? score + 1 : score;

if (isLast) {
  setScore(nextScore);
  setCompleted(true);
  try {
    await submitQuiz({ score: nextScore, total: quizzes.length });
  } catch (e) {
    console.log('submit error', e?.response?.status, e?.response?.data);
    alert(e?.response?.data?.msg || 'Could not save quiz result');
  }
} else {
  setScore(nextScore);
  setIndex(i => i + 1);
  setSelected(null);
}
  };

  if (completed) {
    return (
      <SafeAreaView style={styles.center}>
        <Title>You scored {score} / {quizzes.length}</Title>
        <Paragraph style={styles.paragraph}>
          {score === quizzes.length
            ? 'Perfect! You know your stuff. 🎉'
            : score >= quizzes.length / 2
            ? 'Not bad—keep learning!'
            : 'Brush up on the lessons and try again.'}
        </Paragraph>

        <Button onPress={() => {
          setIndex(0); setSelected(null); setScore(0); setCompleted(false);
        }}>
          Retake Quiz
        </Button>

        <Button onPress={() => router.push('/quiz/history')}>
          View Past Attempts
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Title style={styles.header}>Financial Literacy Quiz</Title>
      <QuizCard
        question={current.question}
        options={current.options}
        selectedIndex={selected}
        onSelect={setSelected}
        onNext={handleNext}
        isLast={isLast}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  header: { textAlign: 'center', marginVertical: 16 },
  paragraph: { textAlign: 'center', marginBottom: 16 },
});
