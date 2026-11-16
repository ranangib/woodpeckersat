# Cross-Text Connections

Generate `{{BATCH_SIZE}}` original SAT Reading and Writing questions for **Craft and Structure — Cross-Text Connections**. Use Easy, Medium, and Hard difficulties in a balanced mix.

For each question, create two short, original texts about a shared topic. Give the authors distinct, clearly identifiable perspectives or claims. Ask how the second author would most likely respond to a specific claim, evidence, or position in the first text. The answer must be supported by the second author's stated view; distractors should misrepresent, overstate, or confuse the authors' positions.

Do not use, reproduce, closely paraphrase, or imitate College Board questions, paired texts, or answer choices. Invent both texts and their viewpoints.

Return valid JSON only: an array of exactly `{{BATCH_SIZE}}` objects. Every object must have a unique ID not used elsewhere in the batch, with this shape:

```json
{
  "id": "RW-000001",
  "domain": "Craft and Structure",
  "skill": "Cross-Text Connections",
  "difficulty": "Medium",
  "passage": "Text 1: [original text]\n\nText 2: [original text]",
  "question": "Based on Text 2, how would the author most likely respond to the claim in Text 1?",
  "options": ["Response A", "Response B", "Response C", "Response D"],
  "answerIndex": 0,
  "explanationText": "Cite the relevant positions in both texts and explain why each other response misrepresents the second author's view.",
  "status": "pending"
}
```

Use only `Easy`, `Medium`, or `Hard`; provide exactly four nonempty choices and one correct answer; `answerIndex` is a zero-based integer from 0 to 3. Include no comments or text outside the JSON array.
