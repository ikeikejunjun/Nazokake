<template>
    <v-container class="py-8">
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6" lg="4">
                <v-card elevation="6" class="pa-6 mb-6">
                    <v-card-title class="text-h5 text-center mb-4">プロフィール詳細</v-card-title>
                    <v-card-text>
                        <div class="mb-4">
                            <div class="font-weight-bold text-lg mb-2">{{ profile?.name || '未設定' }}</div>
                            <div class="mb-2" style="white-space: pre-line; color: #666;">{{ profile?.bio }}</div>
                            <div>{{ route.params.id }}</div>
                        </div>
                        <div class="mb-2 font-weight-bold">過去のなぞかけ投稿</div>
                        <RiddleListCard :riddles="riddles" :hasMore="true" :currentUserId="profile?.id" />
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ProfileModel } from '@/models/profile';
import { RiddleModel, type Riddle } from '@/models/riddle';

const route = useRoute();
const profile = ref<any>(null);
const riddles = ref<Riddle[]>([]);

const formatDate = (date: string) => {
    return new Date(date).toLocaleString('ja-JP');
};

onMounted(async () => {
    const userId = route.params.id as string;
    profile.value = await ProfileModel.fetchById(userId);
    riddles.value = await RiddleModel.fetchByUserId(userId);
});
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
