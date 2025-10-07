export interface UserListDTO {
    users: Array<UserDTO>;
}

export interface UserDTO {
    user_id: string;
    tenant_id: string;
    email: string;
    first_name: string;
    last_name: string;
}