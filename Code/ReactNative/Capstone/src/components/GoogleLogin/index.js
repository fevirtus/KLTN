import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { color } from '../../utility';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { saveUserInfo } from '../../redux/actions/authActions';

const GoogleLogin = ({ navigation }) => {
    GoogleSignin.configure({
        webClientId: '57907873541-r853h7dljsh3lbjf94atj7tuntu4qpm4.apps.googleusercontent.com'
    })

    const [userInfo, setUserInfo] = useState(null)  
    const dispatch = useDispatch()

    useEffect(() => {  
        getCurrentUserInfo();  
    }, []);  

    const getCurrentUserInfo = async () => {  
        try {  
            const userInfo = await GoogleSignin.signInSilently();  
            console.log(userInfo);  
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
        await GoogleSignin.hasPlayServices();  
        const userInfo = await GoogleSignin.signIn(); 
        const new_user = {
            access_token: userInfo.idToken,
            name: userInfo.user.givenName,
            email: userInfo.user.email
        }
        axios.post('https://pet-dating-server.herokuapp.com/users/insert_new_user', new_user)
            .then(() => {
                try {
                    dispatch(saveUserInfo(new_user))
                } catch (e) {
                    console.log('Error!', e)
                }
            })  
    };  
    

    return (
        <View>
            <TouchableOpacity style={styles.formLogin} onPress={_signIn}>
                <FontAwesome5 name="google" size={18} color="white" style={styles.google}/>
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