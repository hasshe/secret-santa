export interface UserResponse {
    name: string;
}

export interface UsersResponse {
    users: UserResponse[];
}

export interface HasSpunRequest {
    name: number;
    hasSpun: boolean;
    secretSantaName: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    authenticated: boolean;
}

