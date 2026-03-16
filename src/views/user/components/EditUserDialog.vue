<!-- 用户编辑弹窗，用户管理模块共用 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { UserItem } from '@/types/UserItem'
import { createDefaultForm, entityToForm } from '@/views/user/dataConfig.ts'

// 弹窗开关
const visible = ref(false)

const props = defineProps<{
  mode: 'edit' | 'add'
}>()

const emit = defineEmits<{
  confirm: [form: Partial<UserItem>]
}>()

// 表单
const form = reactive<Partial<UserItem>>(createDefaultForm())

// 打开表单
const open = (row: UserItem) => {
  visible.value = true
  if (props.mode === 'edit') {
    // 编辑
    Object.assign(form, entityToForm(row))
  } else {
    // 新增
    Object.assign(form, createDefaultForm())
  }
}

defineExpose({
  open,
})

// 提交表单
function handleConfirm() {
  emit('confirm', { ...form })
  visible.value = false
}
</script>

<template>
  <el-dialog v-model="visible" title="编辑用户" width="500px" destroy-on-close>
    <el-form :model="form" label-width="90px">
      <el-form-item label="昵称">
        <el-input v-model="form.nickname" />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="form.mobile" />
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="form.age" />
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="form.gender">
          <el-radio :value="0">未知</el-radio>
          <el-radio :value="1">男</el-radio>
          <el-radio :value="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="form.role">
          <el-option label="普通用户" value="user" />
          <el-option label="主理人" value="manager" />
          <el-option label="管理员" value="admin" />
        </el-select>
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="form.idCard" />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          v-model="form.status"
          active-value="active"
          inactive-value="disabled"
          active-text="启用"
          inactive-text="禁用"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </el-dialog>
</template>
