import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, TextInput } from 'react-native'
import ImagePicker from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default class Profile extends Component {
    // const [avatarSource, setAvatarSource] = useState(null)
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
            //   setAvatarSource({ avatarSource: response.uri })
                this.setState({
                    avatarSource: response.uri
                })
            }
        });
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.profilePicWrap}>
                    {
                        this.state.avatarSource && <Image source={{ uri: this.state.avatarSource }} style={styles.profilePic} />
                    }
                    <TouchableOpacity onPress={this.selectImage} style={styles.buttonCamera}>
                        <MaterialIcons name="add-a-photo" size={25} color="gray" />
                    </TouchableOpacity>
                </View> 
                <View style={{ flex: 0.4 }}>
                    <View style={styles.textInputWrapper}>
                        <Text style={{ fontSize: 20, paddingRight: 24 }}>Name</Text>
                        <TextInput style={[{ paddingRight: 100 },styles.textInput]}/>
                    </View>
                    <View style={styles.textInputWrapper}>
                        <Text style={{ fontSize: 20, paddingRight: 34 }}>DOB</Text>
                        <TextInput style={styles.textInput}/>
                    </View>
                    <View style={styles.textInputWrapper}>
                        <Text style={{ fontSize: 20, paddingRight: 20 }}>Phone</Text>
                        <TextInput style={styles.textInput}/>
                    </View>
                    <View style={styles.textInputWrapper}>
                        <Text style={{ fontSize: 20, paddingRight: 4 }}>Address</Text>
                        <TextInput style={styles.textInput}/>
                    </View>
                    <View style={styles.textInputWrapper}>
                        <Text style={{ fontSize: 20, paddingRight: 35 }}>Birth</Text>
                        <TextInput style={styles.textInput}/>
                    </View>
                </View>
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={{ fontSize: 20, padding: 5 }}>Save</Text>
                </TouchableOpacity>
                <View style={styles.listPet}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 8 }}> 
                        <Text style={{ fontSize: 20 }}>List pet</Text>
                        <TouchableOpacity>
                            <Ionicons name="ios-add-circle-outline" size={28} color="gray" />
                        </TouchableOpacity>
                    </View>   
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <TouchableOpacity style={{ marginBottom: 20 }}>
                            <Image source={require('../../images/users/1.jpg')} style={styles.iconPet}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image source={require('../../images/users/2.jpg')} style={styles.iconPet}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image source={require('../../images/users/3.jpg')} style={styles.iconPet}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },  
    profilePicWrap: {
        position: 'absolute',
        top: 20,
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
        left: 65,  
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
    },
    listPet: {
        borderTopColor: 'gray',
        borderBottomColor: 'gray',
        width: 350,
        height: 120,
        borderWidth: 1,
        position: 'absolute',
        top: 470
    },
    iconPet: {
        width: 75,
        height: 75,
        borderRadius: 50
    }
})