<template>
    <v-container class="py-8">
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6" lg="4">
                <v-card elevation="6" class="pa-6">
                    <v-card-title class="text-h5 text-center mb-4">アカウント新規登録</v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="onSignUp" ref="formRef" v-model="valid">
                            <v-text-field v-model="email" label="メールアドレス" :rules="emailRules" type="email" required
                                autocomplete="email" class="mb-4" />
                            <v-text-field v-model="password" label="パスワード" :rules="passwordRules" type="password"
                                required autocomplete="new-password" class="mb-4" />
                            <v-btn :loading="loading" color="primary" type="submit" block>登録</v-btn>
                        </v-form>
                        <v-alert v-if="errorMessage" type="error" class="mt-4">{{ errorMessage }}</v-alert>
                        <v-alert v-if="successMessage" type="success" class="mt-4">{{ successMessage }}</v-alert>
                        <div class="mt-4 text-center">
                            <RouterLink to="/login">ログインはこちら</RouterLink>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/lib/supabase';

const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const valid = ref(true);
const formRef = ref();
const router = useRouter();

const emailRules = [
    (v: string) => !!v || 'メールアドレスは必須です',
    (v: string) => /.+@.+\..+/.test(v) || '有効なメールアドレスを入力してください',
];
const passwordRules = [
    (v: string) => !!v || 'パスワードは必須です',
    (v: string) => v.length >= 6 || '6文字以上で入力してください',
];

const onSignUp = async () => {
    errorMessage.value = '';
    successMessage.value = '';
    if (!valid.value) return;
    loading.value = true;
    // VITE_BASE_URLは.envで定義されている前提
    const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;
    const { error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
            emailRedirectTo: baseUrl + '/login'
        }
    });
    loading.value = false;
    if (error) {
        errorMessage.value = error.message;
    } else {
        successMessage.value = '確認メールを送信しました。メールをご確認ください。';
        setTimeout(() => {
            router.push('/login');
        }, 3000);
    }
};
</script>

<style scoped>
.text-center {
    text-align: center;
}
</style>
