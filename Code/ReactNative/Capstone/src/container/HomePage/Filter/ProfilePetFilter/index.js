import React, { useState, useEffect } from 'react'
import {
    StyleSheet, View,
    Text, Alert,
    ScrollView, TouchableOpacity,
    Dimensions, ImageBackground
} from 'react-native'
import _ from 'lodash'
import axios from 'axios'
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { color } from '../../../../utility'
import { URL_BASE, token } from '../../../../api/config';
import { startLoading, stopLoading } from '../../../../redux/actions/loadingAction';
import { Container } from '../../../../components';
import { saveMatch, systemMsg, updateMatches, convertToAge } from '../../../../network';
import { uuid } from '../../../../utility/constants';

const { width } = Dimensions.get('window')

const ProfilePetFilter = ({ navigation, route }) => {
    const [info, setInfo] = useState({
        name: '',
        gender: '',
        weight: '',
        age: '',
        avatar: '',
        introduction: '',
        breed_name: '',
        pictures: [],
        user_id: '',
        user_avatar: '',
    })
    const { petID } = route.params;
    const dispatch = useDispatch()
    const [active, setActive] = useState(0)
    const [isMatch, setIsMatch] = useState(false)
    const pet_active = useSelector(state => state.auth.pet_active)
    const user = useSelector(state => state.auth.user)
    const vip = useSelector(state => state.vip.vip)

    const images = _.concat(info.avatar, info.pictures)

    const WIDTH = Dimensions.get('screen').width - 20;

    const getInfo = () => {
        dispatch(startLoading())
        axios.get(`${URL_BASE}pets/${petID}/allInfo`, {
            headers: {
                Authorization: token
            }
        }).then(res => {
            // Set info
            console.log('DATA', res.data)
            setInfo(res.data)
            dispatch(stopLoading())
        }).catch(e => {
            console.log("Api call error!", e)
            dispatch(stopLoading())
        })
    }

    const getIsMatch = () => {
        axios.get(`${URL_BASE}pets/isMatch?pet_active=${pet_active.id}&pet2=${petID}`, {
            headers: {
                Authorization: token
            }
        }).then(res => {
            // Set info
            console.log('IS MATCH', res.data)
            setIsMatch(res.data.isMatch)
        }).catch(e => {
            console.log("ERROR isMatch:", e)
        })
    }

    useEffect(() => {
        getInfo()
        getIsMatch()
    }, [petID])

    const change = ({ nativeEvent }) => {
        const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width)
        if (slide != active) {
            setActive(slide)
        }
    }

    const match = () => {

        if (isMatch) return

        if (vip == 0) {
            alert('You need to upgrade to Premium to do this')
            return
        }

        if (pet_active.id) {
            let body = {
                pet_id1: pet_active.id,
                pet_id2: petID,
                user2: info.user_id
            }
            axios.post(`${URL_BASE}common/match`, body, { headers: { Authorization: token } })
                .then(res => {
                    console.log('match', res.data)
                    setIsMatch(true)
                    if (res.data.result === 'ok') {
                        console.log('OK', res.data.data)
                        const { guestUid, guestAvatar, guestName } = res.data.data;
                        saveMatch(uuid, guestUid);
                        saveMatch(guestUid, uuid);

                        //send msg to currentUser
                        let msg = `NOTIFICATION: ${pet_active.name} and ${info.name} have matched each other!`
                        systemMsg(msg, uuid, guestUid, '')

                        //send msg to guest
                        let msg2 = `NOTIFICATION: ${info.name} and ${pet_active.name} have matched each other!`
                        systemMsg(msg2, guestUid, uuid, '')

                        // plus matches + 1
                        updateMatches([pet_active.id, petID])

                        navigation.navigate('Match', {
                            myPet: pet_active.name,
                            myPetAvatar: pet_active.avatar,
                            myAvatar: info.user_avatar,
                            yourPet: info.name,
                            yourPetAvatar: info.avatar,
                            yourAvatar: guestAvatar,
                            yourName: guestName,
                            yourUid: guestUid,
                        })
                    } else {
                        Alert.alert('Successfull', 'Matched successfull, waiting for response!')
                    }
                })
                .catch(e => console.error(e))
        } else {
            Alert.alert('Error', 'You have to choose pet active below to do match')
        }
    }

    return (
        <Container>
            <View style={styles.container}>
                <View>
                    <ScrollView
                        pagingEnabled
                        horizontal
                        onScroll={change}
                        showsHorizontalScrollIndicator={false}
                    >
                        {
                            images.map((image, index) => (
                                <ImageBackground source={{ uri: image }} style={styles.imageProfile} key={index}>
                                </ImageBackground>
                            ))
                        }
                    </ScrollView>
                    <TouchableOpacity style={styles.iconContainer}>
                        <AntDesign
                            name="heart"
                            size={26}
                            color={isMatch ? color.RED : color.GREEN}
                            onPress={match}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.pagination}>
                    {
                        images.length === 1
                            ? null
                            : images.map((i, k) => (
                                <View key={k} style={k == active ? [styles.carouselActiveIndicators, { width: WIDTH / images.length }] : [styles.carouselIndicators, { width: WIDTH / images.length }]} />
                            ))
                    }
                </View>
                <View style={styles.information}>
                    <View style={styles.headerProfile}>
                        <Text style={styles.nameProfile}>{info.name}</Text>
                        {
                            info.gender === 1
                                ? <Ionicons name="md-male-sharp" size={28} color={color.PINK} style={styles.sexProfile} />
                                : info.gender === 0 ? <Ionicons name="md-female-sharp" size={28} color={color.PINK} style={styles.sexProfile} />
                                    : null
                        }
                    </View>
                    {
                        _.isEmpty(info.breed_name)
                            ? null
                            : <View style={styles.details}>
                                <MaterialIcons name="pets" size={22} color={color.PINK} />
                                <Text style={styles.text}>{info.breed_name}</Text>
                            </View>
                    }
                    {
                        _.isEmpty(info.age)
                            ? null
                            : <View style={styles.details}>
                                <MaterialCommunityIcons name="clock-time-nine-outline" size={22} color={color.PINK} />
                                <Text style={styles.text}>{convertToAge(info.age)}</Text>
                            </View>
                    }
                    {
                        _.isEmpty(info.introduction)
                            ? null
                            : <View style={styles.about}>
                                <Text style={styles.textAbout}>About</Text>
                                <Text style={[styles.text, { paddingLeft: 0 }]}>{info.introduction}</Text>
                            </View>
                    }
                </View>
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    imageProfile: {
        width: width,
        height: 250,
        resizeMode: 'cover',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        top: 0,
        alignSelf: 'center'
    },
    carouselIndicators: {
        height: 5,
        width: 70,
        borderRadius: 5,
        backgroundColor: color.GRAY,
        marginTop: 6,
        marginHorizontal: 2
    },
    carouselActiveIndicators: {
        height: 5,
        width: 70,
        borderRadius: 5,
        backgroundColor: color.WHITE,
        marginTop: 6,
        marginHorizontal: 2
    },
    information: {
        paddingHorizontal: 20,
        height: '48%'
    },
    headerProfile: {
        flexDirection: 'row',
        paddingVertical: 8
    },
    nameProfile: {
        fontSize: 22,
        fontWeight: 'bold',
        width: '91%',
        textAlign: 'center',
        paddingLeft: 30,
        color: color.TEXT
    },
    sexProfile: {
        width: '9%',
    },
    details: {
        flexDirection: 'row',
        paddingVertical: 6
    },
    text: {
        color: color.GRAY,
        paddingTop: 2,
        paddingLeft: 10
    },
    about: {
        borderWidth: 0.5,
        borderColor: color.LIGHT_GRAY,
        padding: 8,
        marginTop: 5,
        borderRadius: 12
    },
    textAbout: {
        color: color.PINK,
        fontSize: 16
    },
    iconContainer: {
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        backgroundColor: color.WHITE,
        position: 'absolute',
        right: 10,
        bottom: 10,
    },
})

export default ProfilePetFilter