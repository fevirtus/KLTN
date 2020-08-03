import { SAVE_USER, UPDATE_USER, SAVE_PETS, UPDATE_PET, DELETE_PET, SAVE_ACTIVE_PET, ADD_PET, UPDATE_ACTIVE_PET, } from "../actions/types";


const initialState = {
    user: {},
    pets: [],
    pet_active: {},
    // token: null
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_USER:
            return {
                ...state,
                user: action.user
            }
        case UPDATE_USER:
            const newUser = { ...state.user, ...action.user };
            return {
                ...state,
                user: newUser
            }
        case SAVE_PETS:
            return {
                ...state,
                pets: action.pets
            }
        case ADD_PET:
            const newPets = [...state.pets];
            newPets.unshift(action.pet);
            return {
                ...state,
                pets: newPets
            }
        case UPDATE_PET:
            let updatePets = [...state.pets];
            updatePets = updatePets.map(pet => {
                if (pet.id == action.pet.id) {
                    pet = { ...pet, ...action.pet }
                }
                return pet
            })
            console.log(updatePets)

            return {
                ...state,
                pets: updatePets
            }
        case DELETE_PET:
            const newPets3 = [...state.pets];
            return {
                ...state,
                pets: newPets3.filter(pet => pet.id !== action.petId)
            }
        case SAVE_ACTIVE_PET:
            return {
                ...state,
                pet_active: action.pet
            }
        case UPDATE_ACTIVE_PET:
            const newPetActive = { ...state.pet_active, ...action.pet }
            return {
                ...state,
                pet_active: newPetActive
            }
        default:
            return state;
    }
}

export default authReducer