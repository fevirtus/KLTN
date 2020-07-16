import React, { useState, useEffect } from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    TouchableOpacity, 
    Image, 
    FlatList, 
    ScrollView, 
    ImageBackground, 
    TextInput,
    YellowBox
} from 'react-native'
import ImagePicker from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { DismissKeyboard } from '../../../components'
import { RequestApiAsyncGet, RequestApiAsyncPost } from '../../../api/config'
import { Container, Loading } from '../../../components'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { color } from '../../../utility'
import { useDispatch } from 'react-redux';
import { saveUserInfo } from '../../../redux/actions/authActions';

const Profile = ({ navigation }) => {
    const [avatar, setAvatar] = useState(null)
    const [dataPet, setDataPet] = useState([])
    const [info, setInfo] = useState({
        name: '',
        email: '',
        phone: '',
    })
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()

    useEffect(() => {
        RequestApiAsyncGet('users/currentUser')
            .then(res => {
                console.log(res.data[0])
                // Set info
                setInfo(res.data[0])
                setLoading(false)
            }).catch(e => {
                console.log("Api call error!", e)
            })
    }, [200])

    useEffect(() => {
        RequestApiAsyncGet('pets')
            .then(res => {
                // Set data for pet
                console.log(res.data)
                setDataPet(res.data)
                setLoading(false)
            }).catch(e => {
                console.log("Api call error!", e)
            })
    }, [200])

    const _saveData = () => {
        const settings = {
            updateFields: {
                name: name,
                phone: phone,


                email: email,
            }
        }
        console.log(settings)
        RequestApiAsyncPost('users', 'PUT', {}, settings)
            .then((res) => {
                dispatch(saveUserInfo(res.data.data))
                alert('Save successful')
            }).catch((e) => {
                console.log("Api call error")
                alert(e.message)
            })
    }

    const handleChangeInfo = (type, value) => {
        setInfo({...info, [type]: value})
    }

    const handlePicker = () => {
        ImagePicker.showImagePicker({}, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } 
            const img = {
                uri: response.uri,
                type: response.type,
                name: 
                    response.fileName || 
                    response.uri.substr(response.uri.lastIndexOf('/') + 1)
            }
            setAvatar(img)
        });
    }

    const renderList = ((item) => {
        return (
            <View style={styles.petImageWrapper}>
                <TouchableOpacity onPress={() => navigation.navigate('PetProfile', {itemId: item.id})}>
                    {/* <Image source={{uri : item.uri}} style={styles.petImage} /> */}
                    <Text>{item.name}</Text>
                </TouchableOpacity>       
            </View> 
        )
    })

    const { name, email, phone } = info
    return (
        <DismissKeyboard>
            <Container>
            {/* {
                loading ? <Loading />
                :  */}
                <View style={styles.container}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <ImageBackground 
                            source={require('../../../../images/avatar.jpg')} 
                            style={styles.profilePicWrap} 
                            imageStyle={{ borderRadius: 100 }}
                        >
                            {avatar && (
                                <Image source={{uri: avatar.uri }} style={styles.profileImage} />
                            )}
                            <TouchableOpacity onPress={handlePicker} style={styles.camera}>
                                <MaterialIcons name="add-a-photo" size={22} color="#DFD8C8" />
                            </TouchableOpacity>
                        </ImageBackground> 

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
                            <View style={styles.menuListPet}> 
                                <Text style={styles.text}>List pet</Text>
                                <Text 
                                    style={[styles.text, {color: color.PINK}]}
                                    onPress={() => navigation.navigate('PetSetting')}
                                >
                                    Thêm thú cưng
                                </Text>
                            </View>  
                            <FlatList
                                style={styles.flatListPet}
                                horizontal={true}
                                data={dataPet}
                                renderItem={({item}) => {
                                    return renderList(item)
                                }}
                                keyExtractor={item => item.id}
                                refreshing={loading}
                            />
                        </View>
                    </ScrollView>
                </View>
            {/* } */}
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
        borderRadius: 100
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
    listPetWrapper: {
        height: 146,
        paddingTop: 16
    },
    menuListPet: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    text: {
        fontSize: 18
    },
    flatListPet: {
       backgroundColor: color.WHITE
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
})

YellowBox.ignoreWarnings(['VirtualizedLists should never be nested inside plain ScrollViews with the same', 
                            'orientation - use another VirtualizedList-backed container instead.']);

export default Profile;