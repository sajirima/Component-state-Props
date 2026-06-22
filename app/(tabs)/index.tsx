import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { CounterButton } from './button';

const INITIAL_COUNT = 100;//para isa daaan hindi 0 pag ni reset tas 100 agad display

// Animated count number with pulse + shake on every change
function AnimatedCount({ count }: { count: number }) {
  const scale = useRef(new Animated.Value(1)).current;
  const shakeX = useRef(new Animated.Value(0)).current;
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.35, duration: 80, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(shakeX, { toValue: -6, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: 6, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: -4, duration: 35, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: 4, duration: 35, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: 0, duration: 30, useNativeDriver: true }),
      ]),
    ]).start();
  }, [count]);


  return (
    <Animated.Text
      style={[
        styles.countText,
        { transform: [{ scale }, { translateX: shakeX }] },
      ]}
    >
      {count}
    </Animated.Text>
  );
}

// Child Component
function CounterDisplay({
  count,
  onAdd,
  onMinus,
  onReset,
}: {
  count: number;
  onAdd: () => void;
  onMinus: () => void;
  onReset: () => void;
}) {
  return (
    <View style={styles.childWrapper}>
      <View style={styles.childLabelWrap}>
        <Text style={styles.childLabel}>CHILD COMPONENT (CounterDisplay)</Text>
      </View>

      <View style={styles.childBox}>
        <Text style={styles.childTitle}>Child Component</Text>
        <Text style={styles.propsTag}> PROPS DATA (Galing sa Parent State)</Text>
        <AnimatedCount count={count} />

        <Text style={styles.propsTag}> PROPS FUNCTION (Triggers Parent State)</Text>

        <CounterButton label="Add Count" variant="add" onPress={onAdd} />
        <CounterButton label="Minus Count" variant="minus" onPress={onMinus} />
        <CounterButton label="Reset Count" variant="reset" onPress={onReset} />
      </View>
    </View>
  );
}

// Parent Component
export default function HomeScreen() {
  const [count, setCount] = useState(INITIAL_COUNT);

  const handleAdd = () => setCount(c => c + 1);
  const handleMinus = () => setCount(c => c - 1);

  return (
    <View style={styles.screen}>
    <View style={styles.parentBox}>
      <View style={styles.parentLabelWrap}>
        <Text style={styles.parentLabelText}>PARENT COMPONENT (index.tsx)</Text>
      </View>
      <Text style={styles.parentTitle}>Parent Screen</Text>
      <View style={styles.stateLocker}>
        <Text style={styles.stateLockLabel}>STATE LOCKER</Text>
        <Text style={styles.stateLockValue}>count: {count}</Text>
      </View>
      <CounterDisplay
        count={count}
        onAdd={handleAdd}
        onMinus={handleMinus}
        onReset={() => setCount(INITIAL_COUNT)}
      />
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  //background color ng buong screen
  screen: {
    flex: 1,
    backgroundColor: '#eabee9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  parentLabelWrap: {
    alignItems: 'center',
    marginTop: -30,
    marginBottom: 10,
  },
  //card na medyo bilog kulay
  parentLabelText: {
    backgroundColor: '#b512b2',
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  //burdir
  parentBox: {
    width: '100%',
    padding: 20,
    borderWidth: 2,
    borderColor: '#550745',
    borderStyle: 'solid',
    borderRadius: 14,
    backgroundColor: '#d78aee',
  },
  parentTitle: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 12,
  },
  //state locker color card
  stateLocker: {
    backgroundColor: '#eb44d2',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginBottom: 14,
  },
  // sulat na staten locker
  stateLockLabel: {
    color: '#fefbfb',
    fontSize: 11,
    letterSpacing: 1,
  },
  //yung count dun sa state locker
  stateLockValue: {
    color: '#33128e',
    fontSize: 20,
    fontWeight: '600',
  },
  //burder dun sa count
  childWrapper: {
    marginTop: 8,
  },
  childLabelWrap: {
    alignItems: 'center',
    marginBottom: -12,
    zIndex: 1,
  },
  childBox: {
    borderWidth: 2,
    borderColor: '#790f7e',
    borderRadius: 12,
    padding: 14,
    paddingTop: 20,
  },
  //etu child component text
  childLabel: {
    backgroundColor: '#790f7e',
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
    overflow: 'hidden',
    textAlign: 'center',
  },
  //eto child component title
  childTitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  //props data text
  propsTag: {
    fontSize: 11,
    textAlign: 'center',
    color: '#1565C0',
    fontWeight: '600',
    marginVertical: 4,
  },
  //count text
  countText: {
    fontSize: 56,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 6,
  },
});