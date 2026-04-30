import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
  },
  {
    path: '/order-inquiry',
    name: 'OrderInquiry',
    meta: { title: 'Order Inquiry' },
  },
  {
    path: '/claim-management',
    name: 'ClaimManagement',
    meta: { title: 'Claim Management' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
