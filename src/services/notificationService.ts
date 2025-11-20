import { handleAxiosError } from "@/utils/handleAxiosError";
import axiosInstance from "./axiosInstance";
import { NotificationListResponseDTO } from "@/models/notification/NotificationDTO";

export class NotificationService {
    async fetchNotifications(userId:string, tenantId: string, limit:number, offset:number): Promise<NotificationListResponseDTO | any> {
        try{
            const response = await axiosInstance.get<NotificationListResponseDTO>(
                `/api/v1/notifications?user_id=${userId}&tenant_id=${tenantId}&limit=${limit}&skip=${offset}`
            );
            if(response.status !== 200){
                throw response;
            }
            return response.data;
        } catch(error) {
            const errorInfo = handleAxiosError(error);
			console.error("Error fetching notifications:", errorInfo.message);

			//rethrowing for conditional rendering
			throw errorInfo;
        }
    }

    async markAsRead(notificationId: string, userId: string, tenantId: string): Promise<void | any> {
        try{
            const response = await axiosInstance.patch(`/api/v1/${tenantId}/notifications/${notificationId}/read?user_id=${userId}`);
            if(response.status !== 200){
                throw response;
            }
            return Promise.resolve();
        } catch (error) {
            const errorInfo = handleAxiosError(error);
			console.error("Error patching notifications as read:", errorInfo.message);

			//rethrowing for conditional rendering
			throw errorInfo;
        }
    }

    async deleteNotification(notificationId: string, userId: string, tenantId:string): Promise<void | any> {
        try{
            const response = await axiosInstance.delete(`/api/v1/${tenantId}/notifications/${notificationId}?user_id=${userId}`);

            if(response.status !== 200){
                throw response;
            }
            return Promise.resolve();
        } catch (error) {
            const errorInfo = handleAxiosError(error);
			console.error("Error deleting notification:", errorInfo.message);

			//rethrowing for conditional rendering
			throw errorInfo;
        }
    }

    async markAllAsRead(userId: string, tenantID: string): Promise<void | any> {
        try{
            const response = await axiosInstance.patch(`/api/v1/notifications/mark-all-read?user_id=${userId}&tenant_id=${tenantID}`);
            if(response.status !== 200){
                throw response;
            }
            return Promise.resolve();
        } catch (error) {
            const errorInfo = handleAxiosError(error);
			console.error("Error marking all notifications as read:", errorInfo.message);

			//rethrowing for conditional rendering
			throw errorInfo;
        }        
    }
}