<script setup>
import { useRouter } from 'vue-router'
import { useMdiStore } from '@/stores/mdi'

const router = useRouter()
const mdiStore = useMdiStore()

function activateTab(tab) {
  mdiStore.activateTab(tab.name)
  router.push(tab.path)
}

function closeTab(event, tab) {
  event.stopPropagation()
  mdiStore.closeTab(tab.name)
  if (mdiStore.activeTab) {
    router.push(mdiStore.activeTab.path)
  }
}
</script>

<template>
  <div class="tab-bar" v-if="mdiStore.tabs.length > 0">
    <div
      v-for="tab in mdiStore.tabs"
      :key="tab.name"
      class="tab"
      :class="{ active: mdiStore.activeTabName === tab.name }"
      @click="activateTab(tab)"
    >
      <span class="tab-title">{{ tab.title }}</span>
      <button class="tab-close" @click="closeTab($event, tab)" title="Close">
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="1" y1="1" x2="11" y2="11"/>
          <line x1="11" y1="1" x2="1" y2="11"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.tab-bar {
  display: flex;
  align-items: flex-end;
  background: var(--tab-bar-bg);
  border-bottom: 1px solid var(--tab-bar-border);
  padding: 0 4px;
  min-height: 40px;
  flex-shrink: 0;
  overflow-x: auto;
  overflow-y: hidden;
}

.tab-bar::-webkit-scrollbar {
  height: 3px;
}

.tab-bar::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 2px;
}

.tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  cursor: pointer;
  border: 1px solid transparent;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  margin-right: 2px;
  white-space: nowrap;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  transition: background 0.1s, color 0.1s;
  user-select: none;
}

.tab:hover {
  background: #e8eaed;
  color: var(--text-primary);
}

.tab.active {
  background: var(--tab-active-bg);
  border-color: var(--tab-bar-border);
  color: var(--tab-active-border);
  font-weight: 600;
  position: relative;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--tab-active-bg);
}

.tab-title {
  font-size: 13px;
}

.tab-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: none;
  background: transparent;
  border-radius: 3px;
  color: inherit;
  opacity: 0.5;
  padding: 0;
  transition: opacity 0.1s, background 0.1s;
}

.tab-close:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.1);
}
</style>
