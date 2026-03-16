<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { ProjectModeItem } from '@/types/Project'
import {
  deleteProjectMode,
  getProjectModes,
  projectAddMode,
  projectUpdateMode,
} from '@/api/project.ts'

const tableData = ref<ProjectModeItem[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

const dialogVisible = ref(false)
const dialogTitle = ref('新增合作方式')
const formData = ref<Partial<ProjectModeItem>>({
  name: '',
  sort: 0,
  status: 'active',
})

const getList = async (pageNum: number, pageSize: number) => {
  loading.value = true
  try {
    const res = await getProjectModes(pageNum, pageSize)
    tableData.value = res.data?.list ?? []
    total.value = res.data?.total ?? 0
  } catch {
    tableData.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  getList(currentPage.value, pageSize.value)
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  getList(currentPage.value, pageSize.value)
}

const handleAdd = () => {
  dialogTitle.value = '新增合作方式'
  formData.value = { name: '', sort: 0, status: 'active' }
  dialogVisible.value = true
}

const handleEdit = (row: ProjectModeItem) => {
  dialogTitle.value = '编辑合作方式'
  formData.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = (row: ProjectModeItem) => {
  ElMessageBox.confirm(`确认删除「${row.name}」吗？`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteProjectMode(row._id)
        ElMessage.success('删除成功')
        await getList(currentPage.value, pageSize.value)
      } catch {
        // 接口占位
      }
    })
    .catch(() => {})
}

const handleConfirm = async () => {
  if (!formData.value.name?.trim()) {
    ElMessage.warning('请输入名称')
    return
  }
  try {
    if (formData.value._id) {
      await projectUpdateMode(
        formData.value._id,
        formData.value.name,
        formData.value.sort || 0,
        formData.value.status || 'active',
      )
    } else {
      await projectAddMode(
        formData.value.name,
        formData.value.sort ?? 0,
        formData.value.status || 'active',
      )
    }
    ElMessage.success(formData.value._id ? '编辑成功' : '新增成功')
    dialogVisible.value = false
    await getList(currentPage.value, pageSize.value)
  } catch {
    // 接口占位
  }
}

onMounted(() => getList(currentPage.value, pageSize.value))
</script>

<template>
  <div class="project-mode">
    <el-card shadow="never" class="toolbar-card">
      <el-button type="primary" :icon="Plus" @click="handleAdd">新增合作方式</el-button>
    </el-card>

    <el-card shadow="never" class="table-card">
      <el-table :data="tableData" v-loading="loading" stripe border>
        <el-table-column label="序号" min-width="60" align="center" type="index" />
        <el-table-column prop="name" label="名称" min-width="180" align="center" />
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

      <el-pagination
        class="pagination"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="420px" destroy-on-close>
      <el-form :model="formData" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="formData.name" placeholder="如：资源合作、技术合作" clearable />
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
.project-mode {
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
