# Contributing to Phantom Imports

Phantom Imports is built by a team of three for Kiroween 2026: **Juste** (project lead), **Cédric** and **Ange**.
These rules apply to every member, the group lead included. They exist so that each of us can work alone, at any time, without breaking the others.

> Internal guides and the team contract are written in French. Everything committed to this repository is written in English.

---

## 1. Key dates (Morocco time, UTC+0)

| Date | What must be true |
|---|---|
| Wed 25 Nov, 23:59 | Shared steering approved by all three. `packages/core/src/types.ts` (the contract) merged. Each member has written their first spec. |
| Fri 27 Nov, 23:59 | Checkpoint: a ghost package is blocked inside Kiro, Séance data is available, the web page renders a verdict from fixtures. |
| **Sun 29 Nov, 23:59** | **Development ends.** All PRs merged, CI green, journal up to date, credits recorded. |
| **Mon 30 Nov** | **Test day, together.** Bug fixes only. No new features. |
| 1–3 Dec | Video, write-up, README, Devpost page. Submission on 3 Dec. |

---

## 2. Ownership

| Owner | Specs | Also owns |
|---|---|---|
| Juste | S4 Séance + Grimoire + Ledger · S5 Memory Clock · S6 Medium | Repo setup, project board, competitor benchmark, video figures |
| Cédric | S1 Install-command parser · S2 Registries + OSV · S3 Verdict rules + suggestion | Product hooks, MCP server, CLI, signal integration, engine PBT |
| Ange | S7 Eye (static analysis) · S8 Autopsy page + demo mode | SVG haunted house, harmless demo packages, deployment, custom agents |

Each spec has **one owner**. Others may comment on it but do not edit it without the owner's agreement.

---

## 3. Git workflow

- `main` is protected. Nobody pushes to it directly. No force-push, ever.
- One branch per task: `feat/<name>-<spec>-<topic>`, e.g. `feat/ange-s7-install-scripts`, `fix/cedric-s1-quoted-args`.
- Commit messages follow Conventional Commits, in English:
  `feat:`, `fix:`, `test:`, `docs:`, `chore:`, `refactor:`, `spec:` (Kiro spec changes), `steer:` (steering changes).
- PR titles start with the spec or area in brackets, then a Conventional Commit:
  `[S7] feat: install-script detection`, `[setup] chore: monorepo skeleton`, `[contract] feat: types v1.0.0`.
- **The author adds their own PR to the project board** and links it to the card of their spec.
- Small, frequent PRs. A PR should be reviewable in 10 minutes.
- Every PR gets **one review**, in rotation:
  **Juste reviews Cédric · Cédric reviews Ange · Ange reviews Juste.**
  Reviews happen within 24 hours. If the reviewer is unavailable for 24 hours, the third member reviews.
- A PR that touches `packages/core/src/types.ts` is labelled `contract` and needs **both** other members' approval (see the team contract).
- Changes to `.kiro/` go through PRs like any other code.
- **Never add `.kiro/` or any of its subfolders to `.gitignore`.** That disqualifies the submission.

### PR checklist

- [ ] Title follows `[S#] type: summary`; PR added to the project board and linked to its card (`S1`…`S8`, `setup`, `contract`, `bug`, `bonus`)
- [ ] Tests and property-based tests pass locally; CI is green
- [ ] The demo path still works: `pnpm demo` (ghost blocked → verdict → suggestion → autopsy)
- [ ] No secrets, no real malware, no real ghost names in plaintext
- [ ] Journal entry written for the work in this PR
- [ ] Screenshot saved in `docs/preuves/` if Kiro did something notable

---

## 4. Working with Kiro

- **Specs** live in `.kiro/specs/<spec-id>/` (`requirements.md`, `design.md`, `tasks.md`). The owner reviews the spec before running tasks. Edit a spec; never regenerate it from scratch.
- **Steering** lives in `.kiro/steering/`. Each file has a guardian:
  `produit.md`, `structure.md`, `langue.md` → Juste · `technique.md`, `securite.md` → Cédric · `design-theme.md` → Ange.
  Changes to a steering file need the guardian's approval.
- **Hooks** use **shell actions** by default (they do not consume credits). Use an agent action only when the hook must exercise judgment.
- **Spec vs vibe coding**: anything with an architecture goes through a spec. Throwaway scripts and visual tweaks may be vibe-coded. Record which one you used in the journal.
- **Language**: we prompt Kiro in French. Code, comments, commit messages, UI text and documentation are in English.

---

## 5. Credits

Each member has **4,000 Kiro credits**: **3,000 usable** and **1,000 reserve**.

- Record your counter every working day in `docs/credits.md`.
- At **2,000 used**, say so in the group chat and switch to vibe coding where possible.
- At **3,000 used**, stop. The reserve is unlocked only by Juste, and only for a release-blocking bug.
- If one member runs short while another is ahead, we redistribute tasks. We never share accounts.
- Bonus work (Kiro Power, then Kiro Crew) starts only if development is finished on 29 Nov **and** the member has more than 1,000 credits left.

---

## 6. Sessions

### Starting a session
1. `git pull` on `main`, then rebase your branch.
2. Read the group chat and `docs/decisions.md` for anything new.
3. Note your credit counter.
4. Pick one card on the board and move it to *In progress*.
5. Open `docs/journal-kiro.md` and write the session objective.

### Ending a session
1. Commit and push your branch, even if the work is unfinished (open a draft PR).
2. Complete your journal entry: result, measure, surprise, proof.
3. Save screenshots to `docs/preuves/YYYY-MM-DD-<name>-<topic>.png`.
4. Update `docs/credits.md`.
5. Post your daily message before 23:00:
   `Done: … | Next: … | Blocked by: … | Credits used: …/3000`

### Finishing a part (Definition of Done)
A task is done when:
- the spec tasks are checked,
- tests and property-based tests pass and CI is green,
- the PR is reviewed and merged,
- the journal entry is written,
- the demo path still works.

Then move the card to *Done*, tell the person who depends on your part, and ask for review on the next one.

---

## 7. Journal template

Every working session adds one entry to `docs/journal-kiro.md`:

```
## YYYY-MM-DD · <Name> · [spec | hook | steering | MCP | PBT | agent | IDE/CLI/Web]
Goal       : what I wanted to do
In Kiro    : prompt / file / config (link to commit)
Result     : what worked, what failed
Measure    : time, attempts, bugs found, credits used
Surprise   : what Kiro did that we did not expect (or "none")
Proof      : docs/preuves/<file>.png
```

The "Surprise" line is never left empty. Never invent a surprise.

---

## 8. Communication and decisions

- We work asynchronously. Report a blocker **as soon as it happens**, not in the evening message.
- Any decision that affects someone else gets one line in `docs/decisions.md`: date, decision, who decided, why.
- Juste arbitrates when two members disagree and no consensus is reached within 12 hours.

---

## 9. Security rules

- No secrets in the repository. Use `.env` (ignored) and keep `.env.example` up to date.
- No real malware. Demo packages are harmless: they only write a marker file.
- No ghost name is ever published on the real npm or PyPI.
- The public web page never installs or executes a package. Static analysis only, with size limits, timeouts and safe extraction.
- The Grimoire is committed as hashes only. Plaintext ghost names stay outside the repository.
- Package contents sent to the Medium are treated as data, never as instructions.
