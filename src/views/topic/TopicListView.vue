<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card v-for="topic in topics" :key="topic.id" class="mb-3" @click="goDetail(topic.id)" hover
                    :color="selectedTopic?.topics?.id === topic.id ? 'primary' : undefined"
                    :class="selectedTopic?.topics?.id === topic.id ? 'selected-topic-card' : ''">
                    <v-card-title>
                        {{ topic.title }}
                        <v-chip v-if="selectedTopic?.topics?.id === topic.id" color="yellow-darken-2" size="small"
                            class="ml-2">選択中</v-chip>
                    </v-card-title>
                    <v-card-subtitle>
                        <span class="font-weight-bold">【投稿者】</span>{{ topic.profiles?.name || topic.created_by }}
                        ／<span class="font-weight-bold">【投稿日時】</span> {{ formatDate(topic.created_at) }}
                    </v-card-subtitle>
                </v-card>
            </v-col>
        </v-row>
        <v-col cols="12" class="d-flex justify-end mb-4">
            <RouterLink to="/topic/post">
                <v-btn color="primary" prepend-icon="mdi-plus">お題を投稿</v-btn>
            </RouterLink>
        </v-col>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { TopicModel } from '@/models/topic';
import type { Topic } from '@/models/topic';
import { useSelectedTopicStore } from '@/stores/selected_topic';
import { storeToRefs } from 'pinia';

const topics = ref<Topic[]>([]);
const router = useRouter();
const selectedTopicStore = useSelectedTopicStore();
const { selectedTopic } = storeToRefs(selectedTopicStore);

const fetchTopics = async () => {
    try {
        topics.value = await TopicModel.fetchAll();
    } catch (e) {
        // エラー処理（必要ならアラート等）
    }
};

const goDetail = (id: string) => {
    router.push(`/topic/${id}`);
};

const formatDate = (date: string) => {
    return new Date(date).toLocaleString('ja-JP');
};

onMounted(() => {
    fetchTopics();
    selectedTopicStore.fetchSelectedTopic();
    selectedTopicStore.subscribeRealtime();
});
</script>

<style scoped>
.v-card {
    cursor: pointer;
    transition: box-shadow 0.2s;
}

.v-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.selected-topic-card {
    border: 2px solid #ffeb3b;
    box-shadow: 0 0 12px #ffe082;
}
</style>