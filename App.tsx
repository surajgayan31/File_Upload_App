
import DashBoard from './src/screens/dashboard/DashBoard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color } from './src/styles/styles';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

     <SafeAreaView style={{ flex: 1 }}>
      <DashBoard />
        {/* <StatusBar style="light" backgroundColor="#DB183F" /> */}
        <StatusBar style="light" backgroundColor="#DB183F" translucent={false} />

     </SafeAreaView>
    </GestureHandlerRootView>
  );
}


