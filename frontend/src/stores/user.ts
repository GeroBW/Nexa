import { defineStore } from 'pinia'
import { ref } from 'vue'



export const useUserStore = defineStore('user', () => {
    const username = ref('')
    const email = ref('')
    const id = ref('')
    const token = ref('')


    function setUser(userData: { username: string, email: string, id: string, token: string }) {
        username.value = userData.username
        email.value = userData.email
        id.value = userData.id
        token.value = userData.token
    }

    function clearUser() {
        username.value = ''
        email.value = ''
        token.value = ''
    }

    return { username, email, token, setUser, clearUser }
})