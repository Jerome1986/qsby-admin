import EditUserDialog from '@/views/user/components/EditUserDialog.vue'

declare module 'vue' {
  export interface GlobalComponents {
    EditUserDialog: typeof EditUserDialog
  }
}

export type QxEditUserDialog = InstanceType<typeof EditUserDialog>
