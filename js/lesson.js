/* ============================================================
   BOW SPORTS CAPITAL — THE STRATEGY ROOM
   Track 101 · M2 · L2 — "Small Markets, Big Money"

   A choose-your-own-adventure front-office case on
   REVENUE SHARING and COMPETITIVE BALANCE.

   Concept preserved from the original lesson: the student
   balances big-market owners ("we earned it"), small-market
   survival, and league parity — now as connected decisions
   where each call creates the next problem.

   No randomness. Every outcome is deterministic and earned.
   ============================================================ */

/* ---------- The four boardroom metrics ---------- */
const METRICS = [
    { key: 'balance', name: 'Competitive Balance', color: '#1f6feb', note: 'How close the games are' },
    { key: 'owners',  name: 'Owner Backing',       color: '#e8362a', note: 'Will big-market owners vote yes' },
    { key: 'trust',   name: 'Small-Market Trust',  color: '#1aa179', note: 'Can small cities keep up' },
    { key: 'revenue', name: 'League Revenue',       color: '#c98a00', note: 'Total money the league makes' }
];

const START = { balance: 52, owners: 58, trust: 50, revenue: 58 };

/* ---------- DECISION 1 — How much do we share? ---------- */
const ROUND1 = [
    {
        id: 'A',
        pick: 'Plan A',
        title: 'Light Sharing',
        desc: 'Teams share only 15% of revenue. Reward the teams that earn the most. Let the big markets keep what they bring in.',
        up: 'Big-market owners love it and keep spending big.',
        risk: 'Small teams fall behind fast. Games get lopsided.',
        helps: 'Big-market owners and short-term money.',
        costs: 'Competitive balance and small-market trust.',
        tags: [
            { label: 'Owner Backing', dir: 'up' },
            { label: 'League Revenue', dir: 'up' },
            { label: 'Competitive Balance', dir: 'down' },
            { label: 'Small-Market Trust', dir: 'down' }
        ],
        deltas: { owners: 26, revenue: 14, balance: -20, trust: -22 }
    },
    {
        id: 'B',
        pick: 'Plan B',
        title: 'Balanced Sharing',
        desc: 'Teams share 30% of revenue. Split it down the middle. Nobody wins big, nobody loses big.',
        up: 'Steady. No side revolts. Keeps the peace.',
        risk: 'Nobody is thrilled, and the gap only closes a little.',
        helps: 'Stability and keeping every owner at the table.',
        costs: 'Bold progress — you play it safe.',
        tags: [
            { label: 'Competitive Balance', dir: 'up' },
            { label: 'Small-Market Trust', dir: 'up' },
            { label: 'Owner Backing', dir: 'up' },
            { label: 'League Revenue', dir: 'up' }
        ],
        deltas: { owners: 6, revenue: 4, balance: 10, trust: 9 }
    },
    {
        id: 'C',
        pick: 'Plan C',
        title: 'Heavy Sharing',
        desc: 'Teams share 50% of revenue. Protect the small markets. Pull the league closer together — fast.',
        up: 'Small markets can finally compete. Races get exciting.',
        risk: 'Big-market owners are furious about subsidizing rivals.',
        helps: 'Small markets, parity, and fans in every city.',
        costs: 'Owner backing and short-term revenue.',
        tags: [
            { label: 'Competitive Balance', dir: 'up' },
            { label: 'Small-Market Trust', dir: 'up' },
            { label: 'Owner Backing', dir: 'down' },
            { label: 'League Revenue', dir: 'down' }
        ],
        deltas: { trust: 27, balance: 24, owners: -24, revenue: -10 }
    }
];

/* ---------- CONSEQUENCE 1 — different problem per path ---------- */
const CONSEQUENCE1 = {
    A: {
        headline: 'The Rich Got Richer',
        changed: 'Big-market owners are thrilled and spending hard. League revenue jumped — for now.',
        why: 'When teams keep almost all their money, the wealthiest clubs can buy the best players and pull away.',
        pressure: 'The product is breaking. A few superteams are crushing everyone. Small-market arenas are half-empty, and national TV ratings are slipping because the games aren\'t close.',
        lesson: 'Short-term money looks great until the games stop being fun. In sports, the competition IS the product.'
    },
    B: {
        headline: 'Quiet, But Stuck',
        changed: 'No crisis, no revolt. The gap between rich and poor teams shrank a little — but only a little.',
        why: 'Splitting everything down the middle keeps the peace, but it doesn\'t fully fix the gap or excite anyone.',
        pressure: 'A beloved small-market team nearly moved to a bigger city to chase money. Ownership is now demanding a clear direction instead of a safe middle.',
        lesson: 'Playing it safe avoids a fight, but "no decision" is still a decision. Sometimes the room needs you to actually lead.'
    },
    C: {
        headline: 'The Small Markets Roar Back',
        changed: 'Small-market teams are competitive and fans across the league are fired up. The standings are tight.',
        why: 'Sharing a lot of money lifts the bottom teams up so they can afford real talent and stay in the race.',
        pressure: 'Two big-market owners are threatening to block the next TV deal and cut their spending. You need their votes — and their stars — or the whole plan falls apart.',
        lesson: 'Helping one group hard can anger the group that pays the bills. Even a great plan needs enough support to survive the vote.'
    }
};

