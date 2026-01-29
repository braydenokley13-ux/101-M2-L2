/**
 * Game Logic - Handles game state, progression, and user interaction
 */

// Game State
let currentLevel = 1;
let currentConfig = null;
let currentResults = null;
let sharingPercent = 0;
let distributionType = 'equal';
let luxuryTaxThreshold = 150;
let tutorialStep = 0;

// Progress tracking (stored in localStorage)
const STORAGE_KEY = 'nba_commissioner_progress';

/**
 * Initialize game on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    updateLevelCards();
    updateClaimCodes();
});

/**
 * Load progress from localStorage
 */
function loadProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            return { completedLevels: [] };
        }
    }
    return { completedLevels: [] };
}

/**
 * Save progress to localStorage
 */
function saveProgress(levelNumber) {
    const progress = loadProgress();
    if (!progress.completedLevels.includes(levelNumber)) {
        progress.completedLevels.push(levelNumber);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

/**
 * Start a specific level
 */
function startLevel(levelNumber) {
    const progress = loadProgress();

    // Check if level is unlocked
    if (levelNumber > 1 && !progress.completedLevels.includes(levelNumber - 1)) {
        alert(`Complete Level ${levelNumber - 1} first!`);
        return;
    }

    currentLevel = levelNumber;
    currentConfig = LEVELS[levelNumber];

    // Hide level select, show game screen
    document.getElementById('levelSelect').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');

    // Reset controls
    sharingPercent = 0;
    distributionType = currentConfig.defaultDistribution;
    luxuryTaxThreshold = 150;

    // Initialize UI
    initializeLevel();

    // Show tutorial for level 1
    if (levelNumber === 1 && !progress.completedLevels.includes(1)) {
        showTutorial();
    }
}

/**
 * Initialize level UI
 */
function initializeLevel() {
    // Update level info
    document.getElementById('currentLevelName').textContent = `Level ${currentLevel}: ${currentConfig.name}`;
    document.getElementById('goalFairness').textContent = currentConfig.targetFairness;

    // Set up controls
    const sharingSlider = document.getElementById('sharingSlider');
    sharingSlider.value = 0;
    document.getElementById('sharingValue').textContent = '0%';

    // Distribution control
    const distributionControl = document.getElementById('distributionControl');
    if (currentConfig.allowDistributionChoice) {
        distributionControl.style.display = 'block';
        setDistribution(currentConfig.defaultDistribution);
    } else {
        distributionControl.style.display = 'none';
        distributionType = currentConfig.defaultDistribution;
    }

    // Luxury tax control
    const luxuryControl = document.getElementById('luxuryTaxControl');
    if (currentConfig.luxuryTaxEnabled) {
        luxuryControl.style.display = 'block';
    } else {
        luxuryControl.style.display = 'none';
    }

    // Event listeners
    sharingSlider.removeEventListener('input', handleSharingChange);
    sharingSlider.addEventListener('input', handleSharingChange);

    const luxurySlider = document.getElementById('luxurySlider');
    luxurySlider.removeEventListener('input', handleLuxuryChange);
    luxurySlider.addEventListener('input', handleLuxuryChange);

    // Update goal marker position
    document.getElementById('meterGoal').style.left = `${currentConfig.targetFairness}%`;

    // Initial calculation
    updateCalculations();
}

/**
 * Handle sharing slider change
 */
function handleSharingChange(e) {
    sharingPercent = parseInt(e.target.value);
    document.getElementById('sharingValue').textContent = `${sharingPercent}%`;
    updateCalculations();
}

/**
 * Handle luxury tax slider change
 */
function handleLuxuryChange(e) {
    luxuryTaxThreshold = parseInt(e.target.value);
    document.getElementById('luxuryValue').textContent = `$${luxuryTaxThreshold}M`;
    updateCalculations();
}

/**
 * Set distribution type
 */
function setDistribution(type) {
    distributionType = type;

    // Update button states
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-type') === type) {
            btn.classList.add('active');
        }
    });

    // Update explanation
    document.getElementById('distributionExplain').textContent = getDistributionExplanation(type);

    updateCalculations();
}

