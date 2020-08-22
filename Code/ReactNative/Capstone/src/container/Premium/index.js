import React from 'react';
import {
    View, Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity
} from 'react-native'
import moment from 'moment';
import LottieView from 'lottie-react-native'
import { useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { color } from '../../utility'

const Premium = ({ navigation }) => {
    const vip = useSelector(state => state.vip)

    const PremiumPlus = ({ text }) => (
        <View style={styles.actionPre}>
            <Feather
                name="check-circle"
                color={color.WHITE}
                size={16}
                style={styles.icon}
            />
            <Text style={styles.textPre}>{text}</Text>
        </View>
    )

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../../images/rocket.jpg')}
                style={styles.background}
                blurRadius={0.4}
            >
                <Text style={styles.premium}>Premium Plus</Text>
                <View style={styles.plus}>
                    <PremiumPlus text={'Unlimited matches'} />
                    <PremiumPlus text={'Unlimited likes'} />
                    <PremiumPlus text={'Unlimited returns'} />
                    <PremiumPlus text={'Different search options'} />
                </View>
                {vip.status == 'IN_ACTIVE' ?
                    <TouchableOpacity style={styles.commandButton} onPress={() => navigation.navigate('Payment')}>
                        <Text style={styles.panelButtonTitle}>Upgrade Premium</Text>
                    </TouchableOpacity>
                    : null
                }
                {vip.status == 'ACTIVE' ?
                    <>
                        <View style={styles.box}>
                            <Text style={styles.title}>Expired Time:</Text>
                            <Text style={styles.remainTime}>{moment(vip.remainTime).format('YYYY-MM-DD')}</Text>
                        </View>
                        <Text style={styles.textEnjoy}>#Enjoy your time with PetDating</Text>
                    </>
                    : null
                }
                {vip.status == 'PROCESS' ?
                    <View style={styles.box}>
                        <View style={styles.animation}>
                            <LottieView source={require('../../utility/constants/loadingPre.json')} autoPlay loop />
                        </View>
                        <Text style={styles.msg}>Please wait while we process your request to upgrade Premium!</Text>
                    </View>
                    : null
                }
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    background: {
        flex: 1
    },
    premium: {
        textAlign: 'center',
        paddingTop: '25%',
        fontSize: 28,
        color: color.WHITE,
        fontWeight: 'bold',
        borderBottomWidth: 1,
        borderBottomColor: color.LIGHT_GRAY,
        borderBottomLeftRadius: 80,
        borderBottomRightRadius: 80,
        paddingBottom: 30
    },
    plus: {
        paddingTop: 60,
        paddingBottom: 20
    },
    actionPre: {
        flexDirection: 'row',
        paddingVertical: 10,
        justifyContent: 'center'
    },
    textPre: {
        color: color.BLACK,
        paddingLeft: 10,
        fontSize: 15
    },
    commandButton: {
        width: '80%',
        alignSelf: 'center',
        borderRadius: 25,
        padding: 15,
        backgroundColor: color.PINK,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 6
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: color.WHITE,
    },
    haveAcc: {
        textAlign: 'center',
        color: color.GRAY
    },
    box: {
        backgroundColor: '#cffffe',
        width: '70%',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 10,
        elevation: 5,
        borderRadius: 5,
        alignItems: 'center'
    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 4
    },
    remainTime: {
        textAlign: 'center',
        fontSize: 18,
        color: color.GREEN,
        fontStyle: 'italic'
    },
    msg: {
        textAlign: 'center',
        fontSize: 17,
        color: color.GRAY
    },
    animation: {
        width: 150,
        height: 100
    },
    textEnjoy: {
        textAlign: 'center',
        paddingTop: 5,
        fontStyle: 'italic',
        fontSize: 15,
        color: color.DARK_GRAY
    }
})

export default Premium