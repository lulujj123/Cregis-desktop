/** Showcase list-field-time · Team Account transaction time column. */
export function buildTeamAccountTimeCustomize(time: string): Record<string, unknown> {
  return {
    datetime: time,
    lineLayout: 'single',
    tooltipTrigger: 'hover',
  };
}
