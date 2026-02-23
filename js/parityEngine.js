/**
 * NBA Parity Engine - Revenue Sharing Calculator
 * OVERHAULED: Now includes stakeholder satisfaction and trade-off mechanics
 * Based on the lesson: "Small Markets, Big Money"
 *
 * Key Concepts from the lesson:
 * - "When you share more money, big-market teams say: 'Wait - we earned this, why do we subsidize our competition?'"
 * - "When you share less, small markets struggle to keep up"
 * - "Competition is the product. Without it, leagues collapse."
 */

// NBA Team Data - Based on real market sizes and revenue patterns
const NBA_TEAMS = {
    level1: [
        { name: 'LA Lakers', city: 'Los Angeles', market: 'big', baseRevenue: 400, marketSize: 15, icon: '🏀', minViable: 220 },
        { name: 'Memphis Grizzlies', city: 'Memphis', market: 'small', baseRevenue: 180, marketSize: 5, icon: '🐻', minViable: 200 },
        { name: 'Phoenix Suns', city: 'Phoenix', market: 'mid', baseRevenue: 280, marketSize: 10, icon: '☀️', minViable: 210 }
    ],
    level2: [
        { name: 'NY Knicks', city: 'New York', market: 'big', baseRevenue: 480, marketSize: 18, icon: '🗽', minViable: 250 },
        { name: 'Miami Heat', city: 'Miami', market: 'mid', baseRevenue: 320, marketSize: 11, icon: '🔥', minViable: 220 },
        { name: 'Sacramento Kings', city: 'Sacramento', market: 'small', baseRevenue: 160, marketSize: 4, icon: '👑', minViable: 190 },
        { name: 'Milwaukee Bucks', city: 'Milwaukee', market: 'small', baseRevenue: 190, marketSize: 6, icon: '🦌', minViable: 200 }
    ],
    level3: [
        { name: 'Golden State Warriors', city: 'San Francisco', market: 'big', baseRevenue: 520, marketSize: 20, icon: '🌉', minViable: 280 },
        { name: 'Chicago Bulls', city: 'Chicago', market: 'big', baseRevenue: 440, marketSize: 16, icon: '🐂', minViable: 260 },
        { name: 'Portland Trail Blazers', city: 'Portland', market: 'mid', baseRevenue: 260, marketSize: 9, icon: '🌲', minViable: 210 },
        { name: 'Oklahoma City Thunder', city: 'OKC', market: 'small', baseRevenue: 150, marketSize: 3, icon: '⚡', minViable: 180 },
        { name: 'New Orleans Pelicans', city: 'New Orleans', market: 'small', baseRevenue: 165, marketSize: 4, icon: '🦅', minViable: 185 }
    ],
    level4: [
        { name: 'Boston Celtics', city: 'Boston', market: 'big', baseRevenue: 460, marketSize: 17, icon: '🍀', minViable: 270 },
        { name: 'Dallas Mavericks', city: 'Dallas', market: 'big', baseRevenue: 430, marketSize: 15, icon: '🐴', minViable: 260 },
        { name: 'Atlanta Hawks', city: 'Atlanta', market: 'mid', baseRevenue: 290, marketSize: 10, icon: '🦅', minViable: 220 },
        { name: 'Denver Nuggets', city: 'Denver', market: 'mid', baseRevenue: 270, marketSize: 8, icon: '⛰️', minViable: 210 },
        { name: 'Utah Jazz', city: 'Salt Lake City', market: 'small', baseRevenue: 145, marketSize: 3, icon: '🎵', minViable: 175 },
        { name: 'Indiana Pacers', city: 'Indianapolis', market: 'small', baseRevenue: 175, marketSize: 5, icon: '🏁', minViable: 190 }
    ],
    level5: [
        { name: 'LA Clippers', city: 'Los Angeles', market: 'big', baseRevenue: 450, marketSize: 15, icon: '🚢', minViable: 270 },
        { name: 'Brooklyn Nets', city: 'New York', market: 'big', baseRevenue: 475, marketSize: 18, icon: '🌃', minViable: 280 },
        { name: 'Toronto Raptors', city: 'Toronto', market: 'big', baseRevenue: 410, marketSize: 14, icon: '🦖', minViable: 260 },
        { name: 'Philadelphia 76ers', city: 'Philadelphia', market: 'mid', baseRevenue: 340, marketSize: 12, icon: '🔔', minViable: 230 },
        { name: 'Washington Wizards', city: 'Washington DC', market: 'mid', baseRevenue: 295, marketSize: 9, icon: '🪄', minViable: 215 },
        { name: 'Charlotte Hornets', city: 'Charlotte', market: 'small', baseRevenue: 140, marketSize: 3, icon: '🐝', minViable: 170 },
        { name: 'San Antonio Spurs', city: 'San Antonio', market: 'small', baseRevenue: 185, marketSize: 6, icon: '⚔️', minViable: 195 },
        { name: 'Minnesota Timberwolves', city: 'Minneapolis', market: 'small', baseRevenue: 155, marketSize: 4, icon: '🐺', minViable: 180 }
    ]
};

