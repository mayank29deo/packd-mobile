import { View, Text, Pressable, Animated, PanResponder, Dimensions } from 'react-native';
import { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../lib/AppContext';
import { colors } from '../../lib/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

export default function SwipeScreen() {
  const router = useRouter();
  const { events, toggleRsvp, rsvps } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastSwipe, setLastSwipe] = useState<'left' | 'right' | null>(null);
  const position = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => position.setValue({ x: gesture.dx, y: gesture.dy * 0.3 }),
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        swipeRight();
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        swipeLeft();
      } else {
        Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
      }
    },
  });

  const swipeRight = () => {
    Animated.timing(position, { toValue: { x: SCREEN_WIDTH * 1.5, y: 0 }, duration: 250, useNativeDriver: true }).start(() => {
      toggleRsvp(events[currentIndex].id);
      setLastSwipe('right');
      nextCard();
    });
  };

  const swipeLeft = () => {
    Animated.timing(position, { toValue: { x: -SCREEN_WIDTH * 1.5, y: 0 }, duration: 250, useNativeDriver: true }).start(() => {
      setLastSwipe('left');
      nextCard();
    });
  };

  const nextCard = () => {
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex((i) => i + 1);
  };

  const rotate = position.x.interpolate({ inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH], outputRange: ['-12deg', '0deg', '12deg'] });
  const likeOpacity = position.x.interpolate({ inputRange: [0, SCREEN_WIDTH * 0.3], outputRange: [0, 1] });
  const nopeOpacity = position.x.interpolate({ inputRange: [-SCREEN_WIDTH * 0.3, 0], outputRange: [1, 0] });

  if (currentIndex >= events.length) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>🎉</Text>
        <Text style={{ fontSize: 20, fontWeight: '900', color: '#fff', marginBottom: 8 }}>All caught up!</Text>
        <Text style={{ color: colors.gray, marginBottom: 24 }}>You've seen all events for now.</Text>
        <Pressable onPress={() => setCurrentIndex(0)} style={{ backgroundColor: colors.orange, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14 }}>
          <Text style={{ color: '#fff', fontWeight: '800' }}>Start Over</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const event = events[currentIndex];
  const spotsLeft = event.max - event.rsvp;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: '900', color: '#fff' }}>Discover</Text>
        <Text style={{ fontSize: 13, color: colors.gray }}>Swipe right to join, left to skip</Text>
      </View>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {/* Next card (behind) */}
        {currentIndex + 1 < events.length && (
          <View style={{
            position: 'absolute', width: SCREEN_WIDTH - 48, backgroundColor: colors.card,
            borderRadius: 24, borderWidth: 1, borderColor: colors.border, padding: 24,
            transform: [{ scale: 0.95 }], top: 20,
          }}>
            <Text style={{ fontSize: 18, fontWeight: '900', color: '#fff' }}>{events[currentIndex + 1].title}</Text>
          </View>
        )}

        {/* Current card */}
        <Animated.View
          style={{
            width: SCREEN_WIDTH - 32, backgroundColor: colors.card,
            borderRadius: 24, borderWidth: 1, borderColor: colors.border,
            transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }],
            shadowColor: colors.orange, shadowOpacity: 0.2, shadowRadius: 20, elevation: 10,
          }}
          {...panResponder.panHandlers}
        >
          <View style={{ height: 4, backgroundColor: colors.orange, borderRadius: 4 }} />
          <View style={{ padding: 24 }}>
            {/* LIKE / NOPE overlays */}
            <Animated.View style={{ position: 'absolute', top: 28, left: 28, opacity: likeOpacity, zIndex: 10 }}>
              <Text style={{ fontSize: 28, fontWeight: '900', color: colors.green, borderWidth: 3, borderColor: colors.green, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>JOIN ✓</Text>
            </Animated.View>
            <Animated.View style={{ position: 'absolute', top: 28, right: 28, opacity: nopeOpacity, zIndex: 10 }}>
              <Text style={{ fontSize: 28, fontWeight: '900', color: '#F87171', borderWidth: 3, borderColor: '#F87171', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>SKIP ✗</Text>
            </Animated.View>

            <Text style={{ fontSize: 11, color: colors.orange, fontWeight: '700', marginBottom: 8 }}>{event.sport}</Text>
            <Text style={{ fontSize: 22, fontWeight: '900', color: '#fff', marginBottom: 16 }}>{event.title}</Text>

            <View style={{ gap: 10, marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', gap: 8, backgroundColor: colors.card2, borderRadius: 12, padding: 12 }}>
                <Text style={{ fontSize: 13, color: colors.gray }}>🕐</Text>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>{event.time}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 8, backgroundColor: colors.card2, borderRadius: 12, padding: 12 }}>
                <Text style={{ fontSize: 13, color: colors.gray }}>📍</Text>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>{event.venue}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, backgroundColor: colors.card2, borderRadius: 12, padding: 12, marginRight: 8 }}>
                  <Text style={{ fontSize: 10, color: colors.gray }}>LEVEL</Text>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>{event.level}</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: colors.card2, borderRadius: 12, padding: 12 }}>
                  <Text style={{ fontSize: 10, color: colors.gray }}>COST</Text>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: event.cost === 'Free' ? colors.green : colors.gold }}>{event.cost}</Text>
                </View>
              </View>
            </View>

            <View style={{ marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 12, color: colors.gray }}>{event.rsvp} going</Text>
                <Text style={{ fontSize: 12, color: colors.gray }}>{spotsLeft} spots left</Text>
              </View>
              <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 3 }}>
                <View style={{ height: 6, width: `${Math.min((event.rsvp / event.max) * 100, 100)}%`, backgroundColor: colors.orange, borderRadius: 3 }} />
              </View>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Action buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 24, paddingBottom: 24 }}>
        <Pressable onPress={swipeLeft} style={{ width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: '#F87171', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.card }}>
          <Text style={{ fontSize: 28 }}>✗</Text>
        </Pressable>
        <Pressable onPress={() => router.push(`/event/${event.id}`)} style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.card2, alignSelf: 'center' }}>
          <Text style={{ fontSize: 18 }}>ℹ️</Text>
        </Pressable>
        <Pressable onPress={swipeRight} style={{ width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: colors.green, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.card }}>
          <Text style={{ fontSize: 28 }}>✓</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
