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
    path: '/auth/invite',
    name: 'Invite',
    component: InviteView,
    meta: { requiresAuth: true } // 管理者のみアクセス想定
  },
  {
    path: '/auth/signup',
    name: 'SignUp',
    component: SignUpView
  },
  {
    path: '/:pathMatch(.*)*', // 404用
    redirect: '/login'
  },
  {
    path: '/profile/edit',
    name: 'ProfileEdit',
    component: ProfileEditView,
    meta: { requiresAuth: true } // 認証が必要なルート
  },
  {
    path: '/profile/:id',
    name: 'ProfileDetail',
    component: ProfileDetailView,
    meta: { requiresAuth: true } // 認証が必要なルート
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