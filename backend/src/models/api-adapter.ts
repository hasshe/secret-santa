import { UserResponse, UsersResponse } from "./api-models";
import { User } from '../service/domain-models';

export function mapUserToUserResponse(user: User): UserResponse {
    return {
        name: user.name,
    };
}

export function mapUsersToUsersResponse(users: User[]): UsersResponse {
    return {
        users: users.map(mapUserToUserResponse),
    };
}