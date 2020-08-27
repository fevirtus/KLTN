import React, { useState } from 'react';
import {
    View, StyleSheet,
    Text, Image,
    TouchableOpacity,
    Modal,
    ScrollView,
} from 'react-native'
import LottieView from 'lottie-react-native'
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import axios from 'axios'
import { Container } from '../../../../components'
import { color } from '../../../../utility'
import { uploadImgToServer2 } from '../../../../network';
import { URL_BASE, token } from '../../../../api/config'
import { useDispatch } from 'react-redux';
import { stopLoading, startLoading } from '../../../../redux/actions/loadingAction';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { saveVip } from '../../../../redux/actions/vipAction';

const Banking = ({ navigation }) => {
    const [image, setImage] = useState('')
    const [isChange, setIsChange] = useState(false)
    const [uploadImg, setUploadImg] = useState({
        img: null
    });
    const [modalOpen, setModalOpen] = useState(false)
    const [check, setCheck] = useState(0)
    const VIP_TERM = ['1M', '3M', '1Y']
    const [vipTerm, setVipTerm] = useState(VIP_TERM[0])
    const dispatch = useDispatch()

    const handlePicker = () => {
        let options = {
            title: 'Select Image',
            noData: true,
            maxWidth: 500,
            maxHeight: 500,
        };
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else {
                const img = {
                    uri: response.uri,
                    type: 'image/jpeg',
                    name:
                        response.fileName ||
                        response.uri.substr(response.uri.lastIndexOf('/') + 1)
                }
                console.log(img.uri)
                setUploadImg({ img: img });
                setImage(img.uri)
                setIsChange(true)
            }
        });
    }

    const upgradePremium = async () => {
        try {
            dispatch(startLoading())
            const uploadedImg = await uploadImgToServer2(uploadImg)
            axios.post(`${URL_BASE}users/toPremium`, {
                confirm_img: uploadedImg,
                vip_term: vipTerm
            }, { headers: { Authorization: token } })
                .then(res => {
                    console.log('DATE', res.data)
                    const vip = {
                        vip: 0,
                        status: 'PROCESS'
                    }
                    dispatch(saveVip(vip))
                    dispatch(stopLoading())
                    setIsChange(false)
                    setModalOpen(true)
                })
                .catch(error => {
                    dispatch(stopLoading())
                });
        } catch (e) {
            dispatch(stopLoading())
            alert(e)
        }
    }

    return (
        <Container>
            <ScrollView>
                <Text style={styles.title}>Transfer to pay</Text>
                <Text style={styles.title2}>Chuyển khoản tới STK này để nâng cấp Premium.</Text>
                <View style={styles.information}>
                    <View style={styles.left}>
                        <Text style={styles.text}>Chủ TK:</Text>
                        <Text style={styles.text}>STK:</Text>
                        <Text style={styles.text}>Ngân hàng:</Text>
                    </View>
                    <View style={styles.right}>
                        <Text style={styles.text}>Nguyễn Hoàng Phong</Text>
                        <Text style={styles.text}>012345678903</Text>
                        <Text style={styles.text}>Vietcombank</Text>
                    </View>
                </View>
                <Text style={styles.plan}>Choose your plan</Text>
                <View style={styles.vipTerm}>
                    <TouchableOpacity
                        style={styles.vipItem}
                        onPress={() => {
                            setCheck(0)
                            setVipTerm(VIP_TERM[0])
                        }}
                    >
                        <Ionicons name='arrow-redo' size={24} color={color.GREEN} />
                        <Text style={styles.txt}>29k/month</Text>
                        {check == 0 ? <Ionicons name='checkmark-circle-outline' size={24} style={styles.iconCheck} /> : null}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.vipItem}
                        onPress={() => {
                            setCheck(1)
                            setVipTerm(VIP_TERM[1])
                        }}
                    >
                        <Ionicons name='arrow-redo' size={24} color={color.GREEN} />
                        <Text style={styles.txt}>69k/3months</Text>
                        {check == 1 ? <Ionicons name='checkmark-circle-outline' size={24} style={styles.iconCheck} /> : null}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.vipItem}
                        onPress={() => {
                            setCheck(2)
                            setVipTerm(VIP_TERM[2])
                        }}
                    >
                        <Ionicons name='arrow-redo' size={24} color={color.GREEN} />
                        <Text style={styles.txt}>240k/year</Text>
                        {check == 2 ? <Ionicons name='checkmark-circle-outline' size={24} style={styles.iconCheck} /> : null}
                    </TouchableOpacity>
                </View>
                <Text style={styles.cf}>Gửi hóa đơn điện tử để chúng tôi xác nhận!</Text>
                <View style={styles.imageWrapper}>
                    {
                        image.length == 0
                            ? null
                            : <Image source={{ uri: image }} style={styles.image} />
                    }
                    <TouchableOpacity onPress={handlePicker} style={styles.add}>
                        <Icon name="image-plus" size={30} color={color.BLUE} />
                    </TouchableOpacity>
                </View>
                {isChange &&
                    <TouchableOpacity
                        style={styles.commandButton}
                        onPress={upgradePremium}
                    >
                        <Text style={styles.panelButtonTitle}>Upgrade Premium</Text>
                    </TouchableOpacity>
                }
            </ScrollView>
            <Modal visible={modalOpen} animationType='fade' transparent={true}>
                <View style={styles.modal}>
                    <View style={styles.modalView}>
                        <View style={styles.animation}>
                            <LottieView source={require('../../../../utility/constants/success.json')} autoPlay loop />
                        </View>
                        <Text style={styles.textSuccess}>Send request successful!</Text>
                        <Text style={[styles.textSuccess, { paddingVertical: 4 }]}>We will reply as soon as possible!</Text>
                        <View style={styles.ok}>
                            <Text style={styles.okStyle}
                                onPress={() => {
                                    navigation.navigate('Premium')
                                }}
                            >OK</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        </Container>
    )
}

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 24,
        paddingTop: 32
    },
    title2: {
        textAlign: 'center',
        paddingTop: 5
    },
    information: {
        backgroundColor: '#f9f9f9',
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
        elevation: 5,
        marginTop: 20,
        flexDirection: 'row'
    },
    left: {
        width: '35%'
    },
    right: {
        width: '65%'
    },
    text: {
        paddingBottom: 5,
        fontSize: 15
    },
    plan: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        paddingVertical: 20
    },
    cf: {
        textAlign: 'center',
        fontSize: 16,
        paddingVertical: 18
    },
    imageWrapper: {
        flexDirection: 'row',
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#f9f9f9',
        elevation: 5,
        marginBottom: 20,
        minHeight: 300,

    },
    add: {
        position: 'absolute'
    },
    image: {
        width: 200,
        height: 280,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    commandButton: {
        padding: 14,
        borderRadius: 25,
        backgroundColor: color.PINK,
        alignItems: 'center',
        marginTop: 10,
        width: '90%',
        alignSelf: 'center',
        marginBottom: 20
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: color.WHITE,
    },
    // Modal
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
        borderRadius: 6,
        marginTop: 10,
    },
    okStyle: {
        fontSize: 16,
        color: color.WHITE
    },
    vipTerm: {
        flexDirection: 'column',
        backgroundColor: color.WHITE,
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingHorizontal: 20,
        // paddingVertical: 10,
        borderRadius: 5,
        elevation: 5,
    },
    vipItem: {
        flexDirection: 'row',
        flex: 1,
        paddingVertical: 10,
    },
    txt: {
        paddingLeft: 20,
        fontSize: 20,
        fontWeight: 'bold',
        flex: 5,
    },
    iconCheck: {
        color: color.GREEN,
        marginTop: 2,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        flex: 1,
    },
})

export default Banking