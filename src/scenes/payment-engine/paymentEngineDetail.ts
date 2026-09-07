import {
  createDetailApplyItemRow,
  type DetailItemData,
  type DetailSectionData,
  type TagStatus,
} from '@eds/desktop-components';
import { resolveCryptoNameFromSymbol } from '@/scenes/tasks/list-field/listFieldCryptoResolve';
import type { OrderRecordRow, OrderStatus, SettlementRecordRow } from './paymentEngineData';

function statusRow(title: string, tag: string, tagStatus?: TagStatus): DetailItemData {
  const row = createDetailApplyItemRow('status', { title, tag });
  return tagStatus ? { ...row, tagStatus } : row;
}

const DETAIL_TIME = '2031-12-23 10:23:00';
const DETAIL_ORDER_ID = 'Number_20311020_82420678';
const DETAIL_MERCHANT_ID = 'Coinbase_order_800389028';
const DETAIL_HASH = '60bfe69ce24d82dd7795722130666a4cfa34f1308120cfffdcb2a70bf295ba39';
const DETAIL_SENDER = '3MqUP6G1daVS5YTD8fz3QgwjZortWwxXFd';
const DETAIL_RECEIVER = 'bc1qsmu69g72d7rdzwv7y7va0rd7cunen7tcer3tn8';

export function orderHeadlineStatus(status: OrderStatus): TagStatus {
  if (status === 'Overpaid') return 'danger';
  if (status === 'Underpaid' || status === 'New') return status === 'New' ? 'success' : 'warning';
  if (status === 'Expired' || status === 'Canceled') return 'invalid';
  return 'success';
}

function paymentBlockItems(ui: (key: string) => string): DetailItemData[] {
  return [
    createDetailApplyItemRow('brand-number', {
      title: ui('First Payment ID'),
      value: DETAIL_ORDER_ID,
    }),
    createDetailApplyItemRow('amount', {
      title: ui('Amount'),
      value: '0.02256 USDC',
      tag: 'Bitcoin',
    }),
    createDetailApplyItemRow('crypto', {
      title: ui('Order Currency'),
      value: 'USDC',
      tag: 'Bitcoin',
      valueSymbolCrypto: 'eds-usdc-usdcoin',
    }),
    createDetailApplyItemRow('txid', {
      title: ui('First Payment Hash'),
      value: DETAIL_HASH,
    }),
    createDetailApplyItemRow('time', {
      title: ui('First Payment Time'),
      value: DETAIL_TIME,
    }),
    createDetailApplyItemRow('sender', {
      title: ui('Sender'),
      value: DETAIL_SENDER,
    }),
    createDetailApplyItemRow('receiver', {
      title: ui('Receiver'),
      value: DETAIL_RECEIVER,
      tag: 'EverGreen',
    }),
  ];
}

/** Paid · Payment Information — Figma 1751:25482; 补款字段与首次付款相同。 */
function paidPaymentBlockItems(ui: (key: string) => string): DetailItemData[] {
  return [
    createDetailApplyItemRow('brand-number', {
      title: ui('Payment ID'),
      value: DETAIL_ORDER_ID,
    }),
    createDetailApplyItemRow('text', {
      title: ui('Payment Wallet'),
      value: 'MetaMask',
    }),
    createDetailApplyItemRow('amount', {
      title: ui('Payment Amount'),
      value: '0.02256 USDC',
      tag: 'Bitcoin',
    }),
    createDetailApplyItemRow('time', {
      title: ui('Creation Time'),
      value: DETAIL_TIME,
    }),
    createDetailApplyItemRow('sender', {
      title: ui('Sender'),
      value: DETAIL_SENDER,
      tag: '',
    }),
    createDetailApplyItemRow('receiver', {
      title: ui('Receiver'),
      value: DETAIL_RECEIVER,
      tag: 'Mr. Wang',
    }),
    createDetailApplyItemRow('txid', {
      title: ui('TxID'),
      value: DETAIL_HASH,
    }),
  ];
}

function showAdditionalPayment(row: OrderRecordRow): boolean {
  return row.status === 'Paid' || row.detailVariant === 'topup';
}

function showRefundTab(row: OrderRecordRow): boolean {
  return row.status === 'Canceled' || row.detailVariant === 'refund';
}

function showSettlementDetailTab(row: OrderRecordRow): boolean {
  return row.status === 'Paid';
}

