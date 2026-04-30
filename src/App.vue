<script setup>
import { computed } from 'vue'
import { useMdiStore } from '@/stores/mdi'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTabBar from '@/components/layout/AppTabBar.vue'
import OrderInquiry from '@/views/OrderInquiry.vue'
import ClaimManagement from '@/views/ClaimManagement.vue'

const mdiStore = useMdiStore()

const componentMap = {
  OrderInquiry,
  ClaimManagement,
}

const activeComponent = computed(() =>
  mdiStore.activeTabName ? componentMap[mdiStore.activeTabName] : null
)
</script>

<template>
  <div class="app-layout">
    <AppSidebar />
    <div class="main-area">
      <AppTabBar />
      <div class="content-area">
        <keep-alive>
          <component
            :is="activeComponent"
            v-if="activeComponent"
          />
        </keep-alive>
        <div v-if="!activeComponent" class="welcome">
          <div class="welcome-inner">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e0" stroke-width="1.5">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            <p class="welcome-text">Select a menu from the sidebar to get started.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--content-bg);
}

.content-area {
  flex: 1;
  overflow-y: auto;
  background: var(--content-bg);
}

.welcome {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.welcome-text {
  color: var(--text-secondary);
  font-size: 14px;
}
</style>
