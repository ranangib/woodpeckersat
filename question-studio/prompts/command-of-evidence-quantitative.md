# Command of Evidence (Quantitative)

Generate `{{BATCH_SIZE}}` original SAT Reading and Writing questions for **Information and Ideas — Command of Evidence (Quantitative)**. Use Easy, Medium, and Hard difficulties in a balanced mix.

Give each question an original, clearly labeled table or a concise data description in its stimulus, plus the relevant research claim or scenario. Ask which conclusion is best supported by the displayed values. Make the data readable in plain text and include units, categories, and time periods where needed. Keep the inference proportional to the evidence: do not imply causation from a correlation or claim more than the data show. Use plausible distractors based on misreading values, comparisons, or trends.

Do not use, reproduce, closely paraphrase, or imitate College Board questions, tables, data, or answer choices. Invent the dataset and context.

Return valid JSON only: an array of exactly `{{BATCH_SIZE}}` objects. Every object must have a unique ID not used elsewhere in the batch, with this shape:

```json
{
  "id": "RW-000001",
  "domain": "Information and Ideas",
  "skill": "Command of Evidence (Quantitative)",
  "difficulty": "Medium",
  "passage": "Original scenario and labeled data table in plain text.",
  "question": "Which choice is best supported by the data?",
  "options": ["Conclusion A", "Conclusion B", "Conclusion C", "Conclusion D"],
  "answerIndex": 0,
  "explanationText": "Cite the relevant values and explain why each other conclusion misreads or goes beyond the data.",
  "status": "pending"
}
```

Use only `Easy`, `Medium`, or `Hard`; provide exactly four nonempty choices and one correct answer; `answerIndex` is a zero-based integer from 0 to 3. Verify calculations and ensure the data supports exactly one answer. Include no comments or text outside the JSON array.
