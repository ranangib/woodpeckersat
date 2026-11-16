# Rhetorical Synthesis

Generate `{{BATCH_SIZE}}` original SAT Reading and Writing questions for **Expression of Ideas — Rhetorical Synthesis**. Use Easy, Medium, and Hard difficulties in a balanced mix.

Provide a concise set of original research notes and a clear rhetorical goal (for example, emphasizing a comparison, illustrating a finding, or introducing a specific example). Ask which choice best uses the notes to achieve that goal. The correct response must use only relevant notes accurately and satisfy the stated goal; distractors should be true but miss the goal, omit important information, or distort the notes.

Do not use, reproduce, closely paraphrase, or imitate College Board questions, notes, or answer choices. Invent the topic, facts, and wording.

Return valid JSON only: an array of exactly `{{BATCH_SIZE}}` objects. Every object must have a unique ID not used elsewhere in the batch, with this shape:

```json
{
  "id": "RW-000001",
  "domain": "Expression of Ideas",
  "skill": "Rhetorical Synthesis",
  "difficulty": "Medium",
  "passage": "Original goal: ...\nNotes: ...",
  "question": "Which choice most effectively uses the notes to accomplish the goal?",
  "options": ["Sentence A", "Sentence B", "Sentence C", "Sentence D"],
  "answerIndex": 0,
  "explanationText": "Show how the correct choice uses the relevant notes to meet the goal and why each other choice fails to do so.",
  "status": "pending"
}
```

Use only `Easy`, `Medium`, or `Hard`; provide exactly four nonempty choices and one correct answer; `answerIndex` is a zero-based integer from 0 to 3. Check that the selected response does not add unsupported facts. Include no comments or text outside the JSON array.
