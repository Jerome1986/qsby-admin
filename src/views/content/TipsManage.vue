<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { TipsItem, TipsType } from '@/types/Content'
import { getTipsList, updateTipsItem } from '@/api/content'

const TIPS_TYPES: TipsType[] = ['trip', 'activity', 'project']
const TIPS_LABELS: Record<TipsType, string> = {
  trip: '行程温馨提示',
  activity: '活动温馨提示',
  project: '有趣的项目温馨提示',
}

/** loading */
const loading = ref(false)
/** 保存中 type */
const savingType = ref<TipsType | null>(null)

/** 三项提示数据 */
const formData = ref<Record<TipsType, { title: string; items: string[] }>>({
  trip: { title: '温馨提示：', items: [] },
  activity: { title: '温馨提示：', items: [] },
  project: { title: '温馨提示：', items: [] },
})

/** 添加提示项 */
const addItem = (type: TipsType) => {
  const items = formData.value[type].items
  const n = items.length + 1
  formData.value[type].items = [...items, `${n}、`]
}

/** 移除提示项 */
const removeItem = (type: TipsType, index: number) => {
  formData.value[type].items = formData.value[type].items.filter((_, i) => i !== index)
}

/** 加载提示列表 */
const loadList = async () => {
  loading.value = true
  try {
    const res = await getTipsList()
    const list = Array.isArray(res.data) ? res.data : []
    for (const type of TIPS_TYPES) {
      const item = list.find((i) => i.type === type)
      if (item) {
        formData.value[type] = {
          title: item.title || '温馨提示：',
          items: Array.isArray(item.items) ? item.items : [],
        }
      }
    }
  } catch {
    ElMessage.warning('加载失败')
  } finally {
    loading.value = false
  }
}

/** 保存单项 */
const handleSave = async (type: TipsType) => {
  const data = formData.value[type]
  if (!data.title?.trim()) {
    ElMessage.warning(`${TIPS_LABELS[type]} 请输入标题`)
    return
  }
  if (!data.items.length || data.items.every((i) => !i?.trim())) {
    ElMessage.warning(`${TIPS_LABELS[type]} 请至少添加一条提示`)
    return
  }
  savingType.value = type
  try {
    await updateTipsItem(type, {
      title: data.title.trim(),
      items: data.items.filter((i) => i?.trim()),
    })
    ElMessage.success('保存成功')
    await loadList()
  } catch {
    ElMessage.error('保存失败')
  } finally {
    savingType.value = null
  }
}

onMounted(() => loadList())
</script>

<template>
  <div class="tips-manage">
    <el-card shadow="never" class="form-card" v-loading="loading">
      <template #header>
        <span>温馨提示</span>
      </template>

      <div class="tips-sections">
        <el-card v-for="type in TIPS_TYPES" :key="type" shadow="never" class="tips-card">
          <template #header>
            <span>{{ TIPS_LABELS[type] }}</span>
            <el-button
              type="primary"
              size="small"
              :loading="savingType === type"
              style="float: right"
              @click="handleSave(type)"
            >
              保存
            </el-button>
          </template>
          <el-form :model="formData[type]" label-width="100px">
            <el-form-item label="标题">
              <el-input v-model="formData[type].title" placeholder="如：温馨提示：" clearable />
            </el-form-item>
            <el-form-item label="提示条目">
              <div class="tips-items">
                <div
                  v-for="(item, idx) in formData[type].items"
                  :key="idx"
                  class="tips-item-row"
                >
                  <el-input
                    v-model="formData[type].items[idx]"
                    type="textarea"
                    :rows="2"
                    placeholder="如：1、报名成功后，请按照行程安排..."
                  />
                  <el-button
                    type="danger"
                    :icon="Delete"
                    link
                    size="small"
                    @click="removeItem(type, idx)"
                  >
                    删除
                  </el-button>
                </div>
                <el-button type="primary" :icon="Plus" link size="small" @click="addItem(type)">
                  添加提示
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.tips-manage {
  height: 100%;
  overflow: auto;

  .form-card {
    margin: 20px;
  }

  .tips-sections {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .tips-card {
    background: #fafafa;
  }

  .tips-items {
    width: 100%;
  }

  .tips-item-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;

    .el-input {
      flex: 1;
    }
  }
}
</style>
