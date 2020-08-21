import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Text,
    Alert,
    FlatList,
    ImageBackground
} from 'react-native'
import axios from 'axios'
import { ScrollView } from 'react-native-gesture-handler';
import _ from 'lodash'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { color } from '../../../../utility';
import { URL_BASE, token } from '../../../../api/config'
import { useDispatch } from 'react-redux';
import { deletePet } from '../../../../redux/actions/authActions';
import { startLoading, stopLoading } from '../../../../redux/actions/loadingAction';
import { convertToAge } from '../../../../network';

const PetProfile = ({ navigation, route }) => {
    const { petId } = route.params;
    const [info, setInfo] = useState({
        name: '',
        gender: '',
        weight: '',
        age: '',
        avatar: '',
        introduction: '',
        is_active: '',
        breed_name: '',
        pictures: []
    })
    const dispatch = useDispatch()

    const getPet = () => {
        dispatch(startLoading())
        axios.get(`${URL_BASE}pets/${petId}`, {
            headers: {
                Authorization: token
            }
        }).then(res => {
            // Set info
            setInfo(res.data)
            setLoading(false)
            dispatch(stopLoading())
        }).catch(e => {
            console.log("Api call error!", e)
            dispatch(stopLoading())
        })
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getPet()
        });
        return unsubscribe;
    }, [navigation, petId])

    const _delete = async () => {
        dispatch(startLoading())
        axios.delete(`${URL_BASE}pets/${petId}`, { headers: { Authorization: token } })
            .then(res => {
                dispatch(deletePet(petId))
                dispatch(stopLoading())
                navigation.goBack()
            })
            .catch(e => {
                console.log(e)
                dispatch(stopLoading())
            })
    }

    const _deletePet = () => {
        Alert.alert(
            `Delete ${name}?`,
            `Are you sure to delete ${name}?`,
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('User cancel delete!'),
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: _delete
                }
            ],
            { cancelable: false }
        )
    }

    const onEditPet = () => {
        navigation.navigate('EditPetProfile', { petInfo: info, petId: petId })
    }

    const renderList = ((item) => {
        return (
            <View style={styles.petImageWrapper}>
                <Image
                    source={{ uri: item }}
                    style={styles.petImage}
                />
            </View>
        )
    })

    const { name, gender, weight, age, introduction, avatar, breed_name, pictures } = info
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ImageBackground
                    style={styles.header}
                    source={avatar ? { uri: avatar } : require('../../../../../images/no-image.jpg')}
                >
                </ImageBackground>
                <View style={styles.content}>
                    <View style={styles.petName}>
                        <View style={{ flex: 2 }}>
                            <Text style={styles.name}>{name}</Text>
                            <Text style={styles.text}>{breed_name}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity
                                style={[styles.buttonEdit, { marginRight: 10 }]}
                                onPress={onEditPet}
                            >
                                <FontAwesome name="edit" size={22} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonDelete}
                                onPress={_deletePet}
                            >
                                <FontAwesome5 name="trash" size={22} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.information}>
                        <View style={styles.item}>
                            <Text style={styles.subheading}>Weight</Text>
                            <Text style={styles.text}>{weight} kg</Text>
                        </View>
                        <View style={styles.itemCenter}>
                            <Text style={styles.subheading}>Gender</Text>
                            <Text style={styles.text}>{gender === 1 ? 'Male' : 'Female'}</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.subheading}>Age</Text>
                            <Text style={styles.text}>{convertToAge(age)}</Text>
                        </View>
                    </View>
                    {
                        _.isEmpty(introduction)
                            ? null
                            : <View style={styles.about}>
                                <Text style={styles.subheading}>About</Text>
                                <Text style={[styles.text, { paddingLeft: 0 }]}>{introduction}</Text>
                            </View>
                    }
                    {
                        _.isEmpty(pictures)
                            ? <View style={styles.emptyPic}></View>
                            : <View style={styles.listImg}>
                                <FlatList
                                    horizontal={true}
                                    data={pictures}
                                    renderItem={({ item }) => {
                                        return renderList(item)
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>
                    }
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 225
    },
    content: {
        flexDirection: 'column',
        paddingHorizontal: 30
    },
    petName: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        flex: 1
    },
    name: {
        fontSize: 28,
        color: color.BLACK,
        fontWeight: "bold"
    },
    information: {
        marginTop: 25,
        backgroundColor: color.PET_DESCRIPTION,
        flexDirection: 'row',
        borderRadius: 30,
        justifyContent: 'space-between',
        paddingVertical: 15
    },
    item: {
        alignItems: 'center',
        width: '33.33%',
    },
    itemCenter: {
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: color.GRAY,
        borderLeftWidth: 1,
        borderLeftColor: color.GRAY,
        width: '35%'
    },
    subheading: {
        fontSize: 18,
        color: color.PINK,
        fontWeight: 'bold'
    },
    text: {
        fontSize: 18,
        color: color.GRAY
    },
    about: {
        borderWidth: 0.6,
        borderColor: color.LIGHT_GRAY,
        padding: 10,
        borderRadius: 12,
        marginVertical: 15
    },
    listImg: {
        // height: 100,
        alignItems: 'center',
        // paddingHorizontal: 20
    },
    emptyPic: {
        height: 15
    },
    petImageWrapper: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 10,
    },
    petImage: {
        height: 200,
        width: 150,
        borderRadius: 20,
        borderWidth: 3,
    },
    buttonDelete: {
        borderRadius: 50,
        backgroundColor: color.PINK,
        width: 38,
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    buttonEdit: {
        borderRadius: 50,
        backgroundColor: color.PINK,
        width: 38,
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5
    },
    commandButton: {
        padding: 14,
        borderRadius: 25,
        backgroundColor: color.PINK,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        alignSelf: 'center',
        marginVertical: 10
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: color.WHITE,
    }
})

export default PetProfile;