import React, { useState } from 'react';
import {
    StyleSheet, View,
    Text, TouchableOpacity,
    TextInput, Modal
} from 'react-native'
import axios from 'axios'
import LottieView from 'lottie-react-native'
import { CheckBox } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { color } from '../../../utility'
import { Container } from '../../../components'
import { URL_BASE, token } from '../../../api/config';

const Feedback = ({ navigation }) => {
    const [checked1, setChecked1] = useState(false)
    const [checked2, setChecked2] = useState(false)
    const [checked3, setChecked3] = useState(false)
    const [feedback, setFeedback] = useState('')
    const [modalOpen, setModalOpen] = useState(false)

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
                setModalOpen(true)
                setFeedback('')
                setChecked1(false)
                setChecked2(false)
                setChecked3(false)
            })
            .catch(e => {
                console.log(e)
            })
    }

    return (
        <KeyboardAwareScrollView>
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

            <Modal visible={modalOpen} animationType='fade' transparent={true}>
                <View style={styles.modal}>
                    <View style={styles.modalView}>
                        <View style={styles.animation}>
                            <LottieView source={require('../../../utility/constants/success.json')} autoPlay loop />
                        </View>
                        <Text style={styles.textSuccess}>You have feedback successful!</Text>
                        <View style={styles.ok}>
                            <Text style={styles.okStyle} onPress={() => setModalOpen(false)}>OK</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        </KeyboardAwareScrollView>
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
    },
    // Modal noti
    modal: {
        flex: 1,
        backgroundColor: '#000000aa'
    },
    modalView: {
        backgroundColor: color.WHITE,
        marginHorizontal: 40,
        marginTop: '48%',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: 'center'
    },
    animation: {
        width: 100,
        height: 85
    },
    textSuccess: {
        paddingVertical: 10
    },
    ok: {
        backgroundColor: color.LIGHT_BLUE,
        paddingHorizontal: 22,
        paddingVertical: 8,
        borderRadius: 6
    },
    okStyle: {
        fontSize: 16,
        color: color.WHITE
    }
})

export default Feedback