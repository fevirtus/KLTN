import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground } from 'react-native'
import { color } from '../../utility'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Entypo from 'react-native-vector-icons/Entypo'

const Setting = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <ImageBackground 
                source={require('../../../images/login-pets.jpg')} 
                style={styles.image}
            >
                <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Privacy')}>
                    <View style={styles.iconWrapper}>
                        <FontAwesome name="lock" size={28} color={color.WHITE} />
                    </View>            
                    <Text style={styles.text}>Privacy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item}>
                    <View style={styles.iconWrapper}>
                        <FontAwesome name="lightbulb-o" size={28} color={color.WHITE} />
                    </View>            
                    <Text style={styles.text}>Feedback</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item}>
                    <View style={styles.iconWrapper}>
                        <FontAwesome name="search" size={23} color={color.WHITE} />
                    </View>            
                    <Text style={styles.text}>Search Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item}>
                    <View style={styles.iconWrapper}>
                        <MaterialCommunityIcons name="logout" size={26} color={color.WHITE} />
                    </View>            
                    <Text style={styles.text}>Sign Out</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item}>
                    <View style={styles.iconWrapper}>
                        <Entypo name="emoji-sad" size={26} color={color.WHITE} />
                    </View>            
                    <Text style={styles.text}>Delete Account</Text>
                </TouchableOpacity>  
            </ImageBackground>     
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
        borderBottomColor: color.GRAY_BUTTON,
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
    }
})

export default Setting