<script setup>
import { ref, computed, shallowRef } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import { useCommonCodeStore } from '@/stores/commonCode'
import StatusCellEditor from '@/components/grid/StatusCellEditor.vue'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

ModuleRegistry.registerModules([AllCommunityModule])

const commonCodeStore = useCommonCodeStore()

const searchKeyword = ref('')
const selectedStatus = ref('')
const selectedDelivery = ref('')

const orderStatusOptions = computed(() =>
  commonCodeStore.orderStatusCodes.map(c => ({ value: c.code, label: c.name }))
)
const deliveryOptions = computed(() =>
  commonCodeStore.deliveryCodes.map(c => ({ value: c.code, label: c.name }))
)

const DELIVERY_CODES = ['CJGLS', 'KROSE', 'KANGNAM', 'DONGBU', 'HANJIN', 'LGUP', 'COUPANG', 'NAVER']
const STATUS_CODES = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED', 'EXCHANGED', 'REFUNDED']
const PRODUCTS = [
  'Running Shoes', 'Yoga Mat', 'Water Bottle', 'Fitness Tracker',
  'Backpack', 'Sunglasses', 'Smart Watch', 'Wireless Headphones',
  'Winter Jacket', 'Canvas Sneakers',
]
const CUSTOMERS = [
  'Kim Minjun', 'Lee Soomin', 'Park Jihye', 'Choi Dongwoo',
  'Jung Yuna', 'Han Seongjae', 'Yoon Jiyoung', 'Lim Taehyun',
  'Song Hyuna', 'Oh Seungwoo',
]
const DISTRICTS = ['Gangnam-gu', 'Gangseo-gu', 'Songpa-gu', 'Mapo-gu', 'Jongno-gu']

function pad(n, width) {
  return String(n).padStart(width, '0')
}

function generateMockData() {
  const rows = []
  for (let i = 1; i <= 1000; i++) {
    const month = pad((i % 12) + 1, 2)
    const day = pad((i % 28) + 1, 2)
    const hour = pad(i % 24, 2)
    const min = pad((i * 7) % 60, 2)
    rows.push({
      orderId: `ORD-2024${month}${pad(i, 5)}`,
      customerName: CUSTOMERS[i % CUSTOMERS.length],
      phone: `010-${pad(1000 + (i * 37) % 9000, 4)}-${pad(1000 + (i * 53) % 9000, 4)}`,
      orderDate: `2024-${month}-${day} ${hour}:${min}`,
      productName: PRODUCTS[i % PRODUCTS.length],
      amount: (10 + (i % 490)) * 1000,
      shippingAddress: `Seoul ${DISTRICTS[i % DISTRICTS.length]} ${(i % 999) + 1}`,
      deliveryCompany: DELIVERY_CODES[i % DELIVERY_CODES.length],
      trackingNumber: `TR${pad((i * 999983) % 1000000000, 9)}`,
      orderStatus: STATUS_CODES[i % STATUS_CODES.length],
    })
  }
  return rows
}

const allRowData = generateMockData()
const rowData = ref([...allRowData])

const columnDefs = computed(() => [
  {
    field: 'orderId',
    headerName: 'Order ID',
    width: 170,
    pinned: 'left',
    sortable: true,
    filter: true,
  },
  { field: 'customerName', headerName: 'Customer', width: 130, sortable: true, filter: true },
  { field: 'phone', headerName: 'Phone', width: 145, sortable: false },
  { field: 'orderDate', headerName: 'Order Date', width: 155, sortable: true },
  { field: 'productName', headerName: 'Product', width: 170, sortable: true, filter: true },
  {
    field: 'amount',
    headerName: 'Amount (₩)',
    width: 130,
    sortable: true,
    valueFormatter: p => `₩${p.value.toLocaleString()}`,
    type: 'numericColumn',
  },
  { field: 'shippingAddress', headerName: 'Shipping Address', width: 230, sortable: false },
  {
    field: 'deliveryCompany',
    headerName: 'Carrier',
    width: 130,
    sortable: true,
    filter: true,
    valueFormatter: p => commonCodeStore.getDeliveryName(p.value),
  },
  { field: 'trackingNumber', headerName: 'Tracking No.', width: 155, sortable: false },
  {
    field: 'orderStatus',
    headerName: 'Order Status',
    width: 150,
    sortable: true,
    filter: true,
    editable: true,
    cellEditor: StatusCellEditor,
    valueFormatter: p => {
      const info = commonCodeStore.getOrderStatusInfo(p.value)
      return info ? info.name : p.value
    },
    cellStyle: { cursor: 'pointer', color: '#2563eb', fontWeight: '600' },
  },
])

