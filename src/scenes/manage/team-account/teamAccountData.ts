import { formatGroupedDecimalAmount } from '@/utils/formatGroupedDisplay';

export type TxDir = 'in' | 'out';
export type TxField = 'hash' | 'time' | 'plan' | 'order' | 'operator' | 'provider' | 'card' | 'token';
export type StatementLang = 'English' | '简体中文' | '繁體中文';
export type StatementHeader = 'team' | 'kyb';

export type BalanceTx = {
  id: string;
  type: string;
  dir: TxDir;
  amount: string;
  time: string;
  operator?: string;
  txid?: string;
  plan?: string;
  orderNo?: string;
  provider?: string;
  card?: string;
  tokenSymbol?: string;
  tokenNetwork?: string;
};

export type MonthlyBill = {
  id: string;
  title: string;
  month: string;
  meta: string;
};

export type AlertMember = { id: string; name: string; email: string; disabled?: boolean };

export type StatementNote = { title: string; body: string };

export type StatementCopy = {
  docTitle: string;
  docKicker: string;
  client: string;
  teamName: string;
  teamId: string;
  period: string;
  billInfo: string;
  generated: string;
  timezone: string;
  currency: string;
  topup: string;
  spend: string;
  ending: string;
  details: string;
  colDate: string;
  colType: string;
  colIn: string;
  colOut: string;
  colBal: string;
  total: string;
  disclaimer: string;
  download: string;
  close: string;
  rights: string;
  pageOf: string;
  notes: StatementNote[];
};

export type StmtTypeMeta = {
  English: string;
  简体中文: string;
  繁體中文: string;
  kind: TxDir;
};

export type StmtLine = { d: string; type: string | null; inn: number | null; out: number | null };


export const OP_SAM = 'Sam (Sa*****@cregis.io)';
export const DEMO_TIME = '2031-12-23  10:23:00';
export const DEMO_HASH = '60bfe69ce24d82dd7795722130666a4cfa34f1308120cfffdcb2a70bf295ba39';
export const DEMO_ORDER = 'ORD-20311223-8821';
export const RECHARGE_ADDR = 'TCogAdKNMyU2P4HA4aiuj7ZqyZPzE2Hx2r';
export const RECHARGE_NETWORKS = ['USDT-TRC20#Shasta'] as const;
export const AVAILABLE_BALANCE = '$999,910,983.35';

export const TX_TYPES = [
  'Recharge',
  'System Recharge',
  'System Refund',
  'Team Subscription Upgrade',
  'Team Subscription Renewal',
  'Benefits Renewal',
  'Benefits Upgrade',
  'Automation Feature Activation',
  'Benefits Expansion',
  'Token Listing Application Fee',
  'Token Listing Rejection Refund',
  'Over-limit Service Fee',
  'Custom Solution',
  'Tron Activation Fee',
  'Tron Energy Fee',
  'Tron Bandwidth Fee',
  'AML Query',
  'Card Issuance Fee',
  'Card Transfer',
  'Card Replacement Fee',
];

export const TX_DETAIL_FIELDS: Record<string, TxField[]> = {
  Recharge: ['hash', 'time'],
  'System Recharge': ['time'],
  'System Refund': ['time'],
  'Team Subscription Upgrade': ['plan', 'order', 'operator', 'time'],
  'Team Subscription Renewal': ['plan', 'order', 'operator', 'time'],
  'Benefits Renewal': ['plan', 'order', 'operator', 'time'],
  'Benefits Upgrade': ['plan', 'order', 'operator', 'time'],
  'Automation Feature Activation': ['plan', 'order', 'operator', 'time'],
  'Benefits Expansion': ['plan', 'order', 'operator', 'time'],
  'Tron Activation Fee': ['order', 'hash', 'operator', 'time'],
  'Tron Energy Fee': ['order', 'hash', 'operator', 'time'],
  'Tron Bandwidth Fee': ['order', 'hash', 'operator', 'time'],
  'AML Query': ['plan', 'provider', 'order', 'operator', 'time'],
  'Card Issuance Fee': ['card', 'order', 'time'],
  'Card Transfer': ['card', 'order', 'time'],
  'Card Replacement Fee': ['card', 'order', 'time'],
  'Over-limit Service Fee': ['order', 'hash', 'operator', 'time'],
  'Token Listing Application Fee': ['token', 'order', 'operator', 'time'],
  'Token Listing Rejection Refund': ['token', 'order', 'time'],
  'Custom Solution': ['plan', 'order', 'time'],
};

