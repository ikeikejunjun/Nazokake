import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore } from '@/stores/auth'; // Piniaユーザーストアのインポート

// ページコンポーネントのインポート
import LoginView from '@/views/LoginView.vue';
import RiddlePostView from '@/views/RiddlePostView.vue';
import RiddleListView from '@/views/RiddleListView.vue';
import TopicDetailView from '@/views/TopicDetailView.vue';
import TopicPostView from '@/views/TopicPostView.vue';
import TopicListView from '@/views/TopicListView.vue';


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
    name: 'Riddle',
    component: RiddleListView,
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
    path: '/topic/:id',
    name: 'TopicDetail',
    component: TopicDetailView,
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
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const authStore = useAuthStore();
    if (!authStore.isLoggedIn) {
      next({ name: 'Login' });
      return;
    }
  }
  next();
});

export default router;