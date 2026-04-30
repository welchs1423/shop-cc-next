import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const MOCK_DELIVERY_CODES = [
  { code: 'CJGLS', name: 'CJ대한통운' },
  { code: 'KROSE', name: '한국로봇' },
  { code: 'KANGNAM', name: '강남통운' },
  { code: 'DONGBU', name: '동부택배' },
  { code: 'HANJIN', name: '한진택배' },
  { code: 'LGUP', name: 'LG유플러스' },
  { code: 'COUPANG', name: '쿠팡로직스' },
  { code: 'NAVER', name: '네이버배송' },
]

const MOCK_ORDER_STATUS_CODES = [
  { code: 'PENDING', name: 'Pending', label: '주문확인중' },
  { code: 'PAID', name: 'Paid', label: '결제완료' },
  { code: 'SHIPPED', name: 'Shipped', label: '배송중' },
  { code: 'DELIVERED', name: 'Delivered', label: '배송완료' },
  { code: 'CANCELLED', name: 'Cancelled', label: '주문취소' },
  { code: 'RETURNED', name: 'Returned', label: '반품처리' },
  { code: 'EXCHANGED', name: 'Exchanged', label: '교환처리' },
  { code: 'REFUNDED', name: 'Refunded', label: '환불처리' },
]

const MOCK_CLAIM_TYPE_CODES = [
  { code: 'RETURN', name: 'Return', label: '반품' },
  { code: 'EXCHANGE', name: 'Exchange', label: '교환' },
  { code: 'REFUND', name: 'Refund', label: '환불' },
]

const MOCK_CLAIM_STATUS_CODES = [
  { code: 'IN_PROGRESS', name: 'In Progress', label: '진행중' },
  { code: 'COMPLETED', name: 'Completed', label: '완료' },
  { code: 'PENDING', name: 'Pending', label: '대기중' },
  { code: 'REJECTED', name: 'Rejected', label: '거절' },
]

async function fetchDeliveryCodes() {
  await new Promise(resolve => setTimeout(resolve, 100))
  return [...MOCK_DELIVERY_CODES]
}

async function fetchOrderStatusCodes() {
  await new Promise(resolve => setTimeout(resolve, 100))
  return [...MOCK_ORDER_STATUS_CODES]
}

async function fetchClaimTypeCodes() {
  await new Promise(resolve => setTimeout(resolve, 100))
  return [...MOCK_CLAIM_TYPE_CODES]
}

async function fetchClaimStatusCodes() {
  await new Promise(resolve => setTimeout(resolve, 100))
  return [...MOCK_CLAIM_STATUS_CODES]
}

export const useCommonCodeStore = defineStore('commonCode', () => {
  const deliveryCodes = ref([])
  const orderStatusCodes = ref([])
  const claimTypeCodes = ref([])
  const claimStatusCodes = ref([])
  const isLoading = ref(false)
  const isInitialized = ref(false)

  const deliveryCodeMap = computed(() => {
    const map = {}
    deliveryCodes.value.forEach(item => {
      map[item.code] = item.name
    })
    return map
  })

  const orderStatusCodeMap = computed(() => {
    const map = {}
    orderStatusCodes.value.forEach(item => {
      map[item.code] = item
    })
    return map
  })

  const claimTypeCodeMap = computed(() => {
    const map = {}
    claimTypeCodes.value.forEach(item => {
      map[item.code] = item
    })
    return map
  })

  const claimStatusCodeMap = computed(() => {
    const map = {}
    claimStatusCodes.value.forEach(item => {
      map[item.code] = item
    })
    return map
  })

  async function loadAllCodes() {
    if (isInitialized.value || isLoading.value) return

    isLoading.value = true
    try {
      const [delivery, orderStatus, claimType, claimStatus] = await Promise.all([
        fetchDeliveryCodes(),
        fetchOrderStatusCodes(),
        fetchClaimTypeCodes(),
        fetchClaimStatusCodes(),
      ])
      deliveryCodes.value = delivery
      orderStatusCodes.value = orderStatus
      claimTypeCodes.value = claimType
      claimStatusCodes.value = claimStatus
      isInitialized.value = true
    } catch (error) {
      console.error('Failed to load common codes:', error)
    } finally {
      isLoading.value = false
    }
  }

  function getDeliveryName(code) {
    return deliveryCodeMap.value[code] ?? code
  }

  function getOrderStatusInfo(code) {
    return orderStatusCodeMap.value[code] ?? null
  }

  function getClaimTypeInfo(code) {
    return claimTypeCodeMap.value[code] ?? null
  }

  function getClaimStatusInfo(code) {
    return claimStatusCodeMap.value[code] ?? null
  }

  return {
    deliveryCodes,
    orderStatusCodes,
    claimTypeCodes,
    claimStatusCodes,
    isLoading,
    isInitialized,
    deliveryCodeMap,
    orderStatusCodeMap,
    claimTypeCodeMap,
    claimStatusCodeMap,
    loadAllCodes,
    getDeliveryName,
    getOrderStatusInfo,
    getClaimTypeInfo,
    getClaimStatusInfo,
  }
})