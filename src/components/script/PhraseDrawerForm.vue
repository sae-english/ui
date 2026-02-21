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
        rows="2"
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
        rows="2"
        resize="none"
        :placeholder="translationPlaceholder"
      />
    </el-form-item>

    <el-form-item :label="commentLabel">
      <el-input
        v-model="form.comment"
        type="textarea"
        rows="3"
        resize="none"
        :placeholder="commentPlaceholder"
      />
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
import { PHRASE_FORM_RULES } from "@/constants/phrase";

const props = defineProps<{
  form: PhraseFormModel;
  formRules?: FormRules;
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
const formRules = props.formRules ?? PHRASE_FORM_RULES;

async function onSaveClick() {
  const valid = await formRef.value?.validate().then(() => true).catch(() => false);
  if (!valid) return;
  emit("submit");
}

</script>

<style scoped>
.phrase-drawer-form__translate-btn {
  margin-top: 8px;
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
</style>
