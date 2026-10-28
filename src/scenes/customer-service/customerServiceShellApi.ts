import { shallowRef } from 'vue';

/** CustomerServicePanel · Shell Debug QA 可调用的演示 API（面板挂载时注册）。 */
export type CustomerServiceShellApi = {
  /** 查余额 → 转接人工 → 人工客服不在線回复（QA「人工客服不在線」）。 */
  runHumanAgentsOfflineScenario: () => Promise<void>;
};

export const customerServiceShellApiRegistry = shallowRef<CustomerServiceShellApi | null>(
  null,
);

export function registerCustomerServiceShellApi(api: CustomerServiceShellApi | null) {
  customerServiceShellApiRegistry.value = api;
}
