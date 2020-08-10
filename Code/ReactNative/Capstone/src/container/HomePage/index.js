import React, { useEffect, useRef, useState } from 'react';
import {
    Image, StyleSheet,
    Text, ScrollView,
    TouchableOpacity, View,
    YellowBox, FlatList,
    Alert, ImageBackground
} from 'react-native';
import Axios from 'axios';
import Swiper from 'react-native-deck-swiper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import BottomSheet from 'reanimated-bottom-sheet'
import { useSelector, useDispatch } from 'react-redux';
import { token, URL_BASE } from '../../api/config';
import { Container, Loading } from '../../components';
import { color } from '../../utility';
import { uuid } from '../../utility/constants';
import { saveMatch } from '../../network';
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

    const bs = useRef(null)

    const fetchData = () => {
        console.log('Fetch Data----------------')
        if (pet_active.id) {
            Axios.get(`${URL_BASE}pets/others?breed=${pet_active.breed}&gender=${pet_active.gender}&pet_active=${pet_active.id}`, {
                headers: {
                    Authorization: token
                },
            }).then(res => {
                console.log(res.data)
                setData(res.data)
                setLoading(false)
            }).catch(e => {
                console.log("Api call error!", e)
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
            console.log(res.data)
            setData(res.data)
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
            alert('Set active successful')
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
        <View style={styles.header}>
            <View style={styles.panelHeader}>
                <View style={styles.panelHandle}></View>
            </View>
        </View>
    )

    const renderInner = () => (
        <View style={styles.panel}>
            <FlatList
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
        return (
            <ImageBackground
                style={styles.card}
                source={{ uri: item.avatar }}
                imageStyle={{ borderRadius: 8 }}
            >
                <TouchableOpacity style={styles.infoBtn}>
                    <SimpleLineIcons
                        name="info"
                        size={33}
                        color={color.WHITE}
                        onPress={() => { }}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>{item.name}</Text>
                <View style={styles.bottomButtonsContainer}>
                    <TouchableOpacity style={styles.iconContainer}>
                        <AntDesign
                            name="close"
                            size={35}
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
                            size={34}
                            color={color.BLUE}
                            onPress={() => {
                                swiperRef.current.swipeRight()
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        )
    })

    return (
        <View style={styles.container}>
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
                        <BottomSheet
                            ref={bs}
                            snapPoints={['17%', 0]}
                            renderContent={renderInner}
                            renderHeader={renderHeader}
                            initialSnap={1}
                            enabledGestureInteraction={true}
                        />
                        {
                            loading ? <Loading /> : (_.isEmpty(data) ? null
                                : <View style={styles.swiperContainer}>
                                    <Swiper
                                        cards={data}
                                        cardIndex={index}
                                        renderCard={(item) => <Card item={item} />}
                                        ref={swiperRef}
                                        onSwiped={onSwiped}
                                        onSwipedLeft={onSwipedLeft}
                                        onSwipedRight={onSwipedRight}
                                        onSwipedTop={onSwipedTop}
                                        stackSize={2}
                                        disableBottomSwipe
                                        infinite
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
                                                        color: color.GREEN,
                                                        fontSize: 24,
                                                        borderColor: color.GREEN,
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
                                                        color: color.BLUE,
                                                        fontSize: 24,
                                                        borderColor: color.BLUE,
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
                        <View>
                            <TouchableOpacity style={styles.activePet} onPress={() => bs.current.snapTo(0)}>
                                <Ionicons name="ios-add-circle" size={30} color={color.PINK} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Container>)
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    // Swiper styles
    swiperContainer: {
        flex: 1
    },
    card: {
        flex: 0.8
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
        flexDirection: 'row',
        width: 400,
        justifyContent: 'space-around',
        flex: 1,
        alignSelf: 'center'
    },
    iconContainer: {
        borderRadius: 50,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
        width: 54,
        height: 54
    },
    petImageWrapper: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 10,
    },
    petImage: {
        height: 70,
        width: 70,
        borderRadius: 50,
        borderWidth: 3,
    },
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
    activePet: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        backgroundColor: color.WHITE,
        elevation: 4,
        paddingTop: 12,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    panelHeader: {
        alignItems: 'center'
    },
    panelHandle: {
        width: 70,
        height: 6,
        borderRadius: 4,
        backgroundColor: color.LIGHT_GRAY,
        marginBottom: 10
    },
    panel: {
        backgroundColor: color.WHITE
    }
});

YellowBox.ignoreWarnings(['Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
    'Animated.event now requires a second argument for options']);

export default Home;