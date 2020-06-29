import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import {
    GoogleSignin,
    statusCodes,
} from '@react-native-community/google-signin';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { color } from '../../utility';

export default class GoogleLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: null,
            gettingLoginStatus: true,
        };
    }

    componentDidMount() {
        //initial configuration
        GoogleSignin.configure({
        //It is mandatory to call this method before attempting to call signIn()
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        // Repleace with your webClientId generated from Firebase console
        webClientId: '57907873541-r853h7dljsh3lbjf94atj7tuntu4qpm4.apps.googleusercontent.com',
        });
        //Check if user is already signed in
        this._isSignedIn();
    }

    _isSignedIn = async () => {
        const isSignedIn = await GoogleSignin.isSignedIn();
        if (isSignedIn) {
            alert('User is already signed in');
            //Get the User details as user is already signed in
            this._getCurrentUserInfo();
        } else {
            console.log('Please Login');
        }
        this.setState({ gettingLoginStatus: false });
    };

    _getCurrentUserInfo = async () => {
        try {
            const userInfo = await GoogleSignin.signInSilently();
            console.log('User Info --> ', userInfo);
            this.setState({ userInfo: userInfo });
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_REQUIRED) {
                alert('User has not signed in yet');
                console.log('User has not signed in yet');
            } else {
                alert("Something went wrong. Unable to get user's info");
                console.log("Something went wrong. Unable to get user's info");
            }
        }
    };

    _signIn = async () => {
        //Prompts a modal to let the user sign in into your application.
        try {
        await GoogleSignin.hasPlayServices({
            //Check if device has Google Play Services installed.
            //Always resolves to true on iOS.
            showPlayServicesUpdateDialog: true,
        });
            const userInfo = await GoogleSignin.signIn();
            console.log('User Info --> ', userInfo);
            this.setState({ userInfo: userInfo });
        } catch (error) {
            console.log('Message', error.message);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('User Cancelled the Login Flow');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log('Signing In');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log('Play Services Not Available or Outdated');
            } else {
                console.log('Some Other Error Happened');
            }
        }
    };

    _signOut = async () => {
        //Remove user session from the device.
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            this.setState({ userInfo: null }); // Remove the user from your app's state as well
        } catch (error) {
            console.error(error);
        }
    };

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

    // loginGoogle = () => {
    //     GoogleSignin.signIn()
    //         .then((user) => {
    //             console.log(user)
    //             let credential = {token: user.idToken, secret: user.serverAuthCode, provider: 'google', providerId: 'google'}
    //             firebase.auth().signInWithCredential(credential)
    //                 .then((u) => {
    //                     console.log('LOGGED!', u)
    //                 })
    //                 .catch((e) => {
    //                     console.log('err', e)
    //                 })
    //         })
    //         .catch((err) => {
    //             console.log('WRONG SIGNIN', err)
    //         })
    //         .done()
    // }

    render() {
        //returning Loader untill we check for the already signed in user
        if (this.state.gettingLoginStatus) {
        return (
            <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
        } else {
            if (this.state.userInfo != null) {
                //Showing the User detail
                return (
                <View style={styles.container}>
                    <Image
                        source={{ uri: this.state.userInfo.user.photo }}
                        style={styles.imageStyle}
                    />
                    <Text style={styles.text}>
                        Name: {this.state.userInfo.user.name}{' '}
                    </Text>
                    <Text style={styles.text}>
                        Email: {this.state.userInfo.user.email}
                    </Text>
                    <TouchableOpacity style={styles.button} onPress={this._signOut}>
                        <Text>Logout</Text>
                    </TouchableOpacity>
                </View>
                );
            } else {
                //For login showing the Signin button
                return (
                    <View>
                        <TouchableOpacity style={styles.formLogin} onPress={this._signIn}>
                            <FontAwesome5 name="google" size={18} color="white" style={styles.google}/>
                            <Text style={styles.text}>
                                LOG IN WITH GOOGLE
                            </Text>
                        </TouchableOpacity>
                    </View>
                );
            }
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageStyle: {
        width: 200,
        height: 300,
        resizeMode: 'contain',
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        width: 300,
        marginTop: 30,
    },
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
});