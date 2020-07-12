import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import _ from 'lodash'
import {
    Login,
    AccountSetting,
    PetSetting,
    Home,
    Filter,
    Profile,
    PetProfile,
    Chat,
    Setting,
    Privacy,
    Feedback,
    Test
} from '../container';
import { color } from '../utility';

const Stack = createStackNavigator();

const LoginStack = () => {
    return (
        <Stack.Navigator 
            screenOptions={{
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

const HomeStack = ({ userInfo }) => {
    return (
        <Stack.Navigator
            initialRouteName={userInfo.name === null ? 'AccountSetting' : 'Home'}
            screenOptions={{
                headerShown: true,
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 22
                },
                headerTintColor: color.PINK
            }}>
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="AccountSetting" component={AccountSetting} />   
            <Stack.Screen name="PetSetting" component={PetSetting} />
            <Stack.Screen name="Filter" component={Filter} options={{ title: 'Search' }} />
            <Stack.Screen name="Profile" component={Profile} options={{ title: 'Trang cá nhân' }} />
            <Stack.Screen name="PetProfile" component={PetProfile} options={{ title: 'Trang cá nhân pet' }} />
            <Stack.Screen name="Setting" component={Setting} options={{ title: 'Settings' }} />
            <Stack.Screen name="Privacy" component={Privacy} />
            <Stack.Screen name="Feedback" component={Feedback} />
            {/* <Stack.Screen name="Test" component={Test} /> */}
        </Stack.Navigator>
    )
}

function NavContainer() {
    const userInfo = useSelector(state => state.auth.userInfo)

    return (
        <NavigationContainer>
            {
                _.isEmpty(userInfo) ? <LoginStack /> : <HomeStack userInfo={userInfo} />
            }
        </NavigationContainer>

    );
};

export default NavContainer
