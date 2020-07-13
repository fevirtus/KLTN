import React, { useState } from 'react';
import { 
    StyleSheet,
    View, 
    Text,
    TouchableOpacity, 
    ScrollView, 
    Image,
    TextInput,
    Dimensions
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

    const ImagePick = () => (
        <View style={styles.pictureWrapper}>
            {image && (
                <Image source={{uri: image.uri }} style={styles.image} />
            )}
            <TouchableOpacity onPress={selectImage} style={styles.add}>
                <MaterialIcons name="add" size={25} color={color.WHITE} />
            </TouchableOpacity>
        </View>
    )

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
                navigation.navigate('AccountSetting')
            }).catch((e) => {
                console.log("Api call error")
                alert(e.message)
            })
    }

    return (
        <KeyboardAwareScrollView onPress={() => Keyboard.dismiss()}>
            <Container>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        <View style={[styles.action, { marginTop: 30 }]}>
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
                        <View style={styles.imagePicker}>
                            <ImagePick />
                            <ImagePick />
                            <ImagePick />
                        </View>
                        <TouchableOpacity style={styles.commandButton} onPress={_postData}>
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
})

export default PetSetting

