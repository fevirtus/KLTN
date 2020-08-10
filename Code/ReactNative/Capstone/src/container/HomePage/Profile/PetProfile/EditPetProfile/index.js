import React, { useEffect, useState } from 'react';
import {
    Dimensions, Image, StyleSheet,
    Text,
    TextInput, FlatList,
    TouchableOpacity, View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Axios from 'axios';
import mime from 'mime';
import { ScrollView } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RadioButton } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { URL_BASE, token } from '../../../../../api/config';
import { Container } from '../../../../../components';
import { color } from '../../../../../utility';
import { uploadImgToServer, uploadPicturesToServer } from '../../../../../network';
import _ from 'lodash'
import { updatePet, updateActivePet } from '../../../../../redux/actions/authActions';
import ImageCropPicker from 'react-native-image-crop-picker';
import { ActionSheet, Root } from 'native-base'
import { startLoading, stopLoading } from '../../../../../redux/actions/loadingAction';

const EditPetProfile = ({ navigation, route }) => {
    const pet_active = useSelector(state => state.auth.pet_active)

    const { petInfo, petId } = route.params;
    const [info, setInfo] = useState({
        name: petInfo.name,
        breed: petInfo.breed,
        gender: petInfo.gender,
        weight: petInfo.weight,
        age: petInfo.age,
        introduction: petInfo.introduction,
        avatar: petInfo.avatar,
    })
    const [pictures, setPictures] = useState(petInfo.pictures)
    const [checked, setChecked] = useState(petInfo.gender == 1 ? 'Male' : 'Female');
    const dispatch = useDispatch()
    const [breeds, setBreeds] = useState([]);
    const [uploadImg, setUploadImg] = useState({
        img: null
    });
    // const [fileList, setFileList] = useState([])
    const [isChange, setIsChange] = useState(false);

    useEffect(() => {
        dispatch(startLoading())
        Axios.get(`${URL_BASE}pets/breeds`, { headers: { Authorization: token } })
            .then(res => {
                let listBreeds = res.data.map(item => ({ label: item.name, value: `${item.id}` }));
                setBreeds(listBreeds)
                dispatch(stopLoading())
            })
            .catch(e => {
                console.log(e)
                dispatch(stopLoading())
            })
    }, [])

    const handleChangeInfo = (type, value) => {
        setInfo({ ...info, [type]: value })
        setIsChange(petInfo[type] != value);
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
                setInfo({ ...info, avatar: img.uri })
                setIsChange(true)
            }
        });
    }

    const takePhotoFromCamera = () => {
        ImageCropPicker.openCamera({
            compressImageMaxWidth: 300,
            compressImageMaxHeight: 300,
            cropping: true,
        }).then(image => {
            console.log(image);
            let img = {
                uri: image.path,
                type: 'image/jpeg',
                name: `${Date.now()}.jpg`
            }
            uploadPictures([img])
        });
    }

    const choosePhotoFromLibrary = () => {
        ImageCropPicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            multiple: true
        }).then(images => {
            let newFileList = images.map(item => {
                return {
                    uri: item.path,
                    type: mime.getType(item.path),
                    name: `${Date.now()}.jpg`
                }
            })
            uploadPictures(newFileList)
        }).catch(e => console.log(e.message));
    }

    const addImage = () => {
        const BUTTONS = ['Take Photo', 'Choose Photo Library', 'Cancel']
        ActionSheet.show({ options: BUTTONS, cancelButtonIndex: 2, title: 'Select a Photo' },
            buttonIndex => {
                switch (buttonIndex) {
                    case 0:
                        takePhotoFromCamera()
                        break;
                    case 1:
                        choosePhotoFromLibrary()
                        break;
                    default:
                        break;
                }
            }
        )
    }

    const uploadPictures = async (fileList) => {
        if (fileList.length != 0) {
            try {
                dispatch(startLoading())
                const urlPics = await uploadPicturesToServer(fileList);
                console.log(urlPics)
                Axios.post(`${URL_BASE}pets/${petId}/pictures`, {
                    pictures: urlPics
                }, { headers: { Authorization: token } })
                    .then(res => {
                        dispatch(stopLoading())
                    })
                    .catch(e => {
                        console.log(e)
                        dispatch(stopLoading())
                    })
            } catch (error) {
                dispatch(stopLoading())
                alert(error)
            }
        }
        navigation.goBack()
    }

    const onUpdatePet = async () => {
        if (validatePet()) {
            dispatch(startLoading())
            if (petInfo.avatar != info.avatar) {
                try {
                    const newAvatar = await uploadImgToServer(uploadImg);
                    //update user avatar on firebase
                    Axios.put(`${URL_BASE}pets/${petId}`, {
                        updateFields: {
                            ...info,
                            avatar: newAvatar
                        }
                    }, { headers: { Authorization: token } })
                        .then(res => {
                            dispatch(updatePet(res.data.data))
                            if (pet_active.id == petId) {
                                dispatch(updateActivePet(res.data.data))
                            }
                            setIsChange(false)
                            dispatch(stopLoading())
                            navigation.goBack();
                        })
                        .catch(error => {
                            console.log(error)
                            dispatch(stopLoading())
                        });
                } catch (error) {
                    dispatch(stopLoading())
                    alert(error)
                }

            } else {
                Axios.put(`${URL_BASE}pets/${petId}`, {
                    updateFields: {
                        ...info
                    }
                }, { headers: { Authorization: token } })
                    .then(res => {
                        if (pet_active.id == petId) {
                            dispatch(updateActivePet(res.data.data))
                        }
                        dispatch(updatePet(res.data.data))
                        setIsChange(false)
                        dispatch(stopLoading())
                        navigation.goBack();
                    })
                    .catch(error => {
                        console.log(error)
                        dispatch(stopLoading())
                    });
            }
        }
    }

    const renderList = ((item) => {
        return (
            <View style={styles.petImageWrapper}>
                <Image
                    source={item ? { uri: item } : require('../../../../../../images/avatar.jpg')}
                    style={styles.petImage}
                />
            </View>
        )
    })

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
                        <View style={[styles.action, { justifyContent: 'space-between' }]}>
                            <FontAwesome name="image" color={color.GRAY} size={20} />
                            <Text>! - - - - - -  Add image here  - - - - - - !</Text>
                            <TouchableOpacity style={styles.addPicture} onPress={addImage}>
                                <Root>
                                    <MaterialIcons name="library-add" color={color.PINK} size={26} />
                                </Root>
                            </TouchableOpacity>
                        </View>
                        {
                            _.isEmpty(pictures)
                                ? <View style={styles.emptyPic}>
                                    <Image
                                        source={require('../../../../../../images/pic-empty.png')}
                                        style={styles.petImage}
                                    />
                                    <Image
                                        source={require('../../../../../../images/pic-empty.png')}
                                        style={styles.petImage}
                                    />
                                    <Image
                                        source={require('../../../../../../images/pic-empty.png')}
                                        style={styles.petImage}
                                    />
                                </View>
                                : <FlatList
                                    horizontal={true}
                                    data={pictures}
                                    renderItem={({ item }) => {
                                        return renderList(item)
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                        }
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
    petImageWrapper: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 10,
    },
    petImage: {
        height: 85,
        width: 85,
        borderRadius: 20,
        borderWidth: 3,
    },
    addPicture: {
        paddingRight: 20
    },
    emptyPic: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingBottom: 10
    }
})

export default EditPetProfile