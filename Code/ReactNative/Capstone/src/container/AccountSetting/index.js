import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
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

const AccountSetting = () => {
    const [picture, setPicture] = useState(null)
    const [nameSetting, setName] = useState('')
    const [phoneSetting, setPhone] = useState('')
    const dispatch = useDispatch()

    const handleChangeName = text => {
        setName(text)
    }

    const handleChangePhone = text => {
        setPhone(text)
    }

    const selectImage = async () => {
        await ImagePicker.showImagePicker({ noData: true, mediaType: 'photo' }, (response) => {
            console.log(response)
            if (response.didCancel) {
                return
            }
            const img = {
                uri: response.uri,
                type: response.type,
                name:
                    response.fileName ||
                    response.uri.substr(response.uri.lastIndexOf('/') + 1)
            }
            setPicture(img)
        });
    }

    const _postData = () => {
        const account_settings = {
            updateFields: {
                name: nameSetting,
                phone: phoneSetting,
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
                    <ImageBackground
                        source={require('../../../images/avatar.jpg')}
                        style={styles.profilePicWrap}
                        imageStyle={{ borderRadius: 100 }}
                    >
                        {picture && (
                            <Image source={{ uri: picture.uri }} style={styles.profileImage} />
                        )}
                        <TouchableOpacity onPress={selectImage} style={styles.camera}>
                            <MaterialIcons name="add-a-photo" size={25} color="#DFD8C8" />
                        </TouchableOpacity>
                    </ImageBackground>
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
        width: 35,
        height: 35,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 95,
        left: 90,
        backgroundColor: '#41444B',
        opacity: 0.8
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

