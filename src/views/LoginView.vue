<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-row justify="center" align="center" style="width:100%;">
      <v-col cols="12" sm="8" md="4">
        <v-card elevation="8" class="pa-6">
          <v-card-title class="text-h5 text-center mb-4">ログイン</v-card-title>
          <v-form @submit.prevent="login">
            <v-text-field
              v-model="email"
              label="メールアドレス"
              type="email"
              class="mb-4"
              required
              prepend-inner-icon="mdi-email"
              autocomplete="username"
            />
            <v-text-field
              v-model="password"
              label="パスワード"
              type="password"
              class="mb-4"
              required
              prepend-inner-icon="mdi-lock"
              autocomplete="current-password"
            />
            <v-btn type="submit" color="primary" block size="large" class="mb-2">ログイン</v-btn>
          </v-form>
          <v-alert v-if="errorMessage" type="error" class="mt-2">{{ errorMessage }}</v-alert>
          <v-alert v-if="userEmail" type="success" class="mt-2">ログイン成功！こんにちは、{{ userEmail }} さん</v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // Piniaユーザーストアのインポート
import type { Profile } from '@/models/profile';
import { ProfileModel } from '@/models/profile';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const userEmail = ref('');
const authStore = useAuthStore();
const userProfile = ref<Profile | null>(null);

const login = async () => {
    errorMessage.value = '';
    userEmail.value = '';
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
    });

    if (error) {
        errorMessage.value = error.message;
    } else {
        userProfile.value = await ProfileModel.fetchById(data.user.id);
        if (!userProfile.value) {
            errorMessage.value = 'ユーザープロフィールが見つかりません';
            return;
        }
        authStore.setProfile(
            userProfile.value!,
            data.user.email ?? ''
        )
        await router.push('/riddle');
    }
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>