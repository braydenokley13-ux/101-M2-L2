/**
 * NBA Parity Engine - Revenue Sharing Calculator
 * Based on real NBA economics and revenue sharing models
 */

// NBA Team Data - Based on real market sizes and revenue patterns
const NBA_TEAMS = {
    level1: [
        { name: 'LA Lakers', city: 'Los Angeles', market: 'big', baseRevenue: 400, marketSize: 15, icon: '🏀' },
        { name: 'Memphis Grizzlies', city: 'Memphis', market: 'small', baseRevenue: 220, marketSize: 5, icon: '🐻' },
        { name: 'Phoenix Suns', city: 'Phoenix', market: 'mid', baseRevenue: 310, marketSize: 10, icon: '☀️' }
    ],
    level2: [
        { name: 'NY Knicks', city: 'New York', market: 'big', baseRevenue: 450, marketSize: 18, icon: '🗽' },
        { name: 'Miami Heat', city: 'Miami', market: 'mid', baseRevenue: 340, marketSize: 11, icon: '🔥' },
        { name: 'Sacramento Kings', city: 'Sacramento', market: 'small', baseRevenue: 210, marketSize: 4, icon: '👑' },
        { name: 'Milwaukee Bucks', city: 'Milwaukee', market: 'small', baseRevenue: 240, marketSize: 6, icon: '🦌' }
    ],
    level3: [
        { name: 'Golden State Warriors', city: 'San Francisco', market: 'big', baseRevenue: 480, marketSize: 20, icon: '🌉' },
        { name: 'Chicago Bulls', city: 'Chicago', market: 'big', baseRevenue: 420, marketSize: 16, icon: '🐂' },
        { name: 'Portland Trail Blazers', city: 'Portland', market: 'mid', baseRevenue: 290, marketSize: 9, icon: '🌲' },
        { name: 'Oklahoma City Thunder', city: 'OKC', market: 'small', baseRevenue: 200, marketSize: 3, icon: '⚡' },
        { name: 'New Orleans Pelicans', city: 'New Orleans', market: 'small', baseRevenue: 215, marketSize: 4, icon: '🦅' }
    ],
    level4: [
        { name: 'Boston Celtics', city: 'Boston', market: 'big', baseRevenue: 440, marketSize: 17, icon: '🍀' },
        { name: 'Dallas Mavericks', city: 'Dallas', market: 'big', baseRevenue: 410, marketSize: 15, icon: '🐴' },
        { name: 'Atlanta Hawks', city: 'Atlanta', market: 'mid', baseRevenue: 320, marketSize: 10, icon: '🦅' },
        { name: 'Denver Nuggets', city: 'Denver', market: 'mid', baseRevenue: 300, marketSize: 8, icon: '⛰️' },
        { name: 'Utah Jazz', city: 'Salt Lake City', market: 'small', baseRevenue: 195, marketSize: 3, icon: '🎵' },
        { name: 'Indiana Pacers', city: 'Indianapolis', market: 'small', baseRevenue: 225, marketSize: 5, icon: '🏁' }
    ],
    level5: [
        { name: 'LA Clippers', city: 'Los Angeles', market: 'big', baseRevenue: 430, marketSize: 15, icon: '🚢' },
        { name: 'Brooklyn Nets', city: 'New York', market: 'big', baseRevenue: 445, marketSize: 18, icon: '🌃' },
        { name: 'Toronto Raptors', city: 'Toronto', market: 'big', baseRevenue: 390, marketSize: 14, icon: '🦖' },
        { name: 'Philadelphia 76ers', city: 'Philadelphia', market: 'mid', baseRevenue: 350, marketSize: 12, icon: '🔔' },
        { name: 'Washington Wizards', city: 'Washington DC', market: 'mid', baseRevenue: 315, marketSize: 9, icon: '🪄' },
        { name: 'Charlotte Hornets', city: 'Charlotte', market: 'small', baseRevenue: 190, marketSize: 3, icon: '🐝' },
        { name: 'San Antonio Spurs', city: 'San Antonio', market: 'small', baseRevenue: 235, marketSize: 6, icon: '⚔️' },
        { name: 'Minnesota Timberwolves', city: 'Minneapolis', market: 'small', baseRevenue: 205, marketSize: 4, icon: '🐺' }
    ]
};

// Level Configuration
const LEVELS = {
    1: {
        name: 'Rookie League',
        teams: NBA_TEAMS.level1,
        targetFairness: 70,
        description: 'Learn the basics of revenue sharing',
        allowDistributionChoice: false,
        defaultDistribution: 'equal',
        luxuryTaxEnabled: false,
        claimCode: 'NBA-ROOKIE-2025'
    },
    2: {
        name: 'All-Star Challenge',
        teams: NBA_TEAMS.level2,
        targetFairness: 75,
        description: 'Balance big and small market teams',
        allowDistributionChoice: true,
        defaultDistribution: 'equal',
        luxuryTaxEnabled: false,
        claimCode: 'NBA-ALLSTAR-2025'
    },
    3: {
        name: 'Conference Finals',
        teams: NBA_TEAMS.level3,
        targetFairness: 80,
        description: 'Navigate luxury tax challenges',
        allowDistributionChoice: true,
        defaultDistribution: 'equal',
        luxuryTaxEnabled: true,
        claimCode: 'NBA-CONFERENCE-2025'
    },
    4: {
        name: 'NBA Finals',
        teams: NBA_TEAMS.level4,
        targetFairness: 85,
        description: 'Master complex revenue rules',
        allowDistributionChoice: true,
        defaultDistribution: 'weighted',
        luxuryTaxEnabled: true,
        claimCode: 'NBA-FINALS-2025'
    },
    5: {
        name: 'Commissioner Legend',
        teams: NBA_TEAMS.level5,
        targetFairness: 88,
        description: 'Ultimate balancing challenge',
        allowDistributionChoice: true,
        defaultDistribution: 'weighted',
        luxuryTaxEnabled: true,
        claimCode: 'NBA-LEGEND-2025'
    }
};

