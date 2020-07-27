import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    ScrollView,
    TextInput,
    Animated,
    Dimensions,
    YellowBox
} from 'react-native'
import mime from 'mime'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import { useDispatch } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import _ from 'lodash'
import { color } from '../../../utility'
import { saveUserInfo } from '../../../redux/actions/authActions';
import { Container, Loading, DismissKeyboard } from '../../../components'
import { URL_BASE } from '../../../api/config'

const { width } = Dimensions.get('window')

const Profile = ({ navigation }) => {
    const [dataPet, setDataPet] = useState([])
    const [info, setInfo] = useState({
        name: '',
        email: '',
        phone: '',
        avatar: ''
    })
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()

    // Animated state
    const [active, setActive] = useState(0)
    const [translateX, setTranslateX] = useState(new Animated.Value(0))
    const [translateXTabOne, setTranslateXTabOne] = useState(new Animated.Value(0))
    const [translateXTabTwo, setTranslateXTabTwo] = useState(new Animated.Value(width))
    const [translateY, setTranslateY] = useState(-1000)

    const dataUser = async () => {
        const token = await AsyncStorage.getItem("token")
        axios.get(`${URL_BASE}users/currentUser`, {
            headers: {
                Authorization: token
            }
        }).then(res => {
            setInfo(res.data[0])
            setLoading(false)
        }).catch(e => {
            console.log("Api call error!", e)
        })
    }

    const dataPets = async () => {
        const token = await AsyncStorage.getItem("token")
        axios.get(`${URL_BASE}pets`, {
            headers: {
                Authorization: token
            }
        }).then(res => {
            console.log(res.data)
            setDataPet(res.data)
            setLoading(false)
        }).catch(e => {
            console.log("Api call error!", e)
        })
    }

    useEffect(() => {
        dataUser()
        dataPets()
    }, [])

    const _saveData = async () => {
        const settings = {
            updateFields: {
                name: name,
                phone: phone,
                email: email,
                avatar: avatar
            }
        }
        console.log(settings)
        const token = await AsyncStorage.getItem("token")
        axios.put(`${URL_BASE}users`, settings, {
            headers: {
                Authorization: token
            }
        }).then((res) => {
            dispatch(saveUserInfo(res.data.data))
            alert('Save successful')
        }).catch((e) => {
            console.log("Api call error")
            alert(e.message)
        })
    }

    const handleChangeInfo = (type, value) => {
        setInfo({ ...info, [type]: value })
    }

    const handlePicker = () => {
        let options = {
            title: 'Select Image',
            noData: true,
            maxWidth: 500,
            maxHeight: 500,
        };
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else {
                const img = {
                    uri: response.uri,
                    type: mime.getType(response.uri),
                    name:
                        response.fileName ||
                        response.uri.substr(response.uri.lastIndexOf('/') + 1)
                }
                const data = new FormData()
                data.append('file', img)
                data.append("upload_preset", "petDating")
                data.append("cloud_name", "capstone98")
                fetch("https://api.cloudinary.com/v1_1/capstone98/image/upload", {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(res => res.json())
                    .then(data => {
                        setInfo({ avatar: data.url })
                        console.log(data)
                    }).catch(e => {
                        alert(e.message)
                    })
            }
        });
    }

    const renderList = ((item) => {
        return (
            <View style={styles.petImageWrapper}>
                <TouchableOpacity onPress={() => navigation.navigate('PetProfile', { itemId: item.id })}>
                    <Image source={item.avatar ? { uri: item.avatar } : require('../../../../images/no-image.jpg')} style={styles.petImage} />
                </TouchableOpacity>
            </View>
        )
    })

    useEffect(() => {
        handleSlide(active)
    }, [active])

    const handleSlide = type => {
        Animated.spring(translateX, {
            toValue: type,
            duration: 100
        }).start()
        if (active === 0) {
            Animated.parallel([
                Animated.spring(translateXTabOne, {
                    toValue: 0,
                    duration: 100
                }).start(),
                Animated.spring(translateXTabTwo, {
                    toValue: width,
                    duration: 100
                }).start()
            ])
        } else {
            Animated.parallel([
                Animated.spring(translateXTabOne, {
                    toValue: -width,
                    duration: 100
                }).start(),
                Animated.spring(translateXTabTwo, {
                    toValue: 0,
                    duration: 100
                }).start()
            ])
        }
    }

    const { name, email, phone, avatar } = info
    return (
        <Container>
            <DismissKeyboard>
                {
                    loading ? <Loading />
                        :
                        <View style={styles.container}>
                            <View style={styles.tabSliding}>
                                <View style={styles.tabContent}>
                                    <Animated.View
                                        style={[styles.sliding, {
                                            left: translateX.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: ['0%', '50%'],
                                                extrapolate: 'clamp'
                                            })
                                        }]}
                                    />
                                    <TouchableOpacity
                                        style={styles.tabOne}
                                        onPress={() => setActive(0)}
                                    >
                                        <Text style={{ color: active === 0 ? color.WHITE : color.BLUE }}>My Profile</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.tabTwo}
                                        onPress={() => setActive(1)}
                                    >
                                        <Text style={{ color: active === 1 ? color.WHITE : color.BLUE }}>My Pets</Text>
                                    </TouchableOpacity>
                                </View>

                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <Animated.View
                                        style={{
                                            transform: [
                                                {
                                                    translateX: translateXTabOne
                                                }
                                            ]
                                        }}
                                        onLayout={event => setTranslateY(event.nativeEvent.layout.height)}
                                    >
                                        <View style={styles.profilePicWrap}>
                                            <Image source={avatar ? { uri: avatar } : require('../../../../images/avatar.jpg')} style={styles.profileImage} />
                                            <TouchableOpacity onPress={handlePicker} style={styles.camera}>
                                                <MaterialIcons name="add-a-photo" size={22} color="#DFD8C8" />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.inputInformation}>
                                            <View style={styles.action}>
                                                <FontAwesome name="user-o" color={color.GRAY} size={22} />
                                                <TextInput
                                                    placeholder="Name"
                                                    value={name}
                                                    placeholderTextColor={color.GRAY}
                                                    onChangeText={(name) => handleChangeInfo('name', name)}
                                                    style={styles.textInput}
                                                />
                                            </View>
                                            <View style={styles.action}>
                                                <Fontisto name="email" color={color.GRAY} size={22} />
                                                <TextInput
                                                    placeholder="Email"
                                                    value={email}
                                                    editable={false}
                                                    placeholderTextColor={color.GRAY}
                                                    style={[styles.textInput, { color: 'grey' }]}
                                                />
                                            </View>
                                            <View style={styles.action}>
                                                <Feather name="phone" color={color.GRAY} size={22} />
                                                <TextInput
                                                    placeholder="Phone"
                                                    keyboardType="numeric"
                                                    value={phone}
                                                    placeholderTextColor={color.GRAY}
                                                    onChangeText={(phone) => handleChangeInfo('phone', phone)}
                                                    style={styles.textInput}
                                                />
                                            </View>
                                        </View>
                                        <TouchableOpacity style={styles.commandButton} onPress={_saveData}>
                                            <Text style={styles.panelButtonTitle}>Save</Text>
                                        </TouchableOpacity>
                                    </Animated.View>

                                    <Animated.View
                                        style={{
                                            transform: [
                                                {
                                                    translateX: translateXTabTwo
                                                },
                                                {
                                                    translateY: -translateY
                                                }
                                            ]
                                        }}
                                    >
                                        {
                                            _.isEmpty(dataPet) ?
                                                <View style={styles.listPetEmpty}>
                                                    <View style={styles.emptyView}>
                                                        <Image
                                                            source={require('../../../../images/empty-pet.png')}
                                                            style={styles.emptyImage}
                                                        />
                                                        <Text style={styles.emptyText}>Your Pet List is Empty</Text>
                                                        <Text style={styles.emptyText2}>It Looks You Don't Have Any Pets.</Text>
                                                    </View>
                                                </View> :
                                                <View style={styles.listPetWrapper}>
                                                    <FlatList
                                                        style={styles.flatList}
                                                        horizontal={true}
                                                        data={dataPet}
                                                        renderItem={({ item }) => {
                                                            return renderList(item)
                                                        }}
                                                        keyExtractor={(item, index) => index.toString()}
                                                        refreshing={loading}
                                                    />
                                                </View>
                                        }

                                        <TouchableOpacity
                                            style={styles.addButton}
                                            onPress={() => navigation.navigate('PetSetting')}
                                        >
                                            <TouchableOpacity style={styles.add}>
                                                <MaterialIcons name="add" size={20} color={color.WHITE} />
                                            </TouchableOpacity>
                                            <Text style={styles.addTitle}>Add a new pet</Text>
                                        </TouchableOpacity>
                                    </Animated.View>
                                </ScrollView>
                            </View>
                        </View>
                }
            </DismissKeyboard>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    // Tab sliding
    tabSliding: {
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    tabContent: {
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 20,
        height: 36,
        position: 'relative'
    },
    sliding: {
        position: 'absolute',
        width: '50%',
        height: '100%',
        top: 0,
        backgroundColor: color.BLUE,
        borderRadius: 4
    },
    tabOne: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: color.BLUE,
        borderRadius: 4,
        borderRightWidth: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
    },
    tabTwo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: color.BLUE,
        borderRadius: 4,
        borderLeftWidth: 0,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
    },
    // CContent
    profilePicWrap: {
        width: 130,
        height: 130,
        borderRadius: 100,
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 25
    },
    profileImage: {
        width: 130,
        height: 130,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: color.WHITE
    },
    camera: {
        width: 34,
        height: 34,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 98,
        left: 90,
        backgroundColor: '#41444B',
        borderWidth: 2,
        borderColor: color.WHITE
    },
    action: {
        flexDirection: 'row',
        marginTop: 18,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingLeft: 20,
        borderBottomEndRadius: 20,
        borderBottomStartRadius: 20,
    },
    textInput: {
        flex: 1,
        marginTop: -12,
        paddingLeft: 15,
        color: '#05375a',
    },
    commandButton: {
        padding: 14,
        borderRadius: 10,
        backgroundColor: color.PINK,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        width: '90%',
        alignSelf: 'center'
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: color.WHITE,
    },
    addButton: {
        width: '90%',
        padding: 15,
        alignSelf: 'center',
        borderRadius: 10,
        backgroundColor: color.LIGHT_PINK,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        marginBottom: 15,
        flexDirection: 'row'
    },
    addTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: color.PINK,
    },
    add: {
        width: 22,
        height: 22,
        borderRadius: 25,
        backgroundColor: color.PINK,
        justifyContent: 'center',
        marginRight: 10,
        alignItems: 'center'
    },
    listPetWrapper: {
        height: 140,
        paddingTop: 15
    },
    petImageWrapper: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10
    },
    petImage: {
        height: 80,
        width: 80,
        borderRadius: 50
    },
    // Empty pet
    listPetEmpty: {
        paddingTop: 75
    },
    emptyView: {
        justifyContent: 'center',
        alignItems: 'center',

    },
    emptyImage: {
        width: 170,
        height: 170,
        borderRadius: 100
    },
    emptyText: {
        fontSize: 20,
        marginBottom: 5,
        marginTop: 30,
        color: color.PINK,
        letterSpacing: 1.5,
        fontWeight: 'bold'
    },
    emptyText2: {
        color: color.GRAY,
        fontSize: 16,
        paddingTop: 5,
        paddingBottom: 30
    },
    flatList: {
        paddingLeft: 10
    }
})

YellowBox.ignoreWarnings(['source.uri should not be an empty string']);

export default Profile;