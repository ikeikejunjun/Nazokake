import { defineStore } from 'pinia';
import { ref } from 'vue';
import { SelectedTopicModel, type SelectedTopic } from '@/models/selected_topic';

export const useSelectedTopicStore = defineStore('selectedTopic', () => {
    // 最新のselected_topic（DBの1レコード）
    const selectedTopic = ref<SelectedTopic | null>(null);
    // ローディング状態
    const loading = ref(false);

    // Supabaseのrealtime購読用unsubscribe
    let channel: ReturnType<typeof SelectedTopicModel.subscribe> | null = null;

    // 最新のselected_topicを取得
    async function fetchSelectedTopic() {
        loading.value = true;
        const result = await SelectedTopicModel.fetchOne();
        selectedTopic.value = result;
        loading.value = false;
    }

    // selected_topicを更新
    async function updateSelectedTopic(id: string, update: Partial<Omit<SelectedTopic, 'id' | 'selected_at' | 'topics'>>) {
        loading.value = true;
        const result = await SelectedTopicModel.updateOne(id, update);
        if (!result.error) {
            await fetchSelectedTopic();
        }
        loading.value = false;
    }

    // Supabaseのrealtime購読開始
    function subscribeRealtime() {
        if (channel) channel.unsubscribe();
        channel = SelectedTopicModel.subscribe((data) => {
            selectedTopic.value = data;
        });
    }

    // 購読解除
    function unsubscribeRealtime() {
        if (channel) channel.unsubscribe();
        channel = null;
    }

    return {
        selectedTopic,
        loading,
        fetchSelectedTopic,
        updateSelectedTopic,
        subscribeRealtime,
        unsubscribeRealtime,
    };
});