const BALANCE_TX_SEED: BalanceTx[] = [
  { id: 't1', type: 'Recharge', dir: 'in', amount: '+$20,000.00', time: DEMO_TIME, operator: OP_SAM, txid: DEMO_HASH },
  { id: 't2', type: 'System Recharge', dir: 'in', amount: '+$20,000.00', time: DEMO_TIME, operator: 'System' },
  { id: 't2b', type: 'System Refund', dir: 'in', amount: '+$20,000.00', time: DEMO_TIME, operator: 'System' },
  { id: 't3', type: 'Team Subscription Upgrade', dir: 'out', amount: '-$20,000.00', time: DEMO_TIME, operator: OP_SAM, plan: 'Pro → Enterprise', orderNo: DEMO_ORDER },
  { id: 't4', type: 'Team Subscription Renewal', dir: 'out', amount: '-$1,299.00', time: '2027-07-01  00:00:00', operator: 'System', plan: 'Enterprise · Annual', orderNo: 'SUB-20270701' },
  { id: 't5', type: 'Benefits Renewal', dir: 'out', amount: '-$480.00', time: '2027-06-01  00:00:00', operator: 'System', plan: 'AML Pack · 12 months', orderNo: 'BNF-20270601' },
  { id: 't6', type: 'Benefits Upgrade', dir: 'out', amount: '-$2,400.00', time: '2027-05-18  09:11:02', operator: OP_SAM, plan: 'Standard → Premium', orderNo: 'BNF-20270518' },
  { id: 't7', type: 'Automation Feature Activation', dir: 'out', amount: '-$199.00', time: '2027-05-02  16:40:11', operator: OP_SAM, plan: 'Payment automation', orderNo: 'AUTO-20270502' },
  { id: 't8', type: 'Benefits Expansion', dir: 'out', amount: '-$800.00', time: '2027-04-21  08:01:11', operator: OP_SAM, plan: 'Member seats ×50', orderNo: 'EXP-20270421' },
  { id: 't9', type: 'Tron Activation Fee', dir: 'out', amount: '-$12.00', time: DEMO_TIME, operator: OP_SAM, orderNo: 'TRON-ACT-8821', txid: DEMO_HASH },
  { id: 't10', type: 'Tron Energy Fee', dir: 'out', amount: '-$8.50', time: '2027-04-10  11:22:00', operator: OP_SAM, orderNo: 'TRON-ENG-4410', txid: 'a91b22aa0091c8ef7795722130666a4c' },
  { id: 't11', type: 'Tron Bandwidth Fee', dir: 'out', amount: '-$3.20', time: '2027-04-09  10:08:17', operator: OP_SAM, orderNo: 'TRON-BW-4409', txid: 'c0de88f177acb12a009155bb1122aabb' },
  { id: 't12', type: 'AML Query', dir: 'out', amount: '-$12.00', time: '2027-06-14  11:40:18', operator: OP_SAM, plan: 'Manual query (address / tx hash)', provider: 'Chainalysis', orderNo: 'AML-889477D7' },
  { id: 't13', type: 'Card Issuance Fee', dir: 'out', amount: '-$20.00', time: DEMO_TIME, card: 'Visa ·•• 4421', orderNo: 'CARD-ISS-4421' },
  { id: 't14', type: 'Card Transfer', dir: 'out', amount: '-$5.00', time: '2027-03-12  14:22:05', card: 'Visa ·•• 4421', orderNo: 'CARD-TRF-4421' },
  { id: 't15', type: 'Card Replacement Fee', dir: 'out', amount: '-$15.00', time: '2027-03-01  09:15:02', card: 'Visa ·•• 8830', orderNo: 'CARD-REP-8830' },
  { id: 't16', type: 'Over-limit Service Fee', dir: 'out', amount: '-$20,000.00', time: DEMO_TIME, operator: OP_SAM, orderNo: 'FEE-146821903', txid: DEMO_HASH },
  { id: 't17', type: 'Token Listing Application Fee', dir: 'out', amount: '-$20,000.00', time: DEMO_TIME, operator: OP_SAM, orderNo: DEMO_ORDER, tokenSymbol: 'USDC', tokenNetwork: 'Bitcoin' },
  { id: 't18', type: 'Token Listing Rejection Refund', dir: 'in', amount: '+$20,000.00', time: DEMO_TIME, orderNo: DEMO_ORDER, tokenSymbol: 'USDC', tokenNetwork: 'Bitcoin' },
  { id: 't19', type: 'Custom Solution', dir: 'out', amount: '-$20,000.00', time: DEMO_TIME, plan: 'Pro → Enterprise', orderNo: 'CUS-20311223' },
];

