import {
  createDetailApplyItemRow,
  type DetailItemData,
  type DetailSectionData,
} from '@eds/desktop-components';
import { buildDetailCurrencyAmountItems } from '@/scenes/tasks/shared/buildDetailCurrencyAmountItems';
import { formatEmptyDisplayValue } from '@/utils/formatEmptyDisplay';
import {
  isTransactionRecordCompactCollectionDetailType,
  isTransactionRecordExtendedCollectionOutDetailType,
  isTransactionRecordTransferOutDetailType,
  TRANSACTION_RECORD_DETAIL_NORMAL_IN,
  TRANSACTION_RECORD_DETAIL_ON_CHAIN_OPERATION,
  TRANSACTION_RECORD_DETAIL_PARALLEL_OUT,
} from './transactionRecordDetailTypes';
import { resolveParallelOutReceivingAddresses } from './transactionRecordParallelOutDetailData';
import { transactionRecordShowsMultiTxDetail } from './transactionRecordData';
import type { TransactionRecordRow } from './transactionRecordTypes';

export type BuildTransactionRecordDetailSectionsOptions = {
  /** View by Wallet：笔数 > 1 时展示「查看明细」与多接收地址。 */
  enableMultiTxDetail?: boolean;
};

/** sender/receiver 变体 catalog 自带演示 tag；无别名时须传 '' 清掉，与列表侧一致。 */
function resolveDetailAddressTag(alias?: string): string {
  return alias?.trim() ?? '';
}

function buildTransactionCountDetailItem(
  row: TransactionRecordRow,
  translate: (key: string) => string,
  enableMultiTxDetail: boolean,
): DetailItemData {
  const showDetailLink =
    enableMultiTxDetail && transactionRecordShowsMultiTxDetail(row);

  const item: DetailItemData = {
    ...createDetailApplyItemRow('text', {
      key: 'transaction-count',
      title: translate('Transaction Count'),
      // 与产品稿一致：可下钻时只展示数字，单位不拼进 value。
      value: showDetailLink
        ? row.transactionCount
        : enableMultiTxDetail
          ? row.transactionCount
          : '1',
    }),
    titleIcon: 'eds-text-numerical',
  };

  if (showDetailLink) {
    item.showValueLink = true;
    item.valueLinkLabel = translate('View details');
  }

  return item;
}

function buildReceivingAddressDetailItem(
  row: TransactionRecordRow,
  translate: (key: string) => string,
  enableMultiTxDetail: boolean,
): DetailItemData {
  const multiAddresses =
    enableMultiTxDetail
    && row.transactionType === TRANSACTION_RECORD_DETAIL_PARALLEL_OUT
    && transactionRecordShowsMultiTxDetail(row)
      ? resolveParallelOutReceivingAddresses(row)
      : [row.toAddress];

  if (multiAddresses.length > 1) {
    return {
      ...createDetailApplyItemRow('receiver', {
        key: 'receiving-address',
        title: translate('Receiving Address'),
        value: multiAddresses[0] ?? row.toAddress,
        tag: '',
      }),
      valueEntries: multiAddresses.map((address) => ({
        value: address,
        tag: '',
        tagBeforeValue: true as const,
      })),
    };
  }

  return createDetailApplyItemRow('receiver', {
    key: 'receiving-address',
    title: translate('Receiving Address'),
    value: multiAddresses[0] ?? row.toAddress,
    tag: resolveDetailAddressTag(row.toAlias),
  });
}

function buildDetailItemsThroughReceivingAddress(
  row: TransactionRecordRow,
  translate: (key: string) => string,
  enableMultiTxDetail: boolean,
): DetailItemData[] {
  return [
    ...buildDetailCurrencyAmountItems(
      {
        amountRowValue: row.amount,
        amountCryptoSymbol: row.symbol,
        amountCryptoName: row.cryptoName,
        amountNetworkLabel: row.showNetwork ? row.networkLabel : '',
      },
      translate,
    ),
    {
      ...createDetailApplyItemRow('time', {
        key: 'created-time',
        title: translate('Creation Time'),
        value: row.createdTime,
      }),
      titleIcon: 'eds-calendar-start',
    },
    {
      ...createDetailApplyItemRow('time', {
        key: 'transaction-time',
        title: translate('Transaction Time'),
        value: row.transactionTime,
      }),
      titleIcon: 'eds-calendar-end',
    },
    createDetailApplyItemRow('type', {
      key: 'transaction-type',
      title: translate('Transaction Type'),
      value: row.transactionType,
    }),
    buildProjectNameDetailItem(row, translate),
    {
      ...createDetailApplyItemRow('text', {
        key: 'wallet',
        title: translate('Affiliated Wallet'),
        value: row.walletName,
      }),
      titleIcon: 'eds-wallet',
    },
    createDetailApplyItemRow('sender', {
      key: 'payment-address',
      title: translate('Payment Address'),
      value: row.fromAddress,
      tag: resolveDetailAddressTag(row.fromAlias),
    }),
    buildReceivingAddressDetailItem(row, translate, enableMultiTxDetail),
  ];
}

