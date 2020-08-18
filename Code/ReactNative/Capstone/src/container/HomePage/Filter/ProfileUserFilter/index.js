import React, { useState, useEffect } from 'react'
import {
    StyleSheet, View,
    Text, Image, Dimensions,
    FlatList, TouchableOpacity,
    ScrollView,
    ImageBackground
} from 'react-native'
import axios from 'axios'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useDispatch } from 'react-redux';
import { color } from '../../../../utility'
import { URL_BASE, token } from '../../../../api/config';
import { startLoading, stopLoading } from '../../../../redux/actions/loadingAction';
import { Container, Loading } from '../../../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'lodash'

const ProfileUserFilter = ({ navigation, route }) => {
    const { uid } = route.params;
    const dispatch = useDispatch()
    const [info, setInfo] = useState({
        name: '',
        avatar: '',
        is_vip: '',
        email: '',
        gender: null,
        birth_date: null,
        phone: '',
        pets: []
    })

    const getInfo = () => {
        dispatch(startLoading())
        console.log(`${URL_BASE}users/${uid}/allInfo`)
        axios.get(`${URL_BASE}users/${uid}/allInfo`, {
            headers: {
                Authorization: token
            }
        }).then(res => {
            console.log('DATA', res.data)
            // Set info
            setInfo(res.data)
            dispatch(stopLoading())
        }).catch(e => {
            console.log("Api call error!", e)
            dispatch(stopLoading())
        })
    }


    useEffect(() => {
        getInfo()
    }, [uid])

    const renderList = ((item) => {
        return (
            <View style={styles.petImageWrapper}>
                <TouchableOpacity onPress={() => navigation.navigate('ProfilePetFilter', { petID: item.id })}>
                    <Image
                        source={item.avatar ? { uri: item.avatar } : require('../../../../../images/no-image.jpg')}
                        style={styles.petImage}
                    />
                </TouchableOpacity>
            </View>
        )
    })

    return (
        <Container>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <ImageBackground
                        style={styles.img_background}
                        source={info.avatar ? { uri: info.avatar } : require('../../../../../images/no-image.jpg')}
                    />
                    <View style={styles.profilePicWrap}>
                        <Image
                            source={info.avatar ? { uri: info.avatar } : require('../../../../../images/no-image.jpg')}
                            style={styles.imageUser}
                        />
                        {
                            info.is_vip === 1
                                ? <TouchableOpacity style={styles.diamond}>
                                    <FontAwesome name="diamond" size={18} color={color.WHITE} />
                                </TouchableOpacity> : null
                        }
                    </View>
                </View>
                <View
                    style={styles.userName}
                >
                    <Text style={styles.name}>{info.name}</Text>
                    {info.gender == null ? null :
                        (info.gender == 1 ? <Ionicons name={'md-male-sharp'} size={20} color={color.PINK} />
                            : <Ionicons name={'md-female-sharp'} size={20} color={color.PINK} />)
                    }
                </View>
                <Text style={styles.email}>{info.email}</Text>

                <View style={styles.numberPet}>
                    <Text style={styles.text}>{info.pets.length} pets</Text>
                </View>
                <View style={styles.pet}>
                    <FlatList
                        horizontal={true}
                        data={info.pets}
                        renderItem={({ item }) => {
                            return renderList(item)
                        }}
                        keyExtractor={(_, index) => index.toString()}
                    />
                </View>
                <View style={styles.moreInfo}>
                    <Text style={{ fontSize: 18, color: color.GRAY }}>MORE INFORMATION:</Text>
                    {!_.isEmpty(info.phone) &&
                        <View style={styles.info}>
                            <Text style={styles.title}>Phone:</Text>
                            <Text style={styles.infoData}>{info.phone}</Text>
                        </View>
                    }
                    {!_.isEmpty(info.birth_date) &&
                        <View style={styles.info}>
                            <Text style={styles.title}>Birthday:</Text>
                            <Text style={styles.infoData}>{info.birth_date}</Text>
                        </View>
                    }
                </View>
            </ScrollView>
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
        backgroundColor: color.BLUE,
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
        // marginTop: 10,
        // marginBottom: 10,
        // marginLeft: 15,
        // marginRight: 10,
        padding: 5
    },
    petImage: {
        height: 100,
        width: 100,
        borderRadius: 50,
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
    moreInfo: {
        paddingHorizontal: 20,
        paddingTop: 20,

    },
    email: {
        textAlign: 'center',
        fontSize: 15,
        color: color.GRAY
    },
    info: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 5
    },
    title: {
        flex: 1,
        color: color.GRAY,
    },
    infoData: {
        flex: 3,
        color: color.GRAY,
    }
})

export default ProfileUserFilter