const TX_DEMO_TOTAL = 56;
const TX_DEMO_AMOUNTS = [5, 8.5, 12, 15, 20, 199, 480, 800, 1299, 2400, 20000];

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function formatTxAmount(dir: TxDir, value: number): string {
  return `${dir === 'in' ? '+' : '-'}$${formatGroupedDecimalAmount(value.toFixed(2))}`;
}

function cloneDemoTx(base: BalanceTx, index: number): BalanceTx {
  const seq = BALANCE_TX_SEED.length + index + 1;
  const date = new Date(Date.UTC(2027, 1, 28));
  date.setUTCDate(date.getUTCDate() - (index + 1));
  const time = `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}  ${pad2(8 + (index % 10))}:${pad2((index * 7) % 60)}:${pad2((index * 13) % 60)}`;
  return {
    ...base,
    id: `t${seq}`,
    time,
    amount: formatTxAmount(base.dir, TX_DEMO_AMOUNTS[index % TX_DEMO_AMOUNTS.length]),
    orderNo: base.orderNo ? `${base.orderNo}-${seq}` : undefined,
    txid: base.txid ? `${base.txid.slice(0, 24)}${seq.toString(16).padStart(8, '0')}` : undefined,
  };
}

export const BALANCE_TX: BalanceTx[] = [
  ...BALANCE_TX_SEED,
  ...Array.from({ length: TX_DEMO_TOTAL - BALANCE_TX_SEED.length }, (_, index) =>
    cloneDemoTx(BALANCE_TX_SEED[index % BALANCE_TX_SEED.length], index),
  ),
];

export const MONTHLY_BILLS: Record<number, MonthlyBill[]> = {
  2026: [
    { id: 'b26-01', title: 'Bill for 2026 Jan', month: 'January, 2026', meta: 'UTC+8' },
    { id: 'b26-02', title: 'Bill for 2026 Feb', month: 'February, 2026', meta: 'UTC+8' },
    { id: 'b26-03', title: 'Bill for 2026 Mar', month: 'March, 2026', meta: 'UTC+8' },
    { id: 'b26-04', title: 'Bill for 2026 Apr', month: 'April, 2026', meta: 'UTC+8' },
    { id: 'b26-05', title: 'Bill for 2026 May', month: 'May, 2026', meta: 'UTC+8' },
    { id: 'b26-06', title: 'Bill for 2026 Jun', month: 'June, 2026', meta: 'UTC+8' },
    { id: 'b26-07', title: 'Bill for 2026 Jul', month: 'July, 2026', meta: 'UTC+8' },
    { id: 'b26-08', title: 'Bill for 2026 Aug', month: 'August, 2026', meta: 'UTC+8' },
    { id: 'b26-09', title: 'Bill for 2026 Sep', month: 'September, 2026', meta: 'UTC+8' },
    { id: 'b26-10', title: 'Bill for 2026 Oct', month: 'October, 2026', meta: 'UTC+8' },
    { id: 'b26-11', title: 'Bill for 2026 Nov', month: 'November, 2026', meta: 'UTC+8' },
    { id: 'b26-12', title: 'Bill for 2026 Dec', month: 'December, 2026', meta: 'UTC+8' },
  ],
  2025: [
    { id: 'b25-01', title: 'Bill for 2025 Jan', month: 'January, 2025', meta: 'UTC+8' },
    { id: 'b25-02', title: 'Bill for 2025 Feb', month: 'February, 2025', meta: 'UTC+8' },
    { id: 'b25-03', title: 'Bill for 2025 Mar', month: 'March, 2025', meta: 'UTC+8' },
    { id: 'b25-04', title: 'Bill for 2025 Apr', month: 'April, 2025', meta: 'UTC+8' },
    { id: 'b25-05', title: 'Bill for 2025 May', month: 'May, 2025', meta: 'UTC+8' },
    { id: 'b25-06', title: 'Bill for 2025 Jun', month: 'June, 2025', meta: 'UTC+8' },
    { id: 'b25-07', title: 'Bill for 2025 Jul', month: 'July, 2025', meta: 'UTC+8' },
    { id: 'b25-08', title: 'Bill for 2025 Aug', month: 'August, 2025', meta: 'UTC+8' },
    { id: 'b25-09', title: 'Bill for 2025 Sep', month: 'September, 2025', meta: 'UTC+8' },
    { id: 'b25-10', title: 'Bill for 2025 Oct', month: 'October, 2025', meta: 'UTC+8' },
    { id: 'b25-11', title: 'Bill for 2025 Nov', month: 'November, 2025', meta: 'UTC+8' },
    { id: 'b25-12', title: 'Bill for 2025 Dec', month: 'December, 2025', meta: 'UTC+8' },
  ],
};

