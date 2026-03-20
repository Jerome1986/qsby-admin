<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadFile, UploadUserFile } from 'element-plus'
import type { StoreItem, StoreCategoryItem } from '@/types/Store'
import { storeAdd, storeUpdate, getStoreCategories } from '@/api/store'
import StoreMapWithSearch from '@/components/StoreMapWithSearch.vue'
import { useCityStore, useUserStore } from '@/stores'

const props = defineProps<{
  modelValue: boolean
  editData?: StoreItem | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirmed'): void
}>()

const cityStore = useCityStore()
const userStore = useUserStore()

/** 封面上传地址 */
const UPLOAD_URL = 'https://x9zmst6evg.sealoshzh.site/upload/images'

/** 弹窗显隐（双向绑定） */
const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

/** 弹窗标题（新增/编辑） */
const dialogTitle = computed(() => (props.editData?._id ? '编辑门店' : '新增门店'))

/** 激活状态的城市列表 */
const activeCityList = computed(() =>
  cityStore.cityList.filter((c) => c.status === 'active'),
)

/** 门店分类下拉选项 */
const categoryOptions = ref<StoreCategoryItem[]>([])
/** 表单数据 */
const formData = ref<Partial<StoreItem>>({
  cityId: '',
  categoryId: '',
  cover: '',
  name: '',
  address: '',
  phone: '',
  managerPhone: '',
  latitude: undefined,
  longitude: undefined,
  description: '',
})

/** 封面图文件列表 */
const coverFileList = ref<UploadUserFile[]>([])
/** 上传请求头（含 token） */
const uploadHeaders = computed(() => ({
  Authorization: userStore.token || '',
}))

/** 加载门店分类 */
const loadCategories = async () => {
  try {
    const res = await getStoreCategories(1, 100)
    categoryOptions.value = res.data?.list?.filter((i) => i.status === 'active') ?? []
  } catch {
    categoryOptions.value = []
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    cityId: '',
    categoryId: '',
    cover: '',
    name: '',
    address: '',
    phone: '',
    managerPhone: '',
    latitude: undefined,
    longitude: undefined,
    description: '',
  }
  coverFileList.value = []
}

/** 封面上传成功回调 */
const handleCoverSuccess = (response: unknown, file: UploadFile) => {
  const url = typeof response === 'string' ? response : (response as { url?: string })?.url
  if (url) {
    formData.value!.cover = url
    file.url = url
  }
}

/** 封面上传失败回调 */
const handleCoverError = () => {
  ElMessage.error('封面上传失败')
}

/** 移除封面 */
const handleCoverRemove = () => {
  formData.value!.cover = ''
}

/** 地图选点回调，回填名称、地址、经纬度 */
const onLocationSelect = (result: { name: string; address: string; latitude: number; longitude: number }) => {
  formData.value!.name = result.name
  formData.value!.address = result.address
  formData.value!.latitude = result.latitude
  formData.value!.longitude = result.longitude
}

/** 提交表单（新增/编辑） */
const handleConfirm = async () => {
  if (!formData.value.name?.trim()) {
    ElMessage.warning('请输入门店名称')
    return
  }
  if (!formData.value.cityId) {
    ElMessage.warning('请选择站点（城市）')
    return
  }
  if (!formData.value.categoryId) {
    ElMessage.warning('请选择门店分类')
    return
  }
  try {
    const payload = {
      cityId: formData.value.cityId,
      categoryId: formData.value.categoryId,
      cover: formData.value.cover || '',
      name: formData.value.name,
      address: formData.value.address || '',
      phone: formData.value.phone || '',
      managerPhone: formData.value.managerPhone || '',
      latitude: formData.value.latitude,
      longitude: formData.value.longitude,
      description: formData.value.description || '',
    }
    if (formData.value._id) {
      console.log(payload)

      await storeUpdate(formData.value._id, payload)
    } else {
      await storeAdd(payload)
    }
    ElMessage.success(formData.value._id ? '编辑成功' : '新增成功')
    visible.value = false
    emit('confirmed')
  } catch {
    // 接口占位
  }
}

/** 弹窗打开时加载分类、填充或重置表单 */
watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      loadCategories()
      if (props.editData?._id) {
        const row = props.editData
        formData.value = {
          ...row,
          latitude: row.latitude ?? (row as { lat?: number }).lat,
          longitude: row.longitude ?? (row as { lng?: number }).lng,
        }
        coverFileList.value = props.editData.cover
          ? [{ name: 'cover', url: props.editData.cover }]
          : []
      } else {
        resetForm()
      }
    }
  },
)
</script>

<template>
  <el-dialog v-model="visible" :title="dialogTitle" width="900px" destroy-on-close>
    <el-form :model="formData" label-width="100px">
      <el-form-item label="选择城市">
        <el-select v-model="formData.cityId" placeholder="请选择城市" style="width: 100%">
          <el-option v-for="c in activeCityList" :key="c._id" :label="c.name" :value="c._id" />
        </el-select>
      </el-form-item>
      <el-form-item label="门店分类">
        <el-select v-model="formData.categoryId" placeholder="请选择门店分类" style="width: 100%">
          <el-option v-for="cat in categoryOptions" :key="cat._id" :label="cat.name" :value="cat._id" />
        </el-select>
      </el-form-item>
      <el-form-item label="门店封面图">
        <el-upload v-model:file-list="coverFileList" :action="UPLOAD_URL" :headers="uploadHeaders"
          list-type="picture-card" :limit="1" accept="image/*" :on-success="handleCoverSuccess"
          :on-error="handleCoverError" :on-remove="handleCoverRemove">
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="门店名字">
        <el-input v-model="formData.name" placeholder="请输入门店名称" clearable />
      </el-form-item>
      <el-form-item label="门店地址">
        <el-input v-model="formData.address" placeholder="请输入门店地址" clearable />
      </el-form-item>
      <el-form-item label="门店电话">
        <el-input v-model="formData.phone" placeholder="请输入门店电话" clearable />
      </el-form-item>
      <el-form-item label="设置店长">
        <el-input v-model="formData.managerPhone" placeholder="请输入店长手机号码" clearable />
      </el-form-item>
      <el-form-item label="地图选点" class="map-form-item">
        <StoreMapWithSearch :longitude="formData.longitude" :latitude="formData.latitude"
          :initial-keyword="formData.name || formData.address" @select="onLocationSelect" />
      </el-form-item>
      <el-form-item label="门店介绍">
        <el-input v-model="formData.description" type="textarea" :rows="4" placeholder="请输入门店介绍" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.map-form-item :deep(.el-form-item__content) {
  width: 100%;
}
</style>
