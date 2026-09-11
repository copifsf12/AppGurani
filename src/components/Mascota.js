import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import * as Speech from 'expo-speech';
import { colors, fonts } from '../theme/colors';

export default function Mascota({ mensaje }) {
  const [hablando, setHablando] = useState(false);

  useEffect(() => {
    decir();
  }, []);

  const decir = () => {
    setHablando(true);
    Speech.speak(mensaje, {
      language: 'es',
      pitch: 1.1,
      rate: 0.95,
      onDone: () => setHablando(false),
      onStopped: () => setHablando(false),
    });
  };

  return (
    <TouchableOpacity style={styles.box} onPress={decir}>
      <View style={styles.lottieContainer}>
        <LottieView
          source={require('../../assets/animations/mascota.json')}
          autoPlay
          loop
          speed={hablando ? 1.4 : 0.8}
          style={styles.lottie}
          resizeMode="contain"
        />
      </View>
      <View style={styles.bubble}>
        <Text style={styles.texto}>{mensaje}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  lottieContainer: {
    width: 110,
    height: 110,
    marginRight: 12,
    overflow: 'hidden',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  bubble: {
    flex: 1,
    minWidth: 0,
  },
  texto: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.textDark,
    flexWrap: 'wrap',
  },
});