/* ---------- DECISION 2 — responds to the Round 1 fallout ---------- */
const ROUND2 = {
    A: {
        head: 'Decision 2: Save the Product',
        sub: 'Your light-sharing plan made the rich teams richer — and the games lopsided. Now you have to protect the league\'s actual product: close games.',
        options: [
            {
                id: '1', pick: 'Move A1', title: 'Add a Luxury Tax',
                desc: 'Make the biggest spenders pay a tax on every dollar over a limit. Send that tax money to smaller teams.',
                up: 'Reins in the superteams and funds the little guys.',
                risk: 'Big owners feel double-charged and grumble.',
                helps: 'Competitive balance and small markets.',
                costs: 'Some owner goodwill you just earned.',
                tags: [{label:'Competitive Balance',dir:'up'},{label:'Small-Market Trust',dir:'up'},{label:'Owner Backing',dir:'down'}],
                deltas: { balance: 18, trust: 16, owners: -12, revenue: 2 }
            },
            {
                id: '2', pick: 'Move A2', title: 'Share the TV Money Equally',
                desc: 'Keep local money alone, but split the giant national TV deal evenly across all teams.',
                up: 'Lifts small markets without touching local earnings.',
                risk: 'It works slowly — the gap stays wide for a while.',
                helps: 'Small markets and long-term fairness.',
                costs: 'Speed — fans won\'t feel it right away.',
                tags: [{label:'Small-Market Trust',dir:'up'},{label:'Competitive Balance',dir:'up'},{label:'League Revenue',dir:'up'}],
                deltas: { trust: 14, balance: 9, revenue: 8, owners: -3 }
            },
            {
                id: '3', pick: 'Move A3', title: 'Ride the Superstars',
                desc: 'Do nothing. Lean into the superteams and sell the star power on national TV.',
                up: 'Big stars pull short-term ratings and hype.',
                risk: 'The long-term decline gets worse as fans tune out.',
                helps: 'Short-term revenue and big markets.',
                costs: 'The future of the league\'s balance.',
                tags: [{label:'League Revenue',dir:'up'},{label:'Competitive Balance',dir:'down'},{label:'Small-Market Trust',dir:'down'}],
                deltas: { revenue: 10, owners: 6, balance: -14, trust: -12 }
            }
        ]
    },
    B: {
        head: 'Decision 2: Pick a Direction',
        sub: 'Your safe middle kept the peace but nearly cost the league a team. Ownership wants a real plan. Time to actually lead.',
        options: [
            {
                id: '1', pick: 'Move B1', title: 'Tilt Toward Small Markets',
                desc: 'Change how the shared money is split so smaller markets get a bigger slice.',
                up: 'Finally closes the gap that was stuck.',
                risk: 'Big markets grumble about getting less back.',
                helps: 'Small markets and competitive balance.',
                costs: 'A little owner goodwill.',
                tags: [{label:'Competitive Balance',dir:'up'},{label:'Small-Market Trust',dir:'up'},{label:'Owner Backing',dir:'down'}],
                deltas: { balance: 16, trust: 18, owners: -10, revenue: 2 }
            },
            {
                id: '2', pick: 'Move B2', title: 'Reward Teams That Invest',
                desc: 'Let teams that spend to win keep a bigger share of new money they create.',
                up: 'Pushes every team to invest and grow the pie.',
                risk: 'Rich teams benefit most — the gap can creep back.',
                helps: 'League revenue and big markets.',
                costs: 'Some of the balance you were chasing.',
                tags: [{label:'League Revenue',dir:'up'},{label:'Owner Backing',dir:'up'},{label:'Competitive Balance',dir:'down'}],
                deltas: { revenue: 14, owners: 12, balance: -8, trust: -4 }
            },
            {
                id: '3', pick: 'Move B3', title: 'Build a Safety Net',
                desc: 'Create a fund that keeps struggling teams from going broke or leaving town.',
                up: 'No team disappears. Cities feel safe and loyal.',
                risk: 'It protects the floor but doesn\'t grow anything.',
                helps: 'Small-market trust and stability.',
                costs: 'Bold growth — you\'re playing defense.',
                tags: [{label:'Small-Market Trust',dir:'up'},{label:'Competitive Balance',dir:'up'},{label:'League Revenue',dir:'down'}],
                deltas: { trust: 16, balance: 8, revenue: -6, owners: 2 }
            }
        ]
    },
    C: {
        head: 'Decision 2: Keep the Owners In',
        sub: 'Your heavy-sharing plan saved the small markets — but the big owners are ready to walk and block the TV deal. You need them back.',
        options: [
            {
                id: '1', pick: 'Move C1', title: 'Add a Growth Bonus',
                desc: 'Let teams that grow their revenue keep a bigger slice of that NEW money they create.',
                up: 'Big owners re-engage and start investing again.',
                risk: 'Rewarding growth slightly widens the gap again.',
                helps: 'Owner backing and league revenue.',
                costs: 'A bit of the balance you fought for.',
                tags: [{label:'Owner Backing',dir:'up'},{label:'League Revenue',dir:'up'},{label:'Competitive Balance',dir:'down'}],
                deltas: { owners: 18, revenue: 12, balance: -8, trust: -2 }
            },
            {
                id: '2', pick: 'Move C2', title: 'Lock In a 5-Year Promise',
                desc: 'Guarantee no more sharing increases for five years so owners know what to expect.',
                up: 'Owners feel safe and sign the TV deal.',
                risk: 'You lose the freedom to adjust if things change.',
                helps: 'Owner backing and stability.',
                costs: 'Future flexibility.',
                tags: [{label:'Owner Backing',dir:'up'},{label:'League Revenue',dir:'up'},{label:'Small-Market Trust',dir:'down'}],
                deltas: { owners: 16, revenue: 8, trust: -6, balance: -2 }
            },
            {
                id: '3', pick: 'Move C3', title: 'Call Their Bluff',
                desc: 'Hold firm. Keep heavy sharing and dare the big owners to actually walk away.',
                up: 'Small markets and fans see you stand your ground.',
                risk: 'You may lose big-market investment AND the TV deal.',
                helps: 'Small-market trust and competitive balance.',
                costs: 'Owner backing and a lot of revenue.',
                tags: [{label:'Small-Market Trust',dir:'up'},{label:'Competitive Balance',dir:'up'},{label:'Owner Backing',dir:'down'},{label:'League Revenue',dir:'down'}],
                deltas: { trust: 10, balance: 8, owners: -16, revenue: -14 }
            }
        ]
    }
};

