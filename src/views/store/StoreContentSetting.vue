<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadFile, UploadUserFile } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { getStoreContent, updateStoreContent } from '@/api/store'
import type { StoreContentBlock } from '@/types/Store'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const storeId = route.query.storeId as string
const storeName = route.query.storeName as string
/** 类型：store-intro 门店介绍 | surrounding 周边推荐 */
const type = (route.query.type as string) || 'store-intro'

const UPLOAD_URL = 'https://x9zmst6evg.sealoshzh.site/upload/images'
const uploadHeaders = computed(() => ({ Authorization: userStore.token || '' }))

const pageTitle = computed(() =>
  type === 'surrounding' ? '周边推荐设置' : '门店介绍设置',
)

/** 内容块列表（按顺序：文本、图片） */
const blocks = ref<StoreContentBlock[]>([])
const loading = ref(false)
const saving = ref(false)

/** 各图片块的 fileList（用于 el-upload 回显） */
const imageFileLists = ref<Record<number, UploadUserFile[]>>({})

/** 插入文本 */
const insertText = () => {
  blocks.value = [...blocks.value, { type: 'text', content: '' }]
}

/** 插入图片 */
const insertImage = () => {
  blocks.value = [...blocks.value, { type: 'image', content: '' }]
}

/** 图片上传成功 */
const handleImageSuccess = (index: number, response: unknown, file: UploadFile) => {
  const url = typeof response === 'string' ? response : (response as { url?: string })?.url
  const block = blocks.value[index]
  if (url && block) {
    block.content = url
    file.url = url
    imageFileLists.value = { ...imageFileLists.value, [index]: [{ name: `img-${index}`, url }] }
  }
}

/** 图片移除 */
const handleImageRemove = (index: number) => {
  const block = blocks.value[index]
  if (block) block.content = ''
  const next = { ...imageFileLists.value }
  delete next[index]
  imageFileLists.value = next
}

/** 删除块 */
const removeBlock = (index: number) => {
  blocks.value = blocks.value.filter((_, i) => i !== index)
  const next: Record<number, UploadUserFile[]> = {}
  blocks.value.forEach((b, i) => {
    if (b.type === 'image' && b.content) {
      next[i] = [{ name: `img-${i}`, url: b.content }]
    }
  })
  imageFileLists.value = next
}

/** 加载内容 */
const loadContent = async () => {
  if (!storeId) return
  loading.value = true
  try {
    const res = await getStoreContent(storeId, type)
    const raw = res.data
    if (raw?.blocks && Array.isArray(raw.blocks)) {
      blocks.value = raw.blocks.map((b) => ({
        type: b.type as 'text' | 'image',
        content: b.content || '',
      }))
    } else {
      blocks.value = []
    }
    syncImageFileLists()
  } catch {
    blocks.value = []
  } finally {
    loading.value = false
  }
}

/** 同步图片块的 fileList */
const syncImageFileLists = () => {
  const next: Record<number, UploadUserFile[]> = {}
  blocks.value.forEach((b, i) => {
    if (b.type === 'image' && b.content) {
      next[i] = [{ name: `img-${i}`, url: b.content }]
    }
  })
  imageFileLists.value = next
}

/** 保存 */
const handleSave = async () => {
  if (!storeId) {
    ElMessage.warning('缺少门店ID')
    return
  }
  saving.value = true
  try {
    await updateStoreContent(
      storeId,
      type,
      blocks.value.map((b) => ({ type: b.type, content: b.content })),
    )
    ElMessage.success('保存成功')
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

onMounted(() => loadContent())
</script>

<template>
  <div class="store-content-setting">
    <el-page-header @back="handleBack" class="page-header">
      <template #content>
        <span class="page-title">{{ pageTitle }}</span>
        <span v-if="storeName" class="store-name-hint">{{ storeName }}</span>
      </template>
    </el-page-header>

    <el-card shadow="never" v-loading="loading">
      <template #header>
        <span>内容编辑</span>
        <div class="header-actions">
          <el-button type="primary" size="small" :icon="Plus" @click="insertText">
            插入文本
          </el-button>
          <el-button type="primary" size="small" :icon="Plus" @click="insertImage">
            插入图片
          </el-button>
          <el-button type="success" size="small" :loading="saving" @click="handleSave">
            保存
          </el-button>
        </div>
      </template>

      <div class="blocks-list-wrapper">
      <div class="blocks-list">
        <div v-for="(block, idx) in blocks" :key="idx" class="block-item">
          <!-- 文本块 -->
          <template v-if="block.type === 'text'">
            <el-input v-model="block.content" type="textarea" :rows="4" placeholder="请输入文本内容" class="block-text" />
          </template>
          <!-- 图片块 -->
          <template v-else>
            <el-upload :file-list="imageFileLists[idx] || []" :action="UPLOAD_URL" :headers="uploadHeaders"
              list-type="picture-card" :limit="1" accept="image/*"
              :on-success="(res: unknown, file: UploadFile) => handleImageSuccess(idx, res, file)"
              :on-remove="() => handleImageRemove(idx)" class="block-upload">
              <el-icon>
                <Plus />
              </el-icon>
            </el-upload>
          </template>
          <el-button type="danger" :icon="Delete" link size="small" class="block-remove" @click="removeBlock(idx)">
            删除
          </el-button>
        </div>
        <el-empty v-if="!blocks.length" description="点击「插入文本」或「插入图片」添加内容" />
      </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.store-content-setting {
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

  .header-actions {
    float: right;
    display: flex;
    gap: 8px;
  }

  :deep(.el-card) {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  :deep(.el-card__body) {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .blocks-list-wrapper {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
    max-height: calc(100vh - 280px);
  }

  .blocks-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .block-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    background: #fafafa;
    border-radius: 8px;

    .block-text {
      flex: 1;
    }

    .block-upload {
      flex-shrink: 0;
    }

    .block-remove {
      flex-shrink: 0;
    }
  }
}
</style>
