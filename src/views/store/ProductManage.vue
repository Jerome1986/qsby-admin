<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadFile, UploadUserFile } from 'element-plus'
import type { ProductItem, ProductTypeItem } from '@/types/Store'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { formatTimestamp } from '@/utils/formatUtil'
import {
  getProductList,
  productAdd,
  productUpdate,
  deleteProduct,
  getStoreList,
  getProductTypes,
} from '@/api/store'

const route = useRoute()
const router = useRouter()

/** 从门店列表进入时携带的门店信息 */
const storeId = computed(() => route.query.storeId as string)
const storeName = computed(() => route.query.storeName as string)
/** 是否从门店列表进入（有 storeId） */
const isFromStore = computed(() => !!storeId.value)

/** 产品列表数据 */
const tableData = ref<ProductItem[]>([])
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
  storeId: 'all',
  productTypeId: 'all' as string,
})

/** 门店下拉选项 */
const storeOptions = ref<{ _id: string; name: string }[]>([])

const userStore = useUserStore()

/** 封面上传地址 */
const UPLOAD_URL = 'https://x9zmst6evg.sealoshzh.site/upload/images'

/** 封面图文件列表 */
const coverFileList = ref<UploadUserFile[]>([])
/** 详情图片文件列表 */
const imagesFileList = ref<UploadUserFile[]>([])
/** 上传请求头（含 token） */
const uploadHeaders = computed(() => ({
  Authorization: userStore.token || '',
}))

/** 产品类型下拉选项 */
const productTypeOptions = ref<ProductTypeItem[]>([])

/** 加载产品类型列表（用于下拉） */
const loadProductTypes = async () => {
  try {
    const res = await getProductTypes(1, 100)
    productTypeOptions.value = res.data?.list?.filter((i) => i.status === 'active') ?? []
  } catch {
    productTypeOptions.value = []
  }
}

/** 加载门店列表（用于下拉） */
const loadStores = async () => {
  try {
    const res = await getStoreList(1, 200)
    storeOptions.value = (res.data?.list ?? []).map((s) => ({ _id: s._id, name: s.name }))
  } catch {
    storeOptions.value = []
  }
}

/** 点击搜索 */
const handleSearch = () => {
  currentPage.value = 1
  getList(currentPage.value, pageSize.value)
}

/** 重置搜索条件 */
const handleReset = () => {
  searchForm.value = {
    name: '',
    storeId: isFromStore.value ? storeId.value : 'all',
    productTypeId: 'all',
  }
  currentPage.value = 1
  getList(currentPage.value, pageSize.value)
}

