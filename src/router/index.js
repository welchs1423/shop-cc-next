import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { title: 'Dashboard' },
  },
  {
    path: '/order-inquiry',
    name: 'OrderInquiry',
    component: () => import('@/views/OrderInquiry.vue'),
    meta: { title: 'Order Inquiry' },
  },
  {
    path: '/claim-management',
    name: 'ClaimManagement',
    component: () => import('@/views/ClaimManagement.vue'),
    meta: { title: 'Claim Management' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
