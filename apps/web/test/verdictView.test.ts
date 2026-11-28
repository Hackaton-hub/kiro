import { describe, expect, it } from "vitest";
import fc from "fast-check";
import type { Action, Diagnosis, Verdict } from "@phantom/core";
import { lookup } from "../src/demoStore";
import { verdictView } from "../src/verdictView";

function fixture(name: string): Verdict {
  const result = lookup(name);
  if (result.kind !== "found") throw new Error(`fixture ${name} not found`);
  return result.verdict;
}

function withAction(action: Action): Verdict {
  return { ...fixture("demo-ghost-lib"), action };
}

function withDiagnosis(diagnosis: Diagnosis): Verdict {
  return { ...fixture("demo-ghost-lib"), diagnosis };
}

describe("verdictView action mapping (3.1, 3.2)", () => {
  it.each([
    ["ALLOW", "✓", "ectoplasm"],
    ["REVIEW", "⚠", "candle"],
    ["BLOCK", "✗", "blood"],
  ] as const)("%s maps to icon %s and color %s", (action, icon, color) => {
    const view = verdictView(withAction(action));
    expect(view.actionWord).toBe(action);
    expect(view.icon).toBe(icon);
    expect(view.actionColor).toBe(color);
  });
});

describe("verdictView diagnosis mapping (3.2)", () => {
  it.each([
    ["LIVING", "ectoplasm"],
    ["GHOST", "blood"],
    ["POSSESSED", "pumpkin"],
    ["CURSED", "blood"],
    ["FOG", "candle"],
  ] as const)("%s maps to color %s", (diagnosis, color) => {
    const view = verdictView(withDiagnosis(diagnosis));
    expect(view.diagnosisTag).toBe(diagnosis);
    expect(view.diagnosisColor).toBe(color);
  });
});

describe("verdictView on the demo fixtures", () => {
  it("ghost fixture gives the suggestion text (3.4)", () => {
    const view = verdictView(fixture("demo-ghost-lib"));
    expect(view.suggestionText).toBe("Did you mean demo-healthy-lib?");
    expect(view.suggestionName).toBe("demo-healthy-lib");
  });

  it("fixtures without a suggestion have no suggestion fields", () => {
    const view = verdictView(fixture("demo-healthy-lib"));
    expect(view.suggestionText).toBeUndefined();
    expect(view.suggestionName).toBeUndefined();
  });

  it.each(["demo-healthy-lib", "demo-ghost-lib", "demo-possessed-lib"])(
    "%s copies headline and reasons unchanged (9.2)",
    (name) => {
      const v = fixture(name);
      const view = verdictView(v);
      expect(view.headline).toBe(v.headline);
      expect(view.reasons).toEqual(v.reasons);
      expect(view.packageName).toBe(v.package.name);
      expect(view.ecosystem).toBe(v.package.ecosystem);
    },
  );
});

const DIAGNOSES: Diagnosis[] = ["LIVING", "GHOST", "POSSESSED", "CURSED", "FOG"];

// Feature: s8-autopsy-page, Property 2: Non-ALLOW verdicts display at least one reason
describe("Property 2: Non-ALLOW verdicts display at least one reason", () => {
  it("keeps 1 to 3 reasons, unchanged and in order, for REVIEW and BLOCK", () => {
    const base = fixture("demo-ghost-lib");
    fc.assert(
      fc.property(
        fc.constantFrom<Action>("REVIEW", "BLOCK"),
        fc.constantFrom(...DIAGNOSES),
        fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 3 }),
        fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
        (action, diagnosis, reasons, suggestionName) => {
          const v: Verdict = { ...base, action, diagnosis, reasons };
          if (suggestionName === undefined) delete v.suggestion;
          else v.suggestion = { name: suggestionName, reason: "r", from: "name" };
          const view = verdictView(v);
          expect(view.reasons.length).toBeGreaterThanOrEqual(1);
          expect(view.reasons).toEqual(reasons);
        },
      ),
      { numRuns: 100 },
    );
  });
});
