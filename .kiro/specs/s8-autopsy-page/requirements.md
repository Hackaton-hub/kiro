# Requirements Document

## Introduction

The autopsy page is a static Vite + TypeScript page in `apps/web` (no framework). It shows one `Verdict` for one package so a judge understands the result in 30 seconds: one verdict, one reason, one fix. The page only displays a `Verdict` produced elsewhere. It never recomputes a verdict and never calls a provider.

Delivery is phased. Milestone 1 (first night) delivers only the verdict card for three example packages, read from three hand-written Verdict files. The haunted house, the timeline and online mode come in later milestones.

## Glossary

- **Autopsy_Page**: The web page in `apps/web`.
- **Verdict**: The type imported from `@phantom/core` (`packages/core/src/types.ts`). It is never redefined in `apps/web`.
- **Demo_Mode**: Mode where the Autopsy_Page reads Verdicts from `demo/verdicts/<ecosystem>__<name>.json` and makes no outgoing network call.
- **Online_Mode**: Mode where the Autopsy_Page sends `POST /api/check` with `{ ecosystem, name }` and receives a Verdict.
- **Verdict_Card**: The block showing the action word, icon, color, headline, reasons and suggestion.
- **Seam_Badge**: A badge showing the organ names of one `Seam`. The only place organ names appear.
- **Haunted_House**: A static SVG with one room per `eye.*` signal.
- **Timeline**: The "model memory ▸ package birth" display built from `clock.*` signal evidence.
- **Text_Chronology**: An accessible text list repeating the information of the Haunted_House and the Timeline.
- **Example_Button**: One of three buttons: `demo-healthy-lib`, `demo-ghost-lib`, `demo-possessed-lib` (all npm).
- **Night**, **Mist**, **Pumpkin**, **Ectoplasm**, **Candle**, **Blood**: Palette colors defined in the design-theme steering.

## Requirements

### Requirement 1: Demo verdict fixtures (Milestone 1)

**User Story:** As a judge, I want three ready-made examples, so that I can see ALLOW, GHOST and POSSESSED results without setup.

#### Acceptance Criteria

1. THE Demo_Mode SHALL provide the files `demo/verdicts/npm__demo-healthy-lib.json`, `demo/verdicts/npm__demo-ghost-lib.json` and `demo/verdicts/npm__demo-possessed-lib.json`.
2. THE healthy file SHALL contain a Verdict with action ALLOW and diagnosis LIVING.
3. THE ghost file SHALL contain a Verdict with action BLOCK, diagnosis GHOST, one `registry.not_found` signal and a suggestion named `demo-healthy-lib`.
4. THE possessed file SHALL contain a Verdict with action BLOCK, diagnosis POSSESSED, one `eye.install_script` signal and one `eye.network` signal.
5. THE possessed file SHALL give each `eye.*` signal at least one Evidence item that names the analysed file and line.
6. THE three files SHALL conform to the Verdict type, including `contractVersion` and `demo` set to true.
7. FOR ALL three files, THE Verdict SHALL contain 1 to 3 reasons and a headline of at most 80 characters.

### Requirement 2: Summon a package (Milestone 1)

**User Story:** As a visitor, I want to pick an example or type a package, so that I can see its autopsy.

#### Acceptance Criteria

1. THE Autopsy_Page SHALL display a "Summon a package" text input and three Example_Buttons.
2. WHEN a visitor activates an Example_Button, THE Autopsy_Page SHALL load the matching Verdict file and display the Verdict_Card.
3. (Milestone 1) WHEN a visitor submits a package name in Demo_Mode, THE Autopsy_Page SHALL compare the name as typed, unchanged, to the three demo Verdicts, and IF it matches none, THEN THE Autopsy_Page SHALL display the "No demo autopsy for this package" state.
4. THE Autopsy_Page SHALL support keyboard activation of the input and every Example_Button.
5. (Milestone 2) WHEN a visitor submits a package name in Demo_Mode, THE Autopsy_Page SHALL normalize it with `normalize` from `@phantom/core` before the lookup. Note: `normalize` is not yet implemented in `@phantom/core` (owner: Cédric), which is why this criterion is in Milestone 2.
6. (Milestone 1 and 2) THE Autopsy_Page SHALL define no normalization function of its own.

### Requirement 3: Verdict card (Milestone 1)

**User Story:** As a developer, I want the verdict, the reason and the fix in one card, so that I know what to do in seconds.

#### Acceptance Criteria

1. THE Verdict_Card SHALL display the action word (ALLOW, REVIEW or BLOCK), the matching icon (✓, ⚠ or ✗) and the matching color, together with the headline.
2. THE Verdict_Card SHALL display the diagnosis in a tag that uses the diagnosis color.
3. THE Verdict_Card SHALL display the reasons after the headline, strongest first.
4. WHERE the Verdict contains a suggestion, THE Verdict_Card SHALL display "Did you mean <name>?" as a clickable element after the reasons.
5. WHEN a visitor activates the suggestion, THE Autopsy_Page SHALL load the Verdict of the suggested package.
6. THE Verdict_Card SHALL use Night as text color on every colored fill.
7. THE Autopsy_Page SHALL use Inter for text, JetBrains Mono for package names, versions and commands, and Creepster only for titles of 32px and above. (Milestone 2)
8. THE Autopsy_Page SHALL load all fonts from files in `apps/web`. (Milestone 2)
9. THE Autopsy_Page SHALL keep a contrast ratio of at least 4.5:1 between text and its background.
10. WHILE colors are not available, THE Verdict_Card SHALL still show the action word and icon.
11. THE Verdict_Card SHALL show no organ name in its headline, reasons or suggestion.
12. (Milestone 1) THE Autopsy_Page SHALL use system fallback fonts and SHALL NOT load any font from a CDN.

