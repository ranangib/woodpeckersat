# SAT Practice Test Generation — Validation Report

Generated: 2026-11-26 16:31
Modules validated: 10 | Questions validated: 270

## Source bank

| File | Items |
|---|---:|
| `data/craft_and_structure_questions.json` | 500 |
| `data/information_and_ideas_questions.json` | 500 |
| `data/standard_conventions.json` | 500 |
| `data/expression_of_ideas_questions.json` | 500 |

Cleaning applied before selection: only `status: "approved"` items; items without exactly
four answer choices excluded; questions with identical passage + stem + answer choices
deduplicated (lowest id kept). No bank file was modified.

## 1. Question integrity

- Every emitted question is byte-identical to its bank record (wording, choices, correct
  answer, explanation, id, passage, difficulty, skill): **PASS — 270/270**
- No question was generated, rewritten or reclassified.
- Bank files untouched (read-only in this run).

## 2. Mandatory sequence check (per module)

| Module | Q1–5 | Q6–7 | Q8–8 | Q9–11 | Q12–13 | Q14–15 | Q16–19 | Q20–22 | Q23–25 | Q26–27 | Result |
|---|---|---|---|---|---|---|---|---|---|---|---|
| test-1-module-1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **PASS** |
| test-1-module-2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **PASS** |
| test-2-module-1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **PASS** |
| test-2-module-2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **PASS** |
| test-3-module-1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **PASS** |
| test-3-module-2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **PASS** |
| test-4-module-1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **PASS** |
| test-4-module-2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **PASS** |
| test-5-module-1 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **PASS** |
| test-5-module-2 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **PASS** |

## 3. Distribution and difficulty

| Module | WiC | TSP | CTC | CID | CoE | INF | BND | FSS | TRA | RSH | E/M/H | Target | Avg | Result |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| test-1-module-1 | 5 | 2 | 1 | 3 | 2 | 2 | 4 | 3 | 3 | 2 | 5/13/9 | 5/13/9 | 2.15 | **PASS** |
| test-1-module-2 | 5 | 2 | 1 | 3 | 2 | 2 | 4 | 3 | 3 | 2 | 3/7/17 | 3/7/17 | 2.52 | **PASS** |
| test-2-module-1 | 5 | 2 | 1 | 3 | 2 | 2 | 4 | 3 | 3 | 2 | 5/13/9 | 5/13/9 | 2.15 | **PASS** |
| test-2-module-2 | 5 | 2 | 1 | 3 | 2 | 2 | 4 | 3 | 3 | 2 | 3/7/17 | 3/7/17 | 2.52 | **PASS** |
| test-3-module-1 | 5 | 2 | 1 | 3 | 2 | 2 | 4 | 3 | 3 | 2 | 5/13/9 | 5/13/9 | 2.15 | **PASS** |
| test-3-module-2 | 5 | 2 | 1 | 3 | 2 | 2 | 4 | 3 | 3 | 2 | 3/7/17 | 3/7/17 | 2.52 | **PASS** |
| test-4-module-1 | 5 | 2 | 1 | 3 | 2 | 2 | 4 | 3 | 3 | 2 | 5/13/9 | 5/13/9 | 2.15 | **PASS** |
| test-4-module-2 | 5 | 2 | 1 | 3 | 2 | 2 | 4 | 3 | 3 | 2 | 3/7/17 | 3/7/17 | 2.52 | **PASS** |
| test-5-module-1 | 5 | 2 | 1 | 3 | 2 | 2 | 4 | 3 | 3 | 2 | 5/13/9 | 5/13/9 | 2.15 | **PASS** |
| test-5-module-2 | 5 | 2 | 1 | 3 | 2 | 2 | 4 | 3 | 3 | 2 | 3/7/17 | 3/7/17 | 2.52 | **PASS** |

