<script setup>
import { useRouter } from 'vue-router'
import { useMdiStore } from '@/stores/mdi'

const router = useRouter()
const mdiStore = useMdiStore()

const menuItems = [
  { name: 'OrderInquiry', title: 'Order Inquiry', path: '/order-inquiry' },
  { name: 'ClaimManagement', title: 'Claim Management', path: '/claim-management' },
]

function handleMenuClick(item) {
  mdiStore.openTab(item)
  router.push(item.path)
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <span class="logo-text">Shop CC</span>
    </div>
    <nav class="sidebar-nav">
      <ul>
        <li
          v-for="item in menuItems"
          :key="item.name"
          class="nav-item"
          :class="{ active: mdiStore.activeTabName === item.name }"
          @click="handleMenuClick(item)"
        >
          <span class="nav-icon">
            <svg v-if="item.name === 'OrderInquiry'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="1"/>
              <line x1="9" y1="12" x2="15" y2="12"/>
              <line x1="9" y1="16" x2="13" y2="16"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </span>
          <span class="nav-label">{{ item.title }}</span>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  background: var(--sidebar-bg);
  color: var(--sidebar-text);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  height: 100%;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 56px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.logo-text {
  font-size: 17px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.5px;
}

.sidebar-nav {
  flex: 1;
  padding: 12px 0;
  overflow-y: auto;
}

.sidebar-nav ul {
  list-style: none;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 0;
  transition: background 0.15s;
  color: var(--sidebar-text);
  user-select: none;
}

.nav-item:hover {
  background: var(--sidebar-hover);
  color: #ffffff;
}

.nav-item.active {
  background: var(--sidebar-active);
  color: #ffffff;
}

.nav-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.nav-label {
  font-size: 13.5px;
  font-weight: 500;
}
</style>
