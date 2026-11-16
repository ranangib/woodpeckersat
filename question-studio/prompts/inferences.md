# Inferences

Generate `{{BATCH_SIZE}}` original SAT Reading and Writing questions for **Information and Ideas — Inferences**. Use Easy, Medium, and Hard difficulties in a balanced mix.

Write an original passage with specific clues that support one reasonable conclusion without stating it directly. Ask what can best be inferred from those clues. Ensure the correct choice follows from the text without outside knowledge or assumptions. Distractors may be plausible but must be unsupported, too broad, or contradicted by the passage.

Do not use, reproduce, closely paraphrase, or imitate College Board questions, passages, or answer choices. Invent original wording, people, settings, and facts.

Return valid JSON only: an array of exactly `{{BATCH_SIZE}}` objects. Every object must have a unique ID not used elsewhere in the batch, with this shape:

```json
{
  "id": "RW-000001",
  "domain": "Information and Ideas",
  "skill": "Inferences",
  "difficulty": "Medium",
  "passage": "Original passage containing relevant clues.",
  "question": "Which choice is best supported by the passage?",
  "options": ["Inference A", "Inference B", "Inference C", "Inference D"],
  "answerIndex": 0,
  "explanationText": "Identify the textual clues that support the correct inference and why each other choice is unsupported or contradicted.",
  "status": "pending"
}
```

Use only `Easy`, `Medium`, or `Hard`; provide exactly four nonempty choices and one correct answer; `answerIndex` is a zero-based integer from 0 to 3. Include no comments or text outside the JSON array.
