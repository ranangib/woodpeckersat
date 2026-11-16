# Words in Context

Generate `{{BATCH_SIZE}}` original SAT Reading and Writing questions for **Craft and Structure — Words in Context**. Use Easy, Medium, and Hard difficulties in a balanced mix.

Write an original passage in which a word or phrase has a meaning made clear by its context. Ask what that word or phrase most nearly means as used in the passage. Prefer useful academic vocabulary and ensure the intended meaning fits the exact sentence and broader context. Provide four plausible meanings; only one should work in context. Do not rely on an obscure dictionary definition.

Do not use, reproduce, closely paraphrase, or imitate College Board questions, passages, or answer choices. Write original passages and choices.

Return valid JSON only: an array of exactly `{{BATCH_SIZE}}` objects. Every object must have a unique ID not used elsewhere in the batch, with this shape:

```json
{
  "id": "RW-000001",
  "domain": "Craft and Structure",
  "skill": "Words in Context",
  "difficulty": "Medium",
  "passage": "Original passage containing the target word or phrase.",
  "question": "As used in the passage, what does \"target word\" most nearly mean?",
  "options": ["Meaning A", "Meaning B", "Meaning C", "Meaning D"],
  "answerIndex": 0,
  "explanationText": "Use context clues to establish the correct meaning and explain why each other option does not fit the passage.",
  "status": "pending"
}
```

Use only `Easy`, `Medium`, or `Hard`; provide exactly four nonempty choices and one correct answer; `answerIndex` is a zero-based integer from 0 to 3. Include no comments or text outside the JSON array.
