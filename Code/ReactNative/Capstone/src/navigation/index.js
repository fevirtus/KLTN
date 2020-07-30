import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
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
  EditPetProfile
} from '../container';
import { color } from '../utility';
import Chat from '../container/Chat';
import { setUniqueValue } from '../utility/constants';
import { setAuthToken, URL_BASE, token } from '../api/config';
import { Text, View, Image, StyleSheet } from 'react-native';
import Axios from 'axios';
import { saveActivePet, savePets } from '../redux/actions/authActions';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => {

  const dispatch = useDispatch();

  const loadPets = async () => {
    console.log('get pets.........')
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
      initialRouteName="Profile"
      activeColor={color.WHITE}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarColor: color.PINK,
          tabBarIcon: ({ color }) => (
            <FontAwesome name="tags" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={ChatDashboard}
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
        component={Profile}
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
        component={Filter}
        options={{
          tabBarLabel: 'Search',
          tabBarColor: color.PINK,
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-search" color={color} size={27} />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          tabBarLabel: 'Setting',
          tabBarColor: color.PINK,
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-settings" color={color} size={27} />
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
      <Stack.Screen name="Home" component={MainTabScreen}
        options={{
          title: '',
          headerLeft: () => (
            <Ionicons.Button name='md-menu' size={25} backgroundColor='#fff' color={color.PINK}
            // onPress={() => navigation.openDrawer()}
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
        }} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="PetSetting" component={PetSetting} options={{ title: 'New Pet' }} />
      <Stack.Screen name="Filter" component={Filter} options={{ title: 'Search' }} />
      <Stack.Screen name="Profile" component={Profile} options={{ title: 'Trang cá nhân' }} />
      <Stack.Screen name="PetProfile" component={PetProfile} options={{ title: 'Trang cá nhân pet' }} />
      <Stack.Screen name="EditPetProfile" component={EditPetProfile} options={{ title: 'Chỉnh sửa pet' }} />
      <Stack.Screen name="Setting" component={Setting} options={{ title: 'Settings' }} />
      <Stack.Screen name="Privacy" component={Privacy} />
      <Stack.Screen name="Feedback" component={Feedback} />
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
        _.isEmpty(token) ? <LoginStack /> :
          <HomeStack />
      }
    </NavigationContainer>

  );
};

export default NavContainer;

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