function orderDetailItems(ui: (key: string) => string): DetailItemData[] {
  return [
    createDetailApplyItemRow('crypto', {
      title: ui('Order Currency'),
      value: 'BTC',
      tag: 'Lightning',
      valueSymbolCrypto: 'eds-btc-bitcoin',
    }),
    createDetailApplyItemRow('brand-number', {
      title: ui('Order ID'),
      value: DETAIL_ORDER_ID,
    }),
    createDetailApplyItemRow('tripartite-number', {
      title: ui('Merchant Order ID'),
      value: DETAIL_MERCHANT_ID,
    }),
    createDetailApplyItemRow('text', {
      title: ui('Exchange Rate'),
      value: '1 USDT - 1 USD',
    }),
    createDetailApplyItemRow('amount', {
      title: ui('Order Amount in Receiving Currency'),
      value: '0.02256 USDC',
      tag: 'Bitcoin',
    }),
    createDetailApplyItemRow('amount', {
      title: ui('Actual Received Amount'),
      value: '0.02256 USDC',
      tag: 'Bitcoin',
    }),
    createDetailApplyItemRow('time', {
      title: ui('Creation Time'),
      value: DETAIL_TIME,
    }),
  ];
}

function refundItems(ui: (key: string) => string): DetailItemData[] {
  return [
    createDetailApplyItemRow('brand-number', {
      title: ui('Refund ID'),
      value: DETAIL_ORDER_ID,
    }),
    statusRow(ui('Status'), ui('Refund in progress'), 'warning'),
    createDetailApplyItemRow('type', {
      title: ui('Refund Type'),
      value: ui('Partial refund'),
    }),
    createDetailApplyItemRow('brand-number', {
      title: ui('Payer ID'),
      value: '9527',
    }),
    createDetailApplyItemRow('time', {
      title: ui('Creation Time'),
      value: DETAIL_TIME,
    }),
    createDetailApplyItemRow('time', {
      title: ui('Refund Time'),
      value: DETAIL_TIME,
    }),
    createDetailApplyItemRow('sender', {
      title: ui('Sender'),
      value: DETAIL_SENDER,
    }),
    createDetailApplyItemRow('receiver', {
      title: ui('Receiver'),
      value: DETAIL_RECEIVER,
      tag: 'EverGreen',
    }),
    createDetailApplyItemRow('amount', {
      title: ui('Refund Amount'),
      value: '0.02256 USDC',
      tag: 'Bitcoin',
    }),
    createDetailApplyItemRow('fee', {
      title: ui('Refund Fee'),
      value: '0.0006 USDC',
    }),
    createDetailApplyItemRow('amount', {
      title: ui('Actual Refund Amount'),
      value: '0.02256 USDC',
      tag: 'Bitcoin',
    }),
  ];
}

function orderSettlementItems(ui: (key: string) => string): DetailItemData[] {
  return [
    createDetailApplyItemRow('brand-number', {
      title: ui('Settlement Number'),
      value: DETAIL_ORDER_ID,
    }),
    statusRow(ui('Status'), ui('Settled'), 'success'),
    createDetailApplyItemRow('crypto', {
      title: ui('Token'),
      value: 'USDC',
      tag: 'Bitcoin',
      valueSymbolCrypto: 'eds-usdc-usdcoin',
    }),
    createDetailApplyItemRow('amount', {
      title: ui('Actual Received Amount'),
      value: '0.02256 USDC',
      tag: 'Bitcoin',
    }),
    createDetailApplyItemRow('amount', {
      title: ui('Total Settled Amount'),
      value: '0.02256 USDC',
      tag: 'Bitcoin',
    }),
    createDetailApplyItemRow('time', {
      title: ui('Creation Time'),
      value: DETAIL_TIME,
    }),
  ];
}

/** Paid · Settlement Detail — Figma 1751:25561 */
function paidSettlementDetailItems(ui: (key: string) => string): DetailItemData[] {
  return [
    createDetailApplyItemRow('brand-number', {
      title: ui('Settlement ID'),
      value: DETAIL_ORDER_ID,
    }),
    statusRow(ui('Settlement Status'), ui('Refund in progress'), 'warning'),
    {
      ...createDetailApplyItemRow('sender', {
        title: ui('Settlement Address'),
        value: DETAIL_SENDER,
        tag: '',
      }),
      titleIcon: 'eds-blockchain-address',
    },
    createDetailApplyItemRow('time', {
      title: ui('Settlement Creation Time'),
      value: DETAIL_TIME,
    }),
    createDetailApplyItemRow('amount', {
      title: ui('Order Settled Amount'),
      value: '0.02256 USDC',
      tag: 'Bitcoin',
    }),
    createDetailApplyItemRow('fee', {
      title: ui('Order Transaction Fee'),
      value: '0.0006 USDC',
    }),
  ];
}

