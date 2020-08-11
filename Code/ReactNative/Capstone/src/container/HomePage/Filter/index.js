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

const FoundUsers = ({ onNameTap, item }) => {
    return (
        <Card style={styles.cardStyle}>
            <CardItem style={styles.cardItemStyle}>
                <Left>
                    <TouchableOpacity style={[styles.logoContainer]} >
                        {item.avatar ? (
                            <Thumbnail source={{ uri: item.avatar }} resizeMode="cover" />
                        ) : (
                                <Text style={styles.thumbnailName}>{item.name.charAt(0)}</Text>
                            )}
                    </TouchableOpacity>

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

    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                'title': 'Location Access Required',
                'message': 'This App needs to Access your location'
            })
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                //To Check, If Permission is granted
                setPosition()
            } else {
                alert("Permission Denied");
            }
        } catch (err) {
            alert("err", err);
            console.warn(err)
        }
    }

    const setPosition = async () => {
        dispatch(startLoading())
        Geolocation.getCurrentPosition(position => {
            Axios.post(`${URL_BASE}users/location`, {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }, { headers: { Authorization: token } })
                .then(res => {
                    console.log('location', res.data.data)
                    setLocation({
                        latitude: res.data.data.latitude,
                        longitude: res.data.data.longitude
                    })
                    dispatch(stopLoading())
                })
                .catch(e => {
                    console.log(e)
                    dispatch(stopLoading())
                })
        }, (error) => {
            console.log('Error', error)
            Alert.alert('Location Access Required:', 'This App needs to Access your location')
            dispatch(stopLoading())
        }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 });
    }

    useEffect(() => {
        if (is_vip == 1) {
            requestLocationPermission()
        }
    }, [])

    const onFilter = () => {
        dispatch(startLoading())
        console.log(`${URL_BASE}users/filter?distance=${distance}&latitude=${location.latitude}&longitude=${location.longitude}`)
        Axios.get(`${URL_BASE}users/filter?distance=${distance}&latitude=${location.latitude}&longitude=${location.longitude}`,
            { headers: { Authorization: token } })
            .then(res => {
                console.log(res.data)
                setFoundUsers(res.data.data)
                dispatch(stopLoading())
            })
            .catch(e => {
                dispatch(stopLoading())
                console.log(e)
                Alert.alert('Error!', e)
            })
    }


    return is_vip !== 1 ? null :
        (
            <Container>
                <View style={styles.form}>
                    <Text style={styles.textDistance}>Distance ({distance} KM) </Text>
                    <Slider
                        minimumValue={1}
                        maximumValue={100}
                        step={1}
                        value={distance}
                        onValueChange={(val) => { setDistance(val) }}
                    />
                    <TouchableOpacity style={styles.submit} onPress={onFilter}>
                        <Text style={styles.textSubmit}>Submit</Text>
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
        color: color.LIGHT_GRAY
    }
})

export default Filter