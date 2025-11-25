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

    if (error) {
        console.error('Error fetching users:', error);
        throw error;
    }

    return data;
}