/* ---------- CONSEQUENCE 2 — specific to the full path ---------- */
const CONSEQUENCE2 = {
    A1: { headline: 'The Tax Pulls Them Back', improved: 'Games tightened up and small markets got a lifeline from the tax money.', harder: 'A couple of big owners are still sore about paying twice.', tradeoff: 'You traded some owner goodwill to rescue the close games fans actually want.' },
    A2: { headline: 'A Slow, Steady Fix', improved: 'Splitting the TV money evenly gave every team a fairer floor for the future.', harder: 'Fans wanted change now, and the gap is still wide this season.', tradeoff: 'You traded a quick win for a fair system that pays off later.' },
    A3: { headline: 'The Hype Runs Out', improved: 'Star power spiked ratings for a season and the money looked great.', harder: 'Small-market fans kept leaving and the league looks lopsided.', tradeoff: 'You traded the league\'s long-term health for a short-term highlight reel.' },

    B1: { headline: 'The Gap Finally Closes', improved: 'Tilting the money toward small markets did what the safe plan couldn\'t — real balance.', harder: 'Big owners noticed they\'re getting less back.', tradeoff: 'You traded a little owner comfort to finally lead instead of stall.' },
    B2: { headline: 'The Pie Grows', improved: 'Rewarding investment got every owner spending and grew total revenue.', harder: 'The rich teams grew fastest, so the gap started creeping back.', tradeoff: 'You traded some balance for a bigger, more ambitious league.' },
    B3: { headline: 'Nobody Leaves Town', improved: 'The safety net locked in loyal cities and steadied small markets.', harder: 'You protected the floor but didn\'t raise the ceiling.', tradeoff: 'You traded bold growth for rock-solid stability.' },

    C1: { headline: 'The Owners Buy Back In', improved: 'The growth bonus brought big markets back to the table and saved the TV deal.', harder: 'Rewarding growth nudged the gap open again.', tradeoff: 'You traded a sliver of balance to keep the whole deal alive.' },
    C2: { headline: 'A Deal Everyone Signs', improved: 'The 5-year promise calmed the owners and locked in the money.', harder: 'You can\'t raise sharing again for years, even if small markets need it.', tradeoff: 'You traded future flexibility for the votes you needed today.' },
    C3: { headline: 'You Held the Line', improved: 'Small markets and fans respect that you didn\'t cave.', harder: 'Some big-market investment walked, and the TV deal shrank.', tradeoff: 'You traded real money to defend the fairest version of the league.' }
};

