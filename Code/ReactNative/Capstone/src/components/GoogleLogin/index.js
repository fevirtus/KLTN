import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { color } from '../../utility';

const GoogleLogin = () => {
    GoogleSignin.configure({
        webClientId: '57907873541-r853h7dljsh3lbjf94atj7tuntu4qpm4.apps.googleusercontent.com'
    })

    const [isLoggedIn, setIsLoggedIn] = useState(false)  
    const [userInfo, setUserInfo] = useState(null)  

    useEffect(() => {  
        getCurrentUserInfo();  
    }, []);  

    const getCurrentUserInfo = async () => {  
        try {  
            const userInfo = await GoogleSignin.signInSilently();  
            console.log(userInfo);  
            setIsLoggedIn(true);  
            setUserInfo(userInfo);  
        } catch (error) {  
            if (error.code === statusCodes.SIGN_IN_REQUIRED) {  
            // user has not signed in yet  
            } else {  
            // some other error  
            }  
        }  
    };  
    
    const _signIn = async () => {  
        try {  
            await GoogleSignin.hasPlayServices();  
            const userInfo = await GoogleSignin.signIn();  
            console.log('User Info --> ', userInfo);  
            console.log('idToken', userInfo.idToken)
            console.log('email', userInfo.email)
            setIsLoggedIn(true);  
            setUserInfo(userInfo);  
        } catch (error) {  
            console.log(error);  
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {  
            // user cancelled the login flow  
            } else if (error.code === statusCodes.IN_PROGRESS) {  
            // operation (e.g. sign in) is in progress already  
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {  
            // play services not available or outdated  
            } else {  
            // some other error happened  
            }  
        }  
    };  
  
    const _signOut = async () => {  
        try {  
            await GoogleSignin.revokeAccess();  
            await GoogleSignin.signOut();  
            setIsLoggedIn(false);  
        } catch (error) {  
            console.error(error);  
        }  
    }  

    return (
        <View>
            {
                !isLoggedIn ?
                <TouchableOpacity style={styles.formLogin} onPress={_signIn}>
                    <FontAwesome5 name="google" size={18} color="white" style={styles.google}/>
                    <Text style={styles.text}>
                        LOG IN WITH GOOGLE
                    </Text>
                </TouchableOpacity> :
                <>  
                    <Text>Email: {userInfo ? userInfo.user.email : ""}</Text>  
                    <Text>Name: {userInfo ? userInfo.user.name : ""}</Text>  
                    <TouchableOpacity style={styles.signOutBtn} onPress={_signOut}>  
                    <Text style={styles.signOutBtnText}>Signout</Text>  
                    </TouchableOpacity>  
                </>
            }
            
        </View>
    )
}

const styles = StyleSheet.create({
    formLogin: {
        height: 45,
        width: 340,
        borderColor: color.WHITE,
        borderWidth: 2,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    google: {
        marginLeft: 10, 
        marginRight: 42, 
        marginTop: 1
    },
    text: {
        fontSize: 18, 
        color:'white', 
        fontWeight: "bold"
    }
})

export default GoogleLogin