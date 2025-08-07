import { NotificationDTO } from "@/models/notification/NotificationDTO";
import { loadState } from "@/utils/handleLocalStorage";
import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
	name: "notification",
	initialState: loadState("notification") || ([] as NotificationDTO[]),
	reducers: {
		addNotification: (state, action) => {
			const newNotification: NotificationDTO = {
				id: Date.now(),
				...action.payload,
				timestamp: new Date().getTime().toString(),
				unread: true,
			};
			state.unshift(newNotification);
		},
		markAsRead(state, action) {
			const notification = state.find(
				(n: NotificationDTO) => n.id === action.payload
			);
			if (notification) {
				notification.unread = false;
			}
		},
		markAllAsRead(state) {
			state.forEach((notification: NotificationDTO) => {
				notification.unread = false;
			});
		},
		dismissNotification(state, action) {
			return state.filter(
				(n: NotificationDTO) => n.id !== action.payload
			);
		},
	},
});

export const {
	addNotification,
	markAsRead,
	markAllAsRead,
	dismissNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
