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
import { useSelector, useDispatch } from 'react-redux';
import Axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage';
import { URL_BASE, token } from '../../api/config'
import { savePets, saveActivePet } from '../../redux/actions/authActions';

const Home = ({ navigation }) => {

    const dispatch = useDispatch();

    const loadPets = async () => {
        console.log('get pets.........')
        Axios.get(`${URL_BASE}pets`, {
            headers: {
                Authorization: token
            }
        }).then(res => {
            console.log('pets: ', res.data)
            dispatch(savePets(res.data));
            const activePet = res.data.filter(pet => pet.is_active == 1);
            if (activePet.length == 1) {
                dispatch(saveActivePet(activePet[0]))
            }
        }).catch(e => {
            console.log("Api call error!", e)
        })
    }

    useEffect(() => {
        loadPets()
    }, [])

    return (
        <View><Text>Hello</Text></View>
    )














    // const [pets, setPets] = useState([])
    // const [myPet, setMyPet] = useState([])
    // const [petActived, setPetActived] = useState(false)
    // const [index, setIndex] = useState(0)
    // const [match, setMatch] = useState(null)
    // const [loading, setLoading] = useState(true)
    // const hide = useSelector(state => state.home.isHideSwiper)
    // const swiperRef = useRef(null)
    // const onSwiped = () => {
    //     setIndex((index + 1) % pets.length)
    // }

    // const fetchData = async () => {
    //     const token = await AsyncStorage.getItem("token")
    //     axios.get(`${URL_BASE}pets/others`, {
    //         headers: {
    //             Authorization: token
    //         }
    //     }).then(res => {
    //         setPets(res.data)
    //         setLoading(false)
    //     }).catch(e => {
    //         console.log("Api call error!", e)
    //     })
    // }

    // const dataPets = async () => {
    //     const token = await AsyncStorage.getItem("token")
    //     axios.get(`${URL_BASE}pets`, {
    //         headers: {
    //             Authorization: token
    //         }
    //     }).then(res => {
    //         setMyPet(res.data)
    //         setLoading(false)
    //     }).catch(e => {
    //         console.log("Api call error!", e)
    //     })
    // }

    // useEffect(() => {
    //     fetchData()
    //     dataPets()
    // }, [])

    // const like = async (id) => {
    //     swiperRef.current.swipeRight()
    //     const pet_react = {
    //         pet_id: id,
    //         reaction: "like"
    //     }
    //     const token = await AsyncStorage.getItem("token")
    //     axios.post(`${URL_BASE}common/react${id}`, pet_react, {
    //         headers: {
    //             Authorization: token
    //         }
    //     }).then(res => {
    //         console.log(res.data)
    //     }).catch(e => {
    //         console.log("Api call error!", e)
    //     })
    // }

    // const matches = async (id1, id2, user2) => {
    //     swiperRef.current.swipeTop()
    //     const pet_match = {
    //         pet_id1: id1,
    //         pet_id2: id2,
    //         user2: user2
    //     }
    //     const token = await AsyncStorage.getItem("token")
    //     axios.post(`${URL_BASE}common/match${id1}`, pet_match, {
    //         headers: {
    //             Authorization: token
    //         }
    //     }).then(res => {
    //         console.log(res.data)
    //     }).catch(e => {
    //         console.log("Api call error!", e)
    //     })
    // }

    // const Card = ((item) => {
    //     return (
    //         <View style={styles.card}>
    //             <View style={styles.cardDetails}>
    //                 <Image source={{ uri: item.avatar }} style={styles.cardImage} />
    //                 <Text style={styles.title}>{item.name}</Text>
    //                 <Text style={styles.description}>{item.introduction}</Text>
    //                 <View style={styles.bottomButtonsContainer}>
    //                     <TouchableOpacity style={styles.iconContainer}>
    //                         <AntDesign
    //                             name="close"
    //                             size={35}
    //                             color={color.RED}
    //                             onPress={() => swiperRef.current.swipeLeft()}
    //                         />
    //                     </TouchableOpacity>
    //                     <TouchableOpacity style={styles.iconContainer}>
    //                         <AntDesign
    //                             name="star"
    //                             size={34}
    //                             color={color.BLUE}
    //                             onPress={() => matches(id1, id2,)}
    //                         />
    //                     </TouchableOpacity>
    //                     <TouchableOpacity style={styles.iconContainer}>
    //                         <AntDesign
    //                             name="heart"
    //                             size={32}
    //                             color={color.GREEN}
    //                             onPress={() => like(item.id)}
    //                         />
    //                     </TouchableOpacity>
    //                 </View>
    //             </View>
    //         </View>
    //     )
    // })

    // const petActive = async (petId) => {
    //     const edit_petId = {
    //         pet_id: petId
    //     }
    //     console.log(edit_petId)
    //     const token = await AsyncStorage.getItem("token")
    //     axios.put(`${URL_BASE}pets/setActive`, edit_petId, {
    //         headers: {
    //             Authorization: token
    //         }
    //     }).then(res => {
    //         console.log(res.data)
    //         alert('Set active successful')
    //     }).catch((e) => {
    //         console.log("Api call error")
    //         alert(e.message)
    //     })
    // }

    // const renderList = ((item) => {
    //     console.log(item)
    //     return (
    //         <View style={styles.petImageWrapper}>
    //             <TouchableOpacity onPress={() => petActive(item.id)}>
    //                 <Image
    //                     source={item.avatar ? { uri: item.avatar } : require('../../../images/no-image.jpg')}
    //                     style={[styles.petImage,
    //                     item.is_active === 0
    //                         ? { borderColor: color.RED }
    //                         : { borderColor: color.GREEN }
    //                     ]}
    //                 />
    //             </TouchableOpacity>
    //         </View>
    //     )
    // })

    // return (
    //     <View style={styles.container}>
    //         {hide ?
    //             (<Container>
    //                 <View style={styles.container}>
    //                     <View style={styles.hideMode}>
    //                         <FontAwesome5 name="umbrella-beach" size={150} color={color.GRAY} />
    //                         <Text style={styles.textHide}>Nothing to see here!</Text>
    //                     </View>
    //                 </View>
    //             </Container>) :
    //             (<Container>
    //                 <View style={styles.container}>
    //                     <View style={styles.swiperContainer}>
    //                         {
    //                             loading ? <Loading />
    //                                 : <Swiper
    //                                     cards={pets}
    //                                     cardIndex={index}
    //                                     renderCard={(item) => { return Card(item) }}
    //                                     ref={swiperRef}
    //                                     onSwiped={onSwiped}
    //                                     stackSize={2}
    //                                     disableBottomSwipe
    //                                     infinite
    //                                     backgroundColor={'transparent'}
    //                                     overlayLabels={{
    //                                         left: {
    //                                             title: 'NOPE',
    //                                             style: {
    //                                                 label: {
    //                                                     backgroundColor: 'transparent',
    //                                                     color: color.RED,
    //                                                     fontSize: 24,
    //                                                     borderColor: color.RED,
    //                                                     borderWidth: 3
    //                                                 },
    //                                                 wrapper: {
    //                                                     flexDirection: 'column',
    //                                                     alignItems: 'flex-end',
    //                                                     justifyContent: 'flex-start',
    //                                                     marginTop: -35,
    //                                                     marginLeft: -20,
    //                                                 }
    //                                             }
    //                                         },
    //                                         right: {
    //                                             title: 'LIKE',
    //                                             style: {
    //                                                 label: {
    //                                                     backgroundColor: 'transparent',
    //                                                     color: color.GREEN,
    //                                                     fontSize: 24,
    //                                                     borderColor: color.GREEN,
    //                                                     borderWidth: 3
    //                                                 },
    //                                                 wrapper: {
    //                                                     flexDirection: 'column',
    //                                                     alignItems: 'flex-start',
    //                                                     justifyContent: 'flex-start',
    //                                                     marginTop: -35,
    //                                                     marginLeft: 20
    //                                                 }
    //                                             }
    //                                         },
    //                                         top: {
    //                                             title: 'SUPER LIKE',
    //                                             style: {
    //                                                 label: {
    //                                                     backgroundColor: 'transparent',
    //                                                     color: color.BLUE,
    //                                                     fontSize: 24,
    //                                                     borderColor: color.BLUE,
    //                                                     borderWidth: 3
    //                                                 },
    //                                                 wrapper: {
    //                                                     flexDirection: 'column',
    //                                                     alignItems: 'center',
    //                                                     justifyContent: 'center',
    //                                                     marginTop: -60
    //                                                 }
    //                                             }
    //                                         }
    //                                     }}
    //                                 />
    //                         }
    //                     </View>
    //                     <View>
    //                         {
    //                             loading ? <Loading />
    //                                 :
    //                                 <FlatList
    //                                     horizontal={true}
    //                                     data={myPet}
    //                                     renderItem={({ item }) => {
    //                                         return renderList(item)
    //                                     }}
    //                                     keyExtractor={(item, index) => index.toString()}
    //                                     refreshing={loading}
    //                                 />
    //                         }
    //                     </View>
    //                 </View>
    //             </Container>)
    //         }
    //     </View>
    // )
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