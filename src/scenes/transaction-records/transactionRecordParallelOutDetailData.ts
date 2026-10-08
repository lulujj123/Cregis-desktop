import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';
import { resolveSampleAddressForSymbol } from '@/scenes/tasks/list-field/listFieldCryptoSampleAddresses';
import {
  isTransactionRecordParallelOutDemoRow,
  parseTransactionRecordCount,
} from './transactionRecordData';
import type { TransactionRecordRow } from './transactionRecordTypes';
import type { TransactionRecordParallelOutDetailLine } from './transactionRecordParallelOutDetailTypes';

const PARALLEL_OUT_LINE_AMOUNT_VALUES = [
  0.0125,
  0.018,
  0.021,
  0.0095,
  0.033,
  0.0155,
  0.027,
  0.011,
] as const;

/**
 * 笔数明细页「交易类型」演示序列（汇总页仍为「并行转出」）。
 * 与产品稿：普通交易 / 内部转账 / 取消交易 / 交易加速 / 归集。
 */
const PARALLEL_OUT_LINE_TRANSACTION_TYPES = [
  '普通交易',
  '内部转账',
  '取消交易',
  '交易加速',
  '归集',
] as const;

/** APT 并行转出演示：5 笔明细金额。 */
const PARALLEL_OUT_APT_DEMO_LINE_AMOUNTS = [0.2, 0.3, 0.0125, 0.018, 0.021] as const;

const PARALLEL_OUT_LINE_FIAT_VALUES = [
  892.4,
  1284.6,
  1498.2,
  678.9,
  2356.1,
  1107.3,
  1928.5,
  785.2,
] as const;

function resolveParallelOutLineCount(parent: TransactionRecordRow): number {
  return parseTransactionRecordCount(parent);
}

function formatParallelOutLineFiat(value: number): string {
  return `HK$ ${formatGroupedDecimalAmount(String(value))}`;
}

function resolveParallelOutLineAmount(
  parent: TransactionRecordRow,
  lineIndex: number,
): number {
  const baseIndex = Number.parseInt(parent.id.replace(/^tx-/, ''), 10) - 1;
  if (isTransactionRecordParallelOutDemoRow(baseIndex)) {
    return (
      PARALLEL_OUT_APT_DEMO_LINE_AMOUNTS[
        lineIndex % PARALLEL_OUT_APT_DEMO_LINE_AMOUNTS.length
      ] ?? 0.2
    );
  }
  return (
    PARALLEL_OUT_LINE_AMOUNT_VALUES[lineIndex % PARALLEL_OUT_LINE_AMOUNT_VALUES.length] ?? 0.01
  );
}

/** 明细行交易类型：按笔序号轮换；汇总页保持「并行转出」。 */
function resolveParallelOutLineTransactionType(
  parent: TransactionRecordRow,
  lineIndex: number,
): string {
  const baseIndex = Number.parseInt(parent.id.replace(/^tx-/, ''), 10) - 1;
  if (
    isTransactionRecordParallelOutDemoRow(baseIndex)
    || parent.transactionCountShowsDetailLink
  ) {
    return (
      PARALLEL_OUT_LINE_TRANSACTION_TYPES[
        lineIndex % PARALLEL_OUT_LINE_TRANSACTION_TYPES.length
      ] ?? PARALLEL_OUT_LINE_TRANSACTION_TYPES[0]
    );
  }
  return parent.transactionType;
}

export function buildParallelOutDetailLines(
  parent: TransactionRecordRow,
): TransactionRecordParallelOutDetailLine[] {
  const lineCount = resolveParallelOutLineCount(parent);
  const baseIndex = Number.parseInt(parent.id.replace(/^tx-/, ''), 10) - 1;
  const safeBaseIndex = Number.isFinite(baseIndex) && baseIndex >= 0 ? baseIndex : 0;
  const addressFamily =
    parent.symbol === 'BTC'
      ? 'btc'
      : parent.symbol === 'DOGE'
        ? 'doge'
        : parent.symbol === 'APT'
          ? 'evm'
          : undefined;

  return Array.from({ length: lineCount }, (_, lineIndex) => {
    const amountValue = resolveParallelOutLineAmount(parent, lineIndex);
    const fiatValue =
      PARALLEL_OUT_LINE_FIAT_VALUES[lineIndex % PARALLEL_OUT_LINE_FIAT_VALUES.length] ?? 100;

    const fromAddress = resolveSampleAddressForSymbol(
      parent.symbol,
      safeBaseIndex * 16 + lineIndex * 2 + 1,
      addressFamily,
    );
    const toAddress = resolveSampleAddressForSymbol(
      parent.symbol,
      safeBaseIndex * 16 + lineIndex * 2 + 2,
      addressFamily,
    );

    return {
      id: `${parent.id}-line-${lineIndex + 1}`,
      lineIndex,
      amount: formatGroupedDecimalAmount(String(amountValue)),
      fiatAmount: formatParallelOutLineFiat(fiatValue),
      symbol: parent.symbol,
      cryptoName: parent.cryptoName,
      showNetwork: parent.showNetwork,
      networkLabel: parent.networkLabel,
      transactionType: resolveParallelOutLineTransactionType(parent, lineIndex),
      fromAlias: parent.fromAlias,
      fromAddress,
      toAddress,
    };
  });
}

/** 汇总详情「接收地址」多行：取并行明细各笔收款地址。 */
export function resolveParallelOutReceivingAddresses(
  parent: TransactionRecordRow,
): string[] {
  return buildParallelOutDetailLines(parent).map((line) => line.toAddress);
}
