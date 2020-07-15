import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { color } from '../../utility'

const Loading = () => (
    <View style={styles.container}>
        <ActivityIndicator size="large" color={color.PINK} />
    </View>
)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    },
})

export default Loading