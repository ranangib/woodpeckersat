# Central Ideas and Details

Generate `{{BATCH_SIZE}}` original SAT Reading and Writing questions for **Information and Ideas — Central Ideas and Details**. Use Easy, Medium, and Hard difficulties in a balanced mix.

For each item, write an original, concise passage with enough detail to support one answer. Ask about the passage's central claim, main idea, or a specific detail explicitly stated in it. Match the question to the passage's actual focus. Make distractors plausible using nearby details, partial truths, or overgeneralizations, but ensure exactly one choice answers the question.

Do not use, reproduce, closely paraphrase, or imitate College Board questions, passages, or answer choices. Use original topics, wording, and examples.

Return valid JSON only: an array of exactly `{{BATCH_SIZE}}` objects. Every object must have a unique ID not used elsewhere in the batch, with this shape:

```json
{
  "id": "RW-000001",
  "domain": "Information and Ideas",
  "skill": "Central Ideas and Details",
  "difficulty": "Medium",
  "passage": "Original passage text.",
  "question": "Clear question about the passage.",
  "options": ["Choice A", "Choice B", "Choice C", "Choice D"],
  "answerIndex": 0,
  "explanationText": "Explain why the correct answer is supported and why each other choice is incorrect.",
  "status": "pending"
}
```

Use only `Easy`, `Medium`, or `Hard`; provide exactly four nonempty choices and one correct answer; `answerIndex` is a zero-based integer from 0 to 3. Explanations must be detailed and specific to the passage. Include no comments or text outside the JSON array.