/**
 * Update all calculations and UI
 */
function updateCalculations() {
    // Calculate revenue sharing
    const luxuryTax = currentConfig.luxuryTaxEnabled ? luxuryTaxThreshold : 0;
    currentResults = calculateRevenueSharing(
        currentConfig.teams,
        sharingPercent,
        distributionType,
        luxuryTax
    );

    // Calculate fairness score
    const fairnessScore = calculateFairnessScore(currentResults);

    // Update fairness meter
    updateFairnessMeter(fairnessScore);

    // Update coach message
    const tip = getCoachingTip(fairnessScore, currentConfig.targetFairness, sharingPercent, distributionType);
    document.getElementById('coachMessage').textContent = tip;

    // Update stats
    const totalRevenue = calculateTotalRevenue(currentResults);
    const revenueGap = calculateRevenueGap(currentResults);
    document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('revenueGap').textContent = formatCurrency(revenueGap);

    // Update team cards
    updateTeamCards(currentResults);

    // Update chart
    updateChart(currentResults);

    // Check if level complete
    if (fairnessScore >= currentConfig.targetFairness) {
        setTimeout(() => showSuccess(), 1000);
    }
}

/**
 * Update fairness meter
 */
function updateFairnessMeter(score) {
    document.getElementById('fairnessScore').textContent = `${score}%`;
    document.getElementById('meterFill').style.width = `${score}%`;

    const status = document.getElementById('meterStatus');
    if (score >= currentConfig.targetFairness) {
        status.textContent = '✅ Goal Achieved!';
        status.classList.add('success');
    } else {
        status.textContent = 'Keep adjusting to reach your goal!';
        status.classList.remove('success');
    }
}

/**
 * Update team cards
 */
function updateTeamCards(results) {
    const container = document.getElementById('teamsGrid');
    container.innerHTML = '';

    results.forEach(team => {
        const card = document.createElement('div');
        card.className = `team-card ${team.market}-market`;

        const changeClass = team.change >= 0 ? 'positive' : 'negative';
        const changeSymbol = team.change >= 0 ? '+' : '';

        card.innerHTML = `
            <div class="team-header">
                <span class="team-name">${team.name}</span>
                <span class="team-icon">${team.icon}</span>
            </div>
            <div class="market-badge ${team.market}">
                ${team.market.toUpperCase()} MARKET
            </div>
            <div class="revenue-display">
                <div class="revenue-label">Final Revenue</div>
                <div class="revenue-value">$${team.finalRevenue}M</div>
            </div>
            <div class="revenue-change ${changeClass}">
                ${changeSymbol}$${Math.abs(team.change)}M
            </div>
        `;

        container.appendChild(card);
    });
}

/**
 * Show success modal
 */
function showSuccess() {
    // Only show once per level completion
    const modal = document.getElementById('successModal');
    if (!modal.classList.contains('hidden')) return;

    // Save progress
    saveProgress(currentLevel);

    // Get claim code
    const claimCode = currentConfig.claimCode;

    // Update modal content
    const fairnessScore = calculateFairnessScore(currentResults);
    document.getElementById('successMessage').textContent =
        `You achieved ${fairnessScore}% fairness! The league is balanced and competitive!`;
    document.getElementById('claimCodeText').textContent = claimCode;

    // Show modal
    modal.classList.remove('hidden');

    // Update UI
    updateLevelCards();
    updateClaimCodes();
}

/**
 * Close success modal
 */
function closeSuccessModal() {
    document.getElementById('successModal').classList.add('hidden');

    // Go to next level or back to menu
    if (currentLevel < 5) {
        backToLevels();
    } else {
        backToLevels();
    }
}

/**
 * Retry current level
 */
function retryLevel() {
    document.getElementById('successModal').classList.add('hidden');
    initializeLevel();
}

