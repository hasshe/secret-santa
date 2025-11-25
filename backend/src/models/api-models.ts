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

