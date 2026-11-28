# Requirements Document

## Introduction

Phantom Imports compares package names across registries, the Grimoire, the Clock and the Ledger. These comparisons only work if every name is reduced to one canonical form. This spec covers the single normalization function `normalize(ecosystem, name)` in `packages/core/src/normalize.ts` (section 5 of the contract). It returns the canonical package name only. Parsing the version is the job of the command parser, not of this function.

## Glossary

- **Normalizer**: The function `normalize(ecosystem, name)` exported from `packages/core/src/normalize.ts`.
- **Ecosystem**: The type imported from `packages/core/src/types.ts` (`"npm" | "pypi"`).
- **Raw_Name**: The string passed to the Normalizer, as written by an agent or a user. It may contain surrounding whitespace, an extras list or a version.
- **Canonical_Name**: The string returned by the Normalizer.
- **Scope**: The `@scope/` prefix of an npm package name, such as `@types/` in `@types/node`.
- **Extras**: A bracketed list after a PyPI name, such as `[socks]` in `requests[socks]`.
- **Version_Suffix**: Any version or version constraint attached to a Raw_Name, such as `@18.2.0` (npm) or `==2.31` and `>=2.0,<3` (PyPI).
- **Separator_Run**: One or more consecutive characters from the set `-`, `_` and `.`.

## Requirements

### Requirement 1: Normalize npm names

**User Story:** As a developer of Phantom Imports, I want npm names reduced to one canonical form, so that the same package always produces the same lookup key.

#### Acceptance Criteria

1. WHEN the Normalizer receives a Raw_Name with the ecosystem `npm`, THE Normalizer SHALL remove whitespace at both ends of the Raw_Name.
2. WHEN the Normalizer receives a Raw_Name with the ecosystem `npm`, THE Normalizer SHALL convert the Raw_Name to lowercase.
3. WHEN an npm Raw_Name starts with a Scope, THE Normalizer SHALL keep the Scope in the Canonical_Name.
4. WHEN an npm Raw_Name contains a Version_Suffix, THE Normalizer SHALL remove the Version_Suffix, so that `react@18.2.0` returns `react`.
5. WHEN a scoped npm Raw_Name contains a Version_Suffix, THE Normalizer SHALL remove only the Version_Suffix and keep the Scope, so that `@types/node@20` returns `@types/node`.
6. WHEN the Normalizer receives an npm Raw_Name, THE Normalizer SHALL leave the characters `-`, `_` and `.` unchanged.

### Requirement 2: Normalize PyPI names

**User Story:** As a developer of Phantom Imports, I want PyPI names normalized with the PEP 503 rule, so that case variants such as `Requests` and `REQUESTS` match `requests`, and separator variants such as `re_quests`, `re.quests`, `Re--Quests` and `re-quests` match `re-quests`.

#### Acceptance Criteria

1. WHEN the Normalizer receives a Raw_Name with the ecosystem `pypi`, THE Normalizer SHALL remove whitespace at both ends of the Raw_Name.
2. WHEN the Normalizer receives a Raw_Name with the ecosystem `pypi`, THE Normalizer SHALL convert the Raw_Name to lowercase.
3. WHEN a PyPI Raw_Name contains a Separator_Run, THE Normalizer SHALL replace each Separator_Run with a single `-`.
4. WHEN a PyPI Raw_Name contains Extras, THE Normalizer SHALL remove the Extras, so that `requests[socks]` returns `requests`.
5. WHEN a PyPI Raw_Name contains a Version_Suffix, THE Normalizer SHALL remove the Version_Suffix, so that `requests[socks]==2.31` returns `requests`.

### Requirement 3: Pure and total function

**User Story:** As a developer of Phantom Imports, I want the Normalizer to be safe to call anywhere, so that no caller needs defensive code around it.

#### Acceptance Criteria

1. THE Normalizer SHALL return the same Canonical_Name for the same Ecosystem and Raw_Name on every call.
2. THE Normalizer SHALL perform no input or output operation and keep no state between calls.
3. IF the Raw_Name is an empty string or contains only whitespace, THEN THE Normalizer SHALL return an empty string.
4. IF the Raw_Name is not a string at run time, THEN THE Normalizer SHALL return an empty string.
5. IF the Ecosystem is not a known value at run time, THEN THE Normalizer SHALL return an empty string.
6. IF any input causes an internal error, THEN THE Normalizer SHALL return an empty string instead of throwing.
7. THE Normalizer SHALL return only the Canonical_Name and SHALL NOT return the version.

### Requirement 4: Single source of normalization

**User Story:** As a maintainer, I want one normalization function in the whole repository, so that no surface can disagree with another.

#### Acceptance Criteria

1. THE Normalizer SHALL import the Ecosystem type from `packages/core/src/types.ts`.
2. THE Normalizer SHALL be the only name normalization function in the repository.
3. THE Normalizer SHALL be exported from `packages/core/src/normalize.ts`.

### Requirement 5: Property-based verification

**User Story:** As a maintainer, I want the Normalizer proven by property-based tests, so that edge cases are found before users hit them.

#### Acceptance Criteria

1. FOR ALL Ecosystem and Raw_Name inputs, normalizing the Canonical_Name a second time SHALL return the same Canonical_Name (idempotence).
2. FOR ALL PyPI Raw_Names that differ only by letter case or by the choice and length of their Separator_Runs, THE Normalizer SHALL return the same Canonical_Name, so that `Requests` and `REQUESTS` return `requests`, and `re_quests`, `re.quests`, `Re--Quests` and `re-quests` return `re-quests` (equivalence).
3. FOR ALL string inputs, THE Normalizer SHALL return a string and SHALL NOT throw.
4. FOR ALL Raw_Names with a generated Version_Suffix appended, THE Normalizer SHALL return the same Canonical_Name as for the Raw_Name without the Version_Suffix.
5. THE test suite SHALL run with Vitest and fast-check without calling the network.
