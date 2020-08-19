import React from 'react';
import {
    View, Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity
} from 'react-native'
import { useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { color } from '../../utility'

const Premium = ({ navigation }) => {
    const user = useSelector(state => state.auth.user)

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
                    <PremiumPlus text={'Không giới hạn lượt Match'} />
                    <PremiumPlus text={'Không giới hạn lượt Like'} />
                    <PremiumPlus text={'Quay lại bao nhiêu lần tùy ý'} />
                    <PremiumPlus text={'Tìm hồ sơ theo thông tin'} />
                </View>
                <TouchableOpacity style={styles.commandButton} onPress={() => navigation.navigate('Payment')}>
                    <Text style={styles.panelButtonTitle}>Upgrade Premium</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { }}>
                    <Text style={styles.haveAcc}>
                        I have a premium account
                        </Text>
                </TouchableOpacity>
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
        paddingTop: 40,
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
        paddingTop: 68,
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
        borderRadius: 26,
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
    }
})

export default Premium