// Level Configuration - Now with stakeholder thresholds
const LEVELS = {
    1: {
        name: 'Rookie League',
        teams: NBA_TEAMS.level1,
        targetParity: 65,
        minBigMarketSatisfaction: 50,
        minSmallMarketViability: 60,
        description: 'Learn the basics - balance three competing interests',
        allowDistributionChoice: false,
        defaultDistribution: 'equal',
        luxuryTaxEnabled: false,
        claimCode: 'NBA-ROOKIE-2025',
        difficulty: 'Easy',
        hint: 'Big markets want to keep their money, but small markets need help to survive!',
        hints: [
            'Think about what small market teams need to survive. They need enough revenue to afford good players.',
            'Try setting revenue sharing somewhere between 20% and 40%. That range tends to work well for small teams without making big teams too unhappy.',
            'Setting revenue sharing to about 30% with equal distribution should satisfy all three conditions!'
        ],
        realityFact: 'In the real NBA, teams share about 50% of Basketball Related Income (BRI). Small market teams receive equal shares from the national TV deal (~$150M each), which helps level the playing field.'
    },
    2: {
        name: 'All-Star Challenge',
        teams: NBA_TEAMS.level2,
        targetParity: 68,
        minBigMarketSatisfaction: 55,
        minSmallMarketViability: 65,
        description: 'Big market owners are getting vocal about fairness',
        allowDistributionChoice: true,
        defaultDistribution: 'equal',
        luxuryTaxEnabled: false,
        claimCode: 'NBA-ALLSTAR-2025',
        difficulty: 'Medium',
        hint: 'Try different distribution methods - equal vs weighted changes who benefits!',
        hints: [
            'You now have two distribution methods — "Equal" splits evenly, "Market Weighted" gives small markets a bigger share.',
            'Try "Market Weighted" distribution. It lets you share more without making big markets as unhappy, since smaller teams get proportionally more.',
            'With "Market Weighted" distribution and about 35-40% sharing, you should hit all three targets!'
        ],
        realityFact: 'The real NBA uses a hybrid system: national TV revenue is split equally, while teams keep local TV and gate revenues minus a sharing contribution. Total sharing varies by market — big markets contribute more.'
    },
    3: {
        name: 'Conference Finals',
        teams: NBA_TEAMS.level3,
        targetParity: 72,
        minBigMarketSatisfaction: 52,
        minSmallMarketViability: 68,
        description: 'Luxury tax adds another tool - use it wisely',
        allowDistributionChoice: true,
        defaultDistribution: 'equal',
        luxuryTaxEnabled: true,
        claimCode: 'NBA-CONFERENCE-2025',
        difficulty: 'Hard',
        hint: 'Luxury tax takes from the richest teams and redistributes to everyone else.',
        hints: [
            'The luxury tax is a powerful tool — set it LOW (around $150M) to take a lot from Golden State and Chicago and redistribute to small markets.',
            'Combine a moderate sharing rate (~30%) with a strict luxury tax threshold (~$150-170M). This helps small markets without punishing big markets too much on sharing.',
            'Try: 30% revenue sharing, Market Weighted, luxury tax at $150M. That combination should hit all three targets!'
        ],
        realityFact: 'The NBA\'s luxury tax threshold was ~$165M in 2023-24. Teams over it pay between $1.50 and $4+ for every $1 over the line, scaled by how far over they are. Tax revenue goes to non-taxpaying teams.'
    },
    4: {
        name: 'NBA Finals',
        teams: NBA_TEAMS.level4,
        targetParity: 75,
        minBigMarketSatisfaction: 48,
        minSmallMarketViability: 72,
        description: 'The sweet spot is narrow - precision matters',
        allowDistributionChoice: true,
        defaultDistribution: 'weighted',
        luxuryTaxEnabled: true,
        claimCode: 'NBA-FINALS-2025',
        difficulty: 'Very Hard',
        hint: 'You need to balance all three metrics carefully. Small adjustments matter!',
        hints: [
            'With 6 teams and tighter targets, every slider position matters more. Start by setting Market Weighted distribution.',
            'The sweet spot is around 35-45% sharing with Market Weighted distribution. Add a luxury tax around $130-160M to close the parity gap.',
            'Try: 40% revenue sharing, Market Weighted, luxury tax at $140M. Fine-tune by ±5% from there until all three indicators are green!'
        ],
        realityFact: 'The NBA\'s revenue gap between the top team (Golden State: $765M in 2023) and bottom team (OKC: $228M) is enormous — nearly 3.4x. Without revenue sharing, small markets simply couldn\'t compete for top talent.'
    },
    5: {
        name: 'Commissioner Legend',
        teams: NBA_TEAMS.level5,
        targetParity: 78,
        minBigMarketSatisfaction: 45,
        minSmallMarketViability: 75,
        description: 'Ultimate challenge - every team has an opinion',
        allowDistributionChoice: true,
        defaultDistribution: 'weighted',
        luxuryTaxEnabled: true,
        claimCode: 'NBA-LEGEND-2025',
        difficulty: 'Expert',
        hint: 'Think like a real commissioner: competition is the product, but you need all owners to agree!',
        hints: [
            'With 8 teams including 3 big markets, you need Market Weighted distribution — equal sharing will not satisfy small markets at the target parity level.',
            'High parity (78%) requires generous sharing (~45-55%) and an aggressive luxury tax. The challenge is keeping big markets above 45% satisfaction.',
            'Try: 50% sharing, Market Weighted, luxury tax at $120M. At this level, tiny adjustments of 1-2% can push you over the line — be precise!'
        ],
        realityFact: 'The real NBA Commissioner earns ~$8M/year managing these exact trade-offs across 30 teams. Commissioner Adam Silver negotiated a new CBA in 2023 that increased sharing while adding a second apron rule to limit big spenders.'
    }
};