const defaultColDef = {
  resizable: true,
  suppressMovable: false,
}

const gridApi = shallowRef(null)

function onGridReady(params) {
  gridApi.value = params.api
}

function search() {
  rowData.value = allRowData.filter(row => {
    const kw = searchKeyword.value.toLowerCase()
    const matchKeyword =
      !kw ||
      row.orderId.toLowerCase().includes(kw) ||
      row.customerName.toLowerCase().includes(kw)
    const matchStatus = !selectedStatus.value || row.orderStatus === selectedStatus.value
    const matchDelivery = !selectedDelivery.value || row.deliveryCompany === selectedDelivery.value
    return matchKeyword && matchStatus && matchDelivery
  })
}

function reset() {
  searchKeyword.value = ''
  selectedStatus.value = ''
  selectedDelivery.value = ''
  rowData.value = [...allRowData]
}
</script>

<template>
  <div class="view-container">
    <div class="view-header">
      <h2 class="view-title">Order Inquiry</h2>
    </div>

    <div class="search-panel">
      <div class="search-row">
        <div class="field-group">
          <label class="field-label">Keyword</label>
          <input
            v-model="searchKeyword"
            class="field-input"
            placeholder="Order ID or Customer name"
            @keyup.enter="search"
          />
        </div>
        <div class="field-group">
          <label class="field-label">Status</label>
          <select v-model="selectedStatus" class="field-select">
            <option value="">All</option>
            <option v-for="opt in orderStatusOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
        <div class="field-group">
          <label class="field-label">Carrier</label>
          <select v-model="selectedDelivery" class="field-select">
            <option value="">All</option>
            <option v-for="opt in deliveryOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
        <div class="search-actions">
          <button class="btn btn-primary" @click="search">Search</button>
          <button class="btn btn-secondary" @click="reset">Reset</button>
        </div>
      </div>
    </div>

    <div class="result-meta">
      <span class="result-count">{{ rowData.length.toLocaleString() }} record(s)</span>
      <span class="edit-hint">Click a cell in "Order Status" column to edit inline</span>
    </div>

    <div class="grid-wrapper ag-theme-alpine">
      <ag-grid-vue
        style="width: 100%; height: 100%"
        :rowData="rowData"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowSelection="'single'"
        :animateRows="false"
        @grid-ready="onGridReady"
      />
    </div>
  </div>
</template>

<style scoped>
.view-container {
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
}

.view-header {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.view-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.search-panel {
  background: #f9fafb;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px 20px;
  flex-shrink: 0;
}

.search-row {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.field-input,
.field-select {
  height: 36px;
  padding: 0 10px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 13px;
  color: var(--text-primary);
  background: #ffffff;
  min-width: 200px;
  outline: none;
  transition: border-color 0.15s;
}

.field-input:focus,
.field-select:focus {
  border-color: #3b82f6;
}

.search-actions {
  display: flex;
  gap: 8px;
}

.btn {
  height: 36px;
  padding: 0 16px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-primary { background: #3b82f6; color: #ffffff; }
.btn-primary:hover { background: #2563eb; }
.btn-secondary { background: #e5e7eb; color: var(--text-primary); }
.btn-secondary:hover { background: #d1d5db; }

.result-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.result-count {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.edit-hint {
  font-size: 12px;
  color: #6b7280;
  font-style: italic;
}

.grid-wrapper {
  flex: 1;
  min-height: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}
</style>
