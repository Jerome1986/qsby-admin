<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { UploadFile, UploadUserFile } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatTimestamp } from '@/utils/formatUtil'
import type { GroupChatItem } from '@/types/GroupChat'
import {
  groupChatFindAll,
  groupChatAddOne,
  groupChatUpdateOne,
  groupChatDeleteOne,
} from '@/api/groupChat'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

const UPLOAD_URL = 'https://x9zmst6evg.sealoshzh.site/upload/images'
const uploadHeaders = computed(() => ({
  Authorization: userStore.token || '',
}))

const tableData = ref<GroupChatItem[]>([])
const loading = ref(false)

const canAdd = computed(() => tableData.value.length === 0)

const loadList = async () => {
  loading.value = true
  try {
    const res = await groupChatFindAll()
    tableData.value = res.data ?? []
  } finally {
    loading.value = false
  }
}

const dialogVisible = ref(false)
const dialogTitle = ref('新增群聊二维码')
const formData = ref<Partial<GroupChatItem>>({})
const qrFileList = ref<UploadUserFile[]>([])

const resetForm = () => {
  formData.value = { remark: '', qrImage: '' }
  qrFileList.value = []
}

const handleAdd = () => {
  dialogTitle.value = '新增群聊二维码'
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (row: GroupChatItem) => {
  dialogTitle.value = '编辑群聊二维码'
  formData.value = { ...row }
  qrFileList.value = row.qrImage
    ? [{ name: 'qr', url: row.qrImage }]
    : []
  dialogVisible.value = true
}

const handleQrSuccess = (response: unknown, file: UploadFile) => {
  const url = typeof response === 'string' ? response : (response as { url?: string })?.url
  if (url) {
    formData.value.qrImage = url
    file.url = url
  }
}

const handleQrRemove = () => {
  formData.value.qrImage = ''
}

const handleConfirm = async () => {
  if (!formData.value.qrImage?.trim()) {
    ElMessage.warning('请上传群二维码')
    return
  }
  const payload = {
    qrImage: formData.value.qrImage.trim(),
    remark: formData.value.remark?.trim() || undefined,
  }
  if (formData.value._id) {
    await groupChatUpdateOne(formData.value._id, payload)
    ElMessage.success('更新成功')
  } else {
    await groupChatAddOne(payload)
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
  await loadList()
}

const handleDelete = (row: GroupChatItem) => {
  ElMessageBox.confirm('确认删除当前群聊二维码吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await groupChatDeleteOne(row._id)
      ElMessage.success('删除成功')
      await loadList()
    })
    .catch(() => {})
}

onMounted(() => loadList())
</script>

<template>
  <div class="group-chat-setting">
    <el-card shadow="never" class="search-card">
      <el-form inline>
        <el-form-item>
          <el-button type="primary" :icon="Plus" :disabled="!canAdd" @click="handleAdd">
            新增二维码
          </el-button>
        </el-form-item>
        <el-form-item v-if="!canAdd" class="hint-item">
          <span class="hint">全站仅允许配置一条群聊二维码；删除后可重新添加。</span>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" class="table-card">
      <el-table :data="tableData" v-loading="loading" stripe border>
        <el-table-column label="序号" min-width="60" align="center" type="index" />
        <el-table-column label="二维码" min-width="120" align="center">
          <template #default="{ row }">
            <el-image
              v-if="row.qrImage"
              :src="row.qrImage"
              :preview-src-list="[row.qrImage]"
              preview-teleported
              hide-on-click-modal
              fit="cover"
              class="qr-thumb"
            />
            <span v-else>—</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="160" align="center" show-overflow-tooltip />
        <el-table-column prop="updatedAt" label="更新时间" min-width="170" align="center">
          <template #default="{ row }">{{ formatTimestamp(row.updatedAt, 2) }}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="140" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="480px" destroy-on-close>
      <el-form :model="formData" label-width="100px">
        <el-form-item label="群二维码" required>
          <el-upload
            v-model:file-list="qrFileList"
            :action="UPLOAD_URL"
            :headers="uploadHeaders"
            list-type="picture-card"
            :limit="1"
            :on-success="handleQrSuccess"
            :on-remove="handleQrRemove"
          >
            <el-icon class="upload-plus"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">支持上传图片，更换二维码请先删除再上传新图</div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" :rows="2" placeholder="选填" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.group-chat-setting {
  height: 100%;
  display: flex;
  flex-direction: column;

  .search-card {
    flex-shrink: 0;
    margin-bottom: 16px;

    :deep(.el-card__body) {
      padding-bottom: 2px;
    }
  }

  .hint-item {
    margin-bottom: 0;
  }

  .hint {
    font-size: 13px;
    color: #909399;
  }

  .qr-thumb {
    width: 56px;
    height: 56px;
    border-radius: 4px;
  }

  .upload-plus {
    font-size: 28px;
  }

  .upload-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 8px;
    line-height: 1.4;
  }

  @include table();
}
</style>