// Random Events for Level 4-5
const RANDOM_EVENTS = [
    {
        icon: '⭐',
        text: 'Breaking News: A superstar free agent just signed a mega deal! His team\'s merchandise sales explode.',
        teamKey: 'big',
        revenueChange: +60,
        impactLabel: '+$60M to a big market team'
    },
    {
        icon: '🏟️',
        text: 'Breaking News: A small market team just opened a brand-new arena! Local revenue surges.',
        teamKey: 'small',
        revenueChange: +40,
        impactLabel: '+$40M to a small market team'
    },
    {
        icon: '📺',
        text: 'Breaking News: A new regional TV deal collapses! One team loses a major revenue source.',
        teamKey: 'mid',
        revenueChange: -30,
        impactLabel: '-$30M to a mid market team'
    },
    {
        icon: '🌍',
        text: 'Breaking News: International expansion! A big market team scores a massive global streaming deal.',
        teamKey: 'big',
        revenueChange: +80,
        impactLabel: '+$80M to a big market team'
    },
    {
        icon: '🏥',
        text: 'Breaking News: A small market\'s star player gets injured for the season. Ticket sales plummet.',
        teamKey: 'small',
        revenueChange: -25,
        impactLabel: '-$25M to a small market team'
    },
    {
        icon: '🎟️',
        text: 'Breaking News: A small market team makes a surprise playoff run! Attendance and revenue spike.',
        teamKey: 'small',
        revenueChange: +35,
        impactLabel: '+$35M to a small market team'
    }
];

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
 * Now includes satisfaction metrics for each team
 */
