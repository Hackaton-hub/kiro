import type { Action, Diagnosis, Verdict } from "@phantom/core";

export type ColorToken = "ectoplasm" | "candle" | "blood" | "pumpkin";
export type ActionIcon = "✓" | "⚠" | "✗";

export interface VerdictView {
  packageName: string;
  ecosystem: string;
  actionWord: Action;
  icon: ActionIcon;
  actionColor: ColorToken;
  diagnosisTag: Diagnosis;
  diagnosisColor: ColorToken;
  headline: string;
  reasons: string[];
  suggestionText?: string;
  suggestionName?: string;
}

const ACTION_VIEW: Record<Action, { icon: ActionIcon; color: ColorToken }> = {
  ALLOW: { icon: "✓", color: "ectoplasm" },
  REVIEW: { icon: "⚠", color: "candle" },
  BLOCK: { icon: "✗", color: "blood" },
};

const DIAGNOSIS_COLOR: Record<Diagnosis, ColorToken> = {
  LIVING: "ectoplasm",
  GHOST: "blood",
  POSSESSED: "pumpkin",
  CURSED: "blood",
  FOG: "candle",
};

// Pure and DOM-free. Text fields are copied unchanged. It never reads
// `signals` or `seams`, so no organ name can reach the main text.
export function verdictView(v: Verdict): VerdictView {
  const action = ACTION_VIEW[v.action];
  const view: VerdictView = {
    packageName: v.package.name,
    ecosystem: v.package.ecosystem,
    actionWord: v.action,
    icon: action.icon,
    actionColor: action.color,
    diagnosisTag: v.diagnosis,
    diagnosisColor: DIAGNOSIS_COLOR[v.diagnosis],
    headline: v.headline,
    reasons: [...v.reasons],
  };
  if (v.suggestion) {
    view.suggestionName = v.suggestion.name;
    view.suggestionText = `Did you mean ${v.suggestion.name}?`;
  }
  return view;
}
