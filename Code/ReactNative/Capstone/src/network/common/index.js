import moment from 'moment';
import { Alert } from 'react-native';
import _ from 'lodash'

export const convertToAge = (birthday) => {
    if (!birthday) return 'N/A'
    return moment(birthday, 'YYYY-MM-DD').fromNow().replace('ago', '').trim()
}

export const validateUser = (user) => {
    if (_.isEmpty(user.name) || user.name.trim().length < 2 || user.name.trim().length > 15) {
        Alert.alert('Error', 'Name must have 2-15 characters')
        return false;
    }

    if (user.phone && user.phone.length != 10 && user.phone.length != 0) {
        Alert.alert('Error', 'Phone must have 10 figures')
        return false;
    }
    return true;
}

export const validatePet = (pet) => {
    if (_.isEmpty(pet.name) || pet.name.trim().length < 2 || pet.name.trim().length > 15) {
        Alert.alert('Error', 'Name must have 2-15 characters')
        return false;
    }

    if (pet.weight && pet.weight.length > 3) {
        Alert.alert('Error', 'Weight must have less than 3 figures')
        return false;
    }

    if (_.isEmpty(pet.avatar)) {
        Alert.alert('Error', 'Avatar can not be empty')
        return false;
    }

    if (_.isEmpty(pet.breed) || pet.breed == '-1') {
        Alert.alert('Error', 'Must choose breed of pet')
        return false;
    }

    return true;
}