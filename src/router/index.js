import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/order-inquiry',
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
