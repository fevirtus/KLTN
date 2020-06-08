import React, { useState } from 'react';
import { StyleSheet, View, Button, Image } from 'react-native'
import ImagePicker from 'react-native-image-picker';

export default function TestImage() {
    const [avatarSource, setAvatarSource] = useState(null)
    
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
                setAvatarSource({
                  avatarSource: response.uri
              })
            }
        });
    }

    return (
        <View style={styles.container}>
        {
           avatarSource && <Image source={{uri:avatarSource}} style={{width: '80%', height: 200, resizeMode: 'contain'}} />
        }
        <Button title="image" onPress={selectImage}/>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})