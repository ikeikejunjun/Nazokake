import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore } from '@/stores/auth'; // Piniaユーザーストアのインポート

// ページコンポーネントのインポート

import LoginView from '@/views/auth/LoginView.vue';
import RiddlePostView from '@/views/riddle/RiddlePostView.vue';
import RiddleListView from '@/views/riddle/RiddleListView.vue';
import TopicDetailView from '@/views/topic/TopicDetailView.vue';
import TopicPostView from '@/views/topic/TopicPostView.vue';
import TopicListView from '@/views/topic/TopicListView.vue';
import InviteView from '@/views/auth/InviteView.vue';
import SignUpView from '@/views/auth/SignUpView.vue';
import ProfileEditView from '@/views/profile/ProfileEditView.vue';
import ProfileDetailView from '@/views/profile/ProfileDetailView.vue';


// ルート定義
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
  {
    path: '/',
    redirect: '/riddle', // 初期アクセスは謎かけへ
    meta: { requiresAuth: true } // 認証が必要なルート
  },
  {
    path: '/login',
    name: 'ログイン',
    component: LoginView
  },
  {
    path: '/riddle',
    name: '謎かけ',
    component: RiddleListView,
    meta: { requiresAuth: true } // 認証が必要なルート
  },
  {
    path: '/riddle/post',
    name: '謎かけ 投稿',
    component: RiddlePostView,
    meta: { requiresAuth: true } // 認証が必要なルート
  },
  {
    path: '/topic',
    name: 'お題',
    component: TopicListView,
    meta: { requiresAuth: true } // 認証が必要なルート
  },
  {
    path: '/topic/:id',
    name: 'お題 詳細',
    component: TopicDetailView,
    meta: { requiresAuth: true } // 認証が必要なルート
  },
  {
    path: '/topic/post',
    name: 'お題 投稿',
    component: TopicPostView,
    meta: { requiresAuth: true } // 認証が必要なルート
  },
  {
    path: '/auth/invite',
    name: 'ユーザー招待',
    component: InviteView,
    meta: { requiresAuth: true } // 管理者のみアクセス想定
  },
  {
    path: '/auth/signup',
    name: 'ユーザー登録',
    component: SignUpView
  },
  {
    path: '/:pathMatch(.*)*', // 404用
    redirect: '/login'
  },
  {
    path: '/profile/edit',
    name: 'プロフィール編集',
    component: ProfileEditView,
    meta: { requiresAuth: true } // 認証が必要なルート
  },
  {
    path: '/profile/:id',
    name: 'プロフィール詳細',
    component: ProfileDetailView,
    meta: { requiresAuth: true } // 認証が必要なルート
  }
]});

// ルートガード設定
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const authStore = useAuthStore();
    if (!authStore.isLoggedIn) {
      next({ name: 'ログイン' });
      return;
    }
  }
  next();
});

export default router;