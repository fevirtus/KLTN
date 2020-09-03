import React from 'react';
import { View, StyleSheet } from 'react-native'
import {
    Avatar,
    Drawer,
    Title,
    Caption
} from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Fontisto from 'react-native-vector-icons/Fontisto'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { useSelector, useDispatch } from 'react-redux'
import { GoogleSignin } from '@react-native-community/google-signin';
import { LoginManager } from 'react-native-fbsdk';
import { clearToken } from '../../redux/actions/tokenAction';
import { color } from '../../utility'
import auth from '@react-native-firebase/auth';
import { clearAuth } from '../../redux/actions/authActions';

const DrawerContent = (props) => {
    const user = useSelector(state => state.auth.user)
    const vip = useSelector(state => state.vip.vip)
    const dispatch = useDispatch()

    const logout = async () => {
        console.log(auth().currentUser)

        if (auth().currentUser && auth().currentUser.providerData.providerId == 'facebook.com') {
            await LoginManager.logOut().then(() => { console.log('Logout') }).catch(e => console.log('ERROR FB logout()', e))
        } else {
            await GoogleSignin.signOut().then(() => { console.log('Logout') }).catch(e => console.log('ERROR GG logout()', e))
        }
        auth().signOut()
            .then(() => {
                dispatch(clearToken())
                dispatch(clearAuth())
                props.navigation.closeDrawer()
            })
            .catch(e => {
                // alert(e)
                dispatch(clearToken())
                dispatch(clearAuth())
                console.log(e)
            })
    }

    return (
        <LinearGradient colors={vip == 1 ? [color.YELLOW, color.WHITE, '#fafdcb'] : [color.WHITE, color.WHITE]} style={styles.drawerContent}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={styles.userInfo}>
                            <Avatar.Image
                                source={user.avatar ? { uri: user.avatar } : require('../../../images/no-image.jpg')}
                                size={55}
                            />
                            <View style={styles.userInfoText}>
                                <Title style={vip == 1 ? [styles.title, { color: '#cf1b1b' }] : styles.title}>{user.name}</Title>
                                <Caption style={styles.caption}>{user.email}</Caption>
                            </View>
                        </View>
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon
                                    name="home-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Home"
                            onPress={() => { props.navigation.navigate('Home') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon
                                    name="account-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Account"
                            onPress={() => { props.navigation.navigate('Profile') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Fontisto
                                    name="hipchat"
                                    color={color}
                                    size={21}
                                />
                            )}
                            label="Chat"
                            onPress={() => { props.navigation.navigate('Messages') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Ionicons
                                    name="ios-search"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Search"
                            onPress={() => { props.navigation.navigate('Filter') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <SimpleLineIcons
                                    name="chart"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Ranking"
                            onPress={() => { props.navigation.navigate('RankingStackScreen') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <FontAwesome
                                    name="diamond"
                                    color={color}
                                    size={21}
                                />
                            )}
                            label="Premium"
                            onPress={() => { props.navigation.navigate('PremiumStackScreen') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Ionicons
                                    name="settings"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label="Settings"
                            onPress={() => { props.navigation.navigate('SettingStackScreen') }}
                        />
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                    icon={({ color, size }) => (
                        <Icon
                            name="exit-to-app"
                            color={color}
                            size={size}
                        />
                    )}
                    label="Sign Out"
                    onPress={logout}
                />
            </Drawer.Section>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1
    },
    userInfoSection: {
        paddingLeft: 14,
    },
    userInfo: {
        flexDirection: 'row',
        marginTop: 15
    },
    userInfoText: {
        flexDirection: 'column',
        marginLeft: 12,
        borderBottomWidth: 0.6,
        borderBottomColor: color.LIGHT_LIGHT_GRAY
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: color.LIGHT_LIGHT_GRAY,
        borderTopWidth: 1
    }
});

export default DrawerContent