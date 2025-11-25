import { User } from "./domain-models";
import { getUsers } from "../repository/users-repository";
import { UserDB } from "../repository/db-models";

function mapUserDBToDomain(userDB: UserDB): User {
    return {
        id: userDB.id,
        name: userDB.name,
    };
}

export async function fetchUsers(): Promise<User[]> {
    const users = await getUsers();
    return users.map(mapUserDBToDomain);
}