- Test 1: Module 1 avg difficulty 2.148 < Module 2 avg 2.519 — PASS
- Test 2: Module 1 avg difficulty 2.148 < Module 2 avg 2.519 — PASS
- Test 3: Module 1 avg difficulty 2.148 < Module 2 avg 2.519 — PASS
- Test 4: Module 1 avg difficulty 2.148 < Module 2 avg 2.519 — PASS
- Test 5: Module 1 avg difficulty 2.148 < Module 2 avg 2.519 — PASS

## 4. Uniqueness

- Duplicate ids inside a module: **none — PASS**
- Duplicate ids inside a test (across its two modules): **none — PASS**
- Reuse anywhere across the five tests: 270 slots, 270 distinct ids → **PASS**
- Repeated content (same passage+stem+choices under different ids) across the built set: **none — PASS**

## 5. Structure preservation

- Cross-Text Connections carrying both passages (Q8): 10/10 — **PASS**
- Rhetorical Synthesis keeping student notes (Q26–27): 20/20 — **PASS**
- Rhetorical Synthesis task description retained in the stem: 20/20 — **PASS**
- Command of Evidence pairs (Q12–13) contain one textual + one quantitative: 10/10 modules — **PASS**
- Quantitative evidence items whose data appears inline in the passage: 8/10
- Items without exactly four choices: 0 — **PASS**
- Items without an explanation: 0 — **PASS**
- Items with an out-of-range correct answer: 0 — **PASS**

## 6. Question type assigned to each question number

### Test 1 · Module 1 (`test-1-module-1.json`)

| Q | Type | Difficulty | Bank id |
|---:|---|---|---|
| 1 | Words in Context | Easy | CS-001 |
| 2 | Words in Context | Medium | CS-168 |
| 3 | Words in Context | Medium | CS-169 |
| 4 | Words in Context | Medium | CS-170 |
| 5 | Words in Context | Hard | CS-335 |
| 6 | Text Structure and Purpose | Medium | CS-235 |
| 7 | Text Structure and Purpose | Hard | CS-401 |
| 8 | Cross-Text Connections | Easy | CS-118 |
| 9 | Central Ideas and Details | Easy | II-001 |
| 10 | Central Ideas and Details | Easy | II-004 |
| 11 | Central Ideas and Details | Easy | II-007 |
| 12 | Command of Evidence (Textual) | Medium | II-005 |
| 13 | Command of Evidence (Quantitative) | Medium | II-002 |
| 14 | Inferences | Hard | II-003 |
| 15 | Inferences | Hard | II-006 |
| 16 | Boundaries | Medium | SEC-086 |
| 17 | Boundaries | Hard | SEC-168 |
| 18 | Boundaries | Medium | SEC-087 |
| 19 | Boundaries | Hard | SEC-169 |
| 20 | Form, Structure, and Sense | Medium | SEC-334 |
| 21 | Form, Structure, and Sense | Hard | SEC-418 |
| 22 | Form, Structure, and Sense | Hard | SEC-419 |
| 23 | Transitions | Medium | EI-168 |
| 24 | Transitions | Medium | EI-169 |
| 25 | Transitions | Hard | EI-335 |
| 26 | Rhetorical Synthesis | Medium | EI-268 |
| 27 | Rhetorical Synthesis | Medium | EI-269 |

### Test 1 · Module 2 (`test-1-module-2.json`)

