---
inclusion: always
---

# Product

Phantom Imports guards the door of your AI coding agent. Pitch in three words: **Predict · Block · Explain**.

> Your AI agent will never summon a ghost into your project again.

## Problem

AI agents invent package names, and different models often invent the same ones. Attackers publish malicious code under those names (slopsquatting). Agents now install packages on their own, and ghost names spread through instruction files (the react-codeshift case, 2026).

## Audience

- Developers who code with AI agents (Kiro, Claude Code, Cursor...).
- Small teams that accept pull requests written by agents.

## Promise

- **Predict**: we know ghost names before attackers do, because we harvest them from the models themselves (the Séance).
- **Block**: the install is stopped before it runs, inside Kiro (hook), in the CLI, through MCP and on the web page.
- **Explain**: every verdict comes with one reason, the evidence, and a fix ("Did you mean jscodeshift?").

## Verdicts

Three actions, identical on every surface (hook, CLI, MCP, web):

| Action | Meaning |
|---|---|
| ALLOW | Safe to install. |
| REVIEW | A human should look before installing. |
| BLOCK | Do not install. |

Each action carries a diagnosis (same codes as the `Diagnosis` type in `packages/core/src/types.ts`):

| Diagnosis | Meaning |
|---|---|
| LIVING | Healthy package. |
| GHOST | The package does not exist. |
| POSSESSED | It exists, but is probably not what the agent thinks. |
| CURSED | Known vulnerability or malware. |
| FOG | We could not verify it. FOG is never ALLOW. |

Rules that never bend:

- Facts decide. Only the Judge produces the verdict, with deterministic, readable rules.
- The Medium (LLM) is only called when there is already at least one unfavourable signal. It never turns an unfavourable fact into ALLOW and never creates a BLOCK on its own.
- A network error or missing data never gives ALLOW.
- On weak signals, prefer REVIEW over BLOCK.

## User-facing text

- One verdict, one reason, one fix. Short, plain English sentences.
- Organ names (Séance, Grimoire, Clock, Medium, Eye) stay in the autopsy page as Frankenstein stitches. They are never jargon in the main text.

## What we do not do

- No Docker sandbox and no package execution, anywhere. The Eye is static analysis only.
- No playable game: the haunted house is a static SVG driven by real findings.
- No embeddings or Soundex: edit distance plus mappings learned during the Séance.
- No live monitoring or Kiro Crew in the main scope (bonus only, after 29 Nov).
- No ghost name is ever published to npm or PyPI, and the Grimoire is only committed as hashes.
- No real malware: demo packages are harmless and only write a marker file.
