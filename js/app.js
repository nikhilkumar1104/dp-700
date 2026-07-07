(function () {
  const STORAGE_KEY = "dp700_html_simulator_state_v6";
  ["dp700_html_simulator_state", "dp700_html_simulator_state_v3", "dp700_html_simulator_state_v4", "dp700_html_simulator_state_v5"].forEach((key) => localStorage.removeItem(key));
  const HISTORY_KEY = "dp700_html_simulator_history";
  const BOOKMARK_KEY = "dp700_html_simulator_bookmarks";
  const ACTIVITY_KEY = "dp700_html_simulator_activity";
  const APP_VERSION = "6.0-no-repeat-question-bank";
  const USED_QUESTION_KEY = "dp700_html_simulator_used_question_ids_v6";

  let questionBank = window.generateQuestionBank ? window.generateQuestionBank(1000) : [];
  let state = createEmptyState();
  let timerInterval = null;
  let autosaveInterval = null;
  let currentMode = "mock";
  let focusEvents = Number(localStorage.getItem(ACTIVITY_KEY) || 0);
  let historyLocked = false;

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const screens = {
    landing: $("#landing"),
    instructions: $("#instructions"),
    exam: $("#exam"),
    results: $("#results"),
    review: $("#review"),
    dashboard: $("#dashboard"),
    admin: $("#admin")
  };

  function createEmptyState() {
    return {
      appVersion: APP_VERSION,
      candidateName: "Nikhil Kumar",
      selectedQuestions: [],
      currentIndex: 0,
      answers: {},
      marked: {},
      eliminated: {},
      seen: {},
      questionStartedAt: Date.now(),
      timeSpent: {},
      remainingSeconds: 120 * 60,
      startedAt: null,
      submittedAt: null,
      lastSavedAt: null,
      mode: "mock",
      topicFilter: "all",
      result: null
    };
  }

  function init() {
    hydrateSavedState();
    bindEvents();
    renderLanding();
    renderDashboard();
    renderAdmin();

    if (isLockedExam()) {
      renderExam();
      route("exam", { force: true });
      startIntervals();
      lockBrowserHistory();
      showToast("Your in-progress exam was restored. Submit the exam to leave the exam screen.");
      return;
    }

    route("landing");
    showToast("Static HTML/CSS simulator loaded successfully.");
  }

  function bindEvents() {
    $$('[data-route]').forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        route(button.dataset.route);
      });
    });

    $("#startPrepBtn").addEventListener("click", () => route("instructions"));

    $$(".mode-card").forEach((card) => {
      card.addEventListener("click", () => {
        currentMode = card.dataset.mode;
        $("#modeSelect").value = currentMode;
        route("instructions");
      });
    });

    $("#agreementCheckbox").addEventListener("change", (event) => {
      $("#beginExamBtn").disabled = !event.target.checked;
    });

    $("#beginExamBtn").addEventListener("click", startExam);
    $("#prevQuestionBtn").addEventListener("click", () => moveQuestion(-1));
    $("#nextQuestionBtn").addEventListener("click", () => moveQuestion(1));
    $("#markReviewBtn").addEventListener("click", toggleMarkReview);
    $("#checkAnswerBtn").addEventListener("click", showCurrentAnswerCheck);
    $("#submitExamBtn").addEventListener("click", submitExamWithConfirm);
    $("#reviewAnswersBtn").addEventListener("click", () => renderReview("all"));
    $("#retakeExamBtn").addEventListener("click", () => route("instructions"));
    $("#fullscreenBtn").addEventListener("click", toggleFullScreen);
    $("#regenerateBankBtn").addEventListener("click", regenerateBank);
    $("#adminSearch").addEventListener("input", renderAdmin);
    $("#contrastToggle").addEventListener("click", () => document.body.classList.toggle("high-contrast"));

    $$(".review-filters button").forEach((button) => {
      button.addEventListener("click", () => renderReview(button.dataset.filter));
    });

    document.addEventListener("keydown", (event) => {
      if (!screens.exam.classList.contains("active")) return;
      if (event.key === "ArrowRight") moveQuestion(1);
      if (event.key === "ArrowLeft") moveQuestion(-1);
      if (event.key.toLowerCase() === "m") toggleMarkReview();
    });

    document.addEventListener("visibilitychange", () => {
      if (screens.exam.classList.contains("active") && document.hidden) {
        focusEvents += 1;
        localStorage.setItem(ACTIVITY_KEY, String(focusEvents));
        updateFocusLog();
        showToast("Browser focus change logged for practice integrity.");
      }
    });

    window.addEventListener("beforeunload", (event) => {
      if (!isLockedExam()) return;
      event.preventDefault();
      event.returnValue = "Your exam is still in progress. Use Submit Exam to finish before leaving.";
    });

    window.addEventListener("popstate", () => {
      if (!isLockedExam()) return;
      lockBrowserHistory(true);
      route("exam", { force: true });
      showToast("Exam is locked. Submit the exam before leaving this screen.");
    });
  }

  function hydrateSavedState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved && saved.selectedQuestions && !saved.submittedAt) {
        if (saved.appVersion !== APP_VERSION) {
          localStorage.removeItem(STORAGE_KEY);
          return;
        }
        const elapsedWhileAway = saved.lastSavedAt ? Math.floor((Date.now() - saved.lastSavedAt) / 1000) : 0;
        saved.remainingSeconds = Math.max(0, Number(saved.remainingSeconds || 0) - elapsedWhileAway);
        saved.questionStartedAt = Date.now();
        state = saved;
      }
    } catch (error) {
      console.warn("Could not restore saved state", error);
    }
  }

  function route(name, options = {}) {
    if (isLockedExam() && name !== "exam" && !options.force) {
      Object.values(screens).forEach((screen) => screen.classList.remove("active"));
      screens.exam.classList.add("active");
      document.body.classList.add("exam-active");
      lockBrowserHistory();
      showToast("Exam is locked. Submit the exam before opening another page.");
      return false;
    }

    Object.values(screens).forEach((screen) => screen.classList.remove("active"));
    screens[name].classList.add("active");

    document.body.classList.toggle("exam-active", name === "exam" && isLockedExam());
    if (name !== "exam") stopIntervals(false);
    if (name === "exam" && isLockedExam()) lockBrowserHistory();
    if (name === "dashboard") renderDashboard();
    if (name === "admin") renderAdmin();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return true;
  }

  function renderLanding() {
    $("#bankCount").textContent = `${questionBank.length.toLocaleString()} original questions`;
    $("#adminQuestionCount").textContent = questionBank.length.toLocaleString();
    updateFocusLog();
  }

  function startExam() {
    localStorage.removeItem(STORAGE_KEY);
    const mode = $("#modeSelect").value || currentMode;
    const topicFilter = $("#topicSelect").value || "all";
    const candidateName = $("#candidateName").value.trim() || "Candidate";
    const examConfig = getExamConfig(mode);
    const pool = topicFilter === "all" ? questionBank : questionBank.filter((q) => q.topic === topicFilter);
    const selectedQuestions = pickQuestions(pool, examConfig.questionCount, mode);

    if (!selectedQuestions.length) {
      showToast("No questions available for this topic. Choose All Topics.");
      return;
    }

    state = createEmptyState();
    state.candidateName = candidateName;
    state.selectedQuestions = selectedQuestions;
    state.remainingSeconds = examConfig.durationMinutes * 60;
    state.mode = mode;
    state.topicFilter = topicFilter;
    state.startedAt = Date.now();
    state.questionStartedAt = Date.now();
    state.seen[0] = true;
    rememberUsedQuestions(selectedQuestions);

    saveState();
    renderExam();
    route("exam", { force: true });
    startIntervals();
    lockBrowserHistory();
    showToast("Exam started and locked. Use Submit Exam to finish.");
  }

  function getExamConfig(mode) {
    const configs = {
      mock: { questionCount: 50, durationMinutes: 120 },
      topic: { questionCount: 25, durationMinutes: 60 },
      timed: { questionCount: 20, durationMinutes: 30 },
      adaptive: { questionCount: 35, durationMinutes: 75 },
      weak: { questionCount: 25, durationMinutes: 60 },
      final: { questionCount: 60, durationMinutes: 120 }
    };
    return configs[mode] || configs.mock;
  }

  function pickQuestions(pool, count, mode) {
    const uniquePool = dedupeQuestionPool(pool);
    const recentlyUsed = getRecentlyUsedQuestionIds();
    let eligiblePool = uniquePool.filter((question) => !recentlyUsed.has(question.id));

    // When the user has practiced many attempts, reset the no-repeat memory instead of serving too few questions.
    if (eligiblePool.length < count) {
      localStorage.removeItem(USED_QUESTION_KEY);
      eligiblePool = uniquePool;
    }

    const shuffledPool = shuffleArray([...eligiblePool]);
    const history = getHistory();
    const weakTopics = getWeakTopics(history);
    let selected;

    if (mode === "weak" && weakTopics.length) {
      const weakPool = shuffledPool.filter((q) => weakTopics.includes(q.topic));
      const remainingPool = shuffledPool.filter((q) => !weakTopics.includes(q.topic));
      selected = [...weakPool, ...remainingPool].slice(0, count);
    } else if (mode === "adaptive") {
      const advancedFirst = shuffledPool.filter((q) => ["Intermediate", "Advanced", "Expert"].includes(q.difficulty));
      const foundation = shuffledPool.filter((q) => q.difficulty === "Foundation");
      selected = [...advancedFirst, ...foundation].slice(0, count);
    } else {
      selected = stratifiedPick(shuffledPool, count);
    }

    return selected.slice(0, count).map(prepareQuestionForAttempt);
  }

  function dedupeQuestionPool(pool) {
    const seen = new Set();
    return pool.filter((question) => {
      const key = question.uniquenessKey || `${question.type}|${question.topic}|${question.question}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function stratifiedPick(pool, count) {
    const selected = [];
    const byType = {};
    const byTopic = {};
    pool.forEach((question) => {
      if (!byType[question.type]) byType[question.type] = [];
      if (!byTopic[question.topic]) byTopic[question.topic] = [];
      byType[question.type].push(question);
      byTopic[question.topic].push(question);
    });

    const typeNames = Object.keys(byType);
    const topicNames = Object.keys(byTopic);
    let guard = 0;
    while (selected.length < count && guard < count * 20) {
      const preferredType = typeNames[guard % Math.max(typeNames.length, 1)];
      const preferredTopic = topicNames[(Math.floor(guard / Math.max(typeNames.length, 1)) + guard) % Math.max(topicNames.length, 1)];
      const candidate = pool.find((question) =>
        question.type === preferredType &&
        question.topic === preferredTopic &&
        !selected.some((existing) => existing.id === question.id)
      ) || pool.find((question) => !selected.some((existing) => existing.id === question.id));

      if (candidate) selected.push(candidate);
      guard += 1;
    }

    return selected;
  }

  function getRecentlyUsedQuestionIds() {
    try {
      return new Set(JSON.parse(localStorage.getItem(USED_QUESTION_KEY) || "[]"));
    } catch (error) {
      return new Set();
    }
  }

  function rememberUsedQuestions(questions) {
    const used = Array.from(getRecentlyUsedQuestionIds());
    const merged = [...used, ...questions.map((question) => question.id)];
    const unique = Array.from(new Set(merged));
    localStorage.setItem(USED_QUESTION_KEY, JSON.stringify(unique.slice(-850)));
  }

  function renderExam() {
    const question = getCurrentQuestion();
    if (!question) return;
    const total = state.selectedQuestions.length;
    state.seen[state.currentIndex] = true;
    $("#examCandidateName").textContent = state.candidateName;
    $("#candidateInitials").textContent = initials(state.candidateName);
    $("#questionNumberText").textContent = `Question ${state.currentIndex + 1} of ${total}`;
    $("#estimatedTimeText").textContent = `Estimated time: ${question.estimated_time} min`;
    $("#questionTitle").textContent = question.title;
    $("#questionText").textContent = question.question;
    $("#questionTypeBadge").textContent = question.type;
    $("#difficultyBadge").textContent = question.difficulty;
    $("#topicBadge").textContent = question.topic;
    $("#prevQuestionBtn").disabled = state.currentIndex === 0;
    $("#nextQuestionBtn").textContent = state.currentIndex === total - 1 ? "Finish" : "Next";
    $("#markReviewBtn").classList.toggle("active", Boolean(state.marked[state.currentIndex]));
    $("#markReviewBtn").textContent = state.marked[state.currentIndex] ? "Marked for Review" : "Mark for Review";

    if (question.caseStudy) {
      $("#caseStudyBox").classList.remove("hidden");
      $("#caseStudyBox").innerHTML = `
        <strong>${escapeHtml(question.caseStudy.industry)}: ${escapeHtml(question.caseStudy.name)}</strong><br>
        <b>Business requirements:</b> ${escapeHtml(question.caseStudy.business)}<br>
        <b>Technical constraints:</b> ${escapeHtml(question.caseStudy.constraints)}<br>
        <b>Existing architecture:</b> ${escapeHtml(question.caseStudy.architecture)}
      `;
    } else {
      $("#caseStudyBox").classList.add("hidden");
      $("#caseStudyBox").innerHTML = "";
    }

    renderAnswerArea(question);
    hideAnswerCheck();
    renderNavigator();
    updateTimerDisplay();
    updateProgress();
    updateFocusLog();
    saveState();
  }

  function renderAnswerArea(question) {
    const answerArea = $("#answerArea");
    answerArea.innerHTML = "";

    if (["Drag and Drop", "Sequence Ordering"].includes(question.type)) {
      renderOrderingQuestion(question, answerArea);
      return;
    }

    if (question.type === "Match Items") {
      renderMatchQuestion(question, answerArea);
      return;
    }

    const selected = state.answers[state.currentIndex] || [];
    const eliminated = state.eliminated[state.currentIndex] || {};
    const inputType = question.type === "Multiple Choice" ? "checkbox" : "radio";

    question.options.forEach((option, index) => {
      const optionRow = document.createElement("label");
      optionRow.className = "option-row";
      optionRow.dataset.optionIndex = String(index);
      optionRow.classList.toggle("selected", selected.includes(index));
      optionRow.classList.toggle("eliminated", Boolean(eliminated[index]));
      optionRow.innerHTML = `
        <input type="${inputType}" name="question-option" ${selected.includes(index) ? "checked" : ""} aria-label="Select answer option ${index + 1}">
        <span>${escapeHtml(option)}</span>
        <button type="button" class="eliminate-btn ${eliminated[index] ? "active" : ""}" title="Eliminate option">✕</button>
      `;
      optionRow.querySelector("input").addEventListener("change", () => updateChoiceAnswer(index, inputType));
      optionRow.querySelector(".eliminate-btn").addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleElimination(index);
      });
      answerArea.appendChild(optionRow);
    });
  }

  function renderOrderingQuestion(question, answerArea) {
    const saved = state.answers[state.currentIndex];
    const initialOrder = Array.isArray(question.initialOrder) && question.initialOrder.length === question.options.length
      ? question.initialOrder
      : question.options.map((_, index) => index);
    const currentOrder = Array.isArray(saved) && saved.length === question.options.length ? saved : initialOrder;
    const list = document.createElement("div");
    list.className = "drag-list";

    currentOrder.forEach((optionIndex, orderIndex) => {
      const item = document.createElement("div");
      item.className = "drag-item";
      item.dataset.optionIndex = String(optionIndex);
      item.dataset.position = String(orderIndex);
      item.innerHTML = `
        <span><strong>${orderIndex + 1}.</strong> ${escapeHtml(question.options[optionIndex])}</span>
        <span>
          <button type="button" aria-label="Move up">↑</button>
          <button type="button" aria-label="Move down">↓</button>
        </span>
      `;
      const [upButton, downButton] = item.querySelectorAll("button");
      upButton.disabled = orderIndex === 0;
      downButton.disabled = orderIndex === currentOrder.length - 1;
      upButton.addEventListener("click", () => moveOrderItem(orderIndex, -1));
      downButton.addEventListener("click", () => moveOrderItem(orderIndex, 1));
      list.appendChild(item);
    });

    answerArea.appendChild(list);
    state.answers[state.currentIndex] = currentOrder;
  }

  function renderMatchQuestion(question, answerArea) {
    const saved = state.answers[state.currentIndex] || {};
    const matchGrid = document.createElement("div");
    matchGrid.className = "match-grid";

    question.options.forEach((left) => {
      const row = document.createElement("div");
      row.className = "match-row";
      row.dataset.left = left;
      const rowMatchOptions = question.matchOptionOrderByLeft && Array.isArray(question.matchOptionOrderByLeft[left])
        ? question.matchOptionOrderByLeft[left]
        : (question.matchOptions || []);
      const selectOptions = [`<option value="">Select match</option>`]
        .concat(rowMatchOptions.map((option) => `<option value="${escapeAttr(option)}" ${saved[left] === option ? "selected" : ""}>${escapeHtml(option)}</option>`))
        .join("");
      row.innerHTML = `
        <strong>${escapeHtml(left)}</strong>
        <select aria-label="Match for ${escapeAttr(left)}">${selectOptions}</select>
      `;
      row.querySelector("select").addEventListener("change", (event) => {
        const updated = { ...state.answers[state.currentIndex], [left]: event.target.value };
        state.answers[state.currentIndex] = updated;
        markSavedSoon();
      });
      matchGrid.appendChild(row);
    });

    answerArea.appendChild(matchGrid);
  }

  function updateChoiceAnswer(index, inputType) {
    const existing = state.answers[state.currentIndex] || [];
    if (inputType === "radio") {
      state.answers[state.currentIndex] = [index];
    } else if (existing.includes(index)) {
      state.answers[state.currentIndex] = existing.filter((value) => value !== index);
    } else {
      state.answers[state.currentIndex] = [...existing, index].sort((a, b) => a - b);
    }
    markSavedSoon();
    renderExam();
  }

  function toggleElimination(index) {
    const eliminated = state.eliminated[state.currentIndex] || {};
    eliminated[index] = !eliminated[index];
    state.eliminated[state.currentIndex] = eliminated;
    markSavedSoon();
    renderExam();
  }

  function moveOrderItem(position, direction) {
    const order = [...(state.answers[state.currentIndex] || [])];
    const target = position + direction;
    if (target < 0 || target >= order.length) return;
    [order[position], order[target]] = [order[target], order[position]];
    state.answers[state.currentIndex] = order;
    markSavedSoon();
    renderExam();
  }

  function getCurrentQuestion() {
    return state.selectedQuestions[state.currentIndex];
  }

  function moveQuestion(direction) {
    captureTimeSpent();
    if (state.currentIndex === state.selectedQuestions.length - 1 && direction > 0) {
      submitExamWithConfirm();
      return;
    }
    state.currentIndex = Math.max(0, Math.min(state.selectedQuestions.length - 1, state.currentIndex + direction));
    state.questionStartedAt = Date.now();
    renderExam();
  }

  function toggleMarkReview() {
    state.marked[state.currentIndex] = !state.marked[state.currentIndex];
    markSavedSoon();
    renderExam();
  }

  function renderNavigator() {
    const nav = $("#questionNavigator");
    nav.innerHTML = "";
    state.selectedQuestions.forEach((_, index) => {
      const button = document.createElement("button");
      button.className = "nav-number";
      button.textContent = index + 1;
      const answered = isAnswered(index);
      if (answered) button.classList.add("answered");
      if (state.marked[index]) button.classList.add("marked");
      if (state.currentIndex === index) button.classList.add("current");
      if (!state.seen[index]) button.title = "Unseen question";
      button.addEventListener("click", () => {
        captureTimeSpent();
        state.currentIndex = index;
        state.questionStartedAt = Date.now();
        renderExam();
      });
      nav.appendChild(button);
    });
  }

  function isAnswered(index) {
    const answer = state.answers[index];
    const question = state.selectedQuestions[index];
    if (!question) return false;
    if (question.type === "Match Items") return answer && Object.values(answer).filter(Boolean).length === question.options.length;
    if (Array.isArray(answer)) return answer.length > 0;
    return Boolean(answer);
  }

  function updateProgress() {
    const answered = state.selectedQuestions.filter((_, index) => isAnswered(index)).length;
    const total = state.selectedQuestions.length;
    $("#progressText").textContent = `${answered} / ${total}`;
    $("#progressBar").style.width = `${Math.round((answered / total) * 100)}%`;
  }

  function startIntervals() {
    stopIntervals(false);
    timerInterval = setInterval(() => {
      state.remainingSeconds -= 1;
      if (state.remainingSeconds <= 0) {
        state.remainingSeconds = 0;
        submitExam(false);
      }
      updateTimerDisplay();
    }, 1000);
    autosaveInterval = setInterval(saveState, 10000);
  }

  function stopIntervals(clearAll = true) {
    if (timerInterval) clearInterval(timerInterval);
    if (autosaveInterval) clearInterval(autosaveInterval);
    timerInterval = null;
    autosaveInterval = null;
    if (clearAll) localStorage.removeItem(STORAGE_KEY);
  }

  function updateTimerDisplay() {
    const hours = Math.floor(state.remainingSeconds / 3600);
    const minutes = Math.floor((state.remainingSeconds % 3600) / 60);
    const seconds = state.remainingSeconds % 60;
    $("#timerDisplay").textContent = [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
    const timerCard = $(".timer-card");
    timerCard.classList.remove("warning", "danger");
    const warning = $("#timerWarning");

    if (state.remainingSeconds <= 60) {
      timerCard.classList.add("danger");
      warning.textContent = "1 minute warning";
    } else if (state.remainingSeconds <= 5 * 60) {
      timerCard.classList.add("danger");
      warning.textContent = "5 minute warning";
    } else if (state.remainingSeconds <= 10 * 60) {
      timerCard.classList.add("warning");
      warning.textContent = "10 minute warning";
    } else if (state.remainingSeconds <= 30 * 60) {
      timerCard.classList.add("warning");
      warning.textContent = "30 minute warning";
    } else if (state.remainingSeconds <= 60 * 60) {
      warning.textContent = "60 minute checkpoint";
    } else {
      warning.textContent = "Exam in progress";
    }
  }

  function submitExamWithConfirm() {
    const unanswered = state.selectedQuestions.filter((_, index) => !isAnswered(index)).length;
    const message = unanswered > 0
      ? `You still have ${unanswered} unanswered question(s). Submit exam now?`
      : "Submit exam now?";
    if (confirm(message)) submitExam(true);
  }

  function submitExam(manual) {
    captureTimeSpent();
    state.submittedAt = Date.now();
    state.result = calculateResult();
    saveAttempt(state.result, manual);
    historyLocked = false;
    stopIntervals(true);
    renderResults();
    renderDashboard();
    route("results", { force: true });
    showToast(manual ? "Exam submitted." : "Time ended. Exam submitted automatically.");
  }

  function calculateResult() {
    const total = state.selectedQuestions.length;
    let correct = 0;
    const topicStats = {};
    const details = state.selectedQuestions.map((question, index) => {
      const userAnswer = normalizeAnswer(state.answers[index], question);
      const correctAnswer = normalizeAnswer(question.answer, question);
      const isCorrect = compareAnswers(userAnswer, correctAnswer, question.type);
      if (isCorrect) correct += 1;
      if (!topicStats[question.topic]) topicStats[question.topic] = { total: 0, correct: 0 };
      topicStats[question.topic].total += 1;
      if (isCorrect) topicStats[question.topic].correct += 1;
      return {
        id: question.id,
        index,
        isCorrect,
        userAnswer,
        correctAnswer,
        topic: question.topic,
        difficulty: question.difficulty,
        timeSpent: state.timeSpent[index] || 0,
        marked: Boolean(state.marked[index])
      };
    });

    const percentage = Math.round((correct / total) * 100);
    const totalTimeSpent = Object.values(state.timeSpent).reduce((sum, value) => sum + value, 0);
    const avgTime = total ? Math.round(totalTimeSpent / total) : 0;
    return {
      total,
      correct,
      percentage,
      topicStats,
      details,
      totalTimeSpent,
      avgTime,
      markedCount: Object.values(state.marked).filter(Boolean).length,
      readiness: getReadiness(percentage)
    };
  }

  function normalizeAnswer(answer, question) {
    if (question.type === "Match Items") return answer || {};
    if (Array.isArray(answer)) return answer;
    if (answer == null) return [];
    return [answer];
  }

  function compareAnswers(userAnswer, correctAnswer, type) {
    if (type === "Match Items") {
      if (!userAnswer || !correctAnswer) return false;
      const correctKeys = Object.keys(correctAnswer);
      const userKeys = Object.keys(userAnswer);
      if (userKeys.length !== correctKeys.length) return false;
      return correctKeys.every((key) => userAnswer[key] === correctAnswer[key]);
    }

    if (["Drag and Drop", "Sequence Ordering"].includes(type)) {
      if (!Array.isArray(userAnswer) || !Array.isArray(correctAnswer)) return false;
      if (userAnswer.length !== correctAnswer.length) return false;
      return correctAnswer.every((value, index) => userAnswer[index] === value);
    }

    return JSON.stringify([...userAnswer].sort()) === JSON.stringify([...correctAnswer].sort());
  }

  function getReadiness(percentage) {
    if (percentage >= 85) return "Strong readiness. Focus on review speed and advanced troubleshooting scenarios.";
    if (percentage >= 70) return "Moderate readiness. Improve weaker topics before booking the real certification attempt.";
    if (percentage >= 55) return "Developing readiness. Practice topic-wise modules and review incorrect answers carefully.";
    return "Not ready yet. Rebuild fundamentals across ingestion, transformation, analytics, monitoring, and governance.";
  }

  function renderResults() {
    const result = state.result;
    $("#scorePercent").textContent = `${result.percentage}%`;
    $("#scoreRing").style.background = `conic-gradient(var(--blue-2) ${result.percentage * 3.6}deg, var(--surface-2) 0deg)`;
    $("#readinessText").textContent = result.readiness;
    $("#totalScoreMetric").textContent = `${result.correct} / ${result.total}`;
    $("#timeUsedMetric").textContent = `${Math.round(result.totalTimeSpent / 60)} min`;
    $("#avgTimeMetric").textContent = `${result.avgTime} sec`;
    $("#reviewMetric").textContent = result.markedCount;
    renderTopicChart(result.topicStats);
    renderRecommendations(result.topicStats);
  }

  function renderTopicChart(topicStats) {
    const canvas = $("#topicChart");
    const ctx = canvas.getContext("2d");
    drawBarChart(ctx, canvas, Object.keys(topicStats), Object.values(topicStats).map((stat) => Math.round((stat.correct / stat.total) * 100)), "Topic score %");
  }

  function drawBarChart(ctx, canvas, labels, values, title) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const padding = 46;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    ctx.font = "13px Arial";
    ctx.fillStyle = getCssVar("--muted");
    ctx.fillText(title, padding, 22);
    ctx.strokeStyle = getCssVar("--border");
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();

    const barWidth = Math.max(26, chartWidth / Math.max(labels.length, 1) - 16);
    values.forEach((value, index) => {
      const x = padding + index * (chartWidth / labels.length) + 8;
      const h = (value / 100) * chartHeight;
      const y = padding + chartHeight - h;
      const gradient = ctx.createLinearGradient(0, y, 0, padding + chartHeight);
      gradient.addColorStop(0, getCssVar("--blue-2"));
      gradient.addColorStop(1, getCssVar("--blue"));
      ctx.fillStyle = gradient;
      roundRect(ctx, x, y, barWidth, h, 8);
      ctx.fill();
      ctx.fillStyle = getCssVar("--text");
      ctx.fillText(`${value}%`, x, y - 7);
      ctx.save();
      ctx.translate(x + 4, padding + chartHeight + 13);
      ctx.rotate(-0.25);
      ctx.fillStyle = getCssVar("--muted");
      ctx.fillText(shortLabel(labels[index]), 0, 0);
      ctx.restore();
    });
  }

  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function shortLabel(label) {
    return label
      .replace("Implement and Manage Analytics Solutions", "Analytics")
      .replace("Implement Data Ingestion", "Ingestion")
      .replace("Transform Data", "Transform")
      .replace("Monitor and Optimize", "Monitor")
      .replace("Security and Governance", "Security");
  }

  function renderRecommendations(topicStats) {
    const recommendations = $("#recommendations");
    recommendations.innerHTML = "";
    Object.entries(topicStats)
      .sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total))
      .forEach(([topic, stat]) => {
        const score = Math.round((stat.correct / stat.total) * 100);
        const div = document.createElement("div");
        div.innerHTML = `<strong>${escapeHtml(topic)}: ${score}%</strong><br>${getTopicRecommendation(topic, score)}`;
        recommendations.appendChild(div);
      });
  }

  function getTopicRecommendation(topic, score) {
    const advice = {
      "Implement Data Ingestion": "Practice incremental loading, pipeline parameters, retry policies, and source-to-Bronze audit design.",
      "Transform Data": "Review Spark transformations, schema handling, validation, and Bronze-to-Silver data quality patterns.",
      "Implement and Manage Analytics Solutions": "Strengthen Lakehouse, Warehouse, Delta table, star schema, and curated Gold modeling concepts.",
      "Monitor and Optimize": "Focus on run history, Spark UI, capacity monitoring, query tuning, and small-file optimization.",
      "Security and Governance": "Review RBAC, least privilege, row-level security, masking, sensitivity labels, and audit logs."
    };
    return score >= 80 ? "Good area. Keep practicing advanced scenarios and timing." : advice[topic] || "Review this topic with scenario-based practice.";
  }

  function renderReview(filter = "all") {
    route("review");
    $$(".review-filters button").forEach((button) => button.classList.toggle("active", button.dataset.filter === filter));
    const bookmarks = getBookmarks();
    const list = $("#reviewList");
    list.innerHTML = "";

    const details = state.result?.details || [];
    details.forEach((detail) => {
      const question = state.selectedQuestions[detail.index];
      const isBookmarked = bookmarks.includes(question.id);
      if (filter === "incorrect" && detail.isCorrect) return;
      if (filter === "marked" && !detail.marked) return;
      if (filter === "bookmarked" && !isBookmarked) return;

      const card = document.createElement("article");
      card.className = `review-card ${detail.isCorrect ? "correct" : "incorrect"}`;
      card.innerHTML = `
        <div class="question-toolbar">
          <div>
            <span class="badge">${escapeHtml(question.type)}</span>
            <span class="badge muted">${escapeHtml(question.difficulty)}</span>
            <span class="badge muted">${escapeHtml(question.topic)}</span>
          </div>
          <button class="bookmark-btn ${isBookmarked ? "active" : ""}">${isBookmarked ? "Bookmarked" : "Bookmark"}</button>
        </div>
        <h3>${detail.index + 1}. ${escapeHtml(question.title)}</h3>
        <p>${escapeHtml(question.question)}</p>
        <div class="review-row">
          <div class="answer-box ${detail.isCorrect ? "correct" : "incorrect"}"><strong>Your answer</strong><br>${formatAnswer(detail.userAnswer, question) || "Not answered"}</div>
          <div class="answer-box correct"><strong>Correct answer</strong><br>${formatAnswer(detail.correctAnswer, question)}</div>
        </div>
        <p><strong>Explanation:</strong> ${escapeHtml(question.explanation)}</p>
        <p><strong>References:</strong> ${question.references.map(escapeHtml).join("; ")}</p>
        <p><strong>Time spent:</strong> ${detail.timeSpent || 0} seconds</p>
      `;
      card.querySelector(".bookmark-btn").addEventListener("click", () => {
        toggleBookmark(question.id);
        renderReview(filter);
      });
      list.appendChild(card);
    });

    if (!list.children.length) {
      list.innerHTML = `<div class="content-panel"><strong>No questions found for this filter.</strong></div>`;
    }
  }

  function formatAnswer(answer, question) {
    if (question.type === "Match Items") {
      if (!answer || !Object.keys(answer).length) return "";
      const rowOrder = Array.isArray(question.options) && question.options.length
        ? question.options
        : Object.keys(question.answer || answer || {});
      return rowOrder
        .filter((left) => Object.prototype.hasOwnProperty.call(answer, left))
        .map((left) => `${escapeHtml(left)} → ${escapeHtml(answer[left])}`)
        .join("<br>");
    }
    if (!Array.isArray(answer) || !answer.length) return "";
    if (["Drag and Drop", "Sequence Ordering"].includes(question.type)) {
      return answer.map((index, position) => `${position + 1}. ${escapeHtml(question.options[index])}`).join("<br>");
    }
    return answer.map((index) => escapeHtml(question.options[index])).join("<br>");
  }

  function renderDashboard() {
    const history = getHistory();
    const bookmarks = getBookmarks();
    $("#attemptsMetric").textContent = history.length;
    $("#bestScoreMetric").textContent = `${history.reduce((max, attempt) => Math.max(max, attempt.percentage), 0)}%`;
    $("#streakMetric").textContent = `${calculateStreak(history)} days`;
    $("#bookmarkMetric").textContent = bookmarks.length;
    renderTrendChart(history);
    renderTopicBars(history);
    renderHistoryTable(history);
  }

  function renderTrendChart(history) {
    const canvas = $("#trendChart");
    const ctx = canvas.getContext("2d");
    const labels = history.slice(-8).map((attempt, index) => `A${history.length - Math.min(history.length, 8) + index + 1}`);
    const values = history.slice(-8).map((attempt) => attempt.percentage);
    drawBarChart(ctx, canvas, labels.length ? labels : ["No attempts"], values.length ? values : [0], "Score trend %");
  }

  function renderTopicBars(history) {
    const topicBars = $("#topicBars");
    topicBars.innerHTML = "";
    const aggregate = {};
    history.forEach((attempt) => {
      Object.entries(attempt.topicStats || {}).forEach(([topic, stat]) => {
        if (!aggregate[topic]) aggregate[topic] = { total: 0, correct: 0 };
        aggregate[topic].total += stat.total;
        aggregate[topic].correct += stat.correct;
      });
    });

    if (!Object.keys(aggregate).length) {
      topicBars.innerHTML = `<p>No attempts yet. Start a practice exam to build your trend.</p>`;
      return;
    }

    Object.entries(aggregate).forEach(([topic, stat]) => {
      const score = Math.round((stat.correct / stat.total) * 100);
      const row = document.createElement("div");
      row.className = "topic-bar-row";
      row.innerHTML = `
        <div class="topic-bar-label"><span>${escapeHtml(topic)}</span><strong>${score}%</strong></div>
        <div class="topic-bar-track"><div class="topic-bar-fill" style="width: ${score}%"></div></div>
      `;
      topicBars.appendChild(row);
    });
  }

  function renderHistoryTable(history) {
    const table = $("#historyTable");
    if (!history.length) {
      table.innerHTML = `<p>No attempts yet.</p>`;
      return;
    }
    table.innerHTML = `
      <table>
        <thead><tr><th>Date</th><th>Mode</th><th>Score</th><th>Questions</th><th>Time Used</th><th>Readiness</th></tr></thead>
        <tbody>
          ${history.slice().reverse().map((attempt) => `
            <tr>
              <td>${new Date(attempt.date).toLocaleString()}</td>
              <td>${escapeHtml(attempt.mode)}</td>
              <td><strong>${attempt.percentage}%</strong></td>
              <td>${attempt.correct} / ${attempt.total}</td>
              <td>${Math.round(attempt.totalTimeSpent / 60)} min</td>
              <td>${escapeHtml(attempt.readiness)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  function renderAdmin() {
    $("#adminQuestionCount").textContent = questionBank.length.toLocaleString();
    $("#activityMetric").textContent = focusEvents;
    const search = ($("#adminSearch")?.value || "").toLowerCase();
    const visible = questionBank
      .filter((question) => !search || [question.id, question.title, question.question, question.topic, question.difficulty, question.type].join(" ").toLowerCase().includes(search))
      .slice(0, 80);

    $("#adminQuestionTable").innerHTML = `
      <table>
        <thead><tr><th>ID</th><th>Type</th><th>Topic</th><th>Difficulty</th><th>Question</th></tr></thead>
        <tbody>
          ${visible.map((question) => `
            <tr>
              <td>${question.id}</td>
              <td>${escapeHtml(question.type)}</td>
              <td>${escapeHtml(question.topic)}</td>
              <td>${escapeHtml(question.difficulty)}</td>
              <td>${escapeHtml(question.question)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  function regenerateBank() {
    questionBank = window.generateQuestionBank(1000);
    renderLanding();
    renderAdmin();
    localStorage.removeItem(USED_QUESTION_KEY);
    showToast("Question bank regenerated with deeper variations and no-repeat memory reset.");
  }

  function getWeakTopics(history) {
    if (!history.length) return [];
    const aggregate = {};
    history.forEach((attempt) => {
      Object.entries(attempt.topicStats || {}).forEach(([topic, stat]) => {
        if (!aggregate[topic]) aggregate[topic] = { total: 0, correct: 0 };
        aggregate[topic].total += stat.total;
        aggregate[topic].correct += stat.correct;
      });
    });
    return Object.entries(aggregate)
      .filter(([, stat]) => stat.total > 0 && (stat.correct / stat.total) < 0.7)
      .map(([topic]) => topic);
  }

  function showCurrentAnswerCheck() {
    const question = getCurrentQuestion();
    if (!question) return;
    const userAnswer = normalizeAnswer(state.answers[state.currentIndex], question);
    const correctAnswer = normalizeAnswer(question.answer, question);
    const isCorrect = compareAnswers(userAnswer, correctAnswer, question.type);
    const panel = $("#checkAnswerPanel");
    const answered = isAnswered(state.currentIndex);
    panel.className = `check-answer-panel ${isCorrect && answered ? "correct" : "incorrect"}`;
    panel.innerHTML = `
      <h3>${isCorrect && answered ? "Correct answer" : answered ? "Incorrect answer" : "No answer selected yet"}</h3>
      <p><strong>Your answer:</strong><br>${formatAnswer(userAnswer, question) || "Not answered"}</p>
      <p><strong>Correct answer:</strong><br>${formatAnswer(correctAnswer, question)}</p>
      <p><strong>Why this is the right answer:</strong> ${escapeHtml(question.explanation)}</p>
      <div class="option-explanation-list">${buildOptionExplanationHtml(question, userAnswer, correctAnswer)}</div>
      <div class="exam-lock-note">You are still inside the active exam. Use Submit Exam when you want to finish.</div>
    `;
    panel.classList.remove("hidden");
    applyAnswerFeedbackStyles(question, userAnswer, correctAnswer);
  }

  function hideAnswerCheck() {
    const panel = $("#checkAnswerPanel");
    if (!panel) return;
    panel.classList.add("hidden");
    panel.innerHTML = "";
  }

  function applyAnswerFeedbackStyles(question, userAnswer, correctAnswer) {
    const answerArea = $("#answerArea");
    if (!answerArea) return;
    answerArea.querySelectorAll(".feedback-correct, .feedback-incorrect, .feedback-missed").forEach((node) => {
      node.classList.remove("feedback-correct", "feedback-incorrect", "feedback-missed");
    });

    if (question.type === "Match Items") {
      const saved = state.answers[state.currentIndex] || {};
      answerArea.querySelectorAll(".match-row").forEach((row) => {
        const left = row.dataset.left;
        const selectedMatch = saved[left] || "";
        row.classList.add(selectedMatch && selectedMatch === question.answer[left] ? "feedback-correct" : "feedback-incorrect");
      });
      return;
    }

    if (["Drag and Drop", "Sequence Ordering"].includes(question.type)) {
      const savedOrder = Array.isArray(state.answers[state.currentIndex]) ? state.answers[state.currentIndex] : [];
      answerArea.querySelectorAll(".drag-item").forEach((item) => {
        const position = Number(item.dataset.position);
        const selectedIndex = savedOrder[position];
        item.classList.add(selectedIndex === question.answer[position] ? "feedback-correct" : "feedback-incorrect");
      });
      return;
    }

    answerArea.querySelectorAll(".option-row").forEach((row) => {
      const index = Number(row.dataset.optionIndex);
      const selected = userAnswer.includes(index);
      const isCorrectOption = correctAnswer.includes(index);
      if (selected && isCorrectOption) row.classList.add("feedback-correct");
      if (selected && !isCorrectOption) row.classList.add("feedback-incorrect");
      if (!selected && isCorrectOption) row.classList.add("feedback-missed");
    });
  }

  function buildOptionExplanationHtml(question, userAnswer, correctAnswer) {
    if (question.type === "Match Items") {
      const saved = state.answers[state.currentIndex] || {};
      return question.options.map((left) => {
        const correctMatch = question.answer[left];
        const selectedMatch = saved[left] || "Not selected";
        const isCorrectMatch = selectedMatch === correctMatch;
        return `
          <div class="option-explanation ${isCorrectMatch ? "correct" : "incorrect"}">
            <strong>${escapeHtml(left)}</strong><br>
            Your match: ${escapeHtml(selectedMatch)}<br>
            Correct match: ${escapeHtml(correctMatch)}<br>
            ${escapeHtml(`${left} maps to ${correctMatch} because this pairing reflects the normal purpose of that component in a medallion analytics solution.`)}
          </div>
        `;
      }).join("");
    }

    if (["Drag and Drop", "Sequence Ordering"].includes(question.type)) {
      const savedOrder = Array.isArray(state.answers[state.currentIndex]) ? state.answers[state.currentIndex] : [];
      return question.answer.map((optionIndex, position) => {
        const selectedIndex = savedOrder[position];
        const isCorrectPosition = selectedIndex === optionIndex;
        return `
          <div class="option-explanation ${isCorrectPosition ? "correct" : "incorrect"}">
            <strong>Position ${position + 1}</strong><br>
            Your step: ${selectedIndex == null ? "Not selected" : escapeHtml(question.options[selectedIndex])}<br>
            Correct step: ${escapeHtml(question.options[optionIndex])}<br>
            ${escapeHtml(getOrderingExplanation(question, optionIndex, position))}
          </div>
        `;
      }).join("");
    }

    return question.options.map((option, index) => {
      const isCorrectOption = correctAnswer.includes(index);
      const selected = userAnswer.includes(index);
      const label = String.fromCharCode(65 + index);
      return `
        <div class="option-explanation ${isCorrectOption ? "correct" : "incorrect"}">
          <strong>Option ${label}: ${isCorrectOption ? "Correct" : "Incorrect"}${selected ? " · Selected" : ""}</strong><br>
          ${escapeHtml(option)}<br>
          ${escapeHtml(getChoiceExplanation(question, option, isCorrectOption))}
        </div>
      `;
    }).join("");
  }

  function getChoiceExplanation(question, option, isCorrectOption) {
    const text = option.toLowerCase();
    if (isCorrectOption) {
      return `This option is right because it supports a production-grade ${question.topic} design: it is repeatable, auditable, governed, and aligned with ${question.skill_area}.`;
    }
    if (text.includes("administrator") || text.includes("full access") || text.includes("write permission") || text.includes("single user account")) {
      return "This option is wrong because it violates least privilege and creates unnecessary security and governance risk.";
    }
    if (text.includes("manual") || text.includes("desktop") || text.includes("email") || text.includes("every report author") || text.includes("directly to source")) {
      return "This option is wrong because manual or report-level processing is hard to audit, hard to repeat, and unreliable for enterprise analytics.";
    }
    if (text.includes("skip") || text.includes("disable validation") || text.includes("disable monitoring") || text.includes("without logging")) {
      return "This option is wrong because removing validation, logging, or monitoring makes failures harder to detect and troubleshoot.";
    }
    if (text.includes("delete bronze") || text.includes("remove all history") || text.includes("store only the final") || text.includes("overwritten daily without audit")) {
      return "This option is wrong because it removes traceability, replay capability, and operational audit history.";
    }
    if (text.includes("credentials inside notebook")) {
      return "This option is wrong because secrets should not be stored directly in code; production systems should use secure credential management.";
    }
    if (text.includes("update the watermark before")) {
      return "This option is wrong because moving the watermark before a successful load can skip records after a failed extraction.";
    }
    if (text.includes("first file")) {
      return "This option is wrong because selecting only one file ignores completeness and can miss valid incoming data.";
    }
    if (text.includes("add more visuals")) {
      return "This option is wrong because report visuals do not fix underlying query, model, file layout, or capacity performance issues.";
    }
    return "This option is wrong because it does not address the stated production requirement as directly as the correct option.";
  }

  function getOrderingExplanation(question, optionIndex, position) {
    const step = question.options[optionIndex];
    if (position === 0) return `${step} should happen first so the team understands the source, failure, or required connection before changing downstream logic.`;
    if (position === question.answer.length - 1) return `${step} belongs at the end because monitoring, documentation, or prevention comes after the implementation or troubleshooting action.`;
    return `${step} belongs in this position because production data engineering should move from source understanding, to controlled processing, to validated publishing and monitoring.`;
  }

  function isLockedExam() {
    return Boolean(state.startedAt && !state.submittedAt && state.selectedQuestions && state.selectedQuestions.length);
  }

  function lockBrowserHistory(force = false) {
    if (historyLocked && !force) return;
    try {
      history.pushState({ examLocked: true }, "", window.location.href);
      historyLocked = true;
    } catch (error) {
      console.warn("Could not lock browser history", error);
    }
  }

  function prepareQuestionForAttempt(question) {
    const prepared = {
      ...question,
      options: Array.isArray(question.options) ? [...question.options] : [],
      references: Array.isArray(question.references) ? [...question.references] : question.references
    };

    if (prepared.caseStudy) prepared.caseStudy = { ...prepared.caseStudy };

    if (["Drag and Drop", "Sequence Ordering"].includes(prepared.type)) {
      const identityOrder = prepared.options.map((_, index) => index);
      let initialOrder = nonIdentityShuffleArray(identityOrder);
      prepared.initialOrder = initialOrder;
      return prepared;
    }

    if (prepared.type === "Match Items") {
      const originalMatchOptions = [...(question.matchOptions || [])];
      prepared.options = nonIdentityShuffleArray(prepared.options);
      prepared.matchOptions = nonIdentityShuffleArray(originalMatchOptions);
      prepared.matchOptionOrderByLeft = {};
      prepared.options.forEach((left) => {
        prepared.matchOptionOrderByLeft[left] = nonIdentityShuffleArray(originalMatchOptions);
      });
      prepared.answer = { ...(question.answer || {}) };
      return prepared;
    }

    if (Array.isArray(prepared.options) && Array.isArray(question.answer)) {
      const order = nonIdentityShuffleArray(prepared.options.map((_, index) => index));
      const oldToNewIndex = new Map(order.map((oldIndex, newIndex) => [oldIndex, newIndex]));
      prepared.options = order.map((oldIndex) => question.options[oldIndex]);
      prepared.answer = question.answer.map((oldIndex) => oldToNewIndex.get(oldIndex)).sort((a, b) => a - b);
    }

    return prepared;
  }

  function shuffleArray(items) {
    const array = [...items];
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function nonIdentityShuffleArray(items) {
    const original = [...items];
    if (original.length < 2) return original;
    const originalKey = JSON.stringify(original);

    for (let attempt = 0; attempt < 12; attempt += 1) {
      const shuffled = shuffleArray(original);
      if (JSON.stringify(shuffled) !== originalKey) return shuffled;
    }

    const rotated = [...original];
    rotated.push(rotated.shift());
    return rotated;
  }

  function captureTimeSpent() {
    const now = Date.now();
    const seconds = Math.max(0, Math.round((now - state.questionStartedAt) / 1000));
    state.timeSpent[state.currentIndex] = (state.timeSpent[state.currentIndex] || 0) + seconds;
    state.questionStartedAt = now;
  }

  function markSavedSoon() {
    $("#saveIndicator").textContent = "Saving...";
    $("#saveIndicator").classList.remove("saved");
    $("#saveIndicator").classList.add("saving");
    saveState();
    setTimeout(() => {
      $("#saveIndicator").textContent = "Saved";
      $("#saveIndicator").classList.remove("saving");
      $("#saveIndicator").classList.add("saved");
    }, 250);
  }

  function saveState() {
    state.lastSavedAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function saveAttempt(result, manual) {
    const history = getHistory();
    history.push({
      date: new Date().toISOString(),
      mode: state.mode,
      topicFilter: state.topicFilter,
      manual,
      ...result
    });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-30)));
  }

  function getHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); }
    catch { return []; }
  }

  function getBookmarks() {
    try { return JSON.parse(localStorage.getItem(BOOKMARK_KEY) || "[]"); }
    catch { return []; }
  }

  function toggleBookmark(questionId) {
    const bookmarks = getBookmarks();
    const updated = bookmarks.includes(questionId) ? bookmarks.filter((id) => id !== questionId) : [...bookmarks, questionId];
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(updated));
  }

  function calculateStreak(history) {
    if (!history.length) return 0;
    const uniqueDays = [...new Set(history.map((attempt) => new Date(attempt.date).toDateString()))]
      .map((date) => new Date(date))
      .sort((a, b) => b - a);
    let streak = 0;
    const current = new Date();
    current.setHours(0, 0, 0, 0);
    for (const day of uniqueDays) {
      const expected = new Date(current);
      expected.setDate(current.getDate() - streak);
      if (day.toDateString() === expected.toDateString()) streak += 1;
      else break;
    }
    return streak;
  }

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  function updateFocusLog() {
    const el = $("#focusLog");
    if (el) el.textContent = `Focus events: ${focusEvents}`;
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function initials(name) {
    return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  }

  function getCssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttr(value) {
    return escapeHtml(value).replaceAll("`", "&#096;");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
