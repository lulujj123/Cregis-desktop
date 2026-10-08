import {
  parseTransactionRecordCount,
  transactionRecordShowsMultiTxDetail,
} from './transactionRecordData';
import type { TransactionRecordRow } from './transactionRecordTypes';
import {
  shiftTimestampForTimezone,
  TRANSACTION_RECORDS_TIMEZONE_BASELINE,
  type TransactionRecordsTimezoneOffset,
} from './list-field/transactionRecordsTimezoneOffsets';

/** Showcase list-field-time · 单行 body-medium。 */
export function buildReportTimeCustomize(
  row: TransactionRecordRow,
  timezone: TransactionRecordsTimezoneOffset = TRANSACTION_RECORDS_TIMEZONE_BASELINE,
): Record<string, unknown> {
  return {
    datetime: shiftTimestampForTimezone(
      row.transactionTime,
      TRANSACTION_RECORDS_TIMEZONE_BASELINE,
      timezone,
    ),
    lineLayout: 'single',
    tooltipTrigger: 'hover',
  };
}

/** Showcase list-field-currency · 币种图标 + 网络 Tag + 双地址（交易记录自有组合）。 */
export function buildReportCurrencyCustomize(
  row: TransactionRecordRow,
  options: {
    enableMultiTxAddressCount?: boolean;
    /** View by Address：不展示已选搜索地址，只留交互对方地址。 */
    hideSelectedAddress?: string;
  } = {},
): Record<string, unknown> {
  const multiTx =
    Boolean(options.enableMultiTxAddressCount)
    && transactionRecordShowsMultiTxDetail(row);
  const toAddressCount = multiTx
    ? String(parseTransactionRecordCount(row))
    : '1';

  const hide = options.hideSelectedAddress?.trim().toLowerCase() ?? '';
  let fromSideVisible = true;
  let toSideVisible = true;
  if (hide) {
    const fromMatch = row.fromAddress.toLowerCase() === hide;
    const toMatch = row.toAddress.toLowerCase() === hide;
    if (fromMatch && !toMatch) {
      fromSideVisible = false;
    } else if (toMatch && !fromMatch) {
      toSideVisible = false;
    } else if (fromMatch && toMatch) {
      // Same address both sides — keep a single from line.
      toSideVisible = false;
    }
  }

  return {
    symbol: row.symbol,
    cryptoName: row.cryptoName,
    showNetwork: row.showNetwork,
    networkLabel: row.networkLabel,
    comboMode: 'double-address',
    entryBadgeMode: 'none',
    fromAlias1: row.fromAlias,
    fromAddress1: row.fromAddress,
    fromAddressCount: '1',
    toAddress1: row.toAddress,
    toAddressCount,
    fromSideVisible,
    toSideVisible,
    addressTooltipTrigger: 'hover',
  };
}

/** Showcase list-field-general-structure · 单行无头像。 */
export function buildReportWalletCustomize(row: TransactionRecordRow): Record<string, unknown> {
  return {
    value: row.walletName,
    lineLayout: 'single',
    initiatorIconKind: 'none',
    tooltipTrigger: 'hover',
  };
}

/** Showcase list-field-amount · conversion + 右对齐（§7.8 resolveDemoAmountRowValues）。 */
export function buildReportAmountCustomize(row: TransactionRecordRow): Record<string, unknown> {
  return {
    amountType: 'conversion',
    cryptoValue: row.amount,
    cryptoSymbol: row.symbol,
    fiatValue: row.fiatAmount,
    showCryptoIcon: false,
    alignEnd: true,
    tooltipTrigger: 'hover',
  };
}
