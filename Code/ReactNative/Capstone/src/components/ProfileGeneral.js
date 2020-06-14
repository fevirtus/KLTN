import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, FlatList, ScrollView, Dimensions } from 'react-native'
import { TextInput} from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default function Profile() {
    const [avatarBoss, setAvatarBoss] = useState(null)
    const [avatarPet, setAvatarPet] = useState([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')

    const handleChangeName = text => {
        setName(text)
    }

    const handleChangeEmail = text => {
        setEmail(text)
    }

    const handleChangeAddress = text => {
        setAddress(text)
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

    const selectImagePet = () => {
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
            setAvatarPet(prevImages => prevImages.concat(img))   
        });
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.profilePicWrap}>
                    {avatarBoss && (
                        <Image source={{uri: avatarBoss.uri }} style={styles.profilePic} />
                    )}
                    <TouchableOpacity onPress={selectImage} style={styles.buttonCamera}>
                        <MaterialIcons name="add-a-photo" size={25} color="gray" />
                    </TouchableOpacity>
                </View> 

                <View style={{ paddingTop: 25, paddingBottom: 20 }}>
                    <TextInput 
                        mode="outlined"
                        label="Name"
                        onChangeText={handleChangeName}
                    />
                    <TextInput 
                        mode="outlined"
                        label="Email"
                        onChangeText={handleChangeEmail}
                    />
                    <TextInput 
                        mode="outlined"
                        label="Address"
                        onChangeText={handleChangeAddress}
                    />
                </View>
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={{ fontSize: 20, padding: 5 }}>Save</Text>
                </TouchableOpacity>
                <View style={{ height: 146, paddingTop: 16 }}>
                    <View style={styles.menuListPet}> 
                        <Text style={{ fontSize: 20 }}>List pet</Text>
                        <TouchableOpacity onPress={selectImagePet}>
                            <Ionicons name="ios-add-circle-outline" size={28} color="gray" />
                        </TouchableOpacity>
                    </View>  
                    <FlatList
                        style={styles.flatListPet}
                        horizontal={true}
                        data={avatarPet}
                        renderItem={({item}) => (
                            <View style={{ margin: 10 }}>
                                <Image source={{uri : item.uri}} style={styles.petImage} />
                            </View> 
                        )}
                    />
                </View>
                <View style={styles.imageGallery}>
                    <Image source={{uri : item.uri}} />
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },  
    profilePicWrap: {
        backgroundColor: 'gray',
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    buttonCamera: {
        width: 35,
        height: 35,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 65,
        left: 65
    },
    textInputWrapper: {
        paddingBottom: 14, 
        flexDirection: 'row'
    },
    textInput: {
        height: 25,
        width: 220,
        borderWidth: 1,
        borderColor: 'gray',
        paddingRight : 20,
        flexGrow: 1
    },
    saveButton: {
        borderWidth: 1,
        borderColor: 'gray',
        width: 300,
        justifyContent: 'center',
        alignItems: 'center'
    },
    menuListPet: {
        flexDirection: 'row', 
        justifyContent: 'space-between'
    },
    flatListPet: {
        backgroundColor: 'grey'
    },
    petImage: {
        height: 80,
        width: 80,
        borderRadius: 50
    },
    imageGallery: {
        width: Dimensions.get('window').width / 2,
        height: 150
    }
})