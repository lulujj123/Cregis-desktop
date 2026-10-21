/** eds-org-data-list responsive column visibility (progressive display + first/last). */

export const DATA_LIST_BREAKPOINT_WIDE = 1120;

/** 列表级伸缩预留：Σ列 minWidth + reserve = DataList 容器宽度。 */
export const DATA_LIST_FLEX_RESERVE_PX = 80;

export type ResponsiveColumnMeta = {
  slotIndex: number;
  minWidthPx: number;
  displayOrder: number;
  isAction: boolean;
};

export function resolveColumnMinWidthPx(minWidth?: string, fallback = 160): number {
  if (!minWidth) return fallback;
  const parsed = Number.parseFloat(minWidth);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function getVisibleColumnSlotIndices(
  columns: ResponsiveColumnMeta[],
  containerWidth: number,
  options: {
    /** 客户端整体视口宽度（非 DataList 容器宽），用于 1120 断点。 */
    clientViewportWidth?: number;
    skidOpen?: boolean;
    selectOffsetPx?: number;
    /** Desktop shell: keep every column; honor min-width via horizontal scroll. */
    keepAllColumns?: boolean;
  } = {},
): number[] {
  if (columns.length === 0) return [];

  const budget = Math.max(
    0,
    containerWidth - (options.selectOffsetPx ?? 0) - DATA_LIST_FLEX_RESERVE_PX,
  );
  const totalMin = columns.reduce((sum, col) => sum + col.minWidthPx, 0);

  if (options.keepAllColumns || totalMin <= budget) {
    return columns.map((col) => col.slotIndex);
  }

  const viewportWidth = options.clientViewportWidth ?? containerWidth;
  const sorted = [...columns].sort((a, b) => a.displayOrder - b.displayOrder);

  if (sorted.length === 1) {
    return [sorted[0].slotIndex];
  }

  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const visible = new Set<number>([first.slotIndex, last.slotIndex]);

  if (viewportWidth >= DATA_LIST_BREAKPOINT_WIDE) {
    let used = first.minWidthPx + last.minWidthPx;

    for (const col of sorted) {
      if (col.slotIndex === first.slotIndex || col.slotIndex === last.slotIndex) {
        continue;
      }
      if (used + col.minWidthPx <= budget) {
        visible.add(col.slotIndex);
        used += col.minWidthPx;
      }
    }
  }

  if (options.skidOpen && visible.size > 1) {
    visible.delete(last.slotIndex);
  }

  return columns.map((col) => col.slotIndex).filter((slotIndex) => visible.has(slotIndex));
}
