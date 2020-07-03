import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native'
import { CheckBox } from 'react-native-elements'
import { color } from '../../../utility'
import { DismissKeyboard } from '../../../components'

const Feedback = ({ navigation }) => {
    const [checked1, setChecked1] = useState(false)
    const [checked2, setChecked2] = useState(false)
    const [checked3, setChecked3] = useState(false)
    const [feedback, setFeedback] = useState('')

    return (
        <DismissKeyboard>
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
                            onPress={() => setChecked1(!checked1)}
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
                            onPress={() => setChecked2(!checked2)}
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
                            onPress={() => setChecked3(!checked3)}
                        />
                        <Text style={styles.text}>Bug</Text>
                    </View>
                    <TextInput 
                        multiline
                        style={styles.textInput}
                        value={feedback}
                        onChangeText={setFeedback}
                    />
                    <TouchableOpacity style={styles.submit}>
                        <Text style={styles.textSubmit}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View> 
        </DismissKeyboard>
    )
}

const styles = StyleSheet.create({
    form: {
        paddingRight: 20,
        paddingLeft: 20,
        marginTop: 15,
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: color.LIGHT_GRAY,
        borderRadius: 5
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
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 5
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