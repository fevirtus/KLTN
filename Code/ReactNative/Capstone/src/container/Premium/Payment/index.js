import React from 'react';
import {
    View, StyleSheet,
    Text, Image,
    TouchableOpacity,
    ScrollView
} from 'react-native'
import { Container } from '../../../components'
import { color } from '../../../utility'

const Payment = ({ navigation }) => {
    return (
        <Container>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <Text style={styles.title}>Chọn gói Premium</Text>
                    <Text style={styles.title2}>Chúng tôi có gói cực phù hợp cho bạn</Text>
                    <View style={styles.payment}>
                        <Text style={styles.titlePayment}>Đăng ký bằng chuyển khoản</Text>
                        <View style={styles.div}>
                            <Text style={styles.name}>PetDating Premium</Text>
                            <Text>
                                Đăng ký với giá 59000₫/3tháng. Hủy bất kỳ lúc nào.
                        </Text>
                            <View style={styles.iconPayment}>
                                <Image source={require('../../../../images/icon/vcb.jpg')} style={styles.icon} />
                            </View>
                            <TouchableOpacity style={styles.commandButton} onPress={() => navigation.navigate('Banking')}>
                                <Text style={styles.panelButtonTitle}>Dùng Premium</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.payment, { paddingBottom: 20 }]}>
                        <Text style={styles.titlePayment}>Trả bằng ví Momo</Text>
                        <View style={styles.div}>
                            <Text style={styles.name}>PetDating Premium</Text>
                            <Text>
                                Đủ mọi thứ bạn thích khi dùng Premium, không hề ràng buộc.
                            </Text>
                            <View style={styles.iconPayment}>
                                <Image source={require('../../../../images/icon/momo.jpg')} style={styles.icon} />
                                <Image source={require('../../../../images/icon/vcb.jpg')} style={styles.icon} />
                                <Image source={require('../../../../images/icon/viettin.png')} style={styles.icon} />
                                <Image source={require('../../../../images/icon/bidv.png')} style={styles.icon} />
                                <Image source={require('../../../../images/icon/tpbank.jpg')} style={styles.icon} />
                                <Image source={require('../../../../images/icon/mbbank.jpg')} style={styles.icon} />
                            </View>
                            <TouchableOpacity style={styles.commandButton}>
                                <Text style={styles.panelButtonTitle}>Dùng Premium</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 30,
        paddingTop: 10
    },
    title2: {
        textAlign: 'center',
        paddingTop: 5,
        fontSize: 14
    },
    payment: {
        marginTop: 32
    },
    titlePayment: {
        textAlign: 'center',
        fontSize: 22
    },
    div: {
        backgroundColor: '#f9f9f9',
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
        elevation: 5,
        marginTop: 20
    },
    name: {
        fontWeight: '700',
        fontSize: 15
    },
    iconPayment: {
        flexDirection: 'row',
        marginTop: 10,
    },
    icon: {
        width: 26,
        height: 20,
        borderRadius: 2,
        marginRight: 3
    },
    commandButton: {
        width: '95%',
        alignSelf: 'center',
        borderRadius: 25,
        padding: 14,
        backgroundColor: color.PINK,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 6
    },
    panelButtonTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: color.WHITE,
    },
})

export default Payment