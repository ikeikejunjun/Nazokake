
<template>
    <v-container class="d-flex align-center justify-center" style="min-height: 80vh;">
        <v-row justify="center" align="center" style="width:100%;">
            <v-col cols="12" sm="8" md="6">
                <v-card elevation="8" class="pa-6">
                    <v-card-title class="text-h5 text-center mb-4">お題を投稿</v-card-title>
                    <v-form @submit.prevent="postTopic">
                        <v-text-field
                            v-model="title"
                            label="お題タイトル"
                            required
                            maxlength="100"
                            class="mb-4"
                            prepend-inner-icon="mdi-format-title"
                        />
                        <v-btn type="submit" color="primary" block size="large" class="mb-2">投稿</v-btn>
                    </v-form>
                    <v-alert v-if="errorMessage" type="error" class="mt-2">{{ errorMessage }}</v-alert>
                    <v-alert v-if="successMessage" type="success" class="mt-2">{{ successMessage }}</v-alert>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
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

<style scoped>
</style>