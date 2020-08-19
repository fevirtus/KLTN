import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native'
import axios from 'axios'
import { CheckBox } from 'react-native-elements'
import { color } from '../../../utility'
import { DismissKeyboard, Container } from '../../../components'
import { URL_BASE, token } from '../../../api/config';

const Feedback = ({ navigation }) => {
    const [checked1, setChecked1] = useState(false)
    const [checked2, setChecked2] = useState(false)
    const [checked3, setChecked3] = useState(false)
    const [feedback, setFeedback] = useState('')

    const onePressed = () => {
        setChecked1(true)
        setChecked2(false)
        setChecked3(false)
    }

    const twoPressed = () => {
        setChecked1(false)
        setChecked2(true)
        setChecked3(false)
    }

    const threePressed = () => {
        setChecked1(false)
        setChecked2(false)
        setChecked3(true)
    }

    const handleSubmit = () => {
        axios.post(`${URL_BASE}users/feedback`, {
            content: feedback
        }, { headers: { Authorization: token } })
            .then(res => {
                console.log(res)
            })
            .catch(e => {
                console.log(e)
            })
    }

    return (
        <DismissKeyboard>
            <Container>
                <View style={styles.container}>
                    <View style={styles.form}>
                        <View style={styles.checkbox}>
                            <CheckBox
                                size={35}
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                checkedColor={color.PINK}
                                uncheckedColor={color.PINK}
                                checked={checked1}
                                onPress={onePressed}
                            />
                            <Text style={styles.text}>Suggestion</Text>
                        </View>
                        <View style={styles.checkbox}>
                            <CheckBox
                                size={35}
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                checkedColor={color.PINK}
                                uncheckedColor={color.PINK}
                                checked={checked2}
                                onPress={twoPressed}
                            />
                            <Text style={styles.text}>Complain</Text>
                        </View>
                        <View style={styles.checkbox}>
                            <CheckBox
                                size={35}
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                checkedColor={color.PINK}
                                uncheckedColor={color.PINK}
                                checked={checked3}
                                onPress={threePressed}
                            />
                            <Text style={styles.text}>Bug</Text>
                        </View>
                        <TextInput
                            multiline
                            style={styles.textInput}
                            value={feedback}
                            onChangeText={setFeedback}
                        />
                        <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
                            <Text style={styles.textSubmit}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Container>
        </DismissKeyboard>
    )
}

const styles = StyleSheet.create({
    form: {
        paddingHorizontal: 20,
        marginTop: 20,
        marginHorizontal: 15
    },
    checkbox: {
        flexDirection: 'row',
        marginBottom: -10,
        marginLeft: -20
    },
    text: {
        alignSelf: 'center',
        fontSize: 18,
        marginLeft: -15
    },
    textInput: {
        height: 150,
        backgroundColor: color.WHITE,
        padding: 20,
        borderRadius: 5,
        marginTop: 18,
        textAlignVertical: 'top'
    },
    submit: {
        height: 48,
        backgroundColor: color.PINK,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 12,
        borderRadius: 8
    },
    textSubmit: {
        fontSize: 18,
        color: color.WHITE,
        fontWeight: '700'
    }
})

export default Feedback