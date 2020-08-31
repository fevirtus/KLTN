import React, { useEffect, useRef, useState } from 'react';
import {
    Image, StyleSheet,
    Text, Dimensions,
    TouchableOpacity, View,
    YellowBox, FlatList,
    Alert, ImageBackground,
    Modal
} from 'react-native';
import _ from 'lodash'
import Axios from 'axios';
import Swipe from 'react-native-swiper'
import LottieView from 'lottie-react-native'
import Swiper from 'react-native-deck-swiper';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet'
import { useSelector, useDispatch } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient'
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { color } from '../../utility';
import { uuid } from '../../utility/constants';
import { token, URL_BASE } from '../../api/config';
import { Container, Loading } from '../../components';
import { saveActivePet } from '../../redux/actions/authActions';
import { saveMatch, systemMsg, updateMatches } from '../../network';
import { startLoading, stopLoading } from '../../redux/actions/loadingAction';

const Home = ({ navigation }) => {
    const dispatch = useDispatch()
    const pet_active = useSelector(state => state.auth.pet_active)
    const user = useSelector(state => state.auth.user)
    const my_pets = useSelector(state => state.auth.pets)
    const vip = useSelector(state => state.vip.vip)

    const [data, setData] = useState([])
    const [index, setIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const hide = useSelector(state => state.home.isHideSwiper)
    const swiperRef = useRef(null)
    const onSwiped = () => {
        setIndex((index + 1) % data.length)
    }
    const [modalOpen, setModalOpen] = useState(false)
    const [modalActive, setModalActive] = useState(false)
    const [modalMix, setModalMix] = useState(false)
    const [modalNext, setModalNext] = useState(false)
    const [modalNoPet, setModalNoPet] = useState(false)
    const [modalNoPetActive, setModalNoPetActive] = useState(false)
    const [nextGeneration, setNextGeneration] = useState('')

    const bs = useRef(null)

    const fetchData = () => {
        console.log('Fetch Data----------------')
        if (pet_active.id) {
            Axios.get(`${URL_BASE}pets/others?breed=${pet_active.breed}&gender=${pet_active.gender}&pet_active=${pet_active.id}`, {
                headers: {
                    Authorization: token
                },
            }).then(res => {
                setData(res.data)
                if (res.data.length == 0) {
                    fetchDataAll()
                }
                setIndex(0)
                setLoading(false)
            }).catch(e => {
                console.log("Api call error! 000", e)
            })
        } else {
            fetchDataAll()
        }
    }

    const fetchDataAll = () => {
        Axios.get(`${URL_BASE}pets/allOthers`, {
            headers: {
                Authorization: token
            },
        }).then(res => {
            setData(res.data)
            setIndex(0)
            setLoading(false)
        }).catch(e => {
            console.log("Api call error!", e)
        })
    }

    useEffect(() => {
        fetchData()
        return () => {
            setData([])
        }
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
            setModalActive(true)
            bs.current.snapTo(1)
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
                horizontal={true}
                data={my_pets}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => {
                    return renderList(item)
                }}
            />
        </View>
    )

    const makeBaby = () => {
        if (vip == 0) {
            setModalOpen(true)
        } else {
            if (pet_active.id) {
                dispatch(startLoading())
                Axios.get(`${URL_BASE}pets/nextGeneration?breed=${pet_active.breed}`, { headers: { Authorization: token } })
                    .then(res => {
                        console.log('NEXT GENERATION', res.data)
                        if (!_.isEmpty(res.data.img)) {
                            setNextGeneration(res.data.img)
                        }
                        setModalMix(true)
                        dispatch(stopLoading())
                    })
                    .catch(error => {
                        dispatch(stopLoading())
                        console.log('ERROR makeBaby()', error)
                    })
            } else {
                setModalActive(true)
            }
        }
    }

    const Card = (({ item }) => {
        let images = _.concat(item.avatar, item.pictures)
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
                            backgroundColor: color.LIGHT_PINK,
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
                                        name="dislike1"
                                        size={32}
                                        color={color.RED}
                                        onPress={() => {
                                            swiperRef.current.swipeLeft()
                                        }}
                                    />
                                </TouchableOpacity>
                                {
                                    _.isEmpty(my_pets)
                                        ? <TouchableOpacity style={styles.iconContainer}>
                                            <AntDesign
                                                name="heart"
                                                size={32}
                                                color={color.GREEN}
                                                onPress={() => setModalNoPet(true)}
                                            />
                                        </TouchableOpacity>
                                        : _.isEmpty(pet_active) ?
                                            <TouchableOpacity style={styles.iconContainer}>
                                                <AntDesign
                                                    name="heart"
                                                    size={32}
                                                    color={color.GREEN}
                                                    onPress={() => { setModalNoPetActive(true); bs.current.snapTo(0) }}
                                                />
                                            </TouchableOpacity> :
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
                                }
                                <TouchableOpacity style={styles.iconContainer}>
                                    <AntDesign
                                        name="like1"
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
                        <Text style={styles.textPre}>Upgrade To Premium</Text>
                        <TouchableOpacity style={styles.btnReturnAds}>
                            <MaterialCommunityIcons
                                name="reload"
                                size={30}
                                color={color.ORANGE}
                            />
                        </TouchableOpacity>
                        <Text style={styles.textPre2}>You can return as many times as you want</Text>
                        <View style={styles.price}>
                            <Text style={styles.textPrice}>29k / month</Text>
                            <Text style={styles.textPrice}>69k / 3 months</Text>
                            <Text style={styles.textPrice}>240k / year</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                setModalOpen(false)
                                navigation.navigate('PremiumStackScreen', { screen: 'Premium' })
                            }}
                        >
                            <LinearGradient colors={['#ffe4e4', '#ffa5b0', '#fe91ca']} style={styles.commandButton}>
                                <Text style={styles.panelButtonTitle}>Upgrade To Premium</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <Text style={styles.textPre4} onPress={() => setModalOpen(false)}>Not now, thanks</Text>
                    </LinearGradient>
                </View>
            </Modal>
            {/* Modal next generation */}
            <Modal visible={modalNext} animationType='fade' transparent={true}>
                <View style={styles.modalContent}>
                    <LinearGradient colors={[color.RED, color.WHITE, color.WHITE]} style={styles.modal}>
                        <Text style={styles.textPre}>Upgrade To Premium</Text>
                        <TouchableOpacity style={styles.btnReturnAds}>
                            <MaterialCommunityIcons
                                name="child-friendly"
                                size={30}
                                color={color.RED}
                            />
                        </TouchableOpacity>
                        <Text style={styles.textPre2}>You can be predicting children of {pet_active.name} và {_.isEmpty(data) ? null : data[index].name}</Text>
                        <View style={styles.price}>
                            <Text style={styles.textPrice}>29k / month</Text>
                            <Text style={styles.textPrice}>69k / 3 months</Text>
                            <Text style={styles.textPrice}>240k / year</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                setModalOpen(false)
                                navigation.navigate('PremiumStackScreen', { screen: 'Premium' })
                            }}
                        >
                            <LinearGradient colors={['#ffe4e4', '#ffa5b0', '#fe91ca']} style={styles.commandButton}>
                                <Text style={styles.panelButtonTitle}>Upgrade To Premium</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <Text style={styles.textPre4} onPress={() => setModalNext(false)}>Not now, thanks</Text>
                    </LinearGradient>
                </View>
            </Modal>
            {/* Modal pet active */}
            <Modal visible={modalActive} animationType='fade' transparent={true}>
                <View style={styles.modalContent}>
                    <View style={styles.modalView}>
                        <View style={styles.animation}>
                            <LottieView source={require('../../utility/constants/success.json')} autoPlay loop />
                        </View>
                        <Text style={styles.textSuccess}>You have successfully activated your pet</Text>
                        <View style={styles.ok}>
                            <Text style={styles.okStyle} onPress={() => setModalActive(false)}>OK</Text>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Modal next generation */}
            <Modal visible={modalMix} animationType='fade' transparent={true}>
                <View style={styles.modalContent}>
                    <View style={styles.modalViewMix}>
                        <View style={styles.nextWrapper}>
                            <Image source={{ uri: pet_active.avatar }} style={styles.petActiveImg} />
                            <View style={styles.animationMix}>
                                <LottieView source={require('../../utility/constants/mix.json')} autoPlay loop />
                            </View>
                            {
                                _.isEmpty(data)
                                    ? null
                                    : <Image source={{ uri: data[index].avatar }} style={styles.petActiveImg} />
                            }
                        </View>
                        <View style={styles.animation}>
                            <LottieView source={require('../../utility/constants/result.json')} autoPlay />
                        </View>
                        <Image source={_.isEmpty(nextGeneration) ? require('../../../images/no-image.jpg') : { uri: nextGeneration }} style={styles.petResult} />
                        <Text style={styles.textSuccess}>This will probably be the child of {pet_active.name} and {_.isEmpty(data) ? null : data[index].name}</Text>
                        <View style={[styles.ok, { marginTop: 10 }]}>
                            <Text style={styles.okStyle} onPress={() => setModalMix(false)}>OK</Text>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Modal for no pet */}
            <Modal visible={modalNoPet} animationType='fade' transparent={true}>
                <View style={styles.modalContent}>
                    <View style={[styles.modalViewMix, { marginTop: '32%', paddingTop: 0 }]}>
                        <View style={styles.aniWrap}>
                            <View style={styles.animationPet}>
                                <LottieView source={require('../../utility/constants/dog.json')} autoPlay />
                            </View>
                            <View style={styles.animationPet}>
                                <LottieView source={require('../../utility/constants/cat.json')} autoPlay />
                            </View>
                        </View>
                        <Text style={styles.textPre2}>You cannot match pets</Text>
                        <Text style={styles.textPre3}>Its looks you don't have any pets</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setModalNoPet(false)
                                navigation.navigate('Profile')
                            }}
                        >
                            <LinearGradient colors={['#ffe4e4', '#ffa5b0', '#fe91ca']} style={styles.commandButton}>
                                <Text style={styles.panelButtonTitle}>Add a new pet</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <Text style={styles.textPre4} onPress={() => setModalNoPet(false)}>Not now, thanks</Text>
                    </View>
                </View>
            </Modal>
            {/* Modal for no pet active */}
            <Modal visible={modalNoPetActive} animationType='fade' transparent={true}>
                <View style={styles.modalContent}>
                    <View style={[styles.modalViewMix, { marginTop: '40%' }]}>
                        <TouchableOpacity style={styles.btnClose} onPress={() => setModalNoPetActive(false)}>
                            <AntDesign name="closecircle" size={26} color={color.PINK} />
                        </TouchableOpacity>
                        <Text style={styles.txtPet}>No Pet Active</Text>
                        <Text style={[styles.textPre3, { fontSize: 16 }]}>Please choose 1 pet as your active pet to Match another pet</Text>
                        <View style={styles.animation}>
                            <LottieView source={require('../../utility/constants/down-arrow.json')} autoPlay loop />
                        </View>
                    </View>
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
                            snapPoints={['18%', 0]}
                            renderContent={renderInner}
                            renderHeader={renderHeader}
                            initialSnap={1}
                            enabledGestureInteraction={true}
                        />
                        {/* Content */}
                        {
                            loading ? <Loading /> : (_.isEmpty(data)
                                ? <View style={styles.emptyPets}>
                                    <Text style={styles.textEmpty}>There is no new pet compatible around {pet_active.name}</Text>
                                    <Text style={styles.textEmpty2}>Please choose a different breed to continue swiping</Text>
                                    <View style={styles.animation}>
                                        <LottieView source={require('../../utility/constants/down-arrow.json')} />
                                    </View>
                                </View>
                                : <View style={styles.swiperContainer}>
                                    <Swiper
                                        cards={data}
                                        cardIndex={0}
                                        renderCard={(item) => {
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
                            {
                                vip === 1
                                    ? <TouchableOpacity style={styles.btnReturn}>
                                        <MaterialIcons
                                            name="child-friendly"
                                            size={24}
                                            color={color.RED}
                                            onPress={makeBaby}
                                        />
                                    </TouchableOpacity>
                                    : <TouchableOpacity style={[styles.btnReturn, { backgroundColor: color.LIGHT_LIGHT_GRAY }]}>
                                        <MaterialIcons
                                            name="child-friendly"
                                            size={24}
                                            color={color.RED}
                                            onPress={() => setModalNext(true)}
                                        />
                                    </TouchableOpacity>
                            }
                            <TouchableOpacity style={styles.activePet} onPress={() => bs.current.snapTo(0)}>
                                <Ionicons name="ios-add-circle" size={30} color={color.PINK} />
                            </TouchableOpacity>
                            {
                                vip === 1
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
        top: 12,
        right: 14,
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
        flex: 0.9,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.LIGHT_GRAY,
        marginTop: '20%',
        marginBottom: 20,
        marginHorizontal: 20,
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
        alignItems: 'center',
        marginTop: 15,
        width: Dimensions.get('window').width - 150
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
        marginTop: '25%',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        borderRadius: 8,
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
    },
    // Modal pet active
    modalView: {
        backgroundColor: color.WHITE,
        marginHorizontal: 40,
        marginTop: '48%',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
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
    // Modal for next generation
    modalViewMix: {
        backgroundColor: color.WHITE,
        marginHorizontal: 30,
        marginTop: '20%',
        padding: 20,
        borderRadius: 8,
        alignItems: 'center'
    },
    nextWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        alignItems: 'center'
    },
    petActiveImg: {
        width: 65,
        height: 65,
        borderRadius: 10
    },
    petResult: {
        width: 150,
        height: 200,
        borderRadius: 12
    },
    animationMix: {
        width: 60,
        height: 60
    },
    // Empty pets
    emptyPets: {
        flex: 0.9,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.LIGHT_GRAY,
        marginTop: '20%',
        marginBottom: 20,
        marginHorizontal: 20,
        borderRadius: 8,
        elevation: 4
    },
    textEmpty: {
        fontSize: 16,
        paddingVertical: 12,
        color: color.DARK_GRAY,
        marginTop: 40
    },
    textEmpty2: {
        paddingVertical: 12,
        color: color.WHITE
    },
    aniWrap: {
        flexDirection: 'row'
    },
    animationPet: {
        width: 150,
        height: 150
    },
    btnClose: {
        alignSelf: 'flex-end'
    },
    txtPet: {
        fontSize: 22,
        fontWeight: 'bold',
        paddingBottom: 20,
        color: color.RED
    }
});

YellowBox.ignoreWarnings(['Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
    'Animated.event now requires a second argument for options']);

export default Home;