import React from 'react';
import { ActivityIndicator } from 'react-native'
import { color } from '../../utility'

const LoadingScreen = () => {
    return (
        <>
            <ActivityIndicator size="large" color={color.BLUE} />
        </>
    )
}

export default LoadingScreen