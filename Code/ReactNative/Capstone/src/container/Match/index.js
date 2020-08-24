import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { color } from '../../utility'
import { uuid } from '../../utility/constants';

const Match = ({ navigation, route }) => {
    const { myPet, myPetAvatar, myAvatar, yourPet, yourPetAvatar, yourAvatar, yourName, yourUid } = route.params;

    return (
        <View style={styles.container}>
            <Image style={styles.matches} source={require('../../../images/itsamatch.png')} />
            <Text style={styles.matchText}>
                <Text style={styles.petName}>{myPet}</Text> and
                <Text style={styles.petName}> {yourPet}</Text> have matched each other.
            </Text>
            <View style={styles.avatarPets}>
                <Image
                    source={myPetAvatar ? { uri: myPetAvatar } : require('../../../images/empty-pet.png')}
                    style={styles.avatarPet}
                />
                <Image
                    source={yourPetAvatar ? { uri: yourPetAvatar } : require('../../../images/empty-pet.png')}
                    style={styles.avatarPet}
                />
            </View>
            <View style={styles.avatarUsers}>
                <Image
                    source={myAvatar ? { uri: myAvatar } : require('../../../images/avatar.jpg')}
                    style={styles.avatarUser}
                />
                <Image
                    source={yourAvatar ? { uri: yourAvatar } : require('../../../images/avatar.jpg')}
                    style={styles.avatarUser}
                />
            </View>
            <TouchableOpacity style={styles.commandButton}
                onPress={() => {
                    navigation.navigate("ChatboxStackScreen", {
                        screen: 'Chat',
                        params: {
                            name: yourName,
                            img: yourAvatar,
                            guestUserId: yourUid,
                            currentUserId: uuid,
                        }
                    });
                }}
            >
                <LinearGradient colors={['#ffe4e4', '#ffa5b0', '#fe91ca']}>
                    <Ionicons name="chatbubbles" size={26} color={color.WHITE} />
                    <Text style={styles.panelButtonTitle}>Chat with {yourName}</Text>
                </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.commandButton}
                onPress={() => {
                    navigation.navigate('Home')
                }}
            >
                <LinearGradient colors={['#ffe4e4', '#ffa5b0', '#fe91ca']}>
                    <Ionicons name="home" color={color.WHITE} size={26} />
                    <Text style={styles.panelButtonTitle}>Keep Swiping</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: color.WHITE
    },
    matches: {
        marginVertical: 40
    },
    matchText: {
        fontSize: 18,
    },
    avatarPets: {
        flexDirection: 'row',
        paddingVertical: 22
    },
    avatarPet: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: color.LIGHT_PINK,
        marginHorizontal: 22
    },
    avatarUsers: {
        flexDirection: 'row'
    },
    avatarUser: {
        width: 70,
        height: 70,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: color.LIGHT_LIGHT_GRAY,
        marginHorizontal: 32,
        marginBottom: 18
    },
    commandButton: {
        padding: 14,
        borderRadius: 25,
        backgroundColor: color.PINK,
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        alignSelf: 'center',
        marginVertical: 10,
        flexDirection: 'row'
    },
    panelButtonTitle: {
        fontSize: 20,
        color: color.WHITE,
        marginLeft: 8
    },
    petName: {
        color: color.PINK,
        fontSize: 20,
        fontWeight: 'bold'
    }
})

export default Match