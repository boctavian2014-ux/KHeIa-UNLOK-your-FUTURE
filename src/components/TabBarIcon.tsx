import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = {
  focused: boolean;
  color: string;
  size: number;
  activeName: keyof typeof Ionicons.glyphMap;
  inactiveName: keyof typeof Ionicons.glyphMap;
};

export function TabBarIcon({
  focused,
  color,
  size,
  activeName,
  inactiveName,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.08 : 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  }, [focused, scale]);

  const name = focused ? activeName : inactiveName;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
}
