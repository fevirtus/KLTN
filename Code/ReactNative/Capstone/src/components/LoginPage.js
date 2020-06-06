import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'

export default function Login({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <View style={styles.icon}>
                    <MaterialIcons name="pets" size={40} color="white" />
                    <Text style={{ color: 'white', fontSize: 30 }}>
                        PetDating
                    </Text>
                </View>
                <Image 
                    style={styles.logo}
                    source={require('../../images/login-pets.jpg')} 
                />
                <Text style={styles.title}>Match . Chat . Date</Text>
                <Text style={{ padding: 30, color: 'white', textAlign: 'center', fontSize: 15, letterSpacing: 0.5, marginBottom: 20 }}>
                    By clicking Login, you agree to our Terms. Learn how we process your data in our Privacy Policy and Cookie Policy.
                </Text>
                <TouchableOpacity style={styles.formLogin} onPress={() => navigation.navigate('Home')}>
                    <FontAwesome5 name="google" size={18} color="white" style={{marginLeft: 10, marginRight: 42, marginTop: 1}}/>
                    <Text style={{ fontSize: 18, color:'white', fontWeight: "bold" }}>
                        LOG IN WITH GOOGLE
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.formLoginFb} onPress={() => navigation.navigate('Home')}>
                    <Entypo name="facebook" size={18} color="blue" style={{marginLeft: 10, marginRight: 42, marginTop: 1}}/>
                    <Text style={{ fontSize: 18, color:'white', fontWeight: "bold" }}>
                        LOG IN WITH FACEBOOK
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.formLoginMess} onPress={() => navigation.navigate('Home')}>
                    <AntDesign name="message1" size={18} color="black" style={{marginLeft: 10, marginRight: 42, marginTop: 1}}/>
                    <Text style={{ fontSize: 18, color:'white', fontWeight: "bold" }}>
                        LOG IN WITH PHONE NUMBER
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex : 1
    },
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
        color: 'white',
        letterSpacing: 1,
        opacity: 0.9
    }, 
    formLogin: {
        position: 'absolute',
        height: 45,
        width: 340,
        top: 380,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 20,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    formLoginFb: {
        position: 'absolute',
        height: 45,
        width: 340,
        top: 435,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 20,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    formLoginMess: {
        position: 'absolute',
        height: 45,
        width: 340,
        top: 490,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 20,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    }
})