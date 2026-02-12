import { StyleSheet, Text, View } from 'react-native';

export const ConfettiOverlay = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Confetti</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 48,
  },
});
