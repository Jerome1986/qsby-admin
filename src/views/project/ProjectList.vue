<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import type { ProjectFormData, ProjectTypeItem, ProjectModeItem, ProjectScaleItem } from '@/types/Project'
import { formatTimestamp } from '@/utils/formatUtil'
import { getProjectTypes, getProjectModes, getProjectScales, projectListFindAll } from '@/api/project'

// ======================== 基础数据 ========================

const tableData = ref<ProjectFormData[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// ======================== 搜索相关 ========================

const searchForm = ref({
  name: '',
  industry: 'all' as string,
  cooperationMode: 'all' as string,
  cooperationScale: 'all' as string,
})

const projectTypeOptions = ref<ProjectTypeItem[]>([])
const projectModeOptions = ref<ProjectModeItem[]>([])
const projectScaleOptions = ref<ProjectScaleItem[]>([])

const loadProjectTypes = async () => {
  try {
    const res = await getProjectTypes(1, 100)
    projectTypeOptions.value = res.data?.list?.filter((item) => item.status === 'active') ?? []
  } catch {
    projectTypeOptions.value = []
  }
}

const loadProjectModes = async () => {
  try {
    const res = await getProjectModes(1, 100)
    projectModeOptions.value = res.data?.list?.filter((item) => item.status === 'active') ?? []
  } catch {
    projectModeOptions.value = []
  }
}

const loadProjectScales = async () => {
  try {
    const res = await getProjectScales(1, 100)
    projectScaleOptions.value = res.data?.list?.filter((item) => item.status === 'active') ?? []
  } catch {
    projectScaleOptions.value = []
  }
}

const handleSearch = () => {
  currentPage.value = 1
  getProjectList(currentPage.value, pageSize.value)
}

const handleReset = () => {
  searchForm.value = { name: '', industry: 'all', cooperationMode: 'all', cooperationScale: 'all' }
  currentPage.value = 1
  getProjectList(currentPage.value, pageSize.value)
}

// 项目类型展示：industry 存的是类型 ID，从 projectTypeOptions 查找名称
const getTypeText = (row: ProjectFormData) =>
  projectTypeOptions.value.find((t) => t._id === row.industry)?.name || row.industry || '-'

// 合作方式/规模展示：优先用接口返回的 Name，否则从配置查找
const getModeText = (row: ProjectFormData) =>
  row.cooperationModeName || projectModeOptions.value.find((m) => m._id === row.cooperationMode)?.name || row.cooperationMode || '-'
const getScaleText = (row: ProjectFormData) =>
  row.cooperationScaleName || projectScaleOptions.value.find((s) => s._id === row.cooperationScale)?.name || row.cooperationScale || '-'

// ======================== 列表数据 ========================

const getProjectList = async (pageNum: number, pageSize: number) => {
  loading.value = true
  try {
    const res = await projectListFindAll(pageNum, pageSize, searchForm.value)
    tableData.value = res.data?.list ?? []
    total.value = res.data?.total ?? 0
  } catch {
    tableData.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// ======================== 分页处理 ========================

const handlePageChange = (page: number) => {
  currentPage.value = page
  getProjectList(currentPage.value, pageSize.value)
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  getProjectList(currentPage.value, pageSize.value)
}

// ======================== 详情弹窗 ========================

const detailVisible = ref(false)
const currentDetail = ref<ProjectFormData | null>(null)

const handleDetail = (row: ProjectFormData) => {
  currentDetail.value = row
  detailVisible.value = true
}

// ======================== 生命周期 ========================

onMounted(() => {
  getProjectList(currentPage.value, pageSize.value)
  loadProjectTypes()
  loadProjectModes()
  loadProjectScales()
})
</script>

<template>
  <div class="project-list">
    <!-- 搜索区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" inline @submit.prevent="handleSearch">
        <el-form-item label="项目名称">
          <el-input v-model="searchForm.name" placeholder="请输入项目名称" clearable />
        </el-form-item>
        <el-form-item label="项目类型">
          <el-select v-model="searchForm.industry" placeholder="全部" clearable style="width: 140px">
            <el-option label="全部" value="all" />
            <el-option v-for="item in projectTypeOptions" :key="item._id" :label="item.name" :value="item._id" />
          </el-select>
        </el-form-item>
        <el-form-item label="合作方式">
          <el-select v-model="searchForm.cooperationMode" placeholder="全部" clearable style="width: 120px">
            <el-option label="全部" value="all" />
            <el-option v-for="opt in projectModeOptions" :key="opt._id" :label="opt.name" :value="opt._id" />
          </el-select>
        </el-form-item>
        <el-form-item label="合作规模">
          <el-select v-model="searchForm.cooperationScale" placeholder="全部" clearable style="width: 120px">
            <el-option label="全部" value="all" />
            <el-option v-for="opt in projectScaleOptions" :key="opt._id" :label="opt.name" :value="opt._id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" native-type="submit">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 - 按接口返回字段渲染 -->
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
        <el-table-column prop="title" label="项目名称" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column label="项目类型" min-width="100" align="center">
          <template #default="{ row }">{{ getTypeText(row) }}</template>
        </el-table-column>
        <el-table-column prop="address_name" label="地址" min-width="140" align="center" show-overflow-tooltip />
        <el-table-column prop="introduction" label="简介" min-width="100" align="center" show-overflow-tooltip />
        <el-table-column label="合作方式" min-width="100" align="center">
          <template #default="{ row }">{{ getModeText(row) }}</template>
        </el-table-column>
        <el-table-column label="合作规模" min-width="120" align="center">
          <template #default="{ row }">{{ getScaleText(row) }}</template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="170" align="center">
          <template #default="{ row }">{{ formatTimestamp((row.createAt ?? row.createdAt) || '', 2) }}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="100" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleDetail(row)">了解详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination class="pagination" v-model:current-page="currentPage" v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]" :total="total" layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange" @size-change="handleSizeChange" />
    </el-card>

    <!-- 详情弹窗 - 按接口返回字段渲染 -->
    <el-dialog v-model="detailVisible" title="项目详情" width="640px" destroy-on-close>
      <template v-if="currentDetail">
        <el-descriptions :column="2" border class="project-detail-descriptions">
          <el-descriptions-item label="项目名称" :span="2">{{ currentDetail.title ?? currentDetail.name }}</el-descriptions-item>
          <el-descriptions-item label="项目类型">{{ getTypeText(currentDetail) }}</el-descriptions-item>
          <el-descriptions-item label="地址">{{ currentDetail.address_name || currentDetail.event_address || '-' }}</el-descriptions-item>
          <el-descriptions-item label="详细地址" :span="2">{{ currentDetail.event_address || '-' }}</el-descriptions-item>
          <el-descriptions-item label="简介" :span="2">{{ currentDetail.introduction || '-' }}</el-descriptions-item>
          <el-descriptions-item label="合作方式">{{ getModeText(currentDetail) }}</el-descriptions-item>
          <el-descriptions-item label="合作规模">{{ getScaleText(currentDetail) }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ currentDetail.phone || '-' }}</el-descriptions-item>
          <el-descriptions-item label="微信">{{ currentDetail.wechat || '-' }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatTimestamp((currentDetail.createAt ?? currentDetail.createdAt) || '', 2) }}</el-descriptions-item>
        </el-descriptions>

        <div class="detail-cover" v-if="currentDetail.cover">
          <p class="detail-cover-title">项目封面</p>
          <el-image :src="currentDetail.cover" :preview-src-list="[currentDetail.cover]"
            style="width: 120px; height: 120px" fit="cover" preview-teleported hide-on-click-modal />
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.project-list {
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

  .detail-cover {
    margin-top: 16px;

    .detail-cover-title {
      font-size: 14px;
      color: #606266;
      margin-bottom: 8px;
    }
  }

  /* 项目详情弹窗：防止长文本撑破布局 */
  :deep(.project-detail-descriptions) {
    table-layout: fixed;
    width: 100%;

    .el-descriptions__label {
      width: 100px;
      box-sizing: border-box;
    }
  }

  @include table();
}
</style>
