<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { loadAMap, setAmapSecurity, AMAP_DEFAULT_CENTER, hasAmapConfig } from '@/utils/amap'

const props = withDefaults(
  defineProps<{
    longitude?: number | null
    latitude?: number | null
    initDelay?: number
  }>(),
  { initDelay: 0 },
)

const mapContainerRef = ref<HTMLDivElement | null>(null)
let mapInstance: any = null
let amapLib: any = null
let marker: any = null

const hasLocation = () =>
  props.longitude != null && props.latitude != null && !isNaN(props.longitude) && !isNaN(props.latitude)

const getCenter = (): [number, number] =>
  hasLocation() ? [props.longitude!, props.latitude!] : AMAP_DEFAULT_CENTER

const initMap = async () => {
  if (!mapContainerRef.value || !hasAmapConfig()) return
  try {
    setAmapSecurity()
    amapLib = await loadAMap()
    const center = getCenter()
    mapInstance = new amapLib.Map(mapContainerRef.value, { zoom: 15, center })
    if (hasLocation()) {
      marker = new amapLib.Marker({ position: center, map: mapInstance })
    }
  } catch (err) {
  }
}

const updateMarker = () => {
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
    mapInstance.setCenter(AMAP_DEFAULT_CENTER)
  }
}

const destroyMap = () => {
  if (mapInstance && typeof mapInstance.destroy === 'function') mapInstance.destroy()
  mapInstance = amapLib = marker = null
}

onMounted(async () => {
  await nextTick()
  if (props.initDelay) await new Promise((r) => setTimeout(r, props.initDelay))
  initMap()
})

watch(
  () => [props.longitude, props.latitude],
  async () => {
    await nextTick()
    if (mapInstance) updateMarker()
    else initMap()
  },
)

onUnmounted(destroyMap)
</script>

<template>
  <div class="store-map-display">
    <div ref="mapContainerRef" class="map-container" />
  </div>
</template>

<style scoped lang="scss">
.store-map-display {
  margin-top: 8px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #dcdfe6;

  .map-container {
    width: 100%;
    height: 200px;
  }
}
</style>
