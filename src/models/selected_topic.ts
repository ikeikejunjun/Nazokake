import { supabase } from '@/lib/supabase';
import type { Topic } from './topic';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface SelectedTopic {
	id: string; // uuid
	topic_id: string; // uuid (topics.id)
	selected_by: string; // uuid (profiles.id)
	selected_at: string; // ISO8601 timestamp
	topics?: Topic | null;
}

export class SelectedTopicModel {
	// Realtime購読: コールバックで最新データを受け取る
	static subscribe(onChange: (data: SelectedTopic | null) => void): RealtimeChannel {
		const channel = supabase
			.channel('selected_topic_changes')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'selected_topic',
				},
				async () => {
					const latest = await SelectedTopicModel.fetchOne();
					onChange(latest);
				}
			)
			.subscribe();
		return channel;
	}

	// 単一レコード取得（常に1件のみ）
	static async fetchOne(): Promise<SelectedTopic | null> {
		const { data, error } = await supabase
			.from('selected_topic')
			.select('*, topics(*)')
			.limit(1)
			.single();
		if (error) return null;
		return data as SelectedTopic;
	}

	// 単一レコード更新
	static async updateOne(id: string, update: Partial<Omit<SelectedTopic, 'id' | 'selected_at' | 'topics'>>): Promise<{ error?: any }> {
		const { error } = await supabase
			.from('selected_topic')
			.update(update)
			.eq('id', id);
		return { error };
	}
}