| Q | Type | Difficulty | Bank id |
|---:|---|---|---|
| 1 | Words in Context | Medium | CS-171 |
| 2 | Words in Context | Hard | CS-336 |
| 3 | Words in Context | Hard | CS-337 |
| 4 | Words in Context | Hard | CS-338 |
| 5 | Words in Context | Hard | CS-339 |
| 6 | Text Structure and Purpose | Medium | CS-236 |
| 7 | Text Structure and Purpose | Hard | CS-402 |
| 8 | Cross-Text Connections | Hard | CS-451 |
| 9 | Central Ideas and Details | Easy | II-010 |
| 10 | Central Ideas and Details | Easy | II-013 |
| 11 | Central Ideas and Details | Easy | II-016 |
| 12 | Command of Evidence (Textual) | Medium | II-008 |
| 13 | Command of Evidence (Quantitative) | Medium | II-014 |
| 14 | Inferences | Hard | II-009 |
| 15 | Inferences | Hard | II-012 |
| 16 | Boundaries | Hard | SEC-170 |
| 17 | Boundaries | Medium | SEC-096 |
| 18 | Boundaries | Hard | SEC-171 |
| 19 | Boundaries | Hard | SEC-173 |
| 20 | Form, Structure, and Sense | Hard | SEC-420 |
| 21 | Form, Structure, and Sense | Medium | SEC-335 |
| 22 | Form, Structure, and Sense | Hard | SEC-421 |
| 23 | Transitions | Hard | EI-336 |
| 24 | Transitions | Medium | EI-170 |
| 25 | Transitions | Hard | EI-337 |
| 26 | Rhetorical Synthesis | Hard | EI-435 |
| 27 | Rhetorical Synthesis | Hard | EI-436 |

### Test 2 · Module 1 (`test-2-module-1.json`)

| Q | Type | Difficulty | Bank id |
|---:|---|---|---|
| 1 | Words in Context | Easy | CS-002 |
| 2 | Words in Context | Medium | CS-172 |
| 3 | Words in Context | Medium | CS-173 |
| 4 | Words in Context | Medium | CS-174 |
| 5 | Words in Context | Hard | CS-340 |
| 6 | Text Structure and Purpose | Medium | CS-237 |
| 7 | Text Structure and Purpose | Hard | CS-403 |
| 8 | Cross-Text Connections | Easy | CS-119 |
| 9 | Central Ideas and Details | Easy | II-019 |
| 10 | Central Ideas and Details | Easy | II-022 |
| 11 | Central Ideas and Details | Easy | II-025 |
| 12 | Command of Evidence (Textual) | Medium | II-011 |
| 13 | Command of Evidence (Quantitative) | Medium | II-026 |
| 14 | Inferences | Hard | II-015 |
| 15 | Inferences | Hard | II-018 |
| 16 | Boundaries | Medium | SEC-097 |
| 17 | Boundaries | Hard | SEC-174 |
| 18 | Boundaries | Medium | SEC-101 |
| 19 | Boundaries | Hard | SEC-175 |
| 20 | Form, Structure, and Sense | Medium | SEC-336 |
| 21 | Form, Structure, and Sense | Hard | SEC-422 |
| 22 | Form, Structure, and Sense | Hard | SEC-423 |
| 23 | Transitions | Medium | EI-171 |
| 24 | Transitions | Medium | EI-172 |
| 25 | Transitions | Hard | EI-338 |
| 26 | Rhetorical Synthesis | Medium | EI-270 |
| 27 | Rhetorical Synthesis | Medium | EI-271 |

### Test 2 · Module 2 (`test-2-module-2.json`)

| Q | Type | Difficulty | Bank id |
|---:|---|---|---|
| 1 | Words in Context | Medium | CS-175 |
| 2 | Words in Context | Hard | CS-341 |
| 3 | Words in Context | Hard | CS-342 |
| 4 | Words in Context | Hard | CS-343 |
| 5 | Words in Context | Hard | CS-344 |
| 6 | Text Structure and Purpose | Medium | CS-238 |
| 7 | Text Structure and Purpose | Hard | CS-404 |
| 8 | Cross-Text Connections | Hard | CS-452 |
| 9 | Central Ideas and Details | Easy | II-028 |
| 10 | Central Ideas and Details | Easy | II-031 |
| 11 | Central Ideas and Details | Easy | II-034 |
| 12 | Command of Evidence (Textual) | Medium | II-017 |
| 13 | Command of Evidence (Quantitative) | Medium | II-038 |
| 14 | Inferences | Hard | II-021 |
| 15 | Inferences | Hard | II-024 |
| 16 | Boundaries | Hard | SEC-176 |
| 17 | Boundaries | Medium | SEC-102 |
| 18 | Boundaries | Hard | SEC-177 |
| 19 | Boundaries | Hard | SEC-178 |
| 20 | Form, Structure, and Sense | Hard | SEC-424 |
| 21 | Form, Structure, and Sense | Medium | SEC-337 |
| 22 | Form, Structure, and Sense | Hard | SEC-425 |
| 23 | Transitions | Hard | EI-339 |
| 24 | Transitions | Medium | EI-173 |
| 25 | Transitions | Hard | EI-340 |
| 26 | Rhetorical Synthesis | Hard | EI-437 |
| 27 | Rhetorical Synthesis | Hard | EI-438 |

