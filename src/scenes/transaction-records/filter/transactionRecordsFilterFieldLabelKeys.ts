import { dataListTimeColumnLabelKey } from '../../shared/dataListTimeLabelKeys';

/** 交易记录 EgFilter 字段 i18n labelKey 真源。 */
export const TRANSACTION_RECORDS_FILTER_FIELD_LABEL_KEYS = {
  wallet: 'Wallet',
  currency: 'Currency',
  transactionTime: 'Transaction Time',
  transactionType: 'Transaction Type',
  incomeExpenseType: 'Income/Expense Type',
  txHash: 'Transaction hash',
  paymentAddress: 'Payment Address',
  receivingAddress: 'Receiving Address',
  projectName: 'Project Name',
  thirdPartyRef: 'Third-party Reference',
  interactionAddress: 'Interaction Address',
} as const;

/** 付款／收款地址筛选输入占位。 */
export const TRANSACTION_RECORDS_FILTER_ADDRESS_INPUT_PLACEHOLDER_KEY =
  'Please enter address / address alias';

export type TransactionRecordsFilterFieldId =
  keyof typeof TRANSACTION_RECORDS_FILTER_FIELD_LABEL_KEYS;

export type TransactionRecordsFilterViewMode = 'wallet' | 'address';

/** View by Wallet */
export const TRANSACTION_RECORDS_WALLET_FILTER_FIELD_IDS: readonly TransactionRecordsFilterFieldId[] =
  [
    'wallet',
    'currency',
    'transactionTime',
    'transactionType',
    'incomeExpenseType',
    'txHash',
    'paymentAddress',
    'receivingAddress',
    'projectName',
    'thirdPartyRef',
  ];

/** View by Address */
export const TRANSACTION_RECORDS_ADDRESS_FILTER_FIELD_IDS: readonly TransactionRecordsFilterFieldId[] =
  [
    'currency',
    'transactionTime',
    'transactionType',
    'incomeExpenseType',
    'txHash',
    'interactionAddress',
  ];

/** @deprecated Prefer mode-specific lists; kept for callers that need the full catalog. */
export const TRANSACTION_RECORDS_FILTER_FIELD_IDS: readonly TransactionRecordsFilterFieldId[] = [
  ...TRANSACTION_RECORDS_WALLET_FILTER_FIELD_IDS,
  'interactionAddress',
];

export function resolveTransactionRecordsFilterFieldIds(
  viewMode: TransactionRecordsFilterViewMode,
): readonly TransactionRecordsFilterFieldId[] {
  return viewMode === 'address'
    ? TRANSACTION_RECORDS_ADDRESS_FILTER_FIELD_IDS
    : TRANSACTION_RECORDS_WALLET_FILTER_FIELD_IDS;
}

export function transactionRecordsTimeColumnLabelKey(): string {
  return dataListTimeColumnLabelKey(
    TRANSACTION_RECORDS_FILTER_FIELD_LABEL_KEYS.transactionTime,
  );
}
