import React from 'react';
import {
    View, StyleSheet,
    Text, Image,
    TouchableOpacity,
    ScrollView
} from 'react-native'
import LottieView from 'lottie-react-native'
import LinearGradient from 'react-native-linear-gradient';
import { Container } from '../../../components'
import { color } from '../../../utility'

const Payment = ({ navigation }) => {
    return (
        <Container>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <View style={styles.animation}>
                        <LottieView source={require('../../../utility/constants/diamond.json')} autoPlay loop />
                    </View>
                    <Text style={styles.title}>Choose Premium package</Text>
                    <Text style={styles.title2}>We have the perfect package for you</Text>
                    <View style={styles.payment}>
                        <Text style={styles.titlePayment}>Sign up by bank transfer</Text>
                        <View style={styles.div}>
                            <Text style={styles.name}>PetDating Premium</Text>
                            <Text>Everything you want with Premium, no strings attached.</Text>
                            <View style={styles.iconPayment}>
                                <Image source={require('../../../../images/icon/vcb.jpg')} style={styles.icon} />
                            </View>
                            <TouchableOpacity onPress={() => navigation.navigate('Banking')}>
                                <LinearGradient colors={['#ffe4e4', '#ffa5b0', '#fe91ca']} style={styles.commandButton}>
                                    <Text style={styles.panelButtonTitle}>Use Premium</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.payment, { paddingBottom: 20 }]}>
                        <Text style={styles.titlePayment}>Pay with Momo wallet</Text>
                        <View style={styles.div}>
                            <Text style={styles.name}>PetDating Premium</Text>
                            <Text>Everything you want with Premium, no strings attached.</Text>
                            <View style={styles.iconPayment}>
                                <Image source={require('../../../../images/icon/momo.jpg')} style={styles.icon} />
                                <Image source={require('../../../../images/icon/vcb.jpg')} style={styles.icon} />
                                <Image source={require('../../../../images/icon/viettin.png')} style={styles.icon} />
                                <Image source={require('../../../../images/icon/bidv.png')} style={styles.icon} />
                                <Image source={require('../../../../images/icon/tpbank.jpg')} style={styles.icon} />
                                <Image source={require('../../../../images/icon/mbbank.jpg')} style={styles.icon} />
                            </View>
                            <TouchableOpacity onPress={() => navigation.navigate('Banking')}>
                                <LinearGradient colors={['#ffe4e4', '#ffa5b0', '#fe91ca']} style={styles.commandButton}>
                                    <Text style={styles.panelButtonTitle}>Use Premium</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 28
    },
    title2: {
        textAlign: 'center',
        paddingTop: 5,
        fontSize: 14
    },
    payment: {
        marginTop: 32
    },
    titlePayment: {
        textAlign: 'center',
        fontSize: 22
    },
    div: {
        backgroundColor: '#f9f9f9',
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
        elevation: 5,
        marginTop: 20
    },
    name: {
        fontWeight: '700',
        fontSize: 15
    },
    iconPayment: {
        flexDirection: 'row',
        marginTop: 10,
    },
    icon: {
        width: 26,
        height: 20,
        borderRadius: 2,
        marginRight: 3
    },
    commandButton: {
        width: '95%',
        alignSelf: 'center',
        borderRadius: 25,
        padding: 13,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 6
    },
    panelButtonTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: color.WHITE,
    },
    animation: {
        width: 100,
        height: 90,
        alignSelf: 'center'
    }
})

export default Payment