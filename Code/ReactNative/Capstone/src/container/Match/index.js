import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
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
                <Text style={styles.panelButtonTitle}>Chat with {yourName}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.commandButton}
                onPress={() => {
                    navigation.navigate('Home')
                }}
            >
                <Text style={styles.panelButtonTitle}>Keep Swiping</Text>
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
        marginBottom: 30
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
        borderColor: color.WHITE,
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
        borderColor: color.WHITE,
        marginHorizontal: 32
    },
    commandButton: {
        padding: 15,
        borderRadius: 25,
        backgroundColor: color.PINK,
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        alignSelf: 'center',
        marginVertical: 15
    },
    panelButtonTitle: {
        fontSize: 20,
        color: color.WHITE,
    },
    petName: {
        color: color.PINK,
        fontSize: 20,
        fontWeight: 'bold'
    }
})

export default Match