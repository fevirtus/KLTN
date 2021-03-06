import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { color } from '../../utility'
import { Container } from '../../components'
import Entypo from 'react-native-vector-icons/Entypo'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const Setting = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <Container>
                <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Privacy')}>
                    <View style={styles.iconWrapper}>
                        <Icon name="lock" size={28} color={color.WHITE} />
                    </View>
                    <Text style={styles.text}>Hide Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Feedback')}>
                    <View style={styles.iconWrapper}>
                        <MaterialIcons name="feedback" size={26} color={color.WHITE} />
                    </View>
                    <Text style={styles.text}>Feedback</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('DeleteAcc')}>
                    <View style={styles.iconWrapper}>
                        <Entypo name="emoji-sad" size={26} color={color.WHITE} />
                    </View>
                    <Text style={styles.text}>Delete Account</Text>
                </TouchableOpacity>
                <View style={styles.version}>
                    <MaterialIcons name="pets" size={45} color={color.PINK} />
                    <Text style={styles.txtVer}>Version 1.0.0</Text>
                </View>
            </Container>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        resizeMode: "cover",
    },
    item: {
        height: 75,
        borderBottomWidth: 1,
        borderBottomColor: color.GRAY,
        flexDirection: 'row',
        backgroundColor: color.WHITE
    },
    iconWrapper: {
        width: 42,
        height: 42,
        backgroundColor: color.PINK,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 25,
        marginLeft: 20
    },
    text: {
        fontSize: 18,
        alignSelf: 'center',
        paddingLeft: 12
    },
    version: {
        alignItems: 'center',
        paddingTop: '30%'
    },
    txtVer: {
        paddingTop: 5,
        color: color.LIGHT_GRAY,
        fontSize: 16
    }
})

export default Setting