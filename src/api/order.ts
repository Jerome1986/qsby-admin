import { request } from '@/utils/request.ts'
import type { OrderItem, OrderPage } from '@/types/Order'
import type { OrderType, OrderStatus } from '@/types/Order'

/** 订单列表查询参数 */
export interface OrderListParams {
  pageNum: number
  pageSize: number
  orderType?: OrderType | 'all'
  status?: OrderStatus | 'all'
  out_trade_no?: string
  keyword?: string
}

/**
 * 获取订单总流水（待补接口）
 * @returns 总流水金额（元）
 */
export const getOrderTotalAmount = () => {
  // TODO: 接入后端流水统计接口后实现
  return Promise.resolve({ data: 0 })
}

/**
 * 获取订单列表
 */
export const getOrderList = (params: OrderListParams) => {
  return request<OrderPage>({
    method: 'GET',
    url: '/order/findAll',
    params,
  })
}

/**
 * 获取订单详情
 */
export const getOrderDetail = (orderId: string) => {
  return request<OrderItem>({
    method: 'GET',
    url: '/order/detail',
    params: { orderId },
  })
}

/**
 * 取消订单
 */
export const cancelOrder = (orderId: string) => {
  return request({
    method: 'POST',
    url: '/order/cancel',
    data: { orderId },
  })
}

/**
 * 核销订单
 */
export const verifyOrder = (orderId: string, verifyCode: string) => {
  return request({
    method: 'POST',
    url: '/order/verify',
    data: { orderId, verifyCode },
  })
}
