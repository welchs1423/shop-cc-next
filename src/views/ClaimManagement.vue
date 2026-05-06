<script setup>
import { ref, computed, shallowRef } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import { useCommonCodeStore } from '@/stores/commonCode'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

ModuleRegistry.registerModules([AllCommunityModule])

const commonCodeStore = useCommonCodeStore()

const searchKeyword = ref('')
const selectedClaimType = ref('')
const selectedClaimStatus = ref('')

const claimTypeOptions = computed(() =>
  commonCodeStore.claimTypeCodes.map(c => ({ value: c.code, label: c.label }))
)
const claimStatusOptions = computed(() =>
  commonCodeStore.claimStatusCodes.map(c => ({ value: c.code, label: c.label }))
)

const CLAIM_TYPE_CODES = ['RETURN', 'EXCHANGE', 'REFUND']
const CLAIM_STATUS_CODES = ['IN_PROGRESS', 'COMPLETED', 'PENDING', 'REJECTED']
const CUSTOMERS = [
  'Kim Minjun', 'Lee Soomin', 'Park Jihye', 'Choi Dongwoo',
  'Jung Yuna', 'Han Seongjae', 'Yoon Jiyoung', 'Lim Taehyun',
  'Song Hyuna', 'Oh Seungwoo',
]
const REASONS = [
  'Product defect', 'Wrong item delivered', 'Changed mind',
  'Size mismatch', 'Color different from image', 'Damaged during shipping',
  'Missing parts', 'Duplicate order', 'Better price found', 'Delivery delay',
]

function pad(n, width) {
  return String(n).padStart(width, '0')
}

function generateMockData() {
  const rows = []
  for (let i = 1; i <= 50; i++) {
    const month = pad((i % 12) + 1, 2)
    const day = pad((i % 28) + 1, 2)
    const hour = pad(i % 24, 2)
    const min = pad((i * 7) % 60, 2)
    rows.push({
      claimId: `CLM-2024${month}${pad(i, 4)}`,
      orderId: `ORD-2024${month}${pad(i * 19, 5)}`,
      customerName: CUSTOMERS[i % CUSTOMERS.length],
      claimType: CLAIM_TYPE_CODES[i % CLAIM_TYPE_CODES.length],
      claimStatus: CLAIM_STATUS_CODES[i % CLAIM_STATUS_CODES.length],
      reason: REASONS[i % REASONS.length],
      amount: (5 + (i % 95)) * 1000,
      claimDate: `2024-${month}-${day} ${hour}:${min}`,
    })
  }
  return rows
}

const allRowData = generateMockData()
const rowData = ref([...allRowData])

const columnDefs = computed(() => [
  {
    field: 'claimId',
    headerName: 'Claim ID',
    width: 175,
    minWidth: 150,
    pinned: 'left',
    sortable: true,
    filter: true,
    checkboxSelection: true,
    headerCheckboxSelection: true,
  },
  { field: 'orderId', headerName: 'Order ID', flex: 2, minWidth: 160, sortable: true, filter: true },
  { field: 'customerName', headerName: 'Customer', flex: 1.5, minWidth: 120, sortable: true, filter: true },
  {
    field: 'claimType',
    headerName: 'Claim Type',
    flex: 1.5,
    minWidth: 120,
    sortable: true,
    filter: true,
    valueFormatter: p => {
      const info = commonCodeStore.getClaimTypeInfo(p.value)
      return info ? info.label : p.value
    },
  },
  {
    field: 'claimStatus',
    headerName: 'Status',
    flex: 1.5,
    minWidth: 120,
    sortable: true,
    filter: true,
    valueFormatter: p => {
      const info = commonCodeStore.getClaimStatusInfo(p.value)
      return info ? info.label : p.value
    },
  },
  { field: 'reason', headerName: 'Reason', flex: 3, minWidth: 180, sortable: false },
  {
    field: 'amount',
    headerName: 'Amount (₩)',
    flex: 1.5,
    minWidth: 120,
    sortable: true,
    valueFormatter: p => `₩${p.value.toLocaleString()}`,
    type: 'numericColumn',
  },
  { field: 'claimDate', headerName: 'Claim Date', flex: 2, minWidth: 150, sortable: true },
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
      row.claimId.toLowerCase().includes(kw) ||
      row.orderId.toLowerCase().includes(kw) ||
      row.customerName.toLowerCase().includes(kw)
    const matchType = !selectedClaimType.value || row.claimType === selectedClaimType.value
    const matchStatus = !selectedClaimStatus.value || row.claimStatus === selectedClaimStatus.value
    return matchKeyword && matchType && matchStatus
  })
}

function reset() {
  searchKeyword.value = ''
  selectedClaimType.value = ''
  selectedClaimStatus.value = ''
  rowData.value = [...allRowData]
}

function exportToCsv() {
  if (!gridApi.value) return
  const today = new Date()
  const ymd =
    String(today.getFullYear()) +
    String(today.getMonth() + 1).padStart(2, '0') +
    String(today.getDate()).padStart(2, '0')

  const selectedNodes = gridApi.value.getSelectedNodes()
  const onlySelected = selectedNodes.length > 0

  gridApi.value.exportDataAsCsv({
    fileName: `claims_${ymd}.csv`,
    onlySelected,
    processCellCallback: params => {
      const colDef = params.column.getColDef()
      if (colDef.valueFormatter) {
        return colDef.valueFormatter({
          value: params.value,
          data: params.node.data,
          node: params.node,
          colDef,
          column: params.column,
          api: params.api,
        })
      }
      return params.value
    },
  })
}
</script>

<template>
  <div class="view-container">
    <div class="view-header">
      <h2 class="view-title">Claim Management</h2>
    </div>

    <div class="search-panel">
      <div class="search-row">
        <div class="field-group">
          <label class="field-label">Keyword</label>
          <input
            v-model="searchKeyword"
            class="field-input"
            placeholder="Claim ID, Order ID or Customer"
            @keyup.enter="search"
          />
        </div>
        <div class="field-group">
          <label class="field-label">Claim Type</label>
          <select v-model="selectedClaimType" class="field-select">
            <option value="">All</option>
            <option v-for="opt in claimTypeOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
        <div class="field-group">
          <label class="field-label">Status</label>
          <select v-model="selectedClaimStatus" class="field-select">
            <option value="">All</option>
            <option v-for="opt in claimStatusOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
        <div class="search-actions">
          <button class="btn btn-primary" @click="search">Search</button>
          <button class="btn btn-secondary" @click="reset">Reset</button>
          <button class="btn btn-success" @click="exportToCsv">Excel Export</button>
        </div>
      </div>
    </div>

    <div class="result-meta">
      <span class="result-count">{{ rowData.length.toLocaleString() }} record(s)</span>
    </div>

    <div class="grid-wrapper ag-theme-alpine">
      <ag-grid-vue
        style="width: 100%; height: 100%"
        :rowData="rowData"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowSelection="'multiple'"
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
.btn-success { background: #16a34a; color: #ffffff; }
.btn-success:hover { background: #15803d; }

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

.grid-wrapper {
  flex: 1;
  min-height: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}
</style>
