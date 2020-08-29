import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'
import { color } from '../../utility';
import { useDispatch } from 'react-redux';
import { saveUser } from '../../redux/actions/authActions';
import { setAuthToken, URL_BASE } from '../../api/config'
import auth from '@react-native-firebase/auth';
import { AddUser } from '../../network';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { setUniqueValue } from '../../utility/constants';
import { stopLoading, startLoading } from '../../redux/actions/loadingAction';
import Axios from 'axios';
import { saveToken } from '../../redux/actions/tokenAction';
// import moment from 'moment'

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
            const data1 = await AccessToken.getCurrentAccessToken();
            if (!data1) {
                throw 'Something went wrong obtaining access token';
            }
            // Create a Firebase credential with the AccessToken
            const facebookCredential = auth.FacebookAuthProvider.credential(data1.accessToken);
            // Sign-in the user with the credential
            const userInfo = await auth().signInWithCredential(facebookCredential);

            const { displayName, email, uid } = userInfo.user;
            setUniqueValue(uid);
            if (userInfo.additionalUserInfo.isNewUser) {
                AddUser(displayName, email, uid, '');
            }

            const res = await Axios.post(`${URL_BASE}register`, { name: displayName, email: email, uid: uid })
            if (res.data.data.is_block == 1) {
                Alert.alert('Error!', `Your account has been locked, the remaining time is ${res.data.data.remainTime}`)
            } else {
                const { pd_token, data } = res.data
                setAuthToken(pd_token)
                dispatch(saveUser(data))
                dispatch(saveToken(pd_token))
            }
            dispatch(stopLoading())
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

            dispatch(stopLoading())
            Alert.alert('Error', error)
        }
    }

    return (
        <View>
            <TouchableOpacity style={styles.formLogin} onPress={_signIn}>
                <Entypo name="facebook" size={18} color='white' style={styles.facebook} />
                <View style={styles.textWrapper}>
                    <Text style={styles.text}>
                        LOG IN WITH FACEBOOK
                    </Text>
                </View>
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
        width: '18%',
        marginLeft: 10,
        marginTop: 1
    },
    textWrapper: {
        width: '82%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    text: {
        fontSize: 18,
        color: color.WHITE,
        fontWeight: "bold"
    }
});

export default FacebookLogin

