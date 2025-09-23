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

  if (firebase.apps.length === 0) {
    // Jika Firebase belum siap, tampilkan layar loading.
    // Ini juga bisa terjadi jika ada masalah di setup native.
    console.error('Firebase has not been initialized. Check native setup.');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Initializing App...</Text>
      </View>
    );
  }

  if (!firebase) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Initializing App...</Text>
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
