export const CONTRACT_VERSION = "1.0.0";

export type Ecosystem = "npm" | "pypi";
export type Source = "hook" | "manifest" | "mcp" | "cli" | "web";

export interface PackageRef {
  ecosystem: Ecosystem;
  name: string;           // as written by the agent
  normalizedName: string; // see section 5
  version?: string;       // exact version or range, if any
  source: Source;
  rawCommand?: string;    // original shell command, when known
  intent?: string;        // what the agent wanted to do, when known (Medium)
}

export type Organ =
  | "registry" | "osv" | "name" | "grimoire" | "ledger" | "clock" | "medium" | "eye";

export type SignalId =
  | "registry.not_found" | "registry.version_missing" | "registry.young"
  | "registry.low_downloads" | "net.unreachable"
  | "osv.malware" | "osv.vulnerability"
  | "name.lookalike"
  | "grimoire.known_ghost" | "ledger.absent_then_published"
  | "clock.born_after_cutoff"
  | "medium.incoherent"
  | "eye.install_script" | "eye.network" | "eye.secret_access"
  | "eye.obfuscation" | "eye.unexpected_binary";

export type Strength = "weak" | "strong" | "decisive";

export interface Evidence {
  label: string;      // "first published", "invented by", "reads file" ...
  value: string;      // "2026-11-02", "3/3 models", "~/.ssh/id_rsa" ...
  source: string;     // URL, file path or "seance:2026-11-26"
  observedAt: string; // ISO 8601
}

export interface Signal {
  id: SignalId;
  organ: Organ;
  strength: Strength;
  summary: string;     // one English sentence, shown to humans and agents
  evidence: Evidence[];// at least one item, always
}

export interface Suggestion {
  name: string;        // must exist on the registry
  reason: string;
  from: "name" | "grimoire" | "medium";
}

export type Action = "ALLOW" | "REVIEW" | "BLOCK";
export type Diagnosis = "LIVING" | "GHOST" | "POSSESSED" | "CURSED" | "FOG";

export interface Seam {          // a Frankenstein stitch, shown in the autopsy
  organ: Organ;
  worlds: [string, string];      // e.g. ["LLM hallucinations", "package registries"]
}

export interface Verdict {
  contractVersion: string;
  package: PackageRef;
  action: Action;
  diagnosis: Diagnosis;
  headline: string;      // max 80 chars, e.g. "Ghost detected: this package does not exist on npm."
  reasons: string[];     // 1 to 3 short lines, strongest first
  suggestion?: Suggestion;
  signals: Signal[];
  seams: Seam[];
  policyVersion: string;
  checkedAt: string;     // ISO 8601
  demo: boolean;         // true when built from fixtures or cache
}

export interface CheckContext {
  now: Date;
  offline: boolean;      // demo mode: no outgoing network call at all
  timeoutMs: number;     // per provider, default 4000
  fixturesDir?: string;
  model?: string;        // model that suggested the package, if known (Clock)
}

export interface SignalProvider {
  organ: Organ;
  collect(ref: PackageRef, ctx: CheckContext): Promise<Signal[]>;
}
