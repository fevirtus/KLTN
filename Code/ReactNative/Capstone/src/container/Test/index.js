import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, Text } from 'react-native'
import { TextInput, Subheading } from 'react-native-paper'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'

export default function Test() {
    const [name, setName] = useState('Alex')
    const [breed, setBreed] = useState('Pitbull')
    const [age, setAge] = useState('2')
    const [showModal, setShowModal] = useState(false)

    const handleChangeName = text => {
        setName(text)
    }

    const handleChangeBreed = text => {
        setBreed(text)
    }

    const handleChangeAge = text => {
        setAge(text)
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
                            <Subheading style={styles.subheading}>Edit Profile</Subheading>
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
                                label="Age"
                                value={age}
                                onChangeText={handleChangeAge}
                            />
                            <TouchableOpacity style={styles.saveButton} onPress={() => setShowModal(false)}>
                                <Text style={styles.textButton}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>  
                </View>
            </Modal>

            <Ionicons 
                name="ios-add"
                size={25}
                onPress={() => setShowModal(true)}
            />
            <Text>{name}</Text> 
            <Text>{breed}</Text> 
            <Text>{age}</Text> 
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalContent: {
        backgroundColor: '#000000aa',
        flex: 1
    },
    form: {
        backgroundColor: '#fff',
        flex: 1,
        borderRadius: 15,
        marginTop: 120,
        marginBottom: 120,
        marginLeft: 50,
        marginRight: 50,
        paddingTop: 40,
        paddingBottom: 40,
        paddingLeft: 40,
        paddingRight: 40
    },
    close: {
        alignSelf: 'flex-end'
    },
    content: {
        paddingTop: 30
    },
    subheading: {
        fontSize: 22,
        fontWeight: '700',
        paddingBottom: 15
    },
    textInput: {
        paddingBottom: 8
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
    }
})