<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatTimestamp } from '@/utils/formatUtil'
import type { AdminItem, AdminRole, AdminStatus } from '@/types/Admin'
import { addAdminUserApi, deleteAdminUserApi, updateAdminUserApi } from '@/api/settingAdmin'
import { getAdminUser } from '@/api/settingAdmin'

// ======================== 基础数据 ========================

const tableData = ref<AdminItem[]>([])
const loading = ref(false)

// ======================== 搜索相关 ========================

const searchForm = ref({
  account: '',
})

const handleSearch = () => {
  getAdminList()
}

const handleReset = () => {
  searchForm.value = { account: '' }
  getAdminList()
}

// ======================== 列表数据 ========================

const getAdminList = async () => {
  loading.value = true
  try {
    // 替换为真实接口
    const res = await getAdminUser()
    tableData.value = res.data
  } finally {
    loading.value = false
  }
}

// ======================== 新增/编辑弹窗 ========================

const dialogVisible = ref(false)
const dialogTitle = ref('添加账号')
const formData = ref<Partial<AdminItem>>({
  role: 'admin',
  account: '',
  status: 'active',
})
const passwordForm = ref({
  password: '',
  confirmPassword: '',
})

const handleAdd = () => {
  dialogTitle.value = '添加账号'
  formData.value = { role: 'admin', account: '', status: 'active' }
  passwordForm.value = { password: '', confirmPassword: '' }
  dialogVisible.value = true
}

const handleEdit = (row: AdminItem) => {
  dialogTitle.value = '编辑账号'
  formData.value = { ...row }
  passwordForm.value = { password: '', confirmPassword: '' }
  dialogVisible.value = true
}

const handleConfirm = async () => {
  if (!formData.value.account?.trim()) {
    ElMessage.warning('请输入账号')
    return
  }
  if (!formData.value._id && !passwordForm.value.password) {
    ElMessage.warning('请输入密码')
    return
  }
  if (
    passwordForm.value.password &&
    passwordForm.value.password !== passwordForm.value.confirmPassword
  ) {
    ElMessage.warning('两次密码输入不一致')
    return
  }

  if (formData.value._id) {
    //  调用编辑接口
    await updateAdminUserApi(
      formData.value._id,
      formData.value.role as AdminRole,
      formData.value.account!,
      passwordForm.value.password,
      formData.value.status as AdminStatus,
    )
    ElMessage.success('编辑成功')
  } else {
    await addAdminUserApi(
      formData.value.role as AdminRole,
      formData.value.account!,
      passwordForm.value.password,
      formData.value.status as AdminStatus,
    )
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
  await getAdminList()
}

// ======================== 删除 ========================

const handleDelete = (row: AdminItem) => {
  ElMessageBox.confirm(`确认删除账号「${row.account}」吗？`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      // 调用删除接口
      await deleteAdminUserApi(row._id)
      ElMessage.success('删除成功')
      await getAdminList()
    })
    .catch(() => {})
}

// ======================== 生命周期 ========================

onMounted(() => getAdminList())
</script>

<template>
  <div class="set-admin">
    <!-- 搜索区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" inline @submit.prevent="handleSearch">
        <el-form-item>
          <el-input v-model="searchForm.account" placeholder="搜索账号" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" native-type="submit" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Plus" @click="handleAdd">添加账号</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card shadow="never" class="table-card">
      <el-table :data="tableData" v-loading="loading" stripe border>
        <el-table-column label="序号" min-width="60" align="center" type="index" />
        <el-table-column prop="role" label="角色" min-width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'success'" size="small">
              {{ row.role === 'admin' ? '审核员' : '管理员' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="account" label="账号" min-width="150" align="center" />
        <el-table-column prop="loginCount" label="登录次数" min-width="100" align="center" />
        <el-table-column prop="registerIp" label="注册IP" min-width="140" align="center" />
        <el-table-column prop="createdAt" label="创建时间" min-width="170" align="center">
          <template #default="{ row }">{{ formatTimestamp(row.createdAt, 2) }}</template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" min-width="170" align="center">
          <template #default="{ row }">{{ formatTimestamp(row.updatedAt, 2) }}</template>
        </el-table-column>
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
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="460px" destroy-on-close>
      <el-form :model="formData" label-width="90px">
        <el-form-item label="角色">
          <el-select v-model="formData.role" style="width: 100%">
            <el-option label="审核员" value="admin" />
            <el-option label="管理员" value="superAdmin" />
          </el-select>
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="formData.account" placeholder="请输入账号" clearable />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="passwordForm.password"
            type="password"
            :placeholder="formData._id ? '留空则不修改密码' : '请输入密码'"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password
            clearable
          />
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
.set-admin {
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

  @include table();
}
</style>
