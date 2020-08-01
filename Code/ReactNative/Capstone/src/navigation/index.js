import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Fontisto from 'react-native-vector-icons/Fontisto'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash'
import {
    Login,
    PetSetting,
    Home,
    Filter,
    Profile,
    PetProfile,
    ChatDashboard,
    Setting,
    Privacy,
    Feedback,
    EditPetProfile,
    Match
} from '../container';
import { color } from '../utility';
import Chat from '../container/Chat';
import { setUniqueValue } from '../utility/constants';
import { setAuthToken, URL_BASE, token } from '../api/config';
import Axios from 'axios';
import { saveActivePet, savePets } from '../redux/actions/authActions';
import { DrawerContent } from '../components'

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const Drawer = createDrawerNavigator();
const ChatStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const FilterStack = createStackNavigator();
const ChatboxStack = createStackNavigator();
const SettingStack = createStackNavigator();

const MainTabScreen = () => {
    const dispatch = useDispatch();

    const loadPets = async () => {
        Axios.get(`${URL_BASE}pets`, {
            headers: {
                Authorization: token
            }
        }).then(res => {
            console.log('pets: ', res.data)
            dispatch(savePets(res.data));
            const activePet = res.data.filter(pet => pet.is_active == 1);
            if (activePet.length == 1) {
                dispatch(saveActivePet(activePet[0]))
            }
        }).catch(e => {
            console.log("Api call error!", e)
        })
    }

    useEffect(() => {
        loadPets()
    }, [])

    return (
        <Tab.Navigator
            activeColor={color.WHITE}
        >
            <Tab.Screen
                name="Home"
                component={HomeStack}
                options={{
                    tabBarLabel: 'Home',
                    tabBarColor: color.PINK,
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home" color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Messages"
                component={ChatStackScreen}
                options={{
                    tabBarLabel: 'Messages',
                    tabBarColor: color.PINK,
                    tabBarIcon: ({ color }) => (
                        <Fontisto name="hipchat" color={color} size={22} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileStackScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarColor: color.PINK,
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="ios-person" color={color} size={27} />
                    ),
                }}
            />
            <Tab.Screen
                name="Filter"
                component={FilterStackScreen}
                options={{
                    tabBarLabel: 'Filter',
                    tabBarColor: color.PINK,
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="ios-search" color={color} size={27} />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}

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
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

const ChatStackScreen = ({ navigation }) => {
    return (
        <ChatStack.Navigator
            screenOptions={{
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 22
                },
                headerTintColor: color.PINK
            }}>
            <ChatStack.Screen name="ChatDashboard" component={ChatDashboard}
                options={{
                    title: 'Dashboard',
                    headerLeft: () => (
                        <Ionicons.Button name='md-menu' size={25} backgroundColor='#fff' color={color.PINK}
                            onPress={() => navigation.openDrawer()}
                        />
                    ),
                }}
            />
        </ChatStack.Navigator>
    )
}
const ProfileStackScreen = ({ navigation }) => {
    return (
        <ProfileStack.Navigator
            screenOptions={{
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 22
                },
                headerTintColor: color.PINK
            }}>
            <ProfileStack.Screen name="Profile" component={Profile}
                options={{
                    title: 'Profile',
                    headerLeft: () => (
                        <Ionicons.Button name='md-menu' size={25} backgroundColor='#fff' color={color.PINK}
                            onPress={() => navigation.openDrawer()}
                        />
                    ),
                }}
            />
            <ProfileStack.Screen name="PetSetting" component={PetSetting} options={{ title: 'New Pet' }} />
            <ProfileStack.Screen name="PetProfile" component={PetProfile} options={{ title: 'Pet Profile' }} />
            <ProfileStack.Screen name="EditPetProfile" component={EditPetProfile} options={{ title: 'Edit Pet' }} />
        </ProfileStack.Navigator>
    )
}

const FilterStackScreen = ({ navigation }) => {
    return (
        <FilterStack.Navigator
            screenOptions={{
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 22
                },
                headerTintColor: color.PINK
            }}>
            <FilterStack.Screen name="Filter" component={Filter}
                options={{
                    title: 'Filter',
                    headerLeft: () => (
                        <Ionicons.Button name='md-menu' size={25} backgroundColor='#fff' color={color.PINK}
                            onPress={() => navigation.openDrawer()}
                        />
                    ),
                }}
            />
        </FilterStack.Navigator>
    )
}

const ChatboxStackScreen = () => {
    return (
        <ChatboxStack.Navigator
            screenOptions={{
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 22
                },
                headerTintColor: color.PINK
            }}>
            <ChatboxStack.Screen name="Chat" component={Chat} />
        </ChatboxStack.Navigator>
    )
}
const SettingStackScreen = ({ navigation }) => {
    return (
        <SettingStack.Navigator
            screenOptions={{
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 22
                },
                headerTintColor: color.PINK
            }}>
            <SettingStack.Screen name="Setting" component={Setting} options={{
                title: 'Settings',
                headerLeft: () => (
                    <Ionicons.Button
                        name='arrow-back' backgroundColor={color.WHITE} size={25} color={color.PINK}
                        onPress={() => navigation.navigate('Home')}
                    />
                )
            }} />
            <SettingStack.Screen name="Privacy" component={Privacy} />
            <SettingStack.Screen name="Feedback" component={Feedback} />
        </SettingStack.Navigator>
    )
}

