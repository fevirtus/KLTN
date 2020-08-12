import React, { useState } from 'react';
import {
    View, StyleSheet,
    Text, Image,
    TouchableOpacity
} from 'react-native'
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import axios from 'axios'
import { Container } from '../../../../components'
import { color } from '../../../../utility'
import { uploadImgToServer2 } from '../../../../network';
import { URL_BASE, token } from '../../../../api/config'
import { useDispatch } from 'react-redux';
import { stopLoading, startLoading } from '../../../../redux/actions/loadingAction';

const Banking = () => {
    const [image, setImage] = useState('')
    const [isChange, setIsChange] = useState(false)
    const [uploadImg, setUploadImg] = useState({
        img: null
    });
    const dispatch = useDispatch()

    const handlePicker = () => {
        let options = {
            title: 'Select Image',
            noData: true,
            maxWidth: 500,
            maxHeight: 500,
        };
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

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
                confirm_img: uploadedImg
            }, { headers: { Authorization: token } })
                .then(res => {
                    dispatch(stopLoading())
                    setIsChange(false)
                })
                .catch(error => {
                    dispatch(stopLoading())
                    console.log(error)
                });
        } catch (e) {
            dispatch(stopLoading())
            alert(e)
        }
    }

    return (
        <Container>
            <Text style={styles.title}>Chuyển khoản để thanh toán</Text>
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
            <Text style={styles.cf}>Gửi hóa đơn điện tử để chúng tôi xác nhận!</Text>
            <View style={styles.imageWrapper}>
                {
                    image.length == 0
                        ? <Image source={require('../../../../../images/pic-empty.png')} style={styles.image} />
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
    cf: {
        textAlign: 'center',
        fontSize: 16,
        paddingTop: 20
    },
    imageWrapper: {
        flexDirection: 'row',
        width: '45%',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingTop: 10
    },
    add: {
        paddingLeft: 10
    },
    image: {
        width: 150,
        height: 180,
        borderRadius: 5
    },
    commandButton: {
        padding: 14,
        borderRadius: 10,
        backgroundColor: color.PINK,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        width: '90%',
        alignSelf: 'center'
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: color.WHITE,
    },
})

export default Banking