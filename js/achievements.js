const ACHIEVEMENTS = {
  firstGame: {
    id: 'firstGame',
    name: 'First Steps',
    description: 'Complete your first quiz.',
    icon: 'FG',
    xp: 50,
    condition: (stats) => stats.totalGames >= 1
  },
  perfectScore: {
    id: 'perfectScore',
    name: 'Perfect Score',
    description: 'Get 10 out of 10 in any quiz.',
    icon: '10',
    xp: 200,
    condition: (stats, gameData) => gameData?.score === 10
  },
  speedDemon: {
    id: 'speedDemon',
    name: 'Speed Demon',
    description: 'Answer one question in 3 seconds or less.',
    icon: 'SP',
    xp: 100,
    condition: (stats, gameData, fastestAnswerTime) => fastestAnswerTime !== null && fastestAnswerTime <= 3
  },
  categoryMaster: {
    id: 'categoryMaster',
    name: 'Category Master',
    description: 'Play all three categories.',
    icon: 'CM',
    xp: 300,
    condition: (stats) => new Set(stats.categoryScores.map((item) => item.category)).size >= 3
  },
  streakMaster: {
    id: 'streakMaster',
    name: 'On Fire',
    description: 'Reach a 5-question correct streak.',
    icon: 'ST',
    xp: 150,
    condition: (stats, gameData, fastestAnswerTime, currentStreak) => currentStreak >= 5
  },
  dailyChampion: {
    id: 'dailyChampion',
    name: 'Daily Champion',
    description: 'Complete 7 daily challenges.',
    icon: 'DC',
    xp: 250,
    condition: (stats) => stats.dailyChallenges >= 7
  },
  powerUser: {
    id: 'powerUser',
    name: 'Power User',
    description: 'Use all three power-ups in one game.',
    icon: 'PU',
    xp: 175,
    condition: (stats, gameData) => new Set(gameData?.powerupsUsed || []).size >= 3
  },
  timeMaster: {
    id: 'timeMaster',
    name: 'Time Master',
    description: 'Finish a quiz with a time bonus above 10.',
    icon: 'TM',
    xp: 125,
    condition: (stats, gameData) => (gameData?.totalTime || 0) > 10
  }
};

class AchievementSystem {
  constructor() {
    this.achievements = ACHIEVEMENTS;
    this.unlockedAchievements = this.loadUnlocked();
    this.stats = this.loadStats();
  }

  loadUnlocked() {
    return JSON.parse(localStorage.getItem('brainBlistzAchievements') || '[]');
  }

  loadStats() {
    return JSON.parse(localStorage.getItem('brainBlistzStats') || 'null') || {
      totalGames: 0,
      totalCorrect: 0,
      totalQuestions: 0,
      categoryScores: [],
      dailyChallenges: 0,
      bestStreak: 0,
      averageSavedTime: 0,
      totalXp: 0
    };
  }

  saveStats() {
    localStorage.setItem('brainBlistzStats', JSON.stringify(this.stats));
  }

  saveUnlocked() {
    localStorage.setItem('brainBlistzAchievements', JSON.stringify(this.unlockedAchievements));
  }

  updateStats(gameData) {
    this.stats.totalGames += 1;
    this.stats.totalCorrect += gameData.score;
    this.stats.totalQuestions += 10;
    this.stats.bestStreak = Math.max(this.stats.bestStreak, gameData.bestStreak || 0);
    this.stats.totalXp += gameData.xpEarned || 0;
    if (gameData.mode === 'daily') this.stats.dailyChallenges += 1;

    const categoryEntry = this.stats.categoryScores.find((item) => item.category === gameData.category);
    if (categoryEntry) {
      categoryEntry.games += 1;
      categoryEntry.totalScore += gameData.score;
    } else {
      this.stats.categoryScores.push({ category: gameData.category, games: 1, totalScore: gameData.score });
    }

    const previousGames = this.stats.totalGames - 1;
    this.stats.averageSavedTime =
      previousGames <= 0
        ? gameData.totalTime || 0
        : ((this.stats.averageSavedTime * previousGames) + (gameData.totalTime || 0)) / this.stats.totalGames;

    this.saveStats();
  }

  checkAchievements(gameData, currentStreak, fastestAnswerTime) {
    const unlockedNow = [];
    Object.values(this.achievements).forEach((achievement) => {
      if (this.unlockedAchievements.includes(achievement.id)) return;
      if (!achievement.condition(this.stats, gameData, fastestAnswerTime, currentStreak)) return;
      this.unlockedAchievements.push(achievement.id);
      unlockedNow.push(achievement);
      this.stats.totalXp += achievement.xp;
    });

    if (unlockedNow.length > 0) {
      this.saveUnlocked();
      this.saveStats();
      this.showAchievementNotification(unlockedNow);
    }

    return unlockedNow;
  }

  showAchievementNotification(achievements) {
    const container = document.getElementById('newAchievements');
    const wrapper = document.getElementById('unlockedAchievements');
    if (!container || !wrapper) return;

    container.innerHTML = achievements.map((achievement) => `
      <div class="achievement-badge">
        <span class="achievement-icon">${achievement.icon}</span>
        <div class="achievement-info">
          <strong>${achievement.name}</strong>
          <small>${achievement.description}</small>
          <span class="xp-badge">+${achievement.xp} XP</span>
        </div>
      </div>
    `).join('');

    wrapper.classList.remove('hidden');
  }

  renderAchievements(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = Object.values(this.achievements).map((achievement) => {
      const unlocked = this.unlockedAchievements.includes(achievement.id);
      return `
        <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
          <div class="achievement-icon-large">${achievement.icon}</div>
          <h4>${achievement.name}</h4>
          <p>${achievement.description}</p>
          <span class="xp-value">${achievement.xp} XP</span>
          ${unlocked ? '<span class="unlocked-badge">Unlocked</span>' : ''}
        </div>
      `;
    }).join('');
  }

  renderStats() {
    this.setText('totalGames', this.stats.totalGames);
    this.setText('avgScore', this.stats.totalQuestions > 0 ? `${Math.round((this.stats.totalCorrect / this.stats.totalQuestions) * 100)}%` : '0%');
    this.setText('achievementsCount', this.unlockedAchievements.length);
    this.setText('statTotalGames', this.stats.totalGames);
    this.setText('statCorrectAnswers', this.stats.totalCorrect);
    this.setText('statAvgTime', `${this.stats.averageSavedTime.toFixed(1)}s`);
    this.setText('statBestStreak', this.stats.bestStreak);
    this.setText('statPreviewGames', this.stats.totalGames);
    this.setText('statPreviewBestStreak', this.stats.bestStreak);
    this.setText('statPreviewXp', this.stats.totalXp);

    const categoryStats = document.getElementById('categoryStats');
    if (!categoryStats) return;

    if (this.stats.categoryScores.length === 0) {
      categoryStats.innerHTML = '<p class="empty-state">No category data yet. Play a quiz to populate this section.</p>';
      return;
    }

    categoryStats.innerHTML = this.stats.categoryScores.map((item) => {
      const average = Math.round((item.totalScore / (item.games * 10)) * 100);
      return `
        <div class="category-stat">
          <span class="cat-name">${item.category}</span>
          <span class="cat-games">${item.games} games</span>
          <div class="cat-progress">
            <div class="cat-progress-bar" style="width: ${average}%"></div>
          </div>
          <span class="cat-avg">${average}%</span>
        </div>
      `;
    }).join('');
  }

  setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = String(value);
  }
}

window.achievementSystem = new AchievementSystem();