export const ALERT_NOTIFY_VISIBLE_COUNT = 4;

export const ALERT_MEMBERS: AlertMember[] = [
  { id: 'abc', name: 'ABC (Admin)', email: 'abc@cregis.io' },
  { id: 'a12', name: 'A12 (Admin)', email: 'a12@cregis.io' },
  { id: 'op', name: '456 (Operation)', email: 'ops@cregis.io' },
  { id: 'def', name: 'DEF (Finance)', email: 'def@cregis.io' },
  { id: 'g78', name: 'G78 (Viewer)', email: 'g78@cregis.io' },
  { id: 'hk9', name: 'HK9 (Operation)', email: 'hk9@cregis.io' },
  { id: 'lin', name: 'Lin (Admin)', email: 'lin@cregis.io' },
];

export const STATEMENT_TZ = ['UTC-12', 'UTC-8', 'UTC+0', 'UTC+8', 'UTC+9'];
export const STATEMENT_LANG: StatementLang[] = ['English', '简体中文', '繁體中文'];
export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const STATEMENT_COPY: Record<StatementLang, StatementCopy> = {
  English: {
    docTitle: 'Monthly Statement',
    docKicker: 'Account Statement',
    client: 'Client Information',
    teamName: 'Team Name',
    teamId: 'Team ID',
    period: 'Statement Period',
    billInfo: 'Statement Information',
    generated: 'Generated At',
    timezone: 'Accounting Timezone',
    currency: 'Currency',
    topup: 'Total Recharges',
    spend: 'Total Consumption',
    ending: 'Closing Balance',
    details: 'Transaction Details',
    colDate: 'Date',
    colType: 'Type',
    colIn: 'Credit',
    colOut: 'Debit',
    colBal: 'Balance',
    total: 'Period Total',
    disclaimer: 'DISCLAIMER',
    download: 'Download PDF',
    close: 'Close',
    rights: 'All rights reserved.',
    pageOf: 'Page {n} of {total}',
    notes: [
      {
        title: 'Data Basis & Timezone',
        body: 'This statement is generated by the Cregis system based on the user\'s configured "Accounting Timezone". All transaction record timestamps are presented in this timezone ({tz}).',
      },
      {
        title: 'Pricing Unit & Asset Conversion',
        body: 'All amounts in this statement are denominated in USD. Team top-ups are recorded on a "stablecoin basis": 1 USDT is treated as 1 USD for ledgering purposes. Cregis does not provide fiat currency exchange services. The user acknowledges and agrees that Cregis does not assume FX fluctuation risk between cryptocurrencies and fiat currencies, and is not responsible for the market value stability of decentralized assets.',
      },
      {
        title: 'Service Fees & Charges',
        body: 'All fees listed in this statement (including but not limited to team subscription fees and AML compliance screening fees) are charged in accordance with the Cregis service agreement. Once an AML screening is triggered and recorded as completed, the associated fee is irreversible and will not be refunded or offset regardless of the screening result.',
      },
      {
        title: 'Legal Effect & Dispute Handling',
        body: 'This statement is a transaction summary generated from existing system data and is provided for internal corporate reconciliation only. It does not constitute an audit report, tax filing evidence, or any legally binding financial certificate. If you dispute any content, please contact Cregis support within 30 days from the statement generation date; failure to submit a written dispute within this period will be deemed as confirmation and acceptance of the entire statement.',
      },
      {
        title: 'Blockchain Disclaimer',
        body: 'Due to the decentralized nature of blockchain networks, uncontrollable factors such as network congestion, node delays, or consensus mechanism adjustments may occur. Cregis is not responsible for transaction time deviations or data synchronization delays caused by such factors. For on-chain asset transfers, the final outcome shall be subject to the original data shown on the relevant blockchain explorer.',
      },
      {
        title: 'Confidentiality & Data Security',
        body: 'This statement contains sensitive corporate financial data and is highly confidential. Cregis is only responsible for sending it to the secure email addresses designated by the user. Cregis shall not be liable for any data leakage or damages caused by improper access control on the user side, mailbox compromise, or unauthorized forwarding.',
      },
    ],
  },
  简体中文: {
    docTitle: '月度账单',
    docKicker: '账户账单',
    client: '客户信息',
    teamName: '团队名称',
    teamId: '团队编号',
    period: '账单周期',
    billInfo: '账单信息',
    generated: '生成时间',
    timezone: '账务时区',
    currency: '结算币种',
    topup: '充值合计',
    spend: '消费合计',
    ending: '期末结余',
    details: '交易明细',
    colDate: '日期',
    colType: '类型',
    colIn: '收入',
    colOut: '支出',
    colBal: '结余',
    total: '本期合计',
    disclaimer: '免责声明',
    download: '下载 PDF',
    close: '关闭',
    rights: '版权所有。',
    pageOf: '第 {n} 页，共 {total} 页',
    notes: [
      {
        title: '数据基准与时区',
        body: '本账单由 Cregis 系统依据用户配置的「账务时区」自动生成。所有交易记录时间戳均按该时区（{tz}）展示。',
      },
      {
        title: '计价单位与资产折算',
        body: '本账单全部金额以 USD 计价。团队充值按「稳定币平价」入账：1 USDT 记为 1 USD。Cregis 不提供法币兑换服务。用户知悉并同意，Cregis 不承担加密资产与法币之间的汇率波动风险，亦不对去中心化资产的市值稳定性负责。',
      },
      {
        title: '服务费用与扣费',
        body: '本账单所列费用（包括但不限于团队订阅费、AML 合规筛查费）均按 Cregis 服务协议收取。AML 筛查一经触发并记录为完成，相关费用不可撤销，不论筛查结果如何均不予退款或抵扣。',
      },
      {
        title: '法律效力与异议处理',
        body: '本账单系根据系统既有数据生成的交易汇总，仅供企业内部对账参考，不构成审计报告、报税凭证或任何具法律约束力的财务证明。如对内容有异议，请自账单生成日起 30 日内联系 Cregis 支持；逾期未提交书面异议，视为确认并接受本账单全部内容。',
      },
      {
        title: '区块链免责',
        body: '因区块链网络去中心化特性，可能出现网络拥堵、节点延迟或共识机制调整等不可控因素。Cregis 不对因此导致的交易时间偏差或数据同步延迟承担责任。链上资产转移最终结果以相应区块链浏览器原始数据为准。',
      },
      {
        title: '保密与数据安全',
        body: '本账单含企业敏感财务数据，属高度机密。Cregis 仅负责发送至用户指定的安全邮箱。因用户侧访问控制不当、邮箱被盗或擅自转发造成的数据泄露或损失，Cregis 不承担责任。',
      },
    ],
  },
  繁體中文: {
    docTitle: '月度賬單',
    docKicker: '賬戶賬單',
    client: '客戶資訊',
    teamName: '團隊名稱',
    teamId: '團隊編號',
    period: '賬單週期',
    billInfo: '賬單資訊',
    generated: '生成時間',
    timezone: '帳務時區',
    currency: '結算幣種',
    topup: '充值合計',
    spend: '消費合計',
    ending: '期末結餘',
    details: '交易明細',
    colDate: '日期',
    colType: '類型',
    colIn: '收入',
    colOut: '支出',
    colBal: '結餘',
    total: '本期合計',
    disclaimer: '免責聲明',
    download: '下載 PDF',
    close: '關閉',
    rights: '版權所有。',
    pageOf: '第 {n} 頁，共 {total} 頁',
    notes: [
      {
        title: '數據基準與時區',
        body: '本賬單由 Cregis 系統依據用戶配置的「帳務時區」自動生成。所有交易記錄時間戳均按該時區（{tz}）展示。',
      },
      {
        title: '計價單位與資產折算',
        body: '本賬單全部金額以 USD 計價。團隊充值按「穩定幣平價」入賬：1 USDT 記為 1 USD。Cregis 不提供法幣兌換服務。用戶知悉並同意，Cregis 不承擔加密資產與法幣之間的匯率波動風險，亦不對去中心化資產的市值穩定性負責。',
      },
      {
        title: '服務費用與扣費',
        body: '本賬單所列費用（包括但不限於團隊訂閱費、AML 合規篩查費）均按 Cregis 服務協議收取。AML 篩查一經觸發並記錄為完成，相關費用不可撤銷，不論篩查結果如何均不予退款或抵扣。',
      },
      {
        title: '法律效力與異議處理',
        body: '本賬單係根據系統既有數據生成的交易彙總，僅供企業內部對賬參考，不構成審計報告、報稅憑證或任何具法律約束力的財務證明。如對內容有異議，請自賬單生成日起 30 日內聯繫 Cregis 支援；逾期未提交書面異議，視為確認並接受本賬單全部內容。',
      },
      {
        title: '區塊鏈免責',
        body: '因區塊鏈網絡去中心化特性，可能出現網絡擁堵、節點延遲或共識機制調整等不可控因素。Cregis 不對因此導致的交易時間偏差或數據同步延遲承擔責任。鏈上資產轉移最終結果以相應區塊鏈瀏覽器原始數據為準。',
      },
      {
        title: '保密與數據安全',
        body: '本賬單含企業敏感財務數據，屬高度機密。Cregis 僅負責發送至用戶指定的安全郵箱。因用戶側訪問控制不當、郵箱被盜或擅自轉發造成的數據洩露或損失，Cregis 不承擔責任。',
      },
    ],
  },
};

