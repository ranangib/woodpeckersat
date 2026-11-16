# Transitions

Generate `{{BATCH_SIZE}}` original SAT Reading and Writing questions for **Expression of Ideas — Transitions**. Use Easy, Medium, and Hard difficulties in a balanced mix.

Write an original sentence pair or short passage with a clear logical relationship across the blank: contrast, cause and effect, continuation, example, sequence, or another precise relationship. Ask which transition best completes the text. Ensure the surrounding ideas establish one relationship and only one answer expresses it accurately. Avoid relying on punctuation alone or ambiguous logic.

Do not use, reproduce, closely paraphrase, or imitate College Board questions, passages, or answer choices. Use original sentences and transitions.

Return valid JSON only: an array of exactly `{{BATCH_SIZE}}` objects. Every object must have a unique ID not used elsewhere in the batch, with this shape:

```json
{
  "id": "RW-000001",
  "domain": "Expression of Ideas",
  "skill": "Transitions",
  "difficulty": "Medium",
  "passage": "Original sentence pair with a blank marking the transition.",
  "question": "Which choice most logically completes the text?",
  "options": ["Transition A", "Transition B", "Transition C", "Transition D"],
  "answerIndex": 0,
  "explanationText": "Describe the relationship between the ideas and why the correct transition fits better than each alternative.",
  "status": "pending"
}
```

Use only `Easy`, `Medium`, or `Hard`; provide exactly four nonempty choices and one correct answer; `answerIndex` is a zero-based integer from 0 to 3. Include no comments or text outside the JSON array.
