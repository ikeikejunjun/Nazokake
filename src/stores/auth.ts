// src/stores/auth.ts
import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabase';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLogin: false,
        user_id: '' as string,
        email: '' as string,
    }),
    actions: {
        setProfile(user_id: string, email: string) {
            this.user_id = user_id;
            this.email = email;
            this.isLogin = true;
        },
        clearProfile() {
            this.user_id = '';
            this.email = '';
            this.isLogin = false;
        },
        // ログアウト
        async logout() {
            await supabase.auth.signOut();
            this.clearProfile();
        },
        // セッションの復元
        async restoreSession() {
            const { data, error } = await supabase.auth.getSession();
            if (error || !data.session) {
                console.error('Error restoring session:', error);
                this.clearProfile();
                return;
            }
            this.setProfile(data.session.user.id, data.session.user.email ?? '');
        }
    },
    getters: {
        isLoggedIn: (state) => state.isLogin,
    },
});
