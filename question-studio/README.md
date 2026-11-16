# WoodpeckerSAT Question Studio

This is a static, browser-only question review tool. It uses no AI or external API, server, database, or Node.js runtime. Open `index.html` from the repository or host the folder as static files.

## Local data and privacy

The JSON files in `data/` are empty starter files. Browser JavaScript cannot write changes back to those files, so your working collections are autosaved in this browser's `localStorage`. Use the export buttons to download copies regularly; clearing site data or switching browsers/devices will otherwise lose the saved collections. The changed/export indicator refers to changes not yet downloaded.

Every imported question enters **Pending**, even if the source file says it is approved. A question must pass structural checks and be explicitly approved in the studio before it can appear in the approved collection. Approval itself does not publish or edit anything on the website.

## Generate, import, review, and export

1. Open a skill prompt from [`prompts/README.md`](prompts/README.md) and ask GitHub Copilot to return original questions as the requested JSON array. Replace `{{BATCH_SIZE}}` with the number of items you want.
2. Save Copilot's JSON response to a `.json` file. In Question Studio choose **Import JSON**. Invalid JSON, missing required fields, unsupported category values, duplicate IDs, and duplicate question content block the entire import.
3. Review each pending question in the SAT-style preview. Use **Edit** to change its ID, domain, skill, difficulty, passage, question, four choices, answer, explanation, or rejection reason. **Regenerate** copies a skill-specific instruction into the clipboard for GitHub Copilot; it does not call AI or modify the current question.
4. Choose **Approve** or **Reject** for each item. Approval is explicit and stays in this browser until exported. Rejection reasons are retained in the rejected collection and its JSON export.
5. **Export approved backup** downloads the full studio-format records. **Export for website** downloads only approved questions as the existing site's JSON-array format (`tag`, `question`, `options`, `answerIndex`, `explanationText`). This does not install or publish them.
6. To install questions yourself, back up the target file first. Manually merge the exported array's objects into the chosen existing `data/quiz_data.json`, `data/quiz_data2.json`, or `data/quiz_data3.json` array without replacing its existing questions. The site's quiz pages load these JSON files and use the five legacy fields above. Review the final JSON and test it before deploying.

Use **Export pending**, **Export rejected**, and **Export all** to keep portable studio backups. Studio-format imports always return to pending review, so restoring a backup does not skip the approval step.

Automated validation checks schema, category, difficulty, IDs, choices, and likely exact duplicates. It can flag obvious review concerns but cannot determine whether a question is academically correct; human review is required.
