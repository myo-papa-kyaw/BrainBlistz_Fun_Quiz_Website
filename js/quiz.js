// js/quiz.js - Enhanced Core Quiz Application Logic
class QuizApp {
  constructor() {
    // DOM Elements
    this.views = {
      home: document.getElementById('homeView'),
      quiz: document.getElementById('quizView'),
      results: document.getElementById('resultsView'),
      achievements: document.getElementById('achievementsView'),
      stats: document.getElementById('statsView')
    };

    this.elements = {
      // Home
      categoryBtns: document.querySelectorAll('.category-btn'),
      highScoresBtn: document.getElementById('highScoresBtn'),
      howToBtn: document.getElementById('howToBtn'),
      achievementsBtn: document.getElementById('achievementsBtn'),
      statsBtn: document.getElementById('statsBtn'),
      dailyChallengeBtn: document.getElementById('dailyChallengeBtn'),

      // Quiz
      questionText: document.getElementById('questionText'),
      optionsContainer: document.getElementById('optionsContainer'),
      feedback: document.getElementById('feedback'),
      nextBtn: document.getElementById('nextBtn'),
      progressBar: document.getElementById('progressBar'),
      questionCounter: document.getElementById('questionCounter'),
      timerDisplay: document.getElementById('timer'),
      scoreDisplay: document.getElementById('scoreDisplay'),

      // Power-ups
      powerupFiftyFifty: document.getElementById('powerupFiftyFifty'),
      powerupExtraTime: document.getElementById('powerupExtraTime'),
      powerupSkip: document.getElementById('powerupSkip'),
      fiftyFiftyCount: document.getElementById('fiftyFiftyCount'),
      extraTimeCount: document.getElementById('extraTimeCount'),
      skipCount: document.getElementById('skipCount'),

      // Results
      finalScore: document.getElementById('finalScore'),
      resultsMessage: document.getElementById('resultsMessage'),
      correctCount: document.getElementById('correctCount'),
      incorrectCount: document.getElementById('incorrectCount'),
      accuracy: document.getElementById('accuracy'),
      timeBonus: document.getElementById('timeBonus'),
      xpGained: document.getElementById('xpGained'),
      playAgainBtn: document.getElementById('playAgainBtn'),
      viewScoresBtn: document.getElementById('viewScoresBtn'),
      shareBtn: document.getElementById('shareBtn'),
      confettiCanvas: document.getElementById('confettiCanvas'),

      // Navigation
      backFromAchievements: document.getElementById('backFromAchievements'),
      backFromStats: document.getElementById('backFromStats'),

      // Modals
      scoresModal: document.getElementById('scoresModal'),
      scoresTable: document.getElementById('scoresTable'),
      closeScoresBtn: document.getElementById('closeScoresBtn'),
      clearScoresBtn: document.getElementById('clearScoresBtn'),
      howToModal: document.getElementById('howToModal'),
      closeHowToBtn: document.getElementById('closeHowToBtn'),
      playerNameModal: document.getElementById('playerNameModal'),
      playerNameForm: document.getElementById('playerNameForm'),
      playerNameInput: document.getElementById('playerNameInput'),
      playerNameError: document.getElementById('playerNameError'),
      cancelPlayerNameBtn: document.getElementById('cancelPlayerNameBtn'),

      // Controls
      themeToggle: document.getElementById('themeToggle'),
      homeLogo: document.getElementById('homeLogo'),
      soundToggle: document.getElementById('soundToggle'),
      dailyStreak: document.getElementById('dailyStreak'),
      totalPoints: document.getElementById('totalPoints')
    };

    // State
    this.state = {
      currentCategory: null,
      currentQuestionIndex: 0,
      score: 0,
      userAnswers: [],
      timer: null,
      timeRemaining: 15,
      isAnswered: false,
      powerups: {
        fiftyFifty: 1,
        extraTime: 1,
        skip: 1
      },
      currentStreak: 0,
      bestStreak: 0,
      totalTimeRemaining: 0,
      powerupsUsed: []
    };

    // Constants
    this.QUESTIONS_PER_QUIZ = 10;
    this.TIME_PER_QUESTION = 15;
    this.soundEnabled = true;

    // Initialize
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadTheme();
    this.loadSoundPreference();
    this.renderHighScores();
    this.updateDailyStreak();
    this.updateStatsDisplay();
    this.setupKeyboardNavigation();
  }

