<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { BookingNoteItem } from '@/types/Content'
import { useRoute, useRouter } from 'vue-router'
import { getStoreBookingNote, updateStoreBookingNote } from '@/api/store'

const route = useRoute()
const router = useRouter()

const storeId = route.query.storeId as string
const storeName = route.query.storeName as string

/** loading */
const loading = ref(false)
/** 保存中 */
const saving = ref(false)

/** 条目列表 */
const items = ref<BookingNoteItem[]>([])

/** 添加须知条目 */
const addItem = () => {
  items.value = [...items.value, { title: '', content: [] }]
}

/** 移除须知条目 */
const removeItem = (index: number) => {
  items.value = items.value.filter((_, i) => i !== index)
}

/** 在某条目下插入内容 */
const insertContent = (itemIndex: number) => {
  const item = items.value[itemIndex]
  if (item) {
    item.content = [...(item.content || []), '']
  }
}

/** 移除某条内容 */
const removeContent = (itemIndex: number, contentIndex: number) => {
  const item = items.value[itemIndex]
  if (item?.content) {
    item.content = item.content.filter((_, i) => i !== contentIndex)
  }
}

/** 加载 */
const loadList = async () => {
  if (!storeId) return
  loading.value = true
  try {
    const res = await getStoreBookingNote(storeId)
    const raw = res.data
    if (raw?.items && Array.isArray(raw.items)) {
      items.value = raw.items.map((i) => ({
        title: i.title || '',
        content: Array.isArray(i.content) ? [...i.content] : (i.content ? [i.content] : []),
      }))
    } else {
      items.value = []
    }
  } catch {
    items.value = []
    ElMessage.warning('加载失败')
  } finally {
    loading.value = false
  }
}

/** 保存 */
const handleSave = async () => {
  if (!storeId) {
    ElMessage.warning('缺少门店ID，请从门店列表进入')
    return
  }
  const list = items.value
    .filter((i) => i.title?.trim())
    .map((i) => ({
      title: i.title.trim(),
      content: (i.content || []).filter((c) => c?.trim()).map((c) => c.trim()),
    }))
  if (!list.length) {
    ElMessage.warning('请至少添加一条须知')
    return
  }
  if (list.some((i) => !i.content?.length || i.content.every((c) => !c?.trim()))) {
    ElMessage.warning('每条须知至少添加一条内容')
    return
  }
  saving.value = true
  try {
    await updateStoreBookingNote(storeId, { items: list })
    ElMessage.success('保存成功')
    await loadList()
  } catch {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

/** 返回 */
const handleBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/store/list')
  }
}

onMounted(() => loadList())
</script>

<template>
  <div class="store-booking-note">
    <el-page-header @back="handleBack" class="page-header">
      <template #content>
        <span class="page-title">预约须知</span>
        <span v-if="storeName" class="store-name-hint">{{ storeName }}</span>
      </template>
    </el-page-header>

    <el-card shadow="never" class="form-card" v-loading="loading">
      <template #header>
        <span>预约须知</span>
        <el-button type="primary" size="default" :loading="saving" style="float: right" @click="handleSave">
          保存
        </el-button>
      </template>

      <div class="note-list">
        <div v-for="(item, idx) in items" :key="idx" class="note-item">
          <el-form :model="item" label-width="100px">
            <el-form-item label="标题">
              <el-input v-model="item.title" placeholder="如：入住时间说明" clearable />
            </el-form-item>
            <el-form-item label="内容">
              <div class="content-items">
                <div
                  v-for="(c, cIdx) in (item.content || [])"
                  :key="cIdx"
                  class="content-row"
                >
                  <el-input
                    v-model="item.content[cIdx]"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    class="content-input"
                  />
                  <el-button type="danger" :icon="Delete" link size="small" class="content-remove" @click="removeContent(idx, cIdx)">
                    删除
                  </el-button>
                </div>
                <el-button type="primary" :icon="Plus" size="small" @click="insertContent(idx)">插入</el-button>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" :icon="Delete" link size="small" @click="removeItem(idx)">
                删除此条
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-button type="primary" :icon="Plus" @click="addItem">添加须知</el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.store-booking-note {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .page-header {
    margin-bottom: 16px;
    flex-shrink: 0;
  }

  .page-title {
    font-weight: 600;
  }

  .store-name-hint {
    font-size: 12px;
    color: #909399;
    margin-left: 12px;
  }

  .form-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    :deep(.el-card__body) {
      flex: 1;
      overflow-y: auto;
    }
  }

  .note-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .note-item {
    padding: 16px;
    background: #fafafa;
    border-radius: 8px;
  }

  .content-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }

  .content-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;

    .content-input {
      flex: 1;
    }

    .content-remove {
      flex-shrink: 0;
    }
  }
}
</style>
