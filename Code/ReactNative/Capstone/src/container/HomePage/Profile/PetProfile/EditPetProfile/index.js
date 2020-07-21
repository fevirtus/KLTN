import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
} from 'react-native'
import { DismissKeyboard, Container, Loading } from '../../../../../components'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import ImagePicker from 'react-native-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RadioForm from 'react-native-simple-radio-button';
import { color } from '../../../../../utility'
import mime from 'mime'
import { newPetInfo } from '../../../../../redux/actions/authActions';
import { useDispatch } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage';

const EditPetProfile = ({ navigation, route }) => {
    const petId = route.params.petId;
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [avatar, setAvatar] = useState('')
    const [info, setInfo] = useState({
        name: '',
        breed: '',
        gender: 0,
        weight: '',
        age: '',
        introduction: ''
    })

    var gender = [
        { label: 'Male', value: 0 },
        { label: 'Female', value: 1 }
    ]

    const dataPet = async () => {
        const token = await AsyncStorage.getItem("token")
        axios.get(`https://pet-dating-server.herokuapp.com/api/pets/${petId}`, {
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
                introduction: introduction,
                avatar: avatar
            }
        }
        console.log(edit_pet)
        const token = await AsyncStorage.getItem("token")
        axios.put(`https://pet-dating-server.herokuapp.com/api/pets/${petId}`, edit_pet, {
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

    const { name, breed, weight, age, introduction } = info
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
                                    <RadioForm
                                        style={styles.radioForm}
                                        radio_props={gender}
                                        initial={0}
                                        buttonSize={18}
                                        formHorizontal={true}
                                        labelColor={color.GRAY}
                                        selectedButtonColor={color.PINK}
                                        buttonColor={color.PINK}
                                        labelStyle={{ fontSize: 15 }}
                                        labelStyle={{ marginRight: 40 }}
                                        onPress={() => { }}
                                    />
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
    }
})

export default EditPetProfile