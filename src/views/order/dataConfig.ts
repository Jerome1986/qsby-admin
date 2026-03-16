// ======================== 订单类型映射 ========================

export const orderTypeMap: Record<string, string> = {
  trip: '行程',
  activity: '活动',
  project: '项目',
  shop: '商城',
}

// ======================== 订单状态映射 ========================

export const orderStatusMap: Record<string, string> = {
  pending: '待支付',
  paid: '已支付',
  verified: '已核销',
  cancelled: '已取消',
  refunding: '退款中',
  refunded: '已退款',
}

export const orderStatusTagType: Record<string, string> = {
  pending: 'warning',
  paid: 'primary',
  verified: 'success',
  cancelled: 'info',
  refunding: 'warning',
  refunded: 'danger',
}
