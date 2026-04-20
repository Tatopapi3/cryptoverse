import { View, Text, StyleSheet } from 'react-native';

export default function LandingNative() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cryptoverse</Text>
      <Text style={styles.sub}>Learn. Track. Explore. Stay Connected.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050d1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 2,
  },
  sub: {
    marginTop: 12,
    fontSize: 16,
    color: '#a0aec0',
    letterSpacing: 1,
  },
});
