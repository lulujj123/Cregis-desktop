import type { EgFilterRowSnapshot } from '../../shared/applyEgFilterConditions';
import { resolveDataListFilterOptionId } from '../../shared/dataListFilterOptionUtils';
import { resolveDirectionLabelForPerspectiveAddress } from '../transactionRecordData';
import type { TransactionRecordRow } from '../transactionRecordTypes';

function joinSearchParts(values: Array<string | undefined>): string {
  return values
    .map((value) => String(value ?? '').trim())
    .filter(Boolean)
    .join(' ');
}

export function buildTransactionRecordsFilterRowSnapshot(
  row: TransactionRecordRow,
  options: { perspectiveAddress?: string } = {},
): EgFilterRowSnapshot {
  const directionLabel = resolveDirectionLabelForPerspectiveAddress(
    row,
    options.perspectiveAddress,
  );

  return {
    wallet: row.walletName.trim()
      ? resolveDataListFilterOptionId('tx-records-wallet', row.walletName)
      : undefined,
    currency: row.symbol,
    currencySymbol: row.symbol,
    currencyNetwork: row.networkLabel.trim(),
    transactionTime: row.transactionTime,
    incomeExpenseType: directionLabel.trim()
      ? resolveDataListFilterOptionId('tx-records-income-expense', directionLabel)
      : undefined,
    transactionType: row.transactionType.trim()
      ? resolveDataListFilterOptionId('tx-records-tx-type', row.transactionType)
      : undefined,
    txHash: row.txHash,
    paymentAddress: joinSearchParts([row.fromAddress, row.fromAlias]),
    receivingAddress: joinSearchParts([row.toAddress, row.toAlias]),
    projectName: row.projectName?.trim()
      ? resolveDataListFilterOptionId('tx-records-project-name', row.projectName)
      : undefined,
    thirdPartyRef: row.thirdPartyRef,
    interactionAddress: joinSearchParts([
      row.fromAddress,
      row.fromAlias,
      row.toAddress,
      row.toAlias,
    ]),
  };
}
