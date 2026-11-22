"use strict";

(() => {
    const DOMAIN_SKILLS = {
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
    const DATA_FILES = [
        "data/information_and_ideas_questions.json",
        "data/craft_and_structure_questions.json",
        "data/expression_of_ideas_questions.json",
        "data/standard_conventions.json"
    ];
    const LETTERS = ["A", "B", "C", "D"];
    const STORAGE_KEY = "woodpeckerSatReadingPractice.v1";
    const $ = selector => document.querySelector(selector);
    let approvedQuestions = [];
    let filteredQuestions = [];
    let currentIndex = 0;
    let answersById = new Map();
    let currentQuestionId = "";
    let storageWarning = "";

    function element(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function showMessage(message, isError = false) {
        const stage = $("#question-stage");
        stage.replaceChildren();
        const box = element("div", isError ? "error-state" : "empty-state");
        box.append(element("strong", "", isError ? "Questions could not be loaded" : "No questions match"));
        box.append(element("span", "", message));
        stage.append(box);
        $("#question-list").replaceChildren();
        $("#browser-count").textContent = "0 questions";
        $("#question-count").textContent = "No questions";
        $("#progress-bar").style.width = "0";
        $("#previous-button").disabled = true;
        $("#next-button").disabled = true;
        $("#score-text").textContent = `${getCorrectCount()} correct · ${answersById.size} answered`;
    }

    function validQuestion(question) {
        return question
            && typeof question === "object"
            && typeof question.id === "string"
            && question.id.trim()
            && question.status === "approved"
            && Object.prototype.hasOwnProperty.call(DOMAIN_SKILLS, question.domain)
            && DOMAIN_SKILLS[question.domain].includes(question.skill)
            && ["Easy", "Medium", "Hard"].includes(question.difficulty)
            && typeof question.passage === "string"
            && question.passage.trim()
            && typeof question.question === "string"
            && question.question.trim()
            && Array.isArray(question.options)
            && question.options.length === 4
            && question.options.every(option => typeof option === "string" && option.trim())
            && Number.isInteger(question.answerIndex)
            && question.answerIndex >= 0
            && question.answerIndex <= 3
            && typeof question.explanationText === "string"
            && question.explanationText.trim();
    }

    function setStorageWarning(message) {
        storageWarning = message;
        const status = $("#storage-status");
        status.textContent = message;
        status.hidden = !message;
        status.classList.toggle("is-warning", Boolean(message));
    }

    function restoreProgress() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const saved = JSON.parse(raw);
            if (!saved || saved.version !== 1 || !saved.answers || typeof saved.answers !== "object") {
                throw new Error("Saved progress has an unsupported format.");
            }
            Object.entries(saved.answers).forEach(([id, selectedIndex]) => {
                if (Number.isInteger(selectedIndex) && selectedIndex >= 0 && selectedIndex < 4) {
                    answersById.set(id, selectedIndex);
                }
            });
            if (typeof saved.currentQuestionId === "string") currentQuestionId = saved.currentQuestionId;
        } catch (error) {
            console.error("Could not restore reading practice progress:", error);
            setStorageWarning(`Saved progress could not be read: ${error.message} Your new answers will still be saved when possible.`);
        }
    }

    function persistProgress() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                version: 1,
                answers: Object.fromEntries(answersById),
                currentQuestionId
            }));
            if (storageWarning) setStorageWarning("");
        } catch (error) {
            console.error("Could not save reading practice progress:", error);
            setStorageWarning(`Progress could not be saved to this browser: ${error.message}`);
        }
    }

    function populateDomainFilter() {
        const filter = $("#domain-filter");
        Object.keys(DOMAIN_SKILLS).forEach(domain => filter.add(new Option(domain, domain)));
        const requestedDomain = new URLSearchParams(window.location.search).get("domain");
        if (requestedDomain && Object.prototype.hasOwnProperty.call(DOMAIN_SKILLS, requestedDomain)) {
            filter.value = requestedDomain;
        }
        updateSkillFilter();
    }

    function updateSkillFilter() {
        const filter = $("#skill-filter");
        const domain = $("#domain-filter").value;
        const previousSkill = filter.value;
        filter.replaceChildren(new Option("All skills", ""));
        const skills = domain ? DOMAIN_SKILLS[domain] : Object.values(DOMAIN_SKILLS).flat();
        skills.forEach(skill => filter.add(new Option(skill, skill)));
        filter.value = skills.includes(previousSkill) ? previousSkill : "";
    }

    function isCorrect(question) {
        return answersById.get(question.id) === question.answerIndex;
    }

    function getCorrectCount() {
        return approvedQuestions.reduce((count, question) => count + (isCorrect(question) ? 1 : 0), 0);
    }

    function getAnsweredCount() {
        return approvedQuestions.reduce((count, question) => count + (answersById.has(question.id) ? 1 : 0), 0);
    }

    function filterQuestions() {
        const query = $("#search-filter").value.toLocaleLowerCase().trim();
        const domain = $("#domain-filter").value;
        const skill = $("#skill-filter").value;
        const difficulty = $("#difficulty-filter").value;
        const previousId = filteredQuestions[currentIndex] && filteredQuestions[currentIndex].id;
        filteredQuestions = approvedQuestions.filter(question =>
            (!domain || question.domain === domain)
            && (!skill || question.skill === skill)
            && (!difficulty || question.difficulty === difficulty)
            && (!query || [
                question.id, question.domain, question.skill,
                question.passage, question.question, question.explanationText,
                ...question.options
            ].some(value => value.toLocaleLowerCase().includes(query)))
        );
        const preservedIndex = filteredQuestions.findIndex(question => question.id === previousId);
        const savedIndex = filteredQuestions.findIndex(question => question.id === currentQuestionId);
        currentIndex = preservedIndex >= 0 ? preservedIndex : savedIndex >= 0 ? savedIndex : 0;
        renderQuestion();
    }

    function renderSummary() {
        $("#total-questions").textContent = approvedQuestions.length.toLocaleString();
        $("#answered-count").textContent = getAnsweredCount().toLocaleString();
        $("#correct-count").textContent = getCorrectCount().toLocaleString();
    }

    function renderQuestionList() {
        const list = $("#question-list");
        const fragment = document.createDocumentFragment();
        filteredQuestions.forEach((question, index) => {
            const answered = answersById.has(question.id);
            const correct = answered && isCorrect(question);
            const button = element("button", `question-nav-item difficulty-${question.difficulty.toLowerCase()}`);
            button.type = "button";
            button.id = `question-nav-${question.id}`;
            button.dataset.questionId = question.id;
            button.classList.toggle("is-current", index === currentIndex);
            button.classList.toggle("is-complete", answered);
            button.classList.toggle("is-correct", correct);
            button.classList.toggle("is-incorrect", answered && !correct);
            button.setAttribute("aria-current", index === currentIndex ? "true" : "false");
            button.setAttribute("aria-label", `${question.id}, ${question.difficulty}, ${answered ? correct ? "correct" : "answered incorrectly" : "unanswered"}`);
            button.append(
                element("span", "question-nav-number", String(index + 1)),
                element("span", "question-nav-id", question.id),
                element("span", "question-nav-status", !answered ? "○" : correct ? "✓" : "×")
            );
            fragment.append(button);
        });
        list.replaceChildren(fragment);
        $("#browser-count").textContent = `${filteredQuestions.length.toLocaleString()} ${filteredQuestions.length === 1 ? "question" : "questions"}`;
    }

    function renderScore() {
        $("#score-text").textContent = `${getCorrectCount().toLocaleString()} correct · ${getAnsweredCount().toLocaleString()} answered`;
    }

    function renderQuestion() {
        renderSummary();
        renderQuestionList();
        const stage = $("#question-stage");
        stage.replaceChildren();
        if (!filteredQuestions.length) {
            showMessage(approvedQuestions.length
                ? "No questions match these filters. Try another domain, skill, difficulty, or search."
                : "No approved questions are available. Check the installed question files and reload.");
            return;
        }

        const question = filteredQuestions[currentIndex];
        const selectedIndex = answersById.get(question.id);
        currentQuestionId = question.id;
        $("#domain-tag").textContent = question.domain;
        $("#skill-tag").textContent = question.skill;
        $("#difficulty-tag").textContent = question.difficulty;
        $("#difficulty-tag").className = `tag tag-difficulty difficulty-${question.difficulty.toLowerCase()}`;
        $("#question-count").textContent = `Question ${currentIndex + 1} of ${filteredQuestions.length.toLocaleString()}`;
        $("#progress-bar").style.width = `${((currentIndex + 1) / filteredQuestions.length) * 100}%`;
        $("#previous-button").disabled = currentIndex === 0;
        $("#next-button").disabled = currentIndex === filteredQuestions.length - 1;
        $("#previous-button").setAttribute("aria-label", "Go to previous question");
        $("#next-button").setAttribute("aria-label", "Go to next question");
        renderScore();

        stage.append(element("p", "question-passage", question.passage));
        stage.append(element("h2", "question-prompt", question.question));
        const choices = element("div", "answer-options");
        choices.setAttribute("role", "group");
        choices.setAttribute("aria-label", "Answer choices");
        question.options.forEach((text, index) => {
            const button = element("button", "answer-option");
            button.type = "button";
            button.disabled = selectedIndex !== undefined;
            button.setAttribute("aria-pressed", String(selectedIndex === index));
            const letter = element("span", "answer-letter", LETTERS[index]);
            letter.setAttribute("aria-hidden", "true");
            button.append(letter, element("span", "", text));
            if (selectedIndex !== undefined && index === question.answerIndex) button.classList.add("is-correct");
            if (selectedIndex === index && selectedIndex !== question.answerIndex) button.classList.add("is-wrong");
            button.addEventListener("click", () => selectAnswer(question, index));
            choices.append(button);
        });
        stage.append(choices);

        if (selectedIndex !== undefined) {
            const correct = selectedIndex === question.answerIndex;
            const feedback = element("div", `feedback${correct ? "" : " is-incorrect"}`);
            feedback.setAttribute("role", "status");
            feedback.append(element("strong", "", correct ? "Correct" : `The correct answer is ${LETTERS[question.answerIndex]}.`));
            feedback.append(document.createTextNode(question.explanationText));
            stage.append(feedback);
        }
        const currentNavigationButton = document.getElementById(`question-nav-${question.id}`);
        if (currentNavigationButton) currentNavigationButton.scrollIntoView({ block: "nearest" });
        persistProgress();
    }

    function selectAnswer(question, selectedIndex) {
        if (answersById.has(question.id)) return;
        answersById.set(question.id, selectedIndex);
        renderQuestion();
    }

    function navigate(offset) {
        const nextIndex = currentIndex + offset;
        if (nextIndex < 0 || nextIndex >= filteredQuestions.length) return;
        currentIndex = nextIndex;
        currentQuestionId = filteredQuestions[currentIndex].id;
        renderQuestion();
    }

    function goToQuestion(id) {
        const index = filteredQuestions.findIndex(question => question.id === id);
        if (index < 0) return;
        currentIndex = index;
        currentQuestionId = id;
        renderQuestion();
    }

    async function loadQuestions() {
        try {
            const payloads = await Promise.all(DATA_FILES.map(async file => {
                const response = await fetch(file);
                if (!response.ok) throw new Error(`${file} returned HTTP ${response.status}.`);
                const payload = await response.json();
                if (!Array.isArray(payload)) throw new Error(`${file} must contain a JSON array.`);
                return { file, questions: payload };
            }));
            const questions = payloads.flatMap(payload => payload.questions);
            const invalid = questions
                .map((question, index) => ({ question, index }))
                .filter(item => item.question && item.question.status === "approved" && !validQuestion(item.question));
            if (invalid.length) {
                throw new Error(`Approved question ${invalid[0].question.id || invalid[0].index + 1} has invalid or incomplete fields.`);
            }
            approvedQuestions = questions.filter(question => question && question.status === "approved");
            const ids = new Set();
            approvedQuestions.forEach(question => {
                if (ids.has(question.id)) throw new Error(`Duplicate approved question ID: ${question.id}.`);
                ids.add(question.id);
            });
            if (!approvedQuestions.length) throw new Error("The four question files contain no approved questions.");
            answersById = new Map();
            restoreProgress();
            const validIds = new Set(approvedQuestions.map(question => question.id));
            answersById = new Map([...answersById].filter(([id]) => validIds.has(id)));
            filterQuestions();
        } catch (error) {
            console.error("Could not load approved reading questions:", error);
            showMessage(`${error.message} Check the question files and reload.`, true);
        }
    }

    function resetProgress() {
        if (!answersById.size) return;
        if (!window.confirm("Clear all saved answers for this practice library on this device?")) return;
        answersById.clear();
        currentQuestionId = filteredQuestions[currentIndex] ? filteredQuestions[currentIndex].id : "";
        persistProgress();
        filterQuestions();
    }

    $("#domain-filter").addEventListener("change", () => {
        updateSkillFilter();
        filterQuestions();
    });
    $("#skill-filter").addEventListener("change", filterQuestions);
    $("#difficulty-filter").addEventListener("change", filterQuestions);
    $("#search-filter").addEventListener("input", filterQuestions);
    $("#previous-button").addEventListener("click", () => navigate(-1));
    $("#next-button").addEventListener("click", () => navigate(1));
    $("#question-list").addEventListener("click", event => {
        const button = event.target.closest("[data-question-id]");
        if (button) goToQuestion(button.dataset.questionId);
    });
    $("#clear-progress").addEventListener("click", resetProgress);

    populateDomainFilter();
    loadQuestions();
})();
