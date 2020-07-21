import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Text,
    Alert,
    YellowBox
} from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { color } from '../../../../utility';
import { Loading } from '../../../../components'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage';

const PetProfile = ({ navigation, route }) => {
    const { itemId } = route.params;
    const [loading, setLoading] = useState(true)
    const [info, setInfo] = useState({
        name: '',
        breed: '',
        gender: '',
        weight: '',
        age: '',
        avatar: '',
        introduction: ''
    })

    const dataPet = async () => {
        const token = await AsyncStorage.getItem("token")
        axios.get(`https://pet-dating-server.herokuapp.com/api/pets/${itemId}`, {
            headers: {
                Authorization: token
            }
        }).then(res => {
            // Set info
            setInfo(res.data[0])
            setLoading(false)
        }).catch(e => {
            console.log("Api call error!", e)
        })
    }

    useEffect(() => {
        dataPet()
    }, [])


    const _delete = async () => {
        const token = await AsyncStorage.getItem("token")
        axios.delete(`https://pet-dating-server.herokuapp.com/api/pets/${itemId}`, {
            headers: {
                Authorization: token
            }
        }).then(res => {
            console.log(res.data)
            navigation.navigate('Profile')
        })
    }

    const _deletePet = () => {
        Alert.alert(
            `Delete ${name}?`,
            `Are you sure to delete ${name}?`,
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('User cancel delete!'),
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: _delete
                }
            ],
            { cancelable: false }
        )
    }

    const { name, breed, gender, weight, age, introduction, avatar } = info
    return (
        <>
            {
                loading ? <Loading />
                    : <View style={styles.container}>
                        <View style={styles.header}>
                            <Text style={styles.title}>MY PETPROFILE</Text>
                            <Image source={{ uri: avatar }} style={styles.img} />
                            <TouchableOpacity
                                style={styles.buttonDelete}
                                onPress={_deletePet}
                            >
                                <FontAwesome5 name="trash" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonEdit}
                                onPress={() => navigation.navigate('EditPetProfile', { petId: itemId })}
                            >
                                <Entypo name="edit" size={25} color="white" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.content}>
                            <View style={styles.navbar}>
                                <Text style={styles.titleNav}>PET</Text>
                                <View style={styles.horizontalLine}></View>
                            </View>
                            <View style={styles.information}>
                                <View style={styles.contentLeft}>
                                    <View style={styles.item}>
                                        <Text style={styles.subheading}>Name</Text>
                                        <Text style={styles.text}>{name}</Text>
                                    </View>
                                    <View style={styles.item}>
                                        <Text style={styles.subheading}>Breed</Text>
                                        <Text style={styles.text}>{breed}</Text>
                                    </View>
                                    <View style={styles.item}>
                                        <Text style={styles.subheading}>Gender</Text>
                                        <Text style={styles.text}>{gender === 1 ? 'Male' : 'Female'}</Text>
                                    </View>
                                </View>
                                <View style={styles.contentRight}>
                                    <View style={styles.item}>
                                        <Text style={styles.subheading}>Weight</Text>
                                        <Text style={styles.text}>{weight} kg</Text>
                                    </View>
                                    <View style={styles.item}>
                                        <Text style={styles.subheading}>Age</Text>
                                        <Text style={styles.text}>{age}</Text>
                                    </View>
                                    <View style={styles.item}>
                                        <Text style={styles.subheading}>Introduction</Text>
                                        <Text style={styles.text}>{introduction}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
            }
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flex: 1,
        backgroundColor: color.PINK,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 38,
        color: color.WHITE,
        fontWeight: '700',
        letterSpacing: 1.5
    },
    img: {
        width: 110,
        height: 110,
        borderRadius: 100,
        borderWidth: 4,
        borderColor: color.WHITE,
        position: 'absolute',
        top: 146
    },
    buttonEdit: {
        position: 'absolute',
        // top: 180,
        right: 54,
        borderRadius: 50,
        backgroundColor: color.ORANGE,
        width: 38,
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5
    },
    buttonDelete: {
        position: 'absolute',
        // top: 180,
        left: 54,
        borderRadius: 50,
        backgroundColor: color.ORANGE,
        width: 38,
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5
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
        color: color.PINK,
        fontSize: 22
    },
    horizontalLine: {
        borderBottomColor: color.BLACK,
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
        color: color.PINK
    },
    text: {
        fontSize: 18,
        color: color.GRAY
    }
})

YellowBox.ignoreWarnings(['Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
    'Animated.event now requires a second argument for options']);

export default PetProfile;