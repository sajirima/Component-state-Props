import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

type ButtonVariant = 'add' | 'minus' | 'reset';

type CounterButtonProps = {
  label: string;
  variant: ButtonVariant;
  onPress: () => void;
};

//pindutan
const variantStyles: Record<ButtonVariant, object> = {
  add: { backgroundColor: '#CC0099' },
  minus: { backgroundColor: '#C0392B' },
  reset: { backgroundColor: '#7F8C8D' },
};

const CLICK_SOUND_URL = 'https://www.myinstants.com/media/sounds/minecraft-click-cropped.mp3';
const EXPLOSION_SOUND_URL = 'https://www.myinstants.com/media/sounds/big-explosion.mp3';

async function playSound(uri: string) {
  try {
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true }
    );
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (e) {
    // silently fail if sound can't load
  }
}
//button component
export function CounterButton({ label, variant, onPress }: CounterButtonProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handlePress = () => {
    playSound(CLICK_SOUND_URL);
    onPress();
  };

  const startHold = () => {
    // keep counting with click sound every 100ms while holding
    intervalRef.current = setInterval(() => {
      playSound(CLICK_SOUND_URL);
      onPress();
    }, 100);
  };

  const stopHold = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      // magplay explosion kapag releasing after a long press
      playSound(EXPLOSION_SOUND_URL);
    }
  };
// button component with hold functionality
  return (
    <TouchableOpacity
      style={[styles.btn, variantStyles[variant]]}
      onPress={handlePress}
      onLongPress={startHold}
      onPressOut={stopHold}
      delayLongPress={300}
      activeOpacity={0.8}
    >
      <Text style={styles.btnText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 24,
    padding: 14,
    alignItems: 'center',
    marginVertical: 4,
  },
  btnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
});