  setupEventListeners() {
  // Category selection
  this.elements.categoryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const category = e.currentTarget.dataset.category;
      this.startQuiz(category);
    });
  });

  // Navigation buttons
  this.elements.highScoresBtn.addEventListener('click', () => this.openModal('scores'));
  this.elements.howToBtn.addEventListener('click', () => this.openModal('howTo'));
  
  // MODAL CLOSE BUTTONS - FIXED
  if (this.elements.closeScoresBtn) {
    this.elements.closeScoresBtn.addEventListener('click', () => this.closeModal('scores'));
  }
  
  if (this.elements.closeHowToBtn) {
    this.elements.closeHowToBtn.addEventListener('click', () => this.closeModal('howTo'));
  }
  
  this.elements.clearScoresBtn.addEventListener('click', () => this.clearScores());

  // Results actions
  this.elements.playAgainBtn.addEventListener('click', () => this.showView('home'));
  this.elements.viewScoresBtn.addEventListener('click', () => {
    this.closeModal('scores');
    this.openModal('scores');
  });
  this.elements.shareBtn.addEventListener('click', () => this.shareResult());

  // Next question
  this.elements.nextBtn.addEventListener('click', () => this.nextQuestion());

  // Theme toggle
  this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());

  // Logo -> Home navigation
  if (this.elements.homeLogo) {
    this.elements.homeLogo.addEventListener('click', () => {
      this.closeModal('scores');
      this.closeModal('howTo');
      this.showView('home');
    });
    this.elements.homeLogo.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.elements.homeLogo.click();
      }
    });
  }

  // Close modals on outside click
  window.addEventListener('click', (e) => {
    if (e.target === this.elements.scoresModal) this.closeModal('scores');
    if (e.target === this.elements.howToModal) this.closeModal('howTo');
  });
}

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Only handle if quiz view is active and not answered
      if (!this.views.quiz.classList.contains('active') || this.state.isAnswered) return;

      // Number keys 1-4 for options
      const key = parseInt(e.key);
      if (key >= 1 && key <= 4) {
        const options = this.elements.optionsContainer.querySelectorAll('.option-btn');
        if (options[key - 1] && !options[key - 1].disabled) {
          options[key - 1].click();
        }
      }

      // Spacebar for next question (if available)
      if (e.key === ' ' && !this.elements.nextBtn.classList.contains('hidden')) {
        e.preventDefault();
        this.elements.nextBtn.click();
      }
    });
  }

  // ===== VIEW MANAGEMENT =====
  showView(viewName) {
    // Hide all views
    Object.values(this.views).forEach(view => {
      if (view) view.classList.remove('active');
    });
    
    // Show target view
    if (this.views[viewName]) {
      this.views[viewName].classList.add('active');
    }

    // Reset quiz state only when returning to home.
    // Keep state intact for results/achievements/stats screens.
    if (viewName === 'home') {
      this.resetQuizState();
    }
  }

  // ===== QUIZ FLOW =====
  startQuiz(category, mode = 'normal') {
    this.promptForPlayerName().then((isConfirmed) => {
      if (!isConfirmed) return;
      this.beginQuiz(category, mode);
    });
  }

  beginQuiz(category, mode = 'normal') {
    this.state.currentCategory = category;
    this.state.currentQuestionIndex = 0;
    this.state.score = 0;
    this.state.userAnswers = [];
    this.state.currentStreak = 0;
    this.state.bestStreak = 0;
    this.state.totalTimeRemaining = 0;
    this.state.powerupsUsed = [];
    this.state.mode = mode;

    // Reset powerups for normal mode
    if (mode === 'normal') {
      this.state.powerups = {
        fiftyFifty: 1,
        extraTime: 1,
        skip: 1
      };
    }

    // Get questions and shuffle
    const questions = [...quizData[category]];
    this.state.questions = this.shuffleArray(questions).slice(0, this.QUESTIONS_PER_QUIZ);

    // Update powerup display
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

    // Fallback if modal elements are unavailable.
    if (!modal || !form || !input || !error || !cancelBtn) {
      const fallbackInput = prompt('Enter your name to start the quiz:', currentName);
      if (fallbackInput === null) return Promise.resolve(false);
      const trimmedFallbackName = fallbackInput.trim();
      if (!trimmedFallbackName) {
        this.showNotification('Please enter your name to play.', 'error');
        return Promise.resolve(false);
      }
      localStorage.setItem('brainBlistzPlayerName', trimmedFallbackName);
      return Promise.resolve(true);
    }

    input.value = currentName;
    error.classList.add('hidden');
    error.textContent = 'Please enter your name to start.';

    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.classList.add('active');
      modal.setAttribute('open', '');
    }

    setTimeout(() => input.focus(), 0);

    return new Promise((resolve) => {
      let resolved = false;

      const finish = (result) => {
        if (resolved) return;
        resolved = true;
        cleanup();
        if (typeof modal.close === 'function' && modal.hasAttribute('open')) {
          modal.close();
        } else {
          modal.classList.remove('active');
          modal.removeAttribute('open');
        }
        resolve(result);
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedName = input.value.trim();
        if (!trimmedName) {
          error.classList.remove('hidden');
          input.focus();
          return;
        }
        localStorage.setItem('brainBlistzPlayerName', trimmedName);
        finish(true);
      };

      const handleCancel = (e) => {
        if (e) e.preventDefault();
        finish(false);
      };

      const handleDialogCancel = (e) => {
        e.preventDefault();
        finish(false);
      };

      const cleanup = () => {
        form.removeEventListener('submit', handleSubmit);
        cancelBtn.removeEventListener('click', handleCancel);
        modal.removeEventListener('cancel', handleDialogCancel);
      };

      form.addEventListener('submit', handleSubmit);
      cancelBtn.addEventListener('click', handleCancel);
      modal.addEventListener('cancel', handleDialogCancel);
    });
  }

  startDailyChallenge() {
    // Check if daily challenge is available
    const lastDaily = localStorage.getItem('brainBlistzLastDaily');
    const today = new Date().toDateString();
    
    if (lastDaily === today) {
      this.showNotification('Daily challenge already completed! Come back tomorrow!', 'info');
      return;
    }

    // Give extra powerups for daily challenge
    this.state.powerups = {
      fiftyFifty: 2,
      extraTime: 2,
      skip: 2
    };

    // Start with random category
    const categories = ['general', 'programming', 'fun'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    this.startQuiz(randomCategory, 'daily');
  }

  loadQuestion() {
    const { currentQuestionIndex, questions } = this.state;
    const question = questions[currentQuestionIndex];

    // Update UI
    this.elements.questionCounter.textContent = `Question ${currentQuestionIndex + 1}/${this.QUESTIONS_PER_QUIZ}`;
    this.elements.progressBar.style.width = `${((currentQuestionIndex) / this.QUESTIONS_PER_QUIZ) * 100}%`;
    this.elements.questionText.textContent = question.question;
    this.elements.scoreDisplay.textContent = `Score: ${this.state.score}`;

    // Render options
    this.renderOptions(question.options);

    // Reset feedback & next button
    this.elements.feedback.classList.add('hidden');
    this.elements.nextBtn.classList.add('hidden');
    this.state.isAnswered = false;

    // Enable powerups
    this.updatePowerupDisplay();

    // Start timer
    this.startTimer();
  }

  renderOptions(options) {
    this.elements.optionsContainer.innerHTML = '';

    options.forEach((option, index) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `
        <span class="option-letter">${String.fromCharCode(65 + index)}.</span>
        <span class="option-text">${option}</span>
        <span class="option-shortcut">${index + 1}</span>
      `;
      btn.dataset.index = index;
      btn.addEventListener('click', () => this.handleAnswer(index));
      this.elements.optionsContainer.appendChild(btn);
    });
  }

  handleAnswer(selectedIndex) {
    if (this.state.isAnswered) return;

    const answerTime = this.TIME_PER_QUESTION - this.state.timeRemaining;
    this.state.isAnswered = true;
    clearInterval(this.state.timer);

    const question = this.state.questions[this.state.currentQuestionIndex];
    const isCorrect = selectedIndex >= 0 && question.options[selectedIndex] === question.answer;

    // Update state
    this.state.userAnswers.push({
      question: question.question,
      selected: selectedIndex >= 0 ? question.options[selectedIndex] : 'No answer',
      correct: question.answer,
      isCorrect
    });

    if (isCorrect) {
      this.state.score++;
      this.state.currentStreak++;
      this.state.bestStreak = Math.max(this.state.bestStreak, this.state.currentStreak);
      this.playSound('correct');
      
      // Add time bonus for quick answers
      if (answerTime <= 3) {
        this.state.totalTimeRemaining += 5; // Bonus time
      }
    } else {
      this.state.currentStreak = 0;
      this.playSound('wrong');
    }

    // Add to total time remaining (for time bonus)
    this.state.totalTimeRemaining += this.state.timeRemaining;

    // Visual feedback
    if (selectedIndex >= 0) {
      this.showAnswerFeedback(selectedIndex, question.answer, isCorrect);
    } else {
      // Time's up - show correct answer
      this.showTimeUpFeedback(question.answer);
    }

    // Show next button
    this.elements.nextBtn.classList.remove('hidden');

    // Update score display
    this.elements.scoreDisplay.textContent = `Score: ${this.state.score}`;

    // Disable powerups
    this.disablePowerups();
  }

  showAnswerFeedback(selectedIndex, correctAnswer, isCorrect) {
    const options = this.elements.optionsContainer.querySelectorAll('.option-btn');

    // Disable all options
    options.forEach(btn => btn.disabled = true);

    // Highlight selected answer
    options[selectedIndex].classList.add(isCorrect ? 'correct' : 'incorrect');

    // If wrong, show correct answer
    if (!isCorrect) {
      const correctIndex = this.state.questions[this.state.currentQuestionIndex].options.indexOf(correctAnswer);
      if (correctIndex !== -1 && correctIndex !== selectedIndex) {
        options[correctIndex].classList.add('correct');
      }
    }

    // Show feedback message with animation
    this.elements.feedback.innerHTML = isCorrect
      ? `🎉 Correct! ${this.state.currentStreak > 1 ? `Streak: ${this.state.currentStreak} 🔥` : 'Well done!'}`
      : `❌ Incorrect. The answer is: ${correctAnswer}`;
    
    this.elements.feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    this.elements.feedback.classList.remove('hidden');
  }

  showTimeUpFeedback(correctAnswer) {
    const options = this.elements.optionsContainer.querySelectorAll('.option-btn');
    
    // Disable all options
    options.forEach(btn => btn.disabled = true);

    // Show correct answer
    const correctIndex = this.state.questions[this.state.currentQuestionIndex].options.indexOf(correctAnswer);
    if (correctIndex !== -1) {
      options[correctIndex].classList.add('correct');
    }

    this.elements.feedback.innerHTML = `⏰ Time's up! The answer is: ${correctAnswer}`;
    this.elements.feedback.className = 'feedback incorrect';
    this.elements.feedback.classList.remove('hidden');
  }

  nextQuestion() {
    this.state.currentQuestionIndex++;

    if (this.state.currentQuestionIndex < this.QUESTIONS_PER_QUIZ) {
      this.loadQuestion();
    } else {
      this.showResults();
    }
  }

  startTimer() {
    this.state.timeRemaining = this.TIME_PER_QUESTION;
    this.updateTimerDisplay();

    this.state.timer = setInterval(() => {
      this.state.timeRemaining--;
      this.updateTimerDisplay();

      if (this.state.timeRemaining <= 0) {
        clearInterval(this.state.timer);
        if (!this.state.isAnswered) {
          this.handleAnswer(-1);
        }
      }
    }, 1000);
  }

  updateTimerDisplay() {
    this.elements.timerDisplay.textContent = `⏱️ ${this.state.timeRemaining}s`;
    this.elements.timerDisplay.classList.remove('warning', 'danger');
    
    if (this.state.timeRemaining <= 5) {
      this.elements.timerDisplay.classList.add('danger');
      this.playSound('tick');
    } else if (this.state.timeRemaining <= 10) {
      this.elements.timerDisplay.classList.add('warning');
    }
  }

  // ===== POWER-UPS =====
  usePowerup(type) {
    if (this.state.isAnswered) return;
    if (this.state.powerups[type] <= 0) return;

    this.state.powerups[type]--;
    this.state.powerupsUsed.push(type);
    this.playSound('powerup');

    switch(type) {
      case 'fiftyFifty':
        this.useFiftyFifty();
        break;
      case 'extraTime':
        this.useExtraTime();
        break;
      case 'skip':
        this.useSkip();
        break;
    }

    this.updatePowerupDisplay();
  }

  useFiftyFifty() {
    const question = this.state.questions[this.state.currentQuestionIndex];
    const options = this.elements.optionsContainer.querySelectorAll('.option-btn');
    const correctIndex = question.options.indexOf(question.answer);
    
    // Find two wrong answers to remove
    const wrongIndices = [];
    for (let i = 0; i < question.options.length; i++) {
      if (i !== correctIndex) wrongIndices.push(i);
    }
    
    // Shuffle and remove two wrong answers
    this.shuffleArray(wrongIndices).slice(0, 2).forEach(index => {
      options[index].disabled = true;
      options[index].classList.add('disabled');
    });

    this.showNotification('Two wrong answers removed!', 'info');
  }

  useExtraTime() {
    this.state.timeRemaining += 10;
    this.updateTimerDisplay();
    this.showNotification('+10 seconds added!', 'success');
  }

  useSkip() {
    clearInterval(this.state.timer);
    this.state.currentQuestionIndex++;
    
    if (this.state.currentQuestionIndex < this.QUESTIONS_PER_QUIZ) {
      this.loadQuestion();
    } else {
      this.showResults();
    }
    
    this.showNotification('Question skipped!', 'info');
  }

  updatePowerupDisplay() {
    if (this.elements.fiftyFiftyCount) {
      this.elements.fiftyFiftyCount.textContent = this.state.powerups.fiftyFifty;
    }
    if (this.elements.extraTimeCount) {
      this.elements.extraTimeCount.textContent = this.state.powerups.extraTime;
    }
    if (this.elements.skipCount) {
      this.elements.skipCount.textContent = this.state.powerups.skip;
    }

    if (this.elements.powerupFiftyFifty) {
      this.elements.powerupFiftyFifty.disabled = this.state.powerups.fiftyFifty <= 0 || this.state.isAnswered;
    }
    if (this.elements.powerupExtraTime) {
      this.elements.powerupExtraTime.disabled = this.state.powerups.extraTime <= 0 || this.state.isAnswered;
    }
    if (this.elements.powerupSkip) {
      this.elements.powerupSkip.disabled = this.state.powerups.skip <= 0 || this.state.isAnswered;
    }
  }

  disablePowerups() {
    if (this.elements.powerupFiftyFifty) this.elements.powerupFiftyFifty.disabled = true;
    if (this.elements.powerupExtraTime) this.elements.powerupExtraTime.disabled = true;
    if (this.elements.powerupSkip) this.elements.powerupSkip.disabled = true;
  }

  // ===== RESULTS =====
  showResults() {
    this.showView('results');

    const { score } = this.state;
    const percentage = Math.round((score / this.QUESTIONS_PER_QUIZ) * 100);
    const timeBonus = Math.floor(this.state.totalTimeRemaining / 2);

    // Update results UI
    this.elements.finalScore.textContent = `${score}/${this.QUESTIONS_PER_QUIZ}`;
    this.elements.correctCount.textContent = score;
    this.elements.incorrectCount.textContent = this.QUESTIONS_PER_QUIZ - score;
    this.elements.accuracy.textContent = `${percentage}%`;
    if (this.elements.timeBonus) {
      this.elements.timeBonus.textContent = `+${timeBonus}`;
    }

    // Personalized message with streak info
    let message = '';
    if (percentage >= 90) message = '🏆 Legendary! You\'re a quiz master!';
    else if (percentage >= 70) message = '🌟 Excellent! You really know your stuff!';
    else if (percentage >= 50) message = '👍 Good effort! Keep practicing!';
    else message = '💪 Nice try! Every expert was once a beginner.';

    if (this.state.bestStreak >= 5) {
      message += ` 🔥 ${this.state.bestStreak} question streak!`;
    }

    this.elements.resultsMessage.textContent = message;

    // Calculate XP
    const xpEarned = score * 10 + timeBonus + (this.state.mode === 'daily' ? 50 : 0);
    if (this.elements.xpGained) {
      this.elements.xpGained.textContent = `+${xpEarned} XP`;
      this.elements.xpGained.classList.add('animate');
    }

    // Save game data
    const gameData = {
      category: this.state.currentCategory,
      score: score,
      mode: this.state.mode,
      bestStreak: this.state.bestStreak,
      totalTime: this.state.totalTimeRemaining,
      powerupsUsed: this.state.powerupsUsed,
      date: new Date().toISOString()
    };

    // Save high score
    this.saveHighScore(score);

    // Update stats and check achievements
    if (window.achievementSystem) {
      window.achievementSystem.updateStats(gameData);
      window.achievementSystem.checkAchievements(gameData, this.state.bestStreak);
    }
    
    // Update daily challenge
    if (this.state.mode === 'daily') {
      this.completeDailyChallenge();
    }

    // Trigger confetti for good scores
    if (percentage >= 70) {
      this.triggerConfetti();
    }
  }

  // ===== DAILY CHALLENGE =====
  completeDailyChallenge() {
    const today = new Date().toDateString();
    localStorage.setItem('brainBlistzLastDaily', today);
    
    // Update streak
    let streak = parseInt(localStorage.getItem('brainBlistzDailyStreak') || '0');
    const lastDaily = localStorage.getItem('brainBlistzLastDailyDate');
    
    if (lastDaily) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (new Date(lastDaily).toDateString() === yesterday.toDateString()) {
        streak++;
      } else {
        streak = 1;
      }
    } else {
      streak = 1;
    }
    
    localStorage.setItem('brainBlistzDailyStreak', streak.toString());
    localStorage.setItem('brainBlistzLastDailyDate', today);
    
    this.updateDailyStreak();
  }

  updateDailyStreak() {
    const streak = localStorage.getItem('brainBlistzDailyStreak') || '0';
    if (this.elements.dailyStreak) {
      this.elements.dailyStreak.innerHTML = `<i class="fas fa-fire"></i> ${streak} day streak`;
    }
  }

  // ===== ACHIEVEMENTS & STATS =====
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
    if (window.achievementSystem) {
      window.achievementSystem.renderStats();
    }
  }

  // ===== HIGH SCORES =====
  saveHighScore(score) {
    const category = this.state.currentCategory;
    const scores = JSON.parse(localStorage.getItem('brainBlistzScores')) || [];

    // Add new score
    scores.push({
      name: this.getPlayerName(),
      score: score,
      category: category,
      date: new Date().toISOString(),
      percentage: Math.round((score / this.QUESTIONS_PER_QUIZ) * 100)
    });

    // Sort by score (descending), keep top 20
    scores.sort((a, b) => b.score - a.score);
    const topScores = scores.slice(0, 20);

    localStorage.setItem('brainBlistzScores', JSON.stringify(topScores));
    this.renderHighScores();
  }

  getPlayerName() {
    return localStorage.getItem('brainBlistzPlayerName') || 'Anonymous';
  }

  renderHighScores() {
    const scores = JSON.parse(localStorage.getItem('brainBlistzScores')) || [];
    const tbody = this.elements.scoresTable.querySelector('tbody');
    tbody.innerHTML = '';

    if (scores.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center">No scores yet. Be the first!</td></tr>';
      return;
    }

    scores.slice(0, 10).forEach((entry, index) => {
      const row = document.createElement('tr');
      const date = new Date(entry.date).toLocaleDateString();
      row.innerHTML = `
        <td>#${index + 1}</td>
        <td>${this.escapeHtml(entry.name)}</td>
        <td><strong>${entry.score}/10</strong> (${entry.percentage}%)</td>
        <td>${entry.category.charAt(0).toUpperCase() + entry.category.slice(1)}</td>
        <td>${date}</td>
      `;
      tbody.appendChild(row);
    });
  }

  clearScores() {
    if (confirm('Clear all your saved high scores? This cannot be undone.')) {
      localStorage.removeItem('brainBlistzScores');
      this.renderHighScores();
    }
  }

  // ===== NOTIFICATIONS =====
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // ===== UTILITIES =====
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  resetQuizState() {
    clearInterval(this.state.timer);
    this.state = {
      currentCategory: null,
      currentQuestionIndex: 0,
      score: 0,
      userAnswers: [],
      timer: null,
      timeRemaining: 15,
      isAnswered: false,
      powerups: {
        fiftyFifty: 1,
        extraTime: 1,
        skip: 1
      },
      currentStreak: 0,
      bestStreak: 0,
      totalTimeRemaining: 0,
      powerupsUsed: []
    };
  }

  // ===== THEME =====
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
    const icon = this.elements.themeToggle.querySelector('i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
  }

  // ===== SOUND =====
  loadSoundPreference() {
    this.soundEnabled = localStorage.getItem('brainBlistzSound') !== 'false';
    this.updateSoundIcon();
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('brainBlistzSound', this.soundEnabled);
    this.updateSoundIcon();
    this.playSound('click');
  }

  updateSoundIcon() {
    if (!this.elements.soundToggle) return;
    const icon = this.elements.soundToggle.querySelector('i');
    if (icon) {
      icon.className = this.soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    }
  }

  playSound(type) {
    if (!this.soundEnabled || !window.userInteracted) return;

    const sounds = {
      correct: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg',
      wrong: 'https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg',
      tick: 'https://actions.google.com/sounds/v1/alarms/clock_tick.ogg',
      powerup: 'https://actions.google.com/sounds/v1/cartoon/boing.ogg',
      click: 'https://actions.google.com/sounds/v1/cartoon/pop.ogg'
    };

    if (sounds[type]) {
      const audio = new Audio(sounds[type]);
      audio.volume = 0.2;
      audio.play().catch(() => {});
    }
  }

  // ===== MODALS =====
  openModal(modalName) {
    if (modalName === 'scores') {
      this.renderHighScores();
      this.elements.scoresModal.showModal();
    } else if (modalName === 'howTo') {
      this.elements.howToModal.showModal();
    }
    document.body.style.overflow = 'hidden';
  }

  closeModal(modalName) {
  if (modalName === 'scores') {
    if (this.elements.scoresModal && this.elements.scoresModal.open && typeof this.elements.scoresModal.close === 'function') {
      this.elements.scoresModal.close();
    } else if (this.elements.scoresModal) {
      // Fallback
      this.elements.scoresModal.classList.remove('active');
      this.elements.scoresModal.removeAttribute('open');
    }
  } else if (modalName === 'howTo') {
    if (this.elements.howToModal && this.elements.howToModal.open && typeof this.elements.howToModal.close === 'function') {
      this.elements.howToModal.close();
    } else if (this.elements.howToModal) {
      // Fallback
      this.elements.howToModal.classList.remove('active');
      this.elements.howToModal.removeAttribute('open');
    }
  }
  // Restore background scrolling
  document.body.style.overflow = '';
}

  // ===== SHARING =====
  async shareResult() {
    const { score } = this.state;
    const percentage = Math.round((score / this.QUESTIONS_PER_QUIZ) * 100);
    const category = this.state.currentCategory;
    const text = `I scored ${score}/10 (${percentage}%) on the ${category} quiz at BrainBlistz! Can you beat me? 🎯`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BrainBlistz Quiz Result',
          text: text,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(text + '\n\n' + window.location.href)
        .then(() => this.showNotification('Result copied to clipboard! 📋', 'success'))
        .catch(() => this.showNotification('Could not copy. Share manually!', 'error'));
    }
  }

  // ===== CONFETTI =====
  triggerConfetti() {
    const canvas = this.elements.confettiCanvas;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.add('active');

    const particles = [];
    const colors = ['#4361ee', '#3f37c9', '#4895ef', '#4cc9f0', '#2ecc71', '#f39c12', '#e74c3c'];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 3 + 2,
        angle: Math.random() * 6.28,
        rotation: Math.random() * 360
      });
    }

    let animationFrame;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);

        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);

        ctx.restore();

        p.y += p.speed;
        p.x += Math.sin(p.angle) * 2;
        p.rotation += 2;

        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    setTimeout(() => {
      cancelAnimationFrame(animationFrame);
      canvas.classList.remove('active');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 5000);
  }

  // ===== SECURITY =====
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

