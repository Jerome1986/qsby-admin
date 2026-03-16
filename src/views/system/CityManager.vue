<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { CityItem } from '@/types/City'
import { cityUpdate } from '@/api/city'
import { useCityStore } from '@/stores'

// ======================== Store ========================

const cityStore = useCityStore()

// ======================== 搜索相关 ========================

const searchForm = ref({
  status: '',
  name: '',
})

const filteredData = computed(() => {
  return cityStore.cityList.filter((item) => {
    const matchStatus = !searchForm.value.status || item.status === searchForm.value.status
    const matchName = !searchForm.value.name || item.name.includes(searchForm.value.name)
    return matchStatus && matchName
  })
})

const handleReset = () => {
  searchForm.value = { status: '', name: '' }
}

// ======================== 编辑弹窗 ========================

const dialogVisible = ref(false)
const formData = ref<Partial<CityItem>>({})

const handleEdit = (row: CityItem) => {
  formData.value = { ...row }
  dialogVisible.value = true
}

const handleConfirm = async () => {
  if (!formData.value.name?.trim()) {
    ElMessage.warning('请输入站点名称')
    return
  }
  await cityUpdate(formData.value._id!, formData.value.name, formData.value.status!)
  ElMessage.success('编辑成功')
  dialogVisible.value = false
  await cityStore.refreshCityList()
}

// ======================== 生命周期 ========================

onMounted(() => cityStore.loadCityList())
</script>

<template>
  <div class="city-manager">
    <!-- 搜索区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item>
          <el-select
            v-model="searchForm.status"
            placeholder="选择状态"
            clearable
            style="width: 130px"
          >
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="disabled" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.name" placeholder="搜索城市" clearable />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card shadow="never" class="table-card">
      <el-table :data="filteredData" stripe border>
        <el-table-column label="序号" min-width="60" align="center" type="index" />
        <el-table-column prop="name" label="站点" min-width="150" align="center" />
        <el-table-column prop="code" label="编码" min-width="150" align="center" />
        <el-table-column prop="status" label="状态" min-width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="dialogVisible" title="编辑城市" width="420px" destroy-on-close>
      <el-form :model="formData" label-width="80px">
        <el-form-item label="站点名称">
          <el-input v-model="formData.name" placeholder="请输入站点名称" clearable />
        </el-form-item>
        <el-form-item label="编码">
          <el-input :model-value="formData.code" disabled />
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
.city-manager {
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
