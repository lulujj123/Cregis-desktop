<script setup lang="ts">
/**
 * Statement period picker — EgFilter currency cascade (FilterConditionCurrencyValue):
 * year list + hover month submenu (separate teleported layer), width hugs content.
 */
import { computed, ref } from 'vue';
import {
  EgFlotation,
  EgFlotationMenu,
  EgFlotationMenuItem,
  EgFlotationTrigger,
} from '@eds/desktop-components';
import {
  formatMonthlyExportPeriodLabel,
  listMonthlyExportMonthOptions,
  listMonthlyExportYears,
  parseMonthlyExportPeriodLabel,
} from './teamAccountData';
import styles from './TeamAccountMonthlyExportPeriodPicker.module.css';

const CASCADE_BOUNDARY_SELECTOR = '.app-preview';
/** Bridge gap between year row (inside export panel) and teleported month menu. */
const CASCADE_HOVER_CLOSE_DELAY_MS = 80;
const MONTH_CASCADE_MENU_WIDTH = 140;

const period = defineModel<string>({ required: true });

const periodYears = computed(() => listMonthlyExportYears());
const selectedPeriod = computed(() => parseMonthlyExportPeriodLabel(period.value));

const activeCascadeYear = ref<string | null>(null);

function monthsForYear(year: number) {
  return listMonthlyExportMonthOptions(year);
}

function isYearSelected(year: number) {
  return selectedPeriod.value?.year === year;
}

function isMonthSelected(year: number, monthIndex: number) {
  return (
    selectedPeriod.value?.year === year && selectedPeriod.value.monthIndex === monthIndex
  );
}

function onCascadeRowEnter(year: number) {
  activeCascadeYear.value = String(year);
}

function onCascadeOpen(year: number) {
  activeCascadeYear.value = String(year);
}

function isCascadeFlotationDisabled(year: number) {
  const key = String(year);
  return activeCascadeYear.value !== null && activeCascadeYear.value !== key;
}

function onCascadeFlotationClose(year: number) {
  if (activeCascadeYear.value === String(year)) {
    activeCascadeYear.value = null;
  }
}

function isCascadeRowHighlighted(year: number, expanded: boolean) {
  const key = String(year);
  return expanded || activeCascadeYear.value === key || isYearSelected(year);
}

function onMonthClick(year: number, monthIndex: number, closeRoot: () => void) {
  period.value = formatMonthlyExportPeriodLabel(year, monthIndex);
  activeCascadeYear.value = null;
  closeRoot();
}
</script>

<template>
  <div :class="styles.root" @pointerdown.stop>
    <EgFlotation
      trigger="click"
      width-mode="trigger"
      :show-add="false"
      :show-menu-divider="false"
      :boundary-selector="CASCADE_BOUNDARY_SELECTOR"
      flip
      :close-on-scroll="false"
    >
      <template #trigger="{ expanded }">
        <EgFlotationTrigger
          trigger-style="outline"
          size="md"
          width-mode="adaptive"
          :label="period"
          :expanded="expanded"
        />
      </template>
      <template #content="{ close }">
        <EgFlotationMenu
          :class="['desktopTokens', styles.menu, styles.menuAdaptive]"
          data-no-corner-smoothing
          panel-flush
          panel-radius="radius-md"
          width-mode="adaptive"
          height-mode="adaptive"
          :scrollable="false"
          :show-add="false"
          :show-divider="false"
        >
          <div :class="styles.optionList">
            <div
              v-for="year in periodYears"
              :key="year"
              :class="styles.optionRowWrap"
              @mouseenter="onCascadeRowEnter(year)"
            >
              <EgFlotation
                :class="styles.cascadeFlotation"
                placement="left"
                align="start"
                trigger="hover"
                width-mode="fixed"
                :width="MONTH_CASCADE_MENU_WIDTH"
                :show-add="false"
                :show-menu-divider="false"
                :disabled="isCascadeFlotationDisabled(year)"
                :boundary-selector="CASCADE_BOUNDARY_SELECTOR"
                :close-delay="CASCADE_HOVER_CLOSE_DELAY_MS"
                flip
                :close-on-scroll="false"
                @open="onCascadeOpen(year)"
                @close="onCascadeFlotationClose(year)"
              >
                <template #trigger="{ expanded: yearExpanded }">
                  <div
                    :class="[
                      styles.cascadeRow,
                      isCascadeRowHighlighted(year, yearExpanded) && styles.cascadeRowSelected,
                    ]"
                    data-eds-trigger-metrics
                  >
                    <EgFlotationMenuItem
                      host-tag="div"
                      box-type="text"
                      :label="String(year)"
                      :show-tag="false"
                      show-cascader
                      :focused="isCascadeRowHighlighted(year, yearExpanded)"
                    />
                  </div>
                </template>
                <template #content>
                  <EgFlotationMenu
                    :class="['desktopTokens', styles.submenu]"
                    data-no-corner-smoothing
                    panel-flush
                    panel-radius="radius-md"
                    width-mode="fixed"
                    :width="MONTH_CASCADE_MENU_WIDTH"
                    height-mode="adaptive"
                    :max-height="280"
                    list-scroll
                    :scrollable="true"
                    :show-add="false"
                    :show-divider="false"
                  >
                    <div :class="styles.cascadeList">
                      <EgFlotationMenuItem
                        v-for="month in monthsForYear(year)"
                        :key="`${year}-${month.monthIndex}`"
                        box-type="text"
                        :label="month.shortLabel"
                        :show-tag="false"
                        :focused="isMonthSelected(year, month.monthIndex)"
                        @click="onMonthClick(year, month.monthIndex, close)"
                      />
                    </div>
                  </EgFlotationMenu>
                </template>
              </EgFlotation>
            </div>
          </div>
        </EgFlotationMenu>
      </template>
    </EgFlotation>
  </div>
</template>
