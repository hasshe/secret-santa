import { createClient, User } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { UserDB } from './db-models';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL and SUPABASE_KEY must be set in .env file');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    db: { schema: 'public' }
});

export async function getUsers(): Promise<UserDB[]> {
    const { data, error } = await supabase
        .from('users')
        .select('*');

    const assignedNames = data?.map(user => user.secret_santa) || [];

    const filteredData = data?.filter(user => !assignedNames.includes(user.name)) || [];

    if (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
    return filteredData;
}

export async function getUserByName(name: string): Promise<UserDB | null> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('name', name)
        .single();

    if (error) {
        console.error(`Error fetching user with name ${name}:`, error);
        return null;
    }

    return data;
}

export async function updateHasSpunStatusInDB(userId: number, hasSpunStatus: boolean, secretSantaName: string): Promise<UserDB | null> {
    const { data, error } = await supabase
        .from('users')
        .update({ has_spun: hasSpunStatus, secret_santa: secretSantaName })
        .eq('id', userId);

    if (error) {
        console.error(`Error updating hasSpun status for user ID ${userId}:`, error);
        throw error;
    }

    return data;
}