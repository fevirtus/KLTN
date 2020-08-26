import React, { useState, useEffect } from 'react'
import {
    StyleSheet, View,
    Text, Image,
    FlatList, TouchableOpacity,
    ScrollView,
    ImageBackground
} from 'react-native'
import axios from 'axios'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useDispatch, useSelector } from 'react-redux';
import { color } from '../../../utility'
import { URL_BASE, token } from '../../../api/config';
import { startLoading, stopLoading } from '../../../redux/actions/loadingAction';
import { Container, Loading } from '../../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'lodash'

const ProfileUserChat = ({ navigation, route }) => {
    const { guest } = route.params;
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const pet_active = useSelector(state => state.auth.pet_active)
    const [user, setUser] = useState({
        name: '',
        avatar: '',
        vip: '',
        email: '',
        gender: null,
        birth_date: null,
        phone: '',
    })
    const [pets, setPets] = useState([])

    const getUser = () => {
        dispatch(startLoading())
        console.log(`${URL_BASE}users/${guest}`)
        axios.get(`${URL_BASE}users/${guest}`, {
            headers: {
                Authorization: token
            }
        }).then(res => {
            // Set info
            setUser(res.data[0])
            dispatch(stopLoading())
            setLoading(false)
        }).catch(e => {
            console.log("ERROR getUser()", e)
            dispatch(stopLoading())
        })
    }

    const getPet = () => {
        console.log(`${URL_BASE}pets/petMatch?user2=${guest}&pet_active=${pet_active.id}`)
        axios.get(`${URL_BASE}pets/petMatch?user2=${guest}&pet_active=${pet_active.id}`, {
            headers: {
                Authorization: token
            }
        }).then(res => {
            // Set info
            setPets(res.data)
        }).catch(e => {
            console.log("ERROR getPet()", e)
        })
    }

    useEffect(() => {
        getUser()
    }, [guest])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getPet()
        });
        return unsubscribe;
    }, [guest, pet_active])

    const renderList = ((item) => {
        return (
            <View style={styles.petImageWrapper}>
                <TouchableOpacity onPress={() => navigation.navigate('ProfilePetChat', { petID: item.id })}>
                    <Image
                        source={item.avatar ? { uri: item.avatar } : require('../../../../images/no-image.jpg')}
                        style={styles.petImage}
                    />
                </TouchableOpacity>
            </View>
        )
    })

    return (
        <Container>
            {
                loading ? <Loading />
                    : <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.header}>
                            <ImageBackground
                                style={styles.img_background}
                                source={user.avatar ? { uri: user.avatar } : require('../../../../images/no-image.jpg')}
                            />
                            <View style={styles.profilePicWrap}>
                                <Image
                                    source={user.avatar ? { uri: user.avatar } : require('../../../../images/no-image.jpg')}
                                    style={styles.imageUser}
                                />
                                {
                                    user.vip === 1
                                        ? <TouchableOpacity style={styles.diamond}>
                                            <FontAwesome name="diamond" size={18} color={color.WHITE} />
                                        </TouchableOpacity> : null
                                }
                            </View>
                        </View>
                        <View style={styles.userName}>
                            <Text style={styles.name}>{user.name}</Text>
                            {user.gender == null ? null :
                                (user.gender == 1 ? <Ionicons name={'md-male-sharp'} size={20} color={color.PINK} />
                                    : <Ionicons name={'md-female-sharp'} size={20} color={color.PINK} />)
                            }
                        </View>
                        {!_.isEmpty(user.birth_date) &&
                            <View style={styles.birth}>
                                <FontAwesome name="birthday-cake" size={18} color={color.GRAY} />
                                <Text style={styles.txtBd}>{user.birth_date}</Text>
                            </View>
                        }
                        <View style={styles.numberPet}>
                            <Text style={styles.text}>{pets.length} match with {pet_active.name}</Text>
                        </View>
                        <View style={styles.pet}>
                            <FlatList
                                numColumns={2}
                                data={pets}
                                renderItem={({ item }) => {
                                    return renderList(item)
                                }}
                                keyExtractor={(_, index) => index.toString()}
                            />
                        </View>
                    </ScrollView>
            }
        </Container>
    )
}

const styles = StyleSheet.create({
    profilePicWrap: {
        width: 100,
        height: 100,
        borderRadius: 100,
        alignSelf: 'center',
        marginVertical: 20,
        position: 'absolute',
        bottom: 0
    },
    imageUser: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: color.WHITE
    },
    diamond: {
        width: 28,
        height: 28,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 74,
        left: 70,
        backgroundColor: color.YELLOW,
        borderWidth: 2,
        borderColor: color.WHITE
    },
    name: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        color: color.BLACK
    },
    numberPet: {
        backgroundColor: '#3282b8',
        alignSelf: 'center',
        padding: 8,
        marginTop: 15,
        borderRadius: 5
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: color.WHITE
    },
    pet: {
        paddingHorizontal: 25,
        paddingTop: 20
    },
    petImageWrapper: {
        padding: 10
    },
    petImage: {
        height: 160,
        width: 160,
        borderRadius: 25,
    },
    img_background: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 250
    },
    header: {
        height: 300
    },
    userName: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    email: {
        textAlign: 'center',
        fontSize: 15,
        color: color.GRAY
    },
    birth: {
        flexDirection: 'row',
        alignSelf: 'center',
        width: '24%',
        justifyContent: 'space-between',
        paddingVertical: 5
    },
    txtBd: {
        color: color.GRAY,
        fontSize: 15
    }
})

export default ProfileUserChat