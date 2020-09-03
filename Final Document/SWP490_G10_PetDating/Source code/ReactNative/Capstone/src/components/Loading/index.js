import React from 'react';
import { View, StyleSheet } from 'react-native'
import LottieView from 'lottie-react-native'

const Loading = () => (
    <View style={styles.container}>
        <LottieView source={require('../../utility/constants/loading.json')}
            autoPlay
            loop
        />
    </View>
)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    },
    lottie: {
        width: 100,
        height: 100,
    },

})

export default Loading