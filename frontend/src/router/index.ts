import { createRouter, createWebHistory } from 'vue-router'
import LoginScreen from '@/views/LoginScreen.vue'

const routes = [
  { path: '/', component: LoginScreen },
  { path: '/candidates', component: () => import('@/views/CandidateManagement.vue') },
  { path: '/vote', component: () => import('@/views/VoteView.vue') },
  { path: '/results', component: () => import('@/views/ResultsView.vue') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router