import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator'; // Import your main App Navigator

const App = () => {
  return (
    // NavigationContainer manages your app's navigation tree.
    // All navigators must be wrapped inside a NavigationContainer.
    <NavigationContainer>
      {/* AppNavigator defines the stack of screens for your application. */}
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
