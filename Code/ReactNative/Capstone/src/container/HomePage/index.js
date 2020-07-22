import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    YellowBox
} from 'react-native'
import Swiper from 'react-native-deck-swiper'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { Container, Loading } from '../../components'
import { color } from '../../utility';
import { useSelector } from 'react-redux';
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage';

const Home = ({ navigation }) => {
    const [pets, setPets] = useState([])
    const [myPet, setMyPet] = useState([])
    const [petActived, setPetActived] = useState('')
    const [index, setIndex] = useState(0)
    const hide = useSelector(state => state.home.isHideSwiper)
    const swiperRef = useRef(null)
    const [loading, setLoading] = useState(true)
    const onSwiped = () => {
        setIndex((index + 1) % pets.length)
    }

    const fetchData = async () => {
        const token = await AsyncStorage.getItem("token")
        axios.get('https://pet-dating-server.herokuapp.com/api/pets/others', {
            headers: {
                Authorization: token
            }
        }).then(res => {
            // Set data for pet
            setPets(res.data)
            setLoading(false)
        }).catch(e => {
            console.log("Api call error!", e)
        })
    }

    const dataPets = async () => {
        const token = await AsyncStorage.getItem("token")
        axios.get('https://pet-dating-server.herokuapp.com/api/pets', {
            headers: {
                Authorization: token
            }
        }).then(res => {
            console.log('My pet', res.data)
            setMyPet(res.data)
            setLoading(false)
        }).catch(e => {
            console.log("Api call error!", e)
        })
    }

    useEffect(() => {
        fetchData()
        dataPets()
    }, [])

    const Card = ((item) => {
        return (
            <View style={styles.card}>
                <View style={styles.cardDetails}>
                    <Image source={{ uri: item.avatar }} style={styles.cardImage} />
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.description}>{item.introduction}</Text>
                    <View style={styles.bottomButtonsContainer}>
                        <TouchableOpacity style={styles.iconContainer}>
                            <AntDesign
                                name="close"
                                size={35}
                                color={color.RED}
                                onPress={() => swiperRef.current.swipeLeft()}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconContainer}>
                            <AntDesign
                                name="star"
                                size={34}
                                color={color.BLUE}
                                onPress={() => swiperRef.current.swipeTop()}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconContainer}>
                            <AntDesign
                                name="heart"
                                size={32}
                                color={color.GREEN}
                                onPress={() => swiperRef.current.swipeRight()}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    })

    const renderList = ((item) => {
        return (
            <View style={styles.petImageWrapper}>
                <TouchableOpacity onPress={() => { }}>
                    {/* <Image source={{ uri: item.avatar }} style={styles.petImage} /> */}
                    <Text>{item.name}</Text>
                </TouchableOpacity>
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
                                        cards={pets}
                                        cardIndex={index}
                                        renderCard={(item) => { return Card(item) }}
                                        ref={swiperRef}
                                        onSwiped={onSwiped}
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
                                                title: 'SUPER LIKE',
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
                        {
                            loading ? <Loading />
                                :
                                <FlatList
                                    style={styles.flatList}
                                    horizontal={true}
                                    data={myPet}
                                    renderItem={({ item }) => {
                                        return renderList(item)
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                    refreshing={loading}
                                />
                        }
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
        width: 372,
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
        justifyContent: 'space-between'
    },
    iconContainer: {
        borderRadius: 50,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
        width: 54,
        height: 54
    },
    flatList: {
        // alignItems: 'flex-end'
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