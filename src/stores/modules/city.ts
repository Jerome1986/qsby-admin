import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CityItem } from '@/types/City'
import { cityGetAll } from '@/api/city'

export const useCityStore = defineStore('zero-city', () => {
  const cityList = ref<CityItem[]>([])

  const loadCityList = async () => {
    const res = await cityGetAll()
    cityList.value = res.data
  }

  const refreshCityList = async () => {
    const res = await cityGetAll()
    cityList.value = res.data
  }

  return {
    cityList,
    loadCityList,
    refreshCityList,
  }
})
