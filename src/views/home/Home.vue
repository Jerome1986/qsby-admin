<!-- 控制面板 - 首页：信息汇总与统计 -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getStoreList,
  getStoreCategories,
  getProductList,
} from '@/api/store'
import { getOrderList } from '@/api/order'
import { getUserByRole, managerApplyFindAll } from '@/api/user'
import { activityListFindAll } from '@/api/activity'
import { tripListFindAll } from '@/api/trip'
import {
  projectListFindAll,
  getProjectTypes,
  getProjectModes,
  getProjectScales,
} from '@/api/project'
import { cityGetAll } from '@/api/city'

/** 统计数据 */
const stats = ref({
  // 用户管理
  normalUser: 0,
  agent: 0,
  agentApplyPending: 0,
  // 订单
  order: 0,
  /** 总流水（待补接口） */
  orderTotalAmount: 0,
  // 门店管理
  store: 0,
  product: 0,
  storeCategory: 0,
  // 活动管理
  activity: 0,
  // 行程管理
  trip: 0,
  // 项目管理
  project: 0,
  projectType: 0,
  projectMode: 0,
  projectScale: 0,
  // 系统管理
  city: 0,
})

const loading = ref(true)

/** 从分页结果中提取 total */
const getTotal = (res: { data?: { total?: number } } | null) =>
  res?.data?.total ?? 0

/** 加载所有统计数据 */
const loadStats = async () => {
  loading.value = true
  try {
    const results = await Promise.allSettled([
      getUserByRole('user', 1, 1),
      getUserByRole('manager', 1, 1),
      managerApplyFindAll('all', 1, 9999),
      getOrderList({ pageNum: 1, pageSize: 1, orderType: 'all', status: 'all' }),
      getStoreList(1, 1),
      getProductList(1, 1),
      getStoreCategories(1, 1),
      activityListFindAll(1, 1),
      tripListFindAll(1, 1),
      projectListFindAll(1, 1),
      getProjectTypes(1, 1),
      getProjectModes(1, 1),
      getProjectScales(1, 1),
      cityGetAll(),
    ])

    const getData = (i: number) => {
      const r = results[i]
      return r?.status === 'fulfilled' ? (r as { value: { data?: { total?: number } } }).value : null
    }
    const getCityData = (i: number) => {
      const r = results[i]
      return r?.status === 'fulfilled' ? (r as { value: { data?: unknown } }).value?.data : null
    }
    const cityData = getCityData(13)

    stats.value = {
      normalUser: getTotal(getData(0)),
      agent: getTotal(getData(1)),
      agentApplyPending: (() => {
        const res = getData(2)
        const list = (res as { data?: { list?: { status?: string }[] } } | null)?.data?.list ?? []
        return list.filter((item) => item?.status === 'pending').length
      })(),
      order: getTotal(getData(3)),
      // TODO: 流水统计待补接口，接入后替换下方 0
      orderTotalAmount: 0,
      store: getTotal(getData(4)),
      product: getTotal(getData(5)),
      storeCategory: getTotal(getData(6)),
      activity: getTotal(getData(7)),
      trip: getTotal(getData(8)),
      project: getTotal(getData(9)),
      projectType: getTotal(getData(10)),
      projectMode: getTotal(getData(11)),
      projectScale: getTotal(getData(12)),
      city: Array.isArray(cityData) ? cityData.length : 0,
    }
  } catch {
    // 兜底异常
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStats()
})
</script>

<template>
  <div class="home-page">
    <h1 class="page-title">控制面板</h1>
    <p v-if="loading" class="loading-tip">加载中...</p>

    <div v-else class="stats-grid">
      <!-- 用户管理 -->
      <section class="stats-section">
        <h2 class="section-title">用户管理</h2>
        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-label">普通用户</span>
            <span class="stat-value">{{ stats.normalUser }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">主理人</span>
            <span class="stat-value">{{ stats.agent }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">主理人申请待审核</span>
            <span class="stat-value">{{ stats.agentApplyPending }}</span>
          </div>
        </div>
      </section>

      <!-- 订单管理 -->
      <section class="stats-section">
        <h2 class="section-title">订单管理</h2>
        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-label">订单总数</span>
            <span class="stat-value">{{ stats.order }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">总流水</span>
            <span class="stat-value stat-amount">¥{{ stats.orderTotalAmount.toFixed(2) }}</span>
          </div>
        </div>
      </section>

      <!-- 门店管理 -->
      <section class="stats-section">
        <h2 class="section-title">门店管理</h2>
        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-label">门店</span>
            <span class="stat-value">{{ stats.store }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">产品</span>
            <span class="stat-value">{{ stats.product }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">门店分类</span>
            <span class="stat-value">{{ stats.storeCategory }}</span>
          </div>
        </div>
      </section>

      <!-- 活动管理 -->
      <section class="stats-section">
        <h2 class="section-title">活动管理</h2>
        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-label">活动</span>
            <span class="stat-value">{{ stats.activity }}</span>
          </div>
        </div>
      </section>

      <!-- 行程管理 -->
      <section class="stats-section">
        <h2 class="section-title">行程管理</h2>
        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-label">行程</span>
            <span class="stat-value">{{ stats.trip }}</span>
          </div>
        </div>
      </section>

      <!-- 项目管理 -->
      <section class="stats-section">
        <h2 class="section-title">项目管理</h2>
        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-label">项目</span>
            <span class="stat-value">{{ stats.project }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">项目类型</span>
            <span class="stat-value">{{ stats.projectType }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">合作方式</span>
            <span class="stat-value">{{ stats.projectMode }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">合作规模</span>
            <span class="stat-value">{{ stats.projectScale }}</span>
          </div>
        </div>
      </section>

      <!-- 系统管理 -->
      <section class="stats-section">
        <h2 class="section-title">系统管理</h2>
        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-label">城市（站点）</span>
            <span class="stat-value">{{ stats.city }}</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-page {
  padding: 24px;
  background: #fff;
  min-height: 100%;
}

.page-title {
  margin: 0 0 24px;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.loading-tip {
  color: #909399;
  font-size: 14px;
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-section {
  padding: 16px 20px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.section-title {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 600;
  color: #606266;
}

.stats-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px 32px;
}

.stat-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.stat-amount {
  color: #67c23a;
}
</style>
