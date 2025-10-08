import { handleAxiosError } from "@/utils/handleAxiosError";
import axiosInstance from "./axiosInstance";
import { UserListDTO } from "@/models/users/UsersListDTO";

export class UsersService {
    async getUsersList(): Promise<UserListDTO | any> {
        try {
            const response = await axiosInstance.get<UserListDTO>(`/api/v1/users`, {
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

            const mockData: UserListDTO = {
                "users": [
                    { "user_id": "user_1", "tenant_id": "tenant_1", "email": "user1@example.com", "first_name": "User", "last_name": "One" },
                    { "user_id": "user_2", "tenant_id": "tenant_2", "email": "user2@mockmail.com", "first_name": "User", "last_name": "Two" },
                    { "user_id": "user_3", "tenant_id": "tenant_2", "email": "user3@mockmail.com", "first_name": "User", "last_name": "Three" },
                    { "user_id": "user_4", "tenant_id": "tenant_1", "email": "user4@example.com", "first_name": "User", "last_name": "Four" },
                    { "user_id": "user_5", "tenant_id": "tenant_1", "email": "user5@example.com", "first_name": "User", "last_name": "Five" },
                    { "user_id": "user_6", "tenant_id": "tenant_1", "email": "user6@example.com", "first_name": "User", "last_name": "Six" },
                    { "user_id": "user_7", "tenant_id": "tenant_2", "email": "user7@mockmail.com", "first_name": "User", "last_name": "Seven" },
                    { "user_id": "user_8", "tenant_id": "tenant_2", "email": "user8@mockmail.com", "first_name": "User", "last_name": "Eight" },
                    { "user_id": "user_9", "tenant_id": "tenant_3", "email": "user9@mockmail.com", "first_name": "User", "last_name": "Nine" },
                    { "user_id": "user_10", "tenant_id": "tenant_2", "email": "user10@example.com", "first_name": "User", "last_name": "Ten" },
                    { "user_id": "user_11", "tenant_id": "tenant_4", "email": "user11@mockmail.com", "first_name": "User", "last_name": "Eleven" },
                    { "user_id": "user_12", "tenant_id": "tenant_5", "email": "user12@mockmail.com", "first_name": "User", "last_name": "Twelve" },
                    { "user_id": "user_13", "tenant_id": "tenant_6", "email": "user13@mockmail.com", "first_name": "User", "last_name": "Thirteen" },
                    { "user_id": "user_14", "tenant_id": "tenant_7", "email": "user14@mockmail.com", "first_name": "User", "last_name": "Fourteen" },
                    { "user_id": "user_15", "tenant_id": "tenant_2", "email": "user15@mockmail.com", "first_name": "User", "last_name": "Fifteen" },
                    { "user_id": "user_16", "tenant_id": "tenant_8", "email": "user16@mockmail.com", "first_name": "User", "last_name": "Sixteen" },
                    { "user_id": "user_17", "tenant_id": "tenant_9", "email": "user17@mockmail.com", "first_name": "User", "last_name": "Seventeen" },
                    { "user_id": "user_18", "tenant_id": "tenant_10", "email": "user18@mockmail.com", "first_name": "User", "last_name": "Eighteen" },
                    { "user_id": "user_19", "tenant_id": "tenant_2", "email": "user19@mockmail.com", "first_name": "User", "last_name": "Nineteen" },
                    { "user_id": "user_20", "tenant_id": "tenant_9", "email": "user20@mockmail.com", "first_name": "User", "last_name": "Twenty" },
                    { "user_id": "user_21", "tenant_id": "tenant_11", "email": "user21@mockmail.com", "first_name": "User", "last_name": "TwentyOne" },
                    { "user_id": "user_22", "tenant_id": "tenant_2", "email": "user22@mockmail.com", "first_name": "User", "last_name": "TwentyTwo" },
                    { "user_id": "user_23", "tenant_id": "tenant_12", "email": "user23@mockmail.com", "first_name": "User", "last_name": "TwentyThree" },
                    { "user_id": "user_24", "tenant_id": "tenant_12", "email": "user24@mockmail.com", "first_name": "User", "last_name": "TwentyFour" },
                    { "user_id": "user_25", "tenant_id": "tenant_13", "email": "user25@mockmail.com", "first_name": "User", "last_name": "TwentyFive" },
                    { "user_id": "user_26", "tenant_id": "tenant_14", "email": "user26@mockmail.com", "first_name": "User", "last_name": "TwentySix" },
                    { "user_id": "user_27", "tenant_id": "tenant_2", "email": "user27@mockmail.com", "first_name": "User", "last_name": "TwentySeven" },
                    { "user_id": "user_28", "tenant_id": "tenant_15", "email": "user28@mockmail.com", "first_name": "User", "last_name": "TwentyEight" }
                ]
            }


            return mockData;

            // TODO:[CRITICAL] REMOVE THIS BEFORE PRODUCTION
            // const errorInfo = handleAxiosError(error);
            // console.error("Error fetching users list:", errorInfo.message);

            // //rethrowing for conditional rendering
            // throw errorInfo;
        }
    }
}

const usersService = new UsersService();
export default usersService;