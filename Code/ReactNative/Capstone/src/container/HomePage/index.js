import React, { useEffect, useRef, useState } from 'react';
import {
    Image, StyleSheet,
    Text, ScrollView,
    TouchableOpacity, View,
    YellowBox, FlatList,
    Alert, ImageBackground,
    Modal,
    Dimensions
} from 'react-native';
import Axios from 'axios';
import Swiper from 'react-native-deck-swiper';
import Swipe from 'react-native-swiper'
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient'
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomSheet from 'reanimated-bottom-sheet'
import { useSelector, useDispatch } from 'react-redux';
import { token, URL_BASE } from '../../api/config';
import { Container, Loading } from '../../components';
import { color } from '../../utility';
import { uuid } from '../../utility/constants';
import { saveMatch, senderMsg, recieverMsg, systemMsg, updateMatches } from '../../network';
import _ from 'lodash'
import { saveActivePet } from '../../redux/actions/authActions';

const Home = ({ navigation }) => {
    const dispatch = useDispatch()
    const pet_active = useSelector(state => state.auth.pet_active)
    const user = useSelector(state => state.auth.user)
    const my_pets = useSelector(state => state.auth.pets)

    const [data, setData] = useState([])
    const [index, setIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const hide = useSelector(state => state.home.isHideSwiper)
    const swiperRef = useRef(null)
    const onSwiped = () => {
        setIndex((index + 1) % data.length)
    }
    const [modalOpen, setModalOpen] = useState(false)

    const bs = useRef(null)

    const fetchData = () => {
        console.log('Fetch Data----------------')
        if (pet_active.id) {
            Axios.get(`${URL_BASE}pets/others?breed=${pet_active.breed}&gender=${pet_active.gender}&pet_active=${pet_active.id}`, {
                headers: {
                    Authorization: token
                },
            }).then(res => {
                console.log('DATA', res.data)
                console.log('1')
                setData(res.data)
                console.log('2')
                setIndex(0)
                console.log('3')
                setLoading(false)
                console.log('4')
            }).catch(e => {
                console.log("Api call error! 000", e)
            })
        } else {
            // fetchDataAll()
        }

    }

    const fetchDataAll = () => {
        Axios.get(`${URL_BASE}pets/allOthers`, {
            headers: {
                Authorization: token
            },
        }).then(res => {
            console.log(res.data)
            setData(res.data)
            setIndex(0)
            setLoading(false)
        }).catch(e => {
            console.log("Api call error!", e)
        })
    }

    useEffect(() => {
        fetchData()
    }, [pet_active])

    const petActive = async (pet) => {
        const edit_petId = {
            pet_id: pet.id
        }
        Axios.put(`${URL_BASE}pets/setActive`, edit_petId, {
            headers: {
                Authorization: token
            }
        }).then(res => {
            // alert('Set active successful')
            dispatch(saveActivePet(pet))
        }).catch((e) => {
            alert(e.message)
        })
    }

    const onSwipedRight = (cardIndex) => {
        console.log('LIKE', data[cardIndex])
        let petId = data[cardIndex].id;
        react('LIKE', petId);
    }

    const onSwipedLeft = (cardIndex) => {
        console.log('NOPE', data[cardIndex])
        let petId = data[cardIndex].id;
        react('NOPE', petId);
    }

    const onSwipedTop = (cardIndex) => {
        console.log('MATCH', data[cardIndex])
        let pet = data[cardIndex];
        match(pet);
    }

    const match = (pet) => {
        if (pet_active.id) {
            let body = {
                pet_id1: pet_active.id,
                pet_id2: pet.id,
                user2: pet.user_id
            }
            Axios.post(`${URL_BASE}common/match`, body, { headers: { Authorization: token } })
                .then(res => {
                    if (res.data.result === 'ok') {
                        console.log('OK', res.data.data)
                        const { guestUid, guestAvatar, guestName } = res.data.data;
                        saveMatch(uuid, guestUid);
                        saveMatch(guestUid, uuid);

                        //send msg to currentUser
                        let msg = `NOTIFICATION: ${pet_active.name} and ${pet.name} have matched each other!`
                        systemMsg(msg, uuid, guestUid, '')

                        //send msg to guest
                        let msg2 = `NOTIFICATION: ${pet.name} and ${pet_active.name} have matched each other!`
                        systemMsg(msg2, guestUid, uuid, '')

                        // plus matches + 1
                        updateMatches([pet_active.id, pet.id])

                        navigation.navigate('Match', {
                            myPet: pet_active.name,
                            myPetAvatar: pet_active.avatar,
                            myAvatar: user.avatar,
                            yourPet: pet.name,
                            yourPetAvatar: pet.avatar,
                            yourAvatar: guestAvatar,
                            yourName: guestName,
                            yourUid: guestUid,
                        })
                    }
                })
                .catch(e => console.error(e))
        } else {
            Alert.alert('Error', 'You have to choose pet active below to do match')
        }
    }

    const react = (reaction, petId) => {
        Axios.post(`${URL_BASE}common/react`, {
            pet_id: petId,
            reaction: reaction
        }, { headers: { Authorization: token } })
            .then(res => {
                console.log(res.data)
            })
            .catch(e => console.error(e))
    }

    const renderList = ((item) => {
        return (
            <View style={styles.petImageWrapper}>
                <TouchableOpacity onPress={() => petActive(item)}>
                    <Image
                        source={item.avatar ? { uri: item.avatar } : require('../../../images/no-image.jpg')}
                        style={[styles.petImage,
                        item.id === pet_active.id
                            ? { borderColor: color.GREEN }
                            : { borderColor: color.RED }
                        ]}
                    />
                </TouchableOpacity>
            </View>
        )
    })

    const renderHeader = () => (
        <View style={styles.header} >
            <View style={styles.panelHeader}>
                <TouchableOpacity onPress={() => bs.current.snapTo(1)}>
                    <View style={styles.panelHandle}></View>
                </TouchableOpacity>
            </View>
        </View>
    )

    const renderInner = () => (
        <View style={styles.panel}>
            <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                data={my_pets}
                renderItem={({ item }) => {
                    return renderList(item)
                }}
                keyExtractor={(_, index) => index.toString()}
            />
        </View>
    )

    const Card = (({ item }) => {
        let images = _.concat(item.avatar, item.pictures)
        console.log('IMG', images)
        let dotWidth = (Dimensions.get('screen').width * 0.82) / images.length

        return (
            <Swipe
                showsButtons={true}
                loop={false}
                scrollEnabled={false}
                dot={
                    <View style={{
                        height: 5,
                        width: dotWidth,
                        borderRadius: 5,
                        backgroundColor: color.GRAY,
                        marginHorizontal: 2
                    }} />
                }
                activeDot={
                    <View
                        style={{
                            height: 5,
                            width: dotWidth,
                            borderRadius: 5,
                            backgroundColor: color.PINK,
                            marginHorizontal: 2
                        }}
                    />
                }
                paginationStyle={{
                    position: 'absolute',
                    bottom: '98%'
                }}
                nextButton={
                    <Text style={styles.buttonText}>›</Text>
                }
                prevButton={
                    <Text style={styles.buttonText}>‹</Text>
                }
            >
                {
                    images.map((image, index) => (
                        <ImageBackground
                            style={styles.card}
                            source={{ uri: image }}
                            imageStyle={{ borderRadius: 8 }}
                            key={index}
                        >
                            <TouchableOpacity style={styles.infoBtn}>
                                <Foundation
                                    name="info"
                                    size={32}
                                    color={color.PINK}
                                    onPress={() => navigation.navigate('CardProfile', { petId: item.id })}
                                />
                            </TouchableOpacity>
                            <Text style={styles.title}>{item.name}</Text>
                            <View style={styles.bottomButtonsContainer}>
                                <TouchableOpacity style={styles.iconContainer}>
                                    <AntDesign
                                        name="close"
                                        size={33}
                                        color={color.RED}
                                        onPress={() => {
                                            swiperRef.current.swipeLeft()
                                        }}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.iconContainer}>
                                    <AntDesign
                                        name="heart"
                                        size={32}
                                        color={color.GREEN}
                                        onPress={() => {
                                            swiperRef.current.swipeTop()
                                        }}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.iconContainer}>
                                    <AntDesign
                                        name="star"
                                        size={32}
                                        color={color.BLUE}
                                        onPress={() => {
                                            swiperRef.current.swipeRight()
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </ImageBackground>
                    ))
                }

            </Swipe >
        )
    })

    return (
        <View style={styles.container}>
            {/* Modal */}
            <Modal visible={modalOpen} animationType='fade' transparent={true}>
                <View style={styles.modalContent}>
                    <LinearGradient colors={[color.YELLOW, color.WHITE, color.WHITE]} style={styles.modal}>
                        <Text style={styles.textPre}>Đăng ký Premium</Text>
                        <TouchableOpacity style={styles.btnReturnAds}>
                            <MaterialCommunityIcons
                                name="reload"
                                size={30}
                                color={color.ORANGE}
                            />
                        </TouchableOpacity>
                        <Text style={styles.textPre2}>Bạn có thể Quay lại bao nhiêu lần tùy ý</Text>
                        <Text style={styles.textPre3}>Nếu lỡ vuốt nhầm cũng chớ lo, bạn có thể sửa chữa ngay và luôn</Text>
                        <View style={styles.price}>
                            <Text style={styles.textPrice}>Chỉ 59.000 đ/3 tháng</Text>
                        </View>
                        <TouchableOpacity style={styles.commandButton} onPress={() => navigation.navigate('Premium')}>
                            <Text style={styles.panelButtonTitle}>Đăng ký Premium</Text>
                        </TouchableOpacity>
                        <Text style={styles.textPre4} onPress={() => setModalOpen(false)}>Không phải bây giờ, cảm ơn</Text>
                    </LinearGradient>
                    <Text style={styles.textCancel}>Thanh toán định kỳ, hủy bỏ bất cứ lúc nào.</Text>
                </View>
            </Modal>

            {hide ?
                (<Container>
                    <View style={styles.container}>
                        <View style={styles.hideMode}>
                            <FontAwesome5 name="umbrella-beach" size={150} color={color.GRAY} />
                            <Text style={styles.textHide}>Nothing to see here!</Text>
                        </View>
                    </View>
                </Container>) :
                (<Container>
                    <View style={styles.container}>
                        {/* Bottom list pet */}
                        <BottomSheet
                            ref={bs}
                            snapPoints={['20%', 0]}
                            renderContent={renderInner}
                            renderHeader={renderHeader}
                            initialSnap={1}
                            enabledGestureInteraction={true}
                        />
                        {/* Content */}
                        {
                            loading ? <Loading /> : (_.isEmpty(data) ? null
                                : <View style={styles.swiperContainer}>
                                    <Swiper
                                        cards={data}
                                        cardIndex={index}
                                        renderCard={(item) => {
                                            // console.log('DATA', data)
                                            return <Card item={item} />
                                        }}
                                        ref={swiperRef}
                                        onSwiped={onSwiped}
                                        onSwipedLeft={onSwipedLeft}
                                        onSwipedRight={onSwipedRight}
                                        onSwipedTop={onSwipedTop}
                                        stackSize={2}
                                        infinite
                                        disableBottomSwipe
                                        backgroundColor={'transparent'}
                                        // onSwipedAll={() => console.log('end')}
                                        overlayLabels={{
                                            left: {
                                                title: 'NOPE',
                                                style: {
                                                    label: {
                                                        backgroundColor: 'transparent',
                                                        color: color.RED,
                                                        fontSize: 24,
                                                        borderColor: color.RED,
                                                        borderWidth: 3
                                                    },
                                                    wrapper: {
                                                        flexDirection: 'column',
                                                        alignItems: 'flex-end',
                                                        justifyContent: 'flex-start',
                                                        marginTop: 15,
                                                        marginLeft: -20,
                                                    }
                                                }
                                            },
                                            right: {
                                                title: 'LIKE',
                                                style: {
                                                    label: {
                                                        backgroundColor: 'transparent',
                                                        color: color.BLUE,
                                                        fontSize: 24,
                                                        borderColor: color.BLUE,
                                                        borderWidth: 3
                                                    },
                                                    wrapper: {
                                                        flexDirection: 'column',
                                                        alignItems: 'flex-start',
                                                        justifyContent: 'flex-start',
                                                        marginTop: 15,
                                                        marginLeft: 20
                                                    }
                                                }
                                            },
                                            top: {
                                                title: 'MATCH',
                                                style: {
                                                    label: {
                                                        backgroundColor: 'transparent',
                                                        color: color.GREEN,
                                                        fontSize: 24,
                                                        borderColor: color.GREEN,
                                                        borderWidth: 3
                                                    },
                                                    wrapper: {
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        marginTop: -60
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </View>
                            )
                        }
                        <Animated.View style={styles.bottom}>
                            <TouchableOpacity style={styles.btnReturn}>
                                <MaterialIcons
                                    name="child-friendly"
                                    size={24}
                                    color={color.RED}
                                    onPress={() => { console.log(data, index) }}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.activePet} onPress={() => bs.current.snapTo(0)}>
                                <Ionicons name="ios-add-circle" size={30} color={color.PINK} />
                            </TouchableOpacity>
                            {
                                user.is_vip === 1
                                    ? <TouchableOpacity style={styles.btnReturn}>
                                        <MaterialCommunityIcons
                                            name="reload"
                                            size={25}
                                            color={color.ORANGE}
                                            onPress={() => {
                                                swiperRef.current.swipeBack()
                                            }}
                                        />
                                    </TouchableOpacity>
                                    : <TouchableOpacity style={[styles.btnReturn, { backgroundColor: color.LIGHT_LIGHT_GRAY }]}>
                                        <MaterialCommunityIcons
                                            name="reload"
                                            size={25}
                                            color={color.ORANGE}
                                            onPress={() => setModalOpen(true)}
                                        />
                                    </TouchableOpacity>
                            }
                        </Animated.View>
                    </View>
                </Container>)
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    // Swiper styles
    swiperContainer: {
        flex: 1
    },
    card: {
        flex: 0.82
    },
    infoBtn: {
        flex: 4,
        position: 'relative',
        top: 8,
        right: 12,
        alignItems: 'flex-end'
    },
    title: {
        flex: 1,
        fontSize: 28,
        color: color.WHITE,
        alignSelf: 'center',
        position: 'relative',
        top: 20,
    },
    bottomButtonsContainer: {
        flex: 1,
        width: 400,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignSelf: 'center'
    },
    iconContainer: {
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        width: 52,
        height: 52,
        backgroundColor: color.WHITE
    },
    petImageWrapper: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 10
    },
    petImage: {
        height: 70,
        width: 70,
        borderRadius: 50,
        borderWidth: 3
    },
    bottom: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 16
    },
    btnReturn: {
        borderRadius: 25,
        elevation: 3,
        justifyContent: 'center',
        alignItems: 'center',
        width: 35,
        height: 35,
        backgroundColor: color.WHITE,
        marginHorizontal: 20
    },
    // Hide mode
    hideMode: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.LIGHT_GRAY,
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 8,
        elevation: 4
    },
    textHide: {
        fontSize: 28,
        fontWeight: 'bold',
        color: color.GRAY,
        paddingTop: 22
    },
    // Pet active
    activePet: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    // Bottom sheet pet active
    header: {
        backgroundColor: color.WHITE,
        paddingTop: 12,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 2
    },
    panelHeader: {
        alignItems: 'center'
    },
    panelHandle: {
        width: 55,
        height: 6,
        borderRadius: 4,
        backgroundColor: color.LIGHT_GRAY,
        marginBottom: 10
    },
    panel: {
        backgroundColor: color.WHITE,
        height: '100%'
    },
    // Modal 
    commandButton: {
        padding: 10,
        borderRadius: 25,
        backgroundColor: color.PINK,
        alignItems: 'center',
        marginTop: 15,
        width: '90%'
    },
    panelButtonTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: color.WHITE,
    },
    modalContent: {
        flex: 1,
        backgroundColor: '#000000aa'
    },
    modal: {
        backgroundColor: color.WHITE,
        marginHorizontal: 40,
        marginTop: '20%',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        borderRadius: 6,
        alignItems: 'center'
    },
    textPre: {
        color: color.WHITE,
        fontWeight: 'bold',
        fontSize: 18
    },
    btnReturnAds: {
        borderRadius: 25,
        elevation: 6,
        justifyContent: 'center',
        alignItems: 'center',
        width: 48,
        height: 48,
        backgroundColor: color.WHITE,
        marginTop: 10,
        marginBottom: 18
    },
    textPre2: {
        fontWeight: '700',
        textAlign: 'center',
        paddingBottom: 5,
        fontSize: 16,
        lineHeight: 22
    },
    textPre3: {
        textAlign: 'center',
        color: color.DARK_GRAY,
        lineHeight: 20,
        fontSize: 13
    },
    price: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: color.LIGHT_PINK,
        alignItems: 'center',
        marginTop: 15,
        width: '70%',
        elevation: 3
    },
    textPrice: {
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontSize: 15
    },
    textPre4: {
        color: color.LIGHT_GRAY,
        fontSize: 15,
        fontWeight: 'bold',
        paddingTop: 18,
        letterSpacing: 1.2
    },
    textCancel: {
        textAlign: 'center',
        color: color.WHITE,
        marginTop: 10,
        fontSize: 11,
        letterSpacing: 0.6
    },
    buttonText: {
        color: color.PINK,
        fontSize: 60,
        paddingBottom: '35%'
    }
});

YellowBox.ignoreWarnings(['Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
    'Animated.event now requires a second argument for options']);

export default Home;