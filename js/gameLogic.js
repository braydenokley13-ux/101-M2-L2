/**
 * Game Logic - Handles game state, progression, and user interaction
 * OVERHAULED: Now requires balancing three stakeholder groups
 *
 * Key Lesson Concepts:
 * - Big markets say "We earned this, why subsidize competition?"
 * - Small markets need enough revenue to compete
 * - Competition is the product - the league needs both sides happy
 */

// Game State
let currentLevel = 1;
let currentConfig = null;
let currentResults = null;
let sharingPercent = 0;
let distributionType = 'equal';
let luxuryTaxThreshold = 150;
let tutorialStep = 0;
let hasShownVictory = false;

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
    hasShownVictory = false;

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
    document.getElementById('levelDifficulty').textContent = currentConfig.difficulty;

    // Update goal displays
    document.getElementById('goalParity').textContent = currentConfig.targetParity;
    document.getElementById('goalBigMarket').textContent = currentConfig.minBigMarketSatisfaction;
    document.getElementById('goalSmallMarket').textContent = currentConfig.minSmallMarketViability;

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
        document.getElementById('luxurySlider').value = 150;
        document.getElementById('luxuryValue').textContent = '$150M';
    } else {
        luxuryControl.style.display = 'none';
    }

    // Event listeners
    sharingSlider.removeEventListener('input', handleSharingChange);
    sharingSlider.addEventListener('input', handleSharingChange);

    const luxurySlider = document.getElementById('luxurySlider');
    luxurySlider.removeEventListener('input', handleLuxuryChange);
    luxurySlider.addEventListener('input', handleLuxuryChange);

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

    // Check victory conditions
    const conditions = checkVictoryConditions(currentResults, currentConfig);

    // Update all three meters
    updateParityMeter(conditions.parity, currentConfig.targetParity, conditions.parityMet);
    updateBigMarketMeter(conditions.bigSatisfaction, currentConfig.minBigMarketSatisfaction, conditions.bigSatisfactionMet);
    updateSmallMarketMeter(conditions.smallViability, currentConfig.minSmallMarketViability, conditions.smallViabilityMet);

    // Update overall status
    updateOverallStatus(conditions);

    // Update coach message
    const tip = getCoachingTip(currentResults, currentConfig, sharingPercent, distributionType);
    document.getElementById('coachMessage').textContent = tip;

    // Update warning messages
    updateWarnings(currentResults, currentConfig);

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
    if (conditions.allMet && !hasShownVictory) {
        hasShownVictory = true;
        setTimeout(() => showSuccess(), 1000);
    }
}

/**
 * Update parity meter
 */
function updateParityMeter(score, target, met) {
    document.getElementById('parityScore').textContent = `${score}%`;
    document.getElementById('parityFill').style.width = `${Math.min(score, 100)}%`;

    const indicator = document.getElementById('parityIndicator');
    indicator.className = 'status-indicator ' + (met ? 'status-success' : 'status-fail');
    indicator.textContent = met ? '✓' : '✗';
}

/**
 * Update big market satisfaction meter
 */
function updateBigMarketMeter(score, target, met) {
    document.getElementById('bigMarketScore').textContent = `${score}%`;
    document.getElementById('bigMarketFill').style.width = `${Math.min(score, 100)}%`;

    const indicator = document.getElementById('bigMarketIndicator');
    indicator.className = 'status-indicator ' + (met ? 'status-success' : 'status-fail');
    indicator.textContent = met ? '✓' : '✗';
}

/**
 * Update small market viability meter
 */
function updateSmallMarketMeter(score, target, met) {
    document.getElementById('smallMarketScore').textContent = `${score}%`;
    document.getElementById('smallMarketFill').style.width = `${Math.min(score, 100)}%`;

    const indicator = document.getElementById('smallMarketIndicator');
    indicator.className = 'status-indicator ' + (met ? 'status-success' : 'status-fail');
    indicator.textContent = met ? '✓' : '✗';
}

