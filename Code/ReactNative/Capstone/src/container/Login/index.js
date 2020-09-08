import React from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native'
import * as Animatable from 'react-native-animatable';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { GoogleLogin, FacebookLogin } from '../../components'
import { color } from '../../utility';

const Login = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../../images/login-pets.jpg')}
                style={styles.image}
            >
                <View style={styles.header}>
                    <View style={styles.icon}>
                        <MaterialIcons name="pets" size={38} color={color.WHITE} />
                        <Text style={styles.name}>
                            PetDating
                        </Text>
                    </View>
                    <Animatable.Text
                        animation="shake"
                        style={styles.title}
                    >
                        Match . Chat . Date
                    </Animatable.Text>
                </View>
                <Animatable.View
                    style={styles.footer}
                    animation="fadeInUpBig"
                >
                    <View style={styles.textPrivate}>
                        <Text style={styles.color_textPrivate}>
                            By clicking login you agree to our
                        </Text>
                        <Text style={[styles.color_textPrivate, {
                            fontWeight: 'bold'
                        }]}>
                            {" "}
                            Terms of Service
                        </Text>
                        <Text style={styles.color_textPrivate}>
                            {" "}
                            and
                        </Text>
                        <Text style={[styles.color_textPrivate, {
                            fontWeight: 'bold'
                        }]}>
                            {" "}
                            Privacy Policy
                        </Text>
                    </View>
                    <View style={styles.formLogin}>
                        {/* Login with google */}
                        <GoogleLogin navigation={navigation} />
                        {/* Login with facebook */}
                        <FacebookLogin />
                    </View>
                </Animatable.View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    image: {
        flex: 1,
        resizeMode: "cover",
    },
    header: {
        flex: 1.35,
        marginHorizontal: 10
    },
    footer: {
        flex: 0.65,
        backgroundColor: color.WHITE,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 35,
        paddingHorizontal: 30
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
        fontSize: 28
    },
    title: {
        fontWeight: '700',
        fontSize: 40,
        color: color.WHITE,
        letterSpacing: 0.3,
        opacity: 0.9,
        alignSelf: 'center',
        paddingVertical: 160
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
        paddingHorizontal: 5
    },
    color_textPrivate: {
        color: color.GRAY
    },
    formLogin: {
        paddingHorizontal: 5,
        paddingVertical: 30
    }
})

export default Login