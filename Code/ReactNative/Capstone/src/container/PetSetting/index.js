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
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { color } from '../../utility'
import { useDispatch } from 'react-redux';
import { saveAccountSettings } from '../../redux/actions/authActions';
import { RequestApiAsyncPost } from '../../api/config'

const PetSetting = ({ navigation }) => {
    const [image, setAvatarBoss] = useState(null)
    const [nameSetting, setName] = useState('')
    const [phoneSetting, setPhone] = useState('')
    const dispatch = useDispatch()

    const handleChangeName = text => {
        setName(text)
    }

    const handleChangePhone = text => {
        setPhone(text)
    }

    const selectImage = () => {
        ImagePicker.showImagePicker({noData:true, mediaType:'photo'}, (response) => {
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
            setAvatarBoss(img)
        });
    }

    const _postData = () => {
        const new_pet = {
            name: nameSetting,
            phone: phoneSetting
        }
        console.log(new_user)
        RequestApiAsyncPost('pets', 'POST', {}, new_pet)
            .then(() => {
                dispatch(saveAccountSettings(new_pet))
                console.log("Save user successful")
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
                        {image && (
                            <Image source={{uri: image.uri }} style={styles.profileImage} />
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
                        <MaterialIcons name="pets" color={color.GRAY} size={20} />
                        <TextInput 
                            placeholder="Breed"
                            // value={nameSetting}
                            placeholderTextColor={color.GRAY}
                            // onChangeText={handleChangeName}
                            style={styles.textInput}
                        />
                    </View>
                    <View style={styles.action}>
                        <FontAwesome name="transgender" color={color.GRAY} size={20} />
                        <TextInput 
                            placeholder="Gender"
                            value={phoneSetting}
                            placeholderTextColor={color.GRAY}
                            onChangeText={handleChangePhone}
                            style={styles.textInput}
                        />
                    </View>
                    <View style={styles.action}>
                        <MaterialCommunityIcons name="weight-kilogram" color={color.GRAY} size={20} />
                        <TextInput 
                            placeholder="Weight"
                            keyboardType="numeric"
                            value={phoneSetting}
                            placeholderTextColor={color.GRAY}
                            onChangeText={handleChangePhone}
                            style={styles.textInput}
                        />
                    </View>
                    <View style={styles.action}>
                        <FontAwesome name="birthday-cake" color={color.GRAY} size={18} />
                        <TextInput 
                            placeholder="Age"
                            keyboardType="numeric"
                            value={phoneSetting}
                            placeholderTextColor={color.GRAY}
                            onChangeText={handleChangePhone}
                            style={styles.textInput}
                        />
                    </View>
                    <View style={styles.action}>
                        <EvilIcons name="location" color={color.GRAY} size={22} />
                        <TextInput 
                            placeholder="City"
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
        marginTop: 20,
        marginBottom: 20
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
    commandButton: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: color.PINK,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        width: '90%',
        alignSelf: 'center'
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: color.WHITE,
    },
})

export default PetSetting

