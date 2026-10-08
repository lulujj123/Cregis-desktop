<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import {
  EgButton,
  EgDatePickerTooltip,
  EgDivider,
  EgIcon,
  EgIconButton,
  EgIconProButton,
  EgRadio,
  EgStatusTag,
  EgTooltip,
  EgTooltipPanel,
  createFilterTranslate,
  provideFilterTranslate,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  formatExportDateRangeValue,
  formatExportHistoryTimestamp,
  formatExportHistoryTitle,
  parseExportDateRangeValue,
  resolveDefaultExportDateRange,
  resolveExportPresetRange,
  TRANSACTION_RECORDS_EXPORT_HISTORY_DEMO,
  TRANSACTION_RECORDS_EXPORT_HISTORY_OPERATOR_DEMO,
  TRANSACTION_RECORDS_EXPORT_QUICK_PRESET_IDS,
  TRANSACTION_RECORDS_EXPORT_QUICK_PRESET_LABEL_KEYS,
  type TransactionRecordsExportHistoryItem,
  type TransactionRecordsExportPresetId,
  type TransactionRecordsExportQuickPresetId,
  type TransactionRecordsExportScope,
} from './transactionRecordsExportData';
import styles from './TransactionRecordsExportFlotation.module.css';

const EXPORT_HISTORY_LOADING_MS = 1200;

const props = defineProps<{
  disabled?: boolean;
  hasActiveFilters?: boolean;
}>();

const emit = defineEmits<{
  export: [payload: {
    scope: TransactionRecordsExportScope;
    dateRange: string;
    presetId: TransactionRecordsExportPresetId;
  }];
}>();

const { locale, ui } = useAppI18n();

const expanded = ref(false);
const anchorRef = ref<{ openPanel?: () => void; close?: () => void } | null>(null);
const presetId = ref<TransactionRecordsExportPresetId>('custom');
const defaultRange = resolveDefaultExportDateRange();
const dateRange = ref(formatExportDateRangeValue(defaultRange.start, defaultRange.end));
const exportScope = ref<TransactionRecordsExportScope>(
  props.hasActiveFilters ? 'filtered' : 'all',
);
const historyItems = ref<TransactionRecordsExportHistoryItem[]>(
  TRANSACTION_RECORDS_EXPORT_HISTORY_DEMO.map((item) => ({ ...item })),
);
let historyReadyTimer: ReturnType<typeof setTimeout> | null = null;
let historySeq = 0;

const filterTranslate = computed(() => createFilterTranslate(locale.value));
provideFilterTranslate((text) => filterTranslate.value(text));

const quickPresetItems = computed(() =>
  TRANSACTION_RECORDS_EXPORT_QUICK_PRESET_IDS.map((id) => ({
    id,
    label: ui(TRANSACTION_RECORDS_EXPORT_QUICK_PRESET_LABEL_KEYS[id]),
  })),
);

const parsedDateRange = computed(() => parseExportDateRangeValue(dateRange.value));
const startDateLabel = computed(
  () => parsedDateRange.value.start || filterTranslate.value('请选择'),
);
const endDateLabel = computed(
  () => parsedDateRange.value.end || filterTranslate.value('请选择'),
);

const isExportHistoryLoading = computed(() =>
  historyItems.value.some((item) => item.status === 'loading'),
);

function clearHistoryReadyTimer() {
  if (historyReadyTimer == null) return;
  clearTimeout(historyReadyTimer);
  historyReadyTimer = null;
}

function onOpen() {
  expanded.value = true;
  exportScope.value = props.hasActiveFilters ? 'filtered' : 'all';
}

function onClose() {
  expanded.value = false;
}

function closePanel() {
  anchorRef.value?.close?.();
}

function onTriggerClick() {
  if (props.disabled) return;
  if (expanded.value) {
    closePanel();
    return;
  }
  anchorRef.value?.openPanel?.();
}

function selectPreset(id: TransactionRecordsExportQuickPresetId) {
  presetId.value = id;
  const range = resolveExportPresetRange(id);
  dateRange.value = formatExportDateRangeValue(range.start, range.end);
}

function onDateRangeUpdate(value: string) {
  dateRange.value = value;
  presetId.value = 'custom';
}

function selectScope(scope: TransactionRecordsExportScope) {
  exportScope.value = scope;
}

function onExportClick() {
  if (isExportHistoryLoading.value) return;

  emit('export', {
    scope: exportScope.value,
    dateRange: dateRange.value,
    presetId: presetId.value,
  });

  historySeq += 1;
  const pendingId = `exp-live-${historySeq}`;
  const { start, end } = parseExportDateRangeValue(dateRange.value);
  const pendingItem: TransactionRecordsExportHistoryItem = {
    id: pendingId,
    title: formatExportHistoryTitle(start, end),
    operator: TRANSACTION_RECORDS_EXPORT_HISTORY_OPERATOR_DEMO,
    exportedAt: formatExportHistoryTimestamp(),
    status: 'loading',
  };
  historyItems.value = [pendingItem, ...historyItems.value];

  clearHistoryReadyTimer();
  historyReadyTimer = setTimeout(() => {
    historyReadyTimer = null;
    historyItems.value = historyItems.value.map((item) =>
      item.id === pendingId
        ? {
            ...item,
            status: 'ready',
          }
        : item,
    );
  }, EXPORT_HISTORY_LOADING_MS);
}

function onHistoryDownload(_id: string) {
  // Demo: history download is visual-only for now.
}

onBeforeUnmount(() => {
  clearHistoryReadyTimer();
});
</script>

