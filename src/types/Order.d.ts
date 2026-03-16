// 订单类型
export type OrderType = 'trip' | 'activity' | 'project' | 'shop'

// 页面展示订单类型
export type PageOrderType = OrderType | 'all'

// 订单状态
export type OrderStatus = 'pending' | 'paid' | 'verified' | 'cancelled' | 'refunding' | 'refunded'

// 页面展示订单状态类型
export type PageOrderStatus = OrderStatus | 'all'

// 订单支付方式
export type OrderPaymentMethod = 'wechat' | 'alipay' | 'bank'

// 报名人信息
export interface OrderUserInfo {
  userId: string
  nickname: string
  gender: string | number
  phone: string
  realName?: string
  idCard?: string
}

// 门店信息
export interface ShopInfo {
  /** 门店名称 */
  shopName: string
  /** 门店地址 */
  address: string
  /** 门店电话 */
  phone: string
  /** 纬度 */
  latitude?: number
  /** 经度 */
  longitude?: number
}

// 抵扣类型
export type DiscountType = 'cash' | 'voucher' | 'commission' | 'points'

// 订单对应的产品信息类型
export interface ProductInfo {
  productId: string
  cover: string
  title: string
  time: string
  address_name: string
  event_address: string
}

// 订单对应的发起人信息
export interface InitiatorInfo {
  initiatorId: string
  username: string
  mobile: string
  wechat: string
}

// 订单主类型
export interface OrderItem {
  /** 订单唯一标识（MongoDB ObjectId） */
  _id: string
  /** 业务订单号（外部交易单号，如支付单号） */
  out_trade_no: string
  /** 用户微信开放ID（唯一标识用户） */
  openid: string
  /** 订单类型（play-旅游/activity-活动/project-项目） */
  orderType: OrderType
  /** 产品信息嵌套对象 */
  productInfo: ProductInfo
  /** 用户信息嵌套对象(报名人信息) */
  userInfo: {
    /** 用户对应的ID */
    userId: string
    /** 用户昵称 */
    nickname: string
    /** 性别（1-男/2-女/0-未知） */
    gender: number
    /** 用户手机号（脱敏前） */
    phone: string
  }
  shopInfo?: ShopInfo
  /** 发起人信息 */
  initiatorInfo?: InitiatorInfo
  /** 订单总金额（原价，单位：元） */
  totalAmount: number
  /** 佣金金额（推广返佣，单位：元） */
  commission: number
  /** 优惠金额（抵扣金额，单位：元） */
  discountAmount: number
  /** 优惠类型（'cash' | 'voucher' | 'commission' | 'points'） */
  discountType: DiscountType
  /** 实际支付金额（单位：元，0表示免支付） */
  payAmount: number
  /** 实际支付积分 只用于积分订单 */
  payScore: number
  /** 订单状态（pending-待付款/verifying-待核销/verified-已核销/refunded-退款） */
  status: OrderStatus
  /** 核销码 - 用于记录和手动核销 */
  verifyCode?: string
  /** 是否已核销 */
  isVerified?: boolean
  /** 核销人ID */
  verifiedBy?: string
  /** 核销时间 */
  verifiedTime?: Date
  /** 订单创建时间（ISO格式字符串） */
  createdAt?: string
  /** 订单更新时间（ISO格式字符串，空表示未更新） */
  updatedAt?: string
  /** 项目扩展：行业类别名称（仅 orderType === 'project'） */
  industryCategory?: string
  /** 项目扩展：合作方式名称 */
  cooperationMode?: string
  /** 项目扩展：合作规模名称 */
  cooperationScale?: string
  /** 项目扩展：基地/地点名称 */
  baseName?: string
  /** 项目扩展：基地/详细地址 */
  baseAddress?: string
  /** 项目扩展：查看费用（元） */
  viewFee?: number
}

export interface OrderPage {
  list: OrderItem[]
  total: number
  pageNum: number
  pageSize: number
  totalPage: number
}
