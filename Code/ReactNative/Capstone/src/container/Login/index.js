import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
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
                <TouchableOpacity style={styles.formLogin} onPress={() => navigation.navigate('Home')}>
                    <FontAwesome5 name="google" size={18} color="white" style={styles.google}/>
                    <Text style={{ fontSize: 18, color:'white', fontWeight: "bold" }}>
                        LOG IN WITH GOOGLE
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.formLoginFb} onPress={() => navigation.navigate('Home')}>
                    <Entypo name="facebook" size={18} color="blue" style={styles.facebook}/>
                    <Text style={{ fontSize: 18, color:'white', fontWeight: "bold" }}>
                        LOG IN WITH FACEBOOK
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.formLoginMess} onPress={() => navigation.navigate('Home')}>
                    <AntDesign name="message1" size={18} color="black" style={styles.phone}/>
                    <Text style={{ fontSize: 18, color:'white', fontWeight: "bold" }}>
                        LOG IN WITH PHONE NUMBER
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Login;

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
        height: 45,
        width: 340,
        top: 380,
        borderColor: color.WHITE,
        borderWidth: 2,
        borderRadius: 20,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    google: {
        marginLeft: 10, 
        marginRight: 42, 
        marginTop: 1
    },
    facebook: {
        marginLeft: 10, 
        marginRight: 42, 
        marginTop: 1
    }, 
    phone: {
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
    formLoginMess: {
        position: 'absolute',
        height: 45,
        width: 340,
        top: 490,
        borderColor: color.WHITE,
        borderWidth: 2,
        borderRadius: 20,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    }
})