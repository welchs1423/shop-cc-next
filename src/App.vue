<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMdiStore } from '@/stores/mdi'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTabBar from '@/components/layout/AppTabBar.vue'

const route = useRoute()
const mdiStore = useMdiStore()

watch(
  () => route.name,
  (name) => {
    if (name && mdiStore.tabs.some(t => t.name === name) && mdiStore.activeTabName !== String(name)) {
      mdiStore.activateTab(String(name))
    }
  }
)
</script>

<template>
  <div class="app-layout">
    <AppSidebar />
    <div class="main-area">
      <AppTabBar />
      <div class="content-area">
        <router-view v-slot="{ Component, route: currentRoute }">
          <keep-alive>
            <component
              v-if="Component && mdiStore.activeTab"
              :is="Component"
              :key="currentRoute.fullPath"
            />
          </keep-alive>
        </router-view>
        <div v-if="!mdiStore.activeTab" class="welcome">
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
