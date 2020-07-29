import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Fontisto from 'react-native-vector-icons/Fontisto'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useSelector } from 'react-redux';
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
import { setAuthToken } from '../api/config';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => (
  <Tab.Navigator
    initialRouteName="Messages"
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

const HomeStack = () => {
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
      <Stack.Screen name="Home" component={MainTabScreen} options={{ headerShown: false }} />
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
        _.isEmpty(token) ? <LoginStack /> : <HomeStack />
      }
    </NavigationContainer>

  );
};

export default NavContainer
