import { configureStore } from "@reduxjs/toolkit";
import companyReducers from "./slices/companySlice";
import evaluationReducers from "./slices/evaluationSlice";
import notificationReducers from "./slices/notificationSlice";
import appUserReducers from "./slices/appUserSlice";
import collectionReducers from "./slices/collectionSlice";
import { saveState } from "@/utils/handleLocalStorage";
import { localStorageMiddleware } from "./localStorageMIddleware";

export const store = configureStore({
	reducer: {
		company: companyReducers,
		evaluation: evaluationReducers,
		notifications: notificationReducers,
		appUser: appUserReducers,
		collections: collectionReducers,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(localStorageMiddleware),
});

var currentNotifications = store.getState().notifications;
store.subscribe(() => {
	const prevNotifications = currentNotifications;
	currentNotifications = store.getState().notifications;

	if (prevNotifications !== currentNotifications) {
		saveState("notification", currentNotifications);
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
