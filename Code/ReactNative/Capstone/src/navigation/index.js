import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Animated from 'react-native-reanimated'
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
import { saveActivePet, savePets, saveUser } from '../redux/actions/authActions';
import { DrawerContent } from '../components'
import { startLoading, stopLoading } from '../redux/actions/loadingAction';

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
    const [done, setDone] = useState(false)
    const user = useSelector(state => state.auth.user)

    const loadPets = async () => {
        console.log('load pets: --------------')
        await Axios.get(`${URL_BASE}pets`, {
            headers: {
                Authorization: token
            }
        }).then(res => {
            dispatch(savePets(res.data));
            const activePet = res.data.filter(pet => pet.is_active == 1);
            if (activePet.length == 1) {
                dispatch(saveActivePet(activePet[0]))
            }
        }).catch(e => {
            console.log("Api call error!", e)
        })
    }

    const loadUser = async () => {
        console.log('load user:----------------- ')
        await Axios.get(`${URL_BASE}users/currentUser`, {
            headers: {
                Authorization: token
            }
        }).then(res => {
            // if(res.data[0].is_block == 1){
            //     Alert.alert(
            //         `YOU `,
            //         `Are you sure to delete ${name}?`,
            //         [
            //             {
            //                 text: 'Cancel',
            //                 onPress: () => console.log('User cancel delete!'),
            //                 style: 'cancel'
            //             },
            //             {
            //                 text: 'OK',
            //                 onPress: _delete
            //             }
            //         ],
            //         { cancelable: false }
            //     )
            // }

            dispatch(saveUser(res.data[0]));
            setUniqueValue(res.data[0].uid)
        }).catch(e => {
            console.log("Api call error!", e)
        })
    }

    const loadData = async () => {
        dispatch(startLoading())
        if (!user.id) { await loadUser() }
        await loadPets()
        dispatch(stopLoading())
        setDone(true)
    }

    useEffect(() => {
        loadData()
    }, [])

    return !done ? null : (
        <Tab.Navigator
            activeColor={color.WHITE}
            initialRouteName='Home'
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
                headerTintColor: color.PINK,
                // headerTitle: null,
                // headerTransparent: true
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

const HomeStack = ({ navigation, style }) => {
    const pet_active = useSelector(state => state.auth.pet_active)

    return (
        <Animated.View style={[styles.stack, style]}>
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
            </Stack.Navigator>
        </Animated.View>
    )
}

const NavContainer = () => {
    const token = useSelector(state => state.token.token)
    const [progress, setProgress] = useState(new Animated.Value(0))
    if (!_.isEmpty(token)) {
        setAuthToken(token)
    }

    // Create animation for screen scale
    const scale = Animated.interpolate(progress, {
        inputRange: [0, 1],
        outputRange: [1, 0.8]
    })

    const screenStyles = { transfrom: [{ scale }] }

    return (
        <NavigationContainer>
            {
                _.isEmpty(token)
                    ? <LoginStack />
                    : (<Drawer.Navigator
                        drawerType="slide"
                        overlayColor={color.TRANSPARENT}
                        // drawerContentOptions={{
                        //     activeBackgroundColor: color.TRANSPARENT,
                        //     activeTintColor: color.GREEN,

                        //     inactiveTintColor: color.GREEN
                        // }}
                        // // Set the scene background to transparent
                        // sceneContainerStyle={{ backgroundColor: color.TRANSPARENT }}
                        drawerContent={props => {
                            setProgress(props.progress);
                            return <DrawerContent {...props} />
                        }}
                        initialRouteName="Home"
                    >

                        <Drawer.Screen name="MainTabScreen" component={MainTabScreen} />
                        {/* <Drawer.Screen name="Home">
                            {props => <HomeStack {...props} style={screenStyles}/>}
                        </Drawer.Screen> */}
                        <Drawer.Screen name="ChatboxStackScreen" component={ChatboxStackScreen} />
                        <Drawer.Screen name="SettingStackScreen" component={SettingStackScreen} />
                        <Drawer.Screen name="Match" component={Match} />
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
    },
    stack: {
        flex: 1,
        // shadowColor: '#FFF',
        // shadowOffset: {
        //     width: 0,
        //     height: 8,
        // },
        // shadowOpacity: 0.44,
        // shadowRadius: 10.32,
        // elevation: 5,
    },
})

export default NavContainer;