import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts, shadow } from '../theme/colors';
import { lessons } from '../data/lessons';
import Mascota from '../components/Mascota';
import WelcomeOverlay from '../components/WelcomeOverlay';

const CIRCLE_SIZE = 84;
const ITEM_HEIGHT = 120;
const LEFT_RATIO = 0.28;
const RIGHT_RATIO = 0.72;
const MAX_CONTENT_WIDTH = 480;

export default function HomeScreen({ navigation }) {
  const [pathWidth, setPathWidth] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const nextIndex = lessons.findIndex((l) => !l.completed);
  const completedCount = lessons.filter((l) => l.completed).length;

  const points = lessons.map((lesson, i) => ({
    x: pathWidth * (i % 2 === 0 ? LEFT_RATIO : RIGHT_RATIO),
    y: i * ITEM_HEIGHT + CIRCLE_SIZE / 2 + 10,
  }));

  const totalHeight = points.length
    ? points[points.length - 1].y + CIRCLE_SIZE / 2 + 50
    : 0;

  let pathD = '';
  if (points.length > 1) {
    pathD = `M ${points[0].x} ${points[0].y} `;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const midY = (prev.y + curr.y) / 2;
      pathD += `C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y} `;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[colors.primaryLight, colors.primary, colors.primaryDark]} style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Tukã Ñe'ẽ</Text>
            <Text style={styles.headerSubtitle}>Guaraní Aprende</Text>
          </View>
          <View style={styles.badgesRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeEmoji}>🔥</Text>
              <Text style={styles.badgeText}>3</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeEmoji}>⭐</Text>
              <Text style={styles.badgeText}>20</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20, alignItems: 'center' }}>
        <View
          style={{ width: '100%', maxWidth: MAX_CONTENT_WIDTH }}
          onLayout={(e) => setPathWidth(e.nativeEvent.layout.width)}
        >
          <Mascota mensaje="¿Listo para seguir aprendiendo? ¡Vamos!" />

          <View style={styles.unitBanner}>
            <View style={styles.unitIconCircle}>
              <Text style={styles.unitEmoji}>🌿</Text>
            </View>
            <View style={styles.unitBannerText}>
              <Text style={styles.unitLabel}>UNIDAD 1</Text>
              <Text style={styles.unitTitle}>Lo básico del guaraní</Text>
            </View>
            <Text style={styles.unitCount}>{completedCount}/{lessons.length}</Text>
          </View>

          <View style={{ height: totalHeight, position: 'relative', width: '100%' }}>
            {pathWidth > 0 && (
              <Svg
                width={pathWidth}
                height={totalHeight}
                style={{ position: 'absolute', top: 0, left: 0 }}
              >
                <Path d={pathD} stroke="#CFE8C5" strokeWidth={5} fill="none" strokeLinecap="round" />
              </Svg>
            )}

            {pathWidth > 0 &&
              lessons.map((lesson, index) => {
                const isNext = index === nextIndex;
                return (
                  <View
                    key={lesson.id}
                    style={{
                      position: 'absolute',
                      left: points[index].x - CIRCLE_SIZE / 2,
                      top: points[index].y - CIRCLE_SIZE / 2,
                      alignItems: 'center',
                    }}
                  >
                    {isNext && (
                      <View style={styles.startChip}>
                        <Text style={styles.startChipText}>EMPEZAR</Text>
                      </View>
                    )}
                    <Animated.View
                      style={isNext ? { transform: [{ scale: pulseAnim }] } : undefined}
                    >
                      <TouchableOpacity
                        style={[
                          styles.circle,
                          lesson.completed
                            ? styles.circleDone
                            : isNext
                            ? styles.circleNext
                            : styles.circlePending,
                        ]}
                        onPress={() => navigation.navigate('Lesson', { lesson })}
                        activeOpacity={0.75}
                      >
                        <Text style={styles.icon}>{lesson.icon}</Text>
                        {lesson.completed && (
                          <View style={styles.checkBadge}>
                            <Text style={styles.checkText}>✓</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    </Animated.View>
                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  </View>
                );
              })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={[styles.bottomTab, styles.bottomTabActive]} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.bottomIcon}>🏠</Text>
          <Text style={[styles.bottomLabel, styles.bottomLabelActive]}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomTab} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.bottomIcon}>👤</Text>
          <Text style={styles.bottomLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>

      {showWelcome && <WelcomeOverlay onFinish={() => setShowWelcome(false)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 22,
    paddingVertical: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontFamily: fonts.extraBold, color: colors.white, fontSize: 24 },
  headerSubtitle: { fontFamily: fonts.regular, color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 },
  badgesRow: { flexDirection: 'row', gap: 8 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },
  badgeEmoji: { fontSize: 14 },
  badgeText: { fontFamily: fonts.extraBold, color: colors.white, fontSize: 14 },
  unitBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    marginTop: 24,
    marginBottom: 30,
    borderRadius: 18,
    padding: 14,
    gap: 14,
    ...shadow,
  },
  unitIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unitEmoji: { fontSize: 24 },
  unitBannerText: { flex: 1, gap: 3 },
  unitLabel: { fontFamily: fonts.bold, fontSize: 11, color: 'rgba(255,255,255,0.8)', letterSpacing: 1 },
  unitTitle: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.white },
  unitCount: { fontFamily: fonts.extraBold, fontSize: 13, color: colors.white, opacity: 0.9 },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    ...shadow,
  },
  circleDone: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  circleNext: {
    backgroundColor: colors.white,
    borderColor: colors.accent,
  },
  circlePending: {
    backgroundColor: '#E9EFE4',
    borderColor: '#D6D6D6',
  },
  icon: { fontSize: 34 },
  checkBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.primaryDark,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  checkText: { color: colors.white, fontFamily: fonts.extraBold, fontSize: 12 },
  lessonTitle: { fontFamily: fonts.bold, marginTop: 8, color: colors.textDark, fontSize: 14 },
  startChip: {
    position: 'absolute',
    top: -32,
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    zIndex: 2,
    ...shadow,
  },
  startChipText: { fontFamily: fonts.extraBold, color: colors.white, fontSize: 11, letterSpacing: 0.5 },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    elevation: 10,
  },
  bottomTab: { alignItems: 'center', gap: 2, paddingVertical: 4, paddingHorizontal: 18, borderRadius: 14 },
  bottomTabActive: { backgroundColor: colors.background },
  bottomIcon: { fontSize: 24 },
  bottomLabel: { fontFamily: fonts.bold, fontSize: 11, color: colors.textGray },
  bottomLabelActive: { color: colors.primary },
});