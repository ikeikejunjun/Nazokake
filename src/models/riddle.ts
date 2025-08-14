import { supabase } from '@/lib/supabase';
import type { Topic } from './topic';
import type { Profile } from './profile';

export interface Riddle {
    id: string; // uuid
    topic_id: string; // uuid (topics.id)
    user_id: string; // uuid (profiles.id)
    toku: string;
    kokoro: string;
    created_at: string; // ISO8601 timestamp
    topics?: Topic | null;
    profiles?: Profile | null;
}

export class RiddleModel {
    // 全件取得（topic, profileもJOIN）
    static async fetchAll(): Promise<Riddle[]> {
        const { data, error } = await supabase
            .from('riddles')
            .select('*, topics(*), profiles(*)')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data as Riddle[];
    }

    // idで詳細取得
    static async fetchById(id: string): Promise<Riddle | null> {
        const { data, error } = await supabase
            .from('riddles')
            .select('*, topics(*), profiles(*)')
            .eq('id', id)
            .single();
        if (error) return null;
        return data as Riddle;
    }

    // 新規作成
    static async create(newRiddle: Omit<Riddle, 'id' | 'created_at' | 'topics' | 'profiles'>): Promise<{ error?: any }> {
        const { error } = await supabase
            .from('riddles')
            .insert([newRiddle]);
        return { error };
    }

    // 編集
    static async update(id: string, update: Partial<Omit<Riddle, 'id' | 'created_at' | 'topics' | 'profiles'>>): Promise<{ error?: any }> {
        const { error } = await supabase
            .from('riddles')
            .update(update)
            .eq('id', id);
        return { error };
    }

    // 削除
    static async delete(id: string): Promise<{ error?: any }> {
        const { error } = await supabase
            .from('riddles')
            .delete()
            .eq('id', id);
        return { error };
    }

    // ページネーション付き全件取得
    static async fetchAllPaginated(page: number, pageSize: number): Promise<Riddle[]> {
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        const { data, error } = await supabase
            .from('riddles')
            .select('*, topics(*), profiles(*)')
            .order('created_at', { ascending: false })
            .range(from, to);
        if (error) throw error;
        return data as Riddle[];
    }

    // ページネーション付きお題絞り込み取得
    static async fetchByTopicIdPaginated(topicId: string, page: number, pageSize: number): Promise<Riddle[]> {
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        const { data, error } = await supabase
            .from('riddles')
            .select('*, topics(*), profiles(*)')
            .eq('topic_id', topicId)
            .order('created_at', { ascending: false })
            .range(from, to);
        if (error) throw error;
        return data as Riddle[];
    }

    // ページネーション付きユーザー絞り込み取得
    static async fetchByUserIdPaginated(userId: string, page: number, pageSize: number): Promise<Riddle[]> {
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        const { data, error } = await supabase
            .from('riddles')
            .select('*, topics(*), profiles(*)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .range(from, to);
        if (error) throw error;
        return data as Riddle[];
    }
}
