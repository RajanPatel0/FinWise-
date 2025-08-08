import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

// ⬇️ Fix these two imports (only one `..` since lessons.jsx is in client/app)
import { tutorials } from '../../constants/tutorials';
import { TutorialCarousel } from '../../components/TutorialCarousel';

export default function Lessons() {
  const [completed, setCompleted] = useState([]);

  const handleMarkRead = (lessonId) => {
    if (!completed.includes(lessonId)) {
      setCompleted([...completed, lessonId]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TutorialCarousel
        data={tutorials}
        completed={completed}
        onMarkRead={handleMarkRead}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
});
