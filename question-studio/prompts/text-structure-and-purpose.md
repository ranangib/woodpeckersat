# Text Structure and Purpose

Generate `{{BATCH_SIZE}}` original SAT Reading and Writing questions for **Craft and Structure — Text Structure and Purpose**. Use Easy, Medium, and Hard difficulties in a balanced mix.

Write an original passage with a clear relationship among its sentences or paragraphs. Ask about the function of a specific sentence, detail, paragraph, or organizational move, or how the passage is structured. The correct answer must describe what the referenced text does in context, not merely repeat its topic. Make distractors plausible but inconsistent with the passage's actual organization or purpose.

Do not use, reproduce, closely paraphrase, or imitate College Board questions, passages, or answer choices. Invent the topic and wording.

Return valid JSON only: an array of exactly `{{BATCH_SIZE}}` objects. Every object must have a unique ID not used elsewhere in the batch, with this shape:

```json
{
  "id": "RW-000001",
  "domain": "Craft and Structure",
  "skill": "Text Structure and Purpose",
  "difficulty": "Medium",
  "passage": "Original passage with a clear structure or rhetorical move.",
  "question": "What is the primary function of the specified sentence in the passage?",
  "options": ["Function A", "Function B", "Function C", "Function D"],
  "answerIndex": 0,
  "explanationText": "Explain how the relevant text functions in the passage and why the other descriptions do not match.",
  "status": "pending"
}
```

Use only `Easy`, `Medium`, or `Hard`; provide exactly four nonempty choices and one correct answer; `answerIndex` is a zero-based integer from 0 to 3. Include no comments or text outside the JSON array.
