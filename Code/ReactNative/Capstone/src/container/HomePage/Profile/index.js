import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    TextInput,
    Animated,
    Dimensions,
    YellowBox
} from 'react-native'
import ImagePicker from 'react-native-image-picker';
import * as Animatable from 'react-native-animatable';
import { useDispatch, useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import _ from 'lodash'
import Carousel from 'react-native-snap-carousel';
import { color } from '../../../utility'
import { updateUser } from '../../../redux/actions/authActions';
import { Container, DismissKeyboard } from '../../../components'
import { URL_BASE, token } from '../../../api/config'
import Axios from 'axios';
import { RadioButton } from 'react-native-paper';
import { UpdateUser, UpdateUserName, uploadImgToServer, validateUser } from '../../../network';
import { uuid } from '../../../utility/constants';
import { startLoading, stopLoading } from '../../../redux/actions/loadingAction';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const { width } = Dimensions.get('window')
const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
const ITEM_HEIGHT = Math.round(ITEM_WIDTH * 3 / 3);

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
    const [isValidPhone, setValidPhone] = useState(true)
    const [isValidName, setValidName] = useState(true)
    const [isChange, setIsChange] = useState(false);
    const [uploadImg, setUploadImg] = useState({
        img: null
    });

    const [showDatePicker, setShowDatePicker] = useState(false);

    const [checked, setChecked] = useState(user.gender === 1 ? 'Male' : 'Female');
    const carouselRef = useRef(null)

    //----
    const dispatch = useDispatch()

    // Animated state
    const [active, setActive] = useState(0)
    const [translateX, setTranslateX] = useState(new Animated.Value(0))
    const [translateXTabOne, setTranslateXTabOne] = useState(new Animated.Value(0))
    const [translateXTabTwo, setTranslateXTabTwo] = useState(new Animated.Value(width))
    const [translateY, setTranslateY] = useState(-1000)

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
                    type: 'image/jpeg',
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
        if (!validateUser(data)) return
        dispatch(startLoading())
        if (user.name != data.name) {
            //update user name on firebase
            UpdateUserName(uuid, data.name)
        }
        if (user.avatar != data.avatar) {
            try {
                const newAvatar = await uploadImgToServer(uploadImg);
                //update user avatar on firebase
                UpdateUser(uuid, newAvatar)
                Axios.put(`${URL_BASE}users`, {
                    updateFields: {
                        ...data,
                        avatar: newAvatar
                    }
                }, { headers: { Authorization: token } })
                    .then(res => {
                        dispatch(updateUser(res.data.data))
                        setIsChange(false)
                        dispatch(stopLoading())
                    })
                    .catch(error => {
                        dispatch(stopLoading())
                        console.log(error)
                    });
            } catch (error) {
                dispatch(stopLoading())
                alert('Picture error!')
            }

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
                    dispatch(stopLoading())
                })
                .catch(error => {
                    dispatch(stopLoading())
                    console.log(error)
                });
        }
    }

    const _renderItem = ({ item }) => {
        return (
            <View>
                <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate('PetProfile', { petId: item.id })}>
                    <Image
                        style={styles.carouselImage}
                        source={item.avatar ? { uri: item.avatar } : require('../../../../images/no-image.jpg')}
                    />
                    <Text style={styles.title}>{item.name}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const onDatePicker = (event, selectedDate) => {
        setShowDatePicker(false)
        if (selectedDate) {
            handleChangeInfo('birth_date', moment(selectedDate).format('YYYY-MM-DD'))
        }
    };

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

    const handleValidPhone = (val) => {
        if (val.length === 10) {
            setValidPhone(true)
        } else {
            setValidPhone(false)
        }
    }

    const handleValidName = (val) => {
        if (val.trim().length >= 2 && val.trim().length <= 15) {
            setValidName(true)
        } else {
            setValidName(false)
        }
    }

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
                                {
                                    user.is_vip === 1
                                        ? <View style={styles.premium}>
                                            <FontAwesome name="diamond" color={color.WHITE} size={18} />
                                            <Text style={styles.textPremium}>Premium</Text>
                                        </View> : null
                                }
                                <View style={styles.inputInformation}>
                                    <View style={styles.action}>
                                        <FontAwesome name="user-o" color={color.GRAY} size={22} />
                                        <TextInput
                                            placeholder="Name"
                                            value={data.name}
                                            placeholderTextColor={color.GRAY}
                                            onChangeText={(name) => {
                                                handleChangeInfo('name', name)
                                                handleValidName(name)
                                            }}
                                            // onEndEditing={(e) => handleValidName(e.nativeEvent.text)}
                                            style={styles.textInput}
                                        />
                                    </View>
                                    {isValidName ? null :
                                        <Animatable.View animation="fadeInLeft" duration={500}>
                                            <Text style={styles.errorMsg}>Name must have 2-15 characters</Text>
                                        </Animatable.View>
                                    }
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
                                            style={styles.textInput}
                                            keyboardType="numeric"
                                            value={data.phone}
                                            placeholderTextColor={color.GRAY}
                                            onChangeText={(phone) => {
                                                handleChangeInfo('phone', phone)
                                                handleValidPhone(phone)
                                            }}
                                        // onEndEditing={(e) => handleValidPhone(e.nativeEvent.text)}
                                        />
                                    </View>
                                    {isValidPhone ? null :
                                        <Animatable.View animation="fadeInLeft" duration={500}>
                                            <Text style={styles.errorMsg}>Phone number must have 10 figures</Text>
                                        </Animatable.View>
                                    }
                                    <View style={styles.action}>
                                        <FontAwesome name="birthday-cake" color={color.GRAY} size={22} />
                                        <TextInput
                                            placeholder="Birthday"
                                            value={data.birth_date}
                                            placeholderTextColor={color.GRAY}
                                            editable={false}
                                            style={styles.textInput}
                                        />
                                        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                            <FontAwesome name="calendar" color={color.GRAY} size={22} />
                                        </TouchableOpacity>
                                    </View>
                                    {showDatePicker &&
                                        <DateTimePicker
                                            testID="dateTimePicker"
                                            value={data.birth_date ? new Date(data.birth_date) : new Date()}
                                            mode='date'
                                            is24Hour={true}
                                            display="default"
                                            onChange={onDatePicker}
                                        />
                                    }
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
                                        </View>
                                        :
                                        <View style={styles.carouselContainerView}>
                                            <Carousel
                                                containerCustomStyle={styles.carouselContainer}
                                                ref={carouselRef}
                                                data={pets}
                                                renderItem={_renderItem}
                                                itemWidth={ITEM_WIDTH}
                                                layout={'default'}
                                                sliderWidth={SLIDER_WIDTH}
                                                inactiveSlideShift={0}
                                                useScrollView={true}
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
        width: '80%',
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
    // Content
    profilePicWrap: {
        width: 130,
        height: 130,
        borderRadius: 100,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 22
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
    premium: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: color.YELLOW,
        padding: 6,
        borderRadius: 6,
        marginBottom: 5,
        elevation: 3
    },
    textPremium: {
        color: color.WHITE,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5
    },
    action: {
        flexDirection: 'row',
        marginTop: 15,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    textInput: {
        flex: 1,
        marginTop: -12,
        paddingLeft: 25,
        color: '#05375a'
    },
    errorMsg: {
        color: color.RED,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    calendar: {
        flexDirection: 'row'
    },
    iconCal: {
        width: '60%',
        alignItems: 'flex-end'
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
    },
    carouselContainerView: {
        justifyContent: 'center',
        alignItems: 'center',
        height: ITEM_HEIGHT + 80
    },
    carouselImage: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT - 48,
        borderRadius: 10,
        marginBottom: 12
    },
    itemContainer: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: color.WHITE,
        elevation: 4
    },
    carouselContainer: {
        marginTop: 50,
    },
    title: {
        fontSize: 20,
        marginBottom: 15
    }
})

YellowBox.ignoreWarnings(['source.uri should not be an empty string']);

export default Profile;