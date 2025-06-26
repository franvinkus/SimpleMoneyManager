import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/splashscreen'; 
import HomeScreen from '../screens/homescreen';     
import CameraScreen from '../screens/camerascreen';
import PreviewScreen from '../screens/previewscreen';
import { RootStackParamList } from './types';       // Impor tipe rute

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }} // Sembunyikan header navigasi untuk splash screen
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Beranda', headerShown: false }} // Contoh: beri judul, sembunyikan header jika ingin custom
      />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ headerShown: false }} // atau true jika ingin ada header
      />
      <Stack.Screen
        name="Preview"
        component={PreviewScreen}
        options={{ headerShown: false }} // atau true jika ingin ada header
      />
      {/* Di sini Anda bisa menambahkan Stack.Screen lain untuk halaman-halaman aplikasi Anda */}
      {/* <Stack.Screen name="ScanReceipt" component={ScanReceiptScreen} /> */}
    </Stack.Navigator>
  );
};

export default AppNavigator;