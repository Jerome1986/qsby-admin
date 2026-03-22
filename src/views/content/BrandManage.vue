<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadFile, UploadUserFile } from 'element-plus'
import type { BrandContent } from '@/types/Content'
import { useUserStore } from '@/stores'
import { getBrandContent, updateBrandContent } from '@/api/content'

const userStore = useUserStore()

/** 封面上传地址 */
const UPLOAD_URL = 'https://x9zmst6evg.sealoshzh.site/upload/images'
/** 上传请求头 */
const uploadHeaders = computed(() => ({
  Authorization: userStore.token || '',
}))

/**  loading */
const loading = ref(false)

/** 表单数据 */
const formData = ref<BrandContent>({
  code: 'brand',
  cover: '',
  heroTitle: '',
  heroSubtitle: '',
  introText: '',
  sections: [],
  galleryTitle: '',
  galleryImages: [],
})

/** 封面文件列表 */
const coverFileList = ref<UploadUserFile[]>([])
/** 风采图文件列表 */
const galleryFileList = ref<UploadUserFile[]>([])

/** 封面上传成功 */
const handleCoverSuccess = (response: unknown, file: UploadFile) => {
  const url = typeof response === 'string' ? response : (response as { url?: string })?.url
  if (url) {
    formData.value.cover = url
    file.url = url
  }
}

/** 封面移除 */
const handleCoverRemove = () => {
  formData.value.cover = ''
}

/** 风采图上传成功 */
const handleGallerySuccess = (response: unknown, file: UploadFile) => {
  const url = typeof response === 'string' ? response : (response as { url?: string })?.url
  if (url) {
    formData.value.galleryImages = [...(formData.value.galleryImages || []), url]
    file.url = url
  }
}

/** 风采图移除 */
const handleGalleryRemove = (file: UploadFile) => {
  const url = file.url ?? (typeof file.response === 'object' && file.response !== null
    ? (file.response as { url?: string }).url
    : undefined)
  if (url) {
    formData.value.galleryImages = (formData.value.galleryImages || []).filter((u) => u !== url)
  }
}

/** 添加章节 */
const addSection = () => {
  const n = (formData.value.sections?.length || 0) + 1
  formData.value.sections = [
    ...(formData.value.sections || []),
    { num: String(n).padStart(2, '0'), title: '', content: '' },
  ]
}

/** 移除章节 */
const removeSection = (index: number) => {
  formData.value.sections = formData.value.sections?.filter((_, i) => i !== index) || []
}

/** 添加 bullet 项 */
const addBulletItem = (sectionIndex: number) => {
  const section = formData.value.sections?.[sectionIndex]
  if (!section) return
  section.bulletItems = [...(section.bulletItems || []), '']
}

/** 移除 bullet 项 */
const removeBulletItem = (sectionIndex: number, itemIndex: number) => {
  const section = formData.value.sections?.[sectionIndex]
  if (!section?.bulletItems) return
  section.bulletItems = section.bulletItems.filter((_, i) => i !== itemIndex)
}

/** 添加子块 */
const addSubBlock = (sectionIndex: number) => {
  const section = formData.value.sections?.[sectionIndex]
  if (!section) return
  section.subBlocks = [...(section.subBlocks || []), { subTitle: '', content: '' }]
}

/** 移除子块 */
const removeSubBlock = (sectionIndex: number, blockIndex: number) => {
  const section = formData.value.sections?.[sectionIndex]
  if (!section?.subBlocks) return
  section.subBlocks = section.subBlocks.filter((_, i) => i !== blockIndex)
}

/** 空品牌数据结构 */
const getEmptyBrandData = (): BrandContent => ({
  code: 'brand',
  cover: '',
  heroTitle: '',
  heroSubtitle: '',
  introText: '',
  sections: [],
  galleryTitle: '',
  galleryImages: [],
})

/** 同步文件列表 */
const syncFileLists = () => {
  coverFileList.value = formData.value.cover ? [{ name: 'cover', url: formData.value.cover }] : []
  galleryFileList.value = (formData.value.galleryImages || []).map((url, i) => ({
    name: `gallery-${i}`,
    url,
  }))
}

/** 加载品牌内容 */
const loadContent = async () => {
  loading.value = true
  try {
    const res = await getBrandContent()
    const raw = res.data
    if (raw && (raw.cover || raw.heroTitle || raw.introText || (raw.sections && raw.sections.length))) {
      formData.value = {
        code: 'brand',
        cover: raw.cover || '',
        heroTitle: raw.heroTitle || '',
        heroSubtitle: raw.heroSubtitle || '',
        introText: raw.introText || '',
        sections: Array.isArray(raw.sections) ? raw.sections : [],
        galleryTitle: raw.galleryTitle || '品牌风采',
        galleryImages: Array.isArray(raw.galleryImages) ? raw.galleryImages : [],
      }
    } else {
      formData.value = getEmptyBrandData()
    }
  } catch {
    formData.value = getEmptyBrandData()
    ElMessage.warning('加载失败')
  } finally {
    syncFileLists()
    loading.value = false
  }
}

