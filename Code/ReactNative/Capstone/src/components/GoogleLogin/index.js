import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { GoogleSignin } from '@react-native-community/google-signin'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { color } from '../../utility';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { saveUserInfo } from '../../redux/actions/authActions';
import { RequestApiAsyncPost } from '../../api/config'
import _ from 'lodash'

const GoogleLogin = ({ navigation }) => {
    const dispatch = useDispatch()

    GoogleSignin.configure({
        webClientId: '57907873541-r853h7dljsh3lbjf94atj7tuntu4qpm4.apps.googleusercontent.com'
    }) 
    
    const _signIn = async () => {  
        await GoogleSignin.hasPlayServices();  
        const userInfo = await GoogleSignin.signIn(); 
        const new_user = {
            email: userInfo.user.email
        }
        RequestApiAsyncPost('login', 'POST', {}, new_user)
            .then((user) => {
                if (_.isEmpty(user)) {
                    dispatch(saveUserInfo(new_user))
                    console.log("Save user successful")
                } else {
                    navigation.navigate('AccountSetting')
                }
            }).catch((error) => {
                console.log("Api call error")
                alert(error.message)
            }) 
    }   
    
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
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: color.RED
    },
    google: {
        marginLeft: 10, 
        marginRight: 42, 
        marginTop: 1
    },
    text: {
        fontSize: 18, 
        color: color.WHITE,  
        fontWeight: "bold"
    }
})

export default GoogleLogin

