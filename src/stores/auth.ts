// src/stores/auth.ts
import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/models/profile';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        currentProfile: null as Profile | null,
        email: '' as string,
    }),
    actions: {
        setProfile(profile: Profile, email: string) {
            this.currentProfile = profile;
            this.email = email;
        },
        clearProfile() {
            this.currentProfile = null;
            this.email = '';
        },
        async logout() {
            await supabase.auth.signOut();
            this.clearProfile();
        },
    },
    getters: {
        isLoggedIn: (state) => state.currentProfile != null,
    },
});
