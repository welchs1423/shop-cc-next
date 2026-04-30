import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMdiStore = defineStore('mdi', () => {
  const tabs = ref([])
  const activeTabName = ref(null)

  const activeTab = computed(() => tabs.value.find(t => t.name === activeTabName.value) ?? null)

  function openTab({ name, title, path }) {
    const alreadyOpen = tabs.value.some(t => t.name === name)
    if (!alreadyOpen) {
      tabs.value.push({ name, title, path })
    }
    activeTabName.value = name
  }

  function closeTab(name) {
    const index = tabs.value.findIndex(t => t.name === name)
    if (index === -1) return

    tabs.value.splice(index, 1)

    if (activeTabName.value === name) {
      const next = tabs.value[index] ?? tabs.value[index - 1] ?? null
      activeTabName.value = next?.name ?? null
    }
  }

  function activateTab(name) {
    activeTabName.value = name
  }

  return { tabs, activeTabName, activeTab, openTab, closeTab, activateTab }
})
