class QuizApp {
  constructor() {
    this.views = {
      home: document.getElementById('homeView'),
      quiz: document.getElementById('quizView'),
      results: document.getElementById('resultsView'),
      achievements: document.getElementById('achievementsView'),
      stats: document.getElementById('statsView')
    };

    this.elements = {
      categoryBtns: document.querySelectorAll('.category-btn'),
      difficultyInputs: document.querySelectorAll('input[name="difficulty"]'),
      highScoresBtn: document.getElementById('highScoresBtn'),
      howToBtn: document.getElementById('howToBtn'),
      achievementsBtn: document.getElementById('achievementsBtn'),
      statsBtn: document.getElementById('statsBtn'),
      dailyChallengeBtn: document.getElementById('dailyChallengeBtn'),
      homeLogo: document.getElementById('homeLogo'),
      themeToggle: document.getElementById('themeToggle'),
      soundToggle: document.getElementById('soundToggle'),
      dailyStreak: document.getElementById('dailyStreak'),
      questionText: document.getElementById('questionText'),
      optionsContainer: document.getElementById('optionsContainer'),
      feedback: document.getElementById('feedback'),
      nextBtn: document.getElementById('nextBtn'),
      progressBar: document.getElementById('progressBar'),
      questionCounter: document.getElementById('questionCounter'),
      timerDisplay: document.getElementById('timer'),
      scoreDisplay: document.getElementById('scoreDisplay'),
      powerupFiftyFifty: document.getElementById('powerupFiftyFifty'),
      powerupExtraTime: document.getElementById('powerupExtraTime'),
      powerupSkip: document.getElementById('powerupSkip'),
      fiftyFiftyCount: document.getElementById('fiftyFiftyCount'),
      extraTimeCount: document.getElementById('extraTimeCount'),
      skipCount: document.getElementById('skipCount'),
      finalScore: document.getElementById('finalScore'),
      resultsMessage: document.getElementById('resultsMessage'),
      correctCount: document.getElementById('correctCount'),
      incorrectCount: document.getElementById('incorrectCount'),
      accuracy: document.getElementById('accuracy'),
      timeBonus: document.getElementById('timeBonus'),
      xpGained: document.getElementById('xpGained'),
      unlockedAchievements: document.getElementById('unlockedAchievements'),
      reviewList: document.getElementById('reviewList'),
      quizHomeBtn: document.getElementById('quizHomeBtn'),
      playAgainBtn: document.getElementById('playAgainBtn'),
      resultsHomeBtn: document.getElementById('resultsHomeBtn'),
      viewScoresBtn: document.getElementById('viewScoresBtn'),
      shareBtn: document.getElementById('shareBtn'),
      bestScoreGeneral: document.getElementById('bestScoreGeneral'),
      bestScoreProgramming: document.getElementById('bestScoreProgramming'),
      bestScoreFun: document.getElementById('bestScoreFun'),
      confettiCanvas: document.getElementById('confettiCanvas'),
      backFromAchievements: document.getElementById('backFromAchievements'),
      backFromStats: document.getElementById('backFromStats'),
      scoresModal: document.getElementById('scoresModal'),
      scoresTable: document.getElementById('scoresTable'),
      recentGamesList: document.getElementById('recentGamesList'),
      closeScoresBtn: document.getElementById('closeScoresBtn'),
      clearScoresBtn: document.getElementById('clearScoresBtn'),
      howToModal: document.getElementById('howToModal'),
      closeHowToBtn: document.getElementById('closeHowToBtn'),
      playerNameModal: document.getElementById('playerNameModal'),
      playerNameForm: document.getElementById('playerNameForm'),
      playerNameInput: document.getElementById('playerNameInput'),
      playerNameError: document.getElementById('playerNameError'),
      cancelPlayerNameBtn: document.getElementById('cancelPlayerNameBtn')
    };

    this.QUESTIONS_PER_QUIZ = 10;
    this.TIME_PER_QUESTION = 15;
    this.difficultySettings = {
      easy: { label: 'Easy', time: 20 },
      normal: { label: 'Normal', time: 15 },
      hard: { label: 'Hard', time: 10 }
    };
    this.soundEnabled = true;
    this.audioContext = null;
    this.resetQuizState();
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadTheme();
    this.loadSoundPreference();
    this.loadDifficultyPreference();
    this.renderHighScores();
    this.renderRecentGames();
    this.renderBestScores();
    this.updateDailyStreak();
    this.updateStatsDisplay();
    this.setupKeyboardNavigation();
  }

