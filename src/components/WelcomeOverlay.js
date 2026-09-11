import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import * as Speech from 'expo-speech';
import { colors, fonts, shadow } from '../theme/colors';

const { width } = Dimensions.get('window');
const MASCOT_SIZE = Math.min(width * 0.7, 320);

const WELCOME_MESSAGE =
  "Mba'éichapa! Bienvenido a Tukã Ñe'ẽ. Soy Toco, y voy a acompañarte a aprender guaraní.";

export default function WelcomeOverlay({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();

    Speech.speak(WELCOME_MESSAGE, {
      language: 'es',
      pitch: 1.1,
      rate: 0.95,
    });
  }, []);

  const handleSpeak = () => {
    Speech.speak(WELCOME_MESSAGE, {
      language: 'es',
      pitch: 1.1,
      rate: 0.95,
    });
  };

  const handleStart = () => {
    Speech.stop();
    Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start(onFinish);
  };

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
        <View style={styles.mascotContainer}>
          <LottieView
            source={require('../../assets/animations/mascota.json')}
            autoPlay
            loop
            resizeMode="contain"
            style={styles.mascotAnim}
          />
        </View>

        <TouchableOpacity style={styles.bubble} onPress={handleSpeak} activeOpacity={0.8}>
          <Text style={styles.bubbleText}>
            Mba'éichapa! Soy Toco 🦜{'\n'}Vamos a aprender guaraní juntos
          </Text>
          <Text style={styles.tapHint}>🔊 Toca para escuchar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleStart} activeOpacity={0.85}>
          <Text style={styles.buttonText}>¡Comenzar!</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    padding: 24,
  },
  mascotContainer: {
    width: MASCOT_SIZE,
    height: MASCOT_SIZE,
    overflow: 'hidden',
    marginBottom: 20,
  },
  mascotAnim: { width: '100%', height: '100%' },
  bubble: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 30,
    maxWidth: 320,
    ...shadow,
  },
  bubbleText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textDark,
    textAlign: 'center',
    lineHeight: 22,
  },
  tapHint: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.primary,
    textAlign: 'center',
    marginTop: 6,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 18,
    ...shadow,
  },
  buttonText: {
    fontFamily: fonts.extraBold,
    color: colors.white,
    fontSize: 18,
  },
});