export const STMT_TYPE: Record<string, StmtTypeMeta> = {
  recharge: { English: 'Recharge', 简体中文: '充值', 繁體中文: '充值', kind: 'in' },
  tron: { English: 'Tron Energy Fee', 简体中文: 'Tron 能量费', 繁體中文: 'Tron 能量費', kind: 'out' },
  renew: { English: 'Team Subscription Renewal', 简体中文: '团队版本续费', 繁體中文: '團隊版本續費', kind: 'out' },
  aml: { English: 'AML Query', 简体中文: 'AML 查询', 繁體中文: 'AML 查詢', kind: 'out' },
  upgrade: { English: 'Team Subscription Upgrade', 简体中文: '团队版本升级', 繁體中文: '團隊版本升級', kind: 'out' },
};

export const STMT_APR_LINES: StmtLine[] = [
  { d: '01 00:00:00', type: null, inn: null, out: null },
  { d: '02 09:15:22', type: 'recharge', inn: 10000, out: null },
  { d: '05 14:30:00', type: 'tron', inn: null, out: 2340.5 },
  { d: '08 11:22:18', type: 'renew', inn: null, out: 500 },
  { d: '10 08:45:33', type: 'aml', inn: null, out: 125 },
  { d: '12 16:00:00', type: 'recharge', inn: 20000, out: null },
  { d: '14 10:18:47', type: 'tron', inn: null, out: 1890.3 },
  { d: '15 17:06:09', type: 'tron', inn: null, out: 904.87 },
  { d: '18 13:22:00', type: 'recharge', inn: 20000, out: null },
  { d: '20 09:10:55', type: 'upgrade', inn: null, out: 3200 },
  { d: '22 14:45:30', type: 'aml', inn: null, out: 250 },
  { d: '25 11:30:00', type: 'tron', inn: null, out: 1542.13 },
  { d: '28 16:55:22', type: 'renew', inn: null, out: 1698 },
];

