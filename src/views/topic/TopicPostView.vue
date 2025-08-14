<template>
    <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
            <v-card elevation="6" class="pa-6">
                <v-form @submit.prevent="postTopic">
                    <v-text-field v-model="title" label="お題タイトル" required maxlength="100" class="mb-4"
                        prepend-inner-icon="mdi-format-title" />
                    <v-btn type="submit" color="primary" block size="large" class="mb-2">投稿</v-btn>
                </v-form>
                <v-alert v-if="errorMessage" type="error" class="mt-2">{{ errorMessage }}</v-alert>
                <v-alert v-if="successMessage" type="success" class="mt-2">{{ successMessage }}</v-alert>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">

import { ref } from 'vue';

import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { TopicModel } from '@/models/topic';

const title = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const authStore = useAuthStore();
const router = useRouter();

const postTopic = async () => {
    errorMessage.value = '';
    successMessage.value = '';
    if (!title.value) {
        errorMessage.value = 'お題タイトルを入力してください';
        return;
    }
    const newTopic = {
        title: title.value,
        created_by: authStore.currentProfile?.id ?? '',
    };
    const { error } = await TopicModel.create(newTopic);
    if (error) {
        errorMessage.value = error.message;
    } else {
        successMessage.value = 'お題投稿完了！';
        title.value = '';
        setTimeout(() => router.push('/topic'), 1000);
    }
};
</script>

<style scoped></style>