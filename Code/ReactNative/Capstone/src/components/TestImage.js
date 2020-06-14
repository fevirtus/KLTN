import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, FlatList, Text, Surface } from 'react-native'
import ImagePicker from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons'

function TestImage() {
    const [imagesPet, setImagesPet] = useState([])

    const selectImage = () => {
        ImagePicker.showImagePicker({noData:true, mediaType:'photo'}, (response) => {
            if (response.didCancel) {
                return
            } 

            const img = {
                uri: response.uri,
                type: response.type,
                name: 
                    response.fileName || 
                    response.uri.substr(response.uri.lastIndexOf('/') + 1)
            }

            setImagesPet(prevImages => prevImages.concat(img))
        });
    }

    return (
        <View style={{ height: 166, width: '100%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 8 }}> 
                <Text style={{ fontSize: 20 }}>List pet</Text>
                <TouchableOpacity onPress={selectImage}>
                    <Ionicons name="ios-add-circle-outline" size={28} color="gray" />
                </TouchableOpacity>
            </View>  
            <FlatList
                style={{ backgroundColor: 'grey' }}
                horizontal={true}
                data={imagesPet}
                renderItem={({item}) => (
                    <View style={{ margin: 10 }}>
                        <Image source={{uri : item.uri}} style={styles.profilePic} />
                    </View> 
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
})

export default TestImage;