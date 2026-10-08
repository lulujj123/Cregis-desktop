import type {
  EgFilterFieldCurrencyOption,
  EgFilterFieldDropdownOption,
} from '@eds/desktop-components';
import type { PaymentEngineRecordRow } from '../../payment-engine/paymentEngineRecordConfigs';
import { buildDataListCurrencyFilterOptionsFromRows } from '../../shared/buildDataListCurrencyFilterOptionsFromRows';
import { uniqueDataListFilterOptions } from '../../shared/dataListFilterOptionUtils';
import {
  TRANSACTION_RECORDS_DEMO_TOTAL,
  buildTransactionRecordRow,
} from '../transactionRecordData';
import type { TransactionRecordRow } from '../transactionRecordTypes';

export type TransactionRecordsFilterRowOptions = {
  currencyOptions: EgFilterFieldCurrencyOption[];
  walletOptions: EgFilterFieldDropdownOption[];
  incomeExpenseTypeOptions: EgFilterFieldDropdownOption[];
  transactionTypeOptions: EgFilterFieldDropdownOption[];
  projectNameOptions: EgFilterFieldDropdownOption[];
};

function adaptRowForCurrencyFilter(
  row: TransactionRecordRow,
): PaymentEngineRecordRow {
  return {
    currencySymbol: row.symbol,
    currencyCryptoName: row.cryptoName,
    currencyShowNetwork: row.showNetwork,
    currencyNetwork: row.networkLabel,
    networkLabel: row.networkLabel,
    orderSymbol: row.symbol,
  } as PaymentEngineRecordRow;
}

export function buildTransactionRecordsFilterOptionsFromRows(
  rowCount = TRANSACTION_RECORDS_DEMO_TOTAL,
): TransactionRecordsFilterRowOptions {
  const safeRowCount = Math.max(0, rowCount);
  const incomeExpenseLabels: string[] = [];
  const transactionTypeLabels: string[] = [];
  const projectNameLabels: string[] = [];
  const walletLabels: string[] = [];
  const currencyRows: PaymentEngineRecordRow[] = [];

  for (let rowIndex = 0; rowIndex < safeRowCount; rowIndex += 1) {
    const row = buildTransactionRecordRow(rowIndex);
    currencyRows.push(adaptRowForCurrencyFilter(row));

    if (row.directionLabel.trim()) incomeExpenseLabels.push(row.directionLabel);
    if (row.transactionType.trim()) transactionTypeLabels.push(row.transactionType);
    if (row.projectName?.trim()) projectNameLabels.push(row.projectName);
    if (row.walletName.trim()) walletLabels.push(row.walletName);
  }

  return {
    currencyOptions: buildDataListCurrencyFilterOptionsFromRows(
      currencyRows,
      (row) => row.currencySymbol ?? row.orderSymbol,
    ),
    walletOptions: uniqueDataListFilterOptions('tx-records-wallet', walletLabels),
    incomeExpenseTypeOptions: uniqueDataListFilterOptions(
      'tx-records-income-expense',
      incomeExpenseLabels,
    ),
    transactionTypeOptions: uniqueDataListFilterOptions(
      'tx-records-tx-type',
      transactionTypeLabels,
    ),
    projectNameOptions: uniqueDataListFilterOptions(
      'tx-records-project-name',
      projectNameLabels,
    ),
  };
}
