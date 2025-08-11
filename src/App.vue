<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const router = useRouter();

const handleLogout = async () => {
  await userStore.logout();
  router.push('/login');
};
</script>

<template>
  <v-app>
    <v-app-bar color="primary" dark flat>
      <v-toolbar-title class="font-weight-bold">UPN謎かけアプリ</v-toolbar-title>
      <v-spacer />
      <template v-if="userStore.isLoggedIn">
        <RouterLink to="/riddle">
          <v-btn icon variant="text" color="white" title="Home">
            <v-icon>mdi-home</v-icon>
          </v-btn>
        </RouterLink>
        <v-btn icon variant="text" color="white" title="Logout" @click="handleLogout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </template>
      <template v-else>
        <RouterLink to="/login">
          <v-btn icon variant="text" color="white" title="Login">
            <v-icon>mdi-login</v-icon>
          </v-btn>
        </RouterLink>
      </template>
    </v-app-bar>
    <v-main class="bg-grey-lighten-5">
      <v-container class="py-8">
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
/* Vuetifyベースのため追加CSSは最小限 */
</style>