export interface AuthorizationDTO {
    clerk_user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    tenant_id: string;
    user_id: string;
    created_at: string;
    status: 'idle' | 'loading' | 'fulfilled' | 'failed';
}