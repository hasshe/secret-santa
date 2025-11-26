export interface UserDB {
    id: number;
    name: string;
    username: string;
    password: string;
    has_spun: boolean;
    secret_santa: string | null;
}