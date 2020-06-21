import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, FlatList, ScrollView, Dimensions, ImageBackground } from 'react-native'
import { TextInput, Subheading } from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'

const Profile = ({ navigation }) => {
    const [avatarBoss, setAvatarBoss] = useState(null)
    const [avatarPet, setAvatarPet] = useState([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [location, setLocation] = useState('')

    const handleChangeName = text => {
        setName(text)
    }

    const handleChangeEmail = text => {
        setEmail(text)
    }

    const handleChangeLocation = text => {
        setLocation(text)
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
            <ScrollView showsVerticalScrollIndicator={false}>
                <ImageBackground 
                    source={require('../../../images/avatar.jpg')} 
                    style={styles.profilePicWrap} 
                    imageStyle={{ borderRadius: 100 }}
                >
                    {avatarBoss && (
                        <Image source={{uri: avatarBoss.uri }} style={styles.profileImage} />
                    )}
                    <TouchableOpacity onPress={selectImage} style={styles.camera}>
                        <MaterialIcons name="add-a-photo" size={25} color="#DFD8C8" />
                    </TouchableOpacity>
                </ImageBackground> 

                <View style={styles.inputInformation}>
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
                        label="Phone"
                        onChangeText={handleChangePhone}
                    />
                    <TextInput 
                        mode="outlined"
                        label="Location"
                        onChangeText={handleChangeLocation}
                    />
                </View>
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.save}>Save</Text>
                </TouchableOpacity>
                <View style={styles.listPetWrapper}>
                    <View style={styles.menuListPet}> 
                        <Subheading style={styles.text}>List pet</Subheading>
                        <TouchableOpacity onPress={selectImagePet}>
                            <Ionicons name="ios-add-circle-outline" size={28} color="gray" />
                        </TouchableOpacity>
                    </View>  
                    <FlatList
                        style={styles.flatListPet}
                        horizontal={true}
                        data={avatarPet}
                        renderItem={({item}) => (
                            <View style={styles.petImageWrapper}>
                                <TouchableOpacity onPress={() => navigation.navigate('PetProfile')}>
                                    <Image source={{uri : item.uri}} style={styles.petImage} />
                                </TouchableOpacity>       
                            </View> 
                        )}
                    />
                </View>
                <View>
                    <Subheading style={styles.text}>All photos:</Subheading>
                    <FlatList
                        numColumns={2}
                        data={avatarPet}
                        renderItem={({item}) => (
                            <View style={styles.imageGallery}>
                                <Image source={{uri: item.uri}} style={styles.imgGallery} />
                            </View>
                        )}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },  
    profilePicWrap: {
        width: 130,
        height: 130,
        borderRadius: 100,
        alignSelf: 'center',
        marginTop: 40
    },
    profileImage: {
        width: 130,
        height: 130,
        borderRadius: 100
    },
    camera: {
        width: 35,
        height: 35,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 98,
        left: 90,
        backgroundColor: '#41444B'
    },
    inputInformation: {
        paddingTop: 25, 
        paddingBottom: 20
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
    save: {
        paddingTop: 10, 
        paddingBottom: 10
    },
    listPetWrapper: {
        height: 146,
        paddingTop: 16
    },
    menuListPet: {
        flexDirection: 'row', 
        justifyContent: 'space-between'
    },
    text: {
        fontSize: 18
    },
    flatListPet: {
        backgroundColor: 'grey'
    },
    petImageWrapper: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10
    },
    petImage: {
        height: 80,
        width: 80,
        borderRadius: 50
    },
    imageGallery: {
        width: Dimensions.get('window').width / 2,
        height: 200
    },
    imgGallery: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 10
    }
})