export type BillListItem = MonthlyBill | { yearBar: number };

export type BillYearGroup = {
  year: number;
  bills: MonthlyBill[];
};

export function isYearBar(item: BillListItem): item is { yearBar: number } {
  return 'yearBar' in item;
}

export function billList(year: number, expanded: boolean): BillListItem[] {
  const primary = MONTHLY_BILLS[year] ?? [];
  if (year === 2026 && expanded) {
    return [...primary, { yearBar: 2025 }, ...(MONTHLY_BILLS[2025] ?? [])];
  }
  return primary;
}

export function billYearGroups(year: number, expanded: boolean): BillYearGroup[] {
  const groups: BillYearGroup[] = [{ year, bills: [...(MONTHLY_BILLS[year] ?? [])] }];
  if (year === 2026 && expanded) {
    groups.push({ year: 2025, bills: [...(MONTHLY_BILLS[2025] ?? [])] });
  }
  return groups;
}

export function findBill(id: string): MonthlyBill | undefined {
  return Object.values(MONTHLY_BILLS).flat().find((bill) => bill.id === id);
}

export function statementLangFromLocale(locale: string): StatementLang {
  if (locale === 'zh-CN') return '简体中文';
  if (locale === 'zh-TW') return '繁體中文';
  return 'English';
}

