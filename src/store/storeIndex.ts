import { configureStore } from "@reduxjs/toolkit";
import companyReducers from "./slices/companySlice";

export const store = configureStore({
    reducer:{
        company: companyReducers,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;