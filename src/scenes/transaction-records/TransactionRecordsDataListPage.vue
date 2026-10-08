<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import {
  EgDataList,
  EgDataListCellOverflow,
  EgDataListColumn,
  EgDivider,
  EgIcon,
  EgIconProButton,
  EgInput,
  EgLayout,
  EgListFieldHashLikeLine,
  EgListFieldOverflowText,
  EgPaginer,
  EgPaginationGroupButton,
  EgSegmented,
  EgToolBar,
  type DataListItem,
  type EgFilterCondition,
  type EgFilterField,
  type EgFilterLogicMode,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import { useDeferredContentMount } from '@/composables/useDeferredContentMount';
import {
  applyEgFilterConditions,
  hasActiveEgFilterConditions,
  isActiveEgFilterCondition,
} from '@/scenes/shared/applyEgFilterConditions';
import { resolveDataListFilterSourceRowCount } from '@/scenes/shared/buildListDerivedFilterOptions';
import TasksToolbarFilter from '@/scenes/tasks/filter/TasksToolbarFilter.vue';
import DataListHeaderSortTrigger from '@/scenes/tasks/DataListHeaderSortTrigger.vue';
import TasksListFieldAmount from '@/scenes/tasks/list-field/TasksListFieldAmount.vue';
import TasksListFieldCurrency from '@/scenes/tasks/list-field/TasksListFieldCurrency.vue';
import TasksListFieldGeneralStructure from '@/scenes/tasks/list-field/TasksListFieldGeneralStructure.vue';
import TasksListFieldTime from '@/scenes/tasks/list-field/TasksListFieldTime.vue';
import pageStyles from '@/scenes/tasks/TasksDataListPage.module.css';
import DataListHeaderTimezoneTrigger from './list-field/DataListHeaderTimezoneTrigger.vue';
import TransactionRecordsWalletColumnHeader from './list-field/TransactionRecordsWalletColumnHeader.vue';
import {
  TRANSACTION_RECORDS_DEFAULT_TIMEZONE,
  type TransactionRecordsTimezoneOffset,
} from './list-field/transactionRecordsTimezoneOffsets';
import {
  buildReportAmountCustomize,
  buildReportCurrencyCustomize,
  buildReportTimeCustomize,
  buildReportWalletCustomize,
} from './reportListFieldCustomize';
import type { TransactionRecordRow } from './transactionRecordTypes';
import {
  TRANSACTION_RECORD_AMOUNT_COLUMN_MIN_WIDTH,
  TRANSACTION_RECORD_CURRENCY_ADDRESS_COLUMN_MIN_WIDTH,
  TRANSACTION_RECORD_DIRECTION_COLUMN_MIN_WIDTH,
  TRANSACTION_RECORD_HASH_COLUMN_MIN_WIDTH,
  TRANSACTION_RECORD_TIME_COLUMN_MIN_WIDTH,
  TRANSACTION_RECORD_TIME_COLUMN_WIDTH,
  TRANSACTION_RECORD_TYPE_COLUMN_MIN_WIDTH,
  TRANSACTION_RECORD_WALLET_COLUMN_MIN_WIDTH,
} from './transactionRecordColumnLayout';
import {
  TRANSACTION_RECORDS_COLUMN_HEIGHT,
  TRANSACTION_RECORDS_HEADER_HEIGHT,
  useTransactionRecordsDataListPage,
} from './useTransactionRecordsDataListPage';
import { buildTransactionRecordsFilterRowSnapshot } from './filter/buildTransactionRecordsFilterRowSnapshot';
import {
  resolveTransactionRecordsFilterFieldIds,
  type TransactionRecordsFilterViewMode,
} from './filter/transactionRecordsFilterFieldLabelKeys';
import {
  TRANSACTION_RECORDS_FILTER_OPERATORS,
  buildTransactionRecordsFilterFields,
} from './filter/transactionRecordsFilterFields';
import TransactionRecordsExportFlotation from './export/TransactionRecordsExportFlotation.vue';
import type { TransactionRecordsExportScope } from './export/transactionRecordsExportData';
import TransactionRecordsDisplayFlotation from './TransactionRecordsDisplayFlotation.vue';
import { isSmallTransactionRecord } from './isSmallTransactionRecord';
import { registerTransactionRecordDetailFlow } from './transactionRecordDetailFlowContext';
import { registerTransactionRecordsDataListShellApi } from './transactionRecordsDataListShellApi';
import {
  TRANSACTION_RECORDS_DEMO_TOTAL,
  buildTransactionRecordRow,
} from './transactionRecordData';
import { useTransactionRecordDetailFlow } from './useTransactionRecordDetailFlow';
import styles from './TransactionRecordsDataListPage.module.css';

const { ui } = useAppI18n();

const selected = ref(0);
const value = ref('');
const transactionTimeTimezone = ref<TransactionRecordsTimezoneOffset>(
  TRANSACTION_RECORDS_DEFAULT_TIMEZONE,
);

const isSpecificAddressMode = computed(() => selected.value === 1);
const isWalletView = computed(() => !isSpecificAddressMode.value);

const reportFilterViewMode = computed((): TransactionRecordsFilterViewMode =>
  isSpecificAddressMode.value ? 'address' : 'wallet',
);

/** Wallet: Time → Currency|Address → Hash → Wallet → Type → Direction → Amount
 *  Address: Time → Currency|Address → Hash → Type → Direction → Amount */
const columnDisplayOrder = computed(() =>
  isWalletView.value
    ? {
        time: 1,
        currencyAddress: 2,
        hash: 3,
        wallet: 4,
        type: 5,
        direction: 6,
        amount: 7,
      }
    : {
        time: 1,
        currencyAddress: 2,
        hash: 3,
        type: 4,
        direction: 5,
        amount: 6,
        wallet: 0,
      },
);

const reportViewSegmentLabels = computed(() => [
  ui('View by Wallet'),
  ui('View by Address'),
]);

const filterConditions = ref<EgFilterCondition[]>([]);
const filterLogicMode = ref<EgFilterLogicMode>('all');
const hideSmallTransactions = ref(false);

const filterSourceRowCount = resolveDataListFilterSourceRowCount(
  false,
  TRANSACTION_RECORDS_DEMO_TOTAL,
);

const filterFields = computed((): EgFilterField[] =>
  buildTransactionRecordsFilterFields(
    (key) => ui(key),
    filterSourceRowCount,
    reportFilterViewMode.value,
  ),
);

const filteredIndices = computed(() => {
  const allIndices = Array.from({ length: TRANSACTION_RECORDS_DEMO_TOTAL }, (_, index) => index);
  const addressQuery = value.value.trim().toLowerCase();

  // View by Address: address is mandatory — show nothing until one is entered.
  let addressScopedIndices = allIndices;
  if (isSpecificAddressMode.value) {
    if (!addressQuery) {
      addressScopedIndices = [];
    } else {
      addressScopedIndices = allIndices.filter((rowIndex) => {
        const row = buildTransactionRecordRow(rowIndex);
        return (
          row.fromAddress.toLowerCase().includes(addressQuery)
          || row.toAddress.toLowerCase().includes(addressQuery)
        );
      });
    }
  }

  let nextIndices = addressScopedIndices;

  if (hasActiveEgFilterConditions(filterConditions.value)) {
    const conditions = filterConditions.value;
    const fields = filterFields.value;
    const logicMode = filterLogicMode.value;

    nextIndices = addressScopedIndices.filter((rowIndex) => {
      try {
        return applyEgFilterConditions({
          snapshot: buildTransactionRecordsFilterRowSnapshot(buildTransactionRecordRow(rowIndex)),
          conditions,
          fields,
          logicMode,
        });
      } catch {
        return true;
      }
    });
  }

  if (hideSmallTransactions.value) {
    nextIndices = nextIndices.filter(
      (rowIndex) => !isSmallTransactionRecord(buildTransactionRecordRow(rowIndex)),
    );
  }

  return nextIndices;
});

const filterBadge = computed(
  () => filterConditions.value.filter(isActiveEgFilterCondition).length,
);

const {
  DATA_LIST_FIGMA_PAGINER,
  DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS,
  amountSortOrder,
  currentPage,
  customize,
  firstPagination,
  goFirstPage,
  goLastPage,
  goNextPage,
  goPrevPage,
  isManyPageSelected,
  isManyPagination,
  lastPagination,
  manyPageItems,
  nextNavDisabled,
  nextPagination,
  onManyPageItemClick,
  onSettingsJump,
  onToolbarActionClick,
  pagePagination,
  paginatedRows,
  prevNavDisabled,
  prevPagination,
  setAmountSort,
  setTimeSort,
  settingsJumpValue,
  settingsLevelIndex,
  timeSortOrder,
  toolbarActionButtons,
  totalRowCount,
} = useTransactionRecordsDataListPage({
  sourceIndices: filteredIndices,
  filterBadge,
});

watch(filterConditions, () => {
  if (hasActiveEgFilterConditions(filterConditions.value)) {
    goFirstPage();
  }
}, { deep: true });

watch(reportFilterViewMode, (viewMode) => {
  const allowedFieldIds = new Set<string>(
    resolveTransactionRecordsFilterFieldIds(viewMode),
  );
  filterConditions.value = filterConditions.value.filter((condition) =>
    allowedFieldIds.has(condition.fieldId),
  );
  goFirstPage();
});

watch(value, () => {
  goFirstPage();
});

watch(hideSmallTransactions, () => {
  goFirstPage();
});

const { contentReady, setContentReady } = useDeferredContentMount();
const listForcedEmpty = ref(false);
const qaInitingHeld = ref(false);

const displayRows = computed(() => {
  if (listForcedEmpty.value) {
    return [];
  }
  return contentReady.value ? paginatedRows.value : [];
});

const listIniting = computed(() => qaInitingHeld.value || !contentReady.value);

const isHeaderSortDisabled = computed(
  () => Boolean(customize.value.loading) || displayRows.value.length === 0,
);

const detailFlow = useTransactionRecordDetailFlow();

onMounted(() => {
  registerTransactionRecordDetailFlow(detailFlow);
  registerTransactionRecordsDataListShellApi({
    setListEmpty: (empty) => {
      listForcedEmpty.value = empty;
      if (empty) {
        customize.value.loading = false;
        qaInitingHeld.value = false;
        setContentReady(true);
      }
    },
    setListIniting: (initing) => {
      qaInitingHeld.value = initing;
      if (initing) {
        listForcedEmpty.value = false;
        customize.value.loading = false;
        setContentReady(false);
        return;
      }
      setContentReady(true);
    },
    setListLoading: (loading) => {
      customize.value.loading = loading;
      if (loading) {
        listForcedEmpty.value = false;
        qaInitingHeld.value = false;
        setContentReady(true);
      }
    },
    showDangerToast: (message) => {
      console.warn(`[transaction-records QA] ${message}`);
    },
  });
});

onBeforeUnmount(() => {
  registerTransactionRecordDetailFlow(null);
  registerTransactionRecordsDataListShellApi(null);
});

function recordRow(data: DataListItem): TransactionRecordRow {
  return data as TransactionRecordRow;
}

function onRowClick(data: DataListItem) {
  detailFlow.openDetailForRow(recordRow(data), 'summary', {
    fromWalletView: isWalletView.value,
  });
}

const displayToolbarActionButtons = computed(() =>
  toolbarActionButtons.value.filter(
    (button) => button.key !== 'filter' && button.key !== 'export',
  ),
);

const hasActiveFilters = computed(() =>
  hasActiveEgFilterConditions(filterConditions.value),
);

function onExportConfirm(payload: {
  scope: TransactionRecordsExportScope;
  dateRange: string;
  presetId: string;
}) {
  void payload;
}
</script>

<template>
  <div :class="styles.dataListNest">
    <EgLayout type="empty" show-toolbar show-paginer>
      <template #toolbar>
        <EgToolBar
          :title="ui('Report')"
          :show-operation="true"
          :show-divider="true"
        >
          <template #title>
            <span :class="styles.toolbarTitleWithSegmented">
              {{ ui('Report') }}
              <EgSegmented
                v-model="selected"
                :labels="reportViewSegmentLabels"
              />
              <div
                v-if="isSpecificAddressMode"
                :class="styles.addressInputWrap"
              >
                <EgInput
                  v-model="value"
                  size="sm"
                  width-mode="full"
                  :placeholder="ui('Input Address')"
                />
              </div>
            </span>
          </template>
          <template #functional>
            <TasksToolbarFilter
              v-model="filterConditions"
              v-model:logic-mode="filterLogicMode"
              :fields="filterFields"
              :operators="TRANSACTION_RECORDS_FILTER_OPERATORS"
            />
            <EgIconProButton
              v-for="button in displayToolbarActionButtons"
              :key="button.key"
              :label="ui(button.item.label)"
              :badge="button.item.badge"
              :show-badge="button.item.showBadge"
              :show-reddot="button.item.showReddot"
              :disabled="button.item.disabled"
              @click="onToolbarActionClick(button.key)"
            >
              <EgIcon :name="button.item.icon" size="sm" />
            </EgIconProButton>
            <TransactionRecordsExportFlotation
              :has-active-filters="hasActiveFilters"
              @export="onExportConfirm"
            />
            <TransactionRecordsDisplayFlotation
              v-model:hide-small-transactions="hideSmallTransactions"
            />
          </template>
        </EgToolBar>
      </template>

      <div :class="styles.listRegion">
        <EgDataList
          :data-list="displayRows"
          :header-height="TRANSACTION_RECORDS_HEADER_HEIGHT"
          :column-height="TRANSACTION_RECORDS_COLUMN_HEIGHT"
          :loading="Boolean(customize.loading)"
          :initing="listIniting"
          :initing-text="ui('Loading')"
          @row-click="onRowClick"
        >
          <EgDataListColumn
            prop="transactionTime"
            :label="ui('Transaction Time UTC+08:00')"
            :min-width="TRANSACTION_RECORD_TIME_COLUMN_MIN_WIDTH"
            :width="TRANSACTION_RECORD_TIME_COLUMN_WIDTH"
            :display-order="columnDisplayOrder.time"
            :sortable="false"
          >
            <template #header>
              <div :class="pageStyles.comboHeader">
                <div :class="pageStyles.comboHeaderSegment">
                  <div :class="pageStyles.comboHeaderSegmentTextWrap">
                    <EgDataListCellOverflow
                      :content-class="pageStyles.comboHeaderSegmentText"
                      context="header"
                    >
                      {{ ui('Transaction Time UTC+08:00') }}
                    </EgDataListCellOverflow>
                  </div>
                  <DataListHeaderTimezoneTrigger
                    v-model="transactionTimeTimezone"
                    :disabled="Boolean(customize.loading)"
                  />
                  <DataListHeaderSortTrigger
                    label="Transaction Time UTC+08:00"
                    :active-order="timeSortOrder"
                    :disabled="isHeaderSortDisabled"
                    @sort-change="setTimeSort"
                  />
                </div>
              </div>
            </template>
            <template #default="{ data }">
              <TasksListFieldTime
                :customize="buildReportTimeCustomize(recordRow(data), transactionTimeTimezone)"
              />
            </template>
          </EgDataListColumn>

          <EgDataListColumn
            prop="currencyAddress"
            :label="ui('Currency')"
            :min-width="TRANSACTION_RECORD_CURRENCY_ADDRESS_COLUMN_MIN_WIDTH"
            align="left"
            :flex-grow="true"
            :display-order="columnDisplayOrder.currencyAddress"
            :sortable="false"
          >
            <template #header>
              <div :class="pageStyles.comboHeader">
                <div :class="pageStyles.comboHeaderSegment">
                  <div :class="pageStyles.comboHeaderSegmentTextWrap">
                    <EgDataListCellOverflow
                      :content-class="pageStyles.comboHeaderSegmentText"
                      context="header"
                    >
                      {{ ui('Currency') }}
                    </EgDataListCellOverflow>
                  </div>
                </div>
                <EgDivider type="navigator" direction="vertical" />
                <div :class="pageStyles.comboHeaderSegment">
                  <div :class="pageStyles.comboHeaderSegmentTextWrap">
                    <EgDataListCellOverflow
                      :content-class="pageStyles.comboHeaderSegmentText"
                      context="header"
                    >
                      {{ ui('Address') }}
                    </EgDataListCellOverflow>
                  </div>
                </div>
              </div>
            </template>
            <template #default="{ data }">
              <div :class="styles.currencyAddressCell">
                <TasksListFieldCurrency
                  :customize="buildReportCurrencyCustomize(recordRow(data), {
                    enableMultiTxAddressCount: isWalletView,
                  })"
                />
              </div>
            </template>
          </EgDataListColumn>

          <EgDataListColumn
            prop="txHash"
            :label="ui('Transaction hash')"
            :min-width="TRANSACTION_RECORD_HASH_COLUMN_MIN_WIDTH"
            align="left"
            :display-order="columnDisplayOrder.hash"
            :sortable="false"
          >
            <template #default="{ data }">
              <EgListFieldHashLikeLine
                :text="recordRow(data).txHash"
                variant="primary"
                tooltip-trigger="hover"
              />
            </template>
          </EgDataListColumn>

          <EgDataListColumn
            v-if="isWalletView"
            prop="walletName"
            :label="ui('Affiliated Wallet')"
            :min-width="TRANSACTION_RECORD_WALLET_COLUMN_MIN_WIDTH"
            :display-order="columnDisplayOrder.wallet"
            :sortable="false"
          >
            <template #header>
              <TransactionRecordsWalletColumnHeader />
            </template>
            <template #default="{ data }">
              <TasksListFieldGeneralStructure :customize="buildReportWalletCustomize(recordRow(data))" />
            </template>
          </EgDataListColumn>

          <EgDataListColumn
            prop="transactionType"
            :label="ui('Transaction Type')"
            :min-width="TRANSACTION_RECORD_TYPE_COLUMN_MIN_WIDTH"
            :display-order="columnDisplayOrder.type"
            align="left"
            :sortable="false"
          >
            <template #default="{ data }">
              <EgListFieldOverflowText
                :text="recordRow(data).transactionType"
                variant="primary"
                tooltip-trigger="hover"
              />
            </template>
          </EgDataListColumn>

          <EgDataListColumn
            prop="directionLabel"
            :label="ui('Income/Expense Type')"
            :min-width="TRANSACTION_RECORD_DIRECTION_COLUMN_MIN_WIDTH"
            :display-order="columnDisplayOrder.direction"
            align="left"
            :sortable="false"
          >
            <template #default="{ data }">
              <EgListFieldOverflowText
                :text="recordRow(data).directionLabel"
                variant="primary"
                tooltip-trigger="hover"
              />
            </template>
          </EgDataListColumn>

          <EgDataListColumn
            prop="amount"
            :label="ui('Amount')"
            :min-width="TRANSACTION_RECORD_AMOUNT_COLUMN_MIN_WIDTH"
            align="right"
            :flex-grow="true"
            :display-order="columnDisplayOrder.amount"
            :sortable="false"
          >
            <template #header>
              <div :class="[pageStyles.comboHeader, pageStyles.comboHeaderAlignEnd]">
                <div :class="pageStyles.comboHeaderSegment">
                  <div :class="pageStyles.comboHeaderSegmentTextWrap">
                    <EgDataListCellOverflow
                      :content-class="pageStyles.comboHeaderSegmentText"
                      context="header"
                    >
                      {{ ui('Amount') }}
                    </EgDataListCellOverflow>
                  </div>
                  <DataListHeaderSortTrigger
                    label="Amount"
                    align="end"
                    :active-order="amountSortOrder"
                    :disabled="isHeaderSortDisabled"
                    @sort-change="setAmountSort"
                  />
                </div>
              </div>
            </template>
            <template #default="{ data }">
              <TasksListFieldAmount :customize="buildReportAmountCustomize(recordRow(data))" />
            </template>
          </EgDataListColumn>
        </EgDataList>
      </div>

      <template #paginer>
        <EgPaginer
          v-model:settings-level-index="settingsLevelIndex"
          v-model:settings-jump-value="settingsJumpValue"
          :show-statistics="false"
          :data-volume-total="ui(DATA_LIST_FIGMA_PAGINER.dataVolumeTotal)"
          :data-volume-count="String(totalRowCount)"
          :data-volume-results="ui(DATA_LIST_FIGMA_PAGINER.dataVolumeResults)"
          :settings-level-labels="[...DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS]"
          :settings-level-label="ui('Items Per Page')"
          :settings-jump-label="ui('Go to Page')"
          :settings-jump-placeholder="ui('Please Enter')"
          @settings-jump="onSettingsJump"
        >
          <EgPaginationGroupButton
            :kind="firstPagination.kind"
            :tone="firstPagination.tone"
            :disabled="prevNavDisabled || firstPagination.disabled"
            @click="goFirstPage"
          >
            <EgIcon name="eds-arrow-go-first" fit />
          </EgPaginationGroupButton>
          <EgPaginationGroupButton
            :kind="prevPagination.kind"
            :tone="prevPagination.tone"
            :disabled="prevNavDisabled || prevPagination.disabled"
            @click="goPrevPage"
          >
            <EgIcon name="eds-arrow-left-mini-ios" fit />
          </EgPaginationGroupButton>
          <template v-if="!isManyPagination">
            <EgPaginationGroupButton
              :kind="pagePagination.kind"
              :tone="pagePagination.tone"
              selected
              :disabled="pagePagination.disabled"
              :label="String(currentPage)"
            />
          </template>
          <template v-else>
            <EgPaginationGroupButton
              v-for="(item, index) in manyPageItems"
              :key="`${item.kind}-${item.label}-${index}`"
              :kind="pagePagination.kind"
              :tone="pagePagination.tone"
              :selected="isManyPageSelected(item, index)"
              :disabled="pagePagination.disabled"
              :label="item.label"
              @click="onManyPageItemClick(item)"
            />
          </template>
          <EgPaginationGroupButton
            :kind="nextPagination.kind"
            :tone="nextPagination.tone"
            :disabled="nextNavDisabled || nextPagination.disabled"
            @click="goNextPage"
          >
            <EgIcon name="eds-arrow-right-mini-ios" fit />
          </EgPaginationGroupButton>
          <EgPaginationGroupButton
            :kind="lastPagination.kind"
            :tone="lastPagination.tone"
            :disabled="nextNavDisabled || lastPagination.disabled"
            @click="goLastPage"
          >
            <EgIcon name="eds-arrow-go-last" fit />
          </EgPaginationGroupButton>
        </EgPaginer>
      </template>
    </EgLayout>
  </div>
</template>
