import Axios from 'axios';
import mime from 'mime';
import React, { useEffect, useState } from 'react';
import {
    Dimensions, Image, StyleSheet,
    Text,
    TextInput,
    TouchableOpacity, View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { ScrollView } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RadioButton } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import { URL_BASE, token } from '../../../../../api/config';
import { Container } from '../../../../../components';
import { color } from '../../../../../utility';
import { uploadImgToServer } from '../../../../../network';
import _ from 'lodash'
import { updatePet } from '../../../../../redux/actions/authActions';

const EditPetProfile = ({ navigation, route }) => {
    const { petInfo, petId } = route.params;
    const [info, setInfo] = useState({
        name: petInfo.name,
        breed: petInfo.breed,
        gender: petInfo.gender,
        weight: petInfo.weight,
        age: petInfo.age,
        introduction: petInfo.introduction,
        avatar: petInfo.avatar
    })
    const [checked, setChecked] = React.useState(petInfo.gender == 1 ? 'Male' : 'Female');
    const dispatch = useDispatch()
    const [breeds, setBreeds] = useState([]);
    const [uploadImg, setUploadImg] = useState({
        img: null
    });
    const [loading, setLoading] = useState(false)
    const [isChange, setIsChange] = useState(false);

    useEffect(() => {
        console.log('Get breed ----------')
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
        setIsChange(petInfo[type] != value);
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
                setInfo({ ...info, avatar: img.uri })
                setIsChange(true)
            }
        });
    }

    const validatePet = () => {
        if (_.isEmpty(info.name.trim())) {
            alert('Name can not be empty')
            return false;
        }
        if (info.breed === '-1') {
            alert('Must choose breed of pet')
            return false;
        }
        return true;
    }
    const onUpdatePet = async () => {
        if (validatePet()) {
            // setLoading(true)
            if (petInfo.avatar != info.avatar) {
                try {
                    const newAvatar = await uploadImgToServer(uploadImg);

                    //update user avatar on firebase
                    console.log('start', newAvatar)
                    Axios.put(`${URL_BASE}pets/${petId}`, {
                        updateFields: {
                            ...info,
                            avatar: newAvatar
                        }
                    }, { headers: { Authorization: token } })
                        .then(res => {
                            console.log('cc:', res.data)
                            dispatch(updatePet(res.data.data))
                            setIsChange(false)
                            navigation.goBack();
                        })
                        .catch(error => console.error(error));
                } catch (error) {
                    alert(error)
                }

            } else {
                Axios.put(`${URL_BASE}pets/${petId}`, {
                    updateFields: {
                        ...info
                    }
                }, { headers: { Authorization: token } })
                    .then(res => {
                        console.log(res.data)
                        dispatch(updatePet(res.data.data))
                        setIsChange(false)
                        navigation.goBack();
                    })
                    .catch(error => console.error(error));
            }
        }
    }

    return (
        <KeyboardAwareScrollView onPress={() => Keyboard.dismiss()}>
            <Container>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.profilePicWrap}>
                        <Image source={info.avatar ? { uri: info.avatar } : require('../../../../../../images/avatar.jpg')} style={styles.profileImage} />
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
                                onChangeText={(name) => handleChangeInfo('name', name)}
                                style={styles.textInput}
                            />
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 20, }}>
                            <MaterialIcons name="pets" color={color.GRAY} size={20} style={{ marginTop: 10 }} />
                            {breeds.length > 0 &&
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
                                />}
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
                                onChangeText={(weight) => handleChangeInfo('weight', weight)}
                                style={styles.textInput}
                            />
                        </View>
                        <View style={styles.action}>
                            <FontAwesome name="birthday-cake" color={color.GRAY} size={18} />
                            <TextInput
                                placeholder="Age"
                                keyboardType="numeric"
                                value={info.age}
                                placeholderTextColor={color.GRAY}
                                onChangeText={(age) => handleChangeInfo('age', age)}
                                style={styles.textInput}
                            />
                        </View>
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
                        {isChange &&
                            <TouchableOpacity style={styles.commandButton} onPress={onUpdatePet}>
                                <Text style={styles.panelButtonTitle}>Save</Text>
                            </TouchableOpacity>
                        }
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
        borderRadius: 10,
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
})

export default EditPetProfile