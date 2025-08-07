import { configureStore } from "@reduxjs/toolkit";
import companyReducers from "./slices/companySlice";
import evaluationReducers from "./slices/evaluationSlice";
import notificationReducers from "./slices/notificationSlice";
import { saveState } from "@/utils/handleLocalStorage";

export const store = configureStore({
	reducer: {
		company: companyReducers,
		evaluation: evaluationReducers,
		notifications: notificationReducers,
	},
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
