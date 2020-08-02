import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'
import { color } from '../../utility';
import { useDispatch } from 'react-redux';
import { saveUser, saveToken } from '../../redux/actions/authActions';
import { RequestApiAsyncPost, setAuthToken } from '../../api/config'
import AsyncStorage from '@react-native-community/async-storage';
import auth from '@react-native-firebase/auth';
import { AddUser } from '../../network';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { setUniqueValue } from '../../utility/constants';
import { stopLoading, startLoading } from '../../redux/actions/loadingAction';

const FacebookLogin = () => {
    const dispatch = useDispatch()

    const _signIn = async () => {
        try {
            const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
            if (result.isCancelled) {
                throw 'User cancelled the login process';
            }
            dispatch(startLoading())
            // Once signed in, get the users AccesToken
            const data = await AccessToken.getCurrentAccessToken();
            if (!data) {
                throw 'Something went wrong obtaining access token';
            }
            // Create a Firebase credential with the AccessToken
            const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
            // Sign-in the user with the credential
            const userInfo = await auth().signInWithCredential(facebookCredential);
            console.log(userInfo)

            const { displayName, email, uid } = userInfo.user;
            setUniqueValue(uid);
            if (userInfo.additionalUserInfo.isNewUser) {
                AddUser(displayName, email, uid, '');
            }
            RequestApiAsyncPost('register', 'POST', {}, { name: displayName, email: email, uid: uid })
                .then((res) => {
                    // Save to AsyncStorage
                    // Set token to AsyncStorage
                    const { pd_token, data } = res.data
                    console.log(res.data.pd_token)
                    // Set token to Auth headers
                    // dispatch(saveToken(pd_token))
                    // await AsyncStorage.setItem('token', pd_token)
                    setAuthToken(pd_token)
                    // Save user info
                    dispatch(saveUser(data))
                    dispatch(saveToken(pd_token))
                    dispatch(stopLoading())
                }).catch((error) => {
                    console.log("Api call error")
                    dispatch(stopLoading())
                    alert(error.message)
                })
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                Alert.alert('Error', 'That email address is already in use!')
            }

            if (error.code === 'auth/invalid-email') {
                Alert.alert('Error', 'That email address is invalid!')
            }

            if (error.code === 'auth/weak-password') {
                Alert.alert('Error', 'Password should be at least 6 characters ')
            }

            console.error(error);
            dispatch(stopLoading())
        }
    }

    return (
        <View>
            <TouchableOpacity style={styles.formLogin} onPress={_signIn}>
                <Entypo name="facebook" size={18} color='white' style={styles.facebook} />
                <Text style={styles.text}>
                    LOG IN WITH FACEBOOK
                    </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    formLogin: {
        marginTop: 15,
        height: 45,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: color.BLUE,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    facebook: {
        marginLeft: 10,
        marginRight: 25,
        marginTop: 1
    },
    text: {
        fontSize: 18,
        color: color.WHITE,
        fontWeight: "bold"
    }
});

export default FacebookLogin

