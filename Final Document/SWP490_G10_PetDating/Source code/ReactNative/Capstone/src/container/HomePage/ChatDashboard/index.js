import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native'
import _ from 'lodash'
import { useDispatch } from 'react-redux';
import * as Animatable from 'react-native-animatable';
import database from '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { color } from '../../../utility';
import { uuid } from '../../../utility/constants';
import { ShowUsers, Container } from '../../../components';
import { startLoading, stopLoading } from '../../../redux/actions/loadingAction';

const ChatDashboard = ({ navigation }) => {
    const [allUsers, setAllUsers] = useState([]);
    const dispatch = useDispatch()

    useEffect(() => {
        try {
            dispatch(startLoading())
            database().ref('users').on('value', dataSnapshot => {
                database().ref(`matches/${uuid}`)
                    .on('value', matchSnap => {
                        let matchedUsers = [];
                        matchSnap.forEach((child) => {
                            matchedUsers.unshift(child.val());
                        });
                        let users = []
                        dataSnapshot.forEach((child) => {
                            const has = matchedUsers.filter(mu => mu.guest == child.val().uuid);
                            if (has.length > 0 && !child.val().hide) {//exist in matchedUsers
                                users.push({
                                    id: child.val().uuid,
                                    name: child.val().name,
                                    profileImg: child.val().profileImg,
                                    seen: has[0].seen
                                });
                            }
                        });
                        setAllUsers(users);
                        dispatch(stopLoading())
                    })
            })
        } catch (error) {
            dispatch(stopLoading())
            alert(error)
        }
    }, [])

    // * ON IMAGE TAP
    const imgTap = (profileImg, name) => {
        // if (!profileImg) {
        //     navigation.navigate("ShowFullImg", {
        //         name,
        //         imgText: name.charAt(0),
        //     });
        // } else {
        //     navigation.navigate("ShowFullImg", { name, img: profileImg });
        // }
    };

    // * ON NAME TAP
    const nameTap = (profileImg, name, guestUserId) => {
        if (!profileImg) {
            navigation.navigate("ChatboxStackScreen", {
                screen: 'Chat',
                params: {
                    name,
                    imgText: name.charAt(0),
                    guestUserId,
                    currentUserId: uuid,
                }
            });
        } else {
            navigation.navigate("ChatboxStackScreen", {
                screen: 'Chat',
                params: {
                    name,
                    img: profileImg,
                    guestUserId,
                    currentUserId: uuid,
                }
            });
        }
    };

    return (
        <Container>
            {
                _.isEmpty(allUsers)
                    ? <View style={styles.empty}>
                        <Animatable.View animation="wobble">
                            <Icon name="cards" size={180} color={color.PINK} />
                        </Animatable.View>
                        <Text style={styles.txt1}>Start Matching</Text>
                        <Text style={styles.txt2}>
                            Matches will appear here once you start to Match people.
                            You can message them directly from here when you’re ready to spark up the conversation.
                        </Text>
                    </View>
                    : <View style={styles.container}>
                        <FlatList
                            alwaysBounceVertical={false}
                            data={allUsers}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item }) => (
                                <ShowUsers
                                    name={item.name}
                                    img={item.profileImg}
                                    seen={item.seen}
                                    onImgTap={() => imgTap(item.profileImg, item.name)}
                                    onNameTap={() => nameTap(item.profileImg, item.name, item.id)}
                                />
                            )}
                        />
                    </View>
            }
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 8
    },
    empty: {
        alignItems: 'center',
        paddingTop: '30%'
    },
    txt1: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    txt2: {
        width: '70%',
        textAlign: 'center',
        paddingTop: 8,
        color: color.GRAY
    }
})

export default ChatDashboard;