/** 提交保存 */
const handleSave = async () => {
  if (!formData.value.heroTitle?.trim()) {
    ElMessage.warning('请输入主标题')
    return
  }
  loading.value = true
  try {
    await updateBrandContent({
      code: 'brand',
      cover: formData.value.cover || '',
      heroTitle: formData.value.heroTitle,
      heroSubtitle: formData.value.heroSubtitle || '',
      introText: formData.value.introText || '',
      sections: formData.value.sections || [],
      galleryTitle: formData.value.galleryTitle || '',
      galleryImages: formData.value.galleryImages || [],
    })
    ElMessage.success('保存成功')
    await loadContent()
  } catch {
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => loadContent())
</script>

<template>
  <div class="brand-manage">
    <el-card shadow="never" class="form-card" v-loading="loading">
      <template #header>
        <span>品牌介绍内容</span>
        <el-button type="primary" size="default" style="float: right" @click="handleSave">
          保存
        </el-button>
      </template>

      <el-tabs type="border-card">
        <el-tab-pane label="封面与标题">
          <el-form :model="formData" label-width="120px">
            <el-form-item label="封面图">
              <el-upload
                v-model:file-list="coverFileList"
                :action="UPLOAD_URL"
                :headers="uploadHeaders"
                list-type="picture-card"
                :limit="1"
                accept="image/*"
                :on-success="handleCoverSuccess"
                :on-remove="handleCoverRemove"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item label="主标题">
              <el-input v-model="formData.heroTitle" placeholder="如：千宿百院" clearable />
            </el-form-item>
            <el-form-item label="副标题">
              <el-input v-model="formData.heroSubtitle" placeholder="如：品牌介绍" clearable />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="开篇">
          <el-form :model="formData" label-width="120px">
            <el-form-item label="开篇简介">
              <el-input
                v-model="formData.introText"
                type="textarea"
                :rows="6"
                placeholder="品牌开篇介绍文案"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="章节">
          <div class="sections-toolbar">
            <el-button type="primary" size="small" @click="addSection">添加章节</el-button>
          </div>
          <div
            v-for="(section, sIdx) in formData.sections"
            :key="sIdx"
            class="section-block"
          >
            <el-divider>章节 {{ sIdx + 1 }}</el-divider>
            <el-form label-width="100px">
              <el-form-item label="序号">
                <el-input v-model="section.num" placeholder="01" style="width: 80px" />
              </el-form-item>
              <el-form-item label="章节标题">
                <el-input v-model="section.title" placeholder="章节标题" clearable />
              </el-form-item>
              <el-form-item label="正文">
                <el-input
                  v-model="section.content"
                  type="textarea"
                  :rows="3"
                  placeholder="章节主要正文"
                />
              </el-form-item>
              <el-form-item label="要点列表">
                <div class="bullet-list-edit">
                  <div
                    v-for="(item, bIdx) in (section.bulletItems || [])"
                    :key="bIdx"
                    class="bullet-row"
                  >
                    <el-input v-model="section.bulletItems![bIdx]" type="textarea" :rows="2" />
                    <el-button type="danger" link size="small" @click="removeBulletItem(sIdx, bIdx)">
                      删除
                    </el-button>
                  </div>
                  <el-button type="primary" link size="small" @click="addBulletItem(sIdx)">
                    + 添加要点
                  </el-button>
                </div>
              </el-form-item>
              <el-form-item label="子块">
                <div class="subblocks-edit">
                  <div
                    v-for="(block, bIdx) in (section.subBlocks || [])"
                    :key="bIdx"
                    class="subblock-row"
                  >
                    <el-input v-model="block.subTitle" placeholder="子标题" class="mb-8" />
                    <el-input v-model="block.content" type="textarea" :rows="3" placeholder="子内容" />
                    <el-button type="danger" link size="small" @click="removeSubBlock(sIdx, bIdx)">
                      删除子块
                    </el-button>
                  </div>
                  <el-button type="primary" link size="small" @click="addSubBlock(sIdx)">
                    + 添加子块
                  </el-button>
                </div>
              </el-form-item>
              <el-form-item>
                <el-button type="danger" size="small" @click="removeSection(sIdx)">删除此章节</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <el-tab-pane label="品牌风采">
          <el-form :model="formData" label-width="120px">
            <el-form-item label="标题">
              <el-input v-model="formData.galleryTitle" placeholder="如：品牌风采" clearable />
            </el-form-item>
            <el-form-item label="配图">
              <el-upload
                v-model:file-list="galleryFileList"
                :action="UPLOAD_URL"
                :headers="uploadHeaders"
                list-type="picture-card"
                accept="image/*"
                :on-success="handleGallerySuccess"
                :on-remove="handleGalleryRemove"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.brand-manage {
  height: 100%;
  overflow: auto;

  .form-card {
    margin: 20px;
  }

  .sections-toolbar {
    margin-bottom: 16px;
  }

  .section-block {
    margin-bottom: 24px;
    padding: 16px;
    background: #fafafa;
    border-radius: 8px;
  }

  .bullet-list-edit,
  .subblocks-edit {
    width: 100%;
  }

  .bullet-row,
  .subblock-row {
    margin-bottom: 12px;
    padding: 12px;
    background: #fff;
    border-radius: 4px;
  }

  .subblock-row {
    border: 1px solid #eee;
  }

  .mb-8 {
    margin-bottom: 8px;
  }
}
</style>
