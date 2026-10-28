/** Customer service widget — product spec 400×623; docked bottom-left next to NavBar (not a Dialog/Detail preset). */
export const CUSTOMER_SERVICE_POPUP_WIDTH = 400;
export const CUSTOMER_SERVICE_POPUP_HEIGHT = 623;

/** Demo team identity (field values — do not pass to `ui()`). */
export const CUSTOMER_SERVICE_TEAM_NAME = 'Acme Technology Co.';
export const CUSTOMER_SERVICE_SUBSCRIPTION_PLAN = 'Enterprise';

export const CUSTOMER_SERVICE_GREETING_KEY =
  'Hello! I am CregisAI Assistant. I can see you are currently on [{page}]. How can I help?';

export const CUSTOMER_SERVICE_SUGGESTION_KEYS = [
  'How do I change the daily withdrawal limit?',
  'How do I configure team role permissions and risk-control rules?',
  'Look up an unreceived order',
] as const;

export const CUSTOMER_SERVICE_UNRECEIVED_ORDER_SUGGESTION_KEY = 'Look up an unreceived order';

/** @deprecated Use {@link CUSTOMER_SERVICE_UNRECEIVED_ORDER_SUGGESTION_KEY} */
export const CUSTOMER_SERVICE_HANDOFF_KEY = CUSTOMER_SERVICE_UNRECEIVED_ORDER_SUGGESTION_KEY;

/** Demo: user message containing this substring triggers AI refusal → human handoff. */
export const CUSTOMER_SERVICE_REFUSAL_DEMO_TRIGGER = 'refuse-demo';

export const CUSTOMER_SERVICE_REFUSAL_REPLY_KEY =
  'I’m unable to help with that request.';

export const CUSTOMER_SERVICE_TEAM_SWITCH_TIP_ICON = 'eds-light';

/** User text containing any of these substrings shows the human-agent handoff offer. */
export const CUSTOMER_SERVICE_HUMAN_AGENT_KEYWORDS = ['人工客服', '人工', '客服'] as const;

export function messageRequestsHumanAgent(text: string): boolean {
  const normalized = text.normalize('NFKC').replace(/\s/g, '');
  if (!normalized) return false;
  return CUSTOMER_SERVICE_HUMAN_AGENT_KEYWORDS.some((keyword) =>
    normalized.includes(keyword),
  );
}

export const CUSTOMER_SERVICE_FEEDBACK_TITLE_KEY = 'Feedback';

export const CUSTOMER_SERVICE_FEEDBACK_DETAIL_PLACEHOLDER_KEY =
  'We want to know why you are dissatisfied with this answer, and what you think would be a better answer.';

export const CUSTOMER_SERVICE_HANDOFF_OFFER_PROMPT_KEY =
  'Would you like to learn more from a human agent?';

export const CUSTOMER_SERVICE_HANDOFF_OFFER_ACTION_KEY = 'Transfer to human agent';

export const CUSTOMER_SERVICE_HANDOFF_REP_MESSAGE_KEY =
  'You are speaking with customer service representative "{name}".';

/** QA / shell API：转接人工后客服不在线或忙碌时的回复（不影响默认 live handoff）。 */
export const CUSTOMER_SERVICE_HUMAN_AGENT_OFFLINE_REPLY_KEY =
  'Sorry, human agents are busy or outside business hours. To save time, tap Leave a message below or describe your issue here with screenshots. We will reply as soon as an agent is online.';

export const CUSTOMER_SERVICE_LEAVE_MESSAGE_ACTION_KEY = 'Leave a message';

export const CUSTOMER_SERVICE_LEAVE_MESSAGE_TITLE_KEY = 'Leave a message';

export const CUSTOMER_SERVICE_LEAVE_MESSAGE_PLACEHOLDER_KEY = 'Enter your message';

export const CUSTOMER_SERVICE_LEAVE_MESSAGE_THANK_YOU_KEY =
  'Thank you for your message. Our support team will reply soon. Reference: {ref}.';

/** Demo reference id (field value — do not pass to `ui()`). */
export const CUSTOMER_SERVICE_LEAVE_MESSAGE_REFERENCE = 'A2345567';

/** Shell QA 演示用用户消息（触发敏感数据 + 转接按钮）。 */
export const CUSTOMER_SERVICE_SHELL_SENSITIVE_DEMO_QUERY = '查余额';

/** Demo agent display name (field value — do not pass to `ui()`). */
export const CUSTOMER_SERVICE_HANDOFF_REP_NAME = 'Alex Chen';

export const CUSTOMER_SERVICE_TEAM_SWITCH_ANNOUNCEMENT_KEY = 'Switched to [{team}].';

export const CUSTOMER_SERVICE_ASSISTANT_PROCESSING_MS = 1000;

export const CUSTOMER_SERVICE_SENSITIVE_DATA_REPLY_KEY =
  'System notice: For data security, I cannot look up account balances, transaction details, or billing for you. Tap the button below to transfer to a human agent.';

/** User message matching these patterns gets {@link CUSTOMER_SERVICE_SENSITIVE_DATA_REPLY_KEY}. */
export function messageRequestsSensitiveBusinessData(text: string): boolean {
  const normalized = text.normalize('NFKC').replace(/\s/g, '').toLowerCase();
  if (!normalized) return false;
  const patterns = [
    '查詢交易數據',
    '查询交易数据',
    '業務數據查詢',
    '业务数据查询',
    '查餘額',
    '查余额',
    '余额',
    'txid',
    't×id',
    '帳單',
    '账单',
  ];
  return patterns.some((pattern) =>
    normalized.includes(pattern.normalize('NFKC').replace(/\s/g, '').toLowerCase()),
  );
}

export const CUSTOMER_SERVICE_FEEDBACK_OPTION_KEYS = [
  'Inaccurate answer',
  'Invalid steps',
  'Irrelevant answer',
  'Others',
] as const;

export const CUSTOMER_SERVICE_FEEDBACK_OTHER_KEY = 'Others';

export const CUSTOMER_SERVICE_HISTORY_TITLE_KEY = 'Conversation History Records';
export const CUSTOMER_SERVICE_PERSONAL_SPACE_KEY = 'Web3 Wallet';

export type CustomerServiceChatSpace = 'team' | 'personal';

export const CUSTOMER_SERVICE_DEMO_HISTORY = [
  {
    topicKey: 'Daily Withdrawal Limit',
    messageKey: 'How do I change the daily withdrawal limit?',
    space: 'team' as const,
    time: '2026-10-16 10:32',
  },
  {
    topicKey: 'Team Role Permissions and Risk-Control Rules',
    messageKey: 'How do I configure team role permissions and risk-control rules?',
    space: 'team' as const,
    time: '2026-10-15 18:04',
  },
  {
    topicKey: 'Unreceived Order Inquiry',
    messageKey: CUSTOMER_SERVICE_UNRECEIVED_ORDER_SUGGESTION_KEY,
    space: 'personal' as const,
    time: '2026-10-14 09:12',
  },
] as const;
