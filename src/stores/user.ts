// src/stores/user.ts
import { defineStore } from 'pinia'

interface User {
    id: string
    email: string
}


import { supabase } from '@/lib/supabase';

export const useUserStore = defineStore('user', {
    state: () => ({
        currentUser: null as User | null
    }),
    actions: {
        setUser(user: User) {
            this.currentUser = user
        },
        clearUser() {
            this.currentUser = null
        },
        async logout() {
            await supabase.auth.signOut();
            this.clearUser();
        }
    },
    getters: {
        isLoggedIn: (state) => state.currentUser !== null
    }
})
