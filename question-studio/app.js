"use strict";

(() => {
    const STORAGE_KEY = "woodpeckerSatQuestionStudio.v1";
    const PAGE_SIZE = 25;
    const DOMAINS = {
        "Information and Ideas": [
            "Central Ideas and Details",
            "Command of Evidence (Textual)",
            "Command of Evidence (Quantitative)",
            "Inferences"
        ],
        "Craft and Structure": [
            "Words in Context",
            "Text Structure and Purpose",
            "Cross-Text Connections"
        ],
        "Expression of Ideas": [
            "Rhetorical Synthesis",
            "Transitions"
        ],
        "Standard English Conventions": [
            "Boundaries",
            "Form, Structure, and Sense"
        ]
    };
    const COLLECTIONS = ["pending", "approved", "rejected"];
    const LETTERS = ["A", "B", "C", "D"];
    const PROMPT_FOCUS = {
        "Central Ideas and Details": "Assess a text's central claim, theme, or a specific detail explicitly stated in the passage. Build plausible distractors from nearby details or overgeneralizations.",
        "Command of Evidence (Textual)": "Ask which quotation or detail best supports a stated claim. Make every choice plausible but ensure only one directly supports the exact claim.",
        "Command of Evidence (Quantitative)": "Provide an original, clearly labeled table or concise data description in the stimulus. Ask which conclusion is best supported; ensure the answer follows directly from the values and avoid unsupported causal claims.",
        "Inferences": "Require one reasonable conclusion from specific textual evidence without assuming facts beyond the passage. Distractors should be plausible but unsupported or too broad.",
        "Words in Context": "Test the meaning of a word or phrase as used in context. Choose a meaning supported by the sentence and surrounding passage, not a rare dictionary definition.",
        "Text Structure and Purpose": "Ask how the passage is organized or what a sentence/paragraph accomplishes. Make the answer describe the role of the relevant text, not merely its topic.",
        "Cross-Text Connections": "Provide two short, original texts on a shared topic with distinct viewpoints. Ask how the second author would likely respond to a specific claim or position in the first.",
        "Rhetorical Synthesis": "Provide concise research notes and a clear rhetorical goal. Ask which choice best uses relevant notes to accomplish that goal; distractors should misuse, omit, or distort the notes.",
        "Transitions": "Test the logical relationship between adjacent ideas. The correct transition must precisely express that relationship; distractors should represent other common relationships.",
        "Boundaries": "Test sentence boundaries and punctuation between clauses, phrases, or items. Make the surrounding sentence sufficient to determine the only grammatically and logically correct option.",
        "Form, Structure, and Sense": "Test standard English grammar such as agreement, verb forms, pronouns, modifiers, or parallel structure. Ensure context determines one precise, standard construction."
    };

    const emptyState = () => ({
        version: 1,
        collections: { pending: [], approved: [], rejected: [] },
        dirty: []
    });
    let state = loadState();
    let activeStatus = "all";
    let currentPage = 1;
    let editingId = null;
    let rejectingId = null;
    let toastTimer = 0;

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
    const allQuestions = () => COLLECTIONS.flatMap(status => state.collections[status]);

    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return emptyState();
            const parsed = JSON.parse(raw);
            if (!parsed || parsed.version !== 1 || !parsed.collections) throw new Error("Stored studio data has an unsupported format.");
            const loaded = emptyState();
            COLLECTIONS.forEach(status => {
                if (!Array.isArray(parsed.collections[status])) throw new Error(`Stored ${status} questions are not an array.`);
                loaded.collections[status] = parsed.collections[status];
            });
            loaded.dirty = Array.isArray(parsed.dirty) ? parsed.dirty.filter(item => COLLECTIONS.includes(item)) : [];
            return loaded;
        } catch (error) {
            console.error("Could not load Question Studio data:", error);
            window.setTimeout(() => showToast(`Saved studio data could not be loaded: ${error.message}`, true), 0);
            return emptyState();
        }
    }

    function persist() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            updateSaveIndicator();
        } catch (error) {
            console.error("Could not save Question Studio data:", error);
            showToast(`Could not save changes in this browser: ${error.message}. Export a backup before continuing.`, true);
        }
    }

    function markDirty(...statuses) {
        state.dirty = Array.from(new Set(state.dirty.concat(statuses)));
        persist();
        render();
    }

    function updateSaveIndicator() {
        const dirty = state.dirty.length > 0;
        $("#save-indicator").classList.toggle("is-dirty", dirty);
        $("#save-text").textContent = dirty
            ? `Changes not exported (${state.dirty.length})`
            : "All changes exported";
    }

    function showToast(message, isError = false) {
        const toast = $("#toast");
        toast.textContent = message;
        toast.classList.toggle("error", isError);
        toast.classList.add("show");
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => toast.classList.remove("show"), 4200);
    }

    function create(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function domainForSkill(skill) {
        return Object.keys(DOMAINS).find(domain => DOMAINS[domain].includes(skill)) || "";
    }

    function normalize(value) {
        return String(value || "").toLocaleLowerCase().replace(/\s+/g, " ").trim();
    }

    function questionSignature(question) {
        return [
            normalize(question.passage),
            normalize(question.question),
            Array.isArray(question.options) ? question.options.map(normalize).join("|") : ""
        ].join("::");
    }

    function findDuplicateContent(question, ignoreId = null) {
        const signature = questionSignature(question);
        if (!signature.replace(/[:|]/g, "")) return null;
        return allQuestions().find(item => item.id !== ignoreId && questionSignature(item) === signature) || null;
    }

    function validateQuestion(question, { ignoreId = null, checkExisting = true } = {}) {
        const errors = [];
        const warnings = [];
        if (!question || typeof question !== "object" || Array.isArray(question)) {
            return { errors: ["Question must be a JSON object."], warnings };
        }
        ["id", "domain", "skill", "difficulty", "passage", "question", "explanationText", "status"].forEach(field => {
            if (typeof question[field] !== "string" || !question[field].trim()) errors.push(`${field} is required and must be nonempty text.`);
        });
        if (!["pending", "approved", "rejected"].includes(question.status)) {
            errors.push("status must be pending, approved, or rejected.");
        }
        if (typeof question.id === "string" && question.id.trim()) {
            const idTaken = allQuestions().some(item => item.id === question.id.trim() && item.id !== ignoreId);
            if (idTaken) errors.push(`Question ID "${question.id.trim()}" is already in use.`);
        }
        if (typeof question.domain === "string" && !Object.prototype.hasOwnProperty.call(DOMAINS, question.domain)) {
            errors.push("Domain is not one of the four supported SAT Reading and Writing domains.");
        }
        if (typeof question.domain === "string" && DOMAINS[question.domain]
            && !DOMAINS[question.domain].includes(question.skill)) {
            errors.push("Skill does not belong to the selected domain.");
        }
        if (!["Easy", "Medium", "Hard"].includes(question.difficulty)) errors.push("Difficulty must be Easy, Medium, or Hard.");
        if (!Array.isArray(question.options) || question.options.length !== 4
            || question.options.some(option => typeof option !== "string" || !option.trim())) {
            errors.push("Exactly four nonempty answer choices are required.");
        } else if (typeof question.options[question.answerIndex] !== "string") {
            errors.push("answerIndex must be an integer from 0 to 3.");
        }
        if (!Number.isInteger(question.answerIndex) || question.answerIndex < 0 || question.answerIndex > 3) {
            errors.push("answerIndex must be an integer from 0 to 3.");
        }
        if (typeof question.passage === "string" && question.passage.trim().length < 40) {
            warnings.push("The passage or stimulus is unusually short; check that it contains enough context.");
        }
        if (typeof question.explanationText === "string" && question.explanationText.trim().length < 80) {
            warnings.push("The explanation is brief; manually check that it justifies the answer and addresses the distractors.");
        }
        if (Array.isArray(question.options) && question.options.length === 4
            && new Set(question.options.map(normalize)).size !== 4) {
            warnings.push("Some answer choices appear identical after whitespace and case normalization.");
        }
        if (checkExisting && question.id && typeof question.passage === "string"
            && typeof question.question === "string" && Array.isArray(question.options)) {
            const duplicate = findDuplicateContent(question, ignoreId);
            if (duplicate) errors.push(`This question appears to duplicate question ${duplicate.id}.`);
        }
        return { errors: Array.from(new Set(errors)), warnings };
    }

    function updateFilters() {
        const domainFilter = $("#domain-filter");
        const selectedDomain = domainFilter.value;
        domainFilter.replaceChildren(new Option("All domains", ""));
        Object.keys(DOMAINS).forEach(domain => domainFilter.add(new Option(domain, domain)));
        domainFilter.value = selectedDomain;
        const skillFilter = $("#skill-filter");
        const selectedSkill = skillFilter.value;
        skillFilter.replaceChildren(new Option("All skills", ""));
        const skills = selectedDomain ? DOMAINS[selectedDomain] : Object.values(DOMAINS).flat();
        skills.forEach(skill => skillFilter.add(new Option(skill, skill)));
        skillFilter.disabled = false;
        skillFilter.value = skills.includes(selectedSkill) ? selectedSkill : "";
        $("#editor-domain").replaceChildren(...Object.keys(DOMAINS).map(domain => new Option(domain, domain)));
    }

    function updateEditorSkills(selectedSkill = "") {
        const domain = $("#editor-domain").value;
        const skills = DOMAINS[domain] || [];
        const select = $("#editor-skill");
        select.replaceChildren(...skills.map(skill => new Option(skill, skill)));
        if (skills.includes(selectedSkill)) select.value = selectedSkill;
    }

    function getFilteredQuestions() {
        const query = normalize($("#search-input").value);
        const domain = $("#domain-filter").value;
        const skill = $("#skill-filter").value;
        const difficulty = $("#difficulty-filter").value;
        return allQuestions()
            .filter(question => activeStatus === "all" || question.status === activeStatus)
            .filter(question => !domain || question.domain === domain)
            .filter(question => !skill || question.skill === skill)
            .filter(question => !difficulty || question.difficulty === difficulty)
            .filter(question => !query || [
                question.id, question.domain, question.skill, question.difficulty,
                question.passage, question.question, question.explanationText,
                ...(Array.isArray(question.options) ? question.options : [])
            ].some(value => normalize(value).includes(query)))
            .sort((a, b) => {
                const statusOrder = { pending: 0, approved: 1, rejected: 2 };
                return statusOrder[a.status] - statusOrder[b.status] || a.id.localeCompare(b.id);
            });
    }

    function render() {
        updateFilters();
        const counts = COLLECTIONS.reduce((result, status) => {
            result[status] = state.collections[status].length;
            return result;
        }, {});
        const total = COLLECTIONS.reduce((sum, status) => sum + counts[status], 0);
        $("#stat-total").textContent = total;
        $("#stat-pending").textContent = counts.pending;
        $("#stat-approved").textContent = counts.approved;
        $("#stat-rejected").textContent = counts.rejected;
        $("#nav-all").textContent = total;
        $("#nav-pending").textContent = counts.pending;
        $("#nav-approved").textContent = counts.approved;
        $("#nav-rejected").textContent = counts.rejected;
        $("#list-title").textContent = activeStatus === "all"
            ? "All questions"
            : `${activeStatus.charAt(0).toUpperCase()}${activeStatus.slice(1)} questions`;
        updateSaveIndicator();

        const questions = getFilteredQuestions();
        $("#result-count").textContent = `${questions.length} question${questions.length === 1 ? "" : "s"}`;
        const list = $("#question-list");
        list.replaceChildren();
        const pageCount = Math.max(1, Math.ceil(questions.length / PAGE_SIZE));
        currentPage = Math.min(currentPage, pageCount);
        const visible = questions.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
        if (!visible.length) {
            const empty = create("div", "empty-state");
            empty.append(create("strong", "", total ? "No questions match these filters" : "Your review queue is ready"));
            empty.append(create("p", "", total
                ? "Try a different search or filter, or import a question batch."
                : "Import a JSON batch or start a draft. New questions stay in your browser until you export them."));
            list.append(empty);
        } else {
            visible.forEach(question => list.append(renderCard(question)));
        }
        renderPagination(pageCount);
    }

    function renderCard(question) {
        const card = create("article", "question-card");
        const body = create("div", "card-main");
        const meta = create("div", "card-meta");
        meta.append(create("span", `pill status-${question.status}`, question.status || "pending"));
        meta.append(create("span", "pill", question.domain || "Uncategorized"));
        meta.append(create("span", "pill", question.skill || "No skill"));
        meta.append(create("span", "pill difficulty", question.difficulty || "No difficulty"));
        meta.append(create("span", "card-id", question.id || "No ID"));
        body.append(meta);
        body.append(create("p", "passage-preview", question.passage || "No passage supplied."));
        body.append(create("p", "question-preview", question.question || "No question supplied."));

        const options = create("div", "preview-options");
        (Array.isArray(question.options) ? question.options : []).forEach((option, index) => {
            const item = create("div", `preview-option${index === question.answerIndex ? " correct" : ""}`);
            item.append(create("span", "option-letter", LETTERS[index] || "?"));
            item.append(create("span", "", option));
            options.append(item);
        });
        body.append(options);

        const validation = validateQuestion(question, { ignoreId: question.id });
        if (validation.warnings.length || validation.errors.length) {
            const warning = create("p", "card-warning");
            const summary = validation.errors.length ? validation.errors : validation.warnings;
            warning.textContent = `Manual check: ${summary.join(" ")}`;
            body.append(warning);
        }
        if (question.explanationText) {
            const explanation = create("div", "card-explanation");
            explanation.append(create("strong", "", "Explanation · "));
            explanation.append(document.createTextNode(question.explanationText));
            body.append(explanation);
        }
        if (question.status === "rejected" && question.rejectionReason) {
            const reason = create("div", "card-explanation");
            reason.append(create("strong", "", "Rejection reason · "));
            reason.append(document.createTextNode(question.rejectionReason));
            body.append(reason);
        }
        card.append(body);

        const actions = create("div", "card-actions");
        if (question.status === "pending") {
            actions.append(makeAction("Approve", "approve", () => approveQuestion(question.id)));
            actions.append(makeAction("Reject", "reject", () => rejectQuestion(question.id)));
        } else if (question.status === "approved") {
            actions.append(makeAction("Move to pending", "", () => moveQuestion(question.id, "pending")));
            actions.append(makeAction("Reject", "reject", () => rejectQuestion(question.id)));
        } else {
            actions.append(makeAction("Restore draft", "", () => moveQuestion(question.id, "pending")));
        }
        actions.append(makeAction("Edit", "", () => openEditor(question)));
        actions.append(makeAction("Regenerate", "", () => copyRegenerationPrompt(question)));
        actions.append(makeAction("Delete", "delete", () => deleteQuestion(question.id)));
        card.append(actions);
        return card;
    }

    function makeAction(label, style, handler) {
        const button = create("button", `action-button${style ? ` ${style}` : ""}`, label);
        button.type = "button";
        button.addEventListener("click", handler);
        return button;
    }

    function renderPagination(pageCount) {
        const pagination = $("#pagination");
        pagination.replaceChildren();
        if (pageCount <= 1) return;
        const previous = create("button", "", "←");
        previous.type = "button";
        previous.disabled = currentPage === 1;
        previous.setAttribute("aria-label", "Previous page");
        previous.addEventListener("click", () => { currentPage -= 1; render(); });
        pagination.append(previous);
        for (let page = 1; page <= pageCount; page += 1) {
            const button = create("button", "", String(page));
            button.type = "button";
            if (page === currentPage) button.setAttribute("aria-current", "page");
            button.addEventListener("click", () => { currentPage = page; render(); });
            pagination.append(button);
        }
        const next = create("button", "", "→");
        next.type = "button";
        next.disabled = currentPage === pageCount;
        next.setAttribute("aria-label", "Next page");
        next.addEventListener("click", () => { currentPage += 1; render(); });
        pagination.append(next);
    }

    function locateQuestion(id) {
        for (const status of COLLECTIONS) {
            const index = state.collections[status].findIndex(item => item.id === id);
            if (index !== -1) return { status, index, question: state.collections[status][index] };
        }
        return null;
    }

    function moveQuestion(id, targetStatus) {
        const found = locateQuestion(id);
        if (!found || found.status === targetStatus) return;
        const question = { ...found.question, status: targetStatus };
        state.collections[found.status].splice(found.index, 1);
        state.collections[targetStatus].unshift(question);
        markDirty(found.status, targetStatus);
        showToast(`Question ${id} moved to ${targetStatus}.`);
    }

    function approveQuestion(id) {
        const found = locateQuestion(id);
        if (!found || found.status !== "pending") return;
        const check = validateQuestion(found.question, { ignoreId: id });
        if (check.errors.length) {
            showToast(`Cannot approve: ${check.errors.join(" ")}`, true);
            return;
        }
        const warningMessage = check.warnings.length
            ? `\n\nManual review flags:\n• ${check.warnings.join("\n• ")}`
            : "";
        if (!window.confirm(`Approve ${id}? This only moves it to the local approved collection; nothing is published or changed on the website.${warningMessage}`)) return;
        const question = { ...found.question, status: "approved" };
        state.collections.pending.splice(found.index, 1);
        state.collections.approved.unshift(question);
        markDirty("pending", "approved");
        showToast(`${id} approved locally. Export approved questions when you're ready.`);
    }

    function rejectQuestion(id) {
        const found = locateQuestion(id);
        if (!found || found.status === "rejected") return;
        rejectingId = id;
        $("#rejection-reason").value = found.question.rejectionReason || "";
        $("#reject-dialog").showModal();
    }

    function completeRejection(event) {
        event.preventDefault();
        const found = rejectingId ? locateQuestion(rejectingId) : null;
        if (!found || found.status === "rejected") {
            $("#reject-dialog").close();
            return;
        }
        const reason = $("#rejection-reason").value.trim();
        const question = { ...found.question, status: "rejected" };
        if (reason) question.rejectionReason = reason;
        else delete question.rejectionReason;
        state.collections[found.status].splice(found.index, 1);
        state.collections.rejected.unshift(question);
        markDirty(found.status, "rejected");
        $("#reject-dialog").close();
        rejectingId = null;
        showToast(`${found.question.id} moved to rejected questions.`);
    }

    function deleteQuestion(id) {
        const found = locateQuestion(id);
        if (!found || !window.confirm(`Delete ${id} from this browser's Question Studio? Exported files are not changed.`)) return;
        state.collections[found.status].splice(found.index, 1);
        markDirty(found.status);
        showToast(`${id} deleted from the studio.`);
    }

    function nextId() {
        let id;
        do {
            const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
            id = `RW-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${suffix}`;
        } while (allQuestions().some(question => question.id === id));
        return id;
    }

    function openEditor(question = null) {
        editingId = question ? question.id : null;
        const form = $("#editor-form");
        form.reset();
        $("#editor-title").textContent = question ? `Edit ${question.id}` : "Create a draft";
        $("#editor-errors").hidden = true;
        $("#editor-errors").replaceChildren();
        const initialDomain = question?.domain && DOMAINS[question.domain] ? question.domain : Object.keys(DOMAINS)[0];
        $("#editor-domain").value = initialDomain;
        updateEditorSkills(question?.skill || DOMAINS[initialDomain][0]);
        form.elements.id.value = question?.id || nextId();
        form.elements.difficulty.value = question?.difficulty || "Medium";
        form.elements.status.value = question?.status === "rejected" ? "rejected" : "pending";
        form.elements.passage.value = question?.passage || "";
        form.elements.question.value = question?.question || "";
        form.elements.option0.value = question?.options?.[0] || "";
        form.elements.option1.value = question?.options?.[1] || "";
        form.elements.option2.value = question?.options?.[2] || "";
        form.elements.option3.value = question?.options?.[3] || "";
        form.elements.answerIndex.value = String(Number.isInteger(question?.answerIndex) ? question.answerIndex : 0);
        form.elements.explanationText.value = question?.explanationText || "";
        form.elements.rejectionReason.value = question?.rejectionReason || "";
        const currentStatus = question?.status || "pending";
        const statusNote = currentStatus === "approved"
            ? "This question is approved. Saving edits always moves it to pending; approval can only be granted with the Approve action."
            : "Approved is intentionally unavailable here. Use the Approve action to approve a question.";
        $("#editor-status").textContent = statusNote;
        $("#editor-dialog").showModal();
    }

    function readEditorQuestion() {
        const form = $("#editor-form");
        return {
            id: form.elements.id.value.trim(),
            domain: form.elements.domain.value,
            skill: form.elements.skill.value,
            difficulty: form.elements.difficulty.value,
            status: form.elements.status.value,
            passage: form.elements.passage.value.trim(),
            question: form.elements.question.value.trim(),
            options: [0, 1, 2, 3].map(index => form.elements[`option${index}`].value.trim()),
            answerIndex: Number(form.elements.answerIndex.value),
            explanationText: form.elements.explanationText.value.trim(),
            rejectionReason: form.elements.rejectionReason.value.trim()
        };
    }

    function displayEditorErrors(errors, warnings = []) {
        const box = $("#editor-errors");
        box.replaceChildren();
        box.append(create("strong", "", errors.length ? "Fix these issues before saving:" : "Manual review flags:"));
        const list = create("ul");
        errors.concat(warnings).forEach(message => list.append(create("li", "", message)));
        box.append(list);
        box.hidden = false;
        box.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    function saveEditor(event) {
        event.preventDefault();
        const question = readEditorQuestion();
        const check = validateQuestion(question, { ignoreId: editingId });
        if (check.errors.length) {
            displayEditorErrors(check.errors, check.warnings);
            return;
        }
        const found = editingId ? locateQuestion(editingId) : null;
        if (found) {
            const newStatus = found.status === "approved" ? "pending" : question.status;
            const updated = { ...found.question, ...question, status: newStatus };
            if (updated.status !== "rejected" || !question.rejectionReason) delete updated.rejectionReason;
            state.collections[found.status].splice(found.index, 1);
            state.collections[newStatus].unshift(updated);
            markDirty(found.status, newStatus);
        } else {
            state.collections.pending.unshift({ ...question, status: "pending" });
            markDirty("pending");
        }
        $("#editor-dialog").close();
        showToast("Question saved in this browser. Export it when you want a file copy.");
    }

    function importQuestions(file) {
        const reader = new FileReader();
        reader.onerror = () => showToast("Could not read the selected file. Try another JSON file.", true);
        reader.onload = () => {
            let parsed;
            try {
                parsed = JSON.parse(String(reader.result));
            } catch (error) {
                showToast(`Invalid JSON: ${error.message}`, true);
                return;
            }
            const questions = Array.isArray(parsed)
                ? parsed
                : parsed && Array.isArray(parsed.questions)
                    ? parsed.questions
                    : parsed && parsed.collections && COLLECTIONS.some(status => Array.isArray(parsed.collections[status]))
                        ? COLLECTIONS.flatMap(status => Array.isArray(parsed.collections[status]) ? parsed.collections[status] : [])
                        : null;
            if (!questions) {
                showToast('Invalid question file: expected an array or an object with a "questions" array.', true);
                return;
            }
            if (questions.length === 0) {
                showToast("The JSON file contains no questions.", true);
                return;
            }
            const incomingIds = new Set();
            const incomingSignatures = new Set();
            const errors = [];
            questions.forEach((question, index) => {
                const check = validateQuestion(question, { checkExisting: false });
                check.errors.forEach(error => errors.push(`Item ${index + 1}: ${error}`));
                if (question && typeof question.id === "string") {
                    const id = question.id.trim();
                    if (incomingIds.has(id)) errors.push(`Item ${index + 1}: duplicate ID "${id}" in imported file.`);
                    if (allQuestions().some(item => item.id === id)) errors.push(`Item ${index + 1}: ID "${id}" already exists in this studio.`);
                    incomingIds.add(id);
                }
                if (question && typeof question.passage === "string" && typeof question.question === "string" && Array.isArray(question.options)) {
                    const signature = questionSignature(question);
                    if (incomingSignatures.has(signature)) errors.push(`Item ${index + 1}: duplicate question content in imported file.`);
                    if (findDuplicateContent(question)) errors.push(`Item ${index + 1}: question duplicates an existing item (${findDuplicateContent(question).id}).`);
                    incomingSignatures.add(signature);
                }
            });
            if (errors.length) {
                showToast(`Import blocked: ${errors.slice(0, 2).join(" ")}${errors.length > 2 ? ` (${errors.length - 2} more issue(s))` : ""}`, true);
                return;
            }
            if (!window.confirm(`Import ${questions.length} question${questions.length === 1 ? "" : "s"} from ${file.name} into pending review? Every imported question must be reviewed and approved here, even if its file says approved.`)) return;
            const imported = questions.map(question => {
                const copy = { ...question, id: question.id.trim(), status: "pending" };
                delete copy.rejectionReason;
                return copy;
            });
            state.collections.pending.unshift(...imported);
            markDirty("pending");
            showToast(`${imported.length} question${imported.length === 1 ? "" : "s"} imported to pending review.`);
        };
        reader.readAsText(file);
    }

    function downloadJson(filename, data) {
        const blob = new Blob([`${JSON.stringify(data, null, 2)}\n`], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const anchor = create("a");
        anchor.href = url;
        anchor.download = filename;
        document.body.append(anchor);
        anchor.click();
        anchor.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function exportCollection(status) {
        const questions = state.collections[status];
        if (!questions.length) {
            showToast(`There are no ${status} questions to export.`, true);
            return;
        }
        downloadJson(`${status}-questions.json`, questions);
        state.dirty = state.dirty.filter(item => item !== status);
        persist();
        showToast(`Exported ${questions.length} ${status} question${questions.length === 1 ? "" : "s"}.`);
    }

    function exportAll() {
        downloadJson("woodpecker-sat-question-studio.json", {
            version: 1,
            exportedAt: new Date().toISOString(),
            collections: state.collections
        });
        state.dirty = [];
        persist();
        showToast("Exported a backup of all three question collections.");
    }

    function exportForWebsite() {
        const approved = state.collections.approved;
        if (!approved.length) {
            showToast("There are no approved questions to export.", true);
            return;
        }
        const invalid = approved.map(question => ({
            question,
            result: validateQuestion(question, { ignoreId: question.id })
        })).filter(item => item.result.errors.length);
        if (invalid.length) {
            showToast(`Website export blocked: ${invalid.length} approved question(s) have validation errors. Review them before exporting.`, true);
            return;
        }
        if (!window.confirm(`Export ${approved.length} approved questions as a website-compatible JSON array? This downloads a file only; it will not alter the live question bank.`)) return;
        const legacyQuestions = approved.map(question => ({
            tag: question.skill,
            question: question.question,
            options: question.options.slice(),
            answerIndex: question.answerIndex,
            explanationText: question.explanationText
        }));
        downloadJson("woodpecker-sat-approved-website-questions.json", legacyQuestions);
        state.dirty = state.dirty.filter(item => item !== "approved");
        persist();
        showToast("Website-compatible JSON downloaded. The live question bank was not changed.");
    }

    function promptFor(question) {
        return [
            `Generate one NEW and original SAT Reading and Writing question for the ${question.domain} domain, skill "${question.skill}" (${question.difficulty} difficulty).`,
            PROMPT_FOCUS[question.skill] || "",
            `Create a distinct replacement for the existing item with ID ${question.id}; use a NEW unique ID, not ${question.id}. Keep it pending review.`,
            "Write original text only. Do not copy, closely paraphrase, or imitate any College Board question, passage, test, or answer choice. Never claim affiliation with the College Board.",
            "Return valid JSON only, as an array containing exactly one object with these fields: id, domain, skill, difficulty, passage, question, options, answerIndex, explanationText, status.",
            'The passage must be original and nonempty whenever the task needs a passage or stimulus. The question and explanation must be nonempty. Include exactly four nonempty options, one unambiguous correct answer, and answerIndex as a zero-based integer from 0 to 3. Use status "pending".',
            "Make distractors plausible. In a detailed explanation, cite the reasoning for the correct answer and explain why each of the other three choices is incorrect. Check grammar, evidence, and answer uniqueness before returning.",
            "JSON output:"
        ].join("\n\n");
    }

    function copyRegenerationPrompt(question) {
        const text = promptFor(question);
        const fallbackCopy = () => {
            const input = create("textarea");
            input.value = text;
            input.style.position = "fixed";
            input.style.opacity = "0";
            document.body.append(input);
            input.select();
            const copied = document.execCommand("copy");
            input.remove();
            if (copied) showToast("Regeneration prompt copied. Paste it into GitHub Copilot; the current question was not changed.");
            else showToast(`Clipboard unavailable. Open the prompt library and copy the ${question.skill} template.`, true);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(
                () => showToast("Regeneration prompt copied. Paste it into GitHub Copilot; the current question was not changed."),
                fallbackCopy
            );
        } else {
            fallbackCopy();
        }
    }

    function bindEvents() {
        $$(".nav-item").forEach(button => button.addEventListener("click", () => {
            activeStatus = button.dataset.status;
            currentPage = 1;
            $$(".nav-item").forEach(item => item.classList.toggle("active", item === button));
            render();
        }));
        $("#search-input").addEventListener("input", () => { currentPage = 1; render(); });
        ["domain-filter", "skill-filter", "difficulty-filter"].forEach(id => {
            $(`#${id}`).addEventListener("change", () => { currentPage = 1; render(); });
        });
        $("#domain-filter").addEventListener("change", () => {
            $("#skill-filter").value = "";
            render();
        });
        $("#import-button").addEventListener("click", () => $("#file-input").click());
        $("#file-input").addEventListener("change", event => {
            const file = event.target.files && event.target.files[0];
            if (file) importQuestions(file);
            event.target.value = "";
        });
        $("#export-website").addEventListener("click", exportForWebsite);
        $$("[data-export]").forEach(button => button.addEventListener("click", () => {
            const target = button.dataset.export;
            if (target === "all") exportAll();
            else exportCollection(target);
        }));
        $("#new-question").addEventListener("click", () => openEditor());
        $("#editor-domain").addEventListener("change", () => updateEditorSkills());
        $("#editor-form").addEventListener("submit", saveEditor);
        $("#close-editor").addEventListener("click", () => $("#editor-dialog").close());
        $("#cancel-editor").addEventListener("click", () => $("#editor-dialog").close());
        $("#editor-dialog").addEventListener("click", event => {
            if (event.target === $("#editor-dialog")) $("#editor-dialog").close();
        });
        $("#reject-form").addEventListener("submit", completeRejection);
        $("#close-reject").addEventListener("click", () => $("#reject-dialog").close());
        $("#cancel-reject").addEventListener("click", () => $("#reject-dialog").close());
        $("#reject-dialog").addEventListener("click", event => {
            if (event.target === $("#reject-dialog")) $("#reject-dialog").close();
        });
    }

    bindEvents();
    updateFilters();
    render();
})();
