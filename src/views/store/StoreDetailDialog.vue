<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { StoreItem, StoreCategoryItem } from '@/types/Store'
import type { CityItem } from '@/types/City'
import { useCityStore } from '@/stores'
import { getStoreCategories } from '@/api/store'
import StoreMapDisplay from '@/components/StoreMapDisplay.vue'

const props = defineProps<{
  modelValue: boolean
  detailData?: StoreItem | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

const cityStore = useCityStore()

/** 门店分类列表（用于映射 categoryId → 名称） */
const categoryOptions = ref<StoreCategoryItem[]>([])

/** 弹窗显隐（双向绑定） */
const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

/** 弹窗打开时加载分类 */
watch(visible, async (v) => {
  if (v) {
    try {
      const res = await getStoreCategories(1, 100)
      categoryOptions.value = res.data?.list?.filter((i) => i.status === 'active') ?? []
    } catch {
      categoryOptions.value = []
    }
  }
})

/** 根据城市ID获取城市名称 */
const getCityName = (cityId: string) => {
  const city = cityStore.cityList.find((c: CityItem) => c._id === cityId)
  return city?.name ?? cityId
}

/** 根据分类ID获取分类名称 */
const getCategoryName = (categoryId: string) => {
  const cat = categoryOptions.value.find((c) => c._id === categoryId)
  return cat?.name ?? categoryId ?? '-'
}

/** 门店经纬度（兼容 lat/lng） */
const storeLocation = computed(() => {
  if (!props.detailData) return { longitude: undefined, latitude: undefined }
  const d = props.detailData
  const lat = d.latitude ?? (d as { lat?: number }).lat
  const lng = d.longitude ?? (d as { lng?: number }).lng
  return { longitude: lng, latitude: lat }
})
</script>

<template>
  <el-dialog v-model="visible" title="门店详情" width="800px" destroy-on-close>
    <template v-if="detailData">
      <el-descriptions :column="2" border label-width="120px" class="store-detail-descriptions">
        <el-descriptions-item label="门店名称" :span="2">{{ detailData.name }}</el-descriptions-item>
        <el-descriptions-item label="站点">{{ getCityName(detailData.cityId) }}</el-descriptions-item>
        <el-descriptions-item label="门店分类">{{ getCategoryName(detailData.categoryId) }}</el-descriptions-item>
        <el-descriptions-item label="门店地址" :span="2">{{ detailData.address || '-' }}</el-descriptions-item>
        <el-descriptions-item label="门店位置" :span="2">
          <StoreMapDisplay
            :longitude="storeLocation.longitude"
            :latitude="storeLocation.latitude"
            :init-delay="350"
          />
        </el-descriptions-item>
      </el-descriptions>
      <div class="detail-cover" v-if="detailData.cover">
        <p class="detail-cover-title">门店封面</p>
        <el-image :src="detailData.cover" :preview-src-list="[detailData.cover]" style="width: 120px; height: 120px"
          fit="cover" preview-teleported hide-on-click-modal />
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.detail-cover {
  margin-top: 16px;

  .detail-cover-title {
    font-size: 14px;
    color: #606266;
    margin-bottom: 8px;
  }
}

.store-detail-descriptions :deep(.el-descriptions__label) {
  white-space: nowrap;
}
</style>
