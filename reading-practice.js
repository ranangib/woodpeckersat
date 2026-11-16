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
    const LETTERS = ["A", "B", "C", "D"];
    const $ = selector => document.querySelector(selector);
    let approvedQuestions = [];
    let filteredQuestions = [];
    let currentIndex = 0;
    const answersById = new Map();

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
        box.append(element("strong", "", isError ? "Questions could not be loaded" : "Your reading practice space is ready"));
        box.append(element("span", "", message));
        if (!isError) {
            const link = element("a", "", "Open the Question Studio");
            link.href = "question-studio/";
            box.append(link);
        }
        stage.append(box);
        $("#question-count").textContent = "No questions";
        $("#progress-bar").style.width = "0";
        $("#previous-button").disabled = true;
        $("#next-button").disabled = true;
        $("#score-text").textContent = "0 correct · 0 answered";
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

    function populateDomainFilter() {
        const filter = $("#domain-filter");
        Object.keys(DOMAIN_SKILLS).forEach(domain => filter.add(new Option(domain, domain)));
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

    function filterQuestions() {
        const query = $("#search-filter").value.toLocaleLowerCase().trim();
        const domain = $("#domain-filter").value;
        const skill = $("#skill-filter").value;
        const difficulty = $("#difficulty-filter").value;
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
        currentIndex = 0;
        renderQuestion();
    }

    function renderScore() {
        let correct = 0;
        let answered = 0;
        filteredQuestions.forEach(question => {
            const selectedIndex = answersById.get(question.id);
            if (selectedIndex !== undefined) {
                answered += 1;
                if (selectedIndex === question.answerIndex) correct += 1;
            }
        });
        $("#score-text").textContent = `${correct} correct · ${answered} answered`;
    }

    function renderQuestion() {
        const stage = $("#question-stage");
        stage.replaceChildren();
        if (!filteredQuestions.length) {
            showMessage(approvedQuestions.length
                ? "No approved questions match these filters. Try another domain, skill, or search."
                : "There are no approved reading questions installed yet. Approved questions from the Question Studio can be added to this practice set.");
            return;
        }

        const question = filteredQuestions[currentIndex];
        const selectedIndex = answersById.get(question.id);
        $("#domain-tag").textContent = question.domain;
        $("#skill-tag").textContent = question.skill;
        $("#difficulty-tag").textContent = question.difficulty;
        $("#question-count").textContent = `Question ${currentIndex + 1} of ${filteredQuestions.length}`;
        $("#progress-bar").style.width = `${((currentIndex + 1) / filteredQuestions.length) * 100}%`;
        $("#previous-button").disabled = currentIndex === 0;
        $("#next-button").disabled = currentIndex === filteredQuestions.length - 1;
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
            feedback.append(element("strong", "", correct ? "Correct" : `Not quite. The correct answer is ${LETTERS[question.answerIndex]}.`));
            feedback.append(document.createTextNode(question.explanationText));
            stage.append(feedback);
        }
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
        renderQuestion();
    }

    async function loadQuestions() {
        try {
            const response = await fetch("data/reading_questions.json");
            if (!response.ok) throw new Error(`The question file returned HTTP ${response.status}.`);
            const payload = await response.json();
            const questions = Array.isArray(payload)
                ? payload
                : payload && Array.isArray(payload.questions)
                    ? payload.questions
                    : null;
            if (!questions) throw new Error("The reading question file must contain a JSON array.");
            const invalid = questions
                .map((question, index) => ({ question, index }))
                .filter(item => item.question && item.question.status === "approved" && !validQuestion(item.question));
            if (invalid.length) {
                throw new Error(`Question ${invalid[0].index + 1} is marked approved but has invalid or incomplete fields.`);
            }
            const visible = questions.filter(question => question && question.status === "approved");
            const ids = new Set();
            visible.forEach(question => {
                if (ids.has(question.id)) throw new Error(`Duplicate approved question ID: ${question.id}.`);
                ids.add(question.id);
            });
            approvedQuestions = visible;
            filterQuestions();
        } catch (error) {
            console.error("Could not load approved reading questions:", error);
            showMessage(`${error.message} Check the installed JSON file and reload.`, true);
        }
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

    populateDomainFilter();
    loadQuestions();
})();
