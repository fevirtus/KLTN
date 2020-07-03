import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native'
import { CheckBox } from 'react-native-elements'
import { color } from '../../../utility'
import { useSelector, useDispatch } from 'react-redux';

const Privacy = ({ navigation }) => {
    const checked = useSelector(state => state.home.isHideSwiper)
    const dispatch = useDispatch()
    
    return (
        <View>
            <View style={styles.checkboxContainer}>
                <Text style={styles.text}>show me on PetDating</Text>
                <CheckBox
                    size={26}
                    checkedIcon='check-circle'
                    uncheckedIcon='circle-o'
                    checkedColor={color.PINK}
                    uncheckedColor={color.PINK}
                    checked={checked}
                    onPress={() => dispatch({ type: 'HIDE_SWIPER' })}
                />
            </View>
            <Text style={styles.text2}>if you select hide, you can't match new pet!</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    checkboxContainer: {
        height: 52,
        borderBottomColor: color.GRAY_BUTTON,
        borderBottomWidth: 0.8,
        borderBottomEndRadius: 20,
        borderBottomStartRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    text: {
        alignSelf: 'center',
        fontSize: 17,
        marginLeft: 20
    },
    text2: {
        textAlign: 'center',
        fontSize: 15,
        color: color.GRAY_BUTTON,
        paddingTop: 12
    }
})

export default Privacy