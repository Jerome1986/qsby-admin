<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import type { ActivityFormData, ActivityTypeItem } from '@/types/Activity'
import { formatTimestamp } from '@/utils/formatUtil'
import { getActivityTypes, activityListFindAll } from '@/api/activity'
import { statusMap, statusTagType } from '@/views/activity/dataConfig.ts'

// ======================== 基础数据 ========================

const tableData = ref<ActivityFormData[]>([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// ======================== 搜索相关 ========================

const searchForm = ref({
  title: '',
  type: 'all',
  city: '',
})

const activityTypeOptions = ref<ActivityTypeItem[]>([])
const loadActivityTypes = async () => {
  const res = await getActivityTypes(1, 100)
  activityTypeOptions.value = res.data.list.filter((item) => item.status === 'active')
}

const handleSearch = () => {
  currentPage.value = 1
  getActivityList(currentPage.value, pageSize.value)
}

const handleReset = () => {
  searchForm.value = { title: '', type: 'all', city: '' }
  currentPage.value = 1
  getActivityList(currentPage.value, pageSize.value)
}

// ======================== 列表数据 ========================

const getActivityList = async (pageNum: number, pageSize: number) => {
  loading.value = true
  try {
    const res = await activityListFindAll(pageNum, pageSize)
    tableData.value = res.data.list
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

// ======================== 分页处理 ========================

const handlePageChange = (page: number) => {
  currentPage.value = page
  getActivityList(currentPage.value, pageSize.value)
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  getActivityList(currentPage.value, pageSize.value)
}

// ======================== 详情弹窗 ========================

const detailVisible = ref(false)
const currentDetail = ref<ActivityFormData | null>(null)

const handleDetail = (row: ActivityFormData) => {
  currentDetail.value = row
  detailVisible.value = true
}

// ======================== 生命周期 ========================

onMounted(() => {
  getActivityList(currentPage.value, pageSize.value)
  loadActivityTypes()
})
</script>

<template>
  <div class="activity-list">
    <!-- 搜索区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" inline @submit.prevent="handleSearch">
        <el-form-item label="活动主题">
          <el-input v-model="searchForm.title" placeholder="请输入活动主题" clearable />
        </el-form-item>
        <el-form-item label="城市">
          <el-select v-model="searchForm.city" placeholder="全部" clearable style="width: 120px">
            <el-option label="全部" value="all" />
            <el-option label="武汉" value="武汉" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动类型">
          <el-select v-model="searchForm.type" style="width: 140px">
            <el-option label="全部" value="all" />
            <el-option
              v-for="item in activityTypeOptions"
              :key="item._id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
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
        <el-table-column prop="cover" label="封面" min-width="80" align="center">
          <template #default="{ row }">
            <el-image
              v-if="row.cover"
              :src="row.cover"
              :preview-src-list="[row.cover]"
              style="width: 50px; height: 50px; border-radius: 4px"
              fit="cover"
              preview-teleported
              hide-on-click-modal
            />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="活动主题" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="typeName" label="活动类型" min-width="100" align="center" />
        <el-table-column prop="time" label="活动时间" min-width="170" align="center" show-overflow-tooltip />
        <el-table-column prop="address_name" label="活动地点" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="maxPeople" label="人数限制" min-width="80" align="center" />
        <el-table-column label="报名人数" min-width="120" align="center">
          <template #default="{ row }">
            <span>{{ row.maleCount + row.femaleCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userFee" label="报名费用" min-width="90" align="center">
          <template #default="{ row }">¥{{ row.userFee || '0' }}</template>
        </el-table-column>
        <el-table-column prop="commission" label="主理人佣金" min-width="100" align="center">
          <template #default="{ row }">¥{{ row.commission || '0' }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="statusTagType[row.status] as any" size="small">
              {{ statusMap[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" min-width="170" align="center">
          <template #default="{ row }">{{ formatTimestamp(row.createdAt, 2) }}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="100" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleDetail(row)">详情</el-button>
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

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="活动详情" width="640px" destroy-on-close>
      <template v-if="currentDetail">
        <el-descriptions :column="2" border class="activity-detail-descriptions">
          <el-descriptions-item label="活动主题" :span="2">{{ currentDetail.title }}</el-descriptions-item>
          <el-descriptions-item label="活动类型">{{ currentDetail.typeName }}</el-descriptions-item>
          <el-descriptions-item label="活动时间">{{ currentDetail.time }}</el-descriptions-item>
          <el-descriptions-item label="活动地点" :span="2">{{ currentDetail.address_name }}</el-descriptions-item>
          <el-descriptions-item label="详细地址" :span="2">{{ currentDetail.event_address }}</el-descriptions-item>
          <el-descriptions-item label="联系微信">{{ currentDetail.wechat }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ currentDetail.phone }}</el-descriptions-item>
          <el-descriptions-item label="人数限制">{{ currentDetail.maxPeople }}</el-descriptions-item>
          <el-descriptions-item label="报名费用">¥{{ currentDetail.userFee }}</el-descriptions-item>
          <el-descriptions-item label="男士报名">{{ currentDetail.maleCount }} 人</el-descriptions-item>
          <el-descriptions-item label="女士报名">{{ currentDetail.femaleCount }} 人</el-descriptions-item>
          <el-descriptions-item label="主理人佣金">¥{{ currentDetail.commission }}</el-descriptions-item>
          <el-descriptions-item label="活动需求" :span="2">
            <el-tooltip :content="currentDetail.requirement" placement="top" :disabled="!currentDetail.requirement">
              <div class="requirement-line-clamp">{{ currentDetail.requirement }}</div>
            </el-tooltip>
          </el-descriptions-item>
        </el-descriptions>

        <div class="detail-images" v-if="currentDetail.images?.length">
          <p class="detail-images-title">内容图片</p>
          <el-image
            v-for="(img, idx) in currentDetail.images"
            :key="idx"
            :src="img"
            :preview-src-list="currentDetail.images"
            :initial-index="idx"
            style="width: 100px; height: 100px; margin-right: 8px"
            fit="cover"
            preview-teleported
            hide-on-click-modal
          />
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.activity-list {
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

  .detail-images {
    margin-top: 16px;

    .detail-images-title {
      font-size: 14px;
      color: #606266;
      margin-bottom: 8px;
    }
  }

  /* 活动详情弹窗：防止长文本撑破布局 */
  :deep(.activity-detail-descriptions) {
    table-layout: fixed;
    width: 100%;

    .el-descriptions__label {
      width: 100px;
      box-sizing: border-box;
    }
  }

  @include table();
}

/* 活动需求：限制行数，悬停显示全部 */
.requirement-line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}
</style>