/**
 * Update overall status display
 */
function updateOverallStatus(conditions) {
    const statusEl = document.getElementById('overallStatus');
    const metCount = [conditions.parityMet, conditions.bigSatisfactionMet, conditions.smallViabilityMet].filter(x => x).length;

    if (conditions.allMet) {
        statusEl.textContent = '🎉 ALL STAKEHOLDERS APPROVE!';
        statusEl.className = 'overall-status victory';
    } else if (metCount === 2) {
        statusEl.textContent = `✨ Almost there! ${metCount}/3 conditions met`;
        statusEl.className = 'overall-status almost';
    } else if (metCount === 1) {
        statusEl.textContent = `📊 ${metCount}/3 conditions met`;
        statusEl.className = 'overall-status partial';
    } else {
        statusEl.textContent = '⚖️ Find the balance that works for everyone';
        statusEl.className = 'overall-status none';
    }
}

/**
 * Update warning messages
 */
function updateWarnings(results, levelConfig) {
    const warnings = getWarningMessage(results, levelConfig);
    const warningContainer = document.getElementById('warningMessages');

    if (warnings.length > 0) {
        warningContainer.innerHTML = warnings.map(w => `<div class="warning-item">${w}</div>`).join('');
        warningContainer.style.display = 'block';
    } else {
        warningContainer.style.display = 'none';
    }
}

/**
 * Update team cards with mood and quotes
 */
function updateTeamCards(results) {
    const container = document.getElementById('teamsGrid');
    container.innerHTML = '';

    results.forEach(team => {
        const card = document.createElement('div');
        card.className = `team-card ${team.market}-market`;

        const changeClass = team.change >= 0 ? 'positive' : 'negative';
        const changeSymbol = team.change >= 0 ? '+' : '';

        // Satisfaction bar color based on level
        let satisfactionClass = 'sat-low';
        if (team.satisfaction >= 70) satisfactionClass = 'sat-high';
        else if (team.satisfaction >= 50) satisfactionClass = 'sat-mid';

        card.innerHTML = `
            <div class="team-header">
                <span class="team-name">${team.name}</span>
                <span class="team-mood">${team.mood}</span>
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
            <div class="satisfaction-bar-container">
                <div class="satisfaction-bar ${satisfactionClass}" style="width: ${team.satisfaction}%"></div>
            </div>
            <div class="team-quote">${team.quote}</div>
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

    // Get final conditions
    const conditions = checkVictoryConditions(currentResults, currentConfig);

    // Update modal content
    document.getElementById('successMessage').textContent =
        `You achieved ${conditions.parity}% parity while keeping all stakeholders happy! That's real commissioner work!`;
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
    hasShownVictory = false;
    sharingPercent = 0;
    distributionType = currentConfig.defaultDistribution;
    luxuryTaxThreshold = 150;
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
 * Tutorial System for Level 1 - Now explains the trade-off system
 */
const tutorialSteps = [
    "Welcome, Commissioner! In the NBA, you're responsible for making sure the league stays competitive AND profitable.",
    "Here's the challenge: Big market teams (like LA Lakers) make WAY more money than small market teams (like Memphis). Their local TV deals alone can be worth more than a small team's entire budget!",
    "But here's the catch: if small markets can't compete, fans lose interest. As the lesson says: 'Competition is the product. Without it, leagues collapse.'",
    "Your tool is REVENUE SHARING - you take some money from all teams and redistribute it. BUT... big market owners will complain: 'We earned this, why subsidize our competition?'",
    "You need to balance THREE things: 1) League Parity (fairness between teams), 2) Big Market Satisfaction (they need to approve!), and 3) Small Market Survival (they need enough to compete).",
    "The sweet spot is narrow! Too much sharing makes big markets angry. Too little, and small markets can't survive. Find the balance - that's commissioner work!"
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
        btn.textContent = "Let's Find That Balance!";
    } else {
        btn.textContent = "Next";
    }
}
