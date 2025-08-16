<template>
  <v-app>
    <div v-if="showLogo" class="logo-overlay">
      <img v-if="showLogoImg" src="@/images/upn_logo.jpg" alt="UPNロゴ" class="logo-img" />
    </div>
    <v-app-bar color="primary" dark flat>
      <v-toolbar-title class="font-weight-bold text-center w-100">
        UPN
        <RouterLink to="/auth/invite" class="stealth-link">謎かけ</RouterLink>
        アプリ
      </v-toolbar-title>
    </v-app-bar>
    <v-main class="bg-grey-lighten-5">
      <div v-if="currentViewName" class="view-title">
        <h2>{{ currentViewName }}</h2>
      </div>
      <v-container class="py-1">
        <RouterView />
      </v-container>
    </v-main>
    <v-footer app color="white" class="justify-center">
      <div class="d-flex align-center justify-center" style="width:100%;">
        <template v-if="authStore.isLoggedIn">
          <RouterLink to="/riddle">
            <v-btn icon variant="text" color="primary" title="Home">
              <v-icon>mdi-home</v-icon>
            </v-btn>
          </RouterLink>
          <RouterLink to="/topic">
            <v-btn icon variant="text" color="primary" title="Topic一覧">
              <v-icon>mdi-lightbulb-outline</v-icon>
            </v-btn>
          </RouterLink>
          <RouterLink to="/profile/edit">
            <v-btn icon variant="text" color="primary" title="プロフィール編集">
              <v-icon>mdi-account-edit</v-icon>
            </v-btn>
          </RouterLink>
          <v-btn icon variant="text" color="primary" title="Logout" @click="handleLogout">
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </template>
        <template v-else>
          <RouterLink to="/login">
            <v-btn icon variant="text" color="primary" title="Login">
              <v-icon>mdi-login</v-icon>
            </v-btn>
          </RouterLink>
        </template>
      </div>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ref, watch, nextTick, onMounted, watchEffect } from 'vue';
import gsap from 'gsap';

const authStore = useAuthStore();
const router = useRouter();
import { useRoute } from 'vue-router';
const route = useRoute();
// ...既存のimportにwatchEffectを追加済みなので削除

const currentViewName = ref('');
watchEffect(() => {
  currentViewName.value = route.name ? String(route.name) : '';
});

const showLogo = ref(false);
const showLogoImg = ref(false);
let logoTimeouts: number[] = [];

function clearLogoTimeouts() {
  logoTimeouts.forEach(id => clearTimeout(id));
  logoTimeouts = [];
}

watch(() => authStore.isLoggedIn, async (val) => {
  clearLogoTimeouts();
  if (val) {
    showLogo.value = true;
    showLogoImg.value = false;
    await nextTick();
    // まず白背景のみ表示
    logoTimeouts.push(window.setTimeout(async () => {
      showLogoImg.value = true;
      await nextTick();
      gsap.fromTo('.logo-img', { opacity: 0 }, { opacity: 1, duration: 0.7 });
      // 1秒後にロゴをフェードアウト
      logoTimeouts.push(window.setTimeout(() => {
        gsap.to('.logo-img', {
          opacity: 0, duration: 0.7, onComplete: () => {
            showLogo.value = false;
            showLogoImg.value = false;
          }
        });
      }, 1000));
    }, 300)); // 0.3秒白背景のみ
  } else {
    showLogo.value = false;
    showLogoImg.value = false;
  }
});

onMounted(async () => {
  // ページ遷移やリロード時にタイムアウトをクリア
  window.addEventListener('beforeunload', clearLogoTimeouts);
  await authStore.restoreSession();
});

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.logo-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-img {
  max-width: 300px;
  width: 60vw;
  height: auto;
  filter: drop-shadow(0 2px 16px rgba(0, 0, 0, 0.15));
}

/* GSAPで制御するためトランジションは不要 */

/* リンク感を消す（stealth-link） */
.stealth-link {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}

.stealth-link:visited,
.stealth-link:active,
.stealth-link:hover,
.stealth-link:focus {
  color:inherit;
  text-decoration: none;
}

.view-title {
  background: #fff;
  margin-top: 2px;
  margin-bottom: 2px;
  width: 100vw;
  left: 0;
  position: relative;
  padding: 16px 0;
  border-radius: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  text-align: center;
}

.view-title h2 {
  margin: 0;
  font-weight: normal;
  font-size: 1.3rem;
  color: #000;
}
</style>