/** 获取产品列表 */
const getList = async (pageNum: number, pageSize: number) => {
  loading.value = true
  try {
    const res = await getProductList(pageNum, pageSize, searchForm.value)
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

/** 弹窗显隐 */
const dialogVisible = ref(false)
/** 弹窗标题 */
const dialogTitle = ref('新增产品')
/** 表单数据 */
const formData = ref<Partial<ProductItem>>({
  storeId: '',
  prodcutTypeId: '',
  name: '',
  specLabel: '',
  tag: '',
  price: 0,
  commission: 0,
  cover: '',
  images: [],
  description: '',
  sort: 0,
  status: 'active',
})

/** 封面上传成功回调 */
const handleCoverSuccess = (response: unknown, file: UploadFile) => {
  const url = typeof response === 'string' ? response : (response as { url?: string })?.url
  if (url) {
    formData.value!.cover = url
    file.url = url
  }
}

/** 封面上传失败回调 */
const handleCoverError = () => {
  ElMessage.error('封面上传失败')
}

/** 移除封面 */
const handleCoverRemove = () => {
  formData.value!.cover = ''
}

/** 详情图上传成功回调 */
const handleImagesSuccess = (response: unknown, file: UploadFile) => {
  const url = typeof response === 'string' ? response : (response as { url?: string })?.url
  if (url) {
    const imgs = formData.value!.images ?? []
    formData.value!.images = [...imgs, url]
    file.url = url
  }
}

/** 详情图上传失败回调 */
const handleImagesError = () => {
  ElMessage.error('详情图上传失败')
}

/** 移除详情图 */
const handleImagesRemove = (file: UploadFile) => {
  const url = file.url ?? (typeof file.response === 'object' && file.response !== null
    ? (file.response as { url?: string }).url
    : undefined)
  if (url) {
    formData.value!.images = (formData.value!.images ?? []).filter((u) => u !== url)
  }
}

/** 打开新增弹窗 */
const handleAdd = () => {
  dialogTitle.value = '新增产品'
  const firstTypeId = productTypeOptions.value[0]?._id ?? ''
  formData.value = {
    storeId: isFromStore.value ? storeId.value : '',
    prodcutTypeId: firstTypeId,
    name: '',
    specLabel: '',
    tag: '',
    price: 0,
    commission: 0,
    cover: '',
    images: [],
    description: '',
    sort: 0,
    status: 'active',
  }
  coverFileList.value = []
  imagesFileList.value = []
  dialogVisible.value = true
}

/** 打开编辑弹窗 */
const handleEdit = (row: ProductItem) => {
  dialogTitle.value = '编辑产品'
  formData.value = { ...row }
  coverFileList.value = row.cover ? [{ name: 'cover', url: row.cover }] : []
  imagesFileList.value = (row.images ?? []).map((url, i) => ({ name: `img-${i}`, url }))
  dialogVisible.value = true
}

/** 删除产品 */
const handleDelete = (row: ProductItem) => {
  ElMessageBox.confirm(`确认删除产品「${row.name}」吗？`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteProduct(row._id)
        ElMessage.success('删除成功')
        await getList(currentPage.value, pageSize.value)
      } catch {
        // 接口占位
      }
    })
    .catch(() => { })
}

/** 提交表单（新增/编辑） */
const handleConfirm = async () => {
  if (!formData.value.name?.trim()) {
    ElMessage.warning('请输入产品名称')
    return
  }
  if (!formData.value.storeId) {
    ElMessage.warning('请选择关联门店')
    return
  }
  try {
    const payload = {
      storeId: formData.value.storeId,
      productTypeId: formData.value.prodcutTypeId || '',
      name: formData.value.name,
      specLabel: formData.value.specLabel?.trim() || '',
      tag: formData.value.tag || '',
      price: formData.value.price ?? 0,
      commission: formData.value.commission ?? 0,
      cover: formData.value.cover || '',
      images: formData.value.images ?? [],
      description: formData.value.description || '',
      sort: formData.value.sort ?? 0,
      status: formData.value.status || 'active',
    }
    if (formData.value._id) {
      await productUpdate(formData.value._id, payload)
    } else {
      await productAdd(payload)
    }
    ElMessage.success(formData.value._id ? '编辑成功' : '新增成功')
    dialogVisible.value = false
    await getList(currentPage.value, pageSize.value)
  } catch {
    // 接口占位
  }
}

/** 根据产品类型ID获取展示文案 */
const getProductTypeLabel = (productTypeId: string) => {
  if (!productTypeId) return '-'
  const item = productTypeOptions.value.find((o) => o._id === productTypeId)
  return item?.name ?? productTypeId
}

/** 返回门店列表 */
const handleBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/store/list')
  }
}

watch(
  () => storeId.value,
  (id) => {
    if (id) {
      searchForm.value.storeId = id
      currentPage.value = 1
      getList(currentPage.value, pageSize.value)
    }
  },
  { immediate: true },
)

onMounted(() => {
  loadStores()
  loadProductTypes()
  if (storeId.value) {
    searchForm.value.storeId = storeId.value
  }
  getList(currentPage.value, pageSize.value)
})
</script>

