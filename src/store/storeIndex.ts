import { configureStore } from "@reduxjs/toolkit";
import companyReducers from "./slices/companySlice";
import evaluationReducers from "./slices/evaluationSlice";
import appUserReducers from "./slices/appUserSlice";
import collectionReducers from "./slices/collectionSlice";
import selfAssessmentReducer from "./slices/selfAssessmentSlice";
import { localStorageMiddleware } from "./localStorageMIddleware";

export const store = configureStore({
	reducer: {
		company: companyReducers,
		evaluation: evaluationReducers,
		appUser: appUserReducers,
		collections: collectionReducers,
		selfAssessment: selfAssessmentReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
