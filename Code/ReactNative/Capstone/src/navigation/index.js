import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import _ from 'lodash'
import { 
    Login, 
    Home, 
    Filter, 
    Profile, 
    PetProfile, 
    Chat, 
    Setting, 
    Privacy, 
    Feedback, 
    Loading,
    Test 
} from '../container';
import { color } from '../utility';

const Stack = createStackNavigator();

const LoginStack = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerTitleAlign: 'center',
            headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 22
            },
            headerTintColor: color.PINK      
        }}>
            <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
        </Stack.Navigator>
    )
}

const HomeStack = () => {
    return (
        <Stack.Navigator 
            screenOptions={{
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 22
            },
            headerTintColor: color.PINK      
        }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="Loading" component={Loading} />
            <Stack.Screen name="Filter" component={Filter} options={{ title: 'Search' }} />
            <Stack.Screen name="Profile" component={Profile} options={{ title: 'Trang cá nhân' }} />
            <Stack.Screen name="PetProfile" component={PetProfile} options={{ title: 'Trang cá nhân pet' }} />
            <Stack.Screen name="Setting" component={Setting} options={{ title: 'Settings' }} />
            <Stack.Screen name="Privacy" component={Privacy} />
            <Stack.Screen name="Feedback" component={Feedback} />

            <Stack.Screen name="Test" component={Test} />
        </Stack.Navigator>
    )
}

function NavContainer() {
    const userInfo = useSelector(state => state.auth.userInfo)

    return (
        <NavigationContainer>
            { 
                _.isEmpty(userInfo) ? <LoginStack /> : <HomeStack />
            }
        </NavigationContainer>

    );
};

export default NavContainer