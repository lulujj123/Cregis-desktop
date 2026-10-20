<script setup lang="ts">
/**
 * Period picker for Generate Monthly Statement (inside export EgTooltip).
 * Inline menu — no EgFlotation teleport — so Chrome does not treat year/month
 * interaction as an outside click and close the statement panel.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import {
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

const period = defineModel<string>({ required: true });

const rootRef = ref<HTMLElement | null>(null);
const menuOpen = ref(false);

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

function openMenu() {
  menuOpen.value = true;
  hoverYear.value = selectedPeriod.value?.year ?? periodYears.value[0] ?? null;
}

function closeMenu() {
  menuOpen.value = false;
  hoverYear.value = null;
}

function toggleMenu() {
  if (menuOpen.value) {
    closeMenu();
    return;
  }
  openMenu();
}

function onMonthClick(year: number, monthIndex: number) {
  period.value = formatMonthlyExportPeriodLabel(year, monthIndex);
  closeMenu();
}

function onDocumentPointerDown(event: PointerEvent) {
  if (!menuOpen.value) return;
  const root = rootRef.value;
  const target = event.target;
  if (root && target instanceof Node && root.contains(target)) return;
  closeMenu();
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown, true);
});

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown, true);
});

watch(
  () => period.value,
  () => {
    if (!menuOpen.value && selectedPeriod.value?.year != null) {
      hoverYear.value = selectedPeriod.value.year;
    }
  },
);
</script>

<template>
  <div ref="rootRef" :class="styles.root">
    <EgFlotationTrigger
      trigger-style="outline"
      size="md"
      width-mode="adaptive"
      :label="period"
      :expanded="menuOpen"
      @click.stop="toggleMenu"
    />
    <div
      v-if="menuOpen"
      :class="['desktopTokens', 'effect-flotation-box', styles.dropdown, styles.menuAdaptive]"
      data-export-period-inline-menu
      data-no-corner-smoothing
      @pointerdown.stop
    >
      <EgFlotationMenu
        :class="styles.menu"
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
          <div v-if="activeYear != null" :class="styles.monthColumn">
            <EgFlotationMenuItem
              v-for="month in monthsForActiveYear"
              :key="`${activeYear}-${month.monthIndex}`"
              box-type="text"
              :label="month.shortLabel"
              :show-tag="false"
              :focused="isMonthSelected(activeYear, month.monthIndex)"
              @click="onMonthClick(activeYear, month.monthIndex)"
            />
          </div>
        </div>
      </EgFlotationMenu>
    </div>
  </div>
</template>
