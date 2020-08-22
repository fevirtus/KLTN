import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import mime from 'mime';
import React, { useEffect, useState } from 'react';
import {
    Dimensions, ScrollView, StyleSheet,
    Text, Image,
    TextInput, TouchableOpacity, View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import ImagePicker from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RadioButton } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import { token, URL_BASE } from '../../api/config';
import { Container, Loading } from '../../components';
import { color } from '../../utility';
import { addPet } from '../../redux/actions/authActions';
import _ from 'lodash'
import { uploadImgToServer, validatePet } from '../../network';
import { startLoading, stopLoading } from '../../redux/actions/loadingAction';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Animatable from 'react-native-animatable';

const PetSetting = ({ navigation }) => {
    const [info, setInfo] = useState({
        name: '',
        breed: '-1',
        gender: 1,
        weight: null,
        age: '',
        introduction: '',
        avatar: ''
    })
    const [checked, setChecked] = React.useState('Male');
    const dispatch = useDispatch()
    const [breeds, setBreeds] = useState([{ label: 'Choose breed of your pet', value: '-1' }]);
    const [uploadImg, setUploadImg] = useState({
        img: null
    });
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [isValidWeight, setValidWeight] = useState(true)
    const [isValidName, setValidName] = useState(true)

    useEffect(() => {
        Axios.get(`${URL_BASE}pets/breeds`, { headers: { Authorization: token } })
            .then(res => {
                console.log(res.data)
                let listBreeds = res.data.map(item => ({ label: item.name, value: `${item.id}` }));
                console.log(listBreeds)
                setBreeds(listBreeds)
            })
            .catch(e => console.error(e))
    }, [])

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
                    type: mime.getType(response.fileName),
                    name:
                        response.fileName ||
                        response.uri.substr(response.uri.lastIndexOf('/') + 1)
                }
                console.log(img)
                setUploadImg({ img: img });
                setInfo({ ...info, avatar: img.uri })
            }
        });
    }

    const handleValidName = (val) => {
        if (val.trim().length >= 2 && val.trim().length <= 15) {
            setValidName(true)
        } else {
            setValidName(false)
        }
    }

    const handleValidWeight = (val) => {
        if (val.length <= 3) {
            setValidWeight(true)
        } else {
            setValidWeight(false)
        }
    }

    const onDatePicker = (event, selectedDate) => {
        setShowDatePicker(false)
        if (selectedDate) {
            handleChangeInfo('age', moment(selectedDate).format('YYYY-MM-DD'))
        }
    };

    const onCreateNewPet = async () => {
        if (validatePet(info)) {
            try {
                dispatch(startLoading())
                let petAvatar = await uploadImgToServer(uploadImg);
                Axios.post(`${URL_BASE}pets`, { ...info, avatar: petAvatar }, { headers: { Authorization: token } })
                    .then(res => {
                        console.log(res.data)
                        dispatch(addPet(res.data.data))
                        navigation.navigate('Profile')
                        dispatch(stopLoading())
                    })
                    .catch(e => {
                        console.error(e)
                        dispatch(stopLoading())
                    })
            } catch (error) {
                dispatch(stopLoading())
                alert(error)
            }

        }
    }

    return (
        <KeyboardAwareScrollView onPress={() => Keyboard.dismiss()}>
            <Container>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.profilePicWrap}>
                        <Image source={info.avatar ? { uri: info.avatar } : require('../../../images/avatar.jpg')} style={styles.profileImage} />
                        <TouchableOpacity onPress={handlePicker} style={styles.camera}>
                            <MaterialIcons name="add-a-photo" size={22} color="#DFD8C8" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.container}>
                        <View style={[styles.action, { marginTop: 30 }]}>
                            <FontAwesome name="user-o" color={color.GRAY} size={20} />
                            <TextInput
                                placeholder="Name"
                                value={info.name}
                                placeholderTextColor={color.GRAY}
                                onChangeText={(name) => {
                                    handleChangeInfo('name', name)
                                    handleValidName(name)
                                }}
                                style={styles.textInput}
                            />
                        </View>
                        {isValidName ? null :
                            <Animatable.View animation="fadeInLeft" duration={500}>
                                <Text style={styles.errorMsg}>Name must have 2-15 characters</Text>
                            </Animatable.View>
                        }
                        <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 20, }}>
                            <MaterialIcons name="pets" color={color.GRAY} size={20} style={{ marginTop: 10 }} />
                            <DropDownPicker
                                items={breeds}
                                defaultValue={info.breed}
                                containerStyle={{ width: '87%', marginLeft: 10 }}
                                style={{ backgroundColor: '#fafafa', marginLeft: 10 }}
                                itemStyle={{
                                    justifyContent: 'flex-start'
                                }}
                                dropDownStyle={{ backgroundColor: '#fafafa' }}
                                onChangeItem={item => { handleChangeInfo('breed', item.value) }}
                                searchable={true}
                                searchablePlaceholder="Search for an item"
                                searchablePlaceholderTextColor="gray"
                                seachableStyle={{}}
                                searchableError={() => <Text>Not Found</Text>}
                                style={{}}
                                zIndex={5000}
                            />
                        </View>
                        <View style={[styles.action, {
                            borderTopColor: '#f2f2f2',
                            borderTopWidth: 1,
                            borderTopEndRadius: 20,
                            borderTopStartRadius: 20,
                            paddingTop: 20
                        }]}>
                            <FontAwesome name="transgender" color={color.GRAY} size={20} />
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
                            <MaterialCommunityIcons name="weight-kilogram" color={color.GRAY} size={20} />
                            <TextInput
                                placeholder="Weight"
                                keyboardType="numeric"
                                value={info.weight}
                                placeholderTextColor={color.GRAY}
                                onChangeText={(weight) => {
                                    handleChangeInfo('weight', weight)
                                    handleValidWeight(weight)
                                }}
                                style={styles.textInput}
                            />
                        </View>
                        {isValidWeight ? null :
                            <Animatable.View animation="fadeInLeft" duration={500}>
                                <Text style={styles.errorMsg}>Weight must have less than 3 figures</Text>
                            </Animatable.View>
                        }
                        <View style={[styles.action, { width: '100%' }]}>
                            <FontAwesome name="birthday-cake" color={color.GRAY} size={18} />
                            <TextInput
                                placeholder="Birthday"
                                value={info.age}
                                placeholderTextColor={color.GRAY}
                                editable={false}
                                style={styles.textInput}
                            />
                            <TouchableOpacity onPress={() => setShowDatePicker(true)}
                                style={{ marginRight: 20 }}
                            >
                                <FontAwesome name="calendar" color={color.GRAY} size={18} />
                            </TouchableOpacity>
                        </View>
                        {showDatePicker &&
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={info.age ? new Date(info.age) : new Date()}
                                mode='date'
                                is24Hour={true}
                                display="default"
                                onChange={onDatePicker}
                            />
                        }
                        <View style={styles.action}>
                            <MaterialIcons name="description" color={color.GRAY} size={22} />
                            <TextInput
                                placeholder="Introduction"
                                value={info.introduction}
                                placeholderTextColor={color.GRAY}
                                onChangeText={(introduction) => handleChangeInfo('introduction', introduction)}
                                style={styles.textInput}
                            />
                        </View>
                        {/* <View style={styles.imagePicker}>
                                <ImagePick />
                                <ImagePick />
                                <ImagePick />
                            </View> */}
                        <TouchableOpacity style={styles.commandButton} onPress={onCreateNewPet}>
                            <Text style={styles.panelButtonTitle}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Container>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    imagePicker: {
        flexDirection: 'row'
    },
    pictureWrapper: {
        width: Dimensions.get('window').width / 3.65,
        height: 150,
        backgroundColor: color.LIGHT_GRAY,
        marginTop: 30,
        marginBottom: 20,
        marginLeft: 18
    },
    image: {
        width: '100%',
        height: 150,
        resizeMode: 'contain'
    },
    add: {
        width: 30,
        height: 30,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 135,
        left: 96,
        backgroundColor: color.PINK,
    },
    action: {
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 5,
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
    radioForm: {
        paddingLeft: 18,
        marginBottom: 10
    },
    commandButton: {
        width: '90%',
        alignSelf: 'center',
        borderRadius: 25,
        padding: 15,
        backgroundColor: color.PINK,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 30
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: color.WHITE,
    },
    radioContaier: {
        flexDirection: 'row',
        alignContent: 'space-between',
        flex: 1,
        marginTop: -5,
        paddingLeft: 5,
        paddingBottom: 5
    },
    radioBtn: {
        flex: 1,
        flexDirection: 'row'
    },
    radioText: {
        marginTop: 10
    },
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
    errorMsg: {
        color: color.RED,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: 20,
    }
})

export default PetSetting

