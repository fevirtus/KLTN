import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    ScrollView,
    TextInput,
    YellowBox
} from 'react-native'
import ImagePicker from 'react-native-image-picker';
import mime from 'mime'
import { useDispatch } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import _ from 'lodash'
import { color } from '../../../utility'
import { saveUserInfo } from '../../../redux/actions/authActions';
import { Container, Loading, DismissKeyboard } from '../../../components'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage';

const Profile = ({ navigation }) => {
    const [dataPet, setDataPet] = useState([])
    const [info, setInfo] = useState({
        name: '',
        email: '',
        phone: '',
        avatar: ''
    })
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()

    const dataUser = async () => {
        const token = await AsyncStorage.getItem("token")
        axios.get('https://pet-dating-server.herokuapp.com/api/users/currentUser', {
            headers: {
                Authorization: token
            }
        }).then(res => {
            setInfo(res.data[0])
            setLoading(false)
        }).catch(e => {
            console.log("Api call error!", e)
        })
    }

    const dataPets = async () => {
        const token = await AsyncStorage.getItem("token")
        axios.get('https://pet-dating-server.herokuapp.com/api/pets', {
            headers: {
                Authorization: token
            }
        }).then(res => {
            console.log(res.data)
            setDataPet(res.data)
            setLoading(false)
        }).catch(e => {
            console.log("Api call error!", e)
        })
    }

    useEffect(() => {
        dataUser()
        dataPets()
    }, [])

    const _saveData = async () => {
        const settings = {
            updateFields: {
                name: name,
                phone: phone,
                email: email,
                avatar: avatar
            }
        }
        console.log(settings)
        const token = await AsyncStorage.getItem("token")
        axios.put('https://pet-dating-server.herokuapp.com/api/users', settings, {
            headers: {
                Authorization: token
            }
        }).then((res) => {
            dispatch(saveUserInfo(res.data.data))
            alert('Save successful')
        }).catch((e) => {
            console.log("Api call error")
            alert(e.message)
        })
    }

    const handleChangeInfo = (type, value) => {
        setInfo({ ...info, [type]: value })
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
                        setInfo({ avatar: data.url })
                        console.log(data)
                    }).catch(e => {
                        alert(e.message)
                    })
            }
        });
    }

    const renderList = ((item) => {
        return (
            <View style={styles.petImageWrapper}>
                <TouchableOpacity onPress={() => navigation.navigate('PetProfile', { itemId: item.id })}>
                    <Image source={{ uri: item.avatar }} style={styles.petImage} />
                </TouchableOpacity>
            </View>
        )
    })

    const { name, email, phone, avatar } = info
    return (
        <Container>
            <DismissKeyboard>
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

                                <View style={styles.inputInformation}>
                                    <View style={styles.action}>
                                        <FontAwesome name="user-o" color={color.GRAY} size={22} />
                                        <TextInput
                                            placeholder="Name"
                                            value={name}
                                            placeholderTextColor={color.GRAY}
                                            onChangeText={(name) => handleChangeInfo('name', name)}
                                            style={styles.textInput}
                                        />
                                    </View>
                                    <View style={styles.action}>
                                        <Fontisto name="email" color={color.GRAY} size={22} />
                                        <TextInput
                                            placeholder="Email"
                                            value={email}
                                            placeholderTextColor={color.GRAY}
                                            onChangeText={(email) => handleChangeInfo('email', email)}
                                            style={styles.textInput}
                                        />
                                    </View>
                                    <View style={styles.action}>
                                        <Feather name="phone" color={color.GRAY} size={22} />
                                        <TextInput
                                            placeholder="Phone"
                                            keyboardType="numeric"
                                            value={phone}
                                            placeholderTextColor={color.GRAY}
                                            onChangeText={(phone) => handleChangeInfo('phone', phone)}
                                            style={styles.textInput}
                                        />
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.commandButton} onPress={_saveData}>
                                    <Text style={styles.panelButtonTitle}>Save</Text>
                                </TouchableOpacity>
                                <View style={styles.listPetWrapper}>
                                    <Text style={styles.text}>Your pets</Text>
                                    {
                                        _.isEmpty(dataPet) ?
                                            <View style={styles.emptyView}>
                                                <FontAwesome name="hand-o-down" size={25} color={color.BLUE} />
                                                <Text style={styles.emptyText}>Your Pet List is Empty</Text>
                                                <Text style={styles.emptyText2}>Pets added to your list will appear here.</Text>
                                            </View>
                                            :
                                            <FlatList
                                                style={styles.flatList}
                                                horizontal={true}
                                                data={dataPet}
                                                renderItem={({ item }) => {
                                                    return renderList(item)
                                                }}
                                                keyExtractor={(item, index) => index.toString()}
                                                refreshing={loading}
                                            />
                                    }
                                </View>
                                <TouchableOpacity
                                    style={styles.addButton}
                                    onPress={() => navigation.navigate('PetSetting')}
                                >
                                    <TouchableOpacity style={styles.add}>
                                        <MaterialIcons name="add" size={20} color={color.WHITE} />
                                    </TouchableOpacity>
                                    <Text style={styles.addTitle}>Add a new pet</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                }
            </DismissKeyboard>
        </Container>
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
        marginTop: 18,
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
        padding: 14,
        borderRadius: 10,
        backgroundColor: color.PINK,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        width: '90%',
        alignSelf: 'center'
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: color.WHITE,
    },
    addButton: {
        width: '90%',
        padding: 15,
        alignSelf: 'center',
        borderRadius: 10,
        backgroundColor: color.LIGHT_PINK,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        marginBottom: 15,
        flexDirection: 'row'
    },
    addTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: color.PINK,
    },
    add: {
        width: 22,
        height: 22,
        borderRadius: 25,
        backgroundColor: color.PINK,
        justifyContent: 'center',
        marginRight: 10,
        alignItems: 'center'
    },
    listPetWrapper: {
        height: 140,
        paddingTop: 20
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingLeft: 20
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
    emptyView: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    emptyText: {
        fontSize: 20,
        marginBottom: 5,
        marginTop: 5,
        color: color.GRAY,
        letterSpacing: 1.5
    },
    emptyText2: {
        color: color.GRAY
    },
    flatList: {
        paddingLeft: 10
    }
})

YellowBox.ignoreWarnings(['source.uri should not be an empty string']);

export default Profile;