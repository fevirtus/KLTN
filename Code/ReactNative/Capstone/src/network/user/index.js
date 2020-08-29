import database from '@react-native-firebase/database';

export const AddUser = async (name, email, uid, profileImg) => {
    try {
        return await database()
            .ref("users/" + uid)
            .set({
                name: name,
                email: email,
                uuid: uid,
                profileImg: profileImg,
            });
    } catch (error) {
        return error;
    }
};

export const UpdateUser = async (uuid, imgSource) => {
    try {
        return await database()
            .ref("users/" + uuid)
            .update({
                profileImg: imgSource
            });
    } catch (error) {
        return error;
    }
};

export const UpdateUserName = async (uuid, displayName) => {
    try {
        return await database()
            .ref("users/" + uuid)
            .update({
                name: displayName
            });
    } catch (error) {
        return error;
    }
};

export const hideUser = async (uuid, hide) => {
    try {
        return await database()
            .ref("users/" + uuid)
            .update({
                hide: hide
            });
    } catch (error) {
        return error;
    }
};

export const deleteUser = async (uuid) => {
    try {
        return await database()
            .ref("users/" + uuid)
            .remove()
    } catch (error) {
        return error;
    }
};

export const deleteChatFriend = (uid) => {

}