import { User } from './domain-models';
import { getUserByName, getUserByUsername, getUserByUsernameAndPassword, getUsers, updateHasSpunStatusInDB } from "../repository/users-repository";
import { UserDB } from "../repository/db-models";

export async function fetchUsers(): Promise<User[]> {
    const users = await getUsers();
    return users.map(mapUserDBToDomain);
}

export async function updateHasSpunStatus(username: string, hasSpun: boolean, secretSantaName: string): Promise<string> {
    const targetUser = await getUserByUsername(username);
    if (!targetUser) {
        throw new Error(`User ${username} not found`);
    }
    const mappedTargetUser = mapUserDBToDomain(targetUser);
    const secretSantaUserDB = await getUserByName(secretSantaName);
    if (!secretSantaUserDB) {
        throw new Error(`Secret Santa user ${secretSantaName} not found`);
    }
    const secretSantaUser = mapUserDBToDomain(secretSantaUserDB);
    validateUsers(mappedTargetUser, secretSantaUser);

    try {
        await updateHasSpunStatusInDB(mappedTargetUser.id, hasSpun, secretSantaName);
        return secretSantaName;
    } catch (error) {
        console.error(`Error updating hasSpun status for user ${username}:`, error);
        throw error;
    }
}

export async function validateUserCredentials(username: string, password: string): Promise<boolean> {
    const user = await getUserByUsernameAndPassword(username, password);
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
        username: userDB.username,
        hasSpun: userDB.has_spun,
        secretSanta: userDB.secret_santa,
        partnerName: userDB.partner_name
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