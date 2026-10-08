import { computed, ref, shallowRef } from 'vue';
import {
  buildTransactionRecordRow,
  TRANSACTION_RECORD_PARALLEL_OUT_DEMO_ROW_INDEX,
} from './transactionRecordData';
import type { TransactionRecordDetailPage } from './transactionRecordDetailPage';
import type { TransactionRecordRow } from './transactionRecordTypes';
import { parseRowIndexFromTransactionRecordId } from './transactionRecordDetail';

export function useTransactionRecordDetailFlow() {
  const detailOpen = ref(false);
  const detailRow = shallowRef<TransactionRecordRow | null>(null);
  const detailPage = ref<TransactionRecordDetailPage>('summary');
  /** 打开详情时所在视图：仅 View by Wallet 启用多笔 (x) / 查看明细。 */
  const detailOpenedFromWalletView = ref(true);

  const detailPopupMounted = computed(
    () => detailOpen.value || detailRow.value != null,
  );

  function loadDetail(id: string) {
    const rowIndex = parseRowIndexFromTransactionRecordId(id);
    detailRow.value = buildTransactionRecordRow(rowIndex);
  }

  function openDetailForRow(
    row: TransactionRecordRow,
    page: TransactionRecordDetailPage = 'summary',
    options: { fromWalletView?: boolean } = {},
  ) {
    loadDetail(row.id);
    detailOpenedFromWalletView.value = options.fromWalletView ?? true;
    detailPage.value = page;
    detailOpen.value = true;
  }

  function openParallelOutBtcDetailDemo(
    page: TransactionRecordDetailPage = 'summary',
  ) {
    openDetailForRow(
      buildTransactionRecordRow(TRANSACTION_RECORD_PARALLEL_OUT_DEMO_ROW_INDEX),
      page,
      { fromWalletView: true },
    );
  }

  function resetDetailNavigation() {
    detailPage.value = 'summary';
  }

  function onDetailPopupClosed() {
    detailRow.value = null;
    detailPage.value = 'summary';
    detailOpenedFromWalletView.value = true;
  }

  return {
    detailOpen,
    detailRow,
    detailPage,
    detailOpenedFromWalletView,
    detailPopupMounted,
    openDetailForRow,
    openParallelOutBtcDetailDemo,
    resetDetailNavigation,
    onDetailPopupClosed,
  };
}
