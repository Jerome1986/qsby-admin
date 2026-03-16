<!-- 主理人申请审核页 -->
<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { formatTimestamp } from '@/utils/formatUtil.ts'
import { managerApplyFindAll, updateManagerApply } from '@/api/user.ts'
import type { ManagerApplyItem, ManagerApplyStatus } from '@/types/ManagerApplyFor.ts'
import { applyStatusText } from '@/views/user/dataConfig.ts'
import { ElMessage, ElMessageBox } from 'element-plus'

// 基础数据
const tableData = ref<ManagerApplyItem[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 选中后的值
const filterForm = reactive<{ status: ManagerApplyStatus | 'all' }>({
  status: 'all',
})

// 筛选下拉框
const statusOptions = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待审核' },
  { value: 'approved', label: '已通过' },
  { value: 'rejected', label: '已拒绝' },
]

// 根据状态筛选
const handleStatusChange = () => {
  currentPage.value = 1
  applyList(filterForm.status, currentPage.value, pageSize.value)
}

// 同意
const handleAgree = (row: ManagerApplyItem) => {
  ElMessageBox.confirm('是否通过审核，将用户变成主理人？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const res = await updateManagerApply(row.userId, row.status, 'agree')
      ElMessage.success(res.message)
      await applyList(filterForm.status, currentPage.value, pageSize.value)
    })
    .catch(() => {
      ElMessage.info('已取消操作')
    })
}

// 拒绝：弹出输入框填写拒绝原因
const handleRefuse = (row: ManagerApplyItem) => {
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
      const res = await updateManagerApply(row.userId, row.status, 'refuse', value?.trim())
      ElMessage.success(res.message)
      await applyList(filterForm.status, currentPage.value, pageSize.value)
    })
    .catch(() => {
      ElMessage.info('已取消操作')
    })
}

// 处理分页
const handlePageChange = (page: number) => {
  currentPage.value = page
  applyList(filterForm.status, currentPage.value, pageSize.value)
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  applyList(filterForm.status, currentPage.value, pageSize.value)
}

// 获取页面数据
const applyList = async (status: ManagerApplyStatus | 'all', pageNum: number, pageSize: number) => {
  const res = await managerApplyFindAll(status, pageNum, pageSize)
  tableData.value = res.data.list
  total.value = res.data.total
}

onMounted(() => applyList(filterForm.status, currentPage.value, pageSize.value))
</script>

<template>
  <div class="agentApply">
    <!-- 筛选区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="filterForm" inline>
        <el-form-item label="审核状态">
          <el-select
            v-model="filterForm.status"
            placeholder="全部"
            style="width: 200px"
            @change="handleStatusChange"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card shadow="never" class="table-card">
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column label="序号" min-width="60" align="center" type="index" />
        <el-table-column prop="mobile" label="手机号" min-width="130" align="center" />
        <el-table-column prop="username" label="真实姓名" min-width="100" align="center" />
        <el-table-column
          prop="idCard"
          label="身份证号"
          min-width="100"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column prop="remark" label="拒绝原因" min-width="100" align="center" />
        <el-table-column prop="status" label="状态" min-width="170" align="center">
          <template #default="{ row }">{{
            applyStatusText[row.status as ManagerApplyStatus]
          }}</template>
        </el-table-column>
        <el-table-column prop="createdAt" label="提交时间" min-width="170" align="center">
          <template #default="{ row }">{{ formatTimestamp(row.createdAt, 2) }}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="100" align="center">
          <template #default="{ row }">
            <template v-if="row.status === 'pending'">
              <el-button type="primary" plain size="small" @click="handleAgree(row)"
                >同意</el-button
              >
              <el-button type="danger" size="small" @click="handleRefuse(row)">拒绝</el-button>
            </template>
            <span v-else class="op-done">—</span>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pagination"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[1, 10, 20, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.agentApply {
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

  @include table();
}
</style>
