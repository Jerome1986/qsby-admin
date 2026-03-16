<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { StoreItem, StoreCategoryItem } from '@/types/Store'
import type { CityItem } from '@/types/City'
import { formatTimestamp } from '@/utils/formatUtil'
import { getStoreList, getStoreCategories, deleteStore } from '@/api/store'
import StoreFormDialog from './StoreFormDialog.vue'
import StoreDetailDialog from './StoreDetailDialog.vue'
import { useCityStore } from '@/stores'

const cityStore = useCityStore()

/** 仅激活状态的城市，用于下拉选择 */
const activeCityList = computed(() =>
  cityStore.cityList.filter((c) => c.status === 'active'),
)

/** 门店列表数据 */
const tableData = ref<StoreItem[]>([])
/** 列表加载状态 */
const loading = ref(false)
/** 列表总数 */
const total = ref(0)
/** 当前页码 */
const currentPage = ref(1)
/** 每页条数 */
const pageSize = ref(10)

/** 搜索表单 */
const searchForm = ref({
  name: '',
  cityId: 'all',
  categoryId: 'all',
})

/** 门店分类下拉选项 */
const categoryOptions = ref<StoreCategoryItem[]>([])

/** 加载门店分类列表 */
const loadCategories = async () => {
  try {
    const res = await getStoreCategories(1, 100)
    categoryOptions.value = res.data?.list?.filter((i) => i.status === 'active') ?? []
  } catch {
    categoryOptions.value = []
  }
}

/** 点击搜索 */
const handleSearch = () => {
  currentPage.value = 1
  getList(currentPage.value, pageSize.value)
}

/** 重置搜索条件 */
const handleReset = () => {
  searchForm.value = { name: '', cityId: 'all', categoryId: 'all' }
  currentPage.value = 1
  getList(currentPage.value, pageSize.value)
}

/** 获取门店列表 */
const getList = async (pageNum: number, pageSize: number) => {
  loading.value = true
  try {
    const res = await getStoreList(pageNum, pageSize, searchForm.value)
    tableData.value = res.data?.list ?? []
    total.value = res.data?.total ?? 0
  } catch {
    tableData.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

/** 页码切换 */
const handlePageChange = (page: number) => {
  currentPage.value = page
  getList(currentPage.value, pageSize.value)
}

/** 每页条数切换 */
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  getList(currentPage.value, pageSize.value)
}

/** 新增/编辑弹窗显隐 */
const formDialogVisible = ref(false)
/** 编辑时的门店数据 */
const editData = ref<StoreItem | null>(null)

/** 打开新增弹窗 */
const handleAdd = () => {
  editData.value = null
  formDialogVisible.value = true
}

/** 打开编辑弹窗 */
const handleEdit = (row: StoreItem) => {
  editData.value = row
  formDialogVisible.value = true
}

/** 表单提交成功后刷新列表 */
const handleFormConfirmed = () => {
  getList(currentPage.value, pageSize.value)
}

/** 删除门店 */
const handleDelete = (row: StoreItem) => {
  ElMessageBox.confirm(`确认删除门店「${row.name}」吗？`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteStore(row._id)
        ElMessage.success('删除成功')
        await getList(currentPage.value, pageSize.value)
      } catch {
        // 接口占位
      }
    })
    .catch(() => { })
}

/** 详情弹窗显隐 */
const detailVisible = ref(false)
/** 当前查看详情的门店 */
const currentDetail = ref<StoreItem | null>(null)

/** 打开详情弹窗 */
const handleDetail = (row: StoreItem) => {
  currentDetail.value = row
  detailVisible.value = true
}

/** 根据城市ID获取城市名称 */
const getCityName = (cityId: string) => {
  const city = cityStore.cityList.find((c: CityItem) => c._id === cityId)
  return city?.name ?? cityId
}

/** 根据分类ID获取分类名称 */
const getCategoryName = (categoryId: string) => {
  if (!categoryId) return '-'
  const cat = categoryOptions.value.find((c) => c._id === categoryId)
  return cat?.name ?? categoryId
}

onMounted(() => {
  cityStore.loadCityList()
  getList(currentPage.value, pageSize.value)
  loadCategories()
})
</script>

<template>
  <div class="store-list">
    <div class="search-toolbar-row">
      <div class="search-card">
        <el-form :model="searchForm" inline @submit.prevent="handleSearch">
          <el-form-item label="门店名称">
            <el-input v-model="searchForm.name" placeholder="请输入门店名称" clearable />
          </el-form-item>
          <el-form-item label="站点">
            <el-select v-model="searchForm.cityId" placeholder="全部" clearable style="width: 120px">
              <el-option label="全部" value="all" />
              <el-option v-for="c in activeCityList" :key="c._id" :label="c.name" :value="c._id" />
            </el-select>
          </el-form-item>
          <el-form-item label="门店分类">
            <el-select v-model="searchForm.categoryId" placeholder="全部" clearable style="width: 120px">
              <el-option label="全部" value="all" />
              <el-option v-for="cat in categoryOptions" :key="cat._id" :label="cat.name" :value="cat._id" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" native-type="submit">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="toolbar-card">
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增门店</el-button>
      </div>
    </div>

    <el-card shadow="never" class="table-card">
      <el-table :data="tableData" v-loading="loading" stripe border>
        <el-table-column label="序号" min-width="60" align="center" type="index" />
        <el-table-column prop="cover" label="封面" min-width="80" align="center">
          <template #default="{ row }">
            <el-image v-if="row.cover" :src="row.cover" :preview-src-list="[row.cover]"
              style="width: 50px; height: 50px; border-radius: 4px" fit="cover" preview-teleported
              hide-on-click-modal />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="门店名称" min-width="140" align="center" show-overflow-tooltip />
        <el-table-column label="站点" min-width="100" align="center">
          <template #default="{ row }">{{ getCityName(row.cityId) }}</template>
        </el-table-column>
        <el-table-column label="门店分类" min-width="100" align="center">
          <template #default="{ row }">{{ getCategoryName(row.categoryId) }}</template>
        </el-table-column>
        <el-table-column prop="address" label="门店地址" min-width="180" align="center" show-overflow-tooltip />
        <el-table-column prop="createdAt" label="创建时间" min-width="170" align="center">
          <template #default="{ row }">{{ formatTimestamp(row.createdAt, 2) }}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="100" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleDetail(row)">详情</el-button>
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination class="pagination" v-model:current-page="currentPage" v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]" :total="total" layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange" @size-change="handleSizeChange" />
    </el-card>

    <StoreFormDialog v-model="formDialogVisible" :edit-data="editData" @confirmed="handleFormConfirmed" />

    <StoreDetailDialog v-model="detailVisible" :detail-data="currentDetail" />
  </div>
</template>

<style scoped lang="scss">
.store-list {
  height: 100%;
  display: flex;
  flex-direction: column;

  .search-toolbar-row {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    background-color: #fff;
  }

  .search-card {
    display: flex;
    align-items: center;

    :deep(.el-form) {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 0;
    }

    :deep(.el-form-item) {
      margin-bottom: 0;
      margin-right: 12px;
      display: inline-flex;
      align-items: center;
    }

    :deep(.el-form-item__label) {
      line-height: 32px;
    }

    :deep(.el-form-item__content) {
      line-height: 32px;
    }
  }

  @include table();
}
</style>
