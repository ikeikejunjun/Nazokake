<template>
    <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
            <v-card elevation="6" class="pa-6">
                <v-card-text>
                    <div class="mb-4 text-center">
                        <span v-if="email">{{ email }}</span>
                    </div>
                    <v-form @submit.prevent="onSignUp" ref="formRef" v-model="valid">
                        <v-text-field v-model="password" label="パスワード" :rules="passwordRules" type="password" required
                            autocomplete="new-password" class="mb-4" />
                        <v-btn :loading="loading" color="primary" type="submit" block>パスワードを設定</v-btn>
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '@/lib/supabase';

const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const valid = ref(true);
const formRef = ref();
const router = useRouter();
const route = useRoute();

const passwordRules = [
    (v: string) => !!v || 'パスワードは必須です',
    (v: string) => v.length >= 6 || '6文字以上で入力してください',
];

onMounted(async () => {
    email.value = route.query.email as string || '';
    // Supabaseの招待リンクのtokenとtypeを取得する
    const token = route.query.token as string || '';
    const type = route.query.type as string || '';
    if (token) {
        const { data, error } = await supabase.auth.verifyOtp({
            type: 'signup',
            token,
            email: email.value
        });
        if (error) {
            errorMessage.value = error.message;
        }
    }
});

const onSignUp = async () => {
    errorMessage.value = '';
    successMessage.value = '';
    if (!valid.value) return;
    if (!email.value) {
        errorMessage.value = 'メールアドレスが取得できません。招待メールのリンクからアクセスしてください。';
        return;
    }
    loading.value = true;
    // パスワード設定API（Supabaseのinviteフローに合わせて適宜実装）
    const { error } = await supabase.auth.updateUser({ password: password.value });
    loading.value = false;
    if (error) {
        errorMessage.value = error.message;
    } else {
        successMessage.value = 'パスワードを設定しました。ログインしてください。';
        setTimeout(() => {
            router.push('/login');
        }, 2000);
    }
};
</script>

<style scoped>
.text-center {
    text-align: center;
}
</style>
