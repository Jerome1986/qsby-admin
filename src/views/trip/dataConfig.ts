// ======================== 常量映射 ========================

export const statusMap: Record<string, string> = {
  pending: '待审核',
  active: '进行中',
  finished: '已结束',
  cancelled: '已取消',
}

export const statusTagType: Record<string, string> = {
  pending: 'warning',
  active: 'success',
  finished: 'info',
  cancelled: 'danger',
}