  resetQuizState() {
    clearInterval(this.state?.timer);
    this.state = {
      currentCategory: null,
      currentQuestionIndex: 0,
      score: 0,
      userAnswers: [],
      timer: null,
      timeRemaining: this.TIME_PER_QUESTION,
      isAnswered: false,
      powerups: { fiftyFifty: 1, extraTime: 1, skip: 1 },
      currentStreak: 0,
      bestStreak: 0,
      totalTimeRemaining: 0,
      powerupsUsed: [],
      fastestAnswerTime: null,
      timePerQuestion: this.TIME_PER_QUESTION,
      difficulty: this.getSelectedDifficulty(),
      mode: 'normal'
    };
  }

  setupEventListeners() {
    this.elements.categoryBtns.forEach((btn) => {
      btn.addEventListener('click', (event) => this.startQuiz(event.currentTarget.dataset.category));
    });
    this.elements.highScoresBtn?.addEventListener('click', () => this.openModal('scores'));
    this.elements.howToBtn?.addEventListener('click', () => this.openModal('howTo'));
    this.elements.achievementsBtn?.addEventListener('click', () => this.showAchievements());
    this.elements.statsBtn?.addEventListener('click', () => this.showStatistics());
    this.elements.dailyChallengeBtn?.addEventListener('click', () => this.startDailyChallenge());
    this.elements.closeScoresBtn?.addEventListener('click', () => this.closeModal('scores'));
    this.elements.closeHowToBtn?.addEventListener('click', () => this.closeModal('howTo'));
    this.elements.clearScoresBtn?.addEventListener('click', () => this.clearScores());
    this.elements.playAgainBtn?.addEventListener('click', () => this.showView('home'));
    this.elements.quizHomeBtn?.addEventListener('click', () => this.goHome());
    this.elements.resultsHomeBtn?.addEventListener('click', () => this.goHome());
    this.elements.viewScoresBtn?.addEventListener('click', () => this.openModal('scores'));
    this.elements.shareBtn?.addEventListener('click', () => this.shareResult());
    this.elements.nextBtn?.addEventListener('click', () => this.nextQuestion());
    this.elements.themeToggle?.addEventListener('click', () => this.toggleTheme());
    this.elements.difficultyInputs?.forEach((input) => {
      input.addEventListener('change', (event) => this.setDifficulty(event.target.value));
    });
    this.elements.soundToggle?.addEventListener('click', () => this.toggleSound());
    this.elements.powerupFiftyFifty?.addEventListener('click', () => this.usePowerup('fiftyFifty'));
    this.elements.powerupExtraTime?.addEventListener('click', () => this.usePowerup('extraTime'));
    this.elements.powerupSkip?.addEventListener('click', () => this.usePowerup('skip'));
    this.elements.backFromAchievements?.addEventListener('click', () => this.showView('home'));
    this.elements.backFromStats?.addEventListener('click', () => this.showView('home'));

    if (this.elements.homeLogo) {
      const goHome = () => this.goHome();
      this.elements.homeLogo.addEventListener('click', goHome);
      this.elements.homeLogo.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          goHome();
        }
      });
    }
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (event) => {
      if (!this.views.quiz?.classList.contains('active') || this.state.isAnswered) return;
      const key = Number.parseInt(event.key, 10);
      if (key >= 1 && key <= 4) {
        const options = this.elements.optionsContainer.querySelectorAll('.option-btn');
        if (options[key - 1] && !options[key - 1].disabled) options[key - 1].click();
      }
      if (event.key === ' ' && !this.elements.nextBtn.classList.contains('hidden')) {
        event.preventDefault();
        this.elements.nextBtn.click();
      }
    });
  }

  showView(viewName) {
    Object.values(this.views).forEach((view) => view?.classList.remove('active'));
    this.views[viewName]?.classList.add('active');
    if (viewName === 'home') {
      this.resetQuizState();
      this.updatePowerupDisplay();
    }
  }

  goHome() {
    this.closeModal('scores');
    this.closeModal('howTo');
    this.showView('home');
  }

  startQuiz(category, mode = 'normal') {
    this.promptForPlayerName().then((confirmed) => {
      if (confirmed) this.beginQuiz(category, mode);
    });
  }

  beginQuiz(category, mode = 'normal') {
    this.resetQuizState();
    this.state.currentCategory = category;
    this.state.mode = mode;
    this.state.difficulty = this.getSelectedDifficulty();
    this.state.timePerQuestion = this.difficultySettings[this.state.difficulty]?.time || this.TIME_PER_QUESTION;
    if (mode === 'daily') this.state.powerups = { fiftyFifty: 2, extraTime: 2, skip: 2 };
    this.state.questions = this.shuffleArray([...window.quizData[category]]).slice(0, this.QUESTIONS_PER_QUIZ);
    this.elements.unlockedAchievements?.classList.add('hidden');
    this.elements.xpGained?.classList.remove('animate');
    this.updatePowerupDisplay();
    this.showView('quiz');
    this.loadQuestion();
  }

  promptForPlayerName() {
    const currentName = localStorage.getItem('brainBlistzPlayerName') || '';
    const modal = this.elements.playerNameModal;
    const form = this.elements.playerNameForm;
    const input = this.elements.playerNameInput;
    const error = this.elements.playerNameError;
    const cancelBtn = this.elements.cancelPlayerNameBtn;

    if (!modal || !form || !input || !error || !cancelBtn) {
      const fallbackInput = window.prompt('Enter your name to start the quiz:', currentName);
      if (fallbackInput === null) return Promise.resolve(false);
      const trimmed = fallbackInput.trim();
      if (!trimmed) {
        this.showNotification('Please enter your name to play.', 'error');
        return Promise.resolve(false);
      }
      localStorage.setItem('brainBlistzPlayerName', trimmed);
      return Promise.resolve(true);
    }

    input.value = currentName;
    error.classList.add('hidden');
    if (typeof modal.showModal === 'function') modal.showModal();
    else {
      modal.setAttribute('open', '');
      modal.classList.add('active');
    }
    setTimeout(() => input.focus(), 0);

    return new Promise((resolve) => {
      let settled = false;
      const finish = (result) => {
        if (settled) return;
        settled = true;
        cleanup();
        if (typeof modal.close === 'function' && modal.open) modal.close();
        else {
          modal.classList.remove('active');
          modal.removeAttribute('open');
        }
        resolve(result);
      };
      const submitHandler = (event) => {
        event.preventDefault();
        const trimmed = input.value.trim();
        if (!trimmed) {
          error.classList.remove('hidden');
          input.focus();
          return;
        }
        localStorage.setItem('brainBlistzPlayerName', trimmed);
        finish(true);
      };
      const cancelHandler = (event) => {
        event?.preventDefault();
        finish(false);
      };
      const dialogCancelHandler = (event) => {
        event.preventDefault();
        finish(false);
      };
      const cleanup = () => {
        form.removeEventListener('submit', submitHandler);
        cancelBtn.removeEventListener('click', cancelHandler);
        modal.removeEventListener('cancel', dialogCancelHandler);
      };
      form.addEventListener('submit', submitHandler);
      cancelBtn.addEventListener('click', cancelHandler);
      modal.addEventListener('cancel', dialogCancelHandler);
    });
  }

  startDailyChallenge() {
    const lastDaily = localStorage.getItem('brainBlistzLastDaily');
    const today = new Date().toDateString();
    if (lastDaily === today) {
      this.showNotification('Daily challenge already completed. Come back tomorrow.', 'info');
      return;
    }
    const categories = ['general', 'programming', 'fun'];
    this.startQuiz(categories[Math.floor(Math.random() * categories.length)], 'daily');
  }

  loadQuestion() {
    const question = this.state.questions[this.state.currentQuestionIndex];
    if (!question) return;
    this.elements.questionCounter.textContent = `Question ${this.state.currentQuestionIndex + 1}/${this.QUESTIONS_PER_QUIZ}`;
    this.elements.progressBar.style.width = `${(this.state.currentQuestionIndex / this.QUESTIONS_PER_QUIZ) * 100}%`;
    this.elements.questionText.textContent = question.question;
    this.elements.scoreDisplay.textContent = `Score: ${this.state.score}`;
    this.elements.feedback.classList.add('hidden');
    this.elements.nextBtn.classList.add('hidden');
    this.state.isAnswered = false;
    this.renderOptions(question.options);
    this.updatePowerupDisplay();
    this.startTimer();
  }

  renderOptions(options) {
    this.elements.optionsContainer.innerHTML = '';
    options.forEach((option, index) => {
      const button = document.createElement('button');
      button.className = 'option-btn';
      button.type = 'button';
      button.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + index)}.</span><span class="option-text">${this.escapeHtml(option)}</span><span class="option-shortcut">${index + 1}</span>`;
      button.addEventListener('click', () => this.handleAnswer(index));
      this.elements.optionsContainer.appendChild(button);
    });
  }

  handleAnswer(selectedIndex) {
    if (this.state.isAnswered) return;
    const answerTime = this.state.timePerQuestion - this.state.timeRemaining;
    this.state.fastestAnswerTime = this.state.fastestAnswerTime === null ? answerTime : Math.min(this.state.fastestAnswerTime, answerTime);
    this.state.isAnswered = true;
    clearInterval(this.state.timer);
    const question = this.state.questions[this.state.currentQuestionIndex];
    const selectedAnswer = selectedIndex >= 0 ? question.options[selectedIndex] : 'No answer';
    const isCorrect = selectedAnswer === question.answer;
    this.state.userAnswers.push({
      question: question.question,
      selected: selectedAnswer,
      correct: question.answer,
      explanation: question.explanation || 'No explanation available for this question yet.',
      isCorrect
    });
    if (isCorrect) {
      this.state.score += 1;
      this.state.currentStreak += 1;
      this.state.bestStreak = Math.max(this.state.bestStreak, this.state.currentStreak);
      if (answerTime <= 3) this.state.totalTimeRemaining += 5;
      this.playSound('correct');
    } else {
      this.state.currentStreak = 0;
      this.playSound('wrong');
    }
    this.state.totalTimeRemaining += this.state.timeRemaining;
    if (selectedIndex >= 0) this.showAnswerFeedback(selectedIndex, question.answer, isCorrect);
    else this.showTimeUpFeedback(question.answer);
    this.elements.nextBtn.classList.remove('hidden');
    this.elements.scoreDisplay.textContent = `Score: ${this.state.score}`;
    this.disablePowerups();
  }

  showAnswerFeedback(selectedIndex, correctAnswer, isCorrect) {
    const options = this.elements.optionsContainer.querySelectorAll('.option-btn');
    options.forEach((button) => { button.disabled = true; });
    options[selectedIndex].classList.add(isCorrect ? 'correct' : 'incorrect');
    if (!isCorrect) {
      const correctIndex = this.state.questions[this.state.currentQuestionIndex].options.indexOf(correctAnswer);
      if (correctIndex !== -1 && correctIndex !== selectedIndex) options[correctIndex].classList.add('correct');
    }
    const baseMessage = isCorrect
      ? (this.state.currentStreak > 1 ? `Correct. Streak: ${this.state.currentStreak}` : 'Correct. Well done.')
      : `Incorrect. The answer is: ${correctAnswer}`;
    const explanation = this.state.questions[this.state.currentQuestionIndex].explanation;
    this.elements.feedback.innerHTML = `<strong>${this.escapeHtml(baseMessage)}</strong>${explanation ? `<span class="feedback-explanation">${this.escapeHtml(explanation)}</span>` : ''}`;
    this.elements.feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    this.elements.feedback.classList.remove('hidden');
  }

  showTimeUpFeedback(correctAnswer) {
    const options = this.elements.optionsContainer.querySelectorAll('.option-btn');
    options.forEach((button) => { button.disabled = true; });
    const correctIndex = this.state.questions[this.state.currentQuestionIndex].options.indexOf(correctAnswer);
    if (correctIndex !== -1) options[correctIndex].classList.add('correct');
    const explanation = this.state.questions[this.state.currentQuestionIndex].explanation;
    this.elements.feedback.innerHTML = `<strong>${this.escapeHtml(`Time is up. The answer is: ${correctAnswer}`)}</strong>${explanation ? `<span class="feedback-explanation">${this.escapeHtml(explanation)}</span>` : ''}`;
    this.elements.feedback.className = 'feedback incorrect';
    this.elements.feedback.classList.remove('hidden');
  }

  nextQuestion() {
    this.state.currentQuestionIndex += 1;
    if (this.state.currentQuestionIndex < this.QUESTIONS_PER_QUIZ) this.loadQuestion();
    else this.showResults();
  }

  startTimer() {
    this.state.timeRemaining = this.state.timePerQuestion;
    this.updateTimerDisplay();
    this.state.timer = window.setInterval(() => {
      this.state.timeRemaining -= 1;
      this.updateTimerDisplay();
      if (this.state.timeRemaining <= 0) {
        clearInterval(this.state.timer);
        if (!this.state.isAnswered) this.handleAnswer(-1);
      }
    }, 1000);
  }

  updateTimerDisplay() {
    this.elements.timerDisplay.textContent = `${this.state.timeRemaining}s`;
    this.elements.timerDisplay.classList.remove('warning', 'danger');
    if (this.state.timeRemaining <= 5) {
      this.elements.timerDisplay.classList.add('danger');
      this.playSound('tick');
    } else if (this.state.timeRemaining <= 10) {
      this.elements.timerDisplay.classList.add('warning');
    }
  }

  usePowerup(type) {
    if (this.state.isAnswered || this.state.powerups[type] <= 0) return;
    this.state.powerups[type] -= 1;
    this.state.powerupsUsed.push(type);
    this.playSound('powerup');
    if (type === 'fiftyFifty') this.useFiftyFifty();
    if (type === 'extraTime') this.useExtraTime();
    if (type === 'skip') this.useSkip();
    this.updatePowerupDisplay();
  }

  useFiftyFifty() {
    const question = this.state.questions[this.state.currentQuestionIndex];
    const options = this.elements.optionsContainer.querySelectorAll('.option-btn');
    const correctIndex = question.options.indexOf(question.answer);
    const wrongIndices = [];
    for (let index = 0; index < question.options.length; index += 1) {
      if (index !== correctIndex) wrongIndices.push(index);
    }
    this.shuffleArray(wrongIndices).slice(0, 2).forEach((index) => {
      options[index].disabled = true;
      options[index].classList.add('disabled');
    });
    this.showNotification('Two wrong answers removed.', 'info');
  }

  useExtraTime() {
    this.state.timeRemaining += 10;
    this.updateTimerDisplay();
    this.showNotification('Ten seconds added.', 'success');
  }

  useSkip() {
    clearInterval(this.state.timer);
    this.state.currentQuestionIndex += 1;
    if (this.state.currentQuestionIndex < this.QUESTIONS_PER_QUIZ) this.loadQuestion();
    else this.showResults();
    this.showNotification('Question skipped.', 'info');
  }

  updatePowerupDisplay() {
    if (this.elements.fiftyFiftyCount) this.elements.fiftyFiftyCount.textContent = this.state.powerups.fiftyFifty;
    if (this.elements.extraTimeCount) this.elements.extraTimeCount.textContent = this.state.powerups.extraTime;
    if (this.elements.skipCount) this.elements.skipCount.textContent = this.state.powerups.skip;
    if (this.elements.powerupFiftyFifty) this.elements.powerupFiftyFifty.disabled = this.state.powerups.fiftyFifty <= 0 || this.state.isAnswered;
    if (this.elements.powerupExtraTime) this.elements.powerupExtraTime.disabled = this.state.powerups.extraTime <= 0 || this.state.isAnswered;
    if (this.elements.powerupSkip) this.elements.powerupSkip.disabled = this.state.powerups.skip <= 0 || this.state.isAnswered;
  }

  disablePowerups() {
    if (this.elements.powerupFiftyFifty) this.elements.powerupFiftyFifty.disabled = true;
    if (this.elements.powerupExtraTime) this.elements.powerupExtraTime.disabled = true;
    if (this.elements.powerupSkip) this.elements.powerupSkip.disabled = true;
  }

  showResults() {
    this.showView('results');
    const score = this.state.score;
    const percentage = Math.round((score / this.QUESTIONS_PER_QUIZ) * 100);
    const timeBonus = Math.floor(this.state.totalTimeRemaining / 2);
    const xpEarned = score * 10 + timeBonus + (this.state.mode === 'daily' ? 50 : 0);
    this.elements.finalScore.textContent = `${score}/${this.QUESTIONS_PER_QUIZ}`;
    this.elements.correctCount.textContent = String(score);
    this.elements.incorrectCount.textContent = String(this.QUESTIONS_PER_QUIZ - score);
    this.elements.accuracy.textContent = `${percentage}%`;
    if (this.elements.timeBonus) this.elements.timeBonus.textContent = `+${timeBonus}`;
    if (this.elements.xpGained) {
      this.elements.xpGained.textContent = `+${xpEarned} XP`;
      this.elements.xpGained.classList.remove('animate');
      setTimeout(() => this.elements.xpGained?.classList.add('animate'), 20);
    }
    let message = 'Nice try. Every expert starts somewhere.';
    if (percentage >= 90) message = 'Legendary performance. You are a quiz master.';
    else if (percentage >= 70) message = 'Excellent result. Strong knowledge across the quiz.';
    else if (percentage >= 50) message = 'Good effort. Keep pushing for a higher score.';
    if (this.state.bestStreak >= 5) message += ` Best streak: ${this.state.bestStreak}.`;
    message += ` Difficulty: ${this.difficultySettings[this.state.difficulty]?.label || 'Normal'}.`;
    this.elements.resultsMessage.textContent = message;
    const gameData = {
      category: this.state.currentCategory,
      score,
      difficulty: this.state.difficulty,
      mode: this.state.mode,
      bestStreak: this.state.bestStreak,
      totalTime: this.state.totalTimeRemaining,
      fastestAnswerTime: this.state.fastestAnswerTime,
      powerupsUsed: [...this.state.powerupsUsed],
      xpEarned,
      date: new Date().toISOString()
    };
    this.saveHighScore(score);
    this.saveGameHistory(gameData);
    this.renderBestScores();
    if (window.achievementSystem) {
      window.achievementSystem.updateStats(gameData);
      window.achievementSystem.checkAchievements(gameData, this.state.bestStreak, this.state.fastestAnswerTime);
      this.updateStatsDisplay();
    }
    if (this.state.mode === 'daily') this.completeDailyChallenge();
    this.renderReview();
    if (percentage >= 70) this.triggerConfetti();
  }

  renderReview() {
    const reviewList = this.elements.reviewList;
    if (!reviewList) return;

    if (this.state.userAnswers.length === 0) {
      reviewList.innerHTML = '<p class="empty-state">Finish a quiz to unlock the review section.</p>';
      return;
    }

    reviewList.innerHTML = this.state.userAnswers.map((entry, index) => `
      <article class="review-card ${entry.isCorrect ? 'correct' : 'incorrect'}">
        <div class="review-card-header">
          <span class="review-number">Q${index + 1}</span>
          <span class="review-status">${entry.isCorrect ? 'Correct' : 'Incorrect'}</span>
        </div>
        <h4>${this.escapeHtml(entry.question)}</h4>
        <p><strong>Your answer:</strong> ${this.escapeHtml(entry.selected)}</p>
        <p><strong>Correct answer:</strong> ${this.escapeHtml(entry.correct)}</p>
        <p class="review-explanation">${this.escapeHtml(entry.explanation)}</p>
      </article>
    `).join('');
  }

  completeDailyChallenge() {
    const today = new Date().toDateString();
    const previousDate = localStorage.getItem('brainBlistzLastDailyDate');
    let streak = Number.parseInt(localStorage.getItem('brainBlistzDailyStreak') || '0', 10);
    if (previousDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      streak = new Date(previousDate).toDateString() === yesterday.toDateString() ? streak + 1 : 1;
    } else streak = 1;
    localStorage.setItem('brainBlistzLastDaily', today);
    localStorage.setItem('brainBlistzLastDailyDate', today);
    localStorage.setItem('brainBlistzDailyStreak', String(streak));
    this.updateDailyStreak();
  }

  updateDailyStreak() {
    if (!this.elements.dailyStreak) return;
    const streak = localStorage.getItem('brainBlistzDailyStreak') || '0';
    this.elements.dailyStreak.textContent = `${streak} day streak`;
  }

  showAchievements() {
    if (!window.achievementSystem) return;
    window.achievementSystem.renderAchievements('achievementsGrid');
    this.showView('achievements');
  }

  showStatistics() {
    if (!window.achievementSystem) return;
    window.achievementSystem.renderStats();
    this.showView('stats');
  }

  updateStatsDisplay() {
    if (window.achievementSystem) window.achievementSystem.renderStats();
  }

  saveHighScore(score) {
    const scores = JSON.parse(localStorage.getItem('brainBlistzScores') || '[]');
    scores.push({
      name: this.getPlayerName(),
      score,
      category: this.state.currentCategory,
      difficulty: this.state.difficulty,
      date: new Date().toISOString(),
      percentage: Math.round((score / this.QUESTIONS_PER_QUIZ) * 100)
    });
    scores.sort((left, right) => right.score - left.score || new Date(right.date) - new Date(left.date));
    localStorage.setItem('brainBlistzScores', JSON.stringify(scores.slice(0, 20)));
    this.renderHighScores();
  }

  getPlayerName() {
    return localStorage.getItem('brainBlistzPlayerName') || 'Anonymous';
  }

  renderHighScores() {
    const tbody = this.elements.scoresTable?.querySelector('tbody');
    if (!tbody) return;
    const scores = JSON.parse(localStorage.getItem('brainBlistzScores') || '[]');
    tbody.innerHTML = '';
    if (scores.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center">No scores yet. Be the first.</td></tr>';
      this.renderRecentGames();
      return;
    }
    scores.slice(0, 10).forEach((entry, index) => {
      const row = document.createElement('tr');
      const category = entry.category ? entry.category.charAt(0).toUpperCase() + entry.category.slice(1) : 'Unknown';
      row.innerHTML = `<td>#${index + 1}</td><td>${this.escapeHtml(entry.name)}</td><td><strong>${entry.score}/10</strong> (${entry.percentage}%)</td><td>${this.escapeHtml(category)}</td><td>${new Date(entry.date).toLocaleDateString()}</td>`;
      tbody.appendChild(row);
    });
    this.renderRecentGames();
  }

  clearScores() {
    if (!window.confirm('Clear all saved high scores? This cannot be undone.')) return;
    localStorage.removeItem('brainBlistzScores');
    localStorage.removeItem('brainBlistzHistory');
    this.renderHighScores();
    this.renderBestScores();
  }

  saveGameHistory(gameData) {
    const history = JSON.parse(localStorage.getItem('brainBlistzHistory') || '[]');
    history.unshift({
      category: gameData.category,
      score: gameData.score,
      difficulty: gameData.difficulty,
      percentage: Math.round((gameData.score / this.QUESTIONS_PER_QUIZ) * 100),
      date: gameData.date
    });
    localStorage.setItem('brainBlistzHistory', JSON.stringify(history.slice(0, 12)));
    this.renderRecentGames();
  }

  renderRecentGames() {
    const list = this.elements.recentGamesList;
    if (!list) return;
    const history = JSON.parse(localStorage.getItem('brainBlistzHistory') || '[]');
    if (history.length === 0) {
      list.innerHTML = '<li>No recent games yet.</li>';
      return;
    }

    list.innerHTML = history.map((entry) => {
      const category = entry.category ? entry.category.charAt(0).toUpperCase() + entry.category.slice(1) : 'Unknown';
      const difficulty = this.difficultySettings[entry.difficulty]?.label || 'Normal';
      return `<li><strong>${this.escapeHtml(category)}</strong> - ${entry.score}/10 (${entry.percentage}%) - ${this.escapeHtml(difficulty)} - ${new Date(entry.date).toLocaleDateString()}</li>`;
    }).join('');
  }

  renderBestScores() {
    const scores = JSON.parse(localStorage.getItem('brainBlistzScores') || '[]');
    const categories = [
      { key: 'general', element: this.elements.bestScoreGeneral, label: 'General' },
      { key: 'programming', element: this.elements.bestScoreProgramming, label: 'Programming' },
      { key: 'fun', element: this.elements.bestScoreFun, label: 'Fun' }
    ];

    categories.forEach(({ key, element }) => {
      if (!element) return;
      const best = scores
        .filter((entry) => entry.category === key)
        .sort((left, right) => right.score - left.score || right.percentage - left.percentage)[0];
      element.textContent = best
        ? `Best score: ${best.score}/10 (${best.percentage}%)`
        : 'Best score: No games yet';
    });
  }

  loadDifficultyPreference() {
    const savedDifficulty = localStorage.getItem('brainBlistzDifficulty') || 'normal';
    this.setDifficulty(savedDifficulty, false);
  }

  setDifficulty(difficulty, persist = true) {
    const nextDifficulty = this.difficultySettings[difficulty] ? difficulty : 'normal';
    this.elements.difficultyInputs?.forEach((input) => {
      input.checked = input.value === nextDifficulty;
    });
    if (persist) localStorage.setItem('brainBlistzDifficulty', nextDifficulty);
  }

  getSelectedDifficulty() {
    const checked = Array.from(this.elements.difficultyInputs || []).find((input) => input.checked);
    return checked?.value || localStorage.getItem('brainBlistzDifficulty') || 'normal';
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('brainBlistzTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeIcon(savedTheme);
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('brainBlistzTheme', next);
    this.updateThemeIcon(next);
  }

  updateThemeIcon(theme) {
    if (this.elements.themeToggle) this.elements.themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }

  loadSoundPreference() {
    this.soundEnabled = localStorage.getItem('brainBlistzSound') !== 'false';
    this.updateSoundIcon();
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('brainBlistzSound', String(this.soundEnabled));
    this.updateSoundIcon();
    this.playSound('click');
  }

  updateSoundIcon() {
    const icon = this.elements.soundToggle?.querySelector('.sound-icon');
    if (icon) icon.textContent = this.soundEnabled ? 'SOUND ON' : 'SOUND OFF';
  }

  playSound(type) {
    if (!this.soundEnabled || !window.userInteracted) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!this.audioContext) this.audioContext = new AudioContextClass();
    if (this.audioContext.state === 'suspended') this.audioContext.resume().catch(() => {});
    const sounds = {
      correct: { frequency: 720, duration: 0.12, gain: 0.05, wave: 'triangle' },
      wrong: { frequency: 220, duration: 0.18, gain: 0.06, wave: 'sawtooth' },
      tick: { frequency: 480, duration: 0.04, gain: 0.03, wave: 'square' },
      powerup: { frequency: 880, duration: 0.1, gain: 0.05, wave: 'sine' },
      click: { frequency: 560, duration: 0.05, gain: 0.03, wave: 'triangle' }
    };
    const config = sounds[type];
    if (!config) return;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    oscillator.type = config.wave;
    oscillator.frequency.value = config.frequency;
    gainNode.gain.value = config.gain;
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + config.duration);
  }

  openModal(modalName) {
    const modal = modalName === 'scores' ? this.elements.scoresModal : this.elements.howToModal;
    if (!modal) return;
    if (modalName === 'scores') this.renderHighScores();
    if (typeof modal.showModal === 'function') {
      if (!modal.open) modal.showModal();
    } else {
      modal.classList.add('active');
      modal.setAttribute('open', '');
    }
    document.body.style.overflow = 'hidden';
  }

  closeModal(modalName) {
    const modal = modalName === 'scores' ? this.elements.scoresModal : this.elements.howToModal;
    if (!modal) return;
    if (typeof modal.close === 'function' && modal.open) modal.close();
    else {
      modal.classList.remove('active');
      modal.removeAttribute('open');
    }
    document.body.style.overflow = '';
  }

  async shareResult() {
    const score = this.state.score;
    const percentage = Math.round((score / this.QUESTIONS_PER_QUIZ) * 100);
    const text = `I scored ${score}/10 (${percentage}%) on BrainBlistz.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'BrainBlistz Quiz Result', text, url: window.location.href });
        return;
      } catch (error) {
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
      this.showNotification('Result copied to clipboard.', 'success');
    } catch (error) {
      this.showNotification('Could not copy result automatically.', 'error');
    }
  }

  triggerConfetti() {
    const canvas = this.elements.confettiCanvas;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.add('active');
    const colors = ['#4361ee', '#3f37c9', '#4895ef', '#4cc9f0', '#2ecc71', '#f39c12', '#e74c3c'];
    const particles = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 3 + 2,
      angle: Math.random() * Math.PI * 2,
      rotation: Math.random() * 360
    }));
    let frameId = null;
    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        context.save();
        context.translate(particle.x, particle.y);
        context.rotate((particle.rotation * Math.PI) / 180);
        context.fillStyle = particle.color;
        context.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        context.restore();
        particle.y += particle.speed;
        particle.x += Math.sin(particle.angle) * 2;
        particle.rotation += 2;
        if (particle.y > canvas.height) {
          particle.y = -20;
          particle.x = Math.random() * canvas.width;
        }
      });
      frameId = window.requestAnimationFrame(draw);
    };
    draw();
    setTimeout(() => {
      if (frameId) window.cancelAnimationFrame(frameId);
      canvas.classList.remove('active');
      context.clearRect(0, 0, canvas.width, canvas.height);
    }, 5000);
  }

  escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
  }
}

window.userInteracted = false;
document.addEventListener('click', () => { window.userInteracted = true; }, { once: true });
document.addEventListener('DOMContentLoaded', () => { window.quizApp = new QuizApp(); });
window.addEventListener('resize', () => {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
