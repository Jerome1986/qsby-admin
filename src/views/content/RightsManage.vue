<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadFile, UploadUserFile } from 'element-plus'
import type { RightsBenefitsItem, RightsType } from '@/types/Content'
import { useUserStore } from '@/stores'
import { getRightsList, updateRightsItem } from '@/api/content'

const userStore = useUserStore()

/** 封面上传地址 */
const UPLOAD_URL = 'https://x9zmst6evg.sealoshzh.site/upload/images'
/** 上传请求头 */
const uploadHeaders = computed(() => ({
  Authorization: userStore.token || '',
}))

const RIGHTS_TYPES: RightsType[] = ['homestay', 'activity', 'travel']
const RIGHTS_LABELS: Record<RightsType, string> = {
  homestay: '民宿博主权益',
  activity: '活动策划人权益',
  travel: '旅游博主权益',
}

/** loading */
const loading = ref(false)
/** 保存中 type */
const savingType = ref<RightsType | null>(null)

/** 三项权益数据 */
const formData = ref<Record<RightsType, { title: string; content: string; image: string }>>({
  homestay: { title: '', content: '', image: '' },
  activity: { title: '', content: '', image: '' },
  travel: { title: '', content: '', image: '' },
})

/** 各类型图片文件列表 */
const imageFileLists = ref<Record<RightsType, UploadUserFile[]>>({
  homestay: [],
  activity: [],
  travel: [],
})

/** 图片上传成功 */
const handleImageSuccess = (type: RightsType, response: unknown, file: UploadFile) => {
  const url = typeof response === 'string' ? response : (response as { url?: string })?.url
  if (url) {
    formData.value[type].image = url
    file.url = url
  }
}

/** 图片移除 */
const handleImageRemove = (type: RightsType) => {
  formData.value[type].image = ''
}

/** 加载权益列表 */
const loadList = async () => {
  loading.value = true
  try {
    const res = await getRightsList()
    const list = Array.isArray(res.data) ? res.data : []
    for (const type of RIGHTS_TYPES) {
      const item = list.find((i) => i.type === type)
      if (item) {
        formData.value[type] = {
          title: item.title || '',
          content: item.content || '',
          image: item.image || '',
        }
      }
    }
    syncFileLists()
  } catch {
    ElMessage.warning('加载失败')
  } finally {
    loading.value = false
  }
}

/** 同步图片文件列表 */
const syncFileLists = () => {
  for (const type of RIGHTS_TYPES) {
    const img = formData.value[type].image
    imageFileLists.value[type] = img ? [{ name: type, url: img }] : []
  }
}

/** 保存单项 */
const handleSave = async (type: RightsType) => {
  const data = formData.value[type]
  if (!data.title?.trim()) {
    ElMessage.warning(`${RIGHTS_LABELS[type]} 请输入标题`)
    return
  }
  savingType.value = type
  try {
    await updateRightsItem(type, {
      title: data.title.trim(),
      content: data.content || '',
      image: data.image || '',
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
  <div class="rights-manage">
    <el-card shadow="never" class="form-card" v-loading="loading">
      <template #header>
        <span>权益说明（主理人计划）</span>
      </template>

      <div class="rights-sections">
        <el-card v-for="type in RIGHTS_TYPES" :key="type" shadow="never" class="rights-card">
          <template #header>
            <span>{{ RIGHTS_LABELS[type] }}</span>
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
              <el-input
                v-model="formData[type].title"
                placeholder="如：民宿博主权益"
                clearable
              />
            </el-form-item>
            <el-form-item label="内容">
              <el-input
                v-model="formData[type].content"
                type="textarea"
                :rows="6"
                placeholder="权益说明内容"
              />
            </el-form-item>
            <el-form-item label="配图">
              <el-upload
                v-model:file-list="imageFileLists[type]"
                :action="UPLOAD_URL"
                :headers="uploadHeaders"
                list-type="picture-card"
                :limit="1"
                accept="image/*"
                :on-success="(res: unknown, file: UploadFile) => handleImageSuccess(type, res, file)"
                :on-remove="() => handleImageRemove(type)"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.rights-manage {
  height: 100%;
  overflow: auto;

  .form-card {
    margin: 20px;
  }

  .rights-sections {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .rights-card {
    background: #fafafa;
  }
}
</style>
