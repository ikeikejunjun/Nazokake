import { supabase } from '@/lib/supabase';

export interface Profile {
    id: string;
    name: string | null;
    bio: string | null;
    avatar_url: string | null;
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

    static async update(id: string, values: { name: string; bio: string }): Promise<{ error: any }> {
        const { error } = await supabase
            .from('profiles')
            .update({
                ...(values.name !== undefined ? { name: values.name } : {}),
                ...(values.bio !== undefined ? { bio: values.bio } : {})
            })
            .eq('id', id);
        return { error };
    }
}
