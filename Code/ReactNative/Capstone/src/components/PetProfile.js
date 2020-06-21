import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native'
import { Title, Subheading, Text, TextInput } from 'react-native-paper'
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'

const colors = {
    orange: '#ff7315',
    pink: '#FF82A9',
    white: '#fff',
    grey: 'grey'
}

export default function PetProfile() {
    const [name, setName] = useState('Charley')
    const [breed, setBreed] = useState('Pitbull')
    const [gender, setGender] = useState('Male')
    const [weight, setWeight] = useState('5')
    const [age, setAge] = useState('2')
    const [city, setCity] = useState('HaNoi')

    const [showModal, setShowModal] = useState(false)

    const handleChangeName = text => {
        setName(text)
    }

    const handleChangeBreed = text => {
        setBreed(text)
    }

    const handleChangeGender = text => {
        setGender(text)
    }

    const handleChangeWeight = text => {
        setWeight(text)
    }

    const handleChangeAge = text => {
        setAge(text)
    }

    const handleChangeCity = text => {
        setCity(text)
    }

    return (
        <View style={styles.container}>
            <Modal 
                visible={showModal} 
                animationType='slide'
                transparent={true}
            >
                <View style={styles.modalContent}>
                    <View style={styles.form}>
                        <AntDesign 
                            style={styles.close}
                            name="closecircleo"
                            size={32}
                            onPress={() => setShowModal(false)}
                        />
                        <View style={styles.content}>
                            <Subheading style={styles.subheadingModal}>Edit Profile</Subheading>
                            <TextInput 
                                style={styles.textInput}
                                mode="outlined"
                                label="Name"
                                value={name}
                                onChangeText={handleChangeName}
                            />
                            <TextInput 
                                style={styles.textInput}
                                mode="outlined"
                                label="Breed"
                                value={breed}
                                onChangeText={handleChangeBreed}
                            />
                            <TextInput 
                                style={styles.textInput}
                                mode="outlined"
                                label="Gender"
                                value={gender}
                                onChangeText={handleChangeGender}
                            />
                            <TextInput 
                                style={styles.textInput}
                                mode="outlined"
                                label="Weight"
                                value={weight}
                                onChangeText={handleChangeWeight}
                            />
                            <TextInput 
                                style={styles.textInput}
                                mode="outlined"
                                label="Age"
                                value={age}
                                onChangeText={handleChangeAge}
                            />
                            <TextInput 
                                style={styles.textInput}
                                mode="outlined"
                                label="City"
                                value={city}
                                onChangeText={handleChangeCity}
                            />
                            <TouchableOpacity style={styles.saveButton} onPress={() => setShowModal(false)}>
                                <Text style={styles.textButton}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>  
                </View>
            </Modal>

            <View style={styles.header}>
                <Text style={styles.title}>MY PETPROFILE</Text>
                <Image source={require('../../images/users/2.jpg')} style={styles.img}/>
                <TouchableOpacity 
                    style={styles.buttonEdit} 
                    onPress={() => setShowModal(true)}
                >
                    <Entypo name="edit" size={25} color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <View style={styles.navbar}>
                    <Title style={styles.titleNav}>PET</Title>
                    <View style={styles.horizontalLine}></View>
                </View>
                <View style={styles.information}>
                    <View style={styles.contentLeft}>
                        <View style={styles.item}>
                            <Subheading style={styles.subheading}>Name</Subheading>
                            <Text style={styles.text}>{name}</Text>
                        </View>
                        <View style={styles.item}>
                            <Subheading style={styles.subheading}>Breed</Subheading>
                            <Text style={styles.text}>{breed}</Text>
                        </View>
                        <View style={styles.item}>
                            <Subheading style={styles.subheading}>Gender</Subheading>
                            <Text style={styles.text}>{gender}</Text>
                        </View>  
                    </View>
                    <View style={styles.contentRight}>
                        <View style={styles.item}>
                            <Subheading style={styles.subheading}>Weight</Subheading>
                            <Text style={styles.text}>{weight} kg</Text>
                        </View> 
                        <View style={styles.item}>
                            <Subheading style={styles.subheading}>Age</Subheading>
                            <Text style={styles.text}>{age}</Text>
                        </View> 
                        <View style={styles.item}>
                            <Subheading style={styles.subheading}>City</Subheading>
                            <Text style={styles.text}>{city}</Text>
                        </View> 
                    </View>
                </View>
            </View>
        </View>
    )
}

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
        backgroundColor: '#fff',
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
        borderColor: 'gray',
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
        backgroundColor: colors.pink,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 38,
        color: colors.white,
        fontWeight: '700',
        letterSpacing: 1.5
    },
    img: {
        width: 110,
        height: 110,
        borderRadius: 100,
        borderWidth: 4,
        borderColor: colors.white,
        position: 'absolute',
        top: 146
    },
    buttonEdit: {
        position: 'absolute',
        top: 180,
        right: 40,
        borderRadius: 50,
        backgroundColor: colors.orange,
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
        color: colors.pink,
        fontSize: 22
    },
    horizontalLine: {
        borderBottomColor: 'black',
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
        color: colors.pink
    },
    text: {
        fontSize: 18,
        color: colors.grey
    }
})