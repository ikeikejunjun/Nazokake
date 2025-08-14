<template>
    <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
            <v-card elevation="6" class="pa-6">
                <v-card-text>
                    <v-form @submit.prevent="onInvite" ref="formRef" v-model="valid">
                        <v-text-field v-model="inviteEmail" label="招待するメールアドレス" :rules="emailRules" type="email"
                            required autocomplete="email" class="mb-4" />
                        <v-btn :loading="loading" color="primary" type="submit" block>招待メールを送信</v-btn>
                    </v-form>
                    <v-alert v-if="errorMessage" type="error" class="mt-4">{{ errorMessage }}</v-alert>
                    <v-alert v-if="successMessage" type="success" class="mt-4">{{ successMessage }}</v-alert>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { supabase } from '@/lib/supabase';

const inviteEmail = ref('');
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const valid = ref(true);
const formRef = ref();

const emailRules = [
    (v: string) => !!v || 'メールアドレスは必須です',
    (v: string) => /.+@.+\..+/.test(v) || '有効なメールアドレスを入力してください',
];

const onInvite = async () => {
    errorMessage.value = '';
    successMessage.value = '';
    if (!valid.value) return;
    loading.value = true;
    // サインアップ用の招待メールを送信
    const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;
    const { error } = await supabase.auth.admin.inviteUserByEmail(inviteEmail.value, {
        redirectTo: baseUrl + '/auth/signup',
    });
    loading.value = false;
    if (error) {
        errorMessage.value = error.message;
    } else {
        successMessage.value = '招待メールを送信しました。';
        inviteEmail.value = '';
    }
};
</script>

<style scoped>
.text-center {
    text-align: center;
}
</style>
