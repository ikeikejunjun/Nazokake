
import { supabase } from '@/lib/supabase';
import type { Profile } from './profile';

export interface Topic {
    id: string; // uuid
    title: string;
    created_by: string; // uuid (profiles.id)
    created_at: string; // ISO8601 timestamp
    profiles?: Profile | null;
}

export class TopicModel {
    static async fetchAll(): Promise<Topic[]> {
        const { data, error } = await supabase
            .from('topics')
            .select('*, profiles (id, name)')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data as Topic[];
    }

    static async fetchById(id: string): Promise<Topic | null> {
        const { data, error } = await supabase
            .from('topics')
            .select('*, profiles (id, name)')
            .eq('id', id)
            .single();
        if (error) return null;
        return data as Topic;
    }

    static async create(newTopic: Omit<Topic, 'id' | 'created_at'>): Promise<{ error?: any }> {
        const { error } = await supabase.from('topics').insert([newTopic]);
        return { error };
    }

    static async delete(id: string): Promise<{ error?: any }> {
        const { error } = await supabase.from('topics').delete().eq('id', id);
        return { error };
    }
}
