<!--
  普通用户管理页：搜索 + 列表 + 编辑弹窗，不支持新增
-->
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import type { UserItem } from '@/types/UserItem'
import EditUserDialog from './components/EditUserDialog.vue'
import { genderMap, roleMap, formatTimestamp } from '@/utils/formatUtil'
import { getUserByRole, searchUserByMobile, updateUserById } from '@/api/user'
import type { QxEditUserDialog } from '@/types/Components'
import { ElMessage } from 'element-plus'

// 基础数据
const tableData = ref<UserItem[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 搜索
const searchForm = reactive({
  mobile: '',
})

const handleSearch = async () => {
  currentPage.value = 1
  total.value = 1 // 精准搜索，返回数据只能是1条
  // 调用接口搜索
  const res = await searchUserByMobile(searchForm.mobile, 'user')
  tableData.value = res.data
}

// 重置搜索内容
const handleReset = () => {
  searchForm.mobile = ''
  currentPage.value = 1
  getUserList(currentPage.value, pageSize.value)
}

// 获取普通用户列表
const getUserList = async (currentPage: number, pageSize: number) => {
  const res = await getUserByRole('user', currentPage, pageSize)
  tableData.value = res.data.list
  total.value = res.data.total
}

// 处理分页
const handlePageChange = (page: number) => {
  currentPage.value = page
  //  重新加载数据
  getUserList(currentPage.value, pageSize.value)
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  //  重新加载数据
  getUserList(currentPage.value, pageSize.value)
}

// 组件
const dialogRefs = ref<QxEditUserDialog>()
const mode = ref<'edit' | 'add'>('edit')
// 编辑
const handleEdit = (row: UserItem) => {
  mode.value = 'edit'
  dialogRefs.value?.open(row)
}

const handleEditConfirm = async (form: Partial<UserItem>) => {
  //  调用接口保存
  if (mode.value === 'edit' && form._id) {
    const res = await updateUserById(
      form._id,
      form.nickname!,
      form.username!,
      form.age!,
      form.gender!,
      form.mobile!,
      form.role!,
      form.idCard!,
      form.status!,
    )
    // 重新渲染
    await getUserList(currentPage.value, pageSize.value)
    ElMessage.success(res.message)
  }
}

onMounted(() => getUserList(currentPage.value, pageSize.value))
</script>

<template>
  <div class="normal-user">
    <!-- 搜索区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" inline @submit.prevent="handleSearch">
        <el-form-item label="手机号">
          <el-input v-model="searchForm.mobile" placeholder="请输入手机号" clearable />
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
        <el-table-column prop="avatarUrl" label="头像" min-width="70" align="center">
          <template #default="{ row }">
            <el-avatar :size="36" :src="row.avatarUrl" />
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" min-width="120" align="center" />
        <el-table-column prop="username" label="真实姓名" min-width="120" align="center">
          <template #default="{ row }">
            {{ row.username ?? '未实名' }}
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" min-width="130" align="center" />
        <el-table-column prop="gender" label="性别" min-width="70" align="center">
          <template #default="{ row }">{{ genderMap[row.gender] }}</template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" min-width="70" align="center" />
        <el-table-column prop="role" label="角色" min-width="100" align="center">
          <template #default="{ row }">
            <el-tag
              :type="row.role === 'admin' ? 'danger' : row.role === 'manager' ? 'warning' : 'info'"
              size="small"
            >
              {{ roleMap[row.role] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="积分" min-width="70" align="center" />
        <el-table-column prop="balance" label="代金券余额" min-width="100" align="center" />
        <el-table-column prop="referralCode" label="邀请码" min-width="100" align="center" />
        <el-table-column
          prop="idCard"
          label="身份证号"
          min-width="100"
          align="center"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            {{ row.idCard ?? '未实名' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" min-width="170" align="center">
          <template #default="{ row }">{{ formatTimestamp(row.registerTime, 2) }}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="100">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
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

    <!-- 编辑弹窗 -->
    <EditUserDialog ref="dialogRefs" :mode="mode" @confirm="handleEditConfirm" />
  </div>
</template>

<style scoped lang="scss">
.normal-user {
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
