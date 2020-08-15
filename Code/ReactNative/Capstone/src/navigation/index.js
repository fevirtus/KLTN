import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Text, View, Image, StyleSheet, Alert } from 'react-native';
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
    ProfileUserFilter,
    ProfilePetFilter,
    Profile,
    CardProfile,
    PetProfile,
    ChatDashboard,
    Setting,
    Privacy,
    Feedback,
    EditPetProfile,
    Match,
    Premium,
    Payment,
    Banking
} from '../container';
import { color } from '../utility';
import Chat from '../container/Chat';
import { setUniqueValue, uuid } from '../utility/constants';
import { setAuthToken, URL_BASE, token } from '../api/config';
import Axios from 'axios';
import { saveActivePet, savePets, saveUser } from '../redux/actions/authActions';
import { DrawerContent } from '../components'
import { startLoading, stopLoading } from '../redux/actions/loadingAction';
import { saveToken } from '../redux/actions/tokenAction';
import database from '@react-native-firebase/database';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const Drawer = createDrawerNavigator();
const ChatStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const FilterStack = createStackNavigator();
const ChatboxStack = createStackNavigator();
const SettingStack = createStackNavigator();
const PremiumStack = createStackNavigator();

const MainTabScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [done, setDone] = useState(false)
    const user = useSelector(state => state.auth.user)
    const [match, setMatch] = useState(0);

    const loadPets = async () => {
        try {
            console.log('load pets: --------------')
            const res = await Axios.get(`${URL_BASE}pets`, {
                headers: {
                    Authorization: token
                }
            })
            dispatch(savePets(res.data));
            const activePet = res.data.filter(pet => pet.is_active == 1);
            if (activePet.length == 1) {
                dispatch(saveActivePet(activePet[0]))
            }
        } catch (error) {
            throw error
        }


    }

    const loadUser = async () => {
        try {
            console.log('load user:----------------- ')

            const res = await Axios.get(`${URL_BASE}users/currentUser`, {
                headers: {
                    Authorization: token
                }
            });

            if (res.data.is_block == 1) {
                throw `Your account has been locked, the remaining time is ${res.data.remainTime}`
            } else {
                dispatch(saveUser(res.data));
                setUniqueValue(res.data.uid)
            }
        } catch (error) {
            throw error
        }
    }

    const loadData = async () => {
        try {
            dispatch(startLoading())
            if (!user.id) {
                await loadUser()
                await loadPets()
            }
            else {
                await loadPets()
            }
            loadNewMatch()
            dispatch(stopLoading())
            setDone(true)
        } catch (error) {
            dispatch(stopLoading())
            Alert.alert(
                `Error!`,
                `${error}`,
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            dispatch(saveToken(''))
                        }
                    }
                ],
                { cancelable: false }
            )
        }
    }

    const loadNewMatch = async () => {
        try {
            console.log('loadNewMatch ..............')
            await database()
                .ref('matches/' + uuid)
                .on('value', snapshot => {
                    let newMatch = 0;
                    snapshot.forEach(child => {
                        if (!child.val().seen) {
                            newMatch++;
                        }
                    })
                    setMatch(newMatch)
                })
        } catch (error) {
            console.log(error)
        }
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
                        <View>
                            <Fontisto name="hipchat" color={color} size={22} />
                            {match > 0 ? <Text style={styles.numOfMatch}>{match}</Text> : null}
                        </View>

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
                        <Ionicons.Button name='md-menu' size={28} backgroundColor={color.TRANSPARENT} color={color.PINK}
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
            <FilterStack.Screen name="ProfileUserFilter" component={ProfileUserFilter}
                options={{
                    headerTitle: null,
                    headerTransparent: true,
                    headerTintColor: color.PINK
                }} />
            <FilterStack.Screen name="ProfilePetFilter" component={ProfilePetFilter}
                options={{
                    headerTitle: null,
                    headerTransparent: true,
                    headerTintColor: color.PINK
                }} />
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
            }}
        >
            <ChatboxStack.Screen name="Chat" component={Chat} />
        </ChatboxStack.Navigator>
    )
}

const PremiumStackScreen = ({ navigation }) => {
    return (
        <PremiumStack.Navigator
            screenOptions={{
                headerTitle: null,
                headerTransparent: true,
                headerTintColor: color.PINK
            }}>
            <PremiumStack.Screen
                name="Premium"
                component={Premium}
                options={{
                    title: 'Premium',
                    headerLeft: () => (
                        <Ionicons.Button name='md-menu' size={28} backgroundColor={color.TRANSPARENT} color={color.PINK}
                            onPress={() => navigation.openDrawer()}
                        />
                    ),
                }}
            />
            <PremiumStack.Screen name="Payment" component={Payment} />
            <PremiumStack.Screen name="Banking" component={Banking} />
        </PremiumStack.Navigator>
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
                    headerTitle: null,
                    headerTransparent: true,
                    headerTintColor: color.PINK
                }}>
                <Stack.Screen name="Home" component={Home}
                    options={{
                        title: '',
                        headerLeft: () => (
                            <Ionicons.Button name='md-menu' size={28} backgroundColor={color.TRANSPARENT} color={color.PINK}
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
                <Stack.Screen name="CardProfile" component={CardProfile} />
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
                        initialRouteName="MainTabScreen"
                    >

                        <Drawer.Screen name="MainTabScreen" component={MainTabScreen} />
                        {/* <Drawer.Screen name="Home">
                            {props => <HomeStack {...props} style={screenStyles}/>}
                        </Drawer.Screen> */}
                        <Drawer.Screen name="ChatboxStackScreen" component={ChatboxStackScreen} />
                        <Drawer.Screen name="SettingStackScreen" component={SettingStackScreen} />
                        <Drawer.Screen name="PremiumStackScreen" component={PremiumStackScreen} />
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
        width: 45,
        height: 45,
        borderRadius: 25
    },
    activeIcon: {
        width: 12,
        height: 12,
        borderRadius: 7,
        backgroundColor: '#23da02',
        position: 'absolute',
        bottom: 2,
        right: 8,
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
    numOfMatch: {
        position: 'absolute',
        top: 5,
        right: -5,
        backgroundColor: '#ff0000',
        marginTop: -10,
        color: color.WHITE,
        fontWeight: 'bold',
        borderRadius: 7,
        minWidth: 14,
        height: 14,
        fontSize: 10,
        alignSelf: 'center',
        textAlign: 'center',
        textAlignVertical: 'center',
        padding: 1,
    }
})

export default NavContainer;