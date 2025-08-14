<template>
    <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
            <v-card elevation="6" class="pa-6">
                <v-card-text v-if="topic">
                    <div class="mb-2">
                        <span class="font-weight-bold">タイトル：</span>{{ topic.title }}
                    </div>
                    <div class="mb-2">
                        <span class="font-weight-bold">作成日：</span>{{ formatDate(topic.created_at) }}
                    </div>
                    <div class="mb-2">
                        <span class="font-weight-bold">作成者：</span>
                        <template v-if="topic.profiles && topic.profiles.name">
                            {{ topic.profiles.name }}
                        </template>
                        <template v-else>
                            {{ topic.created_by }}
                        </template>
                    </div>
                </v-card-text>
                <v-card-text v-else>
                    <v-alert type="error">お題が見つかりません</v-alert>
                </v-card-text>
                <v-card-actions>
                    <RouterLink to="/topic">
                        <v-btn color="primary" variant="text">一覧に戻る</v-btn>
                    </RouterLink>
                    <template v-if="selectedTopicStore.selectedTopic?.topics?.id === topic?.id">
                        <v-chip color="yellow-darken-2" class="ml-2">現在のお題です</v-chip>
                        <v-btn color="primary" variant="text" :disabled="true">現在のお題に設定する</v-btn>
                    </template>
                    <template v-else>
                        <v-btn color="primary" variant="text" @click="setCurrentTopic">現在のお題に設定する</v-btn>
                    </template>
                    <v-btn color="red" variant="text" @click="deleteTopic">削除</v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
    <v-alert v-if="errorMessage" type="error" class="mt-2">{{ errorMessage }}</v-alert>
</template>


<script setup lang="ts">

import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { TopicModel } from '@/models/topic';
import type { Topic } from '@/models/topic';
import { useSelectedTopicStore } from '@/stores/selected_topic';

const route = useRoute();
const router = useRouter();
const selectedTopicStore = useSelectedTopicStore();

const topic = ref<Topic | null>(null);
const errorMessage = ref('');

const fetchTopic = async () => {
    topic.value = await TopicModel.fetchById(route.params.id as string);
};

const setCurrentTopic = async () => {
    if (topic.value && selectedTopicStore.selectedTopic) {
        await selectedTopicStore.updateSelectedTopic(selectedTopicStore.selectedTopic.id, { topic_id: topic.value.id });
    }
};

const formatDate = (date: string) => {
    return new Date(date).toLocaleString('ja-JP');
};

const deleteTopic = async () => {
    if (topic.value) {
        const { error } = await TopicModel.delete(topic.value.id);
        if (error) {
            // エラー処理
            errorMessage.value = 'お題の削除に失敗しました';
            return;
        } else {
            // 削除成功時の処理
            router.push('/topic');
        }
    }
};

onMounted(() => {
    selectedTopicStore.fetchSelectedTopic();
    selectedTopicStore.subscribeRealtime();
    fetchTopic();
});
</script>

<style scoped></style>