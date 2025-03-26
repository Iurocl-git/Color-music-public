// app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
  // redirect('(tabs)/home'); // или просто '/login', '/profile' и т.д.
  return <Redirect href="./app/(tabs)/index" />;
}
