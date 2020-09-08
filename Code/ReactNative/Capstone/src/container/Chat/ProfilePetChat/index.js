import React, { useState, useEffect } from 'react'
import {
    StyleSheet, View,
    Text, ImageBackground,
    ScrollView, TouchableOpacity,
    Dimensions, Modal
} from 'react-native'
import _ from 'lodash'
import axios from 'axios'
import LottieView from 'lottie-react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { color } from '../../../utility'
import { URL_BASE, token } from '../../../api/config';
import { startLoading, stopLoading } from '../../../redux/actions/loadingAction';
import { Container } from '../../../components';
import { convertToAge } from '../../../network';

const { width } = Dimensions.get('window')

const ProfilePetChat = ({ navigation, route }) => {
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
    const [modalOpen, setModalOpen] = useState(false)
    const images = _.concat(info.avatar, info.pictures)
    const pet_active = useSelector(state => state.auth.pet_active)

    const WIDTH = Dimensions.get('screen').width - 20;

    const getInfo = () => {
        dispatch(startLoading())
        axios.get(`${URL_BASE}pets/${petID}/allInfo`, {
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
    }, [petID])

    const change = ({ nativeEvent }) => {
        const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width)
        if (slide != active) {
            setActive(slide)
        }
    }

    const minusMatch = () => {
        axios.put(`${URL_BASE}pets/minusMatch`, {
            pet_ids: [petID, pet_active.id]
        }, { headers: { Authorization: token } })
            .then(res => {

            })
            .catch(error => console.log('ERROR minusMatch()', error))
    }

    const unmatch = () => {
        setModalOpen(false)
        dispatch(startLoading())
        axios.put(`${URL_BASE}pets/unmatch`, {
            pet_active: pet_active.id,
            pet2: petID
        }, { headers: { Authorization: token } })
            .then(res => {
                if (res.data.result == 'ok') {
                    // minusMatch()
                }
                dispatch(stopLoading())
                navigation.goBack()
            })
            .catch(error => {
                dispatch(stopLoading())
                console.log('ERROR unmatch()', error)
            })
    }

    return (
        <Container>
            <ScrollView>
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
                        <TouchableOpacity style={styles.unmatch} onPress={() => setModalOpen(true)}>
                            <Text style={styles.txtUnmatch}>UNMATCH {info.name}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Modal visible={modalOpen} animationType='fade' transparent={true}>
                    <View style={styles.modal}>
                        <View style={styles.modalContent}>
                            <View style={styles.animation}>
                                <LottieView source={require('../../../utility/constants/error.json')} autoPlay loop />
                            </View>
                            <Text style={styles.txtCf}>Unmatch {info.name}?</Text>
                            <Text style={styles.txtDes}>
                                Are you sure you want to unmatch this pet?
                        </Text>
                            <View style={styles.groupBtn}>
                                <TouchableOpacity style={styles.btn} onPress={() => setModalOpen(false)}>
                                    <Text style={styles.txt}>CANCEL</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btn, { backgroundColor: color.RED }]} onPress={unmatch}>
                                    <Text style={styles.txt} >UNMATCH</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    imageProfile: {
        width: width,
        height: 350,
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
    unmatch: {
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#dddddd',
        borderBottomWidth: 1,
        borderBottomColor: '#dddddd',
        paddingVertical: 14,
        marginTop: 15,
    },
    txtUnmatch: {
        color: color.LIGHT_GRAY,
        fontSize: 16,
        fontWeight: 'bold'
    },
    // Modal
    modal: {
        flex: 1,
        backgroundColor: '#000000aa'
    },
    modalContent: {
        backgroundColor: color.WHITE,
        marginHorizontal: 40,
        marginTop: '50%',
        paddingHorizontal: 30,
        paddingTop: 20,
        paddingBottom: 12,
        borderRadius: 8,
        alignItems: 'center'
    },
    animation: {
        width: 80,
        height: 60
    },
    txtCf: {
        fontWeight: 'bold',
        fontSize: 18,
        paddingTop: 12
    },
    txtDes: {
        paddingTop: 5
    },
    groupBtn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        paddingTop: 20
    },
    btn: {
        backgroundColor: color.LIGHT_GRAY,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 6
    },
    txt: {
        color: color.WHITE
    }
})

export default ProfilePetChat