import type { WithdrawApplyStatus } from '@/types/WithdrawApply'

/** 提现申请状态映射 */
export const withdrawStatusMap: Record<WithdrawApplyStatus, string> = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已拒绝',
}

export const withdrawStatusTagType: Record<WithdrawApplyStatus, string> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
}
