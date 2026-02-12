import { ReactNode } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type AppBackgroundProps = {
  children: ReactNode;
};

const backgroundSource = require('../../../assets/Kheya_bg_v2.png');

export const AppBackground = ({ children }: AppBackgroundProps) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#020617', '#0f172a', '#134e4a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <ImageBackground
        source={backgroundSource}
        style={StyleSheet.absoluteFill}
        imageStyle={styles.image}
      />
      <View style={styles.overlay} />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  image: {
    resizeMode: 'cover',
    opacity: 0.75,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 23, 0.55)',
  },
  content: {
    flex: 1,
  },
});
