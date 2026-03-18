<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="formRules"
    label-position="top"
    class="phrase-drawer-form"
  >
    <el-form-item :label="phraseLabel" prop="phrase" required>
      <el-input
        v-model="form.phrase"
        type="textarea"
        rows="5"
        resize="none"
      />
      <el-button
        class="phrase-drawer-form__translate-btn"
        :loading="translateLoading"
        :disabled="translateLoading || !form.phrase?.trim()"
        @click="$emit('translate')"
      >
        {{ translateButtonLabel }}
      </el-button>
    </el-form-item>

    <el-form-item :label="translationLabel" prop="translation" required>
      <el-input
        v-model="form.translation"
        type="textarea"
        rows="5"
        resize="none"
        :placeholder="translationPlaceholder"
      />
    </el-form-item>

    <el-form-item :label="commentLabel">
      <div class="phrase-drawer-form__comments">
        <div
          v-for="(c, index) in form.comments"
          :key="index"
          class="phrase-drawer-form__comment-row"
        >
          <el-input
            v-model="form.comments[index]"
            type="textarea"
          rows="3"
            resize="none"
            :placeholder="commentPlaceholder"
          />
          <div class="phrase-drawer-form__comment-actions">
            <el-button
              v-if="index === form.comments.length - 1"
              class="phrase-drawer-form__comment-add"
              text
              type="primary"
              @click="addComment"
            >
              +
            </el-button>
            <el-button
              v-if="form.comments.length > 1"
              class="phrase-drawer-form__comment-remove"
              text
              type="danger"
              @click="removeComment(index)"
            >
              −
            </el-button>
          </div>
        </div>
      </div>
    </el-form-item>

    <div class="phrase-drawer-form__actions">
      <el-button
        type="primary"
        :loading="saveLoading"
        :disabled="saveLoading || !canSubmit"
        @click="onSaveClick"
      >
        {{ saveButtonLabel }}
      </el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import type { PhraseFormModel } from "@/types/phrase";

const props = defineProps<{
  form: PhraseFormModel;
  formRules: FormRules;
  canSubmit: boolean;
  translateLoading: boolean;
  saveLoading: boolean;
  phraseLabel: string;
  translationLabel: string;
  commentLabel: string;
  translationPlaceholder: string;
  commentPlaceholder: string;
  translateButtonLabel: string;
  saveButtonLabel: string;
}>();

const emit = defineEmits<{
  translate: [];
  submit: [];
}>();

const formRef = ref<FormInstance | null>(null);

async function onSaveClick() {
  const valid = await formRef.value?.validate().then(() => true).catch(() => false);
  if (!valid) return;
  emit("submit");
}

function addComment() {
  if (!Array.isArray(props.form.comments)) {
    props.form.comments = [""];
  } else {
    props.form.comments.push("");
  }
}

function removeComment(index: number) {
  if (!Array.isArray(props.form.comments)) return;
  if (props.form.comments.length <= 1) return;
  props.form.comments.splice(index, 1);
}

</script>

<style scoped>
.phrase-drawer-form__translate-btn {
  margin-top: 8px;
}

.phrase-drawer-form {
  width: 100%;
}

.phrase-drawer-form :deep(.el-form-item) {
  width: 100%;
}

.phrase-drawer-form .el-form-item__label {
  font-size: 0.9rem;
  color: var(--fe-text-muted);
}

.phrase-drawer-form .el-textarea__inner,
.phrase-drawer-form .el-input__inner {
  font-size: 0.95rem;
}

.phrase-drawer-form__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.phrase-drawer-form__comments {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.phrase-drawer-form__comment-row {
  display: block;
  width: 100%;
}

.phrase-drawer-form__comment-add,
.phrase-drawer-form__comment-remove {
  padding: 4px 6px;
  font-size: 14px;
  margin-top: 4px;
}
</style>