// Special Achievement Codes
const ACHIEVEMENT_CODES = {
    level1: 'NBA-ROOKIE-2025',
    level2: 'NBA-ALLSTAR-2025',
    level3: 'NBA-CONFERENCE-2025',
    bonus3Levels: 'NBA-RISING-STAR-2025',
    level4: 'NBA-FINALS-2025',
    level5: 'NBA-LEGEND-2025',
    bonus5Levels: 'NBA-COMMISSIONER-MASTER-2025'
};

/**
 * Calculate revenue sharing based on NBA-realistic model
 */
function calculateRevenueSharing(teams, sharingPercent, distributionType, luxuryTaxThreshold = 150) {
    const results = [];
    const totalBaseRevenue = teams.reduce((sum, team) => sum + team.baseRevenue, 0);

    // Step 1: Calculate shared pool (money taken from all teams)
    const sharedPool = teams.reduce((sum, team) => {
        return sum + (team.baseRevenue * (sharingPercent / 100));
    }, 0);

    // Step 2: Calculate distribution to each team
    let totalMarketSize = 0;
    if (distributionType === 'weighted') {
        totalMarketSize = teams.reduce((sum, team) => sum + team.marketSize, 0);
    }

    teams.forEach(team => {
        // Revenue after taking out sharing percentage
        const afterSharing = team.baseRevenue * (1 - sharingPercent / 100);

        // Calculate redistribution amount
        let redistributionAmount = 0;
        if (distributionType === 'equal') {
            // Equal split among all teams
            redistributionAmount = sharedPool / teams.length;
        } else if (distributionType === 'weighted') {
            // Weighted by market size (smaller markets get more)
            // Inverse weighting - smaller markets get bigger share
            const inverseWeight = (totalMarketSize - team.marketSize + 1);
            const totalInverseWeight = teams.reduce((sum, t) => sum + (totalMarketSize - t.marketSize + 1), 0);
            redistributionAmount = sharedPool * (inverseWeight / totalInverseWeight);
        }

        // Final revenue
        let finalRevenue = afterSharing + redistributionAmount;

        // Apply luxury tax if enabled
        let luxuryTaxPaid = 0;
        if (luxuryTaxThreshold > 0 && finalRevenue > luxuryTaxThreshold) {
            luxuryTaxPaid = (finalRevenue - luxuryTaxThreshold) * 0.5; // 50% tax on overage
            finalRevenue -= luxuryTaxPaid;
        }

        results.push({
            ...team,
            afterSharing: afterSharing,
            redistribution: redistributionAmount,
            luxuryTax: luxuryTaxPaid,
            finalRevenue: Math.round(finalRevenue * 10) / 10,
            change: Math.round((finalRevenue - team.baseRevenue) * 10) / 10
        });
    });

    return results;
}

/**
 * Calculate fairness score (ratio of smallest to largest)
 */
function calculateFairnessScore(results) {
    const revenues = results.map(r => r.finalRevenue);
    const min = Math.min(...revenues);
    const max = Math.max(...revenues);

    if (max === 0) return 0;

    return Math.round((min / max) * 1000) / 10; // One decimal place
}

/**
 * Get coaching tips based on current state
 */
function getCoachingTip(fairnessScore, targetFairness, sharingPercent, distributionType) {
    const gap = targetFairness - fairnessScore;

    if (fairnessScore >= targetFairness) {
        return "🎉 Perfect! You've achieved great league balance!";
    }

    if (gap > 20) {
        return "📊 The revenue gap is too big! Try increasing revenue sharing to help smaller teams.";
    }

    if (gap > 10) {
        if (sharingPercent < 30) {
            return "💡 Small market teams need more help. Increase the sharing percentage!";
        } else {
            return "🔄 Try switching to Equal Split distribution to spread money more evenly.";
        }
    }

    if (gap > 5) {
        return "👍 You're getting close! Make small adjustments to fine-tune the balance.";
    }

    if (gap > 0) {
        return "🎯 Almost there! Just a tiny bit more sharing should do it!";
    }

    return "⚡ Adjust your settings to find the perfect balance!";
}

/**
 * Get explanation for distribution type
 */
function getDistributionExplanation(distributionType) {
    if (distributionType === 'equal') {
        return "Money is split equally among all teams - everyone gets the same amount.";
    } else if (distributionType === 'weighted') {
        return "Smaller market teams get more money to help them compete with big markets.";
    }
    return "";
}

/**
 * Format currency for display
 */
function formatCurrency(amount) {
    if (amount >= 1000) {
        return `$${(amount / 1000).toFixed(1)}B`;
    }
    return `$${amount}M`;
}

/**
 * Calculate total league revenue
 */
function calculateTotalRevenue(results) {
    return results.reduce((sum, team) => sum + team.finalRevenue, 0);
}

/**
 * Calculate revenue gap
 */
function calculateRevenueGap(results) {
    const revenues = results.map(r => r.finalRevenue);
    return Math.max(...revenues) - Math.min(...revenues);
}
