// js/quiz.js - Core Quiz Application Logic
class QuizApp {
  constructor() {
    // DOM Elements
    this.views = {
      home: document.getElementById('homeView'),
      quiz: document.getElementById('quizView'),
      results: document.getElementById('resultsView')
    };
    
    this.elements = {
      // Home
      categoryBtns: document.querySelectorAll('.category-btn'),
      highScoresBtn: document.getElementById('highScoresBtn'),
      howToBtn: document.getElementById('howToBtn'),
      
      // Quiz
      questionText: document.getElementById('questionText'),
      optionsContainer: document.getElementById('optionsContainer'),
      feedback: document.getElementById('feedback'),
      nextBtn: document.getElementById('nextBtn'),
      progressBar: document.getElementById('progressBar'),
      questionCounter: document.getElementById('questionCounter'),
      timerDisplay: document.getElementById('timer'),
      scoreDisplay: document.getElementById('scoreDisplay'),
      
      // Results
      finalScore: document.getElementById('finalScore'),
      resultsMessage: document.getElementById('resultsMessage'),
      correctCount: document.getElementById('correctCount'),
      incorrectCount: document.getElementById('incorrectCount'),
      accuracy: document.getElementById('accuracy'),
      playAgainBtn: document.getElementById('playAgainBtn'),
      viewScoresBtn: document.getElementById('viewScoresBtn'),
      shareBtn: document.getElementById('shareBtn'),
      confettiCanvas: document.getElementById('confettiCanvas'),
      
      // Modals
      scoresModal: document.getElementById('scoresModal'),
      scoresTable: document.getElementById('scoresTable'),
      closeScoresBtn: document.getElementById('closeScoresBtn'),
      clearScoresBtn: document.getElementById('clearScoresBtn'),
      howToModal: document.getElementById('howToModal'),
      closeHowToBtn: document.getElementById('closeHowToBtn'),
      
      // Theme
      themeToggle: document.getElementById('themeToggle')
    };
    
    // State
    this.state = {
      currentCategory: null,
      currentQuestionIndex: 0,
      score: 0,
      userAnswers: [],
      timer: null,
      timeRemaining: 15,
      isAnswered: false
    };
    
    // Constants
    this.QUESTIONS_PER_QUIZ = 10;
    this.TIME_PER_QUESTION = 15; // seconds
    
    // Initialize
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.loadTheme();
    this.renderHighScores();
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
    this.elements.closeScoresBtn.addEventListener('click', () => this.closeModal('scores'));
    this.elements.closeHowToBtn.addEventListener('click', () => this.closeModal('howTo'));
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
    
    // Close modals on outside click
    window.addEventListener('click', (e) => {
      if (e.target === this.elements.scoresModal) this.closeModal('scores');
      if (e.target === this.elements.howToModal) this.closeModal('howTo');
    });
  }
  
  // ===== VIEW MANAGEMENT =====
  showView(viewName) {
    // Hide all views
    Object.values(this.views).forEach(view => {
      view.classList.remove('active');
    });
    // Show target view
    this.views[viewName].classList.add('active');
    
    // Reset quiz state when leaving quiz view
    if (viewName !== 'quiz') {
      this.resetQuizState();
    }
  }
  
  // ===== QUIZ FLOW =====
  startQuiz(category) {
    this.state.currentCategory = category;
    this.state.currentQuestionIndex = 0;
    this.state.score = 0;
    this.state.userAnswers = [];
    
    // Get questions and shuffle
    const questions = [...quizData[category]];
    this.state.questions = this.shuffleArray(questions).slice(0, this.QUESTIONS_PER_QUIZ);
    
    this.showView('quiz');
    this.loadQuestion();
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
    
    // Start timer
    this.startTimer();
  }
  
