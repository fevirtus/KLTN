import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList } from 'react-native'
import { ShowUsers, Loading } from '../../../components';
import database from '@react-native-firebase/database';
import { uuid } from '../../../utility/constants';
import { startLoading, stopLoading } from '../../../redux/actions/loadingAction';
import { useDispatch } from 'react-redux';

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
                            if (has.length > 0) {//exist in matchedUsers
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
        <SafeAreaView style={{ flex: 1, }}>
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
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({

})

export default ChatDashboard;