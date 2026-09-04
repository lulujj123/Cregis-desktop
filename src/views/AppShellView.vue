<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { EgLayout, EgNavBar } from '@eds/desktop-components';
import CregisModuleMenu from '@/components/CregisModuleMenu.vue';
import { useAppI18n } from '@/composables/useAppI18n';
import PreferencePage from '@/scenes/account-settings/PreferencePage.vue';
import TeamAccountPage from '@/scenes/manage/team-account/TeamAccountPage.vue';
import {
  DEFAULT_CREGIS_MODULE_MENU_BUSINESS_TITLE,
  navLabelShouldHideModuleMenu,
  resolveNavChromeLabelToModuleMenuTitle,
  type CregisModuleMenuBusinessTitle,
} from '@/presets/module-menu/businessModuleTitles';
import { getCregisModuleMenuGroups } from '@/presets/module-menu/cregisModuleMenuGroups';
import { cregisNavBarDeclarativeAttrs } from '@/presets/nav/cregisNavBarDeclarative';
import { resolveEnglishUiText } from '@/i18n/translateUiText';
import PaymentEnginePage from '@/scenes/payment-engine/PaymentEnginePage.vue';
import {
  DEFAULT_PAYMENT_ENGINE_MENU_ITEM,
  isPaymentEngineMenuItem,
} from '@/scenes/payment-engine/paymentEngineData';
import TasksDataListPage from '@/scenes/tasks/TasksDataListPage.vue';
import { setMultiSignCollaborationModuleActive } from '@/scenes/tasks/signing/multiSignInvitation/multiSignInvitationStore';
import { useTasksModuleMenuGroups } from '@/scenes/tasks/useTasksModuleMenuGroups';
import {
  DEFAULT_TASKS_DATA_LIST_MENU_ITEM,
  isTasksDataListMenuItem,
  type TasksDataListMenuItemLabel,
} from '@/scenes/tasks/tasksDataListPageData';

const { messages, ui, locale } = useAppI18n();

const navBarAttrs = computed(() => ({
  ...cregisNavBarDeclarativeAttrs,
  moduleLabel1: ui('Wallet'),
  moduleLabel2: ui('Tasks'),
  moduleLabel3: ui('WaaS'),
  moduleLabel4: ui('Payment Engine'),
  moduleLabel5: ui('Report'),
  moduleLabel6: ui('Risk Control'),
  moduleLabel7: ui('Manage'),
  moduleLabel8: ui('Marketplace'),
  appEntryLabel1: ui('UniChain'),
  appEntryLabel2: ui('MetaMask'),
}));

const activeModuleTitle = ref<CregisModuleMenuBusinessTitle>(
  DEFAULT_CREGIS_MODULE_MENU_BUSINESS_TITLE,
);

const activeNavLabel = ref('Wallet');

const activeModuleMenuItem = ref<string | null>(null);

const showModuleMenu = computed(() => !navLabelShouldHideModuleMenu(activeNavLabel.value));

const showTasksDataList = computed(
  () =>
    activeModuleTitle.value === 'Tasks' &&
    activeModuleMenuItem.value !== null &&
    isTasksDataListMenuItem(activeModuleMenuItem.value),
);

const showPreferencePage = computed(
  () => activeModuleTitle.value === 'Account Settings' && activeModuleMenuItem.value === 'Preference',
);

const showTeamAccountPage = computed(
  () => activeModuleTitle.value === 'Manage' && activeModuleMenuItem.value === 'Team Account Balance',
);

const showPaymentEnginePage = computed(
  () =>
    activeModuleTitle.value === 'Payment Engine' &&
    activeModuleMenuItem.value !== null &&
    isPaymentEngineMenuItem(activeModuleMenuItem.value),
);

const tasksModuleMenuGroups = useTasksModuleMenuGroups();

const moduleMenuGroups = computed(() => {
  if (activeModuleTitle.value === 'Tasks') {
    return tasksModuleMenuGroups.value;
  }
  return getCregisModuleMenuGroups(activeModuleTitle.value);
});

watch(activeModuleTitle, (title) => {
  if (title === 'Tasks') {
    activeModuleMenuItem.value = DEFAULT_TASKS_DATA_LIST_MENU_ITEM;
    return;
  }
  if (title === 'Account Settings') {
    activeModuleMenuItem.value = 'Preference';
    return;
  }
  if (title === 'Manage') {
    activeModuleMenuItem.value = 'Team Subscription';
    return;
  }
  if (title === 'Payment Engine') {
    activeModuleMenuItem.value = DEFAULT_PAYMENT_ENGINE_MENU_ITEM;
    return;
  }
  activeModuleMenuItem.value = null;
}, { immediate: true });

watch(
  [activeModuleTitle, activeModuleMenuItem],
  ([title, item]) => {
    setMultiSignCollaborationModuleActive(title === 'Tasks' && item === 'Signing');
  },
  { immediate: true },
);

function onNavClick(event: MouseEvent) {
  const button = (event.target as HTMLElement | null)?.closest('button');
  if (!button?.closest('.eds-nav-bar')) return;

  const label = button.getAttribute('aria-label') ?? '';
  const englishLabel = resolveEnglishUiText(locale.value, label);
  if (englishLabel.trim()) activeNavLabel.value = englishLabel;

  const title = resolveNavChromeLabelToModuleMenuTitle(englishLabel);
  if (title) activeModuleTitle.value = title;
}

function onModuleMenuItemSelect(label: string) {
  if (activeModuleTitle.value === 'Tasks') {
    if (isTasksDataListMenuItem(label)) {
      activeModuleMenuItem.value = label as TasksDataListMenuItemLabel;
    }
    return;
  }

  if (activeModuleTitle.value === 'Account Settings') {
    activeModuleMenuItem.value = label;
    return;
  }

  if (activeModuleTitle.value === 'Manage') {
    activeModuleMenuItem.value = label;
    return;
  }

  if (activeModuleTitle.value === 'Payment Engine') {
    if (isPaymentEngineMenuItem(label)) {
      activeModuleMenuItem.value = label;
    }
  }
}
</script>

<template>
  <EgLayout type="free">
    <template #nav>
      <div class="app-shell-nav" @click.capture="onNavClick">
        <EgNavBar v-bind="navBarAttrs" />
      </div>
    </template>

    <template v-if="showModuleMenu" #moduleMenu>
      <CregisModuleMenu
        :title="activeModuleTitle"
        :groups="moduleMenuGroups"
        :focused-label="activeModuleMenuItem"
        @item-select="onModuleMenuItemSelect"
      />
    </template>

    <TasksDataListPage
      v-if="showTasksDataList && activeModuleMenuItem"
      :key="activeModuleMenuItem"
      :toolbar-title="activeModuleMenuItem"
    />
    <PreferencePage v-else-if="showPreferencePage" />
    <TeamAccountPage v-else-if="showTeamAccountPage" />
    <PaymentEnginePage
      v-else-if="showPaymentEnginePage && activeModuleMenuItem"
      :key="activeModuleMenuItem"
      :menu-item="activeModuleMenuItem"
    />
    <div v-else class="app-shell-main">
      <p class="app-shell-main__hint">{{ messages.appShellMainHint }}</p>
    </div>
  </EgLayout>
</template>

<style scoped>
.app-shell-nav {
  display: contents;
}

.app-shell-main {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  min-height: 0;
  max-height: 100%;
  overflow: hidden;
}

.app-shell-main__hint {
  margin: 0;
  color: var(--text-base-secondary);
  font-size: var(--eds-body-medium-size);
  font-weight: var(--eds-body-medium-weight);
  line-height: var(--eds-body-medium-line-height);
}
</style>