function calculateRevenueSharing(teams, sharingPercent, distributionType, luxuryTaxThreshold = 0) {
    const results = [];
    const totalBaseRevenue = teams.reduce((sum, team) => sum + team.baseRevenue, 0);

    // Step 1: Calculate shared pool (money taken from all teams)
    const sharedPool = teams.reduce((sum, team) => {
        return sum + (team.baseRevenue * (sharingPercent / 100));
    }, 0);

    // Step 2: Calculate luxury tax pool (if enabled)
    let luxuryTaxPool = 0;
    if (luxuryTaxThreshold > 0) {
        teams.forEach(team => {
            if (team.baseRevenue > luxuryTaxThreshold) {
                // Teams pay 40% of revenue over threshold into luxury tax pool
                luxuryTaxPool += (team.baseRevenue - luxuryTaxThreshold) * 0.4;
            }
        });
    }

    // Step 3: Calculate total market size for weighted distribution
    let totalMarketSize = 0;
    if (distributionType === 'weighted') {
        totalMarketSize = teams.reduce((sum, team) => sum + team.marketSize, 0);
    }

    // Step 4: Count teams below luxury threshold (for luxury tax distribution)
    const teamsBelow = luxuryTaxThreshold > 0 ?
        teams.filter(t => t.baseRevenue <= luxuryTaxThreshold).length : 0;

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

        // Calculate luxury tax effects
        let luxuryTaxPaid = 0;
        let luxuryTaxReceived = 0;
        if (luxuryTaxThreshold > 0) {
            if (team.baseRevenue > luxuryTaxThreshold) {
                // Pay luxury tax
                luxuryTaxPaid = (team.baseRevenue - luxuryTaxThreshold) * 0.4;
            } else if (teamsBelow > 0) {
                // Receive luxury tax distribution (only teams below threshold)
                luxuryTaxReceived = luxuryTaxPool / teamsBelow;
            }
        }

        // Final revenue calculation
        let finalRevenue = afterSharing + redistributionAmount - luxuryTaxPaid + luxuryTaxReceived;
        finalRevenue = Math.round(finalRevenue * 10) / 10;

        // Calculate satisfaction metrics
        const satisfaction = calculateTeamSatisfaction(team, finalRevenue, sharingPercent);

        results.push({
            ...team,
            afterSharing: Math.round(afterSharing * 10) / 10,
            redistribution: Math.round(redistributionAmount * 10) / 10,
            luxuryTaxPaid: Math.round(luxuryTaxPaid * 10) / 10,
            luxuryTaxReceived: Math.round(luxuryTaxReceived * 10) / 10,
            finalRevenue: finalRevenue,
            change: Math.round((finalRevenue - team.baseRevenue) * 10) / 10,
            satisfaction: satisfaction,
            mood: getMood(satisfaction, team.market),
            quote: getTeamQuote(team.market, satisfaction, finalRevenue, team.minViable)
        });
    });

    return results;
}

/**
 * Calculate individual team satisfaction
 * Big markets care about keeping their earnings
 * Small markets care about having enough to compete
 */
function calculateTeamSatisfaction(team, finalRevenue, sharingPercent) {
    if (team.market === 'big') {
        // Big markets: satisfaction based on how much they kept vs gave away
        // They start unhappy if sharing is high
        const retentionRate = (finalRevenue / team.baseRevenue) * 100;
        // Base satisfaction on retention, but cap the unhappiness
        let satisfaction = retentionRate;

        // Additional penalty for high sharing percentages (they philosophically object)
        if (sharingPercent > 30) {
            satisfaction -= (sharingPercent - 30) * 0.5;
        }
        if (sharingPercent > 50) {
            satisfaction -= (sharingPercent - 50) * 0.3;
        }

        return Math.max(0, Math.min(100, Math.round(satisfaction)));
    } else if (team.market === 'small') {
        // Small markets: satisfaction based on reaching viability
        // They need enough revenue to field a competitive team
        const viabilityRate = (finalRevenue / team.minViable) * 100;

        // Scale satisfaction: below minViable is bad, above is good
        let satisfaction = viabilityRate;

        // Bonus for exceeding minimum significantly
        if (finalRevenue > team.minViable * 1.1) {
            satisfaction += 10;
        }

        return Math.max(0, Math.min(100, Math.round(satisfaction)));
    } else {
        // Mid markets: balanced view
        const retentionRate = (finalRevenue / team.baseRevenue) * 100;
        const viabilityRate = (finalRevenue / team.minViable) * 100;
        return Math.max(0, Math.min(100, Math.round((retentionRate + viabilityRate) / 2)));
    }
}

/**
 * Get mood emoji based on satisfaction
 */
function getMood(satisfaction, market) {
    if (satisfaction >= 90) return '😄';
    if (satisfaction >= 75) return '🙂';
    if (satisfaction >= 60) return '😐';
    if (satisfaction >= 45) return '😕';
    if (satisfaction >= 30) return '😠';
    return '🤬';
}

/**
 * Get team quote based on their situation
 */
