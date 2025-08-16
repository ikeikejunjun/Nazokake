<template>
    <v-row justify="center">
        <v-col cols="12" sm="12" md="10" lg="8">
            <v-card elevation="6" class="pa-6">
                <v-card-text>
                    <v-form @submit.prevent="onSave" ref="formRef" v-model="valid">
                        <v-text-field v-model="name" label="名前" :rules="nameRules" required class="mb-4" />
                        <v-textarea v-model="bio" label="自己紹介（最大500文字）" :rules="bioRules" counter="500" maxlength="500"
                            rows="5" class="mb-4" />
                        <v-btn :loading="loading" color="primary" type="submit" block>保存</v-btn>
                    </v-form>
                    <v-alert v-if="errorMessage" type="error" class="mt-4">{{ errorMessage }}</v-alert>
                    <v-alert v-if="successMessage" type="success" class="mt-4">{{ successMessage }}</v-alert>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { ProfileModel } from '@/models/profile';

const authStore = useAuthStore();
const name = ref('');
const bio = ref('');
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const valid = ref(true);
const formRef = ref();

const nameRules = [
    (v: string) => !!v || '名前は必須です',
    (v: string) => v.length <= 50 || '50文字以内で入力してください',
];
const bioRules = [
    (v: string) => v.length <= 500 || '500文字以内で入力してください',
];

onMounted(async () => {
    // ログインユーザーのプロフィール取得
    const profile = await ProfileModel.fetchById(authStore.user_id);
    if (profile) {
        name.value = profile.name || '';
        bio.value = profile.bio || '';
    }
});

const onSave = async () => {
    errorMessage.value = '';
    successMessage.value = '';
    if (!valid.value) return;
    loading.value = true;
    const { error } = await ProfileModel.update(authStore.user_id, {
        name: name.value,
        bio: bio.value,
    });
    loading.value = false;
    if (error) {
        errorMessage.value = error.message;
    } else {
        successMessage.value = 'プロフィールを更新しました。';
    }
};
</script>

<style scoped>
.text-center {
    text-align: center;
}
</style>
