/**
 * Game Logic V2 - Handles game state, progression, and user interaction
 *
 * V2 additions:
 * - Debounced slider updates
 * - Hold-to-win (prevent accidental triggers)
 * - Undo/Reset with 10-step history
 * - Progressive hint system
 * - Sandbox mode
 * - Math panel renderer
 * - Random events (Level 4-5)
 * - Save/restore last slider positions per level
 * - Toast notifications
 * - Confetti particles
 * - Threshold markers
 * - Condition tracker pills
 * - Near-solution detection
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
let isSandboxMode = false;

// V2 State
let historyStack = [];
let hintLevel = 0;
let _lastTeamCount = 0; // tracks when to rebuild team card DOM vs just refresh
let holdTimer = null;
let holdProgress = 0;
let holdInterval = null;
let randomEventTimer = null;
let randomEventActive = false;
let eventRevenueDelta = { teamName: null, delta: 0 };
let debounceTimer = null;

// Progress tracking (stored in localStorage)
const STORAGE_KEY = 'nba_commissioner_progress';

/**
 * Initialize game on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    updateLevelCards();
    updateClaimCodes();
    updateProgressOverview();
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
            return { completedLevels: [], lastSettings: {} };
        }
    }
    return { completedLevels: [], lastSettings: {} };
}

/**
 * Save progress to localStorage
 */
