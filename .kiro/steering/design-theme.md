---
inclusion: always
---

# Design theme

The "Halloween night" charter applies to the hook message, the CLI, the web page, the README and the video.

## Palette

| Name | Hex | Use |
|---|---|---|
| Night | `#1A1024` | Background |
| Mist | `#EEE8F4` | Body text |
| Pumpkin | `#E8772E` | Brand accent, links, buttons, POSSESSED |
| Ectoplasm | `#6EE7A8` | ALLOW, LIVING |
| Candle | `#F2C14E` | REVIEW, FOG |
| Blood | `#FF5C6C` | BLOCK, GHOST, CURSED |

Contrast on Night: Mist 15.3, Ectoplasm 11.9, Candle 10.9, Pumpkin 6.2, Blood 6.1 (all above 4.5:1). Check any new pair before using it.

- Text on a colored fill (buttons, badges, tags) is always Night, never Mist or white: light text on Pumpkin, Blood, Ectoplasm or Candle fails 4.5:1.

## Verdicts and diagnoses

| Verdict | Color | Icon | Word |
|---|---|---|---|
| ALLOW | Ectoplasm | ✓ | ALLOW |
| REVIEW | Candle | ⚠ | REVIEW |
| BLOCK | Blood | ✗ | BLOCK |

| Diagnosis | Color |
|---|---|
| LIVING | Ectoplasm |
| GHOST | Blood |
| POSSESSED | Pumpkin |
| CURSED | Blood |
| FOG | Candle |

- The verdict color wins in the headline. The diagnosis keeps its own color in its tag.

## Fonts

- Inter: all text.
- JetBrains Mono: code, commands, package names, versions.
- Creepster (SIL OFL, Google Fonts): titles only, 32px and above. Never for body text or labels.
- Fonts are self-hosted in `apps/web` (no Google Fonts CDN): demo mode makes no outgoing network call.

## Tone

- Humor in headlines, facts in the body.
- One verdict, one reason, one fix. Short, plain sentences.
- All generated UI text (page, CLI, hook) is in English, even when the prompt is in French.

## Accessibility

- Contrast of at least 4.5:1 for text.
- Never color alone: always word + icon + color. This also holds in the CLI when colors are disabled (`NO_COLOR`).

## Organ names

- Séance, Grimoire, Clock, Medium and Eye appear only in the stitch badges of the autopsy page.
- They are never jargon in the main text. Say "models invented it", not "the Séance flagged it", unless inside a badge.

## Hook message

Written to stderr, 5 lines maximum, in this order: headline, reason, evidence, suggestion, fix.

```
PHANTOM IMPORTS · BLOCK · Ghost
react-codeshift (npm) does not exist on the registry.
Invented by 3/3 models during our Séance (2026-11-26).
Did you mean: jscodeshift ?
Fix: replace react-codeshift with jscodeshift, then retry.
```

- For REVIEW, the last line becomes: `Ask the user before installing. To allow: add it to .phantom/allowlist.json.`
- Drop the "Did you mean" line when there is no suggestion. Never exceed 5 lines.
- The Séance mention in the evidence line is the only organ name allowed here, as a source citation.
