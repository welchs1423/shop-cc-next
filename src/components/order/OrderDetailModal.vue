<script setup>
import BaseModal from '@/components/common/BaseModal.vue'
import { useCommonCodeStore } from '@/stores/commonCode'
import { computed } from 'vue'

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close'])

const commonCodeStore = useCommonCodeStore()

const statusInfo = computed(() => commonCodeStore.getOrderStatusInfo(props.order.orderStatus))
const deliveryName = computed(() => commonCodeStore.getDeliveryName(props.order.deliveryCompany))
const formattedAmount = computed(() =>
  props.order.amount != null ? `₩${props.order.amount.toLocaleString()}` : '-'
)
</script>

<template>
  <BaseModal title="Order Detail" width="680px" @close="emit('close')">
    <div class="detail-grid">
      <div class="detail-row">
        <span class="detail-label">Order ID</span>
        <span class="detail-value mono">{{ order.orderId }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Customer</span>
        <span class="detail-value">{{ order.customerName }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Phone</span>
        <span class="detail-value mono">{{ order.phone }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Order Date</span>
        <span class="detail-value">{{ order.orderDate }}</span>
      </div>
      <div class="detail-row full">
        <span class="detail-label">Product</span>
        <span class="detail-value">{{ order.productName }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Amount</span>
        <span class="detail-value amount">{{ formattedAmount }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Order Status</span>
        <span
          class="detail-value"
          :class="['status-badge', `status-${order.orderStatus?.toLowerCase()}`]"
        >
          {{ statusInfo ? statusInfo.label : order.orderStatus }}
        </span>
      </div>
      <div class="detail-row full">
        <span class="detail-label">Shipping Address</span>
        <span class="detail-value">{{ order.shippingAddress }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Carrier</span>
        <span class="detail-value">{{ deliveryName }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Tracking No.</span>
        <span class="detail-value mono">{{ order.trackingNumber }}</span>
      </div>
    </div>

    <template #footer>
      <button class="btn btn-secondary" @click="emit('close')">Close</button>
    </template>
  </BaseModal>
</template>

<style scoped>
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.detail-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
}

.detail-row:last-child,
.detail-row:nth-last-child(2):not(.full) {
  border-bottom: none;
}

.detail-row.full {
  grid-column: 1 / -1;
}

.detail-row:nth-child(odd):not(.full) {
  border-right: 1px solid #f3f4f6;
}

.detail-label {
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: 14px;
  color: #111827;
  font-weight: 500;
}

.detail-value.mono {
  font-family: 'Consolas', 'Menlo', monospace;
  font-size: 13px;
}

.detail-value.amount {
  font-size: 16px;
  font-weight: 700;
  color: #2563eb;
}

.status-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  width: fit-content;
}

.status-pending   { background: #fef3c7; color: #92400e; }
.status-paid      { background: #dbeafe; color: #1e40af; }
.status-shipped   { background: #e0f2fe; color: #0369a1; }
.status-delivered { background: #dcfce7; color: #166534; }
.status-cancelled { background: #fee2e2; color: #991b1b; }
.status-returned  { background: #fce7f3; color: #9d174d; }
.status-exchanged { background: #ede9fe; color: #5b21b6; }
.status-refunded  { background: #f3f4f6; color: #374151; }

.btn {
  height: 36px;
  padding: 0 20px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-secondary {
  background: #e5e7eb;
  color: #111827;
}

.btn-secondary:hover {
  background: #d1d5db;
}
</style>