/* ---------- Universal Front Office Takeaway ---------- */
const TAKEAWAY = 'Revenue sharing is a balancing act, not a magic switch. Share too little and small markets can\'t compete — the games get boring and fans leave. Share too much and the big owners who fund the league feel robbed. Real commissioners hunt for the middle where the games stay close, the owners stay in, AND the money keeps growing. Every call you made helped one of those things and pressured another. That trade-off is the whole job.';

/* ============================================================
   ENGINE
   ============================================================ */
const state = { step: 0, metrics: { ...START }, r1: null, r2: null };

const PANELS = ['casefile','situation','round1','consequence1','round2','consequence2','recommendation','recap'];

function clamp(n) { return Math.max(0, Math.min(100, Math.round(n))); }

function applyDeltas(deltas) {
    for (const k in deltas) {
        if (k in state.metrics) state.metrics[k] = clamp(state.metrics[k] + deltas[k]);
    }
}

function goto(step) {
    state.step = step;
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById('panel-' + PANELS[step]).classList.add('active');
    updateRail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateRail() {
    document.querySelectorAll('.rail-step').forEach(el => {
        const s = Number(el.dataset.step);
        el.classList.toggle('current', s === state.step);
        el.classList.toggle('done', s < state.step);
    });
}

/* ---------- Build a decision card ---------- */
function decisionCardHTML(opt) {
    const tags = opt.tags.map(t =>
        `<span class="tag ${t.dir}">${t.dir === 'up' ? '▲' : '▼'} ${t.label}</span>`
    ).join('');
    return `
    <article class="decision-card">
        <div class="dc-top">
            <span class="dc-pick">${opt.pick}</span>
            <span class="dc-title">${opt.title}</span>
        </div>
        <p class="dc-desc">${opt.desc}</p>
        <div class="dc-cols">
            <div class="dc-col dc-up"><span>Upside</span><p>${opt.up}</p></div>
            <div class="dc-col dc-risk"><span>Risk</span><p>${opt.risk}</p></div>
            <div class="dc-col dc-helps"><span>Who it helps</span><p>${opt.helps}</p></div>
            <div class="dc-col dc-costs"><span>What it costs</span><p>${opt.costs}</p></div>
        </div>
        <div class="dc-tags">${tags}</div>
        <button class="dc-choose" data-id="${opt.id}">Make the call →</button>
    </article>`;
}

/* ---------- Render Round 1 ---------- */
function renderRound1() {
    const stack = document.getElementById('round1Stack');
    stack.innerHTML = ROUND1.map(decisionCardHTML).join('');
    stack.querySelectorAll('.dc-choose').forEach(btn => {
        btn.addEventListener('click', () => chooseRound1(btn.dataset.id));
    });
}

function chooseRound1(id) {
    state.r1 = id;
    const opt = ROUND1.find(o => o.id === id);
    applyDeltas(opt.deltas);
    renderConsequence1();
    goto(3);
}

/* ---------- Consequence helpers ---------- */
function deltaPills(deltas) {
    return '<div class="delta-row">' + METRICS.map(m => {
        const d = deltas[m.key] || 0;
        const cls = d > 0 ? 'up' : d < 0 ? 'down' : 'flat';
        const sign = d > 0 ? '+' + d : d < 0 ? String(d) : '0';
        return `<span class="delta"><span class="${cls}">${m.name}: ${sign}</span></span>`;
    }).join('') + '</div>';
}

function renderConsequence1() {
    const c = CONSEQUENCE1[state.r1];
    const opt = ROUND1.find(o => o.id === state.r1);
    document.getElementById('consequence1').innerHTML = `
        <div class="cq-headline">${c.headline}</div>
        <div class="cq-block"><span class="lbl">What changed</span><p>${c.changed}</p></div>
        <div class="cq-block"><span class="lbl">Why it changed</span><p>${c.why}</p></div>
        ${deltaPills(opt.deltas)}
        <div class="cq-pressure"><span class="lbl">New pressure on the desk</span><p>${c.pressure}</p></div>
        <div class="cq-lesson"><span class="lbl">Front office lesson</span><p>${c.lesson}</p></div>
    `;
}

/* ---------- Render Round 2 ---------- */
function renderRound2() {
    const r = ROUND2[state.r1];
    document.getElementById('round2Head').textContent = r.head;
    document.getElementById('round2Sub').textContent = r.sub;
    const stack = document.getElementById('round2Stack');
    stack.innerHTML = r.options.map(decisionCardHTML).join('');
    stack.querySelectorAll('.dc-choose').forEach(btn => {
        btn.addEventListener('click', () => chooseRound2(btn.dataset.id));
    });
}

function chooseRound2(id) {
    state.r2 = id;
    const opt = ROUND2[state.r1].options.find(o => o.id === id);
    applyDeltas(opt.deltas);
    renderConsequence2();
    goto(5);
}

function renderConsequence2() {
    const key = state.r1 + state.r2;
    const c = CONSEQUENCE2[key];
    const opt = ROUND2[state.r1].options.find(o => o.id === state.r2);
    document.getElementById('consequence2').innerHTML = `
        <div class="cq-headline">${c.headline}</div>
        <div class="cq-block"><span class="lbl">What improved</span><p>${c.improved}</p></div>
        <div class="cq-block"><span class="lbl">What got harder</span><p>${c.harder}</p></div>
        ${deltaPills(opt.deltas)}
        <div class="cq-pressure"><span class="lbl">The trade-off you accepted</span><p>${c.tradeoff}</p></div>
    `;
}

/* ---------- Recap ---------- */
function metricWord(v) {
    if (v >= 85) return 'Locked in';
    if (v >= 70) return 'Strong';
    if (v >= 55) return 'Holding';
    if (v >= 38) return 'Shaky';
    return 'In the red';
}

function renderRecap() {
    const o1 = ROUND1.find(o => o.id === state.r1);
    const o2 = ROUND2[state.r1].options.find(o => o.id === state.r2);
    const c2 = CONSEQUENCE2[state.r1 + state.r2];

    document.getElementById('recapPath').innerHTML = `
        <span class="lbl">Your path through the case</span>
        <ol>
            <li><strong>Decision 1:</strong> ${o1.title} — ${o1.desc.split('.')[0]}.</li>
            <li><strong>Decision 2:</strong> ${o2.title} — ${o2.desc.split('.')[0]}.</li>
            <li><strong>Result:</strong> ${c2.headline}.</li>
        </ol>`;

    document.getElementById('recapMetrics').innerHTML = METRICS.map(m => {
        const v = state.metrics[m.key];
        return `
        <div class="metric">
            <div class="metric-top">
                <span class="metric-name">${m.name}</span>
                <span class="metric-val" style="color:${m.color}">${v}</span>
            </div>
            <div class="metric-track"><div class="metric-bar" style="width:0%;background:${m.color}" data-w="${v}"></div></div>
            <div class="metric-word">${metricWord(v)} · ${m.note}</div>
        </div>`;
    }).join('');

    // Biggest trade-off = the lowest metric you sacrificed
    const lowest = METRICS.reduce((a, b) => state.metrics[a.key] <= state.metrics[b.key] ? a : b);
    document.getElementById('recapTradeoff').innerHTML = `
        <span class="lbl">Your biggest trade-off</span>
        <p>To win where you won, you let <strong>${lowest.name}</strong> slip to <strong>${state.metrics[lowest.key]}</strong> (${metricWord(state.metrics[lowest.key]).toLowerCase()}). ${c2.tradeoff}</p>`;

    document.getElementById('takeawayText').textContent = TAKEAWAY;

    // Animate bars after paint
    requestAnimationFrame(() => {
        document.querySelectorAll('#recapMetrics .metric-bar').forEach(bar => {
            bar.style.width = bar.dataset.w + '%';
        });
    });
}

/* ---------- Reset ---------- */
function restart() {
    state.metrics = { ...START };
    state.r1 = null;
    state.r2 = null;
    document.querySelectorAll('.memo-q textarea').forEach(t => t.value = '');
    goto(0);
}

/* ---------- Wire up navigation ---------- */
document.addEventListener('DOMContentLoaded', () => {
    renderRound1();

    document.querySelectorAll('[data-goto]').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = Number(btn.dataset.goto);
            // Lazy-render panels that depend on choices
            if (target === 4) renderRound2();
            if (target === 7) renderRecap();
            goto(target);
        });
    });

    document.getElementById('restartBtn').addEventListener('click', restart);

    updateRail();
});
