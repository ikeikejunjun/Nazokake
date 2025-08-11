import { createRouter, createWebHistory } from 'vue-router';

import { supabase } from '@/lib/supabase'; // Supabaseのインポート
import { useUserStore } from '@/stores/user'; // Piniaユーザーストアのインポート

// ページコンポーネントのインポート
import LoginView from '@/views/LoginView.vue';
import RiddlePostView from '@/views/RiddlePostView.vue';
import RiddleHistoryView from '@/views/RiddleHistoryView.vue';
import TopicSettingsView from '@/views/TopicSettingsView.vue';
import TopicPostView from '@/views/TopicPostView.vue';
import TopicListView from '@/views/TopicList.vue';


// ルート定義
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
  {
    path: '/',
    redirect: '/login' // 初期アクセスはログインへ
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/riddle',
    name: 'RiddleHistory',
    component: RiddleHistoryView,
    meta: { requiresAuth: true } // 認証が必要なルート
  },
  {
    path: '/riddle/post',
    name: 'RiddlePost',
    component: RiddlePostView,
    meta: { requiresAuth: true } // 認証が必要なルート
  },
  {
    path: '/topic',
    name: 'Topic',
    component: TopicListView,
    meta: { requiresAuth: true } // 認証が必要なルート
  },
  {
    path: '/topic/settings',
    name: 'TopicSettings',
    component: TopicSettingsView,
    meta: { requiresAuth: true } // 認証が必要なルート
  },
  {
    path: '/topic/post',
    name: 'TopicPost',
    component: TopicPostView,
    meta: { requiresAuth: true } // 認証が必要なルート
  },
  {
    path: '/:pathMatch(.*)*', // 404用
    redirect: '/login'
  }
]});

// ルートガード設定
router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const userStore = useUserStore();
    if (!userStore.isLoggedIn) {
      return { name: 'login' };
    }
  }
});

export default router;