# WoodpeckerSAT Copilot question prompts

These are development-time prompt templates for GitHub Copilot. The question studio and published website do not call an AI service.

## Use a template

1. Open a skill prompt and replace `{{BATCH_SIZE}}` with a small number such as `3`.
2. Ask GitHub Copilot to return only the requested JSON array.
3. Save the result as a `.json` file and import it into Question Studio.
4. Imported questions always enter pending review, regardless of their supplied status.
5. Review and edit every question. Approve each one explicitly before exporting.

Use each question's unique ID only once. If a batch is combined with existing questions, check IDs and content before import. All text and passages must be newly written; do not reproduce or closely paraphrase College Board material.

## Skill templates

- [Central Ideas and Details](central-ideas-and-details.md)
- [Command of Evidence (Textual)](command-of-evidence-textual.md)
- [Command of Evidence (Quantitative)](command-of-evidence-quantitative.md)
- [Inferences](inferences.md)
- [Words in Context](words-in-context.md)
- [Text Structure and Purpose](text-structure-and-purpose.md)
- [Cross-Text Connections](cross-text-connections.md)
- [Rhetorical Synthesis](rhetorical-synthesis.md)
- [Transitions](transitions.md)
- [Boundaries](boundaries.md)
- [Form, Structure, and Sense](form-structure-and-sense.md)

Each prompt asks for original, pending questions. The studio's automated checks verify structure and flag potential issues; they cannot establish academic correctness. Human review remains required.
