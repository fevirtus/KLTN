import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, FlatList, Text } from 'react-native'
import ImagePicker from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons'

export default class TestImage extends Component {
    state = {
        avatarSource: null,
    }

    selectImage = async () => {
        ImagePicker.showImagePicker({noData:true, mediaType:'photo'}, (response) => {
            console.log('Response = ', response);
        
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                this.setState({
                    avatarSource: response.uri
                })
            }
        });
    }

    render() {
        console.log(this.state.avatarSource)
        return (
            <View style={{ height: 166 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 8 }}> 
                    <Text style={{ fontSize: 20 }}>List pet</Text>
                    <TouchableOpacity onPress={this.selectImage}>
                        <Ionicons name="ios-add-circle-outline" size={28} color="gray" />
                    </TouchableOpacity>
                </View>  
                <FlatList
                    style={{ backgroundColor: 'grey' }}
                    horizontal={true}
                    data={this.state.avatarSource}
                    keyExtractor={item => item.fileName}
                    renderItem={(data, index) => {
                        return (
                            <View style={{ margin: 10 }}>
                                <Image source={{ uri: this.state.avatarSource }} style={styles.profilePic} />
                            </View>
                        )
                    }}
                />
            </View>
        )
    } 
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