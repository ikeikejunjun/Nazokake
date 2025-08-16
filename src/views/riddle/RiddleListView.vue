<template>
    <v-container>
        <v-col cols="12" class="text-h5 text-center mb-4 d-flex align-center justify-space-between">
            <v-checkbox v-if="showAll !== undefined" v-model="showAll" label="全部の謎かけを表示" hide-details
                density="compact" class="ml-4" />
            <RouterLink to="/riddle/post">
                <v-btn color="primary" prepend-icon="mdi-plus">投稿</v-btn>
            </RouterLink>
        </v-col>
        <RiddleListCard :riddles="riddles" :hasMore="hasMore" :currentUserId="authStore.user_id"
            @fetch-more="fetchRiddles" />
    </v-container>
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

onMounted(async () => {
    // fetchSelectedTopicの完了を待つ
    await selectedTopicStore.fetchSelectedTopic();
    fetchRiddles(true);
});

watch(showAll, () => {
    fetchRiddles(true);
});

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
</script>

<style scoped></style>