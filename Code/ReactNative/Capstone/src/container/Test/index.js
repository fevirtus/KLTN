import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import {
    LoginButton,
    AccessToken
} from 'react-native-fbsdk';
import Entypo from 'react-native-vector-icons/Entypo'
import { color } from '../../utility';

export default class Test extends Component {
    render() {
        return (
            <View style={styles.container}>
                <LoginButton
                    onLoginFinished={
                        (error, result) => {
                        if (error) {
                            console.log("login has error: " + result.error);
                        } else if (result.isCancelled) {
                            console.log("login is cancelled.");
                        } else {
                            AccessToken.getCurrentAccessToken().then(
                                (data) => {
                                    console.log(data.accessToken.toString())
                                }
                            )
                        }
                        }
                    }
                onLogoutFinished={() => console.log("logout.")}/>

                <TouchableOpacity style={styles.formLoginFb} onPress={() => navigation.navigate('Home')}>
                    <Entypo name="facebook" size={18} color="blue" style={styles.facebook}/>
                    <Text style={{ fontSize: 18, color:'white', fontWeight: "bold" }}>
                        LOG IN WITH FACEBOOK
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
    }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  facebook: {
    marginLeft: 10, 
    marginRight: 42, 
    marginTop: 1
    }, 
    formLoginFb: {
        position: 'absolute',
        height: 45,
        width: 340,
        top: 435,
        borderColor: color.WHITE,
        borderWidth: 2,
        borderRadius: 20,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
});