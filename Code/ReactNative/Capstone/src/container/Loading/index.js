import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { color } from '../../utility'
import { useSelector } from 'react-redux'

const Loading = (props) => {
    const idToken = useSelector(state => state.auth.idToken)
    const detectLogin = async () => {
        if (idToken) {
            props.navigation.navigate('Home')
        } else {
            props.navigation.navigate('Login')
        }
    }

    useEffect(() => {
       detectLogin() 
    }, [])

    return (
        <View style={styles.loading}>
            <ActivityIndicator size="large" color={color.BLUE} />
        </View>
    )
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
})

export default Loading