import { customerServiceState } from '@/scenes/customer-service/customerServiceState';
import { customerServiceShellApiRegistry } from '@/scenes/customer-service/customerServiceShellApi';

const SHELL_API_WAIT_MS = 8000;

function waitForCustomerServiceShellApi(): Promise<void> {
  return new Promise((resolve, reject) => {
    const started = performance.now();
    const tick = () => {
      if (customerServiceShellApiRegistry.value) {
        resolve();
        return;
      }
      if (performance.now() - started > SHELL_API_WAIT_MS) {
        reject(new Error('Customer service shell API not registered (open the CregisAI panel).'));
        return;
      }
      requestAnimationFrame(tick);
    };
    tick();
  });
}

/** QA · 人工客服不在線：打开助手 → 敏感数据提示 → 转接 → 忙碌/非工作时间回复。 */
export async function applyCustomerServiceHumanAgentsOfflineScenario() {
  customerServiceState.open = true;
  await waitForCustomerServiceShellApi();
  await customerServiceShellApiRegistry.value!.runHumanAgentsOfflineScenario();
}
