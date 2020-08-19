import React from 'react';
import { StyleSheet, View, Text } from 'react-native'
import { CheckBox } from 'react-native-elements'
import { color } from '../../../utility'
import { useSelector, useDispatch } from 'react-redux';
import { Container } from '../../../components'
import Axios from 'axios';
import { URL_BASE, token } from '../../../api/config';
import { hideUser } from '../../../network';
import { uuid } from '../../../utility/constants';

const Privacy = ({ navigation }) => {
    const checked = useSelector(state => state.home.isHideSwiper)
    const dispatch = useDispatch()

    const updateUser = (hide) => {
        try {
            Axios.put(`${URL_BASE}users`, {
                updateFields: {
                    hide: hide
                }
            }, { headers: { Authorization: token } })
        } catch (error) {

        }
    }

    const toggleHideUser = () => {
        try {
            if (!checked) {
                console.log('HIDE')
                updateUser(1)
                hideUser(uuid, true)
            } else {
                console.log('SHOW')
                updateUser(0)
                hideUser(uuid, false)
            }
            dispatch({ type: 'HIDE_SWIPER' })

        } catch (error) {
            console.log('ERROR toggleHideUser()', error)
        }
    }

    return (
        <Container>
            <View style={styles.checkboxContainer}>
                <Text style={styles.text}>show me on PetDating</Text>
                <CheckBox
                    size={26}
                    checkedIcon='check-circle'
                    uncheckedIcon='circle-o'
                    checkedColor={color.PINK}
                    uncheckedColor={color.PINK}
                    checked={checked}
                    onPress={toggleHideUser}
                />
            </View>
            <Text style={styles.text2}>if you select hide, you can't match new pet!</Text>
        </Container>
    )
}

const styles = StyleSheet.create({
    checkboxContainer: {
        height: 52,
        borderBottomColor: color.GRAY,
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
        color: color.GRAY,
        paddingTop: 12
    }
})

export default Privacy