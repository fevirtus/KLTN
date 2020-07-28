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
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import _ from 'lodash'
import { color } from '../../../utility'
import { updateUser, savePets } from '../../../redux/actions/authActions';
import { Container, Loading, DismissKeyboard } from '../../../components'
import { URL_BASE, token } from '../../../api/config'
import Axios from 'axios';
import { RadioButton } from 'react-native-paper';
import { UpdateUser, UpdateUserName, uploadImgToServer } from '../../../network';
import { uuid } from '../../../utility/constants';

const { width } = Dimensions.get('window')

const Profile = ({ navigation }) => {
    const user = useSelector(state => state.auth.user);
    const pets = useSelector(state => state.auth.pets);

    const [data, setData] = useState({
        name: user.name,
        gender: user.gender,
        birth_date: user.birth_date,
        phone: user.phone,
        avatar: user.avatar
    });
    const [isChange, setIsChange] = useState(false);
    const [uploadImg, setUploadImg] = useState({
        img: null
    });

    const [checked, setChecked] = React.useState(user.gender === 1 ? 'Male' : 'Female');



    //----
    // const [dataPet, setDataPet] = useState([])
    const dispatch = useDispatch()

    // Animated state
    const [active, setActive] = useState(0)
    const [translateX, setTranslateX] = useState(new Animated.Value(0))
    const [translateXTabOne, setTranslateXTabOne] = useState(new Animated.Value(0))
    const [translateXTabTwo, setTranslateXTabTwo] = useState(new Animated.Value(width))
    const [translateY, setTranslateY] = useState(-1000)


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

    const handleChangeInfo = (field, value) => {
        setData({
            ...data,
            [field]: value
        });
        setIsChange(user[field] != value);
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
                setUploadImg({ img: img });
                setData({ ...data, avatar: img.uri })
                setIsChange(true)
            }
        });
    }
    const onUpdateUser = async () => {

        if (user.name != data.name) {
            //update user name on firebase
            UpdateUserName(uuid, data.name)
        }

        if (user.avatar != data.avatar) {
            const newAvatar = await uploadImgToServer(uploadImg);

            //update user avatar on firebase
            UpdateUser(uuid, newAvatar)
            console.log('start', newAvatar)
            Axios.put(`${URL_BASE}users`, {
                updateFields: {
                    ...data,
                    avatar: newAvatar
                }
            }, { headers: { Authorization: token } })
                .then(res => {
                    console.log('cc:', res.data)
                    dispatch(updateUser(res.data.data))
                    setIsChange(false)
                    // navigation.goBack();
                })
                .catch(error => console.error(error));
        } else {
            Axios.put(`${URL_BASE}users`, {
                updateFields: {
                    ...data
                }
            }, { headers: { Authorization: token } })
                .then(res => {
                    console.log(res.data)
                    dispatch(updateUser(res.data.data))
                    setIsChange(false)
                    // navigation.goBack();
                })
                .catch(error => console.error(error));
        }
    }

    const renderList = ((item) => {
        return (
            <View style={styles.petImageWrapper}>
                <TouchableOpacity onPress={() => navigation.navigate('PetProfile', { petId: item.id })}>
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

    // const { name, email, phone, avatar } = infoinfo
    return (
        <Container>
            <DismissKeyboard>
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
                                    <Image source={data.avatar ? { uri: data.avatar } : require('../../../../images/avatar.jpg')} style={styles.profileImage} />
                                    <TouchableOpacity onPress={handlePicker} style={styles.camera}>
                                        <MaterialIcons name="add-a-photo" size={22} color="#DFD8C8" />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.inputInformation}>
                                    <View style={styles.action}>
                                        <FontAwesome name="user-o" color={color.GRAY} size={22} />
                                        <TextInput
                                            placeholder="Name"
                                            value={data.name}
                                            placeholderTextColor={color.GRAY}
                                            onChangeText={(name) => handleChangeInfo('name', name)}
                                            style={styles.textInput}
                                        />
                                    </View>
                                    <View style={styles.action}>
                                        <Fontisto name="email" color={color.GRAY} size={22} />
                                        <TextInput
                                            placeholder="Email"
                                            value={user.email}
                                            editable={false}
                                            placeholderTextColor={color.GRAY}
                                            style={[styles.textInput, { color: 'grey' }]}
                                        />
                                    </View>
                                    <View style={styles.action}>
                                        <FontAwesome name="transgender" color={color.GRAY} size={22} />
                                        <View style={styles.radioContaier}>
                                            <View style={styles.radioBtn}>
                                                <RadioButton
                                                    value="Male"
                                                    status={checked === 'Male' ? 'checked' : 'unchecked'}
                                                    onPress={() => {
                                                        setChecked('Male');
                                                        handleChangeInfo('gender', 1);
                                                    }}
                                                />
                                                <Text style={styles.radioText}>Male</Text>
                                            </View>
                                            <View style={styles.radioBtn}>
                                                <RadioButton
                                                    value="Female"
                                                    status={checked === 'Female' ? 'checked' : 'unchecked'}
                                                    onPress={() => {
                                                        setChecked('Female');
                                                        handleChangeInfo('gender', 0);
                                                    }}
                                                /><Text style={styles.radioText}>Female</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.action}>
                                        <Feather name="phone" color={color.GRAY} size={22} />
                                        <TextInput
                                            placeholder="Phone"
                                            keyboardType="numeric"
                                            value={data.phone}
                                            placeholderTextColor={color.GRAY}
                                            onChangeText={(phone) => handleChangeInfo('phone', phone)}
                                            style={styles.textInput}
                                        />
                                    </View>
                                    <View style={styles.action}>
                                        <FontAwesome name="birthday-cake" color={color.GRAY} size={22} />
                                        <TextInput
                                            placeholder="Birthday"
                                            value={data.birth_date}
                                            placeholderTextColor={color.GRAY}
                                            onChangeText={(txt) => handleChangeInfo('bith_date', txt)}
                                            style={styles.textInput}
                                        />
                                    </View>
                                </View>
                                {isChange &&
                                    <TouchableOpacity style={styles.commandButton} onPress={onUpdateUser}>
                                        <Text style={styles.panelButtonTitle}>Save</Text>
                                    </TouchableOpacity>
                                }
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
                                    _.isEmpty(pets) ?
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
                                                data={pets}
                                                renderItem={({ item }) => {
                                                    return renderList(item)
                                                }}
                                                keyExtractor={(item, index) => index.toString()}
                                                refreshing={true}
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
        paddingLeft: 25,
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
    },
    radioContaier: {
        flexDirection: 'row',
        alignContent: 'space-between',
        flex: 1,
        marginTop: -5,
        paddingLeft: 25
    },
    radioBtn: {
        flex: 1,
        flexDirection: 'row'
    },
    radioText: {
        marginTop: 10
    }
})

YellowBox.ignoreWarnings(['source.uri should not be an empty string']);

export default Profile;