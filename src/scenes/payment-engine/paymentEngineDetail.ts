import {
  createDetailApplyItemRow,
  type DetailItemData,
  type DetailSectionData,
  type TagStatus,
} from '@eds/desktop-components';
import { resolveCryptoNameFromSymbol } from '@/scenes/tasks/list-field/listFieldCryptoResolve';
import type { OrderDetailVariant, OrderRecordRow, OrderStatus, SettlementRecordRow } from './paymentEngineData';

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
  if (status === 'Expired' || status === 'Cancelled') return 'invalid';
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

export function orderTabLabels(variant: OrderDetailVariant, ui: (key: string) => string): string[] {
  if (variant === 'refund') {
    return [ui('Order Detail'), ui('Payment Information'), ui('Refund Information')];
  }
  if (variant === 'settlement') {
    return [ui('Order Detail'), ui('Payment Information'), ui('Settlement Information')];
  }
  return [ui('Order Detail'), ui('Payment Information')];
}

export function orderDetailSections(
  variant: OrderDetailVariant,
  tabIndex: number,
  ui: (key: string) => string,
): DetailSectionData[] {
  if (tabIndex === 0) {
    return [{ items: orderDetailItems(ui) }];
  }
  if (tabIndex === 1) {
    if (variant === 'topup') {
      return [
        { title: ui('First Payment'), items: paymentBlockItems(ui), showDivider: true },
        { title: ui('Additional Payment'), items: paymentBlockItems(ui) },
      ];
    }
    return [{ title: ui('First Payment'), items: paymentBlockItems(ui) }];
  }
  if (variant === 'refund') {
    return [{ items: refundItems(ui) }];
  }
  return [{ items: orderSettlementItems(ui) }];
}

export function settlementDetailSections(
  row: SettlementRecordRow,
  ui: (key: string) => string,
): DetailSectionData[] {
  return [
    {
      items: [
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
        statusRow(ui('Status'), ui(row.status), row.status === 'Settling' ? 'warning' : 'success'),
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
      ],
    },
  ];
}

export function orderHeadline(row: OrderRecordRow): string {
  return '$1,085,620.37';
}

export function settlementHeadline(row: SettlementRecordRow): string {
  return `${row.receivedAmount} ${row.receivedSymbol}`;
}
