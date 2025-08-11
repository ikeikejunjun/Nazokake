// src/stores/user.ts
import { defineStore } from 'pinia'

interface User {
    id: string
    email: string
}

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
        }
    },
    getters: {
        isLoggedIn: (state) => state.currentUser !== null
    }
})
