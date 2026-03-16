<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { WithdrawApplyItem, WithdrawApplyStatus } from '@/types/WithdrawApply'
import { formatTimestamp } from '@/utils/formatUtil'
import { getWithdrawApplyList, auditWithdrawApply } from '@/api/withdrawApply'
import { withdrawStatusMap, withdrawStatusTagType } from '@/views/withdraw/dataConfig'

// ======================== 基础数据 ========================

const tableData = ref<WithdrawApplyItem[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// ======================== 搜索相关 ========================

const searchForm = reactive<{ status: WithdrawApplyStatus | 'all' }>({
  status: 'all',
})

const statusOptions = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待审核' },
  { value: 'approved', label: '已通过' },
  { value: 'rejected', label: '已拒绝' },
]

const handleSearch = () => {
  currentPage.value = 1
  fetchList()
}

const handleReset = () => {
  searchForm.status = 'all'
  currentPage.value = 1
  fetchList()
}

// ======================== 列表数据 ========================

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getWithdrawApplyList({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      status: searchForm.status === 'all' ? undefined : searchForm.status,
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
  fetchList()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchList()
}

// ======================== 审核操作 ========================

const handleApprove = (row: WithdrawApplyItem) => {
  ElMessageBox.confirm('确认通过该提现申请？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await auditWithdrawApply(row._id, 'approved', row.amount ?? 0)
      ElMessage.success('审核通过')
      await fetchList()
    })
    .catch(() => { })
}

const handleReject = (row: WithdrawApplyItem) => {
  ElMessageBox.prompt('请输入拒绝原因', '拒绝申请', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPlaceholder: '请输入拒绝原因',
    inputValidator: (value) => {
      if (!value?.trim()) return '请输入拒绝原因'
      return true
    },
  })
    .then(async (data) => {
      const value = (data as { value: string }).value
      await auditWithdrawApply(row._id, 'rejected', row.amount ?? 0, value?.trim())
      ElMessage.success('已拒绝')
      await fetchList()
    })
    .catch(() => { })
}

// ======================== 详情弹窗 ========================

const detailVisible = ref(false)
const currentDetail = ref<WithdrawApplyItem | null>(null)

const handleDetail = (row: WithdrawApplyItem) => {
  currentDetail.value = row
  detailVisible.value = true
}

const formatDate = (val: string | Date | undefined) => {
  if (!val) return '-'
  if (typeof val === 'object' && '$date' in val) {
    return formatTimestamp((val as { $date: string }).$date, 2)
  }
  return formatTimestamp(val, 2)
}

const getStatusTagType = (status: string) =>
  (withdrawStatusTagType[status as WithdrawApplyStatus] ?? 'info') as
  | 'success'
  | 'warning'
  | 'info'
  | 'danger'

const getStatusText = (status: string) => withdrawStatusMap[status as WithdrawApplyStatus] ?? status

// ======================== 生命周期 ========================

onMounted(() => fetchList())
</script>

<template>
  <div class="withdraw-apply">
    <!-- 搜索区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" inline @submit.prevent="handleSearch">
        <el-form-item label="审核状态">
          <el-select v-model="searchForm.status" placeholder="全部" style="width: 120px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
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
        <el-table-column prop="name" label="姓名" min-width="100" align="center" />
        <el-table-column prop="mobile" label="手机号" min-width="130" align="center" />
        <el-table-column prop="amount" label="提现金额" min-width="100" align="center">
          <template #default="{ row }">¥{{ row.amount ?? '0' }}</template>
        </el-table-column>
        <el-table-column prop="balance" label="余额" min-width="100" align="center">
          <template #default="{ row }">¥{{ row.balance ?? '0' }}</template>
        </el-table-column>
        <el-table-column prop="bankCard" label="银行卡号" min-width="180" align="center" show-overflow-tooltip />
        <el-table-column prop="openBank" label="开户行" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" min-width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="120" align="center" show-overflow-tooltip />
        <el-table-column label="申请时间" min-width="170" align="center">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="180" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleDetail(row)">详情</el-button>
            <template v-if="row.status === 'pending'">
              <el-button type="success" link size="small" @click="handleApprove(row)">通过</el-button>
              <el-button type="danger" link size="small" @click="handleReject(row)">拒绝</el-button>
            </template>
            <span v-else class="op-done">—</span>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination class="pagination" v-model:current-page="currentPage" v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]" :total="total" layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange" @size-change="handleSizeChange" />
    </el-card>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="提现申请详情" width="480px" destroy-on-close>
      <template v-if="currentDetail">
        <el-descriptions :column="1" border class="withdraw-detail-descriptions">
          <el-descriptions-item label="用户ID">{{ currentDetail.userId }}</el-descriptions-item>
          <el-descriptions-item label="姓名">{{ currentDetail.name }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ currentDetail.mobile }}</el-descriptions-item>
          <el-descriptions-item label="提现金额">¥{{ currentDetail.amount ?? '0' }}</el-descriptions-item>
          <el-descriptions-item label="银行卡号">{{ currentDetail.bankCard }}</el-descriptions-item>
          <el-descriptions-item label="开户行">{{ currentDetail.openBank }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTagType(currentDetail.status)" size="small">
              {{ getStatusText(currentDetail.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="备注">{{ currentDetail.remark || '-' }}</el-descriptions-item>
          <el-descriptions-item label="申请时间">{{ formatDate(currentDetail.createdAt) }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ formatDate(currentDetail.updatedAt) }}</el-descriptions-item>
        </el-descriptions>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.withdraw-apply {
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

  .op-done {
    color: var(--el-text-color-placeholder);
    font-size: 14px;
  }

  :deep(.withdraw-detail-descriptions) {
    table-layout: fixed;
    width: 100%;

    .el-descriptions__label {
      width: 90px;
      box-sizing: border-box;
    }
  }

  @include table();
}
</style>
