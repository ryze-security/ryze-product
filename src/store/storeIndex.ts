import { configureStore } from "@reduxjs/toolkit";
import companyReducers from "./slices/companySlice";
import evaluationReducers from "./slices/evaluationSlice";

export const store = configureStore({
    reducer:{
        company: companyReducers,
        evaluation: evaluationReducers,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;