function getTeamQuote(market, satisfaction, finalRevenue, minViable) {
    if (market === 'big') {
        if (satisfaction >= 85) {
            return '"This deal works for us. We keep what we earned."';
        } else if (satisfaction >= 70) {
            return '"We can live with this, but we\'re not thrilled."';
        } else if (satisfaction >= 55) {
            return '"Why should we subsidize our competition?"';
        } else if (satisfaction >= 40) {
            return '"This is getting excessive. We earned this revenue!"';
        } else {
            return '"We\'ll vote NO on this proposal!"';
        }
    } else if (market === 'small') {
        if (finalRevenue >= minViable * 1.15) {
            return '"We can finally compete with the big boys!"';
        } else if (finalRevenue >= minViable) {
            return '"This gives us a fighting chance."';
        } else if (finalRevenue >= minViable * 0.9) {
            return '"We\'re close, but still struggling..."';
        } else if (finalRevenue >= minViable * 0.8) {
            return '"How can we compete with these resources?"';
        } else {
            return '"We can\'t survive like this!"';
        }
    } else {
        if (satisfaction >= 75) {
            return '"Seems like a fair compromise."';
        } else if (satisfaction >= 55) {
            return '"We see both sides of this."';
        } else {
            return '"Something needs to change."';
        }
    }
}

/**
 * Calculate overall parity score (ratio of smallest to largest revenue)
 */
function calculateParityScore(results) {
    const revenues = results.map(r => r.finalRevenue);
    const min = Math.min(...revenues);
    const max = Math.max(...revenues);

    if (max === 0) return 0;

    return Math.round((min / max) * 1000) / 10;
}

/**
 * Calculate big market satisfaction (average of all big market teams)
 */
function calculateBigMarketSatisfaction(results) {
    const bigMarkets = results.filter(r => r.market === 'big');
    if (bigMarkets.length === 0) return 100;

    const avgSatisfaction = bigMarkets.reduce((sum, r) => sum + r.satisfaction, 0) / bigMarkets.length;
    return Math.round(avgSatisfaction);
}

/**
 * Calculate small market viability (based on meeting minimum viable revenue)
 */
function calculateSmallMarketViability(results) {
    const smallMarkets = results.filter(r => r.market === 'small');
    if (smallMarkets.length === 0) return 100;

    // Calculate what percentage of minimum viable they're achieving on average
    const avgViability = smallMarkets.reduce((sum, r) => {
        const viability = (r.finalRevenue / r.minViable) * 100;
        return sum + Math.min(viability, 120); // Cap at 120% to prevent gaming
    }, 0) / smallMarkets.length;

    return Math.round(avgViability);
}

/**
 * Check if level victory conditions are met
 */
function checkVictoryConditions(results, levelConfig) {
    const parity = calculateParityScore(results);
    const bigSatisfaction = calculateBigMarketSatisfaction(results);
    const smallViability = calculateSmallMarketViability(results);

    return {
        parity: parity,
        parityMet: parity >= levelConfig.targetParity,
        bigSatisfaction: bigSatisfaction,
        bigSatisfactionMet: bigSatisfaction >= levelConfig.minBigMarketSatisfaction,
        smallViability: smallViability,
        smallViabilityMet: smallViability >= levelConfig.minSmallMarketViability,
        allMet: parity >= levelConfig.targetParity &&
                bigSatisfaction >= levelConfig.minBigMarketSatisfaction &&
                smallViability >= levelConfig.minSmallMarketViability
    };
}

/**
 * Get coaching tips based on current state - now considers all metrics
 */
