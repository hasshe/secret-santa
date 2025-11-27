export interface User {
    id: number;
    name: string;
    username: string;
    hasSpun: boolean;
    secretSanta: string | null;
    partnerName: string | null;
}