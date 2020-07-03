import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { GoogleLogin, FacebookLogin, TestComponent } from '../../components'
import { color } from '../../utility';

const Login = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <View style={styles.icon}>
                    <MaterialIcons name="pets" size={40} color="white" />
                    <Text style={styles.name}>
                        PetDating
                    </Text>
                </View>
                <Image 
                    style={styles.logo}
                    source={require('../../../images/login-pets.jpg')} 
                />
                <Text style={styles.title}>Match . Chat . Date</Text>
                <Text style={styles.term}>
                    By clicking Login, you agree to our Terms. Learn how we process your data in our Privacy Policy and Cookie Policy.
                </Text>
                <View style={styles.formLogin}>
                    {/* Login with google */}
                    <GoogleLogin />
                    {/* Login with facebook */}
                    <FacebookLogin />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex : 1
    },
    //Content
    logoContainer: {
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center',
        flex : 1,
        flexDirection: 'column'
    },
    icon: {
        zIndex: 1,
        position: 'absolute',
        top: 35,
        left: 20,
        flexDirection: 'row'
    }, 
    name: {
        color: color.WHITE, 
        fontSize: 30 
    }, 
    logo: { 
        position: 'absolute',
        height: 680,
        resizeMode: 'cover'
    },
    title: {
        position: 'absolute',
        top: 160,
        fontWeight: '700',
        fontSize: 40,
        color: color.WHITE,
        letterSpacing: 1,
        opacity: 0.9
    }, 
    term: {
        paddingTop: 30,
        paddingBottom: 30,
        paddingLeft: 30,
        paddingRight: 30,
        color: color.WHITE, 
        textAlign: 'center', 
        fontSize: 15, 
        letterSpacing: 0.5, 
        marginBottom: 20
    },
    formLogin: {
        position: 'absolute',
        top: 420
    },
})

export default Login