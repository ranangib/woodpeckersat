# Boundaries

Generate `{{BATCH_SIZE}}` original SAT Reading and Writing questions for **Standard English Conventions — Boundaries**. Use Easy, Medium, and Hard difficulties in a balanced mix.

Create original sentence-completion questions that assess how sentences, independent clauses, dependent clauses, introductory elements, or items in a series are joined and punctuated. The surrounding text must make the grammatical boundary clear. Use choices that vary only as appropriate in punctuation, conjunction, or boundary wording; ensure exactly one standard and logical completion. Do not make more than one choice defensible.

Do not use, reproduce, closely paraphrase, or imitate College Board questions, passages, or answer choices. Invent original sentences and contexts.

Return valid JSON only: an array of exactly `{{BATCH_SIZE}}` objects. Every object must have a unique ID not used elsewhere in the batch, with this shape:

```json
{
  "id": "RW-000001",
  "domain": "Standard English Conventions",
  "skill": "Boundaries",
  "difficulty": "Medium",
  "passage": "Original sentence with a blank or boundary to complete.",
  "question": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "options": ["Choice A", "Choice B", "Choice C", "Choice D"],
  "answerIndex": 0,
  "explanationText": "Identify the relevant clause or phrase boundaries and explain why the correct punctuation or connector works and why each alternative does not.",
  "status": "pending"
}
```

Use only `Easy`, `Medium`, or `Hard`; provide exactly four nonempty choices and one correct answer; `answerIndex` is a zero-based integer from 0 to 3. Check every option against standard grammar and punctuation. Include no comments or text outside the JSON array.