/**
 * Copy claim code to clipboard
 */
function copyClaimCode() {
    const code = document.getElementById('claimCodeText').textContent;
    navigator.clipboard.writeText(code).then(() => {
        const btn = document.querySelector('.copy-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}

/**
 * Back to level selection
 */
function backToLevels() {
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('levelSelect').classList.remove('hidden');
    updateLevelCards();
    updateClaimCodes();
}

/**
 * Update level cards based on progress
 */
function updateLevelCards() {
    const progress = loadProgress();

    for (let i = 1; i <= 5; i++) {
        const card = document.querySelector(`.level-card[data-level="${i}"]`);
        const completeBadge = document.getElementById(`level${i}Complete`);

        // Unlock levels
        if (i === 1 || progress.completedLevels.includes(i - 1)) {
            card.classList.remove('locked');
        } else {
            card.classList.add('locked');
        }

        // Show completion
        if (progress.completedLevels.includes(i)) {
            card.classList.add('completed');
            completeBadge.style.display = 'block';
        } else {
            card.classList.remove('completed');
            completeBadge.style.display = 'none';
        }
    }
}

/**
 * Update claim codes display
 */
function updateClaimCodes() {
    const progress = loadProgress();

    // Individual level codes
    for (let i = 1; i <= 5; i++) {
        const codeCard = document.getElementById(`code${i}`);
        const codeValue = codeCard.querySelector('.code-value');

        if (progress.completedLevels.includes(i)) {
            codeValue.textContent = ACHIEVEMENT_CODES[`level${i}`];
            codeValue.classList.remove('locked');
            codeCard.classList.add('unlocked');
        }
    }

    // 3 Levels Bonus
    if (progress.completedLevels.length >= 3) {
        const code3Card = document.getElementById('code3bonus');
        const code3Value = code3Card.querySelector('.code-value');
        code3Value.textContent = ACHIEVEMENT_CODES.bonus3Levels;
        code3Value.classList.remove('locked');
        code3Card.classList.add('unlocked');
    }

    // 5 Levels Master Bonus
    if (progress.completedLevels.length >= 5) {
        const code5Card = document.getElementById('code5bonus');
        const code5Value = code5Card.querySelector('.code-value');
        code5Value.textContent = ACHIEVEMENT_CODES.bonus5Levels;
        code5Value.classList.remove('locked');
        code5Card.classList.add('unlocked');
    }
}

/**
 * Tutorial System for Level 1
 */
const tutorialSteps = [
    "Welcome to the NBA! You're the new Commissioner, and it's your job to make sure all teams can compete fairly.",
    "Big market teams (like LA Lakers) make more money from ticket sales and TV deals than small market teams (like Memphis).",
    "Your tool is REVENUE SHARING - taking some money from all teams and redistributing it to help smaller teams.",
    "Use the slider below to adjust how much revenue gets shared. Watch what happens to each team's final revenue!",
    "Your goal: Get the Fairness Score to 70% or higher. This means the smallest team earns at least 70% of what the biggest team earns.",
    "Try it now! Move the slider and see how it affects the teams. Good luck, Commissioner! 🏀"
];

function showTutorial() {
    tutorialStep = 0;
    const overlay = document.getElementById('tutorialOverlay');
    overlay.classList.remove('hidden');
    updateTutorialContent();
}

function nextTutorialStep() {
    tutorialStep++;
    if (tutorialStep >= tutorialSteps.length) {
        document.getElementById('tutorialOverlay').classList.add('hidden');
    } else {
        updateTutorialContent();
    }
}

function updateTutorialContent() {
    document.getElementById('tutorialText').textContent = tutorialSteps[tutorialStep];

    const btn = document.querySelector('.tutorial-btn');
    if (tutorialStep === tutorialSteps.length - 1) {
        btn.textContent = "Let's Go!";
    } else {
        btn.textContent = "Next";
    }
}
