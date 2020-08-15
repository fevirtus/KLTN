import React, { useState, useEffect } from 'react'
import {
    StyleSheet, View,
    Text, Image,
    FlatList, TouchableOpacity
} from 'react-native'
import axios from 'axios'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useDispatch } from 'react-redux';
import { color } from '../../../../utility'
import { URL_BASE, token } from '../../../../api/config';
import { startLoading, stopLoading } from '../../../../redux/actions/loadingAction';
import { Container } from '../../../../components';

const ProfileUserFilter = ({ navigation, route }) => {
    const { uid } = route.params;
    const dispatch = useDispatch()
    const [info, setInfo] = useState({
        name: '',
        avatar: '',
        is_vip: '',
        pets: []
    })

    const getInfo = () => {
        dispatch(startLoading())
        axios.get(`${URL_BASE}users/${uid}/allInfo`, {
            headers: {
                Authorization: token
            }
        }).then(res => {
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
            <Text style={styles.name}>{info.name}</Text>
            <View style={styles.pet}>
                <Text style={styles.text}>{info.pets.length} thú cưng của {info.name}</Text>
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    data={info.pets}
                    renderItem={({ item }) => {
                        return renderList(item)
                    }}
                    keyExtractor={(_, index) => index.toString()}
                />
            </View>
        </Container>

    )
}

const styles = StyleSheet.create({
    profilePicWrap: {
        width: 100,
        height: 100,
        borderRadius: 100,
        alignSelf: 'center',
        marginTop: 50,
        marginBottom: 22
    },
    imageUser: {
        width: 100,
        height: 100,
        borderRadius: 100,
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
        fontSize: 18,
        fontWeight: 'bold',
        color: color.BLACK
    },
    pet: {
        paddingHorizontal: 25,
        paddingTop: 40
    },
    petImageWrapper: {
        marginVertical: 15,
        marginRight: 15
    },
    petImage: {
        height: 70,
        width: 70,
        borderRadius: 50,
        borderWidth: 3
    },
})

export default ProfileUserFilter