function buildProjectNameDetailItem(
  row: TransactionRecordRow,
  translate: (key: string) => string,
): DetailItemData {
  return createDetailApplyItemRow('text', {
    key: 'project-name',
    title: translate('Project Name'),
    value: formatEmptyDisplayValue(row.projectName),
  });
}

function buildRemarkDetailItem(
  row: TransactionRecordRow,
  translate: (key: string) => string,
): DetailItemData {
  return {
    ...createDetailApplyItemRow('remark', {
      key: 'remark',
      title: translate('Remark'),
      value: formatEmptyDisplayValue(row.remark),
    }),
    // Keep Apply_Item remark Edit link; popup handles click → textarea.
    valueLinkLabel: translate('Edit'),
  };
}

function withTrailingRemark(
  items: DetailItemData[],
  row: TransactionRecordRow,
  translate: (key: string) => string,
): DetailItemData[] {
  return [...items, buildRemarkDetailItem(row, translate)];
}

function resolveMinerFeeCategoryLabel(
  category: TransactionRecordRow['minerFeeCategory'],
  translate: (key: string) => string,
): string {
  return category === 'sponsored'
    ? translate('Sponsored')
    : translate('Native Currency');
}

function buildTransactionOutcomeItems(
  row: TransactionRecordRow,
  translate: (key: string) => string,
  enableMultiTxDetail: boolean,
): DetailItemData[] {
  return [
    buildTransactionCountDetailItem(row, translate, enableMultiTxDetail),
    createDetailApplyItemRow('txid', {
      key: 'transaction-hash',
      title: translate('Transaction hash'),
      value: row.txHash,
    }),
    createDetailApplyItemRow('fee', {
      key: 'miner-fee',
      title: translate('Miner Fee'),
      value: row.minerFeeDisplay,
    }),
    createDetailApplyItemRow('type', {
      key: 'miner-fee-category',
      title: translate('Gas Fee Type'),
      value: resolveMinerFeeCategoryLabel(row.minerFeeCategory, translate),
    }),
    createDetailApplyItemRow('text', {
      key: 'miner-fee-token',
      title: translate('Gas Fee Token'),
      value: row.minerFeeToken,
    }),
  ];
}

function buildTransferOutDetailItems(
  row: TransactionRecordRow,
  translate: (key: string) => string,
  enableMultiTxDetail: boolean,
): DetailItemData[] {
  return withTrailingRemark(
    [
      ...buildDetailItemsThroughReceivingAddress(row, translate, enableMultiTxDetail),
      createDetailApplyItemRow('tripartite-number', {
        key: 'third-party',
        title: translate('Third-party Reference'),
        value: row.thirdPartyRef ?? '',
      }),
      ...buildTransactionOutcomeItems(row, translate, enableMultiTxDetail),
      createDetailApplyItemRow('initiated-by', {
        key: 'initiator',
        title: translate('Initiator'),
        value: row.initiatorDisplay ?? '',
      }),
      buildSignerDetailItem(row, translate),
    ],
    row,
    translate,
  );
}

function buildSignerDetailItem(
  row: TransactionRecordRow,
  translate: (key: string) => string,
): DetailItemData {
  return {
    ...createDetailApplyItemRow('initiated-by', {
      key: 'signer',
      title: translate('Signer'),
      value: row.signerDisplay ?? '',
    }),
    titleIcon: 'eds-signature-pen',
  };
}

function buildCollectionNumberItem(
  row: TransactionRecordRow,
  translate: (key: string) => string,
): DetailItemData {
  return {
    ...createDetailApplyItemRow('brand-number', {
      key: 'collection-number',
      title: translate('Collection Number'),
      value: row.collectionNumber ?? '',
    }),
    titleIcon: 'eds-steps-number',
  };
}

function buildCollectionOutDetailItems(
  row: TransactionRecordRow,
  translate: (key: string) => string,
  enableMultiTxDetail: boolean,
): DetailItemData[] {
  return withTrailingRemark(
    [
      ...buildDetailItemsThroughReceivingAddress(row, translate, enableMultiTxDetail),
      ...buildTransactionOutcomeItems(row, translate, enableMultiTxDetail),
      buildCollectionNumberItem(row, translate),
    ],
    row,
    translate,
  );
}

/** 并行转出：创建时间 + 矿工费 + 签名人 + 备注。 */
function buildParallelOutDetailItems(
  row: TransactionRecordRow,
  translate: (key: string) => string,
  enableMultiTxDetail: boolean,
): DetailItemData[] {
  return withTrailingRemark(
    [
      ...buildDetailItemsThroughReceivingAddress(row, translate, enableMultiTxDetail),
      ...buildTransactionOutcomeItems(row, translate, enableMultiTxDetail),
      buildSignerDetailItem(row, translate),
    ],
    row,
    translate,
  );
}

