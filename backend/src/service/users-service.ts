import { User } from './domain-models';
import { getUserByName, getUserByUsername, getUsers, updateHasSpunStatusInDB } from "../repository/users-repository";
import { UserDB } from "../repository/db-models";
import { get } from 'http';

export async function fetchUsers(): Promise<User[]> {
    const users = await getUsers();
    return users.map(mapUserDBToDomain);
}

export async function updateHasSpunStatus(name: string, hasSpun: boolean, secretSantaName: string): Promise<void> {
    const targetUser = await getUserByName(name) as User;
    const secretSantaUser = await getUserByName(secretSantaName) as User;
    validateUsers(targetUser, secretSantaUser);

    try {
        await updateHasSpunStatusInDB(targetUser.id, hasSpun, secretSantaName);
    } catch (error) {
        console.error(`Error updating hasSpun status for user ${name}:`, error);
        throw error;
    }
    console.log(`Updating user ${name} hasSpun status to ${hasSpun} with secretSantaName ${secretSantaName}`);
}

export async function validateUserCredentials(username: string, password: string): Promise<boolean> {
    const user = await getUserByUsername(username, password);
    if (!user) {
        return false;
    }
    // In a real application, passwords should be hashed and securely compared
    return user.password === password;
}

function mapUserDBToDomain(userDB: UserDB): User {
    return {
        id: userDB.id,
        name: userDB.name,
    };
}

function validateUsers(targetUser: User, secretSantaUser: User): void {
    if (!targetUser) {
        throw new Error(`User not found`);
    }
    if (targetUser.id === secretSantaUser.id) {
        throw new Error('A user cannot be their own Secret Santa');
    }
    if (!secretSantaUser) {
        throw new Error(`Secret Santa user not found`);
    }
}