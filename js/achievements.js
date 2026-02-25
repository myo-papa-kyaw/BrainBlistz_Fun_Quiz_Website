// js/achievements.js - Achievement System

const ACHIEVEMENTS = {
  firstGame: {
    id: 'firstGame',
    name: 'First Steps',
    description: 'Complete your first quiz',
    icon: '🎮',
    xp: 50,
    condition: (stats) => stats.totalGames >= 1
  },
  perfectScore: {
    id: 'perfectScore',
    name: 'Perfect!',
    description: 'Get 10/10 in any quiz',
    icon: '🏆',
    xp: 200,
    condition: (stats, lastGame) => lastGame && lastGame.score === 10
  },
  speedDemon: {
    id: 'speedDemon',
    name: 'Speed Demon',
    description: 'Answer a question in under 3 seconds',
    icon: '⚡',
    xp: 100,
    condition: (stats, lastGame, lastAnswerTime) => lastAnswerTime && lastAnswerTime <= 3
  },
  categoryMaster: {
    id: 'categoryMaster',
    name: 'Category Master',
    description: 'Complete all categories',
    icon: '🌟',
    xp: 300,
    condition: (stats) => {
      const categories = new Set(stats.categoryScores?.map(c => c.category));
      return categories.size >= 3;
    }
  },
  streakMaster: {
    id: 'streakMaster',
    name: 'On Fire!',
    description: 'Achieve a 5-question correct streak',
    icon: '🔥',
    xp: 150,
    condition: (stats, lastGame, lastAnswerTime, currentStreak) => currentStreak >= 5
  },
  dailyChampion: {
    id: 'dailyChampion',
    name: 'Daily Champion',
    description: 'Complete 7 daily challenges',
    icon: '📅',
    xp: 250,
    condition: (stats) => stats.dailyChallenges >= 7
  },
  powerUser: {
    id: 'powerUser',
    name: 'Power User',
    description: 'Use all power-ups in one game',
    icon: '💪',
    xp: 175,
    condition: (stats, lastGame) => lastGame && lastGame.powerupsUsed?.length >= 3
  },
  timeMaster: {
    id: 'timeMaster',
    name: 'Time Master',
    description: 'Complete a quiz with 10+ seconds remaining total',
    icon: '⏰',
    xp: 125,
    condition: (stats, lastGame) => lastGame && lastGame.timeRemaining > 10
  }
};

class AchievementSystem {
  constructor() {
    this.achievements = ACHIEVEMENTS;
    this.unlockedAchievements = this.loadUnlocked();
    this.stats = this.loadStats();
  }

  loadUnlocked() {
    return JSON.parse(localStorage.getItem('brainBlistzAchievements')) || [];
  }

  loadStats() {
    return JSON.parse(localStorage.getItem('brainBlistzStats')) || {
      totalGames: 0,
      totalScore: 0,
      totalCorrect: 0,
      totalQuestions: 0,
      categoryScores: [],
      dailyChallenges: 0,
      powerupsUsed: [],
      bestStreak: 0,
      averageTime: 0
    };
  }

  saveStats() {
    localStorage.setItem('brainBlistzStats', JSON.stringify(this.stats));
  }

  saveUnlocked() {
    localStorage.setItem('brainBlistzAchievements', JSON.stringify(this.unlockedAchievements));
  }

  checkAchievements(gameData, currentStreak, lastAnswerTime) {
    const newlyUnlocked = [];
    
    Object.values(this.achievements).forEach(achievement => {
      if (!this.unlockedAchievements.includes(achievement.id)) {
        if (achievement.condition(this.stats, gameData, lastAnswerTime, currentStreak)) {
          this.unlockedAchievements.push(achievement.id);
          newlyUnlocked.push(achievement);
          this.stats.totalScore += achievement.xp;
        }
      }
    });

    if (newlyUnlocked.length > 0) {
      this.saveUnlocked();
      this.saveStats();
      this.showAchievementNotification(newlyUnlocked);
    }

    return newlyUnlocked;
  }

