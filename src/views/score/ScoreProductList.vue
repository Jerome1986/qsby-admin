<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadFile, UploadUserFile } from 'element-plus'
import type { ScoreProduct, ScoreProductCategory } from '@/types/ScoreProduct'
import { useUserStore } from '@/stores'
import { formatTimestamp } from '@/utils/formatUtil'
import {
  getScoreProductList,
  scoreProductAdd,
  scoreProductUpdate,
  deleteScoreProduct,
  getScoreCategories,
} from '@/api/scoreProduct'

/** 商品列表数据 */
const tableData = ref<ScoreProduct[]>([])
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
  categoryId: 'all',
})

/** 分类下拉选项 */
const categoryOptions = ref<ScoreProductCategory[]>([])

const userStore = useUserStore()

/** 封面上传地址 */
const UPLOAD_URL = 'https://x9zmst6evg.sealoshzh.site/upload/images'

/** 封面图文件列表 */
const coverFileList = ref<UploadUserFile[]>([])
/** 详情图片文件列表 */
const imagesFileList = ref<UploadUserFile[]>([])
/** 上传请求头 */
const uploadHeaders = computed(() => ({
  Authorization: userStore.token || '',
}))

/** 加载分类列表 */
const loadCategories = async () => {
  try {
    const res = await getScoreCategories(1, 100)
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

/** 重置搜索 */
const handleReset = () => {
  searchForm.value = { name: '', categoryId: 'all' }
  currentPage.value = 1
  getList(currentPage.value, pageSize.value)
}

/** 获取商品列表 */
const getList = async (pageNum: number, pageSize: number) => {
  loading.value = true
  try {
    const res = await getScoreProductList(pageNum, pageSize, {
      name: searchForm.value.name || undefined,
      categoryId: searchForm.value.categoryId !== 'all' ? searchForm.value.categoryId : undefined,
    })
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
const dialogTitle = ref('新增商品')
/** 表单数据 */
const formData = ref<Partial<ScoreProduct>>({
  name: '',
  category: '',
  cover: '',
  images: [],
  scorePrice: 0,
  status: 'on',
})

/** 封面上传成功 */
const handleCoverSuccess = (response: unknown, file: UploadFile) => {
  const url = typeof response === 'string' ? response : (response as { url?: string })?.url
  if (url) {
    formData.value!.cover = url
    file.url = url
  }
}

/** 封面上传失败 */
const handleCoverError = () => {
  ElMessage.error('封面上传失败')
}

/** 移除封面 */
const handleCoverRemove = () => {
  formData.value!.cover = ''
}

/** 详情图上传成功 */
const handleImagesSuccess = (response: unknown, file: UploadFile) => {
  const url = typeof response === 'string' ? response : (response as { url?: string })?.url
  if (url) {
    const imgs = formData.value!.images ?? []
    formData.value!.images = [...imgs, url]
    file.url = url
  }
}

/** 详情图上传失败 */
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
  dialogTitle.value = '新增商品'
  const firstCategoryId = categoryOptions.value[0]?._id ?? ''
  formData.value = {
    name: '',
    category: firstCategoryId,
    cover: '',
    images: [],
    scorePrice: 0,
    status: 'on',
  }
  coverFileList.value = []
  imagesFileList.value = []
  dialogVisible.value = true
}

/** 打开编辑弹窗 */
const handleEdit = (row: ScoreProduct) => {
  dialogTitle.value = '编辑商品'
  formData.value = { ...row }
  coverFileList.value = row.cover ? [{ name: 'cover', url: row.cover }] : []
  imagesFileList.value = (row.images ?? []).map((url, i) => ({ name: `img-${i}`, url }))
  dialogVisible.value = true
}

/** 删除商品 */
const handleDelete = (row: ScoreProduct) => {
  ElMessageBox.confirm(`确认删除商品「${row.name}」吗？`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteScoreProduct(row._id)
        ElMessage.success('删除成功')
        await getList(currentPage.value, pageSize.value)
      } catch {
        // 接口占位
      }
    })
    .catch(() => {})
}

/** 提交表单（新增/编辑） */
const handleConfirm = async () => {
  if (!formData.value.name?.trim()) {
    ElMessage.warning('请输入商品名称')
    return
  }
  if (!formData.value.category) {
    ElMessage.warning('请选择分类')
    return
  }
  try {
    const payload = {
      name: formData.value.name,
      category: formData.value.category,
      cover: formData.value.cover || '',
      images: formData.value.images ?? [],
      scorePrice: formData.value.scorePrice ?? 0,
      status: formData.value.status || 'on',
    }
    if (formData.value._id) {
      await scoreProductUpdate(formData.value._id, payload)
    } else {
      await scoreProductAdd(payload)
    }
    ElMessage.success(formData.value._id ? '编辑成功' : '新增成功')
    dialogVisible.value = false
    await getList(currentPage.value, pageSize.value)
  } catch {
    // 接口占位
  }
}

/** 根据分类ID获取名称 */
const getCategoryName = (categoryId: string) => {
  if (!categoryId) return '-'
  const item = categoryOptions.value.find((o) => o._id === categoryId)
  return item?.name ?? categoryId
}

onMounted(() => {
  loadCategories()
  getList(currentPage.value, pageSize.value)
})
</script>

<template>
  <div class="score-product-list">
    <div class="search-toolbar-row">
      <div class="search-card">
        <el-form :model="searchForm" inline @submit.prevent="handleSearch">
          <el-form-item label="商品名称">
            <el-input v-model="searchForm.name" placeholder="请输入商品名称" clearable />
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="searchForm.categoryId" placeholder="全部" clearable style="width: 120px">
              <el-option label="全部" value="all" />
              <el-option v-for="opt in categoryOptions" :key="opt._id" :label="opt.name" :value="opt._id" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" native-type="submit">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="toolbar-card">
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增商品</el-button>
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
        <el-table-column prop="name" label="商品名称" min-width="140" align="center" show-overflow-tooltip />
        <el-table-column label="分类" min-width="100" align="center">
          <template #default="{ row }">{{ getCategoryName(row.category) || row.categoryName || '-' }}</template>
        </el-table-column>
        <el-table-column prop="scorePrice" label="积分价格" min-width="100" align="center">
          <template #default="{ row }">{{ row.scorePrice ?? 0 }} 积分</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 'on' ? 'success' : 'danger'" size="small">
              {{ row.status === 'on' ? '上架' : '下架' }}
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
        <el-form-item label="分类">
          <el-select v-model="formData.category" placeholder="请选择分类" style="width: 100%">
            <el-option v-for="opt in categoryOptions" :key="opt._id" :label="opt.name" :value="opt._id" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="formData.name" placeholder="请输入商品名称" clearable />
        </el-form-item>
        <el-form-item label="积分价格">
          <el-input-number v-model="formData.scorePrice" :min="0" :max="999999" />
        </el-form-item>
        <el-form-item label="封面图">
          <el-upload v-model:file-list="coverFileList" :action="UPLOAD_URL" :headers="uploadHeaders"
            list-type="picture-card" :limit="1" accept="image/*" :on-success="handleCoverSuccess"
            :on-error="handleCoverError" :on-remove="handleCoverRemove">
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="详情图">
          <el-upload v-model:file-list="imagesFileList" :action="UPLOAD_URL" :headers="uploadHeaders"
            list-type="picture-card" accept="image/*" :on-success="handleImagesSuccess"
            :on-error="handleImagesError" :on-remove="handleImagesRemove">
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio value="on">上架</el-radio>
            <el-radio value="off">下架</el-radio>
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
.score-product-list {
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
    }
  }

  @include table();
}
</style>