export function stmtCopy(lang: StatementLang): StatementCopy {
  return STATEMENT_COPY[lang] ?? STATEMENT_COPY.English;
}

export function stmtPeriodLabel(bill: MonthlyBill | undefined, lang: StatementLang): string {
  const p = billPeriod(bill);
  if (lang === 'English') return p.short;
  return `${p.year}年${p.month}月`;
}

export function stmtPageLabel(copy: StatementCopy, n: number, total: number): string {
  return copy.pageOf.replace('{n}', String(n)).replace('{total}', String(total));
}

export function stmtMoney(n: number | null | undefined, signed = false): string {
  if (n == null) return '—';
  const abs = formatGroupedDecimalAmount(Math.abs(n).toFixed(2));
  if (!signed) return `$${abs}`;
  const sign = n > 0 ? '+' : n < 0 ? '-' : '';
  return `${sign} $${abs}`;
}

export function billPeriod(bill?: MonthlyBill) {
  const [name, yearStr] = (bill?.month || 'April, 2026').split(', ');
  const month = Math.max(1, MONTH_NAMES.indexOf(name) + 1);
  const year = Number(yearStr) || 2026;
  return {
    year,
    month,
    name,
    short: `${MONTH_SHORT[month - 1]} ${year}`,
    pad: String(month).padStart(2, '0'),
  };
}

export type StatementDocRow = {
  time: string;
  type: string | null;
  inn: number | null;
  out: number | null;
  bal: number;
};

export type StatementDoc = {
  period: string;
  year: number;
  generated: string;
  tz: string;
  teamName: string;
  teamId: string;
  recharge: number;
  spend: number;
  ending: number;
  rows: StatementDocRow[];
  printed: string;
};

export function statementDoc(
  bill: MonthlyBill | undefined,
  options: { tz: string; header: StatementHeader; lang: StatementLang },
): StatementDoc {
  const p = billPeriod(bill);
  const opening = 999873434.15;
  let bal = opening;
  const rows = STMT_APR_LINES.map((line, i) => {
    if (i === 0) return { time: `${p.year}-${p.pad}-${line.d}`, type: null, inn: null, out: null, bal: opening };
    if (line.inn) bal += line.inn;
    if (line.out) bal -= line.out;
    return { time: `${p.year}-${p.pad}-${line.d}`, type: line.type, inn: line.inn, out: line.out, bal };
  });
  const nextMonth = p.month === 12 ? { y: p.year + 1, m: 1 } : { y: p.year, m: p.month + 1 };
  const gen = `${nextMonth.y}-${String(nextMonth.m).padStart(2, '0')}-01 00:00:00`;
  const teamName = options.header === 'kyb' ? 'Acme Technology Co., Ltd.' : 'Acme Technology Co.';
  return {
    period: stmtPeriodLabel(bill, options.lang),
    year: p.year,
    generated: bill?.id?.startsWith('b26-') ? '2026-05-01 00:00:00' : gen,
    tz: options.tz,
    teamName,
    teamId: 'TEAM-20250318-0042',
    recharge: 50000,
    spend: 12450.8,
    ending: rows[rows.length - 1].bal,
    rows,
    printed: p.month === 4 && p.year === 2026 ? '2026/5/12 上午10:30' : gen.replace(/-/g, '/').slice(0, 16),
  };
}

export function stmtTypeLabel(type: string | null, lang: StatementLang): { label: string; kind: TxDir } | null {
  if (!type) return null;
  const meta = STMT_TYPE[type];
  if (!meta) return { label: type, kind: 'out' };
  return { label: meta[lang] || meta.English, kind: meta.kind };
}
