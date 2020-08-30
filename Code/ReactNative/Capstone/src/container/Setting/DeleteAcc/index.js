import React, { useState } from 'react';
import {
    View, Text,
    StyleSheet,
    TouchableOpacity,
    Modal, Dimensions
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { color } from '../../../utility';
import { Container } from '../../../components';
import auth from '@react-native-firebase/auth'
import Axios from 'axios';
import { URL_BASE, token } from '../../../api/config';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/actions/loadingAction';
import { clearToken } from '../../../redux/actions/tokenAction';
import { clearAuth } from '../../../redux/actions/authActions';
import { LoginManager } from 'react-native-fbsdk';
import { GoogleSignin } from '@react-native-community/google-signin';
import { deleteUser } from '../../../network';
import { uuid } from '../../../utility/constants';

const DeleteAcc = ({ navigation }) => {
    const [modalOpen, setModalOpen] = useState(false)
    const dispatch = useDispatch()

    const deleteAccount = async () => {
        setModalOpen(false)
        dispatch(startLoading())
        if (auth().currentUser && auth().currentUser.providerData.providerId == 'facebook.com') {
            await LoginManager.logOut().then(() => { console.log('Logout') }).catch(e => console.log('ERROR FB logout()', e))
        } else {
            await GoogleSignin.signOut().then(() => { console.log('Logout') }).catch(e => console.log('ERROR GG logout()', e))
        }
        //delete user in firebase 
        deleteUser(uuid).then().catch(e => console.log('ERROR deleteUser()', e))

        //delete user in db
        deleteInDB()
            .then(res => {
                console.log(res.data)
                return auth().currentUser.delete()
            })
            .then(() => {
                dispatch(clearToken())
                dispatch(clearAuth())
                dispatch(stopLoading())
            })
            .catch(e => {
                dispatch(stopLoading())
                console.log(e)
            })
    }

    const deleteInDB = async () => {
        try {
            return await Axios.put(`${URL_BASE}users`, {
                updateFields: {
                    is_delete: 1
                }
            }, { headers: { Authorization: token } })
        } catch (error) {
            throw error
        }
    }


    return (
        <Container>
            <View style={styles.iconWrapper}>
                <AntDesign name="pausecircle" size={32} color={color.PINK} />
                <Text style={styles.txtPause}>PAUSE MY ACCOUNT</Text>
                <Text style={styles.txtDescription}>If you'd like to keep your account but not be shown to others
                you can pause your account instead. You can turn off in settings.
                </Text>
                {/* <TouchableOpacity onPress={() => navigation.navigate('SettingStackScreen', { screen: 'Privacy' })}>
                    <LinearGradient colors={['#ffe4e4', '#ffa5b0', '#fe91ca']} style={styles.commandButton}>
                        <Text style={styles.panelButtonTitle}>PAUSE MY ACCOUNT</Text>
                    </LinearGradient>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => setModalOpen(true)}>
                    <LinearGradient colors={['#ffe4e4', '#ffa5b0', '#fe91ca']} style={styles.commandButton}>
                        <Text style={styles.panelButtonTitle}>DELETE ACCOUNT</Text>
                    </LinearGradient>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => setModalOpen(true)}>
                    <Text style={styles.txtDel}>Delete My Account {">"}</Text>
                </TouchableOpacity> */}
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
                        {/* <TouchableOpacity
                            style={[styles.btn, { marginTop: 24 }]}
                            onPress={() => {
                                setModalOpen(false)
                                navigation.navigate('Privacy')
                            }}
                        >
                            <Text style={styles.text}>HIDE MY ACCOUNT</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity style={styles.btn} onPress={deleteAccount}>
                            <Text style={styles.text}>DELETE</Text>
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
        width: 320,
        alignSelf: 'center',
        borderRadius: 25,
        padding: 14,
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