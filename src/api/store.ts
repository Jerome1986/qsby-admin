import { request } from '@/utils/request.ts'
import type {
  StoreCategoryListPageResult,
  StoreListPageResult,
  ProductListPageResult,
  ProductTypeListPageResult,
  StoreStatus,
  StoreContentData,
  StoreContentBlock,
} from '@/types/Store'
import type { AddResult, DelResult, UpdateResult } from '@/types/Gobal'

// ======================== 门店分类 ========================

export const storeAddCategory = (name: string, sort = 0, status: StoreStatus = 'active') => {
  return request<AddResult>({
    method: 'POST',
    url: '/store/cateAdd',
    data: { name, sort, status },
  })
}

export const getStoreCategories = (pageNum: number, pageSize: number) => {
  return request<StoreCategoryListPageResult>({
    method: 'GET',
    url: '/store/findAllCategories',
    params: { pageNum, pageSize },
  })
}

export const storeUpdateCategory = (
  id: string,
  name: string,
  sort: number,
  status: StoreStatus,
) => {
  return request({
    method: 'POST',
    url: '/store/updateCategory',
    data: { categoryId: id, name, sort, status },
  })
}

export const deleteStoreCategory = (id: string) => {
  return request<DelResult>({
    method: 'POST',
    url: '/store/delCategory',
    data: { categoryId: id },
  })
}

// ======================== 产品类型 ========================

export const productTypeAdd = (name: string, sort = 0, status: StoreStatus = 'active') => {
  return request<AddResult>({
    method: 'POST',
    url: '/store/productTypeAdd',
    data: { name, sort, status },
  })
}

export const getProductTypes = (pageNum: number, pageSize: number) => {
  return request<ProductTypeListPageResult>({
    method: 'GET',
    url: '/store/findAllProductTypes',
    params: { pageNum, pageSize },
  })
}

export const productTypeUpdate = (id: string, name: string, sort: number, status: StoreStatus) => {
  return request({
    method: 'POST',
    url: '/store/updateProductType',
    data: { productTypeId: id, name, sort, status },
  })
}

export const deleteProductType = (id: string) => {
  return request<DelResult>({
    method: 'POST',
    url: '/store/delProductType',
    data: { productTypeId: id },
  })
}

// ======================== 门店列表 ========================

/** 门店列表搜索参数 */
export interface StoreListSearchParams {
  /** 门店名称（模糊搜索） */
  name?: string
  /** 站点（城市）ID，传 'all' 或不传表示不限 */
  cityId?: string
  /** 门店分类ID，传 'all' 或不传表示不限 */
  categoryId?: string
}

export const getStoreList = (
  pageNum: number,
  pageSize: number,
  searchParams?: StoreListSearchParams,
) => {
  const params: Record<string, string | number> = { pageNum, pageSize }
  if (searchParams?.name?.trim()) params.name = searchParams.name.trim()
  if (searchParams?.cityId && searchParams.cityId !== 'all') params.cityId = searchParams.cityId
  if (searchParams?.categoryId && searchParams.categoryId !== 'all')
    params.categoryId = searchParams.categoryId
  return request<StoreListPageResult>({
    method: 'GET',
    url: '/store/findAllList',
    params,
  })
}

export const storeAdd = (data: Record<string, unknown>) => {
  return request<AddResult>({
    method: 'POST',
    url: '/store/add',
    data,
  })
}

export const storeUpdate = (id: string, data: Record<string, unknown>) => {
  return request<UpdateResult>({
    method: 'POST',
    url: '/store/update',
    data: { storeId: id, ...data },
  })
}

export const deleteStore = (id: string) => {
  return request<DelResult>({
    method: 'POST',
    url: '/store/del',
    data: { storeId: id },
  })
}

// ======================== 门店内容（门店介绍/周边推荐） ========================

/** 获取门店内容 */
export const getStoreContent = (storeId: string, type: string) => {
  return request<StoreContentData>({
    method: 'GET',
    url: '/store/getContent',
    params: { storeId, type },
  })
}

/** 更新门店内容 */
export const updateStoreContent = (storeId: string, type: string, blocks: StoreContentBlock[]) => {
  return request({
    method: 'POST',
    url: '/store/updateContent',
    data: { storeId, type, blocks },
  })
}

// ======================== 产品管理 ========================

/** 产品列表搜索参数 */
export interface ProductListSearchParams {
  /** 产品名称（模糊搜索） */
  name?: string
  /** 关联门店ID，传 'all' 或不传表示不限 */
  storeId?: string
  /** 产品类型ID，传 'all' 或不传表示不限 */
  productTypeId?: string
}

export const getProductList = (
  pageNum: number,
  pageSize: number,
  searchParams?: ProductListSearchParams,
) => {
  const params: Record<string, string | number> = { pageNum, pageSize }
  if (searchParams?.name?.trim()) params.name = searchParams.name.trim()
  if (searchParams?.storeId && searchParams.storeId !== 'all') params.storeId = searchParams.storeId
  if (searchParams?.productTypeId && searchParams.productTypeId !== 'all')
    params.productTypeId = searchParams.productTypeId
  return request<ProductListPageResult>({
    method: 'GET',
    url: '/store/findAllProducts',
    params,
  })
}

export const productAdd = (data: Record<string, unknown>) => {
  return request<AddResult>({
    method: 'POST',
    url: '/store/addProduct',
    data,
  })
}

export const productUpdate = (id: string, data: Record<string, unknown>) => {
  return request({
    method: 'POST',
    url: '/store/updateProduct',
    data: { productId: id, ...data },
  })
}

export const deleteProduct = (id: string) => {
  return request<DelResult>({
    method: 'POST',
    url: '/store/delProduct',
    data: { productId: id },
  })
}