export function orderTabLabels(row: OrderRecordRow, ui: (key: string) => string): string[] {
  const labels = [ui('Order Detail'), ui('Payment Information')];
  if (showRefundTab(row)) {
    labels.push(ui('Refund Information'));
  } else if (showSettlementDetailTab(row)) {
    labels.push(ui('Settlement Detail'));
  } else if (row.detailVariant === 'settlement') {
    labels.push(ui('Settlement Information'));
  }
  return labels;
}

export function orderDetailSections(
  row: OrderRecordRow,
  tabIndex: number,
  ui: (key: string) => string,
): DetailSectionData[] {
  if (tabIndex === 0) {
    return [{ items: orderDetailItems(ui) }];
  }
  if (tabIndex === 1) {
    if (showAdditionalPayment(row)) {
      const items = row.status === 'Paid' ? paidPaymentBlockItems(ui) : paymentBlockItems(ui);
      return [
        { title: ui('First Payment'), items, showDivider: true },
        { title: ui('Additional Payment'), items },
      ];
    }
    return [{ title: ui('First Payment'), items: paymentBlockItems(ui) }];
  }
  if (showRefundTab(row)) {
    return [{ items: refundItems(ui) }];
  }
  if (showSettlementDetailTab(row)) {
    return [{ items: paidSettlementDetailItems(ui) }];
  }
  return [{ items: orderSettlementItems(ui) }];
}

function settlingSettlementItems(
  row: SettlementRecordRow,
  ui: (key: string) => string,
): DetailItemData[] {
  return [
    createDetailApplyItemRow('crypto', {
      title: ui('Token'),
      value: row.token,
      tag: row.networkTag,
      valueSymbolCrypto: resolveCryptoNameFromSymbol(row.token) ?? 'eds-usdc-usdcoin',
    }),
    createDetailApplyItemRow('text', {
      title: ui('Address'),
      value: row.address,
    }),
    statusRow(ui('Status'), ui(row.status), 'warning'),
    createDetailApplyItemRow('time', {
      title: ui('Creation Time'),
      value: row.createdAt.replace(/ {2}/g, ' '),
    }),
    createDetailApplyItemRow('brand-number', {
      title: ui('Settlement Number'),
      value: row.settlementNumber,
    }),
    createDetailApplyItemRow('amount', {
      title: ui('Actual Received Amount'),
      value: `${row.receivedAmount} ${row.receivedSymbol}`,
    }),
    createDetailApplyItemRow('amount', {
      title: ui('Total Settled Amount'),
      value: row.settledAmount,
    }),
    createDetailApplyItemRow('fee', {
      title: ui('Total Transaction Fee'),
      value: '0.0699 HYPE',
    }),
  ];
}

/** Settlement Record · Settled — Figma 2671:14778 */
function settledSettlementItems(ui: (key: string) => string): DetailItemData[] {
  return [
    createDetailApplyItemRow('brand-number', {
      title: ui('Settlement Number'),
      value: DETAIL_ORDER_ID,
    }),
    createDetailApplyItemRow('crypto', {
      title: ui('Settlement Currency'),
      value: 'BTC',
      tag: 'Bitcoin Lightning',
      valueSymbolCrypto: 'eds-btc-bitcoin',
    }),
    {
      ...createDetailApplyItemRow('text', {
        title: ui('Total Order Settlement Count'),
        value: '2,567',
      }),
      titleIcon: 'eds-text-numerical',
    },
    createDetailApplyItemRow('amount', {
      title: ui('Total Received Amount'),
      value: '0.02256 BTC',
      tag: 'Bitcoin Lightning',
    }),
    createDetailApplyItemRow('amount', {
      title: ui('Total Fee'),
      value: '0.02256 BTC',
      tag: '',
    }),
    {
      ...createDetailApplyItemRow('sender', {
        title: ui('Settlement Address'),
        value: DETAIL_SENDER,
        tag: '',
      }),
      titleIcon: 'eds-blockchain-address',
    },
    createDetailApplyItemRow('time', {
      title: ui('Settlement Time'),
      value: DETAIL_TIME,
    }),
    createDetailApplyItemRow('txid', {
      title: ui('TxID'),
      value: DETAIL_HASH,
    }),
  ];
}

export function settlementDetailSections(
  row: SettlementRecordRow,
  ui: (key: string) => string,
): DetailSectionData[] {
  if (row.status === 'Settled') {
    return [{ items: settledSettlementItems(ui) }];
  }
  return [{ items: settlingSettlementItems(row, ui) }];
}

export function orderHeadline(row: OrderRecordRow): string {
  return '$1,085,620.37';
}

export function settlementHeadline(row: SettlementRecordRow): string {
  if (row.status === 'Settled') return '1,085,620.37 BTC';
  return `${row.receivedAmount} ${row.receivedSymbol}`;
}
