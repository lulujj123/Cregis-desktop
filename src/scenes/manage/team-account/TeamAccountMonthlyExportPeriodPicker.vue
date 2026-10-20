<script setup lang="ts">
/**
 * Period picker inside Generate Monthly Statement export tooltip.
 * Uses one EgFlotation + side-by-side year/month columns on hover (no nested hover
 * teleports — those fail across Safari/Chrome inside click EgTooltip panels).
 */
import { computed, ref, watch } from 'vue';
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

const period = defineModel<string>({ required: true });

const periodYears = computed(() => listMonthlyExportYears());
const selectedPeriod = computed(() => parseMonthlyExportPeriodLabel(period.value));

const hoverYear = ref<number | null>(null);

const activeYear = computed(() => {
  if (hoverYear.value != null) return hoverYear.value;
  if (selectedPeriod.value?.year != null) return selectedPeriod.value.year;
  return periodYears.value[0] ?? null;
});

const monthsForActiveYear = computed(() => {
  const year = activeYear.value;
  if (year == null) return [];
  return listMonthlyExportMonthOptions(year);
});

function isYearSelected(year: number) {
  return selectedPeriod.value?.year === year;
}

function isMonthSelected(year: number, monthIndex: number) {
  return (
    selectedPeriod.value?.year === year && selectedPeriod.value.monthIndex === monthIndex
  );
}

function onYearPointerEnter(year: number) {
  hoverYear.value = year;
}

function onPickerOpen() {
  hoverYear.value = selectedPeriod.value?.year ?? periodYears.value[0] ?? null;
}

function onPickerClose() {
  hoverYear.value = null;
}

function onMonthClick(year: number, monthIndex: number, closeRoot: () => void) {
  period.value = formatMonthlyExportPeriodLabel(year, monthIndex);
  hoverYear.value = null;
  closeRoot();
}

watch(
  () => period.value,
  () => {
    if (hoverYear.value == null && selectedPeriod.value?.year != null) {
      hoverYear.value = selectedPeriod.value.year;
    }
  },
);
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
      @open="onPickerOpen"
      @close="onPickerClose"
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
          :max-height="280"
          list-scroll
          :scrollable="true"
          :show-add="false"
          :show-divider="false"
        >
          <div :class="styles.cascadeColumns">
            <div :class="styles.yearColumn">
              <div
                v-for="year in periodYears"
                :key="year"
                :class="[
                  styles.yearRow,
                  activeYear === year && styles.yearRowActive,
                ]"
                @mouseenter="onYearPointerEnter(year)"
                @pointerenter="onYearPointerEnter(year)"
              >
                <EgFlotationMenuItem
                  host-tag="div"
                  box-type="text"
                  :label="String(year)"
                  :show-tag="false"
                  show-cascader
                  :focused="activeYear === year || isYearSelected(year)"
                />
              </div>
            </div>
            <div
              v-if="activeYear != null"
              :class="styles.monthColumn"
              aria-hidden="false"
            >
              <EgFlotationMenuItem
                v-for="month in monthsForActiveYear"
                :key="`${activeYear}-${month.monthIndex}`"
                box-type="text"
                :label="month.shortLabel"
                :show-tag="false"
                :focused="isMonthSelected(activeYear, month.monthIndex)"
                @click="onMonthClick(activeYear, month.monthIndex, close)"
              />
            </div>
          </div>
        </EgFlotationMenu>
      </template>
    </EgFlotation>
  </div>
</template>
