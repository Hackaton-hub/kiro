---
inclusion: always
---

# Repository structure

TypeScript (Node 20+), pnpm monorepo. Tests with Vitest and fast-check.

```
.
├── .kiro/
│   ├── steering/        product, technical, structure, security, design-theme, language
│   ├── specs/           one small spec per feature (S1 to S8)
│   ├── hooks/           product hooks and development hooks
│   ├── agents/          security-reviewer, qa-replay
│   └── settings/        mcp.json (our MCP server + a docs MCP)
├── packages/
│   ├── core/            contract types, normalize, judge, signal providers
│   ├── cli/             `phantom check` command
│   └── mcp/             MCP server: check_package, check_manifest
├── apps/
│   └── web/             autopsy page (Vite) and demo mode
├── grimoire/            hashed ghost names (SHA-256) and their sources
├── data/                clock.json and other sourced reference data
├── demo/
│   └── fixtures/        registry, medium cache, harmless fake packages
├── docs/                journal-kiro.md, decisions.md, credits.md, preuves/
├── LICENSE              MIT
└── README.md
```

## Where things go

- `packages/core/src/types.ts` is the shared contract. Any change goes through a `[contract]` PR approved by the two other members.
- Each signal provider lives in `packages/core` and exports the name fixed by the contract (`grimoireProvider`, `ledgerProvider`, `clockProvider`, `mediumProvider`...).
- Only the Judge (`packages/core`) decides a verdict. CLI, MCP, hooks and web only call it and display the result.
- Fixtures used by tests and demo mode go in `demo/fixtures/`. Demo mode never makes an outbound network call.
- Plaintext ghost names and raw harvest output go in `.local/`, which is git-ignored. Only hashes are committed in `grimoire/`.
- Screenshots go in `docs/preuves/YYYY-MM-DD-<name>-<topic>.png`.

## Rules

- `.kiro/` and its subfolders are never added to `.gitignore`.
- Specs live in `.kiro/specs/<spec-id>/` with `requirements.md`, `design.md` and `tasks.md`. Edit a spec, never regenerate it.
- No secrets in the repository. Use `.env` (ignored) and keep `.env.example` up to date.
