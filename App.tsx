import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator'; // Import your main App Navigator
import { 
    ActivityIndicator, 
    Alert, 
    Image, 
    StyleSheet, 
    Text,       
    TouchableOpacity, 
    View        
} from 'react-native'; 
import firebase from '@react-native-firebase/app';
import { ModalProvider } from './src/context/modalContext';


const App = () => {

  const [firebaseReady, setFirebaseReady] = useState(false); 

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkInitialization = () => {
      console.log('Checking Firebase initialization status...');
      console.log('Current firebase.apps.length:', firebase.apps.length); // Log nilai ini

      if (firebase.apps.length > 0) {
        console.log('Firebase now detected as initialized (via interval).');
        setFirebaseReady(true);
        if (intervalId) {
          clearInterval(intervalId); // Hentikan interval setelah siap
        }
      } else {
        console.log('Firebase still not detected, retrying...');
      }
    };

    // Panggil sekali saat mount, lalu ulangi dengan interval
    intervalId = setInterval(checkInitialization, 500); // Coba setiap 500ms

    // Cleanup interval saat komponen unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  if (!firebaseReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading Firebase...</Text>
      </View>
    );
  }

  return (
    // NavigationContainer manages your app's navigation tree.
    // All navigators must be wrapped inside a NavigationContainer.
    <ModalProvider>
      <NavigationContainer>
        {/* AppNavigator defines the stack of screens for your application. */}
        <AppNavigator />
      </NavigationContainer>
    </ModalProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});


export default App;
