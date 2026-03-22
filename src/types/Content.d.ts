/** 品牌内容 - 章节子块 */
export interface BrandSubBlock {
  subTitle: string
  content: string
}

/** 品牌内容 - 章节 */
export interface BrandSection {
  num: string
  title: string
  content?: string
  bulletItems?: string[]
  subBlocks?: BrandSubBlock[]
}

/** 权益类型（主理人计划） */
export type RightsType = 'homestay' | 'activity' | 'travel'

/** 权益说明单项（标题+内容+图片） */
export interface RightsBenefitsItem {
  _id?: string
  /** 权益类型 */
  type: RightsType
  /** 标题 */
  title: string
  /** 内容 */
  content: string
  /** 图片 URL */
  image: string
  sort?: number
  createdAt?: Date
  updatedAt?: Date
}

/** 权益类型展示配置 */
export const RIGHTS_TYPE_MAP: Record<RightsType, string> = {
  homestay: '民宿博主权益',
  activity: '活动策划人权益',
  travel: '旅游博主权益',
}

/** 温馨提示类型 */
export type TipsType = 'trip' | 'activity' | 'project'

/** 温馨提示单项 */
export interface TipsItem {
  _id?: string
  type: TipsType
  /** 标题，如：温馨提示： */
  title: string
  /** 提示条目列表 */
  items: string[]
  sort?: number
  createdAt?: Date
  updatedAt?: Date
}

/** 温馨提示类型展示配置 */
export const TIPS_TYPE_MAP: Record<TipsType, string> = {
  trip: '行程温馨提示',
  activity: '活动温馨提示',
  project: '有趣的项目温馨提示',
}

/** 预约须知单项（标题+内容） */
export interface BookingNoteItem {
  title: string
  content: string
}

/** 预约须知内容 */
export interface BookingNoteContent {
  _id?: string
  code: 'booking_note'
  items: BookingNoteItem[]
  updatedAt?: Date
}

/** 内容页类型（品牌/门店/周边 结构相同） */
export type ContentPageCode = 'brand' | 'store_intro' | 'surrounding'

/** 内容页展示配置 */
export const CONTENT_PAGE_MAP: Record<ContentPageCode, string> = {
  brand: '品牌介绍',
  store_intro: '门店介绍',
  surrounding: '周边推荐',
}

/** 内容页通用结构（封面+标题+开篇+章节+风采图） */
export interface ContentPageData {
  _id?: string
  code: ContentPageCode
  cover: string
  heroTitle: string
  heroSubtitle: string
  introText: string
  sections: BrandSection[]
  galleryTitle: string
  galleryImages: string[]
  createdAt?: Date
  updatedAt?: Date
}

/** 品牌介绍内容（前端品牌页用） */
export interface BrandContent extends ContentPageData {
  code: 'brand'
}
