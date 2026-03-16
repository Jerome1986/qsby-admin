<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { ProductTypeItem } from '@/types/Store'
import {
  deleteProductType,
  getProductTypes,
  productTypeAdd,
  productTypeUpdate,
} from '@/api/store'

/** 产品类型列表数据 */
const tableData = ref<ProductTypeItem[]>([])
/** 列表加载状态 */
const loading = ref(false)
/** 列表总数 */
const total = ref(0)
/** 当前页码 */
const currentPage = ref(1)
/** 每页条数 */
const pageSize = ref(10)

/** 弹窗显隐 */
const dialogVisible = ref(false)
/** 弹窗标题 */
const dialogTitle = ref('新增产品类型')
/** 表单数据 */
const formData = ref<Partial<ProductTypeItem>>({
  name: '',
  sort: 0,
  status: 'active',
})

/** 获取产品类型列表 */
const getList = async (pageNum: number, pageSize: number) => {
  loading.value = true
  try {
    const res = await getProductTypes(pageNum, pageSize)
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

/** 打开新增弹窗 */
const handleAdd = () => {
  dialogTitle.value = '新增产品类型'
  formData.value = { name: '', sort: 0, status: 'active' }
  dialogVisible.value = true
}

/** 打开编辑弹窗 */
const handleEdit = (row: ProductTypeItem) => {
  dialogTitle.value = '编辑产品类型'
  formData.value = { ...row }
  dialogVisible.value = true
}

/** 删除产品类型 */
const handleDelete = (row: ProductTypeItem) => {
  ElMessageBox.confirm(`确认删除「${row.name}」吗？`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteProductType(row._id)
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
    ElMessage.warning('请输入产品类型名称')
    return
  }
  try {
    if (formData.value._id) {
      await productTypeUpdate(
        formData.value._id,
        formData.value.name,
        formData.value.sort || 0,
        formData.value.status || 'active',
      )
    } else {
      await productTypeAdd(
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
  <div class="store-product-type">
    <el-card shadow="never" class="toolbar-card">
      <el-button type="primary" :icon="Plus" @click="handleAdd">新增产品类型</el-button>
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
.store-product-type {
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
