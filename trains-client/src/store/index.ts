import { configureStore } from "@reduxjs/toolkit";
import userDataReducer from './userSlice'

const store = configureStore({
    reducer: {
        userData: userDataReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch