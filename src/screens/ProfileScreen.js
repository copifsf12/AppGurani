import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, shadow } from '../theme/colors';

export default function ProfileScreen() {
  const stats = [
    { label: 'Racha actual', value: '3 días', emoji: '🔥' },
    { label: 'Puntos totales', value: '20', emoji: '⭐' },
    { label: 'Lecciones completadas', value: '2 de 8', emoji: '📚' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>👤</Text>
        </View>
        <Text style={styles.name}>Mi Perfil</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <Text style={styles.statEmoji}>{stat.emoji}</Text>
            <View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarEmoji: { fontSize: 44 },
  name: { fontFamily: fonts.extraBold, fontSize: 22, color: colors.white },
  content: { padding: 20, gap: 14 },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    gap: 16,
    ...shadow,
  },
  statEmoji: { fontSize: 32 },
  statValue: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.textDark },
  statLabel: { fontFamily: fonts.regular, fontSize: 14, color: colors.textGray },
});