### Test 3 · Module 1 (`test-3-module-1.json`)

| Q | Type | Difficulty | Bank id |
|---:|---|---|---|
| 1 | Words in Context | Easy | CS-003 |
| 2 | Words in Context | Medium | CS-176 |
| 3 | Words in Context | Medium | CS-177 |
| 4 | Words in Context | Medium | CS-178 |
| 5 | Words in Context | Hard | CS-345 |
| 6 | Text Structure and Purpose | Medium | CS-239 |
| 7 | Text Structure and Purpose | Hard | CS-405 |
| 8 | Cross-Text Connections | Easy | CS-120 |
| 9 | Central Ideas and Details | Easy | II-037 |
| 10 | Central Ideas and Details | Easy | II-040 |
| 11 | Central Ideas and Details | Easy | II-043 |
| 12 | Command of Evidence (Textual) | Medium | II-020 |
| 13 | Command of Evidence (Quantitative) | Medium | II-050 |
| 14 | Inferences | Hard | II-027 |
| 15 | Inferences | Hard | II-030 |
| 16 | Boundaries | Medium | SEC-103 |
| 17 | Boundaries | Hard | SEC-179 |
| 18 | Boundaries | Medium | SEC-104 |
| 19 | Boundaries | Hard | SEC-180 |
| 20 | Form, Structure, and Sense | Medium | SEC-338 |
| 21 | Form, Structure, and Sense | Hard | SEC-426 |
| 22 | Form, Structure, and Sense | Hard | SEC-427 |
| 23 | Transitions | Medium | EI-174 |
| 24 | Transitions | Medium | EI-175 |
| 25 | Transitions | Hard | EI-341 |
| 26 | Rhetorical Synthesis | Medium | EI-272 |
| 27 | Rhetorical Synthesis | Medium | EI-273 |

### Test 3 · Module 2 (`test-3-module-2.json`)

| Q | Type | Difficulty | Bank id |
|---:|---|---|---|
| 1 | Words in Context | Medium | CS-179 |
| 2 | Words in Context | Hard | CS-346 |
| 3 | Words in Context | Hard | CS-347 |
| 4 | Words in Context | Hard | CS-348 |
| 5 | Words in Context | Hard | CS-349 |
| 6 | Text Structure and Purpose | Medium | CS-240 |
| 7 | Text Structure and Purpose | Hard | CS-406 |
| 8 | Cross-Text Connections | Hard | CS-453 |
| 9 | Central Ideas and Details | Easy | II-046 |
| 10 | Central Ideas and Details | Easy | II-049 |
| 11 | Central Ideas and Details | Easy | II-052 |
| 12 | Command of Evidence (Textual) | Medium | II-023 |
| 13 | Command of Evidence (Quantitative) | Medium | II-062 |
| 14 | Inferences | Hard | II-033 |
| 15 | Inferences | Hard | II-036 |
| 16 | Boundaries | Hard | SEC-183 |
| 17 | Boundaries | Medium | SEC-105 |
| 18 | Boundaries | Hard | SEC-184 |
| 19 | Boundaries | Hard | SEC-186 |
| 20 | Form, Structure, and Sense | Hard | SEC-428 |
| 21 | Form, Structure, and Sense | Medium | SEC-339 |
| 22 | Form, Structure, and Sense | Hard | SEC-429 |
| 23 | Transitions | Hard | EI-342 |
| 24 | Transitions | Medium | EI-176 |
| 25 | Transitions | Hard | EI-343 |
| 26 | Rhetorical Synthesis | Hard | EI-439 |
| 27 | Rhetorical Synthesis | Hard | EI-440 |

