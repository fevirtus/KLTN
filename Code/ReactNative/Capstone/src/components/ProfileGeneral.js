import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput, FlatList, ScrollView } from 'react-native'
import ImagePicker from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default class Profile extends Component {
    state = {
        avatarSource: null,
        avatarPet: null
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
                    avatarSource: response.uri,
                    avatarPet: response.uri
                })
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.profilePicWrap}>
                        {
                            this.state.avatarSource && <Image source={{ uri: this.state.avatarSource }} style={styles.profilePic} />
                        }
                        <TouchableOpacity onPress={this.selectImage} style={styles.buttonCamera}>
                            <MaterialIcons name="add-a-photo" size={25} color="gray" />
                        </TouchableOpacity>
                    </View> 
                    <View style={{ paddingTop: 25 }}>
                        <View style={styles.textInputWrapper}>
                            <Text style={{ fontSize: 20, paddingRight: 24 }}>Name</Text>
                            <TextInput style={[{ paddingRight: 100 },styles.textInput]}/>
                        </View>
                        <View style={styles.textInputWrapper}>
                            <Text style={{ fontSize: 20, paddingRight: 38 }}>DOB</Text>
                            <TextInput style={styles.textInput}/>
                        </View>
                        <View style={styles.textInputWrapper}>
                            <Text style={{ fontSize: 20, paddingRight: 21 }}>Phone</Text>
                            <TextInput style={styles.textInput}/>
                        </View>
                        <View style={styles.textInputWrapper}>
                            <Text style={{ fontSize: 20, paddingRight: 4 }}>Address</Text>
                            <TextInput style={styles.textInput}/>
                        </View>
                        <View style={styles.textInputWrapper}>
                            <Text style={{ fontSize: 20, paddingRight: 37 }}>Birth</Text>
                            <TextInput style={styles.textInput}/>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.saveButton}>
                        <Text style={{ fontSize: 20, padding: 5 }}>Save</Text>
                    </TouchableOpacity>
                    <View style={{ height: 166, width: '100%' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 8 }}> 
                            <Text style={{ fontSize: 20 }}>List pet</Text>
                            <TouchableOpacity onPress={this.selectImage}>
                                <Ionicons name="ios-add-circle-outline" size={28} color="gray" />
                            </TouchableOpacity>
                        </View>  
                        <FlatList
                            style={{ backgroundColor: 'grey' }}
                            horizontal={true}
                            data={this.state.avatarPet}
                            keyExtractor={item => item.fileName}
                            renderItem={(data, index) => {
                                return (
                                    <View style={{ margin: 10 }} key={index}>
                                        <Image source={{ uri: this.state.avatarPet }} style={styles.profilePic} />
                                    </View>
                                )
                            }}
                        />
                    </View>
                    <View style={styles.imageGallery}>

                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },  
    profilePicWrap: {
        backgroundColor: 'gray',
        width: 100,
        height: 100,
        borderRadius: 50
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    buttonCamera: {
        width: 35,
        height: 35,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 65,
        left: 65
    },
    textInputWrapper: {
        paddingBottom: 14, 
        flexDirection: 'row'
    },
    textInput: {
        height: 25,
        width: 220,
        borderWidth: 1,
        borderColor: 'gray',
        paddingRight : 20,
        flexGrow: 1
    },
    saveButton: {
        borderWidth: 1,
        borderColor: 'gray',
        width: 300,
        justifyContent: 'center',
        alignItems: 'center'
    }
})