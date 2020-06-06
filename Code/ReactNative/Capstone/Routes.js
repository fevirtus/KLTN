import React from 'react';
import 'react-native-gesture-handler'
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './src/components/Login';

const Stack = createStackNavigator();

export const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Login" component={Login} />
        {/* <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} options={{ title: 'Trang cá nhân' }} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};