import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Title, Subheading, Text } from 'react-native-paper'
import Entypo from 'react-native-vector-icons/Entypo'

const colors = {
    orange: '#ff7315',
    pink: '#FF82A9',
    white: '#fff',
    grey: 'grey'
}

export default function PetProfile() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>MY PETPROFILE</Text>
                <Image source={require('../../images/users/2.jpg')} style={styles.img}/>
                <TouchableOpacity style={styles.buttonEdit}>
                    <Entypo name="edit" size={25} color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <View style={styles.navbar}>
                    <Title style={styles.titleNav}>PET</Title>
                    <View style={styles.horizontalLine}></View>
                </View>
                <View style={styles.information}>
                    <View style={styles.contentLeft}>
                        <View style={styles.item}>
                            <Subheading style={styles.subheading}>Name</Subheading>
                            <Text style={styles.text}>Charley</Text>
                        </View>
                        <View style={styles.item}>
                            <Subheading style={styles.subheading}>Breed</Subheading>
                            <Text style={styles.text}>Pitbull</Text>
                        </View>
                        <View style={styles.item}>
                            <Subheading style={styles.subheading}>Gender</Subheading>
                            <Text style={styles.text}>Male</Text>
                        </View>  
                    </View>
                    <View style={styles.contentRight}>
                        <View style={styles.item}>
                            <Subheading style={styles.subheading}>Weight</Subheading>
                            <Text style={styles.text}>5 kg</Text>
                        </View> 
                        <View style={styles.item}>
                            <Subheading style={styles.subheading}>Age</Subheading>
                            <Text style={styles.text}>2</Text>
                        </View> 
                        <View style={styles.item}>
                            <Subheading style={styles.subheading}>City</Subheading>
                            <Text style={styles.text}>Ha Noi</Text>
                        </View> 
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flex: 1,
        backgroundColor: colors.pink,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 38,
        color: colors.white,
        fontWeight: '700',
        letterSpacing: 1.5
    },
    img: {
        width: 110,
        height: 110,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: colors.white,
        position: 'absolute',
        top: 146
    },
    buttonEdit: {
        position: 'absolute',
        top: 180,
        right: 40,
        borderRadius: 50,
        backgroundColor: colors.orange,
        width: 38,
        height: 38,
        alignItems: 'center',
        justifyContent: 'center'
    },
    content: {
        flex: 2,
    },
    navbar: {
        paddingTop: 80,
        paddingLeft: 45,
        flexDirection: 'row'
    },
    titleNav: {
        fontWeight: '700',
        color: colors.pink,
        fontSize: 22
    },
    horizontalLine: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        width: '72%',
        marginBottom: 5,
        marginLeft: 12
    },
    information: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 32
    },
    contentLeft: {
        width: '50%',
        paddingLeft: 45
    },
    contentRight: {
        width: '50%',
        paddingLeft: 20
    },
    item: {
        paddingBottom: 28
    },
    subheading: {
        fontSize: 18,
        color: colors.pink
    },
    text: {
        fontSize: 18,
        color: colors.grey
    }
})