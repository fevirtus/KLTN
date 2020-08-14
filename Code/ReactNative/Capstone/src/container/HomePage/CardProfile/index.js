import React, { useState, useEffect } from 'react';
import {
    StyleSheet, View,
    Text, Image,
    ImageBackground,
    Dimensions, ScrollView,
    TouchableOpacity
} from 'react-native'
import { useDispatch } from 'react-redux';
import _ from 'lodash'
import axios from 'axios'
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { URL_BASE, token } from '../../../api/config';
import { color } from '../../../utility';
import { startLoading, stopLoading } from '../../../redux/actions/loadingAction';
import { Container } from '../../../components';

const { width } = Dimensions.get('window')

const CardProfile = ({ route }) => {
    const { petId } = route.params;
    const dispatch = useDispatch()
    const [active, setActive] = useState(0)
    const [modalOpen, setModalOpen] = useState(false)
    const [info, setInfo] = useState({
        name: '',
        gender: '',
        weight: '',
        age: '',
        avatar: '',
        introduction: '',
        breed_name: '',
        pictures: [],
        user_avatar: '',
        user_name: ''
    })
    var images = _.concat(info.avatar, info.pictures)

    const getInfo = () => {
        dispatch(startLoading())
        axios.get(`${URL_BASE}pets/${petId}/allInfo`, {
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
    }, [petId])

    const change = ({ nativeEvent }) => {
        const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width)
        if (slide != active) {
            setActive(slide)
        }
    }

    return (
        <Container>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ScrollView
                    pagingEnabled
                    horizontal
                    onScroll={change}
                    showsHorizontalScrollIndicator={false}
                >
                    {
                        images.map((image, index) => (
                            <ImageBackground source={{ uri: image }} style={styles.imageProfile} key={index}>
                                <TouchableOpacity onPress={() => { }}>
                                    <Entypo name="dots-three-horizontal" size={28} color={color.PINK} style={styles.iconProfile} />
                                </TouchableOpacity>
                            </ImageBackground>
                        ))
                    }
                </ScrollView>
                <View style={styles.pagination}>
                    {
                        images.length === 1
                            ? null
                            : images.map((i, k) => (
                                <View key={k} style={k == active ? styles.carouselActiveIndicators : styles.carouselIndicators} />
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
                                <Text style={styles.text}>{info.age}</Text>
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
                    <View style={styles.infoUser}>
                        <Image source={{ uri: info.user_avatar }} style={styles.avatar} />
                        <View style={styles.info}>
                            <Text style={styles.name}>{info.user_name}</Text>
                            <Text style={styles.text}>Owner</Text>
                        </View>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.textRp}>TRÌNH BÁO {info.name}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Container>
    )
}

const styles = StyleSheet.create({
    // Bottom sheet profile
    imageProfile: {
        width: width,
        height: 260,
        resizeMode: 'cover',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    iconProfile: {
        padding: 12
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
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
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
    infoUser: {
        flexDirection: 'row',
        paddingVertical: 20
    },
    info: {
        paddingHorizontal: 9,
        paddingTop: 4
    },
    avatar: {
        width: 55,
        height: 55,
        borderRadius: 30
    },
    name: {
        color: color.TEXT,
        fontWeight: 'bold',
        fontSize: 16,
        paddingLeft: 10
    },
    textRp: {
        textAlign: 'center',
        color: color.GRAY,
        borderBottomWidth: 1,
        borderBottomColor: color.LIGHT_LIGHT_GRAY,
        borderTopWidth: 1,
        borderTopColor: color.LIGHT_LIGHT_GRAY,
        paddingVertical: 12,
        marginBottom: 20,
        textTransform: 'uppercase'
    }
})

export default CardProfile