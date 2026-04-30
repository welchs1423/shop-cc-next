<script setup>
import { ref } from 'vue'
import { useCommonCodeStore } from '@/stores/commonCode'

const props = defineProps({ params: Object })
const commonCodeStore = useCommonCodeStore()
const selectedValue = ref(props.params.value)

defineExpose({
  getValue: () => selectedValue.value,
  isPopup: () => false,
})
</script>

<template>
  <select
    v-model="selectedValue"
    class="status-cell-editor"
    @change="params.stopEditing()"
    @keydown.escape="params.stopEditing(true)"
  >
    <option
      v-for="code in commonCodeStore.orderStatusCodes"
      :key="code.code"
      :value="code.code"
    >
      {{ code.name }}
    </option>
  </select>
</template>

<style scoped>
.status-cell-editor {
  width: 100%;
  height: 100%;
  border: none;
  outline: 2px solid #3b82f6;
  padding: 0 6px;
  font-size: 13px;
  background: #fff;
  cursor: pointer;
}
</style>