<template>
  <div class="product-manage">
    <el-page-header v-if="isFromStore" @back="handleBack" class="page-header">
      <template #content>
        <span class="page-title">产品管理</span>
        <span v-if="storeName" class="store-name-hint">{{ storeName }}</span>
      </template>
    </el-page-header>
    <div class="search-toolbar-row">
      <div class="search-card">
        <el-form :model="searchForm" inline @submit.prevent="handleSearch">
          <el-form-item label="产品名称">
            <el-input v-model="searchForm.name" placeholder="如：大床房、双床房" clearable />
          </el-form-item>
          <el-form-item v-if="!isFromStore" label="关联门店">
            <el-select v-model="searchForm.storeId" placeholder="全部" clearable style="width: 160px">
              <el-option label="全部" value="all" />
              <el-option v-for="s in storeOptions" :key="s._id" :label="s.name" :value="s._id" />
            </el-select>
          </el-form-item>
          <el-form-item label="产品类型">
            <el-select v-model="searchForm.productTypeId" placeholder="全部" clearable style="width: 120px">
              <el-option label="全部" value="all" />
              <el-option v-for="opt in productTypeOptions" :key="opt._id" :label="opt.name" :value="opt._id" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" native-type="submit">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="toolbar-card">
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增产品</el-button>
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
        <el-table-column prop="name" label="产品名称" min-width="120" align="center" show-overflow-tooltip />
        <el-table-column prop="specLabel" label="规格" min-width="80" align="center" show-overflow-tooltip>
          <template #default="{ row }">{{ row.specLabel || '-' }}</template>
        </el-table-column>
        <el-table-column prop="tag" label="标签说明" min-width="100" align="center" show-overflow-tooltip>
          <template #default="{ row }">{{ row.tag || '-' }}</template>
        </el-table-column>
        <el-table-column label="产品类型" min-width="100" align="center">
          <template #default="{ row }">{{ getProductTypeLabel(row.prodcutTypeId) }}</template>
        </el-table-column>
        <el-table-column prop="storeName" label="关联门店" min-width="140" align="center" show-overflow-tooltip />
        <el-table-column prop="price" label="价格" min-width="100" align="center">
          <template #default="{ row }">¥{{ row.price ?? 0 }}</template>
        </el-table-column>
        <el-table-column prop="commission" label="佣金" min-width="80" align="center">
          <template #default="{ row }">¥{{ row.commission ?? 0 }}</template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" min-width="80" align="center" />
        <el-table-column prop="status" label="状态" min-width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" min-width="170" align="center">
          <template #default="{ row }">{{ formatTimestamp(row.createdAt, 2) }}</template>
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="560px" destroy-on-close>
      <el-form :model="formData" label-width="100px">
        <el-form-item label="关联门店">
          <el-select v-model="formData.storeId" placeholder="请选择门店" style="width: 100%">
            <el-option v-for="s in storeOptions" :key="s._id" :label="s.name" :value="s._id" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品类型">
          <el-select v-model="formData.prodcutTypeId" placeholder="请选择" style="width: 100%">
            <el-option v-for="opt in productTypeOptions" :key="opt._id" :label="opt.name" :value="opt._id" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input v-model="formData.name" placeholder="如：大床房、双床房、豪华套房" clearable />
        </el-form-item>
        <el-form-item label="规格">
          <el-input v-model="formData.specLabel" placeholder="如：晚、次等" clearable />
        </el-form-item>
        <el-form-item label="标签说明">
          <el-input v-model="formData.tag" placeholder="请输入标签说明" clearable />
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="formData.price" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="主理人佣金">
          <el-input-number v-model="formData.commission" :min="0" :precision="2" style="width: 100%"
            placeholder="固定值" />
        </el-form-item>
        <el-form-item label="封面图">
          <el-upload v-model:file-list="coverFileList" :action="UPLOAD_URL" :headers="uploadHeaders"
            list-type="picture-card" :limit="1" accept="image/*" :on-success="handleCoverSuccess"
            :on-error="handleCoverError" :on-remove="handleCoverRemove">
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="详情图片">
          <el-upload v-model:file-list="imagesFileList" :action="UPLOAD_URL" :headers="uploadHeaders" multiple
            list-type="picture-card" :limit="9" accept="image/*" :on-success="handleImagesSuccess"
            :on-error="handleImagesError" :on-remove="handleImagesRemove">
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入产品简介" />
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
.product-manage {
  height: 100%;
  display: flex;
  flex-direction: column;

  .page-header {
    margin-bottom: 16px;
  }

  .page-title {
    font-weight: 600;
  }

  .store-name-hint {
    font-size: 12px;
    color: #909399;
    margin-left: 12px;
  }

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
