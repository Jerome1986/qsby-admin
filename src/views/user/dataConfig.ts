import type { UserItem } from '@/types/UserItem'
import type { ManagerApplyStatus } from '@/types/ManagerApplyFor.ts'

// -------------------------  普通用户表单配置 -------------------------
// 初始表单
export const createDefaultForm = (): Partial<UserItem> => {
  return {
    username: '',
    nickname: '',
    age: '18',
    gender: 0,
    mobile: '',
    role: 'user',
    idCard: '',
    status: 'active',
  }
}

// 合并表单数据
export const entityToForm = (user: UserItem): Partial<UserItem> => {
  return {
    _id: user._id ?? '',
    username: user.username ?? '',
    nickname: user.nickname ?? '',
    age: user.age ?? '18',
    gender: user.gender ?? 0,
    mobile: user.mobile ?? '',
    role: user.role ?? 'user',
    idCard: user.idCard ?? '',
    status: user.status ?? 'active',
  }
}

// 映射审核状态
export const applyStatusText: Record<ManagerApplyStatus, string> = {
  approved: '已通过',
  pending: '待审核',
  rejected: '已拒绝',
}
