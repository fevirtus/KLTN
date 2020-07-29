import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Text,
    Alert,
    YellowBox,
    ImageBackground
} from 'react-native'
import axios from 'axios'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { color } from '../../../../utility';
import { Loading } from '../../../../components'
import { URL_BASE, token } from '../../../../api/config'
import { useDispatch } from 'react-redux';
import { deletePet } from '../../../../redux/actions/authActions';

const PetProfile = ({ navigation, route }) => {
    const { petId } = route.params;
    const [loading, setLoading] = useState(true)
    const [info, setInfo] = useState({
        name: '',
        breed: '',
        gender: '',
        weight: '',
        age: '',
        avatar: '',
        introduction: '',
        is_active: ''
    })
    const dispatch = useDispatch()

    const getPet = async () => {
        // const token = await AsyncStorage.getItem("token")
        axios.get(`${URL_BASE}pets/${petId}`, {
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
        console.log('get pet by id ----------------')
        const unsubscribe = navigation.addListener('focus', () => {
            getPet()
        });
        return unsubscribe;
    }, [navigation, petId])

    const _delete = async () => {
        axios.delete(`${URL_BASE}pets/${petId}`, { headers: { Authorization: token } })
            .then(res => {
                dispatch(deletePet(petId))
                navigation.goBack()
            })
            .catch(e => console.error(e))
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

    const onEditPet = () => {
        navigation.navigate('EditPetProfile', { petInfo: info, petId: petId })
    }

    const { name, breed, gender, weight, age, introduction, avatar, is_active } = info
    return (
        <>
            {
                loading ? <Loading />
                    : <View style={styles.container}>
                        <ImageBackground
                            style={styles.header}
                            source={avatar ? { uri: avatar } : require('../../../../../images/no-image.jpg')}
                            blurRadius={0.6}
                        >
                            <Image source={avatar ? { uri: avatar } : require('../../../../../images/no-image.jpg')} style={styles.img} />
                            <TouchableOpacity
                                style={styles.buttonDelete}
                                onPress={_deletePet}
                            >
                                <FontAwesome5 name="trash" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonEdit}
                                onPress={onEditPet}
                            >
                                <Entypo name="edit" size={25} color="white" />
                            </TouchableOpacity>
                        </ImageBackground>
                        <View style={styles.content}>
                            <View style={styles.petname}>
                                {/* <Text style={styles.titleNav}>PET</Text> */}
                                <Text style={styles.name}>{name}</Text>
                            </View>
                            <View style={styles.information}>
                                <View style={styles.contentLeft}>
                                    <View style={styles.item}>
                                        <Text style={styles.subheading}>Breed</Text>
                                        <Text style={styles.text}>{breed}</Text>
                                    </View>
                                    <View style={styles.item}>
                                        <Text style={styles.subheading}>Gender</Text>
                                        <Text style={styles.text}>{gender === 1 ? 'Male' : 'Female'}</Text>
                                    </View>
                                    {/* <View style={styles.item}>
                                        <Text style={styles.subheading}>Status</Text>
                                        <Text style={styles.text}>{is_active == 0 ? 'Inactive' : 'Active'}</Text>
                                    </View> */}
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
                                </View>
                            </View>
                        </View>
                        <View style={styles.introduction}>
                            <Text style={styles.subheading}>Introduction</Text>
                            <Text style={styles.text}>{introduction}</Text>
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
        alignItems: 'center',
        justifyContent: 'center'
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
        top: 180,
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
        top: 180,
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
        flex: 1,
        flexDirection: 'column'
    },
    navbar: {
        paddingTop: 75,
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
        paddingTop: 22,
    },
    contentLeft: {
        flex: 1,
        // paddingLeft: 45
    },
    contentRight: {
        flex: 1,
        // paddingLeft: 20,
    },
    item: {
        paddingBottom: 22,
        alignItems: 'center',
    },
    subheading: {
        fontSize: 18,
        color: color.PINK
    },
    text: {
        fontSize: 18,
        color: color.GRAY
    },
    petname: {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 40
    },
    name: {
        fontSize: 30,
        color: color.BLACK,
        fontWeight: "bold",
        textDecorationLine: 'underline'
    },
    introduction: {
        alignItems: 'center',
        flex: 1,
        paddingTop: 20,
    }
})

YellowBox.ignoreWarnings(['Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
    'Animated.event now requires a second argument for options']);

export default PetProfile;