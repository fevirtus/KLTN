import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { GoogleSignin } from '@react-native-community/google-signin'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { color } from '../../utility';
import { useDispatch } from 'react-redux';
import { saveUser } from '../../redux/actions/authActions';
import { startLoading, stopLoading } from '../../redux/actions/loadingAction';
import { RequestApiAsyncPost, setAuthToken, URL_BASE } from '../../api/config'
import auth from '@react-native-firebase/auth';
import { AddUser } from '../../network';
import { setUniqueValue } from '../../utility/constants';
import Axios from 'axios';
import { saveToken } from '../../redux/actions/tokenAction';

const GoogleLogin = () => {
    const dispatch = useDispatch()

    GoogleSignin.configure({
        webClientId: '57907873541-r853h7dljsh3lbjf94atj7tuntu4qpm4.apps.googleusercontent.com'
    })

    const _signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            // Get the users ID token
            const { idToken } = await GoogleSignin.signIn();
            // Create a Google credential with the token

            dispatch(startLoading())
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            // Sign-in the user with the credential
            const userInfo = await auth().signInWithCredential(googleCredential);
            console.log('OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO', userInfo.additionalUserInfo.isNewUser)
            const { displayName, email, uid } = userInfo.user;
            setUniqueValue(uid);
            if (userInfo.additionalUserInfo.isNewUser) {
                AddUser(displayName, email, uid, '');
            }

            const res = await Axios.post(`${URL_BASE}register`, { name: displayName, email: email, uid: uid })
            console.log(res.data)

            // if (res.data.data.is_block == 1) {
            //     Alert.alert('Error!', `Your account has been locked, the remaining time is ${res.data.data.remainTime}`)
            // } else {
            //     const { pd_token, data } = res.data
            //     setAuthToken(pd_token)
            //     dispatch(saveUser(data))
            //     dispatch(saveToken(pd_token))
            // }
            const { pd_token, data } = res.data
            setAuthToken(pd_token)
            dispatch(saveUser(data))
            dispatch(saveToken(pd_token))
            dispatch(stopLoading())

        } catch (error) {
            console.log(error)
            if (error.code === 'auth/email-already-in-use') {
                Alert.alert('Error', 'That email address is already in use!')
            }

            if (error.code === 'auth/invalid-email') {
                Alert.alert('Error', 'That email address is invalid!')
            }

            if (error.code === 'auth/weak-password') {
                Alert.alert('Error', 'Password should be at least 6 characters ')
            }
            dispatch(stopLoading())
        }
    }

    return (
        <View>
            <TouchableOpacity style={styles.formLogin} onPress={_signIn}>
                <FontAwesome5 name="google" size={18} color="white" style={styles.google} />
                <View style={styles.textWrapper}>
                    <Text style={styles.text}>
                        LOG IN WITH GOOGLE
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    formLogin: {
        height: 45,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: color.RED
    },
    google: {
        width: '20%',
        marginLeft: 10,
        marginTop: 1
    },
    textWrapper: {
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    text: {
        fontSize: 18,
        color: color.WHITE,
        fontWeight: "bold"
    }
})

export default GoogleLogin

