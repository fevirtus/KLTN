import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AccessToken, LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import Entypo from 'react-native-vector-icons/Entypo'
import { color } from '../../utility';

export default class FacebookLogin extends Component {
    state = { userInfo: {} }

    logoutWithFacebook = () => {
        LoginManager.logOut()
        this.setState({ userInfo: {} })
    }

    getInfoFromToken = token => {
        const PROFILE_REQUEST_PARAMS = {
            fields: {
                string: 'id, name, first_name, last_name'
            },
        }

        const profileRequest = new GraphRequest('/me', { token, parameters: PROFILE_REQUEST_PARAMS },
            (error, result) => {
                if (error) {
                    console.log('Login Info has an error:', err)
                }
                else {
                    this.setState({ userInfo: result })
                    console.log('result:', result)
                }
            },
        )
        new GraphRequestManager().addRequest(profileRequest).start()
    }

    loginWithFacebook = () => {
        LoginManager.logInWithPermissions(['public_profile']).then(
            login => {
                if (login.isCancelled) {
                    console.log('login canceled')
                }
                else {
                    AccessToken.getCurrentAccessToken().then(data => {
                        const accessToken = data.accessToken.toString()
                        this.getInfoFromToken(accessToken)
                    })
                }
            },
            error => {
                console.log('login fail with error: ' + console.error());
            },
        )
    }

    state = { userInfo: {} }

    render() {
        const isLogin = this.state.userInfo.name
        const onPressButton = isLogin ? this.logoutWithFacebook : this.loginWithFacebook

        return (
            <View>
                <TouchableOpacity style={styles.formLogin} onPress={onPressButton}>
                    <Entypo name="facebook" size={18} color='white' style={styles.facebook} />
                    <Text style={styles.text}>
                        LOG IN WITH FACEBOOK
                    </Text>
                </TouchableOpacity>
                {this.state.userInfo.name && (<Text style={{ fontSize: 16, marginVertical: 16 }} >
                    Logged in as {this.state.userInfo.name}
                </Text>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    formLogin: {
        marginTop: 15,
        height: 45,
        // width: 340,
        width: '100%',
        backgroundColor: color.BLUE,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    facebook: {
        marginLeft: 10,
        marginRight: 42,
        marginTop: 1
    },
    text: {
        fontSize: 18,
        color: color.WHITE,
        fontWeight: "bold"
    }
});