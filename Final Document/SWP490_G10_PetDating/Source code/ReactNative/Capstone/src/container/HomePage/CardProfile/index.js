import React, { useState, useEffect } from 'react';
import {
    StyleSheet, View,
    Text, Image,
    ImageBackground,
    Dimensions, ScrollView,
    TouchableOpacity,
    Modal,
    TextInput
} from 'react-native'
import { useDispatch } from 'react-redux';
import _, { truncate } from 'lodash'
import axios from 'axios'
import LottieView from 'lottie-react-native'
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { URL_BASE, token } from '../../../api/config';
import { color } from '../../../utility';
import { startLoading, stopLoading } from '../../../redux/actions/loadingAction';
import { Container } from '../../../components';
import { convertToAge } from '../../../network';

const { width } = Dimensions.get('window')

const CardProfile = ({ route }) => {
    const { petId } = route.params;
    const dispatch = useDispatch()
    const [active, setActive] = useState(0)
    const [modalOpen, setModalOpen] = useState(false)
    const [modalNoti, setModalNoti] = useState(false)
    const [reportImg, setReportImg] = useState('')
    const [isOther, setIsOther] = useState(false)
    const [checked, setChecked] = useState(0)
    const [otherReason, setOtherReason] = useState('')
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
    const [reason, setReason] = useState([
        'INAPPROPRIATE PHOTOS',
        'FEELS LIKE SPAM',
        'OTHER'
    ])
    const images = _.concat(info.avatar, info.pictures)
    const WIDTH = Dimensions.get('screen').width - 20;

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

    const report = () => {
        let rs = '';
        if (checked == 2) {
            rs = otherReason
        } else {
            rs = reason[checked]
        }

        axios.post(`${URL_BASE}pets/report`, {
            pet_id: petId,
            reason: rs,
            img: reportImg,
        }, { headers: { Authorization: token } })
            .then(res => {
                setModalOpen(false)
                setModalNoti(true)
            })
            .catch(e => {
                console.log(e)
            })
    }

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
                                <TouchableOpacity style={styles.iconProfile}
                                    onPress={() => {
                                        setReportImg(image)
                                        setModalOpen(true)
                                    }}
                                >
                                    <MaterialIcons name="report-problem"
                                        size={30} color={color.PINK}
                                    />
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
                    <View style={styles.infoUser}>
                        <Image source={{ uri: info.user_avatar }} style={styles.avatar} />
                        <View style={styles.info}>
                            <Text style={styles.name}>{info.user_name}</Text>
                            <Text style={styles.text}>Owner</Text>
                        </View>
                    </View>
                    {/* <TouchableOpacity onPress={() => setModalOpen(true)}>
                        <Text style={styles.textRp}>REPORT {info.name}</Text>
                    </TouchableOpacity> */}
                </View>
            </ScrollView>

            <Modal visible={modalOpen} animationType='fade' transparent={true}>
                <View style={styles.modal}>
                    <View style={styles.modalContent}>
                        <Text style={styles.report}>REPORT</Text>
                        <Text style={[styles.text, { paddingBottom: 15 }]}>{info.name} won't know your report</Text>
                        <TouchableOpacity style={styles.modalChild}
                            onPress={() => {
                                setIsOther(false)
                                setChecked(0)
                            }}
                        >
                            <Entypo
                                name="camera"
                                size={21}
                                color={color.WHITE}
                                style={[styles.btnRp, { backgroundColor: color.LIGHT_BLUE }]}
                            />
                            <Text style={styles.textReport}>{reason[0]}</Text>
                            {checked == 0 ? <Ionicons name='checkmark-circle-outline' size={20} style={styles.iconCheck} /> : null}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalChild}
                            onPress={() => {
                                setIsOther(false)
                                setChecked(1)
                            }}
                        >
                            <MaterialCommunityIcons
                                name="robot"
                                size={22}
                                color={color.WHITE}
                                style={[styles.btnRp, { backgroundColor: color.GREEN }]}
                            />
                            <Text style={styles.textReport}>{reason[1]}</Text>
                            {checked == 1 ? <Ionicons name='checkmark-circle-outline' size={20} style={styles.iconCheck} /> : null}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalChild}
                            onPress={() => {
                                setIsOther(true)
                                setChecked(2)
                            }}
                        >
                            <FontAwesome5
                                name="pen"
                                size={17}
                                color={color.WHITE}
                                style={[styles.btnRp, { backgroundColor: color.LIGHT_GRAY }]}
                            />
                            <Text style={[styles.textReport, { borderBottomWidth: 0 }]}>{reason[2]}</Text>
                            {checked == 2 ? <Ionicons name='checkmark-circle-outline' size={20} style={styles.iconCheck} /> : null}
                        </TouchableOpacity>
                        {isOther &&
                            <TextInput
                                value={otherReason}
                                placeholder='Enter others reason ...'
                                style={styles.other}
                                onChangeText={(txt) => setOtherReason(txt)}
                            />
                        }
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.btn} onPress={() => setModalOpen(false)}>CANCEL</Text>
                            <Text style={[styles.btn, { color: color.GREEN }]} onPress={report}>SUBMIT</Text>
                        </View>

                    </View>
                </View>
            </Modal>
            {/* Modal noti */}
            <Modal visible={modalNoti} animationType='fade' transparent={true}>
                <View style={styles.modal}>
                    <View style={styles.modalView}>
                        <View style={styles.animation}>
                            <LottieView source={require('../../../utility/constants/success.json')} autoPlay loop />
                        </View>
                        <Text style={styles.textSuccess}>You have report successful</Text>
                        <View style={styles.ok}>
                            <Text style={styles.okStyle} onPress={() => setModalNoti(false)}>OK</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        </Container >
    )
}