<template>
  <span :class="styles.root">
    <EgTooltip
      ref="anchorRef"
      trigger="click"
      :click-toggle="false"
      placement="bottom"
      align="end"
      :wrap-tooltip="false"
      :disabled="disabled"
      teleport-to=".app-preview"
      boundary-selector=".app-preview"
      flip
      @open="onOpen"
      @close="onClose"
    >
      <EgIconProButton
        :label="ui('Export')"
        :active="expanded"
        :disabled="disabled"
        :aria-expanded="expanded"
        @click.stop="onTriggerClick"
      >
        <EgIcon name="eds-arrow-download" size="sm" />
      </EgIconProButton>

      <template #content>
        <EgTooltipPanel
          panel-kind="flotation"
          panel-micro-float
          width-mode="fixed"
          :width="380"
          height-mode="adaptive"
          :max-height="560"
          :scrollable="true"
        >
          <div :class="styles.panel">
            <div :class="styles.headerRow">
              <span :class="styles.title">{{ ui('Export') }}</span>
              <div :class="styles.presets" role="tablist">
                <button
                  v-for="item in quickPresetItems"
                  :key="item.id"
                  type="button"
                  role="tab"
                  :class="[
                    styles.presetButton,
                    presetId === item.id && styles.presetButtonActive,
                  ]"
                  :aria-selected="presetId === item.id"
                  @click="selectPreset(item.id)"
                >
                  {{ item.label }}
                </button>
              </div>
            </div>

            <div :class="styles.rangeBlock">
              <div :class="styles.rangeShell">
                <div :class="styles.rangeVisual" aria-hidden="true">
                  <div :class="styles.rangeField">
                    <span :class="styles.rangeFieldIcon">
                      <EgIcon name="eds-calendar" size="sm" />
                    </span>
                    <span :class="styles.rangeFieldText">{{ startDateLabel }}</span>
                  </div>
                  <span :class="styles.rangeTo">{{ filterTranslate('至') }}</span>
                  <div :class="styles.rangeField">
                    <span :class="styles.rangeFieldIcon">
                      <EgIcon name="eds-calendar" size="sm" />
                    </span>
                    <span :class="styles.rangeFieldText">{{ endDateLabel }}</span>
                  </div>
                </div>
                <div :class="styles.rangePickerOverlay">
                  <EgDatePickerTooltip
                    :model-value="dateRange"
                    mode="range"
                    trigger-width-mode="fixed"
                    :trigger-width="332"
                    :placeholder="filterTranslate('开始 - 结束')"
                    boundary-selector=".app-preview"
                    picker-align="start"
                    @update:model-value="onDateRangeUpdate"
                  />
                </div>
              </div>
              <div :class="styles.hintRow">
                <EgIcon
                  :class="styles.hintIcon"
                  name="eds-information-fill"
                  fit
                />
                <span>{{ ui('The export date range cannot exceed 12 months') }}</span>
              </div>
            </div>

            <div
              :class="styles.scopeGroup"
              role="radiogroup"
              :aria-label="ui('Export scope')"
            >
              <button
                type="button"
                :class="styles.scopeOption"
                role="radio"
                :aria-checked="exportScope === 'filtered'"
                @click="selectScope('filtered')"
              >
                <EgRadio
                  :model-value="exportScope === 'filtered'"
                  name="tx-records-export-scope"
                  value="filtered"
                  tabindex="-1"
                  aria-hidden="true"
                  @update:model-value="selectScope('filtered')"
                />
                <span>{{ ui('Export according to filter options') }}</span>
              </button>
              <button
                type="button"
                :class="styles.scopeOption"
                role="radio"
                :aria-checked="exportScope === 'all'"
                @click="selectScope('all')"
              >
                <EgRadio
                  :model-value="exportScope === 'all'"
                  name="tx-records-export-scope"
                  value="all"
                  tabindex="-1"
                  aria-hidden="true"
                  @update:model-value="selectScope('all')"
                />
                <span>{{ ui('Export all') }}</span>
              </button>
            </div>

            <div :class="styles.actions">
              <EgButton
                tone="decor"
                variant="solid"
                size="md"
                type="button"
                :loading="isExportHistoryLoading"
                :disabled="isExportHistoryLoading"
                @click="onExportClick"
              >
                {{ ui('Export') }}
              </EgButton>
            </div>

            <EgDivider type="module" direction="horizontal" />

            <div :class="styles.history">
              <div :class="styles.historyTitle">{{ ui('Export History') }}</div>
              <div :class="styles.historyList">
                <div
                  v-for="item in historyItems"
                  :key="item.id"
                  :class="styles.historyItem"
                >
                  <div :class="styles.historyMeta">
                    <div :class="styles.historyName">{{ item.title }}</div>
                    <span :class="styles.historySubItem">
                      <EgIcon name="eds-personal" fit />
                      {{ item.operator }}
                    </span>
                    <span :class="styles.historySubItem">
                      <EgIcon name="eds-clocks" fit />
                      {{ item.exportedAt }}
                    </span>
                  </div>
                  <EgStatusTag
                    v-if="item.status === 'loading'"
                    :class="styles.historyProcessingTag"
                    status="success"
                    size="sm"
                    truncate
                  >
                    {{ ui('Processing') }}
                  </EgStatusTag>
                  <EgIconButton
                    v-else
                    :class="styles.historyDownload"
                    size="sm"
                    :label="ui('Download')"
                    @click="onHistoryDownload(item.id)"
                  >
                    <EgIcon name="eds-arrow-download" fit />
                  </EgIconButton>
                </div>
              </div>
            </div>
          </div>
        </EgTooltipPanel>
      </template>
    </EgTooltip>
  </span>
</template>
