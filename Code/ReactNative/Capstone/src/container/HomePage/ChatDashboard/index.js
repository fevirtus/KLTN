import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList } from 'react-native'
import ShowUsers from '../../../components/ShowUsers';
import database from '@react-native-firebase/database';
import { uuid } from '../../../utility/constants';
import { Loading } from '../../../components'

const ChatDashboard = ({ navigation }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        try {
            database().ref('users').on('value', dataSnapshot => {
                // let users = dataSnapshot.map(child => {
                //     return {
                //         id: child.val().uuid,
                //         name: child.val().name,
                //         profileImg: child.val().profileImg,
                //     }
                // })
                let users = []
                dataSnapshot.forEach((child) => {
                    if (uuid != child.val().uuid) {
                        users.push({
                            id: child.val().uuid,
                            name: child.val().name,
                            profileImg: child.val().profileImg,
                        });
                    }

                });
                setAllUsers(users);
                setLoading(false)
            })
        } catch (error) {
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
            navigation.navigate("Chat", {
                name,
                imgText: name.charAt(0),
                guestUserId,
                currentUserId: uuid,
            });
        } else {
            navigation.navigate("Chat", {
                name,
                img: profileImg,
                guestUserId,
                currentUserId: uuid,
            });
        }
    };

    return (
        <View style={styles.container}>
            {
                loading ? <Loading />
                    : <SafeAreaView style={styles.container}>
                        {/* {getScrollPosition > getOpacity() && (
                <StickyHeader
                  name={name}
                  img={profileImg}
                  onImgTap={() => imgTap(profileImg, name)}
                />
              )} */}

                        {/* ALL USERS */}
                        <FlatList
                            alwaysBounceVertical={false}
                            data={allUsers}
                            keyExtractor={(_, index) => index.toString()}
                            // onScroll={(event) =>
                            //     setScrollPosition(event.nativeEvent.contentOffset.y)
                            // }
                            // ListHeaderComponent={
                            //   <View
                            //     style={{
                            //       opacity:
                            //         getScrollPosition < getOpacity()
                            //           ? (getOpacity() - getScrollPosition) / 100
                            //           : 0,
                            //     }}
                            //   >
                            //     <Profile
                            //       img={profileImg}
                            //       onImgTap={() => imgTap(profileImg, name)}
                            //       onEditImgTap={() => selectPhotoTapped()}
                            //       name={name}
                            //     />
                            //   </View>
                            // }
                            renderItem={({ item }) => (
                                <ShowUsers
                                    name={item.name}
                                    img={item.profileImg}
                                    onImgTap={() => imgTap(item.profileImg, item.name)}
                                    onNameTap={() => nameTap(item.profileImg, item.name, item.id)}
                                />
                            )}
                        />
                    </SafeAreaView>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default ChatDashboard;