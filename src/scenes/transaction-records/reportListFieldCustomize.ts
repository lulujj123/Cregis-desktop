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
  options: { enableMultiTxAddressCount?: boolean } = {},
): Record<string, unknown> {
  const multiTx =
    Boolean(options.enableMultiTxAddressCount)
    && transactionRecordShowsMultiTxDetail(row);
  const toAddressCount = multiTx
    ? String(parseTransactionRecordCount(row))
    : '1';

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
    fromSideVisible: true,
    toSideVisible: true,
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
