import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';

import { ScreenContent } from '@/components/ScreenContent';

import '~/global.css';

export default function App() {
  return (
    <>
      {/*<ScreenContent title="Home" path="App.tsx" />*/}
      {/*<StatusBar style="auto" />*/}
      <Text className="text-xl color-blue-600">ajs</Text>
    </>
  );
}
