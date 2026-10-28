import { CUSTOMER_SERVICE_SHELL_PAGE_KEY } from '../pageKeyFromShell';
import { replaceShellDebugScenariosForPage } from '../registry';
import { applyCustomerServiceHumanAgentsOfflineScenario } from './customerServiceScenarioActions';

export function registerCustomerServiceScenarioPack() {
  replaceShellDebugScenariosForPage(CUSTOMER_SERVICE_SHELL_PAGE_KEY, [
    {
      id: 'customer-service-human-agents-offline',
      pageKey: CUSTOMER_SERVICE_SHELL_PAGE_KEY,
      label: '人工客服不在線',
      description:
        '打开 CregisAI → 人工客服不在線自动回复 → 留言弹窗 → 提交后感谢语并锁定输入框。',
      apply: applyCustomerServiceHumanAgentsOfflineScenario,
    },
  ]);
}

registerCustomerServiceScenarioPack();
