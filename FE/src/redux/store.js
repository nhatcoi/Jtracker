import { configureStore } from "@reduxjs/toolkit";
import habitReducer from "./habitSlice.jsx";
import authReducer from "./authSlice.jsx";

const store = configureStore({
    reducer: {
        habits: habitReducer,
        auth: authReducer
    },
});

export default store;