<script setup lang="ts">
import ContentPageManage from './ContentPageManage.vue'
import { getStoreIntro, updateStoreIntro } from '@/api/content'
import type { ContentPageData } from '@/types/Content'

const getDefaultData = (): ContentPageData => ({
  code: 'store_intro',
  cover: '',
  heroTitle: '门店介绍',
  heroSubtitle: '了解我们',
  introText: '',
  sections: [],
  galleryTitle: '门店风采',
  galleryImages: [],
})
</script>

<template>
  <ContentPageManage
    code="store_intro"
    page-title="门店介绍"
    :get-api="getStoreIntro"
    :update-api="updateStoreIntro"
    :default-data="getDefaultData"
    gallery-label="门店风采"
  />
</template>
