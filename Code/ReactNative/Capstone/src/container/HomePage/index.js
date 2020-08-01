import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
    Image, StyleSheet,
    Text,
    TouchableOpacity, View,
    YellowBox
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import { token, URL_BASE } from '../../api/config';
import { Container, Loading } from '../../components';
import { saveActivePet, savePets } from '../../redux/actions/authActions';
import { color } from '../../utility';

const Home = ({ navigation }) => {
    const dispatch = useDispatch();
    const pet_active = useSelector(state => state.auth.pet_active)

    const [data, setData] = useState([])
    const [index, setIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const hide = useSelector(state => state.home.isHideSwiper)
    const swiperRef = useRef(null)
    const onSwiped = () => {
        setIndex((index + 1) % data.length)
    }

    const fetchData = () => {
        console.log('Fetch Data----------------')
        Axios.get(`${URL_BASE}pets/others`, {
            headers: {
                Authorization: token
            }
        }).then(res => {
            setData(res.data)
            setLoading(false)
        }).catch(e => {
            console.log("Api call error!", e)
        })
    }


    useEffect(() => {
        fetchData()
    }, [])


    const petActive = async (petId) => {
        const edit_petId = {
            pet_id: petId
        }
        console.log(edit_petId)
        const token = await AsyncStorage.getItem("token")
        axios.put(`${URL_BASE}pets/setActive`, edit_petId, {
            headers: {
                Authorization: token
            }
        }).then(res => {
            console.log(res.data)
            alert('Set active successful')
        }).catch((e) => {
            console.log("Api call error")
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
        let body = {
            pet_id1: pet_active.id,
            pet_id2: pet.id,
            user2: pet.user_id
        }
        Axios.post(`${URL_BASE}common/match`, body, { headers: { Authorization: token } })
            .then(res => {
                console.log(res.data)
            })
            .catch(e => console.error(e))
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
        console.log(item)
        return (
            <View style={styles.petImageWrapper}>
                <TouchableOpacity onPress={() => petActive(item.id)}>
                    <Image
                        source={item.avatar ? { uri: item.avatar } : require('../../../images/no-image.jpg')}
                        style={[styles.petImage,
                        item.is_active === 0
                            ? { borderColor: color.RED }
                            : { borderColor: color.GREEN }
                        ]}
                    />
                </TouchableOpacity>
            </View>
        )
    })

    const Card = (({ item }) => {
        return (
            <View style={styles.card}>
                <View style={styles.cardDetails}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', height: '90%' }}>
                        <Image source={{ uri: item.avatar }} style={styles.cardImage} />
                        <Text style={styles.title}>{item.name}</Text>
                    </View>
                    {/* <Text style={styles.description}>{item.introduction}</Text> */}
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
                </View>
            </View>
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
                        <View style={styles.swiperContainer}>
                            {
                                loading ? <Loading />
                                    : <Swiper
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
                                                        marginTop: -35,
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
                                                        marginTop: -35,
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
                            }
                        </View>
                        <View>
                            {/* {
                                loading ? <Loading />
                                    :
                                    <FlatList
                                        horizontal={true}
                                        data={pets}
                                        renderItem={({ item }) => {
                                            return renderList(item)
                                        }}
                                        keyExtractor={(item, index) => index.toString()}
                                        refreshing={loading}
                                    />
                            } */}
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
    card: {
        borderRadius: 5,
        flex: 0.8,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.WHITE
    },
    cardImage: {
        width: 273,
        flex: 1,
        resizeMode: 'cover'
    },
    swiperContainer: {
        flex: 1
    },
    cardDetails: {
        alignItems: 'center'
    },
    title: {
        fontSize: 26,
        color: color.BLACK
    },
    description: {
        color: color.GRAY,
        fontSize: 22
    },
    bottomButtonsContainer: {
        flex: 0.2,
        flexDirection: 'row',
        width: 400,
        justifyContent: 'space-around'
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
    }
});

YellowBox.ignoreWarnings(['Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
    'Animated.event now requires a second argument for options']);

export default Home;