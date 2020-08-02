import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { GoogleSignin } from '@react-native-community/google-signin'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { color } from '../../utility';
import { useDispatch } from 'react-redux';
import { saveUser, saveToken } from '../../redux/actions/authActions';
import { RequestApiAsyncPost, setAuthToken } from '../../api/config'
import auth from '@react-native-firebase/auth';
import { AddUser } from '../../network';
import { setUniqueValue } from '../../utility/constants';

const GoogleLogin = () => {
    const dispatch = useDispatch()

    GoogleSignin.configure({
        webClientId: '57907873541-r853h7dljsh3lbjf94atj7tuntu4qpm4.apps.googleusercontent.com'
    })

    const _signIn = async () => {
        try {
            // Get the users ID token
            const { idToken } = await GoogleSignin.signIn();
            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            // Sign-in the user with the credential
            const userInfo = await auth().signInWithCredential(googleCredential);
            console.log(userInfo.user)
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
                }).catch((error) => {
                    console.log("Api call error")
                    alert(error.message)
                })
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
        }
    }

    return (
        <View>
            <TouchableOpacity style={styles.formLogin} onPress={_signIn}>
                <FontAwesome5 name="google" size={18} color="white" style={styles.google} />
                <Text style={styles.text}>
                    LOG IN WITH GOOGLE
                </Text>
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
        marginLeft: 10,
        marginRight: 25,
        marginTop: 1
    },
    text: {
        fontSize: 18,
        color: color.WHITE,
        fontWeight: "bold"
    }
})

export default GoogleLogin

