import React, { useState, useEffect } from 'react'
import {
    StyleSheet, View,
    Text, Image,
    FlatList, TouchableOpacity,
    ScrollView,
    ImageBackground
} from 'react-native'
import axios from 'axios'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useDispatch } from 'react-redux';
import { color } from '../../../utility'
import { URL_BASE, token } from '../../../api/config';
import { startLoading, stopLoading } from '../../../redux/actions/loadingAction';
import { Container, Loading } from '../../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'lodash'

const ProfileUserChat = ({ navigation, route }) => {
    const { uuid } = route.params;
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [info, setInfo] = useState({
        name: '',
        avatar: '',
        vip: '',
        email: '',
        gender: null,
        birth_date: null,
        phone: '',
        pets: []
    })

    const getInfo = () => {
        dispatch(startLoading())
        console.log(`${URL_BASE}users/${uuid}/allInfo`)
        axios.get(`${URL_BASE}users/${uuid}/allInfo`, {
            headers: {
                Authorization: token
            }
        }).then(res => {
            // Set info
            setInfo(res.data)
            dispatch(stopLoading())
            setLoading(false)
        }).catch(e => {
            console.log("Api call error!", e)
            dispatch(stopLoading())
        })
    }

    useEffect(() => {
        getInfo()
    }, [uuid])

    const renderList = ((item) => {
        return (
            <View style={styles.petImageWrapper}>
                <TouchableOpacity onPress={() => navigation.navigate('ProfilePetFilter', { petID: item.id })}>
                    <Image
                        source={item.avatar ? { uri: item.avatar } : require('../../../../images/no-image.jpg')}
                        style={styles.petImage}
                    />
                </TouchableOpacity>
            </View>
        )
    })

    return (
        <Container>
            {
                loading ? <Loading />
                    : <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.header}>
                            <ImageBackground
                                style={styles.img_background}
                                source={info.avatar ? { uri: info.avatar } : require('../../../../images/no-image.jpg')}
                            />
                            <View style={styles.profilePicWrap}>
                                <Image
                                    source={info.avatar ? { uri: info.avatar } : require('../../../../images/no-image.jpg')}
                                    style={styles.imageUser}
                                />
                                {
                                    info.vip === 1
                                        ? <TouchableOpacity style={styles.diamond}>
                                            <FontAwesome name="diamond" size={18} color={color.WHITE} />
                                        </TouchableOpacity> : null
                                }
                            </View>
                        </View>
                        <View style={styles.userName}>
                            <Text style={styles.name}>{info.name}</Text>
                            {info.gender == null ? null :
                                (info.gender == 1 ? <Ionicons name={'md-male-sharp'} size={20} color={color.PINK} />
                                    : <Ionicons name={'md-female-sharp'} size={20} color={color.PINK} />)
                            }
                        </View>
                        {!_.isEmpty(info.birth_date) &&
                            <View style={styles.birth}>
                                <FontAwesome name="birthday-cake" size={18} color={color.GRAY} />
                                <Text style={styles.txtBd}>{info.birth_date}</Text>
                            </View>
                        }
                        <View style={styles.numberPet}>
                            <Text style={styles.text}>{info.pets.length} pets</Text>
                        </View>
                        <View style={styles.pet}>
                            <FlatList
                                numColumns={2}
                                data={info.pets}
                                renderItem={({ item }) => {
                                    return renderList(item)
                                }}
                                keyExtractor={(_, index) => index.toString()}
                            />
                        </View>

                    </ScrollView>
            }
        </Container>
    )
}

const styles = StyleSheet.create({
    profilePicWrap: {
        width: 100,
        height: 100,
        borderRadius: 100,
        alignSelf: 'center',
        marginVertical: 20,
        position: 'absolute',
        bottom: 0
    },
    imageUser: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: color.WHITE
    },
    diamond: {
        width: 28,
        height: 28,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 74,
        left: 70,
        backgroundColor: color.YELLOW,
        borderWidth: 2,
        borderColor: color.WHITE
    },
    name: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        color: color.BLACK
    },
    numberPet: {
        backgroundColor: '#3282b8',
        alignSelf: 'center',
        padding: 8,
        marginTop: 15,
        borderRadius: 5
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: color.WHITE
    },
    pet: {
        paddingHorizontal: 25,
        paddingTop: 20
    },
    petImageWrapper: {
        padding: 10
    },
    petImage: {
        height: 160,
        width: 160,
        borderRadius: 25,
    },
    img_background: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 250
    },
    header: {
        height: 300
    },
    userName: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    email: {
        textAlign: 'center',
        fontSize: 15,
        color: color.GRAY
    },
    birth: {
        flexDirection: 'row',
        alignSelf: 'center',
        width: '24%',
        justifyContent: 'space-between',
        paddingVertical: 5
    },
    txtBd: {
        color: color.GRAY,
        fontSize: 15
    }
})

export default ProfileUserChat