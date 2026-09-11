import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, shadow } from '../theme/colors';

export default function ResultScreen({ route, navigation }) {
  const { lesson, score, total } = route.params;
  const porcentaje = Math.round((score / total) * 100);
  const esBueno = porcentaje >= 60;

  return (
    <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.container}>
      <SafeAreaView style={styles.content}>
        <Text style={styles.emoji}>{esBueno ? '🎉' : '💪'}</Text>
        <Text style={styles.title}>
          {esBueno ? '¡Muy bien hecho!' : '¡Sigue practicando!'}
        </Text>
        <Text style={styles.subtitle}>{lesson.title}</Text>

        <View style={styles.card}>
          <Text style={styles.scoreNumber}>{score}/{total}</Text>
          <Text style={styles.scoreLabel}>respuestas correctas</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${porcentaje}%` }]} />
          </View>
          <Text style={styles.percentText}>{porcentaje}%</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emoji: { fontSize: 70, marginBottom: 8 },
  title: { fontFamily: fonts.extraBold, fontSize: 26, color: colors.white, marginBottom: 4, textAlign: 'center' },
  subtitle: { fontFamily: fonts.regular, fontSize: 16, color: 'rgba(255,255,255,0.85)', marginBottom: 24 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    ...shadow,
  },
  scoreNumber: { fontFamily: fonts.extraBold, fontSize: 40, color: colors.primary },
  scoreLabel: { fontFamily: fonts.regular, fontSize: 14, color: colors.textGray, marginBottom: 16 },
  progressBarBg: { width: '100%', height: 12, backgroundColor: '#E0E0E0', borderRadius: 6, overflow: 'hidden' },
  progressBarFill: { height: 12, backgroundColor: colors.accent, borderRadius: 6 },
  percentText: { fontFamily: fonts.bold, fontSize: 14, color: colors.textDark, marginTop: 8 },
  button: {
    backgroundColor: colors.white,
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 16,
    ...shadow,
  },
  buttonText: { fontFamily: fonts.extraBold, color: colors.primary, fontSize: 16 },
});