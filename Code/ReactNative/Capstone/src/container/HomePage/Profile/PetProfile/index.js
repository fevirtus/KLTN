import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Modal, Keyboard, Text, TextInput } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { color } from '../../../../utility';
import { RequestApiAsyncGet } from '../../../../api/config'

const PetProfile = ({ route }) => {
    const { itemId } = route.params;
    const [showModal, setShowModal] = useState(false)
    const [info, setInfo] = useState({
        name: '',
        breed: '',
        gender: '',
        weight: '',
        age: '',
        introduction: ''
    })

    const handleChangeInfo = (type, value) => {
        setInfo({...info, [type]: value})
    }

    useEffect(() => {
        RequestApiAsyncGet(`pets/${itemId}`)
            .then(res => {
                // Set info
                setInfo(res.data[0])
                // setLoading(false)
            }).catch(e => {
                console.log("Api call error!", e)
            })
    }, [200])

    const { name, breed, gender, weight, age, introduction } = info
    return (
        <View style={styles.container}>
            <Modal 
                visible={showModal} 
                animationType='slide'
                transparent={true}
            >
                <KeyboardAwareScrollView onPress={() => Keyboard.dismiss()}>
                    <View style={styles.modalContent}>
                        <View style={styles.form}>
                            <AntDesign 
                                style={styles.close}
                                name="closecircleo"
                                size={32}
                                onPress={() => setShowModal(false)}
                            />
                            <View style={styles.content}>
                                <Text style={styles.subheadingModal}>Edit Profile</Text>
                                <TextInput 
                                    style={styles.textInput}
                                    mode="outlined"
                                    label="Name"
                                    value={name}
                                    onChangeText={(name) => handleChangeInfo('name', name)}
                                />
                                <TextInput 
                                    style={styles.textInput}
                                    mode="outlined"
                                    label="Breed"
                                    value={breed}
                                    onChangeText={(breed) => handleChangeInfo('breed', breed)}
                                />
                                <TextInput 
                                    style={styles.textInput}
                                    mode="outlined"
                                    label="Gender"
                                    value={gender}
                                    onChangeText={(gender) => handleChangeInfo('gender', gender)}
                                />
                                <TextInput 
                                    style={styles.textInput}
                                    mode="outlined"
                                    label="Weight"
                                    value={weight}
                                    onChangeText={(weight) => handleChangeInfo('weight', weight)}
                                />
                                <TextInput 
                                    style={styles.textInput}
                                    mode="outlined"
                                    label="Age"
                                    value={age}
                                    onChangeText={(age) => handleChangeInfo('age', age)}
                                />
                                <TextInput 
                                    style={styles.textInput}
                                    mode="outlined"
                                    label="Introduction"
                                    value={introduction}
                                    onChangeText={(introduction) => handleChangeInfo('introduction', introduction)}
                                />
                                <TouchableOpacity style={styles.saveButton} onPress={() => setShowModal(false)}>
                                    <Text style={styles.textButton}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>  
                    </View>
                </KeyboardAwareScrollView>
            </Modal>   

            <View style={styles.header}>
                <Text style={styles.title}>MY PETPROFILE</Text>
                <Image source={require('../../../../../images/users/2.jpg')} style={styles.img}/>
                <TouchableOpacity 
                    style={styles.buttonEdit} 
                    onPress={() => setShowModal(true)}
                >
                    <Entypo name="edit" size={25} color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <View style={styles.navbar}>
                    <Text style={styles.titleNav}>PET</Text>
                    <View style={styles.horizontalLine}></View>
                </View>
                <View style={styles.information}>
                    <View style={styles.contentLeft}>
                        <View style={styles.item}>
                            <Text style={styles.subheading}>Name</Text>
                            <Text style={styles.text}>{name}</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.subheading}>Breed</Text>
                            <Text style={styles.text}>{breed}</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.subheading}>Gender</Text>
                            <Text style={styles.text}>{gender}</Text>
                        </View>  
                    </View>
                    <View style={styles.contentRight}>
                        <View style={styles.item}>
                            <Text style={styles.subheading}>Weight</Text>
                            <Text style={styles.text}>{weight} kg</Text>
                        </View> 
                        <View style={styles.item}>
                            <Text style={styles.subheading}>Age</Text>
                            <Text style={styles.text}>{age}</Text>
                        </View> 
                        <View style={styles.item}>
                            <Text style={styles.subheading}>Introduction</Text>
                            <Text style={styles.text}>{introduction}</Text>
                        </View> 
                    </View>
                </View>
            </View>
        </View>
    )
}

export default PetProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    //Modal
    modalContent: {
        backgroundColor: '#000000aa',
        flex: 1
    },
    form: {
        backgroundColor: color.WHITE,
        flex: 1,
        borderRadius: 15,
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 40,
        marginRight: 40,
        paddingTop: 40,
        paddingBottom: 40,
        paddingLeft: 40,
        paddingRight: 40
    },
    close: {
        alignSelf: 'flex-end'
    },
    content: {
        paddingTop: 20
    },
    subheadingModal: {
        fontSize: 22,
        fontWeight: '700',
        paddingBottom: 15
    },
    textInput: {
        paddingBottom: 5
    },
    saveButton: {
        borderWidth: 1,
        borderColor: color.GRAY,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    textButton: {
        fontSize: 18,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 5
    },
    //Content
    header: {
        flex: 1,
        backgroundColor: color.PINK,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 38,
        color: color.WHITE,
        fontWeight: '700',
        letterSpacing: 1.5
    },
    img: {
        width: 110,
        height: 110,
        borderRadius: 100,
        borderWidth: 4,
        borderColor: color.WHITE,
        position: 'absolute',
        top: 146
    },
    buttonEdit: {
        position: 'absolute',
        top: 180,
        right: 40,
        borderRadius: 50,
        backgroundColor: color.ORANGE,
        width: 38,
        height: 38,
        alignItems: 'center',
        justifyContent: 'center'
    },
    content: {
        flex: 2,
    },
    navbar: {
        paddingTop: 80,
        paddingLeft: 45,
        flexDirection: 'row'
    },
    titleNav: {
        fontWeight: '700',
        color: color.PINK,
        fontSize: 22
    },
    horizontalLine: {
        borderBottomColor: color.BLACK,
        borderBottomWidth: 1,
        width: '72%',
        marginBottom: 5,
        marginLeft: 12
    },
    information: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 32
    },
    contentLeft: {
        width: '50%',
        paddingLeft: 45
    },
    contentRight: {
        width: '50%',
        paddingLeft: 20
    },
    item: {
        paddingBottom: 28
    },
    subheading: {
        fontSize: 18,
        color: color.PINK
    },
    text: {
        fontSize: 18,
        color: color.GRAY
    }
})