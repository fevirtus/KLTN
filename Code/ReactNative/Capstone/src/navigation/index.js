import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { Login, Home, Profile, PetProfile, Test } from '../container';
import { color } from '../utility';

const Stack = createStackNavigator();

function NavContainer() {
    return (
        <NavigationContainer>
            <Stack.Navigator 
                initialRouteName="PetProfile"
                screenOptions={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        fontSize: 22
                    },
                    headerTintColor: color.PINK      
                }}
            >
                <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Profile" component={Profile} options={{ title: 'Trang cá nhân' }} />
                <Stack.Screen name="PetProfile" component={PetProfile} options={{ title: 'Trang cá nhân pet' }} />

                <Stack.Screen name="Test" component={Test} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default NavContainer