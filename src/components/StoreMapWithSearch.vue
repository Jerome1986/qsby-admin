<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { loadAMap, setAmapSecurity, hasAmapConfig } from '@/utils/amap'

const DEFAULT_CENTER: [number, number] = [116.397428, 39.90923]

export interface LocationResult {
  name: string
  address: string
  latitude: number
  longitude: number
}

const props = withDefaults(
  defineProps<{
    longitude?: number | null
    latitude?: number | null
    initialKeyword?: string
  }>(),
  { initialKeyword: '' },
)

const emit = defineEmits<{
  (e: 'select', result: LocationResult): void
}>()

const mapContainerRef = ref<HTMLDivElement | null>(null)
const searchKeyword = ref(props.initialKeyword || '')
const searchLoading = ref(false)
const searchResults = ref<LocationResult[]>([])

let mapInstance: any = null
let amapLib: any = null
let marker: any = null

const hasLocation = () =>
  props.longitude != null && props.latitude != null && !isNaN(props.longitude) && !isNaN(props.latitude)

const getCenter = (): [number, number] =>
  hasLocation() ? [props.longitude!, props.latitude!] : DEFAULT_CENTER

type PoiRaw = { name?: string; address?: string; location?: { lng?: number; lat?: number }; pname?: string; cityname?: string; adname?: string }
const parsePoi = (p: PoiRaw): LocationResult | null => {
  const lng = p.location?.lng
  const lat = p.location?.lat
  if (lng == null || lat == null || isNaN(lng) || isNaN(lat)) return null
  return {
    name: p.name ?? '',
    address: p.address ?? [p.pname, p.cityname, p.adname].filter(Boolean).join(''),
    latitude: lat,
    longitude: lng,
  }
}

const showOnMap = (lng: number, lat: number) => {
  if (!mapInstance || !amapLib) return
  if (marker) mapInstance.remove(marker)
  marker = new amapLib.Marker({ position: [lng, lat], map: mapInstance })
  mapInstance.setCenter([lng, lat])
}

const initMap = async () => {
  if (!mapContainerRef.value) return
  if (!hasAmapConfig()) {
    ElMessage.error('请配置高德地图 Key 和安全密钥')
    return
  }
  try {
    setAmapSecurity()
    amapLib = await loadAMap(['AMap.PlaceSearch'])
    const center = getCenter()
    mapInstance = new amapLib.Map(mapContainerRef.value, { zoom: 15, center })
    if (hasLocation()) {
      marker = new amapLib.Marker({ position: center, map: mapInstance })
    }
  } catch (err) {
    ElMessage.error('高德地图加载失败')
  }
}

const doSearch = () => {
  const kw = searchKeyword.value?.trim()
  if (!kw) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  if (!amapLib) {
    ElMessage.warning('地图加载中，请稍后再试')
    return
  }
  searchLoading.value = true
  searchResults.value = []
  const placeSearch = new amapLib.PlaceSearch({ pageSize: 15 })
  placeSearch.search(kw, (status: string, res: unknown) => {
    searchLoading.value = false
    const pois = (res as { poiList?: { pois?: unknown[] } })?.poiList?.pois ?? []
    if (status === 'complete' && pois.length) {
      const list = pois.map((p) => parsePoi(p as PoiRaw)).filter((x): x is LocationResult => x != null)
      searchResults.value = list
      if (list[0]) showOnMap(list[0].longitude, list[0].latitude)
    } else if (status === 'no_data') {
      ElMessage.warning('未找到相关地点')
    }
  })
}

const handleSelect = (item: LocationResult) => {
  showOnMap(item.longitude, item.latitude)
  emit('select', item)
}

const updateMarkerFromProps = () => {
  if (!mapInstance || !amapLib) return
  if (marker) {
    mapInstance.remove(marker)
    marker = null
  }
  if (hasLocation()) {
    const center = getCenter()
    marker = new amapLib.Marker({ position: center, map: mapInstance })
    mapInstance.setCenter(center)
  } else {
    mapInstance.setCenter(DEFAULT_CENTER)
  }
}

onMounted(async () => {
  await nextTick()
  setTimeout(() => initMap(), 100)
})

watch(
  () => [props.longitude, props.latitude],
  () => {
    if (mapInstance) updateMarkerFromProps()
  },
)

watch(
  () => props.initialKeyword,
  (v) => {
    if (v) searchKeyword.value = v
  },
)

onUnmounted(() => {
  if (mapInstance && typeof mapInstance.destroy === 'function') mapInstance.destroy()
  mapInstance = amapLib = marker = null
})
</script>

<template>
  <div class="store-map-with-search">
    <div class="search-bar">
      <el-input v-model="searchKeyword" placeholder="输入地点名称搜索" clearable @keyup.enter="doSearch" />
      <el-button type="primary" :loading="searchLoading" @click="doSearch">搜索</el-button>
    </div>
    <div class="content">
      <div ref="mapContainerRef" class="map" />
      <div class="result-list">
        <div v-for="(item, i) in searchResults" :key="i" class="result-item" @click="handleSelect(item)">
          <div class="name">{{ item.name }}</div>
          <div class="address">{{ item.address }}</div>
        </div>
        <div v-if="!searchResults.length && !searchLoading" class="empty">输入关键词搜索地点</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.store-map-with-search {
  width: 100%;

  .search-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
  }

  .content {
    display: flex;
    gap: 16px;
    height: 300px;
    min-height: 300px;
  }

  .map {
    flex: 1;
    min-width: 400px;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid #dcdfe6;
  }

  .result-list {
    flex: 0 0 220px;
    width: 220px;
    overflow-y: auto;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 8px;
  }

  .result-item {
    padding: 8px;
    cursor: pointer;
    border-radius: 4px;
    margin-bottom: 4px;

    &:hover {
      background: #f5f7fa;
    }

    .name {
      font-weight: 500;
      font-size: 13px;
      margin-bottom: 4px;
    }

    .address {
      font-size: 12px;
      color: #909399;
    }
  }

  .empty {
    padding: 16px;
    text-align: center;
    color: #909399;
    font-size: 12px;
  }
}
</style>
