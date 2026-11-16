# Command of Evidence (Textual)

Generate `{{BATCH_SIZE}}` original SAT Reading and Writing questions for **Information and Ideas — Command of Evidence (Textual)**. Use Easy, Medium, and Hard difficulties in a balanced mix.

Write an original passage and a clear claim, inference, or interpretation that the student must support. Ask which quotation or detail from the passage most strongly supports that exact claim. Make all four choices plausible textual evidence from the passage, but ensure only one directly supports the complete claim. Avoid choices that are merely related to the topic.

Do not use, reproduce, closely paraphrase, or imitate College Board questions, passages, or answer choices. Invent the passage, claim, evidence, and wording.

Return valid JSON only: an array of exactly `{{BATCH_SIZE}}` objects. Every object must have a unique ID not used elsewhere in the batch, with this shape:

```json
{
  "id": "RW-000001",
  "domain": "Information and Ideas",
  "skill": "Command of Evidence (Textual)",
  "difficulty": "Medium",
  "passage": "Original passage that contains the evidence.",
  "question": "Which choice most effectively supports the claim?",
  "options": ["Evidence A", "Evidence B", "Evidence C", "Evidence D"],
  "answerIndex": 0,
  "explanationText": "Connect the correct evidence to the exact claim and explain why each other choice does not support it as directly.",
  "status": "pending"
}
```

Use only `Easy`, `Medium`, or `Hard`; provide exactly four nonempty choices and one correct answer; `answerIndex` is a zero-based integer from 0 to 3. Explanations must be detailed and grounded in the passage. Include no comments or text outside the JSON array.