const styles = StyleSheet.create({
    imageProfile: {
        width: width,
        height: 260,
        resizeMode: 'cover',
        // flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    iconProfile: {
        justifyContent: 'center',
        // backgroundColor: 'black',
        position: 'absolute',
        top: 15,
        right: 10,
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        top: 0,
        alignSelf: 'center'
    },
    carouselIndicators: {
        height: 5,
        borderRadius: 5,
        backgroundColor: color.GRAY,
        marginTop: 6,
        marginHorizontal: 2
    },
    carouselActiveIndicators: {
        height: 5,
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
    },
    // Modal
    modal: {
        flex: 1,
        backgroundColor: '#000000aa'
    },
    modalContent: {
        backgroundColor: color.WHITE,
        marginHorizontal: 35,
        marginVertical: '40%',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
        borderRadius: 6,
        alignItems: 'center'
    },
    report: {
        fontSize: 17,
        color: color.BLACK,
        fontWeight: 'bold'
    },
    modalChild: {
        flexDirection: 'row',
        paddingVertical: 10
    },
    btnRp: {
        width: 30,
        height: 30,
        borderRadius: 5,
        textAlign: 'center',
        paddingTop: 4
    },
    textReport: {
        color: color.GRAY,
        width: '75%',
        paddingLeft: 15,
        borderBottomWidth: 1,
        borderBottomColor: color.LIGHT_LIGHT_GRAY,
        paddingVertical: 5,
        fontWeight: '700'
    },
    btn: {
        flex: 1,
        textAlign: 'center',
        paddingVertical: 10,
        color: color.LIGHT_GRAY,
        fontWeight: 'bold'
    },
    textCancel: {
        color: color.GRAY,
        fontWeight: '700',
        textAlign: 'center'
    },
    // Modal noti
    modalView: {
        backgroundColor: color.WHITE,
        marginHorizontal: 40,
        marginTop: '48%',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: 'center'
    },
    animation: {
        width: 100,
        height: 85
    },
    textSuccess: {
        paddingVertical: 10
    },
    ok: {
        backgroundColor: color.LIGHT_BLUE,
        paddingHorizontal: 22,
        paddingVertical: 8,
        borderRadius: 6
    },
    okStyle: {
        fontSize: 16,
        color: color.WHITE
    },
    other: {
        borderWidth: 1,
        borderColor: color.LIGHT_GRAY,
        borderRadius: 5,
        width: '90%',
    },
    iconCheck: {
        color: color.GREEN,
        marginTop: 3,
        // size: 20
    }

})

export default CardProfile