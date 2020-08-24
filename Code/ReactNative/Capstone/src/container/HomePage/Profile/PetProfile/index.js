import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Text,
    Modal,
    FlatList,
    ImageBackground
} from 'react-native'
import axios from 'axios'
import { ScrollView } from 'react-native-gesture-handler';
import _ from 'lodash'
import LottieView from 'lottie-react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { color } from '../../../../utility';
import { URL_BASE, token } from '../../../../api/config'
import { useDispatch } from 'react-redux';
import { deletePet } from '../../../../redux/actions/authActions';
import { startLoading, stopLoading } from '../../../../redux/actions/loadingAction';
import { convertToAge } from '../../../../network';
import { Loading } from '../../../../components';

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
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)

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
            {
                loading ? <Loading />
                    : <ScrollView showsVerticalScrollIndicator={false}>
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
                                        onPress={() => setModalOpen(true)}
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
            }
            <Modal visible={modalOpen} animationType='fade' transparent={true}>
                <View style={styles.modal}>
                    <View style={styles.modalContent}>
                        <View style={styles.animation}>
                            <LottieView source={require('../../../../utility/constants/error.json')} autoPlay loop />
                        </View>
                        <Text style={styles.txtCf}>Delete {name}?</Text>
                        <Text style={styles.txtDes}>
                            Are you sure you want to delete this pet?
                        </Text>
                        <View style={styles.groupBtn}>
                            <TouchableOpacity style={styles.btn} onPress={() => setModalOpen(false)}>
                                <Text style={styles.txt}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, { backgroundColor: color.RED }]} onPress={_delete}>
                                <Text style={styles.txt}>DELETE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        height: 240
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
        backgroundColor: '#e1f2fb',
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
        alignItems: 'center'
    },
    emptyPic: {
        height: 15
    },
    petImageWrapper: {
        margin: 10,
        paddingBottom: 10
    },
    petImage: {
        height: 110,
        width: 100,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: color.LIGHT_PINK
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
    // Modal
    modal: {
        flex: 1,
        backgroundColor: '#000000aa'
    },
    modalContent: {
        backgroundColor: color.WHITE,
        marginHorizontal: 40,
        marginTop: '50%',
        paddingHorizontal: 30,
        paddingTop: 20,
        paddingBottom: 12,
        borderRadius: 8,
        alignItems: 'center'
    },
    animation: {
        width: 80,
        height: 60
    },
    txtCf: {
        fontWeight: 'bold',
        fontSize: 18,
        paddingTop: 12
    },
    txtDes: {
        paddingTop: 5
    },
    groupBtn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        paddingTop: 20
    },
    btn: {
        backgroundColor: color.LIGHT_GRAY,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 6
    },
    txt: {
        color: color.WHITE
    }
})

export default PetProfile;