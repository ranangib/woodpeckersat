(function () {
    "use strict";

    const HISTORY_KEY = "woodpeckerSatStudyHistory";
    const BOOKMARKS_KEY = "woodpeckerSatReviewBookmarks";
    const EXAM_MONTH_KEY = "woodpeckerSatExamMonth";
    const SETS = [
        { part: 1, file: "/data/quiz_data.json", progressKey: "woodpeckerSatPart1Progress" },
        { part: 2, file: "/data/quiz_data2.json", progressKey: "woodpeckerSatPart2Progress" },
        { part: 3, file: "/data/quiz_data3.json", progressKey: "woodpeckerSatPart3Progress" }
    ];
    const RULES = [
        { id: "comma", title: "Introductory clauses", text: "Use a comma after an introductory dependent clause." },
        { id: "semicolon", title: "Semicolons", text: "Join two independent clauses with a semicolon only when both sides can stand alone." },
        { id: "colon", title: "Colons", text: "A colon usually follows a complete clause and introduces an explanation or list." },
        { id: "agreement", title: "Subject-verb agreement", text: "Match the verb to the subject, not to words between them." },
        { id: "modifier", title: "Modifiers", text: "Place a modifier next to the word or phrase it describes." },
        { id: "pronoun", title: "Pronoun reference", text: "Make each pronoun’s antecedent clear and grammatically consistent." }
    ];
    let catalogPromise;

    function localDateKey(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    }

    function readLocalJson(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value === null ? fallback : JSON.parse(value);
        } catch (error) {
            console.error(`Could not read local study data (${key}):`, error);
            return fallback;
        }
    }

    function writeLocalJson(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Could not save local study data (${key}):`, error);
            const status = document.getElementById("personal-tools-storage-status")
                || document.getElementById("question-bookmark-status");
            if (status) status.textContent = "Could not save locally. Check your browser’s storage settings or available space.";
            return false;
        }
    }

    function loadCatalog() {
        if (!catalogPromise) {
            catalogPromise = Promise.all(SETS.map(async function (set) {
                const response = await fetch(set.file);
                if (!response.ok) throw new Error(`Could not load Part ${set.part} questions (${response.status}).`);
                const questions = await response.json();
                return questions.map(function (question, index) {
                    return Object.assign({}, question, {
                        id: `part${set.part}-${index + 1}`,
                        part: set.part,
                        number: index + 1
                    });
                });
            })).then(function (sets) {
                return sets.flat();
            });
        }
        return catalogPromise;
    }

    function questionHref(question) {
        return `/sat-grammar-practice-test-${question.part}/?question=${question.number}#question-box`;
    }

    function renderDailyQuestion(questions) {
        const container = document.getElementById("daily-question");
        if (!container) return;
        const multipleChoiceQuestions = questions.filter(function (candidate) {
            return Array.isArray(candidate.options) && candidate.options.length === 4;
        });
        const dailyQuestions = multipleChoiceQuestions.length ? multipleChoiceQuestions : questions;
        if (!dailyQuestions.length) {
            container.textContent = "No practice questions are available.";
            return;
        }
        const today = new Date();
        const dayNumber = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000);
        const question = dailyQuestions[((dayNumber % dailyQuestions.length) + dailyQuestions.length) % dailyQuestions.length];
        container.replaceChildren();

        const tag = document.createElement("p");
        tag.className = "countdown-eyebrow";
        tag.textContent = `Part ${question.part} · ${question.tag}`;
        const prompt = document.createElement("p");
        prompt.className = "daily-question-preview";
        prompt.textContent = question.question;
        const options = document.createElement("div");
        options.className = "daily-question-options";
        options.setAttribute("role", "group");
        options.setAttribute("aria-label", "Answer choices");
        const feedback = document.createElement("div");
        feedback.className = "daily-question-feedback";
        feedback.setAttribute("aria-live", "polite");
        question.options.forEach(function (optionText, index) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "daily-question-option";
            button.textContent = `${String.fromCharCode(65 + index)}. ${optionText}`;
            button.addEventListener("click", function () {
                options.querySelectorAll("button").forEach(function (choice) {
                    choice.disabled = true;
                });
                const isCorrect = index === question.answerIndex;
                button.classList.add(isCorrect ? "is-correct" : "is-incorrect");
                const result = document.createElement("p");
                result.className = isCorrect ? "daily-question-result is-correct" : "daily-question-result is-incorrect";
                result.textContent = isCorrect
                    ? "Correct!"
                    : `Not quite. The correct answer is ${String.fromCharCode(65 + question.answerIndex)}.`;
                const explanation = document.createElement("p");
                explanation.textContent = question.explanationText;
                feedback.replaceChildren(result, explanation);
            });
            options.appendChild(button);
        });
        const practiceLink = document.createElement("a");
        practiceLink.href = questionHref(question);
        practiceLink.textContent = `Practice this in Part ${question.part}`;
        container.append(tag, prompt, options, feedback, practiceLink);
    }

    function calculateStreak(days) {
        const activeDays = new Set(days);
        const today = new Date();
        let cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        if (!activeDays.has(localDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
        let streak = 0;
        while (activeDays.has(localDateKey(cursor))) {
            streak += 1;
            cursor.setDate(cursor.getDate() - 1);
        }
        return streak;
    }

    function readAnswerHistory() {
        const data = readLocalJson(HISTORY_KEY, { answers: {}, days: [] });
        if (!data || typeof data !== "object" || Array.isArray(data)) {
            console.error("Saved study history has an invalid format.");
            return { answers: {}, days: [] };
        }
        return {
            answers: data.answers && typeof data.answers === "object" && !Array.isArray(data.answers) ? data.answers : {},
            days: Array.isArray(data.days) ? data.days.filter(function (day) { return /^\d{4}-\d{2}-\d{2}$/.test(day); }) : []
        };
    }

    function renderHistory(questions) {
        const history = readAnswerHistory();
        const streakElement = document.getElementById("practice-streak");
        if (streakElement) {
            const streak = calculateStreak(history.days);
            streakElement.textContent = streak
                ? `${streak} day${streak === 1 ? "" : "s"} in a row · keep it going!`
                : "Answer a practice question today to start a new streak.";
        }

        const attempts = Object.assign({}, history.answers);
        SETS.forEach(function (set) {
            try {
                const stored = localStorage.getItem(set.progressKey);
                if (!stored) return;
                const progress = JSON.parse(stored);
                const questionsForSet = questions.filter(function (question) { return question.part === set.part; });
                if (!progress || !progress.answers || typeof progress.answers !== "object" || Array.isArray(progress.answers)) return;
                Object.keys(progress.answers).forEach(function (number) {
                    const selected = progress.answers[number];
                    const question = questionsForSet[Number(number)];
                    if (!question || !Number.isInteger(selected)) return;
                    attempts[question.id] = {
                        tag: question.tag,
                        correct: selected === question.answerIndex
                    };
                });
            } catch (error) {
                console.error(`Could not summarize saved Part ${set.part} answers:`, error);
            }
        });

        const answered = Object.keys(attempts);
        const missedByTag = {};
        answered.forEach(function (id) {
            const attempt = attempts[id];
            if (attempt && attempt.correct === false) {
                missedByTag[attempt.tag || "Other"] = (missedByTag[attempt.tag || "Other"] || 0) + 1;
            }
        });
        const summary = document.getElementById("mistake-summary");
        if (!summary) return;
        summary.replaceChildren();
        if (!answered.length) {
            summary.textContent = "Your missed-question patterns will appear here as you practice.";
            return;
        }
        const heading = document.createElement("p");
        heading.textContent = `Latest saved results: ${answered.length} question${answered.length === 1 ? "" : "s"} answered; ${Object.values(missedByTag).reduce((total, count) => total + count, 0)} missed.`;
        summary.appendChild(heading);
        const tags = Object.keys(missedByTag).sort((a, b) => missedByTag[b] - missedByTag[a]).slice(0, 5);
        if (!tags.length) {
            const message = document.createElement("p");
            message.textContent = "No missed questions in the saved results. Great work!";
            summary.appendChild(message);
            return;
        }
        const list = document.createElement("ul");
        list.className = "mistake-summary-list";
        tags.forEach(function (tag) {
            const item = document.createElement("li");
            item.textContent = `${tag}: ${missedByTag[tag]} missed`;
            list.appendChild(item);
        });
        summary.appendChild(list);
    }

    function readBookmarks() {
        const bookmarks = readLocalJson(BOOKMARKS_KEY, []);
        return Array.isArray(bookmarks) ? [...new Set(bookmarks.filter((id) => /^part[1-3]-\d+$/.test(id)))] : [];
    }

    function updateBookmarkButton(questionId) {
        const button = document.getElementById("question-bookmark-button");
        if (!button) return;
        const bookmarked = readBookmarks().includes(questionId);
        button.textContent = bookmarked ? "★ Saved for test-day review" : "☆ Add to my test-day review list";
        button.classList.toggle("is-bookmarked", bookmarked);
        button.setAttribute("aria-pressed", String(bookmarked));
    }

    function renderBookmarks(questions) {
        const list = document.getElementById("personal-bookmarks");
        if (!list) return;
        const byId = new Map(questions.map((question) => [question.id, question]));
        list.replaceChildren();
        const bookmarks = readBookmarks();
        if (!bookmarks.length) {
            const empty = document.createElement("li");
            empty.textContent = "No saved questions yet. Bookmark one from a practice set.";
            list.appendChild(empty);
            return;
        }
        bookmarks.forEach(function (id) {
            const question = byId.get(id);
            if (!question) return;
            const item = document.createElement("li");
            const link = document.createElement("a");
            link.href = questionHref(question);
            link.textContent = `Part ${question.part}, Q${question.number}: ${question.tag}`;
            const remove = document.createElement("button");
            remove.type = "button";
            remove.textContent = "Remove";
            remove.setAttribute("aria-label", `Remove Part ${question.part} question ${question.number} from review list`);
            remove.addEventListener("click", function () {
                const updated = readBookmarks().filter((bookmark) => bookmark !== id);
                if (writeLocalJson(BOOKMARKS_KEY, updated)) renderBookmarks(questions);
            });
            item.append(link, remove);
            list.appendChild(item);
        });
    }

    function initializeQuestionBookmark() {
        const container = document.getElementById("question-personal-tools");
        if (!container) return;
        const questionId = container.dataset.questionId;
        const button = document.createElement("button");
        button.type = "button";
        button.id = "question-bookmark-button";
        const notice = document.createElement("p");
        notice.className = "local-storage-inline";
        notice.textContent = "Saved only in this browser on this device. Clearing this site’s stored data/local storage removes this list.";
        button.addEventListener("click", function () {
            const bookmarks = readBookmarks();
            const updated = bookmarks.includes(questionId)
                ? bookmarks.filter((id) => id !== questionId)
                : bookmarks.concat(questionId);
            if (writeLocalJson(BOOKMARKS_KEY, updated)) updateBookmarkButton(questionId);
        });
        container.replaceChildren(button, notice);
        updateBookmarkButton(questionId);
    }

    function saveStudyAnswer(questionId, tag, isCorrect) {
        const history = readAnswerHistory();
        const today = localDateKey(new Date());
        history.answers[questionId] = { tag: tag, correct: Boolean(isCorrect), answeredOn: today };
        history.days = [...new Set(history.days.concat(today))].sort().slice(-400);
        writeLocalJson(HISTORY_KEY, history);
    }

    function initializeCountdown() {
        const monthSelect = document.getElementById("exam-month");
        const countdown = document.getElementById("exam-countdown");
        if (!monthSelect || !countdown) return;
        const months = {
            January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
            July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
        };
        const savedMonth = readLocalJson(EXAM_MONTH_KEY, null);
        if (Object.prototype.hasOwnProperty.call(months, savedMonth)) monthSelect.value = savedMonth;

        function update() {
            const now = new Date();
            let year = now.getFullYear();
            let target = new Date(year, months[monthSelect.value], 1);
            if (target <= now) {
                year += 1;
                target = new Date(year, months[monthSelect.value], 1);
            }
            const days = Math.ceil((target.getTime() - now.getTime()) / 86400000);
            countdown.textContent = `${days} day${days === 1 ? "" : "s"} until ${monthSelect.value} ${year} (approximate; check official test dates).`;
        }

        monthSelect.addEventListener("change", function () {
            writeLocalJson(EXAM_MONTH_KEY, monthSelect.value);
            update();
        });
        update();
    }

    function initializePrintableSheet(questions) {
        const questionSelect = document.getElementById("print-question-select");
        const printButton = document.getElementById("print-study-sheet");
        if (!questionSelect || !printButton) return;
        questions.forEach(function (question) {
            const option = document.createElement("option");
            option.value = question.id;
            option.textContent = `Part ${question.part}, Q${question.number} — ${question.tag}`;
            questionSelect.appendChild(option);
        });

        printButton.addEventListener("click", function () {
            const selectedRules = [...document.querySelectorAll('input[name="print-rule"]:checked')]
                .map((input) => RULES.find((rule) => rule.id === input.value))
                .filter(Boolean);
            const selectedIds = new Set([...questionSelect.selectedOptions].map((option) => option.value));
            const selectedQuestions = questions.filter((question) => selectedIds.has(question.id));
            if (!selectedRules.length && !selectedQuestions.length) {
                document.getElementById("printable-status").textContent = "Select at least one rule reminder or practice question first.";
                return;
            }

            let sheet = document.getElementById("printable-sheet");
            if (!sheet) {
                sheet = document.createElement("section");
                sheet.id = "printable-sheet";
                sheet.className = "printable-sheet-output";
                document.body.appendChild(sheet);
            }
            sheet.replaceChildren();
            const title = document.createElement("h1");
            title.textContent = "My SAT Study Sheet";
            const date = document.createElement("p");
            date.textContent = `Created ${new Date().toLocaleDateString()}`;
            sheet.append(title, date);
            if (selectedRules.length) {
                const heading = document.createElement("h2");
                heading.textContent = "Rule reminders";
                const list = document.createElement("ul");
                selectedRules.forEach(function (rule) {
                    const item = document.createElement("li");
                    const strong = document.createElement("strong");
                    strong.textContent = `${rule.title}: `;
                    item.append(strong, document.createTextNode(rule.text));
                    list.appendChild(item);
                });
                sheet.append(heading, list);
            }
            if (selectedQuestions.length) {
                const heading = document.createElement("h2");
                heading.textContent = "Practice questions and explanations";
                sheet.appendChild(heading);
                selectedQuestions.forEach(function (question, index) {
                    const section = document.createElement("section");
                    const titleLine = document.createElement("h3");
                    titleLine.textContent = `${index + 1}. Part ${question.part}, Question ${question.number} — ${question.tag}`;
                    const prompt = document.createElement("p");
                    prompt.textContent = question.question;
                    const answer = document.createElement("p");
                    answer.textContent = `Correct answer: ${question.options[question.answerIndex]}`;
                    const explanation = document.createElement("p");
                    explanation.textContent = question.explanationText;
                    section.append(titleLine, prompt, answer, explanation);
                    sheet.appendChild(section);
                });
            }
            document.getElementById("printable-status").textContent = "Print dialog opened. Choose “Save as PDF” to keep a digital copy.";
            document.body.classList.add("printing-study-sheet");
            window.addEventListener("afterprint", function clearPrintSheet() {
                document.body.classList.remove("printing-study-sheet");
                window.removeEventListener("afterprint", clearPrintSheet);
            });
            window.print();
        });
    }

    async function initializeHome() {
        initializeCountdown();
        try {
            const questions = await loadCatalog();
            renderDailyQuestion(questions);
            renderBookmarks(questions);
            renderHistory(questions);
            initializePrintableSheet(questions);
            window.addEventListener("storage", function (event) {
                if ([HISTORY_KEY, BOOKMARKS_KEY, ...SETS.map((set) => set.progressKey)].includes(event.key)) {
                    renderBookmarks(questions);
                    renderHistory(questions);
                }
            });
            window.addEventListener("pageshow", function () {
                renderBookmarks(questions);
                renderHistory(questions);
            });
        } catch (error) {
            console.error("Could not initialize personal study tools:", error);
            const daily = document.getElementById("daily-question");
            if (daily) daily.textContent = "Today’s question could not be loaded. Please refresh the page.";
            const status = document.getElementById("printable-status");
            if (status) status.textContent = "Question data could not be loaded for the printable sheet.";
        }
    }

    window.WoodpeckerPersonalTools = {
        renderQuestionBookmark: function (questionId) {
            const container = document.getElementById("question-personal-tools");
            if (container) container.dataset.questionId = questionId;
            initializeQuestionBookmark();
        },
        recordAnswer: saveStudyAnswer
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            if (document.getElementById("daily-question")) initializeHome();
        }, { once: true });
    } else if (document.getElementById("daily-question")) {
        initializeHome();
    }
}());
