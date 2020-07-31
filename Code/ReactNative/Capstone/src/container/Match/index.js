import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { color } from '../../utility'

const Match = () => {
    return (
        <View style={styles.container}>
            <Image style={styles.matches} source={require('../../../images/itsamatch.png')} />
            <Text style={styles.matchText}>You and A have matched each other.</Text>
            <View style={styles.avatarPets}>
                <Image
                    source={require('../../../images/avatar.jpg')}
                    style={styles.avatarPet}
                />
                <Image
                    source={require('../../../images/empty-pet.png')}
                    style={styles.avatarPet}
                />
            </View>
            <View style={styles.avatarUsers}>
                <Image
                    source={require('../../../images/avatar.jpg')}
                    style={styles.avatarUser}
                />
                <Image
                    source={require('../../../images/empty-pet.png')}
                    style={styles.avatarUser}
                />
            </View>
            <TouchableOpacity style={styles.commandButton}>
                <Text style={styles.panelButtonTitle}>Send Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.commandButton}>
                <Text style={styles.panelButtonTitle}>Keep Swiping</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    matches: {
        marginBottom: 30
    },
    matchText: {
        fontSize: 20
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
    }
})

export default Match