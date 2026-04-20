import { Platform } from 'react-native';
import LandingWeb from '../components/LandingWeb';
import LandingNative from '../components/LandingNative';

export default function LandingEntry() {
  return Platform.OS === 'web' ? <LandingWeb /> : <LandingNative />;
}
