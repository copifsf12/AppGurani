import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import LottieView from 'lottie-react-native';
import { colors, fonts, shadow } from '../theme/colors';

export default function LessonScreen({ route, navigation }) {
  const { lesson } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showFallar, setShowFallar] = useState(false);

  const exercises = lesson.exercises || [];
  const currentExercise = exercises[currentIndex];

  if (!currentExercise) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Esta lección todavía no tiene ejercicios.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleSelect = (option) => {
    if (selected) return;
    setSelected(option);
    const correcto = option === currentExercise.correct;
    if (correcto) {
      setScore(score + 1);
    } else {
      setShowFallar(true);
      setTimeout(() => setShowFallar(false), 2000);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < exercises.length) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
    } else {
      navigation.replace('Result', { lesson, score, total: exercises.length });
    }
  };

  const isCorrect = selected === currentExercise.correct;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressBar}>
        <View
          style={[styles.progressFill, { width: `${((currentIndex + 1) / exercises.length) * 100}%` }]}
        />
      </View>

      <View style={styles.card}>
        {!selected && (
          <View style={styles.pensandoContainer}>
            <LottieView
              source={require('../../assets/animations/pensando.json')}
              autoPlay
              loop
              resizeMode="contain"
              style={styles.pensandoAnim}
            />
          </View>
        )}

        <Text style={styles.question}>{currentExercise.question}</Text>

        <View style={styles.optionsContainer}>
          {currentExercise.options.map((option) => {
            let optionStyle = styles.option;
            if (selected) {
              if (option === currentExercise.correct) optionStyle = styles.optionCorrect;
              else if (option === selected) optionStyle = styles.optionIncorrect;
            }
            return (
              <TouchableOpacity
                key={option}
                style={optionStyle}
                onPress={() => handleSelect(option)}
                disabled={!!selected}
                activeOpacity={0.85}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {selected && (
        <View style={styles.feedbackBox}>
          <Text style={styles.feedbackText}>
            {isCorrect ? '¡Correcto! 🎉' : `Incorrecto. La respuesta era: ${currentExercise.correct}`}
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>
              {currentIndex + 1 < exercises.length ? 'Siguiente' : 'Terminar'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={showFallar} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setShowFallar(false)}
        >
          <View style={styles.overlayAnimContainer}>
            <LottieView
              source={require('../../assets/animations/fallar.json')}
              autoPlay
              loop={false}
              resizeMode="contain"
              style={styles.overlayAnim}
              onAnimationFinish={() => setShowFallar(false)}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  progressBar: { height: 10, backgroundColor: '#E0E0E0', borderRadius: 5, marginBottom: 20, marginTop: 10 },
  progressFill: { height: 10, backgroundColor: colors.accent, borderRadius: 5 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    ...shadow,
  },
  pensandoContainer: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  pensandoAnim: { width: '100%', height: '100%' },
  title: { fontFamily: fonts.bold, fontSize: 20, color: colors.textDark, textAlign: 'center' },
  question: { fontFamily: fonts.extraBold, fontSize: 22, color: colors.textDark, marginBottom: 24 },
  optionsContainer: { gap: 14 },
  option: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 14,
    padding: 18,
  },
  optionCorrect: {
    backgroundColor: '#C8E6C9',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 14,
    padding: 18,
  },
  optionIncorrect: {
    backgroundColor: '#FFCDD2',
    borderWidth: 2,
    borderColor: '#C62828',
    borderRadius: 14,
    padding: 18,
  },
  optionText: { fontFamily: fonts.bold, fontSize: 16, color: colors.textDark },
  feedbackBox: { marginTop: 24, alignItems: 'center' },
  feedbackText: { fontFamily: fonts.bold, fontSize: 16, color: colors.textDark, marginBottom: 16, textAlign: 'center' },
  button: { backgroundColor: colors.primary, paddingVertical: 14, paddingHorizontal: 40, borderRadius: 14 },
  buttonText: { fontFamily: fonts.extraBold, color: colors.white, fontSize: 16 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  overlayAnimContainer: { width: 220, height: 220, overflow: 'hidden' },
  overlayAnim: { width: '100%', height: '100%' },
});