<template>
    <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
            <RiddleListCard :riddles="riddles" :hasMore="hasMore" :showAll="showAll"
                :currentUserId="authStore.currentProfile?.id" @fetch-more="fetchRiddles"
                @update:showAll="val => { showAll = val; }">
                <template #actions>
                    <RouterLink to="/riddle/post">
                        <v-btn color="primary" prepend-icon="mdi-plus">なぞかけを投稿</v-btn>
                    </RouterLink>
                </template>
            </RiddleListCard>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { RiddleModel, type Riddle } from '@/models/riddle';
import { useSelectedTopicStore } from '@/stores/selected_topic';
import { useAuthStore } from '@/stores/auth';
import RiddleListCard from '@/components/RiddleListCard.vue';


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