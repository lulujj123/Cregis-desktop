import {
  formatGroupedAmountText,
  formatGroupedNumber,
} from '@/utils/formatGroupedDisplay';
import {
  isTransactionRecordCollectionDetailType,
  isTransactionRecordTransferOutDetailType,
  TRANSACTION_RECORD_DETAIL_ON_CHAIN_OPERATION,
  TRANSACTION_RECORD_DETAIL_PARALLEL_OUT,
} from './transactionRecordDetailTypes';
import type { CryptoAddressFamily } from '@/scenes/tasks/list-field/listFieldCryptoSampleAddresses';
import { resolveSampleAddressForSymbol, resolveVerifiedTxHashForRow } from '@/scenes/tasks/list-field/listFieldCryptoSampleAddresses';
import {
  resolveCurrencyRowPreset,
  resolveDemoAmountRowValues,
} from '@/scenes/shared/egDataListMockData';
import type { CurrencyRowPreset } from '@/scenes/tasks/list-field/tasksListFieldCurrencyRowPresets';
import type { TransactionRecordDirection, TransactionRecordRow } from './transactionRecordTypes';

/** 交易记录演示数据条数（与 EgDataList 首屏可见行数一致，避免空白占位行）。 */
export const TRANSACTION_RECORDS_DEMO_TOTAL = 28;

/** 演示交易类型全集；前 N 行按序展示，其余行按 index 伪随机（刷新稳定）。 */
const TRANSACTION_TYPES = [
  '钱包人工转出',
  'API申请转出',
  '归集转出',
  '归集转入',
  '矿工费（归集）转出',
  '矿工费（归集）转入',
  '普通转入',
  '链上操作',
  '矿工费代付',
  '并行转出',
] as const;

/** 演示业务类型全集；前 N 行按序展示，其余行按 index 伪随机（刷新稳定）。 */
const BUSINESS_TYPES = [
  '普通交易',
  '内部转账',
  '取消交易',
  '交易加速',
  '归集',
  'WaaS提币',
  'WaaS充值',
  '团队账户充值',
  '矿工费充值',
  '矿工费代付',
  '矿工费支出',
  '商户结算',
  '商户转账',
  'EIP-7702升级',
  '合约授权',
  '撤销授权',
] as const;

/**
 * View by Wallet 演示：并行转出 + APT + 5 笔（列表收件地址旁 (5)，详情可「查看明细」）。
 * TxHash 固定为 EVM 演示哈希；0-based rowIndex 2/3 → 第 3、4 行（tx-3 / tx-4）。
 */
export const TRANSACTION_RECORD_PARALLEL_OUT_DEMO_ROW_INDICES = [2, 3] as const;

/** 首个 APT 演示行（详情 flow 入口）。 */
export const TRANSACTION_RECORD_PARALLEL_OUT_DEMO_ROW_INDEX =
  TRANSACTION_RECORD_PARALLEL_OUT_DEMO_ROW_INDICES[0];

export function isTransactionRecordParallelOutDemoRow(index: number): boolean {
  return (TRANSACTION_RECORD_PARALLEL_OUT_DEMO_ROW_INDICES as readonly number[]).includes(
    index,
  );
}

/** 笔数明细页展示的 5 种交易类型（汇总页仍为「并行转出」）。 */
export const TRANSACTION_RECORD_PARALLEL_OUT_DEMO_LINE_COUNT = 5;

const SECONDARY_WALLET_NAMES = [
  'Main Vault',
  'Operations',
  'Compliance',
] as const;

const FROM_ALIASES = ['laocl', 'ops', 'treasury', 'vault'] as const;

const PROJECT_NAMES = [
  'Checkout Pro',
  'WaaS Gateway',
  'Settlement Hub',
  'Merchant Pay',
] as const;

/** 演示数据内可查看的团队钱包（与所属钱包列取值一致）。 */
export const TRANSACTION_RECORDS_DEMO_WALLET_NAMES = [
  'test_single_1',
  ...SECONDARY_WALLET_NAMES,
] as const;

