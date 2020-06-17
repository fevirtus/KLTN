import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './src/components/LoginPage';
import Home from './src/components/HomePage';
import Profile from './src/components/ProfileGeneral';
import PetProfile from './src/components/PetProfile';
import Test from './src/components/TestImage';

const Stack = createStackNavigator();

export const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PetProfile">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Test" component={Test} />
        <Stack.Screen name="Profile" component={Profile} options={{ title: 'Trang cá nhân' }} />
        <Stack.Screen name="PetProfile" component={PetProfile} options={{ title: 'Trang cá nhân pet' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
