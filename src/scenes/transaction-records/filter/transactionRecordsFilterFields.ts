import {
  DEFAULT_FILTER_OPERATORS,
  FILTER_INPUT_PLACEHOLDER,
  FILTER_SELECT_PLACEHOLDER,
  FILTER_TIME_RANGE_PLACEHOLDER,
  type EgFilterField,
  type EgFilterOperator,
} from '@eds/desktop-components';
import { resolveDataListFilterSourceRowCount } from '../../shared/buildListDerivedFilterOptions';
import { TRANSACTION_RECORDS_DEMO_TOTAL } from '../transactionRecordData';
import { buildTransactionRecordsFilterOptionsFromRows } from './buildTransactionRecordsFilterOptionsFromRows';
import {
  resolveTransactionRecordsFilterFieldIds,
  TRANSACTION_RECORDS_FILTER_ADDRESS_INPUT_PLACEHOLDER_KEY,
  TRANSACTION_RECORDS_FILTER_FIELD_LABEL_KEYS,
  type TransactionRecordsFilterFieldId,
  type TransactionRecordsFilterViewMode,
} from './transactionRecordsFilterFieldLabelKeys';

function filterLabel(
  translate: (key: string) => string,
  fieldId: TransactionRecordsFilterFieldId,
): string {
  return translate(TRANSACTION_RECORDS_FILTER_FIELD_LABEL_KEYS[fieldId]);
}

function buildFieldCatalog(
  translate: (key: string) => string,
  rowOptions: ReturnType<typeof buildTransactionRecordsFilterOptionsFromRows>,
): Record<TransactionRecordsFilterFieldId, EgFilterField> {
  return {
    wallet: {
      id: 'wallet',
      label: filterLabel(translate, 'wallet'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: rowOptions.walletOptions,
    },
    currency: {
      id: 'currency',
      label: filterLabel(translate, 'currency'),
      kind: 'currency',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      currencyOptions: rowOptions.currencyOptions,
    },
    transactionTime: {
      id: 'transactionTime',
      label: filterLabel(translate, 'transactionTime'),
      kind: 'time-range',
      placeholder: FILTER_TIME_RANGE_PLACEHOLDER,
    },
    transactionType: {
      id: 'transactionType',
      label: filterLabel(translate, 'transactionType'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: rowOptions.transactionTypeOptions,
    },
    incomeExpenseType: {
      id: 'incomeExpenseType',
      label: filterLabel(translate, 'incomeExpenseType'),
      kind: 'dropdown',
      selectionMode: 'single',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: rowOptions.incomeExpenseTypeOptions,
    },
    txHash: {
      id: 'txHash',
      label: filterLabel(translate, 'txHash'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    paymentAddress: {
      id: 'paymentAddress',
      label: filterLabel(translate, 'paymentAddress'),
      kind: 'input',
      // Pass catalog key; EgFilter `t()` → ui() (do not pre-translate).
      placeholder: TRANSACTION_RECORDS_FILTER_ADDRESS_INPUT_PLACEHOLDER_KEY,
    },
    receivingAddress: {
      id: 'receivingAddress',
      label: filterLabel(translate, 'receivingAddress'),
      kind: 'input',
      placeholder: TRANSACTION_RECORDS_FILTER_ADDRESS_INPUT_PLACEHOLDER_KEY,
    },
    projectName: {
      id: 'projectName',
      label: filterLabel(translate, 'projectName'),
      kind: 'dropdown',
      selectionMode: 'multi',
      placeholder: FILTER_SELECT_PLACEHOLDER,
      dropdownOptions: rowOptions.projectNameOptions,
    },
    thirdPartyRef: {
      id: 'thirdPartyRef',
      label: filterLabel(translate, 'thirdPartyRef'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
    interactionAddress: {
      id: 'interactionAddress',
      label: filterLabel(translate, 'interactionAddress'),
      kind: 'input',
      placeholder: FILTER_INPUT_PLACEHOLDER,
    },
  };
}

export function buildTransactionRecordsFilterFields(
  translate: (key: string) => string,
  rowCount?: number,
  viewMode: TransactionRecordsFilterViewMode = 'wallet',
): EgFilterField[] {
  const sourceRowCount = resolveDataListFilterSourceRowCount(
    false,
    rowCount ?? TRANSACTION_RECORDS_DEMO_TOTAL,
  );
  const rowOptions = buildTransactionRecordsFilterOptionsFromRows(sourceRowCount);
  const catalog = buildFieldCatalog(translate, rowOptions);
  const fieldIds = resolveTransactionRecordsFilterFieldIds(viewMode);

  return fieldIds.map((fieldId) => catalog[fieldId]);
}

export const TRANSACTION_RECORDS_FILTER_OPERATORS: EgFilterOperator[] = DEFAULT_FILTER_OPERATORS;
