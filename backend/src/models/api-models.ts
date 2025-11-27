export interface UserResponse {
    name: string;
    hasSpun?: boolean;
}

export interface UsersResponse {
    users: UserResponse[];
    error?: string;
}

export interface HasSpunRequest {
    name: string;
    hasSpun: boolean;
    secretSantaName: string;
    token: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    authenticated: boolean;
    token?: string;
}
