<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card v-for="topic in topics" :key="topic.id" class="mb-3" @click="goDetail(topic.id)" hover>
                    <v-card-title>{{ topic.title }}</v-card-title>
                    <v-card-subtitle>作成日: {{ formatDate(topic.created_at) }}</v-card-subtitle>
                    <v-card-text>作成者：{{ topic.profiles?.name || topic.created_by }}</v-card-text>
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

const topics = ref<Topic[]>([]);
const router = useRouter();

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

onMounted(fetchTopics);
</script>

<style scoped>
.v-card {
    cursor: pointer;
    transition: box-shadow 0.2s;
}

.v-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}
</style>