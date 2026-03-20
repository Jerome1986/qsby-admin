import { request } from '@/utils/request.ts'
import type {
  ScoreProductCategory,
  ScoreProductCategoryPage,
  ScoreProduct,
  ScoreProductPage,
  ScoreProductCategoryStatus,
} from '@/types/ScoreProduct'
import type { AddResult, DelResult } from '@/types/Gobal'

// ======================== 积分商品分类 ========================

/** 新增分类 */
export const scoreCategoryAdd = (
  name: string,
  sort = 0,
  status: ScoreProductCategoryStatus = 'active',
) => {
  return request<AddResult>({
    method: 'POST',
    url: '/scoreProduct/categoryAdd',
    data: { name, sort, status },
  })
}

/** 获取分类列表 */
export const getScoreCategories = (pageNum: number, pageSize: number) => {
  return request<ScoreProductCategoryPage>({
    method: 'GET',
    url: '/scoreProduct/findAllCategories',
    params: { pageNum, pageSize },
  })
}

/** 更新分类 */
export const scoreCategoryUpdate = (
  id: string,
  name: string,
  sort: number,
  status: ScoreProductCategoryStatus,
) => {
  return request({
    method: 'POST',
    url: '/scoreProduct/updateCategory',
    data: { categoryId: id, name, sort, status },
  })
}

/** 删除分类 */
export const deleteScoreCategory = (id: string) => {
  return request<DelResult>({
    method: 'POST',
    url: '/scoreProduct/delCategory',
    data: { categoryId: id },
  })
}

// ======================== 积分商品 ========================

/** 商品列表搜索参数 */
export interface ScoreProductListParams {
  name?: string
  categoryId?: string
  /** 门店ID，传 'all' 或不传表示不限 */
  storeId?: string
}

/** 获取商品列表 */
export const getScoreProductList = (
  pageNum: number,
  pageSize: number,
  params?: ScoreProductListParams,
) => {
  const query: Record<string, string | number> = { pageNum, pageSize }
  if (params?.name?.trim()) query.name = params.name.trim()
  if (params?.categoryId && params.categoryId !== 'all') query.categoryId = params.categoryId
  if (params?.storeId && params.storeId !== 'all') query.storeId = params.storeId
  return request<ScoreProductPage>({
    method: 'GET',
    url: '/scoreProduct/findAllList',
    params: query,
  })
}

/** 新增/更新商品参数（与 ScoreProduct 可编辑字段一致） */
export interface ScoreProductAddParams {
  name: string
  category: string
  categoryName: string
  storeId?: string
  storeName?: string
  cover: string
  images: string[]
  scorePrice: number
  status: 'active' | 'disabled'
}

/** 新增商品 */
export const scoreProductAdd = (data: ScoreProductAddParams) => {
  return request<AddResult>({
    method: 'POST',
    url: '/scoreProduct/add',
    data,
  })
}

/** 更新商品 */
export const scoreProductUpdate = (id: string, data: Partial<ScoreProductAddParams>) => {
  return request({
    method: 'POST',
    url: '/scoreProduct/update',
    data: { productId: id, ...data },
  })
}

/** 删除商品 */
export const deleteScoreProduct = (id: string) => {
  return request<DelResult>({
    method: 'POST',
    url: '/scoreProduct/del',
    data: { productId: id },
  })
}
