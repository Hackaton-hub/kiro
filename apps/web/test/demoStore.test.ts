import { describe, expect, it } from "vitest";
import type { Verdict } from "@phantom/core";
import { isVerdict, lookup } from "../src/demoStore";

function fixture(name: string): Verdict {
  const result = lookup(name);
  if (result.kind !== "found") throw new Error(`fixture ${name} not found`);
  return result.verdict;
}

// Deep clone so variants never mutate the shared fixture objects.
function variant(name: string): Record<string, unknown> {
  return structuredClone(fixture(name)) as unknown as Record<string, unknown>;
}

const NAMES = ["demo-healthy-lib", "demo-ghost-lib", "demo-possessed-lib"];

describe("demo fixtures", () => {
  it.each(NAMES)("%s passes isVerdict via lookup", (name) => {
    expect(lookup(name).kind).toBe("found");
  });

  it.each(NAMES)("%s respects shared invariants (1.7)", (name) => {
    const v = fixture(name);
    expect(v.demo).toBe(true);
    expect(v.headline.length).toBeLessThanOrEqual(80);
    expect(v.reasons.length).toBeLessThanOrEqual(3);
    if (v.action !== "ALLOW") expect(v.reasons.length).toBeGreaterThanOrEqual(1);
    for (const s of v.signals) expect(s.evidence.length).toBeGreaterThanOrEqual(1);
  });

  it("healthy is ALLOW / LIVING (1.2)", () => {
    const v = fixture("demo-healthy-lib");
    expect(v.action).toBe("ALLOW");
    expect(v.diagnosis).toBe("LIVING");
    expect(v.reasons).toHaveLength(1);
  });

  it("ghost is BLOCK / GHOST with registry.not_found and a suggestion (1.3)", () => {
    const v = fixture("demo-ghost-lib");
    expect(v.action).toBe("BLOCK");
    expect(v.diagnosis).toBe("GHOST");
    expect(v.signals.map((s) => s.id)).toContain("registry.not_found");
    expect(v.suggestion?.name).toBe("demo-healthy-lib");
  });

  it("possessed is BLOCK / POSSESSED with install_script and network evidence (1.4, 1.5)", () => {
    const v = fixture("demo-possessed-lib");
    expect(v.action).toBe("BLOCK");
    expect(v.diagnosis).toBe("POSSESSED");
    const ids = v.signals.map((s) => s.id);
    expect(ids).toContain("eye.install_script");
    expect(ids).toContain("eye.network");
    for (const s of v.signals.filter((x) => x.organ === "eye")) {
      for (const e of s.evidence) expect(e.value).toMatch(/\S+:\d+$/);
    }
  });
});

describe("isVerdict (I8)", () => {
  it("accepts ALLOW with 0 reasons", () => {
    const v = variant("demo-healthy-lib");
    v["reasons"] = [];
    expect(isVerdict(v)).toBe(true);
  });

  it("rejects BLOCK with 0 reasons", () => {
    const v = variant("demo-ghost-lib");
    v["reasons"] = [];
    expect(isVerdict(v)).toBe(false);
  });

  it("rejects 4 reasons", () => {
    const v = variant("demo-ghost-lib");
    v["reasons"] = ["a", "b", "c", "d"];
    expect(isVerdict(v)).toBe(false);
  });

  it.each(["contractVersion", "action", "diagnosis", "reasons", "headline", "signals", "seams", "package"])(
    "rejects a missing %s field",
    (field) => {
      const v = variant("demo-ghost-lib");
      delete v[field];
      expect(isVerdict(v)).toBe(false);
    },
  );

  it("rejects an unknown action", () => {
    const v = variant("demo-ghost-lib");
    v["action"] = "DENY";
    expect(isVerdict(v)).toBe(false);
  });
});

describe("lookup", () => {
  it("uses the name exactly as typed (7.4)", () => {
    expect(lookup("Demo-Ghost-Lib")).toEqual({ kind: "unknown" });
  });

  it("returns unknown for an empty or prototype-like name (2.3)", () => {
    expect(lookup("")).toEqual({ kind: "unknown" });
    expect(lookup("constructor")).toEqual({ kind: "unknown" });
  });
});
