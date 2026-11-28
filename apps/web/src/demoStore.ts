import type { Verdict } from "@phantom/core";

const files = import.meta.glob("../../../demo/verdicts/*.json", {
  eager: true,
  import: "default",
}) as Record<string, unknown>;

// Indexed by file stem (e.g. "npm__demo-ghost-lib"). A Map avoids
// prototype keys such as "constructor" matching by accident.
const store = new Map<string, unknown>(
  Object.entries(files).map(([path, data]) => {
    const stem = path.slice(path.lastIndexOf("/") + 1).replace(/\.json$/, "");
    return [stem, data] as [string, unknown];
  }),
);

export type LookupResult =
  | { kind: "found"; verdict: Verdict }
  | { kind: "unknown" }
  | { kind: "invalid" };

const ACTIONS: readonly string[] = ["ALLOW", "REVIEW", "BLOCK"];
const DIAGNOSES: readonly string[] = ["LIVING", "GHOST", "POSSESSED", "CURSED", "FOG"];

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

// Structural guard at the data boundary. It rejects and never repairs.
export function isVerdict(x: unknown): x is Verdict {
  if (!isRecord(x)) return false;
  if (typeof x["contractVersion"] !== "string") return false;

  const action = x["action"];
  if (typeof action !== "string" || !ACTIONS.includes(action)) return false;
  const diagnosis = x["diagnosis"];
  if (typeof diagnosis !== "string" || !DIAGNOSES.includes(diagnosis)) return false;

  const reasons = x["reasons"];
  if (!Array.isArray(reasons) || !reasons.every((r) => typeof r === "string")) return false;
  const minReasons = action === "ALLOW" ? 0 : 1;
  if (reasons.length < minReasons || reasons.length > 3) return false;

  if (typeof x["headline"] !== "string") return false;
  if (!Array.isArray(x["signals"]) || !Array.isArray(x["seams"])) return false;

  const pkg = x["package"];
  return isRecord(pkg) && typeof pkg["name"] === "string";
}

// The name is used exactly as typed: no trim, no lowercase, no normalization.
export function lookup(name: string): LookupResult {
  const key = `npm__${name}`;
  if (!store.has(key)) return { kind: "unknown" };
  const data = store.get(key);
  return isVerdict(data) ? { kind: "found", verdict: data } : { kind: "invalid" };
}
