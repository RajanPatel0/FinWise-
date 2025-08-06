// client/components/TutorialCarousel.jsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { Button } from 'react-native-paper';
export function TutorialCarousel({ data, completed = [], onMarkRead }) {
  const { width } = Dimensions.get('window');
  const [currentIndex, setCurrentIndex] = useState(0);
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  // Called when viewable items change
  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  
  const currentLesson = data[currentIndex];
  const isDone = completed.includes(currentLesson.id);


  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        renderItem={({ item }) => (
          <View style={[styles.card, { width: width * 0.8 }]}>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.image} />
            )}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: width * 0.1 }}
      />

      {/* Progress Dots */}
      <View style={styles.dotsContainer}>
        {data.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              idx === currentIndex ? styles.dotActive : null,
              completed.includes(data[idx].id) ? styles.dotDone : null,
            ]}
          />
        ))}
      </View>
       {/* Mark-as-Read Button */}
      <View style={styles.actionContainer}>
        <Button
          mode={isDone ? 'contained' : 'outlined'}
          disabled={isDone}
          onPress={() => onMarkRead(currentLesson.id)}
        >
          {isDone ? 'Completed' : 'Mark as Read'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 24,
    alignItems: 'center',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  body:  { fontSize: 14, textAlign: 'center' },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#0066CC',
    width: 12,
    height: 12,
  },
  dotDone: {
        backgroundColor: 'green',
      },
    
      actionContainer: {
        alignItems: 'center',
        marginBottom: 24,
      },
});
