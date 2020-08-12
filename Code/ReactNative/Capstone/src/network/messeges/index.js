
import database from '@react-native-firebase/database';

export const senderMsg = async (msgValue, currentUserId, guestUserId, img) => {
  try {
    return await database()
      .ref('messeges/' + currentUserId)
      .child(guestUserId)
      .push({
        messege: {
          sender: currentUserId,
          reciever: guestUserId,
          msg: msgValue,
          img: img,
        },
      });
  } catch (error) {
    return error;
  }
};

export const recieverMsg = async (
  msgValue,
  currentUserId,
  guestUserId,
  img,
) => {
  try {
    return await database()
      .ref('messeges/' + guestUserId)
      .child(currentUserId)
      .push({
        messege: {
          sender: currentUserId,
          reciever: guestUserId,
          msg: msgValue,
          img: img,
        },
      });
  } catch (error) {
    return error;
  }
};

export const systemMsg = async (msgValue, currentUserId, guestUserId, img) => {
  try {
    return await database()
      .ref('messeges/' + currentUserId)
      .child(guestUserId)
      .push({
        messege: {
          sender: 'ADMIN',
          reciever: guestUserId,
          msg: msgValue,
          img: img,
        },
      });
  } catch (error) {
    return error;
  }
};
