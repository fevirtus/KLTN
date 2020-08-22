import React, { useState } from 'react';
import {
    View, Text,
    StyleSheet,
    TouchableOpacity,
    Modal, Dimensions
} from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { color } from '../../../utility';
import { Container } from '../../../components';

const DeleteAcc = ({ navigation }) => {
    const [modalOpen, setModalOpen] = useState(false)

    return (
        <Container>
            <View style={styles.iconWrapper}>
                <AntDesign name="pausecircle" size={32} color={color.PINK} />
                <Text style={styles.txtPause}>PAUSE MY ACCOUNT</Text>
                <Text style={styles.txtDescription}>If you'd like to keep your account but not be shown to others
                you can pause your account instead. You can turn off in settings.
                </Text>
                <TouchableOpacity style={styles.commandButton} onPress={() => navigation.navigate('Privacy')}>
                    <Text style={styles.panelButtonTitle}>PAUSE MY ACCOUNT</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalOpen(true)}>
                    <Text style={styles.txtDel}>Delete My Account {">"}</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={modalOpen} animationType='fade' transparent={true}>
                <View style={styles.modal}>
                    <View style={styles.modalContent}>
                        <Text style={styles.txtCf}>Are you sure?</Text>
                        <Text style={[styles.txtDes, { paddingTop: 12 }]}>
                            If you delete your account, you wil lose your profile, messages, photos,
                            and matches permanently. This cannot be undone.
                        </Text>
                        <Text style={styles.txtDes}>
                            If you'd rather keep your account but not be shown to others you can hide your
                            account instead. You can turn this off in settings.
                        </Text>
                        <Text style={styles.txtDes}>
                            Are you sure you want to delete your account?
                        </Text>
                        <TouchableOpacity
                            style={[styles.btn, { marginTop: 24 }]}
                            onPress={() => navigation.navigate('Privacy')}
                        >
                            <Text style={styles.text}>HIDE MY ACCOUNT</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn}>
                            <Text style={styles.text}>DELETE MY ACCOUNT</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancel} onPress={() => setModalOpen(false)}>
                            <Text style={styles.txtCancel}>CANCEL</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </Container>
    )
}

const styles = StyleSheet.create({
    iconWrapper: {
        alignItems: 'center',
        paddingTop: '40%'
    },
    txtPause: {
        fontWeight: 'bold',
        fontSize: 18,
        paddingTop: 8
    },
    txtDescription: {
        color: color.GRAY,
        width: '75%',
        textAlign: 'center',
        paddingTop: 5
    },
    commandButton: {
        width: '90%',
        alignSelf: 'center',
        borderRadius: 25,
        padding: 14,
        backgroundColor: color.PINK,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '42%',
        marginBottom: 20,
    },
    panelButtonTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: color.WHITE,
    },
    txtDel: {
        color: color.GRAY,
        fontSize: 16,
        letterSpacing: 1.1
    },
    modal: {
        flex: 1,
        backgroundColor: '#000000aa'
    },
    modalContent: {
        backgroundColor: color.WHITE,
        marginHorizontal: 40,
        marginTop: '20%',
        paddingHorizontal: 20,
        paddingTop: 15,
        borderRadius: 8,
        alignItems: 'center'
    },
    txtCf: {
        fontWeight: 'bold',
        fontSize: 19
    },
    txtDes: {
        color: color.GRAY,
        fontSize: 17,
        textAlign: 'center',
        paddingTop: 20
    },
    btn: {
        color: color.PINK,
        borderTopWidth: 1,
        borderTopColor: color.LIGHT_LIGHT_GRAY,
        paddingVertical: 15,
        width: Dimensions.get('screen').width - 80,
        alignItems: 'center',
    },
    text: {
        color: color.PINK,
        fontSize: 16,
        fontWeight: 'bold'
    },
    cancel: {
        backgroundColor: color.PINK,
        padding: 15,
        width: Dimensions.get('screen').width - 80,
        alignItems: 'center',
        borderBottomStartRadius: 8,
        borderBottomEndRadius: 8
    },
    txtCancel: {
        color: color.WHITE,
        fontWeight: 'bold',
        fontSize: 16
    }
})

export default DeleteAcc