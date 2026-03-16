/**
 * 主理人申请状态
 */
export type ManagerApplyStatus =
  | 'pending' /** 待审核 */
  | 'approved' /** 审核通过 */
  | 'rejected' /** 审核拒绝 */

/**
 * 主理人申请实体
 */
export interface ManagerApplyItem {
  /** 申请ID */
  _id: string
  /** 用户ID */
  userId: string
  /** 真实姓名 */
  username: string
  /** 身份证号 */
  idCard: string
  /** 手机号 */
  mobile: string
  /** 申请状态 */
  status: ManagerApplyStatus
  /** 审核备注 */
  remark: string
  /** 审核人ID */
  reviewerId: string
  /** 审核时间 */
  reviewedAt: string | null
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}

// 带页码类型
export type PagesApplyResult = {
  /** 用户列表 */
  list: ManagerApplyItem[]
  /** 总数 */
  total: number
  /** 当前页 */
  pageNum: number
  /** 每页条数 */
  pageSize: number
  /** 合计页数 */
  totalPage: number
}
