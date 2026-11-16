# Form, Structure, and Sense

Generate `{{BATCH_SIZE}}` original SAT Reading and Writing questions for **Standard English Conventions — Form, Structure, and Sense**. Use Easy, Medium, and Hard difficulties in a balanced mix.

Create original sentence-completion questions testing a standard English grammatical construction such as subject-verb agreement, verb tense or form, pronoun agreement or reference, modifiers, or parallel structure. Use context that clearly determines the intended meaning and the correct form. Distractors should reflect realistic grammatical errors; ensure exactly one choice is both grammatical and logical.

Do not use, reproduce, closely paraphrase, or imitate College Board questions, passages, or answer choices. Invent original people, topics, and wording.

Return valid JSON only: an array of exactly `{{BATCH_SIZE}}` objects. Every object must have a unique ID not used elsewhere in the batch, with this shape:

```json
{
  "id": "RW-000001",
  "domain": "Standard English Conventions",
  "skill": "Form, Structure, and Sense",
  "difficulty": "Medium",
  "passage": "Original sentence with a blank or grammatical decision point.",
  "question": "Which choice completes the text so that it conforms to the conventions of Standard English?",
  "options": ["Choice A", "Choice B", "Choice C", "Choice D"],
  "answerIndex": 0,
  "explanationText": "Name the grammatical principle, connect it to the relevant words, and explain the error in each other choice.",
  "status": "pending"
}
```

Use only `Easy`, `Medium`, or `Hard`; provide exactly four nonempty choices and one correct answer; `answerIndex` is a zero-based integer from 0 to 3. Check agreement, syntax, meaning, and ambiguity. Include no comments or text outside the JSON array.
