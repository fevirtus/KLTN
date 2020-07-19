import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput
} from 'react-native'
import { Container } from '../../components';
import ImagePicker from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { color } from '../../utility'
import { useDispatch } from 'react-redux';
import { saveUserInfo } from '../../redux/actions/authActions';
import { RequestApiAsyncPost } from '../../api/config'
import mime from 'mime'

const AccountSetting = () => {
    const [picture, setPicture] = useState('')
    const [nameSetting, setName] = useState('')
    const [phoneSetting, setPhone] = useState('')
    const dispatch = useDispatch()

    const handleChangeName = text => {
        setName(text)
    }

    const handleChangePhone = text => {
        setPhone(text)
    }

    const handlePicker = () => {
        let options = {
            title: 'Select Image',
            noData: true,
            maxWidth: 500,
            maxHeight: 500,
        };
        ImagePicker.showImagePicker(options, (response) => {
            console.log(response);

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
                        setPicture(data.url)
                    }).catch(e => {
                        alert(e.message)
                    })
            }
        });
    }

    const _postData = () => {
        const account_settings = {
            updateFields: {
                name: nameSetting,
                phone: phoneSetting,
                avatar: picture
            }
        }
        console.log(account_settings)
        RequestApiAsyncPost('users', 'PUT', {}, account_settings)
            .then((res) => {
                console.log(res.data)
                dispatch(saveUserInfo(res.data.data))
            }).catch((e) => {
                console.log("Api call error")
                alert(e.message)
            })
    }

    return (
        <KeyboardAwareScrollView onPress={() => Keyboard.dismiss()}>
            <Container>
                <View style={styles.container}>
                    <View style={styles.profilePicWrap}>
                        <Image source={{ uri: picture }} style={styles.profileImage} />
                        <TouchableOpacity onPress={handlePicker} style={styles.camera}>
                            <MaterialIcons name="add-a-photo" size={22} color="#DFD8C8" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.action}>
                        <FontAwesome name="user-o" color={color.GRAY} size={20} />
                        <TextInput
                            placeholder="Name"
                            value={nameSetting}
                            placeholderTextColor={color.GRAY}
                            onChangeText={handleChangeName}
                            style={styles.textInput}
                        />
                    </View>
                    <View style={styles.action}>
                        <Feather name="phone" color={color.GRAY} size={20} />
                        <TextInput
                            placeholder="Phone"
                            keyboardType="numeric"
                            value={phoneSetting}
                            placeholderTextColor={color.GRAY}
                            onChangeText={handleChangePhone}
                            style={styles.textInput}
                        />
                    </View>
                    <TouchableOpacity style={styles.commandButton} onPress={_postData}>
                        <Text style={styles.panelButtonTitle}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </Container>
        </KeyboardAwareScrollView>
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
        marginTop: 40,
        marginBottom: 50
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
        marginTop: 20,
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
        padding: 15,
        borderRadius: 10,
        backgroundColor: color.PINK,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        width: '90%',
        alignSelf: 'center'
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: color.WHITE,
    },
})

export default AccountSetting

