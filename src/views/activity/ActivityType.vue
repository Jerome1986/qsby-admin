<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { ActivityTypeItem } from '@/types/Activity'
import {
  deleteActivityType,
  getActivityTypes,
  activityAddType,
  activityUpdateType,
} from '@/api/activity.ts'

// 表单基础数据
const tableData = ref<ActivityTypeItem[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('新增类型')
// 表单
const formData = ref<Partial<ActivityTypeItem>>({
  name: '',
  sort: 0,
  status: 'active',
})

// 获取活动类型列表
const getActivityTypeList = async (pageNum: number, pageSize: number) => {
  loading.value = true
  try {
    const res = await getActivityTypes(pageNum, pageSize)
    tableData.value = res.data.list
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

// 处理分页
const handlePageChange = (page: number) => {
  currentPage.value = page
  getActivityTypeList(currentPage.value, pageSize.value)
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  getActivityTypeList(currentPage.value, pageSize.value)
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增类型'
  formData.value = { name: '', sort: 0, status: 'active' }
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: ActivityTypeItem) => {
  dialogTitle.value = '编辑类型'
  formData.value = { ...row }
  dialogVisible.value = true
}

// 删除
const handleDelete = (row: ActivityTypeItem) => {
  ElMessageBox.confirm(`确认删除类型「${row.name}」吗？`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await deleteActivityType(row._id)
      ElMessage.success('删除成功')
      await getActivityTypeList(currentPage.value, pageSize.value)
    })
    .catch(() => { })
}

// 确定提交
const handleConfirm = async () => {
  if (!formData.value.name?.trim()) {
    ElMessage.warning('请输入类型名称')
    return
  }
  if (formData.value._id) {
    await activityUpdateType(
      formData.value._id,
      formData.value.name,
      formData.value.sort || 0,
      formData.value.status || 'active',
    )
  } else {
    await activityAddType(
      formData.value.name,
      formData.value.sort ?? 0,
      formData.value.status || 'active',
    )
  }
  ElMessage.success(formData.value._id ? '编辑成功' : '新增成功')
  dialogVisible.value = false
  await getActivityTypeList(currentPage.value, pageSize.value)
}

onMounted(() => getActivityTypeList(currentPage.value, pageSize.value))
</script>

<template>
  <div class="activity-type">
    <el-card shadow="never" class="toolbar-card">
      <el-button type="primary" :icon="Plus" @click="handleAdd">新增类型</el-button>
    </el-card>

    <el-card shadow="never" class="table-card">
      <el-table :data="tableData" v-loading="loading" stripe border>
        <el-table-column label="序号" min-width="60" align="center" type="index" />
        <el-table-column prop="name" label="类型名称" min-width="180" align="center" />
        <el-table-column prop="sort" label="排序" min-width="80" align="center" />
        <el-table-column prop="status" label="状态" min-width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination class="pagination" v-model:current-page="currentPage" v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]" :total="total" layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange" @size-change="handleSizeChange" />
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="420px" destroy-on-close>
      <el-form :model="formData" label-width="80px">
        <el-form-item label="类型名称">
          <el-input v-model="formData.name" placeholder="请输入类型名称" clearable />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="formData.sort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio value="active">启用</el-radio>
            <el-radio value="disabled">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.activity-type {
  height: 100%;
  display: flex;
  flex-direction: column;

  .toolbar-card {
    flex-shrink: 0;
    margin-bottom: 16px;
  }

  @include table();
}
</style>
