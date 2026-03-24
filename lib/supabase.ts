import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'super_admin' | 'approved' | 'pending' | 'rejected';

export interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    role: UserRole;
    created_at: string;
    approved_at: string | null;
    approved_by: string | null;
}

export interface AppSettings {
    id: number;
    payments_enabled: boolean;
    stripe_monthly_price_id: string | null;
    stripe_yearly_price_id: string | null;
    updated_at: string;
}