  showAchievementNotification(achievements) {
    const container = document.getElementById('newAchievements');
    const parent = document.getElementById('unlockedAchievements');
    
    if (container && parent) {
      container.innerHTML = achievements.map(a => `
        <div class="achievement-badge">
          <span class="achievement-icon">${a.icon}</span>
          <div class="achievement-info">
            <strong>${a.name}</strong>
            <small>${a.description}</small>
            <span class="xp-badge">+${a.xp} XP</span>
          </div>
        </div>
      `).join('');
      
      parent.classList.remove('hidden');
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        parent.classList.add('hidden');
      }, 5000);
    }
  }

  updateStats(gameData) {
    this.stats.totalGames++;
    this.stats.totalCorrect += gameData.score;
    this.stats.totalQuestions += 10;
    
    // Update category scores
    const categoryIndex = this.stats.categoryScores.findIndex(
      c => c.category === gameData.category
    );
    
    if (categoryIndex >= 0) {
      this.stats.categoryScores[categoryIndex].games++;
      this.stats.categoryScores[categoryIndex].totalScore += gameData.score;
    } else {
      this.stats.categoryScores.push({
        category: gameData.category,
        games: 1,
        totalScore: gameData.score
      });
    }
    
    // Update best streak
    if (gameData.bestStreak > this.stats.bestStreak) {
      this.stats.bestStreak = gameData.bestStreak;
    }
    
    // Update average time
    const totalTime = this.stats.averageTime * (this.stats.totalQuestions - 10) + gameData.totalTime;
    this.stats.averageTime = totalTime / this.stats.totalQuestions;
    
    this.saveStats();
  }

  renderAchievements(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = Object.values(this.achievements).map(achievement => {
      const unlocked = this.unlockedAchievements.includes(achievement.id);
      return `
        <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
          <div class="achievement-icon-large">${achievement.icon}</div>
          <h4>${achievement.name}</h4>
          <p>${achievement.description}</p>
          <span class="xp-value">${achievement.xp} XP</span>
          ${unlocked ? '<span class="unlocked-badge"><i class="fas fa-check"></i> Unlocked</span>' : ''}
        </div>
      `;
    }).join('');
  }

  renderStats(containerId) {
    // Update header stats
    document.getElementById('totalGames').textContent = this.stats.totalGames;
    document.getElementById('avgScore').textContent = 
      this.stats.totalQuestions > 0 
        ? Math.round((this.stats.totalCorrect / this.stats.totalQuestions) * 100) + '%'
        : '0%';
    document.getElementById('achievementsCount').textContent = this.unlockedAchievements.length;
    
    // Update detailed stats
    if (document.getElementById('statTotalGames')) {
      document.getElementById('statTotalGames').textContent = this.stats.totalGames;
      document.getElementById('statCorrectAnswers').textContent = this.stats.totalCorrect;
      document.getElementById('statAvgTime').textContent = 
        this.stats.averageTime > 0 ? this.stats.averageTime.toFixed(1) + 's' : '0s';
      document.getElementById('statBestStreak').textContent = this.stats.bestStreak;
    }

    // Render category stats
    const categoryStats = document.getElementById('categoryStats');
    if (categoryStats) {
      categoryStats.innerHTML = this.stats.categoryScores.map(cat => {
        const avgScore = Math.round((cat.totalScore / (cat.games * 10)) * 100);
        return `
          <div class="category-stat">
            <span class="cat-name">${cat.category}</span>
            <span class="cat-games">${cat.games} games</span>
            <div class="cat-progress">
              <div class="cat-progress-bar" style="width: ${avgScore}%"></div>
            </div>
            <span class="cat-avg">${avgScore}%</span>
          </div>
        `;
      }).join('');
    }
  }
}

// Initialize achievement system
window.achievementSystem = new AchievementSystem();