function getCoachingTip(results, levelConfig, sharingPercent, distributionType) {
    const conditions = checkVictoryConditions(results, levelConfig);

    // Victory!
    if (conditions.allMet) {
        return "🎉 Perfect balance achieved! All stakeholders approve this revenue sharing plan!";
    }

    // Check which conditions are failing
    const failures = [];
    if (!conditions.parityMet) failures.push('parity');
    if (!conditions.bigSatisfactionMet) failures.push('big');
    if (!conditions.smallViabilityMet) failures.push('small');

    // Multiple failures
    if (failures.length >= 3) {
        return "📊 All three metrics need work. Start by adjusting revenue sharing to help small markets, then fine-tune.";
    }

    // Two failures
    if (failures.length === 2) {
        if (failures.includes('parity') && failures.includes('small')) {
            return "💡 Small markets need more help! Increase revenue sharing or try weighted distribution.";
        }
        if (failures.includes('parity') && failures.includes('big')) {
            return "⚖️ Tricky! You need more parity but big markets are unhappy. Try weighted distribution - it helps small markets without taking as much from big ones.";
        }
        if (failures.includes('big') && failures.includes('small')) {
            return "🎯 Mid-range sharing might work better. You're at the extremes!";
        }
    }

    // Single failure - give specific advice
    if (!conditions.parityMet) {
        const gap = levelConfig.targetParity - conditions.parity;
        if (gap > 15) {
            return "📈 The revenue gap is still too big. Small markets need more support to compete.";
        } else if (gap > 5) {
            return "👍 Getting closer! Small adjustments to sharing or distribution could close the gap.";
        } else {
            return "🎯 Almost there on parity! Just a bit more sharing should do it.";
        }
    }

    if (!conditions.bigSatisfactionMet) {
        const gap = levelConfig.minBigMarketSatisfaction - conditions.bigSatisfaction;
        if (gap > 15) {
            return "😠 Big market owners are very unhappy! They say: 'We earned this money, why share so much?' Try reducing sharing.";
        } else if (gap > 5) {
            return "😕 Big markets are grumbling. Remember: they need to approve any deal. Consider weighted distribution.";
        } else {
            return "🤝 Big markets are almost on board. Small reduction in sharing might seal the deal.";
        }
    }

    if (!conditions.smallViabilityMet) {
        const gap = levelConfig.minSmallMarketViability - conditions.smallViability;
        if (gap > 15) {
            return "😰 Small markets can't compete! They need more revenue to field competitive teams. Increase sharing!";
        } else if (gap > 5) {
            return "📉 Small markets are struggling. More sharing or weighted distribution could help them survive.";
        } else {
            return "💪 Small markets are almost viable! A bit more support should get them competitive.";
        }
    }

    return "⚡ Adjust your settings to find the balance that works for everyone!";
}

/**
 * Get warning message if close to failure
 */
function getWarningMessage(results, levelConfig) {
    const conditions = checkVictoryConditions(results, levelConfig);
    const warnings = [];

    // Big market warning
    if (conditions.bigSatisfaction < levelConfig.minBigMarketSatisfaction + 10 &&
        conditions.bigSatisfaction >= levelConfig.minBigMarketSatisfaction - 5) {
        warnings.push("⚠️ Big market owners are getting restless...");
    } else if (conditions.bigSatisfaction < levelConfig.minBigMarketSatisfaction - 5) {
        warnings.push("🚨 Big markets threaten to vote NO!");
    }

    // Small market warning
    if (conditions.smallViability < levelConfig.minSmallMarketViability + 10 &&
        conditions.smallViability >= levelConfig.minSmallMarketViability - 5) {
        warnings.push("⚠️ Small markets are barely surviving...");
    } else if (conditions.smallViability < levelConfig.minSmallMarketViability - 5) {
        warnings.push("🚨 Small markets can't field competitive teams!");
    }

    return warnings;
}

/**
 * Get explanation for distribution type
 */
function getDistributionExplanation(distributionType) {
    if (distributionType === 'equal') {
        return "Equal: Every team gets the same share. Simple and fair, but might not help small markets enough.";
    } else if (distributionType === 'weighted') {
        return "Weighted: Smaller markets get bigger shares. Helps them compete, but big markets keep more of their own money!";
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
    return `$${Math.round(amount)}M`;
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

/**
 * Legacy function for backwards compatibility
 */
function calculateFairnessScore(results) {
    return calculateParityScore(results);
}

/**
 * Get revenue breakdown for the math panel
 * Returns per-team rows showing each step
 */
function getRevenueBreakdown(results) {
    return results.map(team => ({
        name: team.name,
        base: team.baseRevenue,
        shared: -(team.baseRevenue - team.afterSharing),
        received: team.redistribution,
        luxTax: -team.luxuryTaxPaid,
        luxRcvd: team.luxuryTaxReceived,
        final: team.finalRevenue
    }));
}

/**
 * Check if close to solution (all unmet metrics within threshold%)
 */
function isNearSolution(results, levelConfig, threshold = 6) {
    const conditions = checkVictoryConditions(results, levelConfig);
    if (conditions.allMet) return false;

    const parityGap = levelConfig.targetParity - conditions.parity;
    const bigGap = levelConfig.minBigMarketSatisfaction - conditions.bigSatisfaction;
    const smallGap = levelConfig.minSmallMarketViability - conditions.smallViability;

    const unmetGaps = [];
    if (!conditions.parityMet) unmetGaps.push(parityGap);
    if (!conditions.bigSatisfactionMet) unmetGaps.push(bigGap);
    if (!conditions.smallViabilityMet) unmetGaps.push(smallGap);

    return unmetGaps.every(gap => gap <= threshold && gap > 0);
}
