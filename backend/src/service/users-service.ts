import { getUsers } from "../repository/users-repository";

export async function fetchUsers() {
    const users = await getUsers();
    return users;
}