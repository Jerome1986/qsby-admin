import { request } from '@/utils/request.ts'
import type { WithdrawApplyPageResult, WithdrawApplyStatus } from '@/types/WithdrawApply'

/** 提现申请列表参数 */
export interface WithdrawApplyListParams {
  pageNum: number
  pageSize: number
  status?: WithdrawApplyStatus | 'all'
}

/**
 * 获取提现申请列表
 */
export const getWithdrawApplyList = (params: WithdrawApplyListParams) => {
  return request<WithdrawApplyPageResult>({
    method: 'GET',
    url: '/cashWithdraw/findAll',
    params,
  })
}

/**
 * 审核提现申请
 * @param id - 申请ID
 * @param status - 审核结果 approved | rejected
 * @param amount - 提现金额（单位：元）
 * @param remark - 备注（拒绝时填写原因）
 */
export const auditWithdrawApply = (
  id: string,
  status: 'approved' | 'rejected',
  amount: number,
  remark?: string,
) => {
  return request({
    method: 'POST',
    url: '/cashWithdraw/update',
    data: { id, status, amount, remark },
  })
}