  renderOptions(options) {
    this.elements.optionsContainer.innerHTML = '';
    
    options.forEach((option, index) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + index)}.</span> ${option}`;
      btn.dataset.index = index;
      btn.addEventListener('click', () => this.handleAnswer(index));
      this.elements.optionsContainer.appendChild(btn);
    });
  }
  
  handleAnswer(selectedIndex) {
    if (this.state.isAnswered) return;
    
    this.state.isAnswered = true;
    clearInterval(this.state.timer);
    
    const question = this.state.questions[this.state.currentQuestionIndex];
    const isCorrect = question.options[selectedIndex] === question.answer;
    
    // Update state
    this.state.userAnswers.push({
      question: question.question,
      selected: question.options[selectedIndex],
      correct: question.answer,
      isCorrect
    });
    
    if (isCorrect) {
      this.state.score++;
      this.playSound('correct');
    } else {
      this.playSound('wrong');
    }
    
    // Visual feedback
    this.showAnswerFeedback(selectedIndex, question.answer, isCorrect);
    
    // Show next button
    this.elements.nextBtn.classList.remove('hidden');
    
    // Update score display
    this.elements.scoreDisplay.textContent = `Score: ${this.state.score}`;
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
    
    // Show feedback message
    this.elements.feedback.textContent = isCorrect 
      ? '🎉 Correct! Well done!' 
      : `❌ Incorrect. The answer is: ${correctAnswer}`;
    this.elements.feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
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
        // Auto-submit as incorrect if time runs out
        if (!this.state.isAnswered) {
          this.handleAnswer(-1); // -1 indicates no answer selected
        }
      }
    }, 1000);
  }
  
  updateTimerDisplay() {
    this.elements.timerDisplay.textContent = `⏱️ ${this.state.timeRemaining}s`;
    
    // Visual warnings
    this.elements.timerDisplay.classList.remove('warning', 'danger');
    if (this.state.timeRemaining <= 5) {
      this.elements.timerDisplay.classList.add('danger');
    } else if (this.state.timeRemaining <= 10) {
      this.elements.timerDisplay.classList.add('warning');
    }
  }
  
  // ===== RESULTS =====
  showResults() {
    this.showView('results');
    
    const { score } = this.state;
    const percentage = Math.round((score / this.QUESTIONS_PER_QUIZ) * 100);
    
    // Update results UI
    this.elements.finalScore.textContent = `${score}/${this.QUESTIONS_PER_QUIZ}`;
    this.elements.correctCount.textContent = score;
    this.elements.incorrectCount.textContent = this.QUESTIONS_PER_QUIZ - score;
    this.elements.accuracy.textContent = `${percentage}%`;
    
    // Personalized message
    let message = '';
    if (percentage >= 90) message = '🏆 Legendary! You\'re a quiz master!';
    else if (percentage >= 70) message = '🌟 Excellent! You really know your stuff!';
    else if (percentage >= 50) message = '👍 Good effort! Keep practicing!';
    else message = '💪 Nice try! Every expert was once a beginner.';
    
    this.elements.resultsMessage.textContent = message;
    
    // Save high score
    this.saveHighScore(score);
    
    // Trigger confetti for good scores
    if (percentage >= 70) {
      this.triggerConfetti();
    }
  }
  
  // ===== HIGH SCORES =====
  saveHighScore(score) {
    const category = this.state.currentCategory;
    const scores = JSON.parse(localStorage.getItem('quizQuestScores')) || [];
    
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
    
    localStorage.setItem('quizQuestScores', JSON.stringify(topScores));
    this.renderHighScores();
  }
  
  getPlayerName() {
    // Simple name prompt - could be enhanced with localStorage persistence
    let name = localStorage.getItem('quizQuestPlayerName');
    if (!name) {
      name = prompt('Enter your name for the leaderboard:', 'Player');
      if (name) localStorage.setItem('quizQuestPlayerName', name);
    }
    return name || 'Anonymous';
  }
  
  renderHighScores() {
    const scores = JSON.parse(localStorage.getItem('quizQuestScores')) || [];
    const tbody = this.elements.scoresTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    if (scores.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-secondary)">No scores yet. Be the first!</td></tr>';
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
      localStorage.removeItem('quizQuestScores');
      this.renderHighScores();
    }
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
      isAnswered: false
    };
  }
  
  // ===== THEME =====
  loadTheme() {
    const savedTheme = localStorage.getItem('quizQuestTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
  
  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('quizQuestTheme', next);
  }
  
  // ===== MODALS =====
  openModal(modalName) {
    if (modalName === 'scores') {
      this.renderHighScores();
      this.elements.scoresModal.showModal();
    } else if (modalName === 'howTo') {
      this.elements.howToModal.showModal();
    }
  }
  
  closeModal(modalName) {
    if (modalName === 'scores') {
      this.elements.scoresModal.close();
    } else if (modalName === 'howTo') {
      this.elements.howToModal.close();
    }
  }
  
  // ===== SHARING =====
  async shareResult() {
    const { score } = this.state;
    const percentage = Math.round((score / this.QUESTIONS_PER_QUIZ) * 100);
    const category = this.state.currentCategory;
    const text = `I scored ${score}/10 (${percentage}%) on the ${category} quiz at QuizQuest! Can you beat me? 🎯`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QuizQuest Result',
          text: text,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text + '\n\n' + window.location.href)
        .then(() => alert('Result copied to clipboard! 📋'))
        .catch(() => alert('Could not copy. Share manually!'));
    }
  }
  
  // ===== SOUND (Optional - Graceful Degradation) =====
  playSound(type) {
    // Only play if sounds exist and user has interacted (browser policy)
    if (!window.userInteracted) return;
    
    const sounds = {
      correct: 'assets/sounds/correct.mp3',
      wrong: 'assets/sounds/wrong.mp3',
      tick: 'assets/sounds/tick.mp3'
    };
    
    if (sounds[type]) {
      const audio = new Audio(sounds[type]);
      audio.volume = 0.3;
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
  }
  
  // ===== CONFETTI (Pure JS Canvas) =====
  triggerConfetti() {
    const canvas = this.elements.confettiCanvas;
    const ctx = canvas.getContext('2d');
    
    // Resize canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.add('active');
    
    // Confetti particles
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
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
        
        ctx.restore();
        
        // Update position
        p.y += p.speed;
        p.x += Math.sin(p.angle) * 2;
        p.rotation += 2;
        
        // Reset if off screen
        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    // Hide after 5 seconds
    setTimeout(() => {
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
// Track first user interaction for audio policy
window.userInteracted = false;
document.addEventListener('click', () => {
  window.userInteracted = true;
}, { once: true });

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.quizApp = new QuizApp();
});

// Handle resize for confetti canvas
window.addEventListener('resize', () => {
  const canvas = document.getElementById('confettiCanvas');
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});