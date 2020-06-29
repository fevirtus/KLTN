import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { GoogleSignin } from '@react-native-community/google-signin'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { color } from '../../utility';

export class TestComponent extends Component {
    componentDidMount(){
        GoogleSignin.configure({
            webClientId: '57907873541-r853h7dljsh3lbjf94atj7tuntu4qpm4.apps.googleusercontent.com'
        })
    }

    loginGoogle = () => {
        GoogleSignin.signIn()
            .then((user) => {
                console.log(user)
                let credential = {token: user.idToken, secret: user.serverAuthCode, provider: 'google', providerId: 'google'}
                firebase.auth().signInWithCredential(credential)
                    .then((u) => {
                        console.log('LOGGED!', u)
                    })
                    .catch((e) => {
                        console.log('err', e)
                    })
            })
            .catch((err) => {
                console.log('WRONG SIGNIN', err)
            })
            .done()
    }

    render() {
        return (
            <View>
                <TouchableOpacity style={styles.formLogin} onPress={this.loginGoogle}>
                    <FontAwesome5 name="google" size={18} color="white" style={styles.google}/>
                    <Text style={styles.text}>
                        LOG IN WITH GOOGLE
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
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

export default TestComponent





    // onLoginOrRegister = () => {
        //     GoogleSignin.signIn()
        //       .then((data) => {
        //         const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
        //         return firebase.auth().signInWithCredential(credential);
        //       })
        //       .then((user) => {
          
        //         // ** Now that the user is signed in, you can get the ID Token. **
          
        //         user.getIdToken(/* forceRefresh */ true).then(function(idToken) 
          
        //       })
        //       .catch((error) => {
        //         const { code, message } = error;
        //       });
        //   }
        //   firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken)
