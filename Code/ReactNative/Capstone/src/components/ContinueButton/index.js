import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { color } from '../../utility'

const ContinueButton = ({ navigation }) => {
    return (
        <TouchableOpacity onPress={() => navigation.navigate('Home')} >
            <View style={styles.button}>
                <Text style={styles.buttonText}>Continue</Text>
                <AntDesign name="caretright" size={10} style={styles.iconRight} />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: color.PINK,
        width: '40%',
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 20,
        flexDirection: 'row'
    },
    buttonText: {
        color: color.WHITE,
        fontSize: 17,
        paddingLeft: 50
    },
    iconRight: {
        color: color.WHITE,
        paddingLeft: 12
    }
})

export default ContinueButton