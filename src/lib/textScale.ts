export const TEXT_SCALE_STEPS: readonly number[] = [0.85, 1, 1.15, 1.3, 1.45];
export const DEFAULT_TEXT_SCALE_INDEX = 1;
export const DEFAULT_TEXT_SCALE = TEXT_SCALE_STEPS[DEFAULT_TEXT_SCALE_INDEX];

export function textScaleIndex(scale: number): number {
  const index = TEXT_SCALE_STEPS.indexOf(scale);
  return index >= 0 ? index : DEFAULT_TEXT_SCALE_INDEX;
}

export function nearestTextScale(scale: number): number {
  return TEXT_SCALE_STEPS[textScaleIndex(scale)];
}

export function nextTextScale(scale: number): number {
  const index = textScaleIndex(scale);
  return TEXT_SCALE_STEPS[(index + 1) % TEXT_SCALE_STEPS.length];
}
