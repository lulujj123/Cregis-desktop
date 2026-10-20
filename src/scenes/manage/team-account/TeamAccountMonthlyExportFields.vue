<script setup lang="ts">
import { computed } from 'vue';
import {
  EgComboInputItem,
  EgFlotation,
  EgFlotationMenu,
  EgFlotationMenuItem,
  EgFlotationTrigger,
  type FlotationMenuItemPreset,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';
import {
  INVOICE_HEADER_KYB_COMPANY,
  INVOICE_HEADER_TEAM_COMPANY,
  type StatementHeader,
  type StatementLang,
} from './teamAccountData';
import TeamAccountMonthlyExportPeriodPicker from './TeamAccountMonthlyExportPeriodPicker.vue';
import styles from './TeamAccountMonthlyExportFields.module.css';

const period = defineModel<string>('period', { required: true });
const language = defineModel<StatementLang>('language', { required: true });
const header = defineModel<StatementHeader>('header', { required: true });

const props = defineProps<{
  languageItems: FlotationMenuItemPreset[];
}>();

const { ui } = useAppI18n();

const langMenuItems = computed(() =>
  props.languageItems.map((item) => ({
    ...item,
    focused: item.label === language.value,
  })),
);

const headerTriggerLabel = computed(() =>
  header.value === 'kyb' ? ui('Use KYB Name') : ui('Use Team Name'),
);

function onLanguageClick(item: FlotationMenuItemPreset) {
  if (item.label === 'English' || item.label === '简体中文' || item.label === '繁體中文') {
    language.value = item.label;
  }
}

function onHeaderClick(next: StatementHeader, close: () => void) {
  header.value = next;
  close();
}
</script>

<template>
  <div :class="styles.fields">
    <EgComboInputItem :label="ui('Month')">
      <TeamAccountMonthlyExportPeriodPicker v-model="period" />
    </EgComboInputItem>
    <EgComboInputItem :label="ui('Statement Language')">
      <EgFlotation
        trigger="click"
        width-mode="trigger"
        :show-add="false"
        :show-menu-divider="false"
        :items="langMenuItems"
        boundary-selector=".app-preview"
        flip
        :close-on-scroll="false"
        @item-click="onLanguageClick"
      >
        <template #trigger="{ expanded }">
          <EgFlotationTrigger
            trigger-style="outline"
            size="md"
            width-mode="adaptive"
            :label="language"
            :expanded="expanded"
          />
        </template>
      </EgFlotation>
    </EgComboInputItem>
    <EgComboInputItem :label="ui('Invoice Header')">
      <EgFlotation
        trigger="click"
        width-mode="trigger"
        :show-add="false"
        :show-menu-divider="false"
        boundary-selector=".app-preview"
        flip
        :close-on-scroll="false"
      >
        <template #trigger="{ expanded }">
          <EgFlotationTrigger
            trigger-style="outline"
            size="md"
            width-mode="adaptive"
            :label="headerTriggerLabel"
            :expanded="expanded"
          />
        </template>
        <template #content="{ close }">
          <EgFlotationMenu
            :class="['desktopTokens', styles.headerMenu]"
            data-no-corner-smoothing
            panel-radius="radius-md"
            width-mode="adaptive"
            height-mode="adaptive"
            :scrollable="false"
            :show-add="false"
            :show-divider="false"
          >
            <EgFlotationMenuItem
              box-type="text"
              label-wrap
              :show-tag="false"
              :focused="header === 'team'"
              @click="onHeaderClick('team', close)"
            >
              <span :class="styles.headerCopy">
                <span>{{ ui('Use Team Name') }}</span>
                <span :class="styles.headerNote">({{ INVOICE_HEADER_TEAM_COMPANY }})</span>
              </span>
            </EgFlotationMenuItem>
            <EgFlotationMenuItem
              box-type="text"
              label-wrap
              :show-tag="false"
              :focused="header === 'kyb'"
              @click="onHeaderClick('kyb', close)"
            >
              <span :class="styles.headerCopy">
                <span>{{ ui('Use KYB Name') }}</span>
                <span :class="styles.headerNote">({{ INVOICE_HEADER_KYB_COMPANY }})</span>
              </span>
            </EgFlotationMenuItem>
          </EgFlotationMenu>
        </template>
      </EgFlotation>
    </EgComboInputItem>
  </div>
</template>
