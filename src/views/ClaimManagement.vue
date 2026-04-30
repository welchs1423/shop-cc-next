<script setup>
import { ref } from 'vue'

const searchKeyword = ref('')
const selectedType = ref('')
const results = ref([])
const searched = ref(false)

const MOCK_DATA = [
  { id: 1, claimId: 'CLM-20240101', orderId: 'ORD-20240101', customer: 'John Doe', type: 'Return', reason: 'Defective product', status: 'In Progress' },
  { id: 2, claimId: 'CLM-20240102', orderId: 'ORD-20240102', customer: 'Jane Smith', type: 'Exchange', reason: 'Wrong size', status: 'Completed' },
  { id: 3, claimId: 'CLM-20240103', orderId: 'ORD-20240103', customer: 'Bob Johnson', type: 'Refund', reason: 'Not as described', status: 'Pending' },
  { id: 4, claimId: 'CLM-20240104', orderId: 'ORD-20240104', customer: 'Alice Brown', type: 'Return', reason: 'Changed mind', status: 'Rejected' },
]

function search() {
  searched.value = true
  results.value = MOCK_DATA.filter(row => {
    const matchKeyword =
      !searchKeyword.value ||
      row.claimId.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      row.customer.toLowerCase().includes(searchKeyword.value.toLowerCase())
    const matchType = !selectedType.value || row.type === selectedType.value
    return matchKeyword && matchType
  })
}

function reset() {
  searchKeyword.value = ''
  selectedType.value = ''
  results.value = []
  searched.value = false
}

const statusClass = {
  'In Progress': 'badge-blue',
  Completed: 'badge-green',
  Pending: 'badge-yellow',
  Rejected: 'badge-red',
}

const typeClass = {
  Return: 'type-return',
  Exchange: 'type-exchange',
  Refund: 'type-refund',
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
            placeholder="Claim ID or Customer name"
            @keyup.enter="search"
          />
        </div>
        <div class="field-group">
          <label class="field-label">Claim Type</label>
          <select v-model="selectedType" class="field-select">
            <option value="">All</option>
            <option value="Return">Return</option>
            <option value="Exchange">Exchange</option>
            <option value="Refund">Refund</option>
          </select>
        </div>
        <div class="search-actions">
          <button class="btn btn-primary" @click="search">Search</button>
          <button class="btn btn-secondary" @click="reset">Reset</button>
        </div>
      </div>
    </div>

    <div class="result-panel">
      <div class="result-header">
        <span class="result-count" v-if="searched">
          {{ results.length }} result(s) found
        </span>
      </div>
      <table v-if="results.length > 0">
        <thead>
          <tr>
            <th>Claim ID</th>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Type</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in results" :key="row.id">
            <td>{{ row.claimId }}</td>
            <td>{{ row.orderId }}</td>
            <td>{{ row.customer }}</td>
            <td>
              <span class="type-tag" :class="typeClass[row.type]">{{ row.type }}</span>
            </td>
            <td>{{ row.reason }}</td>
            <td>
              <span class="badge" :class="statusClass[row.status]">{{ row.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else-if="searched" class="empty-result">No results found.</div>
      <div v-else class="empty-result">Enter search conditions and click Search.</div>
    </div>
  </div>
</template>

<style scoped>
.view-container {
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.view-header {
  display: flex;
  align-items: center;
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
  transition: background 0.15s;
}

.btn-primary {
  background: #3b82f6;
  color: #ffffff;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #e5e7eb;
  color: var(--text-primary);
}

.btn-secondary:hover {
  background: #d1d5db;
}

.result-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-header {
  min-height: 20px;
}

.result-count {
  font-size: 13px;
  color: var(--text-secondary);
}

.empty-result {
  padding: 40px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 13px;
}

.badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.badge-blue { background: #dbeafe; color: #1d4ed8; }
.badge-green { background: #dcfce7; color: #166534; }
.badge-yellow { background: #fef9c3; color: #854d0e; }
.badge-red { background: #fee2e2; color: #991b1b; }

.type-tag {
  font-size: 12px;
  font-weight: 600;
}

.type-return { color: #7c3aed; }
.type-exchange { color: #0891b2; }
.type-refund { color: #d97706; }
</style>
