
import database from '@react-native-firebase/database';

export const saveMatch = async (currentUserId, guestUserId) => {
    try {
        const isDulicate = await checkDuplicateUser(currentUserId, guestUserId);
        if (!isDulicate) {
            return await database()
                .ref('matches/' + currentUserId)
                .push({ guest: guestUserId });
        }
    } catch (error) {
        return error;
    }
};

const checkDuplicateUser = async (currentUserId, guestUserId) => {
    try {
        let isDulicate = false;
        await database()
            .ref('matches/' + currentUserId)
            .once('value')
            .then(snapShot => {
                if (snapShot != null) {
                    snapShot.forEach(child => {
                        if (child.val().guest == guestUserId) {
                            isDulicate = true;
                            return false;
                        }
                    })
                }

            });
        return isDulicate;
    } catch (error) {
        return error;
    }
};
