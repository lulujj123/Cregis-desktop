<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { EgButton, EgDivider, EgTextarea } from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  CUSTOMER_SERVICE_FEEDBACK_DETAIL_PLACEHOLDER_KEY,
  CUSTOMER_SERVICE_FEEDBACK_OPTION_KEYS,
  CUSTOMER_SERVICE_FEEDBACK_OTHER_KEY,
  CUSTOMER_SERVICE_FEEDBACK_TITLE_KEY,
  CUSTOMER_SERVICE_LEAVE_MESSAGE_PLACEHOLDER_KEY,
  CUSTOMER_SERVICE_LEAVE_MESSAGE_TITLE_KEY,
} from './customerService.constants';
import styles from './CustomerServiceFeedbackSheet.module.css';

const props = withDefaults(
  defineProps<{
    /** `feedback` = thumbs-down sheet; `leave-message` = 留言 popup (Others-style textarea only). */
    variant?: 'feedback' | 'leave-message';
  }>(),
  {
    variant: 'feedback',
  },
);

const open = defineModel<boolean>('open', { default: false });

const emit = defineEmits<{
  submit: [];
}>();

const { ui } = useAppI18n();

const selectedOptionKey = ref<string | null>(null);
const detailText = ref('');

const isLeaveMessage = computed(() => props.variant === 'leave-message');

const dialogTitleKey = computed(() =>
  isLeaveMessage.value
    ? CUSTOMER_SERVICE_LEAVE_MESSAGE_TITLE_KEY
    : CUSTOMER_SERVICE_FEEDBACK_TITLE_KEY,
);

const textareaPlaceholderKey = computed(() =>
  isLeaveMessage.value
    ? CUSTOMER_SERVICE_LEAVE_MESSAGE_PLACEHOLDER_KEY
    : CUSTOMER_SERVICE_FEEDBACK_DETAIL_PLACEHOLDER_KEY,
);

const showDetailField = computed(
  () =>
    isLeaveMessage.value
    || selectedOptionKey.value === CUSTOMER_SERVICE_FEEDBACK_OTHER_KEY,
);

const canSubmit = computed(() => {
  if (isLeaveMessage.value) {
    return detailText.value.trim().length > 0;
  }
  if (!selectedOptionKey.value) return false;
  if (selectedOptionKey.value === CUSTOMER_SERVICE_FEEDBACK_OTHER_KEY) {
    return detailText.value.trim().length > 0;
  }
  return true;
});

function resetForm() {
  selectedOptionKey.value = null;
  detailText.value = '';
}

function onCancel() {
  open.value = false;
}

function onSubmit() {
  if (!canSubmit.value) return;
  if (!isLeaveMessage.value && !selectedOptionKey.value) return;
  emit('submit');
  open.value = false;
}

watch(open, (isOpen) => {
  if (!isOpen) resetForm();
});
</script>

<template>
  <div
    v-if="open"
    :class="styles.overlay"
    role="presentation"
    @click.self="onCancel"
  >
    <div
      :class="styles.sheet"
      role="dialog"
      :aria-label="ui(dialogTitleKey)"
      @click.stop
    >
      <div :class="styles.sheetBody">
        <h3 :class="styles.title">{{ ui(dialogTitleKey) }}</h3>

        <div v-if="!isLeaveMessage" :class="styles.chipRow">
          <EgButton
            v-for="key in CUSTOMER_SERVICE_FEEDBACK_OPTION_KEYS"
            :key="key"
            :class="styles.chipOption"
            :variant="selectedOptionKey === key ? 'solid' : 'outline'"
            :tone="selectedOptionKey === key ? 'decor' : 'subtle'"
            size="md"
            :aria-pressed="selectedOptionKey === key"
            @click="selectedOptionKey = key"
          >
            {{ ui(key) }}
          </EgButton>
        </div>

        <EgTextarea
          v-if="showDetailField"
          v-model="detailText"
          :class="styles.textarea"
          width-mode="full"
          :placeholder="ui(textareaPlaceholderKey)"
          :paste-label="ui('Paste')"
          :clear-label="ui('Clear')"
        />
      </div>

      <footer :class="styles.sheetFooter">
        <EgDivider type="module" direction="horizontal" />
        <div :class="styles.actions">
          <EgButton tone="subtle" size="md" @click="onCancel">
            {{ ui('Cancel') }}
          </EgButton>
          <EgButton
            variant="solid"
            tone="decor"
            size="md"
            :disabled="!canSubmit"
            @click="onSubmit"
          >
            {{ ui('Submit') }}
          </EgButton>
        </div>
      </footer>
    </div>
  </div>
</template>
