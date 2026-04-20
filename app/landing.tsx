import { Platform } from 'react-native';
import LandingWeb from '../components/LandingWeb';
import LandingNative from '../components/LandingNative';

export default function Index() {
  if (Platform.OS === 'web') {
    return <LandingWeb />;
  }
  return <LandingNative />;
}