### Test 4 · Module 1 (`test-4-module-1.json`)

| Q | Type | Difficulty | Bank id |
|---:|---|---|---|
| 1 | Words in Context | Easy | CS-004 |
| 2 | Words in Context | Medium | CS-180 |
| 3 | Words in Context | Medium | CS-181 |
| 4 | Words in Context | Medium | CS-182 |
| 5 | Words in Context | Hard | CS-350 |
| 6 | Text Structure and Purpose | Medium | CS-241 |
| 7 | Text Structure and Purpose | Hard | CS-407 |
| 8 | Cross-Text Connections | Easy | CS-121 |
| 9 | Central Ideas and Details | Easy | II-055 |
| 10 | Central Ideas and Details | Easy | II-058 |
| 11 | Central Ideas and Details | Easy | II-061 |
| 12 | Command of Evidence (Textual) | Medium | II-029 |
| 13 | Command of Evidence (Quantitative) | Medium | II-074 |
| 14 | Inferences | Hard | II-039 |
| 15 | Inferences | Hard | II-042 |
| 16 | Boundaries | Medium | SEC-106 |
| 17 | Boundaries | Hard | SEC-187 |
| 18 | Boundaries | Medium | SEC-107 |
| 19 | Boundaries | Hard | SEC-188 |
| 20 | Form, Structure, and Sense | Medium | SEC-340 |
| 21 | Form, Structure, and Sense | Hard | SEC-430 |
| 22 | Form, Structure, and Sense | Hard | SEC-431 |
| 23 | Transitions | Medium | EI-177 |
| 24 | Transitions | Medium | EI-178 |
| 25 | Transitions | Hard | EI-344 |
| 26 | Rhetorical Synthesis | Medium | EI-274 |
| 27 | Rhetorical Synthesis | Medium | EI-275 |

### Test 4 · Module 2 (`test-4-module-2.json`)

| Q | Type | Difficulty | Bank id |
|---:|---|---|---|
| 1 | Words in Context | Medium | CS-183 |
| 2 | Words in Context | Hard | CS-351 |
| 3 | Words in Context | Hard | CS-352 |
| 4 | Words in Context | Hard | CS-353 |
| 5 | Words in Context | Hard | CS-354 |
| 6 | Text Structure and Purpose | Medium | CS-242 |
| 7 | Text Structure and Purpose | Hard | CS-408 |
| 8 | Cross-Text Connections | Hard | CS-454 |
| 9 | Central Ideas and Details | Easy | II-064 |
| 10 | Central Ideas and Details | Easy | II-067 |
| 11 | Central Ideas and Details | Easy | II-070 |
| 12 | Command of Evidence (Textual) | Medium | II-032 |
| 13 | Command of Evidence (Quantitative) | Medium | II-086 |
| 14 | Inferences | Hard | II-045 |
| 15 | Inferences | Hard | II-048 |
| 16 | Boundaries | Hard | SEC-190 |
| 17 | Boundaries | Medium | SEC-108 |
| 18 | Boundaries | Hard | SEC-191 |
| 19 | Boundaries | Hard | SEC-192 |
| 20 | Form, Structure, and Sense | Hard | SEC-432 |
| 21 | Form, Structure, and Sense | Medium | SEC-341 |
| 22 | Form, Structure, and Sense | Hard | SEC-433 |
| 23 | Transitions | Hard | EI-345 |
| 24 | Transitions | Medium | EI-179 |
| 25 | Transitions | Hard | EI-346 |
| 26 | Rhetorical Synthesis | Hard | EI-441 |
| 27 | Rhetorical Synthesis | Hard | EI-442 |

