import { supabase } from '@/lib/supabase';

export interface Profile {
    id: string;
    name: string | null;
    created_at: string;
}

export class ProfileModel {
    static async fetchById(id: string): Promise<Profile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();
        if (error) return null;
        return data as Profile;
    }
}