function saveProgress(levelNumber) {
    const progress = loadProgress();
    if (!progress.completedLevels.includes(levelNumber)) {
        progress.completedLevels.push(levelNumber);
    }
    // Save last settings for this level
    if (!progress.lastSettings) progress.lastSettings = {};
    progress.lastSettings[levelNumber] = {
        sharing: sharingPercent,
        distribution: distributionType,
        luxuryTax: luxuryTaxThreshold
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

/**
 * Save current slider settings without marking level complete
 */
function saveCurrentSettings() {
    const progress = loadProgress();
    if (!progress.lastSettings) progress.lastSettings = {};
    progress.lastSettings[currentLevel] = {
        sharing: sharingPercent,
        distribution: distributionType,
        luxuryTax: luxuryTaxThreshold
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

/**
 * Reset all progress (from UI)
 */
function resetAllProgress() {
    if (confirm('Reset all progress? This will clear all completed levels and codes.')) {
        localStorage.removeItem(STORAGE_KEY);
        updateLevelCards();
        updateClaimCodes();
        updateProgressOverview();
        showToast('Progress reset!', 'success');
    }
}

/**
 * Update the progress overview bar on level select
 */
function updateProgressOverview() {
    const progress = loadProgress();
    const count = progress.completedLevels.length;
    const pct = (count / 5) * 100;
    const fill = document.getElementById('progressFill');
    const label = document.getElementById('progressLabel');
    if (fill) fill.style.width = pct + '%';
    if (label) label.textContent = `${count} / 5 Levels Complete`;
}

/**
 * Start sandbox mode
 */
function startSandbox() {
    isSandboxMode = true;
    currentLevel = 5;
    currentConfig = Object.assign({}, LEVELS[5], {
        allowDistributionChoice: true,
        luxuryTaxEnabled: true,
        targetParity: 0,
        minBigMarketSatisfaction: 0,
        minSmallMarketViability: 0
    });
    hasShownVictory = false;
    historyStack = [];
    hintLevel = 0;

    sharingPercent = 0;
    distributionType = 'equal';
    luxuryTaxThreshold = 150;

    document.getElementById('levelSelect').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');

    document.getElementById('currentLevelName').textContent = 'Sandbox Mode — Free Explore';
    document.getElementById('levelDifficulty').textContent = 'No Goals';
    document.getElementById('sandboxTag').classList.remove('hidden');

    // Show all controls
    document.getElementById('distributionControl').style.display = 'block';
    document.getElementById('luxuryTaxControl').style.display = 'block';

    // Hide hint btn in sandbox (no need)
    document.getElementById('hintBtn').style.display = 'none';

    initializeLevel(true);
}

/**
 * Start a specific level
 */
function startLevel(levelNumber) {
    const progress = loadProgress();

    // Check if level is unlocked
    if (levelNumber > 1 && !progress.completedLevels.includes(levelNumber - 1)) {
        showToast(`Complete Level ${levelNumber - 1} first!`, 'error');
        return;
    }

    isSandboxMode = false;
    currentLevel = levelNumber;
    currentConfig = LEVELS[levelNumber];
    hasShownVictory = false;
    historyStack = [];
    hintLevel = 0;

    // Restore last settings for this level if available
    const lastSettings = progress.lastSettings && progress.lastSettings[levelNumber];
    if (lastSettings) {
        sharingPercent = lastSettings.sharing || 0;
        distributionType = lastSettings.distribution || currentConfig.defaultDistribution;
        luxuryTaxThreshold = lastSettings.luxuryTax || 150;
    } else {
        sharingPercent = 0;
        distributionType = currentConfig.defaultDistribution;
        luxuryTaxThreshold = 150;
    }

    // Hide level select, show game screen
    document.getElementById('levelSelect').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');

    document.getElementById('sandboxTag').classList.add('hidden');
    document.getElementById('hintBtn').style.display = '';

    initializeLevel(false);

    // Show tutorial for level 1 (only if never completed)
    if (levelNumber === 1 && !progress.completedLevels.includes(1)) {
        showTutorial();
    }
}

/**
 * Initialize level UI
 */
function initializeLevel(isSandbox) {
    // Reset victory/event state
    hasShownVictory = false;
    clearHoldTimer();
    clearRandomEventTimer();
    randomEventActive = false;
    eventRevenueDelta = { teamName: null, delta: 0 };

    // Reset hint display
    hintLevel = 0;
    const hintBox = document.getElementById('hintBox');
    const hintBtn = document.getElementById('hintBtn');
    if (hintBox) hintBox.classList.add('hidden');
    if (hintBtn) {
        hintBtn.textContent = '💡 Need a Hint?';
        hintBtn.classList.remove('exhausted');
    }

    // Update level info
    document.getElementById('currentLevelName').textContent =
        isSandbox ? 'Sandbox Mode — Free Explore' : `Level ${currentLevel}: ${currentConfig.name}`;
    document.getElementById('levelDifficulty').textContent = isSandbox ? 'No Goals' : currentConfig.difficulty;

    // Update goal displays
    document.getElementById('goalParity').textContent = currentConfig.targetParity;
    document.getElementById('goalBigMarket').textContent = currentConfig.minBigMarketSatisfaction;
    document.getElementById('goalSmallMarket').textContent = currentConfig.minSmallMarketViability;

    // Set threshold markers
    setThresholdMarker('parityThreshold', currentConfig.targetParity);
    setThresholdMarker('bigMarketThreshold', currentConfig.minBigMarketSatisfaction);
    setThresholdMarker('smallMarketThreshold', currentConfig.minSmallMarketViability);

    // Update undo button state
    updateUndoButton();

    // Set up controls
    const sharingSlider = document.getElementById('sharingSlider');
    sharingSlider.value = sharingPercent;
    document.getElementById('sharingValue').textContent = `${sharingPercent}%`;

    // Distribution control
    const distributionControl = document.getElementById('distributionControl');
    if (currentConfig.allowDistributionChoice || isSandbox) {
        distributionControl.style.display = 'block';
        setDistribution(distributionType, false);
    } else {
        distributionControl.style.display = 'none';
        distributionType = currentConfig.defaultDistribution;
    }

    // Luxury tax control
    const luxuryControl = document.getElementById('luxuryTaxControl');
    if (currentConfig.luxuryTaxEnabled || isSandbox) {
        luxuryControl.style.display = 'block';
        document.getElementById('luxurySlider').value = luxuryTaxThreshold;
        document.getElementById('luxuryValue').textContent = `$${luxuryTaxThreshold}M`;
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

    // Start random event timer for levels 4-5 (not sandbox)
    if (!isSandboxMode && currentLevel >= 4) {
        startRandomEventTimer();
    }
}

/**
 * Set threshold marker position
 */
function setThresholdMarker(markerId, targetPct) {
    const marker = document.getElementById(markerId);
    if (marker) {
        if (targetPct > 0) {
            marker.style.left = `${Math.min(targetPct, 98)}%`;
            marker.style.display = 'block';
        } else {
            marker.style.display = 'none';
        }
    }
}

/**
 * Handle sharing slider change
 */
function handleSharingChange(e) {
    pushHistory();
    sharingPercent = parseInt(e.target.value);
    document.getElementById('sharingValue').textContent = `${sharingPercent}%`;
    debouncedUpdate();
}

/**
 * Handle luxury tax slider change
 */
function handleLuxuryChange(e) {
    pushHistory();
    luxuryTaxThreshold = parseInt(e.target.value);
    document.getElementById('luxuryValue').textContent = `$${luxuryTaxThreshold}M`;
    debouncedUpdate();
}

/**
 * Debounced calculation update
 */
function debouncedUpdate() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        updateCalculations();
        saveCurrentSettings();
    }, 120);
}

/**
 * Set distribution type
 */
function setDistribution(type, pushHist = true) {
    if (pushHist) pushHistory();
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

    debouncedUpdate();
}

/**
 * Push current state to undo history
 */
function pushHistory() {
    historyStack.push({
        sharing: sharingPercent,
        distribution: distributionType,
        luxuryTax: luxuryTaxThreshold
    });
    if (historyStack.length > 10) historyStack.shift();
    updateUndoButton();
}

/**
 * Undo last action
 */
function undoLastAction() {
    if (historyStack.length === 0) return;
    const prev = historyStack.pop();
    sharingPercent = prev.sharing;
    distributionType = prev.distribution;
    luxuryTaxThreshold = prev.luxuryTax;

    // Update UI controls
    document.getElementById('sharingSlider').value = sharingPercent;
    document.getElementById('sharingValue').textContent = `${sharingPercent}%`;
    document.getElementById('luxurySlider').value = luxuryTaxThreshold;
    document.getElementById('luxuryValue').textContent = `$${luxuryTaxThreshold}M`;
    setDistribution(distributionType, false);

    updateUndoButton();
    updateCalculations();
}

/**
 * Reset current level to defaults
 */
function resetLevel() {
    historyStack = [];
    sharingPercent = 0;
    distributionType = currentConfig.defaultDistribution;
    luxuryTaxThreshold = 150;
    hintLevel = 0;

    document.getElementById('sharingSlider').value = 0;
    document.getElementById('sharingValue').textContent = '0%';
    document.getElementById('luxurySlider').value = 150;
    document.getElementById('luxuryValue').textContent = '$150M';
    setDistribution(distributionType, false);

    const hintBox = document.getElementById('hintBox');
    const hintBtn = document.getElementById('hintBtn');
    if (hintBox) hintBox.classList.add('hidden');
    if (hintBtn) {
        hintBtn.textContent = '💡 Need a Hint?';
        hintBtn.classList.remove('exhausted');
    }

    updateUndoButton();
    updateCalculations();
    showToast('Level reset!', 'success');
}

/**
 * Update undo button enabled state
 */
function updateUndoButton() {
    const btn = document.getElementById('undoBtn');
    if (btn) btn.disabled = historyStack.length === 0;
}

/**
 * Show next hint tier
 */
function showNextHint() {
    if (isSandboxMode) return;
    const hints = currentConfig.hints;
    if (!hints || hintLevel >= hints.length) return;

    const hintBox = document.getElementById('hintBox');
    const hintBtn = document.getElementById('hintBtn');
    const hintTierLabel = document.getElementById('hintTierLabel');
    const hintText = document.getElementById('hintText');

    hintText.textContent = hints[hintLevel];
    hintTierLabel.textContent = `Hint ${hintLevel + 1} of ${hints.length}`;
    hintBox.classList.remove('hidden');

    hintLevel++;

    if (hintLevel >= hints.length) {
        hintBtn.textContent = '💡 All Hints Shown';
        hintBtn.classList.add('exhausted');
    } else {
        hintBtn.textContent = `💡 Show More (${hintLevel + 1}/${hints.length})`;
    }
}

/**
 * Update all calculations and UI
 */
function updateCalculations() {
    // Apply any active event delta
    let teamsToUse = currentConfig.teams;
    if (eventRevenueDelta.teamName) {
        teamsToUse = currentConfig.teams.map(t =>
            t.name === eventRevenueDelta.teamName
                ? Object.assign({}, t, { baseRevenue: t.baseRevenue + eventRevenueDelta.delta })
                : t
        );
    }

    // Calculate revenue sharing
    const luxuryTax = currentConfig.luxuryTaxEnabled ? luxuryTaxThreshold : 0;
    currentResults = calculateRevenueSharing(
        teamsToUse,
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

    // Update condition tracker pills
    updateConditionTracker(conditions);

    // Update overall status
    updateOverallStatus(conditions);

    // Update coach message
    const tip = getCoachingTip(currentResults, currentConfig, sharingPercent, distributionType);
    document.getElementById('coachMessage').textContent =
        isSandboxMode ? '🧪 Sandbox mode: explore freely! No win conditions. Try all the sliders!' : tip;

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

    // Update math panel
    renderMathPanel(currentResults);

    // Check near-solution
    if (!isSandboxMode && !conditions.allMet) {
        const near = isNearSolution(currentResults, currentConfig);
        if (near) {
            const statusEl = document.getElementById('overallStatus');
            statusEl.classList.add('near-solution');
        }
    }

    // Check if level complete (hold-to-win)
    if (!isSandboxMode && conditions.allMet && !hasShownVictory) {
        startHoldTimer();
    } else if (!conditions.allMet) {
        clearHoldTimer();
    }
}

/**
 * Start hold-to-win timer (800ms)
 */
function startHoldTimer() {
    if (holdInterval) return; // already running — holdTimer was never set, use holdInterval as guard

    const holdIndicator = document.getElementById('holdIndicator');
    const holdBarFill = document.getElementById('holdBarFill');
    if (holdIndicator) holdIndicator.classList.remove('hidden');

    const duration = 800;
    const step = 30;
    holdProgress = 0;

    holdInterval = setInterval(() => {
        holdProgress += step;
        const pct = Math.min((holdProgress / duration) * 100, 100);
        if (holdBarFill) holdBarFill.style.width = pct + '%';

        if (holdProgress >= duration) {
            clearHoldTimer();
            hasShownVictory = true;
            setTimeout(() => showSuccess(), 200);
        }
    }, step);
}

/**
 * Clear hold-to-win timer
 */
function clearHoldTimer() {
    if (holdInterval) {
        clearInterval(holdInterval);
        holdInterval = null;
    }
    holdTimer = null;
    holdProgress = 0;
    const holdIndicator = document.getElementById('holdIndicator');
    const holdBarFill = document.getElementById('holdBarFill');
    if (holdIndicator) holdIndicator.classList.add('hidden');
    if (holdBarFill) holdBarFill.style.width = '0%';
}

/**
 * Update condition tracker pills
 */
function updateConditionTracker(conditions) {
    const pills = {
        condParity: conditions.parityMet,
        condBig: conditions.bigSatisfactionMet,
        condSmall: conditions.smallViabilityMet
    };
    Object.entries(pills).forEach(([id, met]) => {
        const el = document.getElementById(id);
        if (el) {
            el.className = 'condition-pill ' + (met ? 'met' : 'unmet');
        }
    });
}

/**
 * Update parity meter
 */
function updateParityMeter(score, target, met) {
    const displayScore = Math.min(score, 100);
    document.getElementById('parityScore').textContent = `${displayScore}%`;
    document.getElementById('parityFill').style.width = `${displayScore}%`;

    const indicator = document.getElementById('parityIndicator');
    indicator.className = 'status-indicator ' + (met ? 'status-success' : 'status-fail');
    indicator.textContent = met ? '✓' : '✗';
}

/**
 * Update big market satisfaction meter
 */
function updateBigMarketMeter(score, target, met) {
    const displayScore = Math.min(score, 100);
    document.getElementById('bigMarketScore').textContent = `${displayScore}%`;
    document.getElementById('bigMarketFill').style.width = `${displayScore}%`;

    const indicator = document.getElementById('bigMarketIndicator');
    indicator.className = 'status-indicator ' + (met ? 'status-success' : 'status-fail');
    indicator.textContent = met ? '✓' : '✗';
}

/**
 * Update small market viability meter
 */
function updateSmallMarketMeter(score, target, met) {
    const displayScore = Math.min(score, 100);
    document.getElementById('smallMarketScore').textContent = `${displayScore}%`;
    document.getElementById('smallMarketFill').style.width = `${displayScore}%`;

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

    statusEl.classList.remove('near-solution');

    if (isSandboxMode) {
        statusEl.textContent = '🧪 Sandbox Mode — Explore Freely!';
        statusEl.className = 'overall-status partial';
    } else if (conditions.allMet) {
        statusEl.textContent = '🎉 ALL STAKEHOLDERS APPROVE! Hold steady...';
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

    if (warnings.length > 0 && !isSandboxMode) {
        warningContainer.innerHTML = warnings.map(w => `<div class="warning-item">${w}</div>`).join('');
        warningContainer.style.display = 'block';
    } else {
        warningContainer.style.display = 'none';
    }
}

/**
 * Update team cards — builds DOM once per level, then only patches changed values.
 * This eliminates the full innerHTML rebuild on every slider tick.
 */
function updateTeamCards(results) {
    const container = document.getElementById('teamsGrid');

    // Rebuild the card shells only when team count changes (new level start)
    if (results.length !== _lastTeamCount) {
        container.innerHTML = '';
        results.forEach((team, i) => {
            const card = document.createElement('div');
            card.className = `team-card ${team.market}-market`;
            card.innerHTML = `
                <div class="team-header">
                    <span class="team-name">${team.name}</span>
                    <span class="team-mood" id="tc-mood-${i}">${team.mood}</span>
                </div>
                <div class="market-badge ${team.market}">
                    ${team.market.toUpperCase()} MARKET
                </div>
                <div class="revenue-display">
                    <div class="revenue-label">Final Revenue</div>
                    <div class="revenue-value" id="tc-rev-${i}">$${team.finalRevenue}M</div>
                </div>
                <div class="revenue-change" id="tc-chg-${i}">+$0M from base</div>
                <div class="revenue-breakdown" id="tc-bkd-${i}"></div>
                <div class="satisfaction-bar-container">
                    <div class="satisfaction-bar sat-low" id="tc-sat-${i}" style="width: 0%"></div>
                </div>
                <div class="team-quote" id="tc-qte-${i}">${team.quote}</div>
            `;
            container.appendChild(card);
        });
        _lastTeamCount = results.length;
    }

    // Patch only the dynamic values — no DOM rebuild, no layout thrash
    results.forEach((team, i) => {
        const changeClass = team.change >= 0 ? 'positive' : 'negative';
        const changeSymbol = team.change >= 0 ? '+' : '';
        const satClass = team.satisfaction >= 70 ? 'sat-high' : team.satisfaction >= 50 ? 'sat-mid' : 'sat-low';
        const sharedOut = Math.round(team.baseRevenue * (sharingPercent / 100) * 10) / 10;

        document.getElementById(`tc-mood-${i}`).textContent = team.mood;
        document.getElementById(`tc-rev-${i}`).textContent = `$${team.finalRevenue}M`;

        const chgEl = document.getElementById(`tc-chg-${i}`);
        chgEl.textContent = `${changeSymbol}$${Math.abs(team.change)}M from base`;
        chgEl.className = `revenue-change ${changeClass}`;

        const satEl = document.getElementById(`tc-sat-${i}`);
        satEl.style.width = `${team.satisfaction}%`;
        satEl.className = `satisfaction-bar ${satClass}`;

        document.getElementById(`tc-bkd-${i}`).textContent =
            `Base $${team.baseRevenue}M → Shared -$${sharedOut}M → Rcvd +$${team.redistribution}M${team.luxuryTaxPaid > 0 ? ` → Tax -$${team.luxuryTaxPaid}M` : ''}${team.luxuryTaxReceived > 0 ? ` → +$${team.luxuryTaxReceived}M` : ''}`;

        document.getElementById(`tc-qte-${i}`).textContent = team.quote;
    });
}

/**
 * Render the math breakdown table — skipped when panel is collapsed
 */
function renderMathPanel(results) {
    const panel = document.getElementById('mathPanel');
    if (!panel || !panel.open) return; // skip expensive table render when hidden
    const tbody = document.getElementById('mathTableBody');
    if (!tbody) return;

    const breakdown = getRevenueBreakdown(results);
    tbody.innerHTML = breakdown.map(row => `
        <tr>
            <td>${row.name}</td>
            <td>$${row.base}M</td>
            <td class="negative">${row.shared !== 0 ? '-$' + Math.abs(row.shared).toFixed(1) + 'M' : '—'}</td>
            <td class="positive">+$${row.received.toFixed(1)}M</td>
            <td class="${row.luxTax !== 0 ? 'negative' : ''}">${row.luxTax !== 0 ? '-$' + Math.abs(row.luxTax).toFixed(1) + 'M' : '—'}</td>
            <td class="${row.luxRcvd !== 0 ? 'positive' : ''}">${row.luxRcvd !== 0 ? '+$' + row.luxRcvd.toFixed(1) + 'M' : '—'}</td>
            <td class="final-col">$${row.final}M</td>
        </tr>
    `).join('');
}

/**
 * Show success modal
 */
function showSuccess() {
    const modal = document.getElementById('successModal');
    if (!modal.classList.contains('hidden')) return;

    saveProgress(currentLevel);
    updateProgressOverview();

    const claimCode = currentConfig.claimCode;
    const conditions = checkVictoryConditions(currentResults, currentConfig);

    document.getElementById('successMessage').textContent =
        `You achieved ${conditions.parity}% parity while keeping all stakeholders happy! That's real commissioner work!`;
    document.getElementById('claimCodeText').textContent = claimCode;

    // Show reality fact
    const realityText = document.getElementById('realityText');
    const realityCompare = document.getElementById('realityCompare');
    if (currentConfig.realityFact) {
        realityText.textContent = currentConfig.realityFact;
        realityCompare.style.display = 'block';
    } else {
        realityCompare.style.display = 'none';
    }

    modal.classList.remove('hidden');

    // Launch confetti
    launchConfetti();

    updateLevelCards();
    updateClaimCodes();
}

/**
 * Launch confetti particles
 */
function launchConfetti() {
    const container = document.getElementById('confettiContainer');
    if (!container) return;
    container.innerHTML = '';

    const colors = ['#f39c12', '#e74c3c', '#00b894', '#74b9ff', '#a29bfe', '#ffeaa7', '#fd79a8'];
    const count = 50;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'confetti-particle';
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const duration = 1.5 + Math.random() * 2;
        const delay = Math.random() * 0.8;
        const size = 6 + Math.floor(Math.random() * 8);

        particle.style.cssText = `
            left: ${left}vw;
            background: ${color};
            width: ${size}px;
            height: ${size}px;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        `;

        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), (duration + delay) * 1000 + 200);
    }
}

/**
 * Close success modal
 */
function closeSuccessModal() {
    document.getElementById('successModal').classList.add('hidden');
    backToLevels();
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
    historyStack = [];
    hintLevel = 0;
    document.getElementById('sharingSlider').value = 0;
    document.getElementById('luxurySlider').value = 150;
    initializeLevel(isSandboxMode);
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
    clearRandomEventTimer();
    clearHoldTimer();
    isSandboxMode = false;
    destroyChart();
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('levelSelect').classList.remove('hidden');
    updateLevelCards();
    updateClaimCodes();
    updateProgressOverview();
}

/**
 * Update level cards based on progress
 */
function updateLevelCards() {
    const progress = loadProgress();

    for (let i = 1; i <= 5; i++) {
        const card = document.querySelector(`.level-card[data-level="${i}"]`);
        const completeBadge = document.getElementById(`level${i}Complete`);

        if (i === 1 || progress.completedLevels.includes(i - 1)) {
            card.classList.remove('locked');
        } else {
            card.classList.add('locked');
        }

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

    for (let i = 1; i <= 5; i++) {
        const codeCard = document.getElementById(`code${i}`);
        const codeValue = codeCard.querySelector('.code-value');

        if (progress.completedLevels.includes(i)) {
            codeValue.textContent = ACHIEVEMENT_CODES[`level${i}`];
            codeValue.classList.remove('locked');
            codeCard.classList.add('unlocked');
        }
    }

    if (progress.completedLevels.length >= 3) {
        const code3Card = document.getElementById('code3bonus');
        const code3Value = code3Card.querySelector('.code-value');
        code3Value.textContent = ACHIEVEMENT_CODES.bonus3Levels;
        code3Value.classList.remove('locked');
        code3Card.classList.add('unlocked');
    }

    if (progress.completedLevels.length >= 5) {
        const code5Card = document.getElementById('code5bonus');
        const code5Value = code5Card.querySelector('.code-value');
        code5Value.textContent = ACHIEVEMENT_CODES.bonus5Levels;
        code5Value.classList.remove('locked');
        code5Card.classList.add('unlocked');
    }
}

/**
 * Show a toast notification
 */
function showToast(message, type = '') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}

/* ============================================================
 * RANDOM EVENTS SYSTEM (Level 4-5)
 * ============================================================ */

function startRandomEventTimer() {
    clearRandomEventTimer();
    // Fire a random event every 45 seconds
    randomEventTimer = setTimeout(() => {
        if (!hasShownVictory && !randomEventActive) {
            triggerRandomEvent();
        }
    }, 45000);
}

function clearRandomEventTimer() {
    if (randomEventTimer) {
        clearTimeout(randomEventTimer);
        randomEventTimer = null;
    }
}

function triggerRandomEvent() {
    if (randomEventActive) return;
    randomEventActive = true;

    const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];

    // Find a team matching the market type
    const matchingTeams = currentConfig.teams.filter(t => t.market === event.teamKey);
    if (matchingTeams.length === 0) {
        randomEventActive = false;
        startRandomEventTimer();
        return;
    }
    const targetTeam = matchingTeams[Math.floor(Math.random() * matchingTeams.length)];

    // Show event modal
    document.getElementById('eventIcon').textContent = event.icon;
    document.getElementById('eventText').textContent = event.text.replace(
        /a (big|small|mid) market team/i, targetTeam.name
    );

    const impactEl = document.getElementById('eventImpact');
    impactEl.textContent = event.impactLabel.replace(
        /a (big|small|mid) market team/i, targetTeam.name
    );
    impactEl.className = 'event-impact ' +
        (event.revenueChange > 0 ? 'positive-impact' : 'negative-impact');

    // Reset event bar animation
    const barFill = document.getElementById('eventBarFill');
    if (barFill) {
        barFill.style.animation = 'none';
        barFill.offsetHeight; // reflow
        barFill.style.animation = '';
    }

    const modal = document.getElementById('randomEventModal');
    modal.classList.remove('hidden');

    // Apply the delta and recalculate after 3.5s
    setTimeout(() => {
        modal.classList.add('hidden');
        eventRevenueDelta = { teamName: targetTeam.name, delta: event.revenueChange };
        updateCalculations();
        showToast(`📢 ${targetTeam.name} revenue changed by ${event.revenueChange > 0 ? '+' : ''}$${event.revenueChange}M!`, event.revenueChange > 0 ? 'success' : 'error');

        // Revert after 30 seconds
        setTimeout(() => {
            eventRevenueDelta = { teamName: null, delta: 0 };
            updateCalculations();
            randomEventActive = false;
            // Schedule next event
            if (!hasShownVictory) startRandomEventTimer();
        }, 30000);
    }, 3800);
}

/* ============================================================
 * TUTORIAL SYSTEM
 * ============================================================ */
const tutorialSteps = [
    "Welcome, Commissioner! In the NBA, you're responsible for making sure the league stays competitive AND profitable.",
    "Here's the challenge: Big market teams (like LA Lakers) make WAY more money than small market teams (like Memphis). Their local TV deals alone can be worth more than a small team's entire budget!",
    "But here's the catch: if small markets can't compete, fans lose interest. As the lesson says: 'Competition is the product. Without it, leagues collapse.'",
    "Your tool is REVENUE SHARING — you take some money from all teams and redistribute it. BUT... big market owners will complain: 'We earned this, why subsidize our competition?'",
    "You need to balance THREE things: 1) League Parity (fairness between teams), 2) Big Market Satisfaction (they need to approve!), and 3) Small Market Survival (they need enough to compete).",
    "Watch the gold markers on each bar — that's your goal line! Get the bars past the marker and the pill at the top turns green. Hit all three green and you win!"
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
