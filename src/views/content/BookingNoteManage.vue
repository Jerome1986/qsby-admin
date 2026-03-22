<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { BookingNoteItem } from '@/types/Content'
import { getBookingNote, updateBookingNote } from '@/api/content'

/** loading */
const loading = ref(false)
/** 保存中 */
const saving = ref(false)

/** 条目列表 */
const items = ref<BookingNoteItem[]>([])

/** 添加条目 */
const addItem = () => {
  items.value = [...items.value, { title: '', content: '' }]
}

/** 移除条目 */
const removeItem = (index: number) => {
  items.value = items.value.filter((_, i) => i !== index)
}

/** 加载 */
const loadList = async () => {
  loading.value = true
  try {
    const res = await getBookingNote()
    const raw = res.data
    if (raw?.items && Array.isArray(raw.items)) {
      items.value = raw.items.map((i) => ({
        title: i.title || '',
        content: i.content || '',
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
  const list = items.value.filter((i) => i.title?.trim())
  if (!list.length) {
    ElMessage.warning('请至少添加一条须知')
    return
  }
  saving.value = true
  try {
    await updateBookingNote({
      items: list.map((i) => ({ title: i.title.trim(), content: i.content?.trim() || '' })),
    })
    ElMessage.success('保存成功')
    await loadList()
  } catch {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

onMounted(() => loadList())
</script>

<template>
  <div class="booking-note-manage">
    <el-card shadow="never" class="form-card" v-loading="loading">
      <template #header>
        <span>预约须知</span>
        <el-button
          type="primary"
          size="default"
          :loading="saving"
          style="float: right"
          @click="handleSave"
        >
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
              <el-input
                v-model="item.content"
                type="textarea"
                :rows="4"
                placeholder="如：入住时间为当日14:00以后..."
              />
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
.booking-note-manage {
  height: 100%;
  overflow: auto;

  .form-card {
    margin: 20px;
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
}
</style>