function formatDemoAmount(index: number): string {
  return resolveDemoAmountRowValues(index).cryptoValue;
}

function formatDemoFiat(index: number): string {
  return resolveDemoAmountRowValues(index).fiatValue;
}

function resolveTransactionType(index: number): string {
  if (isTransactionRecordParallelOutDemoRow(index)) {
    return TRANSACTION_RECORD_DETAIL_PARALLEL_OUT;
  }
  if (index < TRANSACTION_TYPES.length) {
    return TRANSACTION_TYPES[index]!;
  }
  const seed = (index + 1) * 7919;
  return TRANSACTION_TYPES[seed % TRANSACTION_TYPES.length]!;
}

function resolveBusinessType(index: number): string {
  if (index < BUSINESS_TYPES.length) {
    return BUSINESS_TYPES[index]!;
  }
  const seed = (index + 1) * 8081;
  return BUSINESS_TYPES[seed % BUSINESS_TYPES.length]!;
}

function resolveTransactionDirection(transactionType: string): TransactionRecordDirection {
  if (transactionType.includes('转入')) {
    return 'in';
  }
  return 'out';
}

function formatTransactionDirectionLabel(direction: TransactionRecordDirection): string {
  // 收支类型列：简中／繁中均为「收入」「支出」（非「转入／转出」）。
  return direction === 'in' ? '收入' : '支出';
}

/**
 * View by Address：收支类型以已选搜索地址为视角。
 * - 选中地址为收款方 → 收入
 * - 选中地址为付款方 → 支出
 * 未传视角地址时沿用行上的 directionLabel（按交易类型）。
 */
export function resolveDirectionLabelForPerspectiveAddress(
  row: TransactionRecordRow,
  perspectiveAddress?: string,
): string {
  const selected = perspectiveAddress?.trim().toLowerCase() ?? '';
  if (!selected) {
    return row.directionLabel;
  }

  const fromMatch = row.fromAddress.toLowerCase() === selected;
  const toMatch = row.toAddress.toLowerCase() === selected;
  if (toMatch && !fromMatch) {
    return '收入';
  }
  if (fromMatch && !toMatch) {
    return '支出';
  }
  return row.directionLabel;
}

