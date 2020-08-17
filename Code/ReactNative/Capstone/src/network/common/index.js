import moment from 'moment';

export const convertToAge = (birthday) => {
    if (!birthday) return 'N/A'
    return moment(birthday, 'YYYY-MM-DD').fromNow().replace('ago', '').trim()
}

export const validateUser = (user) => {
    return true;
}

export const validatePet = (pet) => {
    return true;
}