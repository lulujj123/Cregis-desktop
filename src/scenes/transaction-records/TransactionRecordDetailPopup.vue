<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue';
import {
  EgButton,
  EgDetail,
  EgDetailPopup,
  EgTextarea,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { formatGroupedAmountText } from '@/utils/formatGroupedDisplay';
import { splitDetailAmountHeadline } from '@/scenes/tasks/shared/splitDetailAmountHeadline';
import { usePopupShellLifecycle } from '@/scenes/tasks/shared/usePopupShellLifecycle';
import detailChromeStyles from '@/scenes/tasks/shared/detailPopupChrome.module.css';
import SigningBatchPopupMotionPageChrome from '@/scenes/tasks/signing/batch/SigningBatchPopupMotionPageChrome.vue';
import SigningBatchSignSubPageShell from '@/scenes/tasks/signing/batch/SigningBatchSignSubPageShell.vue';
import batchStyles from '@/scenes/tasks/signing/batch/batchSigning.shared.module.css';
import { buildParallelOutDetailSections } from './buildParallelOutDetailSections';
import { buildTransactionRecordDetailSections } from './buildTransactionRecordDetailSections';
import { buildTransactionRecordAmountHeadline } from './transactionRecordDetail';
import { buildParallelOutDetailLines } from './transactionRecordParallelOutDetailData';
import { transactionRecordShowsMultiTxDetail } from './transactionRecordData';
import type { TransactionRecordDetailPage } from './transactionRecordDetailPage';
import type { TransactionRecordRow } from './transactionRecordTypes';
import parallelOutDetailStyles from './TransactionRecordParallelOutDetail.module.css';
import remarkStyles from './TransactionRecordDetailRemarkValue.module.css';

const props = withDefaults(
  defineProps<{
    open: boolean;
    detail: TransactionRecordRow | null;
    detailPage: TransactionRecordDetailPage;
    /** View by Wallet 时为 true；View by Address 不展示多笔下钻。 */
    enableMultiTxDetail?: boolean;
  }>(),
  {
    enableMultiTxDetail: true,
  },
);

const emit = defineEmits<{
  'update:open': [value: boolean];
  'update:detailPage': [value: TransactionRecordDetailPage];
  'popup-closed': [];
}>();

const { ui, locale } = useAppI18n();

const { popupMounted, popupOpen, onPopupClosed } = usePopupShellLifecycle({
  open: toRef(props, 'open'),
  onClosed: () => {
    emit('update:open', false);
    emit('popup-closed');
  },
});

const activePage = ref<TransactionRecordDetailPage>(props.detailPage);
const pageStackDirection = ref<'forward' | 'backward' | 'none'>('none');

const isSummaryPage = computed(() => activePage.value === 'summary');
const isParallelOutLinesPage = computed(() => activePage.value === 'parallel-out-lines');

/** EgDetailPopup 固定 880×620：stack 始终 fill。 */
const popupContentFill = computed(() => true);

const headline = computed(() =>
  formatGroupedAmountText(
    props.detail ? buildTransactionRecordAmountHeadline(props.detail) : '',
  ),
);
const headlineParts = computed(() => splitDetailAmountHeadline(headline.value));

const remarkOverride = ref<string | null>(null);
const remarkEditing = ref(false);
const remarkDraft = ref('');

const effectiveRemark = computed(
  () => remarkOverride.value ?? props.detail?.remark ?? '',
);

const detailForSections = computed((): TransactionRecordRow | null => {
  if (!props.detail) return null;
  return {
    ...props.detail,
    remark: effectiveRemark.value,
  };
});

const sections = computed(() => {
  void locale.value;
  if (!detailForSections.value) return [];
  return buildTransactionRecordDetailSections(detailForSections.value, ui, {
    enableMultiTxDetail: props.enableMultiTxDetail,
  });
});

const canOpenParallelOutDetail = computed(
  () =>
    props.enableMultiTxDetail
    && props.detail != null
    && transactionRecordShowsMultiTxDetail(props.detail),
);

function resetRemarkEditor() {
  remarkOverride.value = null;
  remarkEditing.value = false;
  remarkDraft.value = '';
}

function startRemarkEdit() {
  remarkDraft.value = effectiveRemark.value;
  remarkEditing.value = true;
}

function confirmRemarkEdit() {
  remarkOverride.value = remarkDraft.value.trim();
  remarkEditing.value = false;
}

const parallelOutDetailLines = computed(() => {
  if (!canOpenParallelOutDetail.value || !props.detail) {
    return [];
  }
  return buildParallelOutDetailLines(props.detail);
});

const parallelOutSections = computed(() => {
  void locale.value;
  return buildParallelOutDetailSections(parallelOutDetailLines.value, ui);
});

function resolvePageStackDirection(
  from: TransactionRecordDetailPage,
  to: TransactionRecordDetailPage,
): 'forward' | 'backward' | 'none' {
  if (from === 'summary' && to !== 'summary') {
    return 'forward';
  }
  if (from !== 'summary' && to === 'summary') {
    return 'backward';
  }
  return 'none';
}

function setActivePage(next: TransactionRecordDetailPage) {
  if (next === activePage.value) {
    return;
  }
  pageStackDirection.value = resolvePageStackDirection(activePage.value, next);
  activePage.value = next;
  emit('update:detailPage', next);
}

watch(
  () => props.detailPage,
  (page) => {
    if (page === activePage.value) {
      return;
    }
    pageStackDirection.value = resolvePageStackDirection(activePage.value, page);
    activePage.value = page;
  },
);

watch(
  () => props.open,
  (open) => {
    if (open) {
      activePage.value = props.detailPage;
      pageStackDirection.value = 'none';
      resetRemarkEditor();
      return;
    }
    pageStackDirection.value = 'none';
    resetRemarkEditor();
  },
);

watch(
  () => props.detail?.id,
  () => {
    resetRemarkEditor();
  },
);

function onDetailClose() {
  popupOpen.value = false;
}

function onItemValueLinkClick(key: string) {
  if (key === 'remark') {
    startRemarkEdit();
    return;
  }
  if (key !== 'transaction-count' || !canOpenParallelOutDetail.value) {
    return;
  }
  setActivePage('parallel-out-lines');
}

function onParallelOutDetailBack() {
  setActivePage('summary');
}
</script>

<template>
  <EgDetailPopup
    v-if="popupMounted"
    v-model:open="popupOpen"
    @close="onPopupClosed"
  >
    <div
      :class="[
        detailChromeStyles.detailHost,
        detailChromeStyles.detailHostScrollBottomPad,
      ]"
    >
      <div :class="detailChromeStyles.detailPageStack">
        <div
          :class="[
            batchStyles.batchPopupContent,
            popupContentFill && batchStyles.batchPopupContentFill,
          ]"
        >
          <div
            class="motion-page-stack"
            :class="[
              batchStyles.batchPopupPageStack,
              batchStyles.batchPopupPageStackFill,
            ]"
            :data-page-direction="pageStackDirection"
            :data-batch-popup-page="activePage"
          >
            <Transition name="motion-page">
              <div
                :key="activePage"
                class="motion-page"
                :class="batchStyles.batchPopupPageFill"
              >
                <SigningBatchPopupMotionPageChrome :body-scroll="isSummaryPage">
                  <EgDetail
                    v-if="isSummaryPage && detail"
                    :toolbar-page-key="detail.id"
                    :eyebrow="ui('Amount')"
                    :headline="headline"
                    :show-eyebrow="true"
                    :show-status-tag="false"
                    :show-tabs="false"
                    :sections="sections"
                    :show-toolbar="false"
                    @close="onDetailClose"
                    @item-value-link-click="onItemValueLinkClick"
                  >
                    <template #headline-text>
                      {{ headlineParts.primary }}<span
                        v-if="headlineParts.fiat"
                        :class="detailChromeStyles.headlineFiat"
                      >{{ headlineParts.fiat }}</span>
                    </template>
                    <template
                      v-if="remarkEditing"
                      #item-value-remark
                    >
                      <div :class="remarkStyles.editRow">
                        <EgTextarea
                          v-model="remarkDraft"
                          :class="remarkStyles.editInput"
                          width-mode="full"
                        />
                        <EgButton
                          tone="brand"
                          variant="solid"
                          size="sm"
                          @click="confirmRemarkEdit"
                        >
                          {{ ui('Confirm') }}
                        </EgButton>
                      </div>
                    </template>
                  </EgDetail>

                  <SigningBatchSignSubPageShell
                    v-else-if="isParallelOutLinesPage && detail"
                    :class="batchStyles.batchPopupPageFill"
                    :title="ui('Transaction count details')"
                    @back="onParallelOutDetailBack"
                  >
                    <EgDetail
                      :class="[
                        batchStyles.batchPopupPageFill,
                        parallelOutDetailStyles.root,
                      ]"
                      :toolbar-page-key="`${detail.id}-parallel-out`"
                      eyebrow=""
                      headline=""
                      :show-eyebrow="false"
                      :show-status-tag="false"
                      :show-tabs="false"
                      :sections="parallelOutSections"
                      :show-toolbar="false"
                      @close="onDetailClose"
                    />
                  </SigningBatchSignSubPageShell>
                </SigningBatchPopupMotionPageChrome>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </EgDetailPopup>
</template>
