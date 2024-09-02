import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { user } from '../types/default';

const initialState = {pk: -1, email:"", username:"", last_name: "", first_name:""}

const userDataSlice = createSlice({
    name: 'userDataSlice',
    initialState,
    reducers: {
        updateUserData(state, action: PayloadAction<user>)
        {
            state.pk=action.payload.pk
            state.email=action.payload.email
            state.username=action.payload.username
            state.last_name=action.payload.last_name
            state.first_name=action.payload.first_name
        }
    },    
    extraReducers: (builder) => {

    }
})

export const {updateUserData} = userDataSlice.actions

export default userDataSlice.reducer