import React from 'react';
import LinearGradient from 'react-native-linear-gradient'
import { StyleSheet } from 'react-native'

const Container = ({ children }) => {
    return (
        <LinearGradient colors={['#f6bed6', '#f9f9f9']} style={styles.gradient}>
            {children}
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1
    }
})

export default Container