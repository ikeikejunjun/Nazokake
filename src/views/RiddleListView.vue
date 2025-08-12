<template>
    <v-container class="py-8">
        <v-row justify="center">
            <v-col cols="12" sm="10" md="8" lg="6">
                <v-card elevation="6" class="pa-6 mb-6">
                    <v-card-title class="text-h5 text-center mb-4 d-flex align-center justify-space-between">
                        <span>なぞかけ一覧</span>
                        <v-checkbox
                            v-model="showAll"
                            label="全てのお題のなぞかけを表示"
                            hide-details
                            density="compact"
                            class="ml-4"
                            style="min-width:220px;"
                        />
                    </v-card-title>
                    <v-card-text>
                        <v-alert v-if="riddles.length === 0" type="info">なぞかけがありません</v-alert>
                        <v-list v-else>
                            <v-list-item v-for="riddle in riddles" :key="riddle.id" class="mb-4" :class="{
                                'my-riddle': riddle.user_id === authStore.currentProfile?.id
                            }">
                                <div class="riddle-sentence">
                                    <span class="font-weight-bold">{{ riddle.topics?.title || riddle.topic_id
                                        }}</span>とかけて<br>
                                    <span class="font-weight-bold">{{ riddle.toku }}</span>ととく。<br>
                                    その心は、どちらも<span class="font-weight-bold">{{ riddle.kokoro }}</span>
                                </div>
                                <div class="riddle-meta mt-2">
                                    <span class="font-weight-bold">【投稿者】</span>{{ riddle.profiles?.name ||
                                    riddle.user_id }}
                                    ／<span class="font-weight-bold">【投稿日時】</span>{{ formatDate(riddle.created_at) }}
                                </div>
                            </v-list-item>
                        </v-list>
                                        </v-card-text>
                                        <v-card-actions class="justify-end" style="flex-wrap: wrap;">
                                                <v-btn
                                                    v-if="hasMore"
                                                    color="secondary"
                                                    variant="outlined"
                                                    @click="fetchRiddles()"
                                                    class="mr-2 mb-2"
                                                >もっと見る</v-btn>
                                                <RouterLink to="/riddle/post">
                                                        <v-btn color="primary" prepend-icon="mdi-plus">なぞかけを投稿</v-btn>
                                                </RouterLink>
                                        </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { RiddleModel, type Riddle } from '@/models/riddle';
import { useSelectedTopicStore } from '@/stores/selected_topic';
import { useAuthStore } from '@/stores/auth';


const riddles = ref<Riddle[]>([]);
const selectedTopicStore = useSelectedTopicStore();
const authStore = useAuthStore();
const page = ref(1);
const pageSize = 50;
const hasMore = ref(true);
const showAll = ref(false);

const formatDate = (date: string) => {
    return new Date(date).toLocaleString('ja-JP');
};


const fetchRiddles = async (reset = false) => {
    if (reset) {
        riddles.value = [];
        page.value = 1;
        hasMore.value = true;
    }
    let data: Riddle[] = [];
    if (!showAll.value && selectedTopicStore.selectedTopic?.topics?.id) {
        data = await RiddleModel.fetchByTopicIdPaginated(selectedTopicStore.selectedTopic.topics.id, page.value, pageSize);
    } else {
        data = await RiddleModel.fetchAllPaginated(page.value, pageSize);
    }
    if (data.length < pageSize) {
        hasMore.value = false;
    }
    riddles.value = [...riddles.value, ...data];
    page.value++;
};


onMounted(() => {
    selectedTopicStore.fetchSelectedTopic();
    fetchRiddles(true);
});

watch(showAll, () => {
    fetchRiddles(true);
});
</script>

<style scoped>
.font-weight-bold {
    font-weight: bold;
}

.riddle-sentence {
    white-space: pre-line;
    word-break: break-all;
    font-size: 1.1em;
    line-height: 2;
}

.riddle-meta {
    font-size: 0.95em;
    color: #666;
}

.my-riddle {
    background: linear-gradient(90deg, #fffde7 60%, #fff9c4 100%);
    border-left: 6px solid #ffe082;
    border-radius: 8px;
}

.font-weight-bold {
    font-weight: bold;
}
</style>