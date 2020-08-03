import { SAVE_USER, UPDATE_USER, ADD_PET, UPDATE_PET, SAVE_PETS, DELETE_PET, SAVE_ACTIVE_PET, SAVE_TOKEN, CLEAR_ALL } from './types'


export const saveUser = (user) => ({
    type: SAVE_USER,
    user
})

export const updateUser = (user) => ({
    type: UPDATE_USER,
    user
})

export const addPet = (pet) => ({
    type: ADD_PET,
    pet
})

export const savePets = (pets) => ({
    type: SAVE_PETS,
    pets
})

export const updatePet = (pet) => ({
    type: UPDATE_PET,
    pet
})

export const deletePet = (petId) => ({
    type: DELETE_PET,
    petId: petId
})

export const saveActivePet = (pet) => ({
    type: SAVE_ACTIVE_PET,
    pet
})

// export const saveToken = (token) => ({
//     type: SAVE_TOKEN,
//     token
// })

// export const clearAll = () => ({
//     type: CLEAR_ALL
// })


