<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '640px',
  },
})

const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <div class="modal-dim" @click.self="emit('close')">
      <div class="modal-panel" :style="{ width }">
        <div class="modal-header">
          <slot name="header">
            <span class="modal-title">{{ title }}</span>
          </slot>
          <button class="modal-close-btn" @click="emit('close')" aria-label="Close">&#x2715;</button>
        </div>

        <div class="modal-body">
          <slot />
        </div>

        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-dim {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
  box-sizing: border-box;
}

.modal-panel {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 48px);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 14px;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.modal-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.modal-close-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #6b7280;
  padding: 2px 6px;
  border-radius: 4px;
  line-height: 1;
  transition: background 0.15s, color 0.15s;
}

.modal-close-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 14px 20px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-shrink: 0;
}
</style>