/** 链上操作：创建时间 + 矿工费 + 签名人 + 归集编号 + 备注。 */
function buildOnChainOperationDetailItems(
  row: TransactionRecordRow,
  translate: (key: string) => string,
  enableMultiTxDetail: boolean,
): DetailItemData[] {
  return withTrailingRemark(
    [
      ...buildDetailItemsThroughReceivingAddress(row, translate, enableMultiTxDetail),
      ...buildTransactionOutcomeItems(row, translate, enableMultiTxDetail),
      buildSignerDetailItem(row, translate),
      buildCollectionNumberItem(row, translate),
    ],
    row,
    translate,
  );
}

function buildInboundDetailItemsThroughHash(
  row: TransactionRecordRow,
  translate: (key: string) => string,
  enableMultiTxDetail: boolean,
): DetailItemData[] {
  return [
    ...buildDetailCurrencyAmountItems(
      {
        amountRowValue: row.amount,
        amountCryptoSymbol: row.symbol,
        amountCryptoName: row.cryptoName,
        amountNetworkLabel: row.showNetwork ? row.networkLabel : '',
      },
      translate,
    ),
    {
      ...createDetailApplyItemRow('time', {
        key: 'transaction-time',
        title: translate('Transaction Time'),
        value: row.transactionTime,
      }),
      titleIcon: 'eds-calendar-end',
    },
    createDetailApplyItemRow('type', {
      key: 'transaction-type',
      title: translate('Transaction Type'),
      value: row.transactionType,
    }),
    buildProjectNameDetailItem(row, translate),
    {
      ...createDetailApplyItemRow('text', {
        key: 'wallet',
        title: translate('Affiliated Wallet'),
        value: row.walletName,
      }),
      titleIcon: 'eds-wallet',
    },
    createDetailApplyItemRow('sender', {
      key: 'payment-address',
      title: translate('Payment Address'),
      value: row.fromAddress,
      tag: resolveDetailAddressTag(row.fromAlias),
    }),
    buildReceivingAddressDetailItem(row, translate, enableMultiTxDetail),
    buildTransactionCountDetailItem(row, translate, enableMultiTxDetail),
    createDetailApplyItemRow('txid', {
      key: 'transaction-hash',
      title: translate('Transaction hash'),
      value: row.txHash,
    }),
  ];
}

/** 普通转入：无创建时间、矿工费、归集编号；备注置底。 */
function buildNormalInDetailItems(
  row: TransactionRecordRow,
  translate: (key: string) => string,
  enableMultiTxDetail: boolean,
): DetailItemData[] {
  return withTrailingRemark(
    buildInboundDetailItemsThroughHash(row, translate, enableMultiTxDetail),
    row,
    translate,
  );
}

/** 紧凑归集详情：无创建时间、矿工费；备注置底。 */
function buildCompactCollectionDetailItems(
  row: TransactionRecordRow,
  translate: (key: string) => string,
  enableMultiTxDetail: boolean,
): DetailItemData[] {
  return withTrailingRemark(
    [
      ...buildInboundDetailItemsThroughHash(row, translate, enableMultiTxDetail),
      buildCollectionNumberItem(row, translate),
    ],
    row,
    translate,
  );
}

function buildDefaultDetailItems(
  row: TransactionRecordRow,
  translate: (key: string) => string,
  enableMultiTxDetail: boolean,
): DetailItemData[] {
  return withTrailingRemark(
    [
      ...buildDetailItemsThroughReceivingAddress(row, translate, enableMultiTxDetail),
      ...buildTransactionOutcomeItems(row, translate, enableMultiTxDetail),
    ],
    row,
    translate,
  );
}

function resolveDetailItems(
  row: TransactionRecordRow,
  translate: (key: string) => string,
  enableMultiTxDetail: boolean,
): DetailItemData[] {
  if (isTransactionRecordTransferOutDetailType(row.transactionType)) {
    return buildTransferOutDetailItems(row, translate, enableMultiTxDetail);
  }

  if (isTransactionRecordExtendedCollectionOutDetailType(row.transactionType)) {
    return buildCollectionOutDetailItems(row, translate, enableMultiTxDetail);
  }

  if (isTransactionRecordCompactCollectionDetailType(row.transactionType)) {
    return buildCompactCollectionDetailItems(row, translate, enableMultiTxDetail);
  }

  if (row.transactionType === TRANSACTION_RECORD_DETAIL_NORMAL_IN) {
    return buildNormalInDetailItems(row, translate, enableMultiTxDetail);
  }

  if (row.transactionType === TRANSACTION_RECORD_DETAIL_ON_CHAIN_OPERATION) {
    return buildOnChainOperationDetailItems(row, translate, enableMultiTxDetail);
  }

  if (row.transactionType === TRANSACTION_RECORD_DETAIL_PARALLEL_OUT) {
    return buildParallelOutDetailItems(row, translate, enableMultiTxDetail);
  }

  return buildDefaultDetailItems(row, translate, enableMultiTxDetail);
}

export function buildTransactionRecordDetailSections(
  row: TransactionRecordRow,
  translate: (key: string) => string,
  options: BuildTransactionRecordDetailSectionsOptions = {},
): DetailSectionData[] {
  const enableMultiTxDetail = options.enableMultiTxDetail ?? true;
  return [
    {
      key: 'transaction',
      items: resolveDetailItems(row, translate, enableMultiTxDetail),
    },
  ];
}
