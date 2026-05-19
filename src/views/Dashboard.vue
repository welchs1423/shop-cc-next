<script setup>
import { computed } from 'vue'
import { Doughnut, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from 'chart.js'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
)

const metrics = [
  {
    label: '총 주문량',
    value: '12,847',
    unit: '건',
    change: '+8.2%',
    positive: true,
    icon: 'order',
    color: '#3b82f6',
    bg: '#eff6ff',
  },
  {
    label: '총 매출액',
    value: '₩2.4억',
    unit: '',
    change: '+12.5%',
    positive: true,
    icon: 'revenue',
    color: '#10b981',
    bg: '#ecfdf5',
  },
  {
    label: '진행 중인 클레임',
    value: '134',
    unit: '건',
    change: '-3.1%',
    positive: false,
    icon: 'claim',
    color: '#f59e0b',
    bg: '#fffbeb',
  },
  {
    label: '신규 가입자',
    value: '1,290',
    unit: '명',
    change: '+5.7%',
    positive: true,
    icon: 'user',
    color: '#8b5cf6',
    bg: '#f5f3ff',
  },
]

const doughnutData = computed(() => ({
  labels: ['결제완료', '배송중', '배송완료', '취소/반품', '교환처리중'],
  datasets: [
    {
      data: [3820, 2940, 4870, 810, 407],
      backgroundColor: ['#3b82f6', '#10b981', '#6366f1', '#f43f5e', '#f59e0b'],
      borderColor: '#ffffff',
      borderWidth: 3,
      hoverOffset: 8,
    },
  ],
}))

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 16,
        font: { size: 12 },
        color: '#374151',
        usePointStyle: true,
        pointStyleWidth: 10,
      },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${ctx.label}: ${ctx.parsed.toLocaleString()}건`,
      },
    },
  },
}

const barData = computed(() => ({
  labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
  datasets: [
    {
      label: '매출액 (만원)',
      data: [3200, 2800, 3900, 4100, 3750, 4600],
      backgroundColor: '#3b82f6',
      borderRadius: 6,
      borderSkipped: false,
      hoverBackgroundColor: '#2563eb',
    },
  ],
}))

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ₩${ctx.parsed.y.toLocaleString()}만`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#6b7280', font: { size: 12 } },
    },
    y: {
      grid: { color: '#f3f4f6', drawBorder: false },
      ticks: {
        color: '#6b7280',
        font: { size: 11 },
        callback: (v) => `₩${v.toLocaleString()}`,
      },
      border: { dash: [4, 4] },
    },
  },
}
</script>

<template>
  <div class="dashboard">
    <header class="dash-header">
      <h1 class="dash-title">대시보드</h1>
      <span class="dash-subtitle">2025년 상반기 현황</span>
    </header>

    <!-- Key Metrics -->
    <section class="metrics-grid">
      <div v-for="m in metrics" :key="m.label" class="metric-card">
        <div class="metric-icon" :style="{ background: m.bg, color: m.color }">
          <!-- Order icon -->
          <svg v-if="m.icon === 'order'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="1"/>
            <line x1="9" y1="12" x2="15" y2="12"/>
            <line x1="9" y1="16" x2="13" y2="16"/>
          </svg>
          <!-- Revenue icon -->
          <svg v-else-if="m.icon === 'revenue'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          <!-- Claim icon -->
          <svg v-else-if="m.icon === 'claim'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <!-- User icon -->
          <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div class="metric-body">
          <div class="metric-label">{{ m.label }}</div>
          <div class="metric-value">{{ m.value }}<span class="metric-unit">{{ m.unit }}</span></div>
          <div class="metric-change" :class="m.positive ? 'up' : 'down'">
            <span class="change-arrow">{{ m.positive ? '▲' : '▼' }}</span>
            {{ m.change }} 전월 대비
          </div>
        </div>
      </div>
    </section>

    <!-- Charts -->
    <section class="charts-grid">
      <div class="chart-card">
        <div class="chart-header">
          <h2 class="chart-title">주문 상태별 비율</h2>
          <span class="chart-period">이번 달</span>
        </div>
        <div class="chart-body">
          <Doughnut :data="doughnutData" :options="doughnutOptions" />
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <h2 class="chart-title">월별 매출 추이</h2>
          <span class="chart-period">2025년 1~6월</span>
        </div>
        <div class="chart-body">
          <Bar :data="barData" :options="barOptions" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 24px 28px;
  min-height: 100%;
  background: var(--content-bg, #f8fafc);
}

/* Header */
.dash-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 24px;
}

.dash-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.dash-subtitle {
  font-size: 13px;
  color: #6b7280;
}

/* Metrics */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.metric-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  transition: box-shadow 0.15s;
}

.metric-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07);
}

.metric-icon {
  width: 46px;
  height: 46px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-body {
  flex: 1;
  min-width: 0;
}

.metric-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 6px;
  font-weight: 500;
}

.metric-value {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
  margin-bottom: 6px;
}

.metric-unit {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  margin-left: 2px;
}

.metric-change {
  font-size: 11.5px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 3px;
}

.metric-change.up {
  color: #10b981;
}

.metric-change.down {
  color: #f43f5e;
}

.change-arrow {
  font-size: 9px;
}

/* Charts */
.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.chart-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px 24px;
  transition: box-shadow 0.15s;
}

.chart-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07);
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.chart-period {
  font-size: 12px;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 3px 8px;
  border-radius: 4px;
}

.chart-body {
  height: 280px;
  position: relative;
}

@media (max-width: 1200px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
