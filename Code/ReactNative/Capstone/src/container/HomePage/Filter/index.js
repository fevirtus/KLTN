import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, FlatList, PermissionsAndroid } from 'react-native'
import RadioForm from 'react-native-simple-radio-button';
import { color } from '../../../utility'
import { Slider } from 'react-native-elements';
import { Container } from '../../../components';
import Geolocation from '@react-native-community/geolocation';
import { useSelector, useDispatch } from 'react-redux';
import Axios from 'axios';
import { URL_BASE, token } from '../../../api/config';
import { startLoading, stopLoading } from '../../../redux/actions/loadingAction';
import { Card, CardItem, Left, Thumbnail, Body } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons'

const FoundUsers = ({ onNameTap, item, onTap }) => {
    return (
        <TouchableOpacity onPress={onTap} >
            <Card style={styles.cardStyle}>
                <CardItem style={styles.cardItemStyle}>
                    <Left>
                        <View style={[styles.logoContainer]}>
                            {item.avatar ? (
                                <Thumbnail source={{ uri: item.avatar }} resizeMode="cover" />
                            ) : (
                                    <Text style={styles.thumbnailName}>{item.name.charAt(0)}</Text>
                                )}
                        </View>
                        <Body>
                            <Text style={styles.profileName} onPress={onNameTap}>{item.name}</Text>
                            <View style={styles.location}>
                                <Ionicons name='location-sharp' size={12} style={styles.iconLocation} />
                                <Text style={styles.distance}>{item.distance} km</Text>
                            </View>
                        </Body>
                    </Left>
                </CardItem>
            </Card>
        </TouchableOpacity >
    );
};

const Filter = ({ navigation }) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.auth.user)
    const [distance, setDistance] = useState(1)
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null
    })

    const [foundUsers, setFoundUsers] = useState([])

    const { is_vip } = user;

    const doSuccess = async (position) => {
        try {
            const { latitude, longitude } = position.coords;
            console.log(position.coords)
            //insert location to database
            const res = await Axios.post(`${URL_BASE}users/location`, { latitude: latitude, longitude: longitude }, { headers: { Authorization: token } })

            //filter data
            await filterData(distance, res.data.data.latitude, res.data.data.longitude)
            dispatch(stopLoading())
        } catch (error) {
            dispatch(stopLoading())
            console.log(error)
        }
    }

    const onFilter = async () => {
        dispatch(startLoading())
        Geolocation.getCurrentPosition(doSuccess, (error) => {
            console.log('Error', error)
            dispatch(stopLoading())
            Alert.alert('Location Access Required:', 'Turn on GPS to Access your location')
        }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 });
    }

    useEffect(() => {

    }, [])

    const filterData = async (distance, latitude, longitude) => {
        try {
            const url = `${URL_BASE}users/filter?distance=${distance}&latitude=${latitude}&longitude=${longitude}`
            const res = await Axios.get(url, { headers: { Authorization: token } });
            setFoundUsers(res.data.data)
        } catch (error) {
            throw error
        }
    }

    return is_vip !== 1 ? null :
        (
            <Container>
                <View style={styles.form}>
                    <Text style={styles.textDistance}>Distance</Text>
                    <Text style={styles.title}>Hiển thị tất cả người dùng trong bán kính</Text>
                    <Slider
                        minimumValue={1}
                        maximumValue={100}
                        step={1}
                        value={distance}
                        onValueChange={(val) => { setDistance(val) }}
                        minimumTrackTintColor={color.PINK}
                        thumbTintColor={color.WHITE}
                    />
                    <View style={styles.distanceWrap}>
                        <Text style={styles.text}>{distance}km</Text>
                        {
                            distance === 100 ? null : <Text style={styles.text}>100km</Text>
                        }
                    </View>
                    <TouchableOpacity style={styles.submit} onPress={onFilter}>
                        <Text style={styles.textSubmit}>Tìm</Text>
                    </TouchableOpacity>
                </View>
                {foundUsers.length > 0 &&
                    <FlatList
                        alwaysBounceVertical={false}
                        data={foundUsers}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => (
                            <FoundUsers
                                item={item}
                                onNameTap={() => {
                                    console.log(item.name)
                                }}
                                onTap={() => {
                                    navigation.navigate('ProfileUserFilter', { uid: item.uid })
                                }}
                            />
                        )}
                    />
                }
            </Container>
        )
}

const styles = StyleSheet.create({
    form: {
        paddingHorizontal: 32
    },
    radioForm: {
        paddingTop: 25,
    },
    textDistance: {
        paddingVertical: 8,
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        color: color.BLACK
    },
    title: {
        color: color.GRAY,
        paddingBottom: 6
    },
    distanceWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    text: {
        color: color.GRAY,
        fontSize: 13
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
    cardStyle: {
        // backgroundColor: color.SEMI_TRANSPARENT,
        borderBottomWidth: 1,
        borderColor: color.SILVER,
    },
    cardItemStyle: {
        // backgroundColor: color.SEMI_TRANSPARENT,
    },

    logoContainer: {
        height: 60,
        width: 60,
        borderColor: color.WHITE,
        borderWidth: 2,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: color.PINK,
    },
    thumbnailName: {
        fontSize: 30,
        color: color.WHITE,
        fontWeight: "bold"
    },
    profileName: {
        fontSize: 20,
        color: color.BLACK,
        fontWeight: "bold"
    },
    location: {
        flexDirection: 'row',
        marginTop: 5
    },
    iconLocation: {
        marginTop: 3,
        color: color.LIGHT_GRAY
    },
    distance: {
        color: color.LIGHT_GRAY,
        paddingLeft: 5
    }
})

export default Filter