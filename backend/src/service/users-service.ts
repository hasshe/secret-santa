import { User } from "./domain-models";
import { getUserByName, getUsers, updateHasSpunStatusInDB } from "../repository/users-repository";
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

export async function updateHasSpunStatus(name: string, hasSpun: boolean, secretSantaName: string): Promise<void> {
    const targetUser = await getUserByName(name);
    const secretSantaUser = await getUserByName(secretSantaName);

    if (!secretSantaUser) {
        throw new Error(`Secret Santa user with name ${secretSantaName} not found`);
    }
    if (!targetUser) {
        throw new Error(`User with name ${name} not found`);
    }

    if (targetUser.id === secretSantaUser.id) {
        throw new Error('A user cannot be their own Secret Santa');
    }

    try {
        await updateHasSpunStatusInDB(targetUser.id, hasSpun, secretSantaName);
    } catch (error) {
        console.error(`Error updating hasSpun status for user ${name}:`, error);
        throw error;
    }
    console.log(`Updating user ${name} hasSpun status to ${hasSpun} with secretSantaName ${secretSantaName}`);
}