const HomeStack = ({ navigation }) => {
    const pet_active = useSelector(state => state.auth.pet_active)

    return (
        <Stack.Navigator
            initialRouteName='Home'
            screenOptions={{
                headerShown: true,
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 22
                },
                headerTintColor: color.PINK
            }}>
            <Stack.Screen name="Home" component={Home}
                options={{
                    title: '',
                    headerLeft: () => (
                        <Ionicons.Button name='md-menu' size={25} backgroundColor='#fff' color={color.PINK}
                            onPress={() => navigation.openDrawer()}
                        />
                    ),
                    headerRight: () => {
                        if (pet_active.name) {
                            return (
                                <View style={styles.headerRight}>
                                    <Text style={styles.petActiveName}>{pet_active.name}</Text>
                                    <Image source={pet_active.avatar ? { uri: pet_active.avatar } : require('../../images/avatar.jpg')} style={styles.petActiveImg} />
                                    <View style={styles.activeIcon}></View>
                                </View>
                            )
                        }
                    }
                }}
            />
            <Stack.Screen name="Match" component={Match} />
        </Stack.Navigator>
    )
}

const NavContainer = () => {
    const user = useSelector(state => state.auth.user)
    const token = useSelector(state => state.auth.token)
    if (!_.isEmpty(user)) {
        setUniqueValue(user.uid)
    }
    if (!_.isEmpty(token)) {
        setAuthToken(token)
    }


    return (
        <NavigationContainer>
            {
                _.isEmpty(token)
                    ? <LoginStack />
                    : (<Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
                        <Drawer.Screen name="MainTabScreen" component={MainTabScreen} />
                        <Drawer.Screen name="ChatboxStackScreen" component={ChatboxStackScreen} />
                        <Drawer.Screen name="SettingStackScreen" component={SettingStackScreen} />
                    </Drawer.Navigator>)
            }
        </NavigationContainer>

    );
};

const styles = StyleSheet.create({
    headerRight: {
        flexDirection: 'row',
        height: '100%',
        paddingRight: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    petActiveName: {
        paddingRight: 10,
        fontSize: 17, color:
            color.PINK,
        fontWeight: "bold"
    },
    petActiveImg: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    activeIcon: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#23da02',
        position: 'absolute',
        bottom: 2,
        right: 10,
        borderWidth: 1,
        borderColor: '#fff'
    }

})

export default NavContainer;