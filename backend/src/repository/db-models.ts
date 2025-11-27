export interface UserDB {
    id: number;
    name: string;
    username: string;
    password: string;
    hasSpun: boolean;
    secretSanta: string | null;
}