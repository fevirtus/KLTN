
import database from '@react-native-firebase/database';

export const saveMatch = async (currentUserId, guestUserId) => {
    try {
        const isDulicate = await checkDuplicateUser(currentUserId, guestUserId);
        if (!isDulicate) {
            return await database()
                .ref('matches/' + currentUserId)
                .push({
                    guest: guestUserId,
                    seen: false
                });
        }
    } catch (error) {
        return error;
    }
};

const checkDuplicateUser = async (currentUserId, guestUserId) => {
    try {
        let isDulicate = false;
        const guests = await database()
            .ref('matches/' + currentUserId)
            .once('value');
        let key = null;

        guests.forEach(child => {
            if (child.val().guest == guestUserId) {
                key = child._snapshot.key
                isDulicate = true
                return false;
            }
        })
        if (key) {
            await database().ref(`matches/${currentUserId}/${key}`)
                .update({ seen: false })
        }
        return isDulicate;
    } catch (error) {
        return error;
    }
};

export const seenMatch = async (currentUserId, guestUserId) => {
    try {
        const guests = await database()
            .ref('matches/' + currentUserId)
            .once('value');
        let key = null;

        guests.forEach(child => {
            if (child.val().guest == guestUserId) {
                key = child._snapshot.key
                return false;
            }
        })
        if (key) {
            await database().ref(`matches/${currentUserId}/${key}`)
                .update({ seen: true })
        }
    } catch (error) {
        return error;
    }
}

