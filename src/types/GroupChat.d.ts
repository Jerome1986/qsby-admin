/** 群聊二维码配置（全站仅允许一条） */
export interface GroupChatItem {
  _id: string
  /** 二维码图片 URL */
  qrImage: string
  /** 备注说明 */
  remark?: string
  createdAt?: number
  updatedAt?: number
}
