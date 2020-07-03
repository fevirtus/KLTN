import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { color } from '../../../utility'
import { Slider } from 'react-native-elements';

var gender = [
    { label: 'Male', value: 0 },
    { label: 'Female', value: 1 }
]

const Filter = ({ navigation }) => {
    const [distance, setDistance] = useState(0)

    return (
        <View>
            <View style={styles.form}>
                <RadioForm 
                    style={styles.radioForm}
                    radio_props={gender}
                    initial={0}
                    buttonSize={24}
                    selectedButtonColor={color.PINK}
                    buttonColor={color.PINK}
                    labelStyle={{fontSize: 17}}
                    onPress={(value) => {}}
                />
                <Text style={styles.textDistance}>Distance ({distance} KM) </Text>
                <Slider
                    minimumValue={0}
                    maximumValue={100}
                    step={1}
                    value={distance}
                    onValueChange={(val) => {setDistance(val)}}
                />
                <TouchableOpacity style={styles.submit} onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.textSubmit}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
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
    radioForm: {
        paddingTop: 25,
    },
    textDistance: {
        paddingTop: 5,
        fontSize: 18,
        textAlign: 'center'
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

export default Filter