function formatDemoTimestamp(offsetMs: number): string {
  const baseMs = Date.parse('2026-09-15T20:45:06');
  const date = new Date(baseMs - offsetMs);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function resolveTransactionTimeOffset(index: number): number {
  return index * 37 * 60 * 1000 + (index % 17) * 1000;
}

function formatTransactionTime(index: number): string {
  return formatDemoTimestamp(resolveTransactionTimeOffset(index));
}

function formatCreatedTime(index: number): string {
  return formatDemoTimestamp(resolveTransactionTimeOffset(index) + 12 * 60 * 1000);
}

const MINER_FEE_AMOUNTS = ['0.00266', '0.0002198', '0.000812'] as const;

function resolveMinerFeeDisplay(index: number, symbol: string): string {
  if (isTransactionRecordParallelOutDemoRow(index)) {
    return formatGroupedAmountText(`0.082 ${symbol}`);
  }
  const amount = MINER_FEE_AMOUNTS[index % MINER_FEE_AMOUNTS.length] ?? MINER_FEE_AMOUNTS[0];
  return formatGroupedAmountText(`${amount} ${symbol} ≈ $1.87`);
}

function resolveMinerFeeCategory(index: number): 'sponsored' | 'native' {
  return index % 2 === 0 ? 'sponsored' : 'native';
}

const MINER_FEE_TOKENS = ['TRX', 'ETH', 'BTC', 'BNB'] as const;

function resolveMinerFeeToken(index: number, symbol: string): string {
  const category = resolveMinerFeeCategory(index);
  if (category === 'native') {
    return MINER_FEE_TOKENS[index % MINER_FEE_TOKENS.length] ?? 'ETH';
  }
  // 代付：演示用与交易币种或稳定币
  return index % 3 === 0 ? symbol : 'USDT';
}

const TRANSACTION_RECORD_PARALLEL_OUT_APT_PRESET: CurrencyRowPreset = {
  symbol: 'APT',
  cryptoName: 'eds-apt-aptos',
  showNetwork: false,
  addressFamily: 'evm',
};

function resolveTransactionRecordCurrencyPreset(index: number): CurrencyRowPreset {
  if (isTransactionRecordParallelOutDemoRow(index)) {
    return TRANSACTION_RECORD_PARALLEL_OUT_APT_PRESET;
  }
  return resolveCurrencyRowPreset(index);
}

function resolveTransactionCount(transactionType: string, symbol: string): string {
  if (
    isTransactionRecordCollectionDetailType(transactionType)
    || transactionType === TRANSACTION_RECORD_DETAIL_ON_CHAIN_OPERATION
  ) {
    return formatGroupedNumber(3);
  }
  if (transactionType === TRANSACTION_RECORD_DETAIL_PARALLEL_OUT) {
    if (symbol === 'APT') {
      return formatGroupedNumber(TRANSACTION_RECORD_PARALLEL_OUT_DEMO_LINE_COUNT);
    }
    if (symbol === 'BTC') return formatGroupedNumber(8);
    return formatGroupedNumber(5);
  }
  return formatGroupedNumber(1);
}

/** 解析交易笔数；无效时回落 1。 */
export function parseTransactionRecordCount(row: Pick<TransactionRecordRow, 'transactionCount'>): number {
  const parsed = Number(String(row.transactionCount).replace(/,/g, ''));
  if (Number.isFinite(parsed) && parsed > 0) {
    return Math.floor(parsed);
  }
  return 1;
}

/** View by Wallet 且笔数 > 1 时：列表 (x) + 详情「查看明细」。 */
export function transactionRecordShowsMultiTxDetail(
  row: Pick<TransactionRecordRow, 'transactionCount' | 'transactionCountShowsDetailLink'>,
): boolean {
  return Boolean(row.transactionCountShowsDetailLink) && parseTransactionRecordCount(row) > 1;
}

const INITIATOR_DISPLAYS = [
  'Treasury (t******y@cregis.com)',
  'Name (t******c@gmail.com)',
  'Ops Team (o******s@cregis.com)',
] as const;

const SIGNER_DISPLAYS = ['Ethan Davis', 'Jordan Lee', 'Taylor Reed'] as const;

function resolveInitiatorDisplay(index: number): string {
  return INITIATOR_DISPLAYS[index % INITIATOR_DISPLAYS.length]!;
}

function resolveSignerDisplay(index: number): string {
  return SIGNER_DISPLAYS[index % SIGNER_DISPLAYS.length]!;
}

function resolveCollectionNumber(index: number): string {
  const day = 20260915 + (index % 7);
  const serial = String(100001 + index).padStart(6, '0');
  return `COL-${day}-${serial}`;
}

function resolveThirdPartyRef(index: number): string {
  return `Coinbase_order_${800389028 + index}`;
}

const MANUAL_WALLET_REMARKS = [
  'Payroll batch payout',
  'Vendor settlement',
  '',
] as const;

function resolveManualWalletRemark(index: number): string {
  return MANUAL_WALLET_REMARKS[index % MANUAL_WALLET_REMARKS.length] ?? '';
}

function resolveWalletName(index: number): string {
  if (isTransactionRecordParallelOutDemoRow(index)) {
    return '主用钱包';
  }
  if (index % 4 !== 3) {
    return TRANSACTION_RECORDS_DEMO_WALLET_NAMES[0];
  }
  return SECONDARY_WALLET_NAMES[index % SECONDARY_WALLET_NAMES.length]!;
}

function resolveFromAlias(index: number): string {
  return FROM_ALIASES[index % FROM_ALIASES.length]!;
}

/** 并行转出 APT 演示行固定 TxHash（与产品稿一致）。 */
const TRANSACTION_RECORD_PARALLEL_OUT_DEMO_TX_HASH =
  '0x88df016429684c080b592563784f0f7d8f93424e9a53675635306611782962';

function resolveTransactionHash(index: number, addressFamily?: CryptoAddressFamily): string {
  if (isTransactionRecordParallelOutDemoRow(index)) {
    return TRANSACTION_RECORD_PARALLEL_OUT_DEMO_TX_HASH;
  }
  return resolveVerifiedTxHashForRow(index, addressFamily ?? 'evm');
}

export function buildTransactionRecordRow(index: number): TransactionRecordRow {
  const transactionType = resolveTransactionType(index);
  const direction = resolveTransactionDirection(transactionType);
  const preset = resolveTransactionRecordCurrencyPreset(index);
  const fromAddress = resolveSampleAddressForSymbol(
    preset.symbol,
    index * 2 + 1,
    preset.addressFamily,
  );
  const toAddress = resolveSampleAddressForSymbol(
    preset.symbol,
    index * 2 + 2,
    preset.addressFamily,
  );

  const detailFields =
    isTransactionRecordTransferOutDetailType(transactionType)
      ? {
          thirdPartyRef: resolveThirdPartyRef(index),
          initiatorDisplay: resolveInitiatorDisplay(index),
          signerDisplay: resolveSignerDisplay(index),
        }
      : transactionType === TRANSACTION_RECORD_DETAIL_ON_CHAIN_OPERATION
        ? {
            signerDisplay: resolveSignerDisplay(index),
            collectionNumber: resolveCollectionNumber(index),
          }
        : transactionType === TRANSACTION_RECORD_DETAIL_PARALLEL_OUT
          ? {
              signerDisplay: resolveSignerDisplay(index),
            }
          : isTransactionRecordCollectionDetailType(transactionType)
          ? {
              collectionNumber: resolveCollectionNumber(index),
            }
          : {};

  const transactionCount = resolveTransactionCount(transactionType, preset.symbol);
  const isParallelOutDemo = isTransactionRecordParallelOutDemoRow(index);
  const amount = isParallelOutDemo ? '0.5' : formatDemoAmount(index);
  const fiatAmount = isParallelOutDemo ? '$0.12' : formatDemoFiat(index);

  return {
    id: `tx-${index + 1}`,
    createdTime: formatCreatedTime(index),
    transactionTime: formatTransactionTime(index),
    symbol: preset.symbol,
    cryptoName: preset.cryptoName,
    showNetwork: preset.showNetwork,
    networkLabel: preset.networkLabel ?? '',
    fromAlias: resolveFromAlias(index),
    fromAddress,
    toAddress,
    txHash: resolveTransactionHash(index, preset.addressFamily),
    walletName: resolveWalletName(index),
    projectName: PROJECT_NAMES[index % PROJECT_NAMES.length],
    transactionType,
    businessType: resolveBusinessType(index),
    directionLabel: formatTransactionDirectionLabel(direction),
    transactionCount,
    transactionCountShowsDetailLink:
      transactionType === TRANSACTION_RECORD_DETAIL_PARALLEL_OUT
      && Number(String(transactionCount).replace(/,/g, '')) > 1,
    minerFeeDisplay: resolveMinerFeeDisplay(index, preset.symbol),
    minerFeeCategory: isParallelOutDemo ? 'native' : resolveMinerFeeCategory(index),
    minerFeeToken: isParallelOutDemo ? preset.symbol : resolveMinerFeeToken(index, preset.symbol),
    ...detailFields,
    remark: resolveManualWalletRemark(index),
    amount,
    fiatAmount,
  };
}

export function buildTransactionRecordPageRows(
  indices: readonly number[],
): TransactionRecordRow[] {
  return indices.map((index) => buildTransactionRecordRow(index));
}
