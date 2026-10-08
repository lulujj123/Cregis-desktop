<script setup lang="ts">
import { computed } from 'vue';
import {
  EgFilter,
  createFilterTranslate,
  type EgFilterCondition,
  type EgFilterField,
  type EgFilterLogicMode,
  type EgFilterOperator,
} from '@eds/desktop-components';
import { useAppI18n } from '@/composables/useAppI18n';

const props = withDefaults(
  defineProps<{
    fields: EgFilterField[];
    operators: EgFilterOperator[];
    disabled?: boolean;
    /** EgFilter 触发按钮文案真源（默认「筛选」）；经 translate 后按语言显示。 */
    triggerLabel?: string;
  }>(),
  {
    triggerLabel: '筛选',
  },
);

const conditions = defineModel<EgFilterCondition[]>({ default: () => [] });
const logicMode = defineModel<EgFilterLogicMode>('logicMode', { default: 'all' });

const { locale, ui } = useAppI18n();
const filterTranslate = computed(() => {
  const filterUi = createFilterTranslate(locale.value);
  return (text: string) => {
    // Prefer EDS filter catalog first so source「筛选」→ en「Filter」,
    // while zh-CN stays「筛选」/ zh-TW「篩選」.
    const filterText = filterUi(text);
    if (filterText !== text) return filterText;
    return ui(text);
  };
});
</script>

<template>
  <EgFilter
    v-model="conditions"
    v-model:logic-mode="logicMode"
    :fields="props.fields"
    :operators="props.operators"
    :translate="filterTranslate"
    :trigger-label="props.triggerLabel"
    add-label="添加条件"
    :max-conditions="20"
    placement="bottom"
    align="start"
    value-align="end"
    boundary-selector=".app-preview"
    teleport-to=".app-preview"
    :disabled="props.disabled"
  />
</template>
