import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
} from 'react-native'
import mime from 'mime'
import axios from 'axios'
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import { RadioButton } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DismissKeyboard, Container, Loading } from '../../../../../components'
import { color } from '../../../../../utility'
import { URL_BASE } from '../../../../../api/config'
import { newPetInfo } from '../../../../../redux/actions/authActions';

const EditPetProfile = ({ navigation, route }) => {
    const petId = route.params.petId;
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [avatar, setAvatar] = useState('')
    const [checked, setChecked] = useState(gender === 1 ? 'Male' : 'Female')
    const [info, setInfo] = useState({
        name: '',
        breed: '',
        gender: '',
        weight: '',
        age: '',
        introduction: '',
        is_active: ''
    })

    const dataPet = async () => {
        const token = await AsyncStorage.getItem("token")
        axios.get(`${URL_BASE}pets/${petId}`, {
            headers: {
                Authorization: token
            }
        }).then(res => {
            console.log(res.data[0])
            setInfo(res.data[0])
            setAvatar(res.data[0].avatar)
            setLoading(false)
        }).catch(e => {
            console.log("Api call error!", e)
        })
    }

    useEffect(() => {
        dataPet()
    }, [])

    const handleChangeInfo = (type, value) => {
        setInfo({ ...info, [type]: value })
    }

    const _saveData = async () => {
        const edit_pet = {
            updateFields: {
                name: name,
                breed: breed,
                weight: weight,
                age: age,
                gender: gender,
                introduction: introduction,
                avatar: avatar
            }
        }
        console.log(edit_pet)
        const token = await AsyncStorage.getItem("token")
        axios.put(`${URL_BASE}pets/${petId}`, edit_pet, {
            headers: {
                Authorization: token
            }
        }).then((res) => {
            console.log(res.data)
            dispatch(newPetInfo(res.data.data))
            navigation.navigate('PetProfile')
        }).catch((e) => {
            console.log("Api call error")
            alert(e.message)
        })
    }

    const handlePicker = () => {
        let options = {
            title: 'Select Image',
            noData: true,
            maxWidth: 500,
            maxHeight: 500,
        };
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response - ', response);

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
                        setAvatar(data.url)
                    }).catch(e => {
                        alert(e.message)
                    })
            }
        });
    }

    const { name, breed, weight, gender, age, introduction, is_active } = info
    return (
        <DismissKeyboard>
            <Container>
                {
                    loading ? <Loading />
                        :
                        <View style={styles.container}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.profilePicWrap}>
                                    <Image source={{ uri: avatar }} style={styles.profileImage} />
                                    <TouchableOpacity onPress={handlePicker} style={styles.camera}>
                                        <MaterialIcons name="add-a-photo" size={22} color="#DFD8C8" />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.action}>
                                    <FontAwesome name="user-o" color={color.GRAY} size={20} />
                                    <TextInput
                                        placeholder="Name"
                                        value={name}
                                        placeholderTextColor={color.GRAY}
                                        onChangeText={(name) => handleChangeInfo('name', name)}
                                        style={styles.textInput}
                                    />
                                </View>
                                <View style={styles.action}>
                                    <MaterialIcons name="pets" color={color.GRAY} size={20} />
                                    <TextInput
                                        placeholder="Breed"
                                        keyboardType="numeric"
                                        value={breed}
                                        placeholderTextColor={color.GRAY}
                                        onChangeText={(breed) => handleChangeInfo('breed', breed)}
                                        style={styles.textInput}
                                    />
                                </View>
                                <View style={styles.action}>
                                    <FontAwesome name="transgender" color={color.GRAY} size={20} />
                                    <View style={styles.radioBtn}>
                                        <RadioButton
                                            color={color.PINK}
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
                                            color={color.PINK}
                                            value="Female"
                                            status={checked === 'Female' ? 'checked' : 'unchecked'}
                                            onPress={() => {
                                                setChecked('Female');
                                                handleChangeInfo('gender', 0);
                                            }}
                                        />
                                        <Text style={styles.radioText}>Female</Text>
                                    </View>
                                </View>
                                <View style={styles.action}>
                                    <FontAwesome name="birthday-cake" color={color.GRAY} size={18} />
                                    <TextInput
                                        placeholder="Age"
                                        keyboardType="numeric"
                                        value={age}
                                        placeholderTextColor={color.GRAY}
                                        onChangeText={(age) => handleChangeInfo('age', age)}
                                        style={styles.textInput}
                                    />
                                </View>
                                <View style={styles.action}>
                                    <MaterialCommunityIcons name="weight-kilogram" color={color.GRAY} size={20} />
                                    <TextInput
                                        placeholder="Weight"
                                        keyboardType="numeric"
                                        value={weight}
                                        placeholderTextColor={color.GRAY}
                                        onChangeText={(weight) => handleChangeInfo('weight', weight)}
                                        style={styles.textInput}
                                    />
                                </View>
                                <View style={styles.action}>
                                    <MaterialIcons name="description" color={color.GRAY} size={22} />
                                    <TextInput
                                        placeholder="Introduction"
                                        value={introduction}
                                        placeholderTextColor={color.GRAY}
                                        onChangeText={(introduction) => handleChangeInfo('introduction', introduction)}
                                        style={styles.textInput}
                                    />
                                </View>
                                <View style={styles.action}>
                                    <MaterialIcons name="description" color={color.GRAY} size={22} />
                                    <TextInput
                                        placeholder="Status"
                                        editable={false}
                                        value={is_active == 0 ? 'Inactive' : 'Active'}
                                        placeholderTextColor={color.GRAY}
                                        style={[styles.textInput, { color: 'grey' }]}
                                    />
                                </View>
                                <TouchableOpacity style={styles.commandButton} onPress={_saveData}>
                                    <Text style={styles.panelButtonTitle}>Save</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                }
            </Container>
        </DismissKeyboard>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    profilePicWrap: {
        width: 130,
        height: 130,
        borderRadius: 100,
        alignSelf: 'center',
        marginTop: 30,
        marginBottom: 20
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
        paddingLeft: 20,
        color: '#05375a',
        fontSize: 16
    },
    radioBtn: {
        flexDirection: 'row',
        paddingLeft: 14,
        paddingHorizontal: 20,
    },
    radioText: {
        marginTop: 8,
        fontSize: 15
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
    }
})

export default EditPetProfile