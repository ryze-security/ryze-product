import { handleAxiosError } from "@/utils/handleAxiosError";
import axiosInstance from "./axiosInstance";
import { UserListDTO } from "@/models/users/UsersListDTO";

export class UsersService {
    async getUsersList(): Promise<UserListDTO | any> {
        try {
            const response = await axiosInstance.get<UserListDTO>(`/api/v1/users/listusers`, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            if (response.status !== 200) {
                throw response;
            }
            return response.data;
        } catch (error) {
            const errorInfo = handleAxiosError(error);
            console.error("Error fetching users list:", errorInfo.message);

            //rethrowing for conditional rendering
            throw errorInfo;
        }
    }
}

const usersService = new UsersService();
export default usersService;