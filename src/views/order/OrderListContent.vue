<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import type { OrderItem, OrderType, OrderStatus } from '@/types/Order'
import { formatTimestamp } from '@/utils/formatUtil'
import { getOrderList } from '@/api/order'
import { orderTypeMap, orderStatusMap, orderStatusTagType } from '@/views/order/dataConfig'

const props = defineProps<{
  orderType: OrderType
  pageTitle: string
}>()

// ======================== 基础数据 ========================

const tableData = ref<OrderItem[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// ======================== 搜索相关 ========================

const searchForm = ref({
  out_trade_no: '',
  status: 'all' as OrderStatus | 'all',
})

const handleSearch = () => {
  currentPage.value = 1
  fetchOrderList()
}

const handleReset = () => {
  searchForm.value = { out_trade_no: '', status: 'all' }
  currentPage.value = 1
  fetchOrderList()
}

// ======================== 列表数据 ========================

const fetchOrderList = async () => {
  loading.value = true
  try {
    const res = await getOrderList({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      orderType: props.orderType,
      status: searchForm.value.status,
      out_trade_no: searchForm.value.out_trade_no || undefined,
    })

    tableData.value = res.data?.list ?? []
    total.value = res.data?.total ?? 0
  } finally {
    loading.value = false
  }
}

// ======================== 分页处理 ========================

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchOrderList()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchOrderList()
}

// ======================== 详情弹窗 ========================

const detailVisible = ref(false)
const currentDetail = ref<OrderItem | null>(null)

const handleDetail = (row: OrderItem) => {
  currentDetail.value = row
  detailVisible.value = true
}

// ======================== 生命周期 ========================

onMounted(() => fetchOrderList())
</script>

<template>
  <div class="order-list">
    <!-- 搜索区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" inline @submit.prevent="handleSearch">
        <el-form-item label="订单号">
          <el-input v-model="searchForm.out_trade_no" placeholder="请输入订单号" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="searchForm.status" style="width: 120px">
            <el-option label="全部" value="all" />
            <el-option v-for="(label, key) in orderStatusMap" :key="key" :label="label" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" native-type="submit">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card shadow="never" class="table-card">
      <el-table :data="tableData" v-loading="loading" stripe border>
        <el-table-column label="序号" min-width="60" align="center" type="index" />
        <el-table-column prop="out_trade_no" label="订单号" min-width="160" align="center" show-overflow-tooltip />
        <el-table-column label="产品信息" min-width="180" align="center">
          <template #default="{ row }">
            <div class="product-cell">
              <el-image v-if="row.productInfo?.cover" :src="row.productInfo.cover"
                :preview-src-list="[row.productInfo.cover]"
                style="width: 40px; height: 40px; border-radius: 4px; margin-right: 8px" fit="cover" preview-teleported
                hide-on-click-modal />
              <span class="product-title">{{ row.productInfo?.title || '-' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="报名人" min-width="120" align="center">
          <template #default="{ row }">
            <div>{{ row.userInfo?.nickname || '-' }}</div>
            <div class="sub-text">{{ row.userInfo?.phone || '-' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="原价" min-width="80" align="center">
          <template #default="{ row }">¥{{ row.totalAmount ?? '0' }}</template>
        </el-table-column>
        <el-table-column prop="payAmount" label="实付" min-width="80" align="center">
          <template #default="{ row }">¥{{ row.payAmount ?? '0' }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="(orderStatusTagType[row.status] as any) || 'info'" size="small">
              {{ orderStatusMap[row.status] || row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" min-width="170" align="center">
          <template #default="{ row }">{{ formatTimestamp(row.createdAt, 2) }}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination class="pagination" v-model:current-page="currentPage" v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]" :total="total" layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange" @size-change="handleSizeChange" />
    </el-card>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" :title="`${pageTitle}详情`" width="640px" destroy-on-close>
      <template v-if="currentDetail">
        <el-descriptions :column="2" border class="order-detail-descriptions">
          <el-descriptions-item label="订单号" :span="2">{{ currentDetail.out_trade_no }}</el-descriptions-item>
          <el-descriptions-item label="订单类型">
            {{ orderTypeMap[currentDetail.orderType] || currentDetail.orderType }}
          </el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="(orderStatusTagType[currentDetail.status] as any)" size="small">
              {{ orderStatusMap[currentDetail.status] }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="产品名称" :span="2">{{ currentDetail.productInfo?.title }}</el-descriptions-item>
          <el-descriptions-item label="产品时间">{{ currentDetail.productInfo?.time }}</el-descriptions-item>
          <el-descriptions-item label="门店名称">{{ currentDetail.shopInfo?.shopName }}</el-descriptions-item>
          <el-descriptions-item label="门店地址" :span="2">{{ currentDetail.shopInfo?.address
          }}</el-descriptions-item>
          <el-descriptions-item label="报名人">{{ currentDetail.userInfo?.nickname }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ currentDetail.userInfo?.phone }}</el-descriptions-item>
          <el-descriptions-item label="原价">¥{{ currentDetail.totalAmount }}</el-descriptions-item>
          <el-descriptions-item label="实付">¥{{ currentDetail.payAmount }}</el-descriptions-item>
          <el-descriptions-item label="佣金">¥{{ currentDetail.commission }}</el-descriptions-item>
          <el-descriptions-item label="优惠">¥{{ currentDetail.discountAmount }}</el-descriptions-item>
          <el-descriptions-item label="发起人">{{ currentDetail.initiatorInfo?.username }}</el-descriptions-item>
          <el-descriptions-item label="发起人电话">{{ currentDetail.initiatorInfo?.mobile }}</el-descriptions-item>
          <el-descriptions-item label="核销码">{{ currentDetail.verifyCode || '-' }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatTimestamp(currentDetail.createdAt!, 2) }}</el-descriptions-item>
        </el-descriptions>

        <div class="detail-cover" v-if="currentDetail.productInfo?.cover">
          <p class="detail-cover-title">产品封面</p>
          <el-image :src="currentDetail.productInfo.cover" :preview-src-list="[currentDetail.productInfo.cover]"
            style="width: 120px; height: 120px" fit="cover" preview-teleported hide-on-click-modal />
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.order-list {
  height: 100%;
  display: flex;
  flex-direction: column;

  .search-card {
    flex-shrink: 0;
    margin-bottom: 16px;

    :deep(.el-card__body) {
      padding-bottom: 2px;
    }
  }

  .product-cell {
    display: flex;
    align-items: center;
    justify-content: center;

    .product-title {
      flex: 1;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .sub-text {
    font-size: 12px;
    color: #909399;
    margin-top: 2px;
  }

  .detail-cover {
    margin-top: 16px;

    .detail-cover-title {
      font-size: 14px;
      color: #606266;
      margin-bottom: 8px;
    }
  }

  :deep(.order-detail-descriptions) {
    table-layout: fixed;
    width: 100%;

    .el-descriptions__label {
      width: 100px;
      box-sizing: border-box;
    }
  }

  @include table();
}
</style>