### Requirement 4: Seam badges (Milestone 2)

**User Story:** As a judge, I want to see which parts the verdict is stitched from, so that I understand the engine.

#### Acceptance Criteria

1. THE Autopsy_Page SHALL display one Seam_Badge per `Seam` of the Verdict, showing both `worlds` values.
2. THE Autopsy_Page SHALL show organ names only inside Seam_Badges.

### Requirement 5: Haunted house (Milestone 3)

**User Story:** As a judge, I want to see where the package misbehaves, so that the finding feels concrete.

#### Acceptance Criteria

1. THE Haunted_House SHALL contain one room per `eye.*` signal of the Verdict, mapped as follows: `eye.secret_access` to bedroom, `eye.network` to attic, `eye.install_script` to entrance, `eye.obfuscation` to cellar, `eye.unexpected_binary` to study.
2. THE Haunted_House SHALL show, for each room, the label and value of the Evidence items of its signal.
3. IF the Verdict contains no `eye.*` signal, THEN THE Autopsy_Page SHALL display a text stating that no static-analysis finding is available, and no room.
4. THE Haunted_House SHALL be an SVG generated from the Verdict, with no animation loop.
5. THE Haunted_House SHALL provide a text alternative for each room.

### Requirement 6: Timeline and text chronology (Milestone 3)

**User Story:** As a visitor using a screen reader, I want the same information as text, so that I miss nothing.

#### Acceptance Criteria

1. WHERE the Verdict contains `clock.born_after_cutoff` evidence, THE Timeline SHALL show "model memory ▸ package birth" with the dates taken from that evidence.
2. IF the Verdict contains no `clock.*` signal, THEN THE Autopsy_Page SHALL omit the Timeline.
3. THE Text_Chronology SHALL list, in order, every Timeline date and every Haunted_House finding of the Verdict.
4. FOR ALL Verdicts, THE Text_Chronology SHALL contain every Evidence value shown in the Haunted_House and the Timeline.

### Requirement 7: Page states and fail-safe (Milestone 1)

**User Story:** As a visitor, I want clear feedback, so that I never mistake a missing result for a safe one.

#### Acceptance Criteria

1. WHILE a Verdict is loading, THE Autopsy_Page SHALL display a loading message.
2. WHILE no package has been summoned, THE Autopsy_Page SHALL display an empty state inviting the visitor to pick an example.
3. IF the Verdict file for a submitted name does not exist in Demo_Mode, THEN THE Autopsy_Page SHALL display "No demo autopsy for this package" and the three Example_Buttons.
4. IF loading fails or the data is not a valid Verdict, THEN THE Autopsy_Page SHALL display an error message with a retry button.
5. IF no Verdict is available, THEN THE Autopsy_Page SHALL NOT display ALLOW, a LIVING tag or a green color.

### Requirement 8: Demo mode isolation (Milestone 1)

**User Story:** As a maintainer, I want demo mode to stay offline, so that the demo works anywhere and is safe.

In Demo_Mode, the Verdicts are included in the build and are not read by request.

#### Acceptance Criteria

1. WHILE Demo_Mode is active, THE Autopsy_Page SHALL call fetch zero times.
2. FOR ALL package names generated by fast-check, THE Autopsy_Page in Demo_Mode SHALL never call fetch (invariant I6).

### Requirement 9: Single source of truth

**User Story:** As a maintainer, I want the page to only display results, so that the engine stays in one place.

#### Acceptance Criteria

1. THE Autopsy_Page SHALL import the Verdict type from `@phantom/core`.
2. THE Autopsy_Page SHALL display the action, diagnosis, reasons and suggestion exactly as stored in the Verdict.
3. THE Autopsy_Page SHALL install, import or execute no analysed package.
4. THE Autopsy_Page SHALL call no signal provider.
5. (Milestone 2) THE Autopsy_Page SHALL import `normalize` from `@phantom/core`.

### Requirement 10: Online mode (Milestone 4)

**User Story:** As a visitor, I want to check any package, so that I am not limited to the examples.

#### Acceptance Criteria

1. WHERE Online_Mode is enabled, WHEN a visitor submits a package name, THE Autopsy_Page SHALL send `POST /api/check` with `{ ecosystem, name }`.
2. WHERE Online_Mode is enabled, WHEN the response is a valid Verdict, THE Autopsy_Page SHALL display it with the same components as Demo_Mode.
3. IF the `/api/check` request fails, times out or returns an invalid body, THEN THE Autopsy_Page SHALL display the error state and no ALLOW.

### Requirement 11: Delivery phasing

**User Story:** As a team member, I want a strict build order, so that a working card exists first.

#### Acceptance Criteria

1. THE first milestone SHALL deliver only Requirements 1, 2 (except 2.5), 3 (except 3.7 and 3.8, and the Seam_Badge and house content), 7, 8 and 9 (except 9.5).
2. THE second milestone SHALL deliver Requirement 4, criterion 2.5, criteria 3.7 and 3.8, and criterion 9.5.
3. THE third milestone SHALL deliver Requirements 5 and 6.
4. THE fourth milestone SHALL deliver Requirement 10.
