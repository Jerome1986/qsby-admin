<script setup lang="ts">
import ContentPageManage from './ContentPageManage.vue'
import { getSurrounding, updateSurrounding } from '@/api/content'
import type { ContentPageData } from '@/types/Content'

const getDefaultData = (): ContentPageData => ({
  code: 'surrounding',
  cover: '',
  heroTitle: '周边推荐',
  heroSubtitle: '探索周边',
  introText: '',
  sections: [],
  galleryTitle: '周边风光',
  galleryImages: [],
})
</script>

<template>
  <ContentPageManage
    code="surrounding"
    page-title="周边推荐"
    :get-api="getSurrounding"
    :update-api="updateSurrounding"
    :default-data="getDefaultData"
    gallery-label="周边风光"
  />
</template>
