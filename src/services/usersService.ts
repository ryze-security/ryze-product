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

            const mockData: UserListDTO = { "users": [{ "user_id": "f049a0c2-eceb-47d9-8640-a5cc5b873852", "tenant_id": "7077beec-a9ef-44ef-a21b-83aab58872c9", "email": "harsh.samasraj@gmail.com", "first_name": "Harsh", "last_name": "Samasraj" }, { "user_id": "ecb97fad-8650-47b9-8958-f56c05718386", "tenant_id": "f5bcf5b3-9ee3-4d6d-aae5-42cefb73641d", "email": "user_31BdLiNSaNWXdOtb4puuWerwU6N@clerk.placeholder", "first_name": "", "last_name": "" }, { "user_id": "94a138c0-3586-43cb-8d23-d72aeb4647c6", "tenant_id": "f5bcf5b3-9ee3-4d6d-aae5-42cefb73641d", "email": "user_31SW3CQKc9IzusnjdychVXviNKf@clerk.placeholder", "first_name": "", "last_name": "" }, { "user_id": "5aaaad12-7ab9-4db2-9768-010bafc7ab93", "tenant_id": "7077beec-a9ef-44ef-a21b-83aab58872c9", "email": "devaditya491@gmail.com", "first_name": "Aditya", "last_name": "Dev" }, { "user_id": "69c14849-71b6-4c63-b983-5175e9b84de9", "tenant_id": "7077beec-a9ef-44ef-a21b-83aab58872c9", "email": "adityaprakash365@gmail.com", "first_name": "Aditya", "last_name": "Prakash" }, { "user_id": "0fdce5b2-0a88-4303-b090-10abfedb13af", "tenant_id": "7077beec-a9ef-44ef-a21b-83aab58872c9", "email": "raj.bhalwankar@gmail.com", "first_name": "Raj", "last_name": "Bhalwankar" }, { "user_id": "93c8fb91-f9ae-4b62-b6a7-6c0a38c29066", "tenant_id": "f5bcf5b3-9ee3-4d6d-aae5-42cefb73641d", "email": "addip360@gmail.com", "first_name": "Aditya", "last_name": "Prakash" }, { "user_id": "644d1eaf-acd1-4649-9b45-277d310fd4a3", "tenant_id": "f5bcf5b3-9ee3-4d6d-aae5-42cefb73641d", "email": "testaditya491@gmail.com", "first_name": "Aditya", "last_name": "Dev" }, { "user_id": "3e803a11-eb52-4578-a38b-615ac368e5f6", "tenant_id": "638d8323-55e9-4177-8cdf-88b3335444cb", "email": "bavejashashank@gmail.com", "first_name": "Shashank", "last_name": "Baveja" }, { "user_id": "ef81e292-fe11-471c-8720-a3d51e6f3985", "tenant_id": "f5bcf5b3-9ee3-4d6d-aae5-42cefb73641d", "email": "rajbhalwankar@protonmail.com", "first_name": "Raj", "last_name": "Bhalwankar" }, { "user_id": "27697779-374f-4d8b-bebc-b9064f17ec2c", "tenant_id": "15944e28-b81b-4892-a9d7-dbbaab515347", "email": "iakona.faruq@freedrops.org", "first_name": "Aditya", "last_name": "Dev" }, { "user_id": "25f92888-e989-4075-ae98-acd4b738eb2b", "tenant_id": "23ed2767-7d6c-450b-9dd8-89257b359e4c", "email": "aditidev2225@gmail.com", "first_name": "Aditi", "last_name": "Dev" }, { "user_id": "0dfa1a38-69f5-4fe9-9486-6ec7a14c3c24", "tenant_id": "03999661-c56e-4597-ab01-800e17ff2733", "email": "93vkgiri@gmail.com", "first_name": "Vikas", "last_name": "Giri" }, { "user_id": "d80dd84f-2a7e-487d-8340-9a4662b22643", "tenant_id": "1deb1a3a-5a57-4105-9b1d-7dbe0150d330", "email": "z7uti@tiffincrane.com", "first_name": "Peter", "last_name": "C" }, { "user_id": "33b3b295-996f-4aaf-b5c1-677760ff398f", "tenant_id": "f5bcf5b3-9ee3-4d6d-aae5-42cefb73641d", "email": "deepanshubawaliya@gmail.com", "first_name": "Deepanshu", "last_name": "Prajapati" }, { "user_id": "6b6d7250-145c-41ba-af6c-f2aca551e66d", "tenant_id": "33277ca6-71bc-4c4f-ba38-b26b0342f7c8", "email": "t@novasec.nl", "first_name": "Thijs", "last_name": "V" }, { "user_id": "e1362723-d25f-47df-a37e-72c3644113e8", "tenant_id": "7dd9e379-39e6-46a3-a659-8ae3028fb782", "email": "andreas.dietrich@basec.de", "first_name": "Andreas", "last_name": "Dietrich" }, { "user_id": "a5ac5862-3997-4aab-a94f-80ea5bf6d763", "tenant_id": "c2b65754-2d44-4641-a4b9-2dedc939d32e", "email": "singh.jaspreet14@yahoo.com", "first_name": "Jaspreet", "last_name": "Singh" }, { "user_id": "b8e4931a-fb92-4268-a48a-5541243e4fb6", "tenant_id": "f5bcf5b3-9ee3-4d6d-aae5-42cefb73641d", "email": "festusnjuhigu@gmail.com", "first_name": "FESTUS MURIUKI", "last_name": "NJUHIGU" }, { "user_id": "cfc67ef2-4a55-4b90-acc1-d3ae6605c021", "tenant_id": "7dd9e379-39e6-46a3-a659-8ae3028fb782", "email": "aditya@ryzr.io", "first_name": "Aditya", "last_name": "Prakash" }, { "user_id": "769edca0-1671-46f6-959c-62097896712e", "tenant_id": "0aa4b590-2d83-49fa-9432-9f1b694b87f8", "email": "stefan@dstmsystems.com", "first_name": "Stefan", "last_name": "Mladenovic" }, { "user_id": "24c98908-0ae4-462a-881e-a02f60a64659", "tenant_id": "f5bcf5b3-9ee3-4d6d-aae5-42cefb73641d", "email": "kunalgdschce@gmail.com", "first_name": "Kunal", "last_name": "K" }, { "user_id": "b8f59257-b668-4a9c-8db3-d1b7e4d5da7d", "tenant_id": "cf39faef-0ed1-40d6-a23d-de38bfc3550c", "email": "uri@iothreat.com", "first_name": "Uri", "last_name": "Fleyder-Kotler" }, { "user_id": "88d9ea61-8f5f-4079-a9b9-c97f83535ff4", "tenant_id": "cf39faef-0ed1-40d6-a23d-de38bfc3550c", "email": "harshsinghsamasraj@gmail.com", "first_name": "Harsh", "last_name": "Singh" }, { "user_id": "8af623f2-14b8-47fb-a4f2-49ee35b86166", "tenant_id": "01a63b98-1d9d-4603-a417-135667745dfc", "email": "jessiesdman@gmail.com", "first_name": "Jessies", "last_name": "Dman" }, { "user_id": "096a350f-dc85-4921-b0a5-31f6f239a63e", "tenant_id": "093682fb-948f-4c2f-85d7-f833717c1d3a", "email": "alok.tripathi@atiadvisory.ch", "first_name": "Alok", "last_name": "Tripathi" }, { "user_id": "47616128-c064-4657-b54f-6c7d28a605f1", "tenant_id": "f5bcf5b3-9ee3-4d6d-aae5-42cefb73641d", "email": "user_33YITfLFr9CWM3Zi36n7Zpq9ZA3@clerk.placeholder", "first_name": "", "last_name": "" }, { "user_id": "ae7e9065-8817-422e-8add-e6e119be63e7", "tenant_id": "d922a639-0c34-4251-a136-62ec4a50d571", "email": "xasares601@noidos.com", "first_name": "Augustus", "last_name": "E" }] }

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