// ===== INITIALIZE APP =====
window.userInteracted = false;
document.addEventListener('click', () => {
  window.userInteracted = true;
}, { once: true });

document.addEventListener('DOMContentLoaded', () => {
  window.quizApp = new QuizApp();
});

// Fallback: ensure logo always navigates to home even if app listeners fail.
document.addEventListener('DOMContentLoaded', () => {
  const homeLogo = document.getElementById('homeLogo');
  if (!homeLogo) return;

  const goHome = () => {
    if (window.quizApp && typeof window.quizApp.showView === 'function') {
      window.quizApp.closeModal('scores');
      window.quizApp.closeModal('howTo');
      window.quizApp.showView('home');
      return;
    }

    ['homeView', 'quizView', 'resultsView', 'achievementsView', 'statsView'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('active');
    });
    const homeView = document.getElementById('homeView');
    if (homeView) homeView.classList.add('active');
  };

  homeLogo.addEventListener('click', goHome);
  homeLogo.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goHome();
    }
  });
});

window.addEventListener('resize', () => {
  const canvas = document.getElementById('confettiCanvas');
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});

// Add this at the very end of quiz.js file
document.addEventListener('DOMContentLoaded', function() {
  const closeHowToBtn = document.getElementById('closeHowToBtn');
  if (closeHowToBtn) {
    closeHowToBtn.addEventListener('click', function() {
      const modal = document.getElementById('howToModal');
      if (modal && typeof modal.close === 'function') {
        modal.close();
      } else if (modal) {
        modal.classList.remove('active');
        modal.removeAttribute('open');
      }
    });
  }
});

