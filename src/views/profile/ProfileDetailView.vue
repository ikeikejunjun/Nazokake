<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="12" md="10" lg="8">
                <v-card elevation="6" class="pa-6">
                    <v-card-text>
                        <div class="mb-4">
                            <div class="font-weight-bold text-lg mb-2">{{ profile?.name || '未設定' }}</div>
                            <div class="mb-2" style="white-space: pre-line; color: #666;">{{ profile?.bio }}</div>
                            <div>{{ route.params.id }}</div>
                        </div>
                        <div class="mb-2 pa-2 font-weight-bold">過去のなぞかけ投稿</div>
                        <RiddleListCard :riddles="riddles" :hasMore="hasMore" :currentUserId="authStore.currentProfile?.id"
                            @fetch-more="fetchRiddles" />
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ProfileModel } from '@/models/profile';
import { RiddleModel, type Riddle } from '@/models/riddle';
import RiddleListCard from '@/components/RiddleListCard.vue';

// ルーター関係
const route = useRoute();
const authStore = useAuthStore();
// プロフィール関係
const profile = ref<any>(null);
// 謎かけ関係
const riddles = ref<Riddle[]>([]);
const page = ref(1);
const pageSize = 50;
const hasMore = ref(true);

// 初期表示処理
onMounted(async () => {
    const userId = route.params.id as string;
    profile.value = await ProfileModel.fetchById(userId);
    fetchRiddles();
});

// なぞかけの取得
const fetchRiddles = async (reset = false) => {
    if (reset) {
        riddles.value = [];
        page.value = 1;
        hasMore.value = true;
    }
    let data = await RiddleModel.fetchByUserIdPaginated(profile.value.id, page.value, pageSize);
    if (data.length < pageSize) {
        hasMore.value = false;
    }
    riddles.value = [...riddles.value, ...data];
    page.value++;
};
</script>

<style scoped>
.font-weight-bold {
    font-weight: bold;
}

.riddle-sentence {
    white-space: pre-line;
    word-break: break-all;
    font-size: 1.05em;
    line-height: 2;
}

.riddle-meta {
    font-size: 0.95em;
    color: #666;
}
</style>