### Test 5 · Module 1 (`test-5-module-1.json`)

| Q | Type | Difficulty | Bank id |
|---:|---|---|---|
| 1 | Words in Context | Easy | CS-005 |
| 2 | Words in Context | Medium | CS-184 |
| 3 | Words in Context | Medium | CS-185 |
| 4 | Words in Context | Medium | CS-186 |
| 5 | Words in Context | Hard | CS-355 |
| 6 | Text Structure and Purpose | Medium | CS-243 |
| 7 | Text Structure and Purpose | Hard | CS-409 |
| 8 | Cross-Text Connections | Easy | CS-122 |
| 9 | Central Ideas and Details | Easy | II-073 |
| 10 | Central Ideas and Details | Easy | II-076 |
| 11 | Central Ideas and Details | Easy | II-079 |
| 12 | Command of Evidence (Textual) | Medium | II-035 |
| 13 | Command of Evidence (Quantitative) | Medium | II-098 |
| 14 | Inferences | Hard | II-051 |
| 15 | Inferences | Hard | II-054 |
| 16 | Boundaries | Medium | SEC-109 |
| 17 | Boundaries | Hard | SEC-193 |
| 18 | Boundaries | Medium | SEC-110 |
| 19 | Boundaries | Hard | SEC-194 |
| 20 | Form, Structure, and Sense | Medium | SEC-342 |
| 21 | Form, Structure, and Sense | Hard | SEC-434 |
| 22 | Form, Structure, and Sense | Hard | SEC-435 |
| 23 | Transitions | Medium | EI-180 |
| 24 | Transitions | Medium | EI-181 |
| 25 | Transitions | Hard | EI-347 |
| 26 | Rhetorical Synthesis | Medium | EI-276 |
| 27 | Rhetorical Synthesis | Medium | EI-277 |

### Test 5 · Module 2 (`test-5-module-2.json`)

| Q | Type | Difficulty | Bank id |
|---:|---|---|---|
| 1 | Words in Context | Medium | CS-187 |
| 2 | Words in Context | Hard | CS-356 |
| 3 | Words in Context | Hard | CS-357 |
| 4 | Words in Context | Hard | CS-358 |
| 5 | Words in Context | Hard | CS-359 |
| 6 | Text Structure and Purpose | Medium | CS-244 |
| 7 | Text Structure and Purpose | Hard | CS-410 |
| 8 | Cross-Text Connections | Hard | CS-455 |
| 9 | Central Ideas and Details | Easy | II-082 |
| 10 | Central Ideas and Details | Easy | II-085 |
| 11 | Central Ideas and Details | Easy | II-088 |
| 12 | Command of Evidence (Textual) | Medium | II-041 |
| 13 | Command of Evidence (Quantitative) | Medium | II-110 |
| 14 | Inferences | Hard | II-057 |
| 15 | Inferences | Hard | II-060 |
| 16 | Boundaries | Hard | SEC-195 |
| 17 | Boundaries | Medium | SEC-111 |
| 18 | Boundaries | Hard | SEC-197 |
| 19 | Boundaries | Hard | SEC-198 |
| 20 | Form, Structure, and Sense | Hard | SEC-436 |
| 21 | Form, Structure, and Sense | Medium | SEC-343 |
| 22 | Form, Structure, and Sense | Hard | SEC-437 |
| 23 | Transitions | Hard | EI-348 |
| 24 | Transitions | Medium | EI-182 |
| 25 | Transitions | Hard | EI-349 |
| 26 | Rhetorical Synthesis | Hard | EI-443 |
| 27 | Rhetorical Synthesis | Hard | EI-444 |

## 7. Verdict

All 10 modules pass every mandatory check: exact sequence, exact distribution,
exact difficulty quotas, zero reuse, and full question integrity.

Module 2 uses the approved 3 Easy / 7 Medium / 17 Hard quota (the specified 2/8/17 is
unsatisfiable because all 167 Central Ideas items are labelled Easy and every module
must contain three of them).
