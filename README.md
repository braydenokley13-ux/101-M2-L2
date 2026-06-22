# 🏀 Small Markets, Big Money — Bow Sports Capital Front Office

**Track 101 · Module 2 · Lesson 2**

A Bow / Ringer-inspired, choose-your-own-adventure business case that teaches
5th–6th graders about **revenue sharing** and **competitive balance** in pro
sports. The student steps into the Bow Sports Capital front office as a League
Revenue Strategist and makes connected decisions where every call creates the
next problem.

> This lesson keeps its original concept — the "Small Markets, Big Money"
> revenue-sharing dilemma (balancing big-market owners, small-market survival,
> and league parity). It was redesigned from a slider dashboard into a focused
> front-office case so the trade-offs are felt, not just clicked.

## 🎯 Learning Objectives

Students will learn:
- What **revenue sharing** is and why leagues use it
- Why **competitive balance** (close games) is the real product
- The tug-of-war between big-market owners and small-market teams
- That every business decision has a trade-off — and creates the next one
- How to read a situation, make a call, live with the fallout, and defend a plan

## 🧭 The Lesson Flow

1. **Opening Case File** — the mission, your role, and the problem on the table.
2. **Situation Board** — five cards (fans, ownership, small markets, league
   revenue, sponsors) that all pull in different directions.
3. **Decision 1 — How much do we share?** Light / Balanced / Heavy sharing.
4. **Consequence 1** — one season later, your call creates a *new* problem.
5. **Decision 2** — responds directly to the problem your first call created.
6. **Consequence 2** — the specific trade-off you accepted.
7. **Final Recommendation** — defend your path in a short front-office memo.
8. **Final Recap** — your path, four boardroom metrics, your biggest trade-off,
   and the Front Office Takeaway.

### The four boardroom metrics
- ⚖️ **Competitive Balance** — how close the games are
- 🤝 **Owner Backing** — will big-market owners vote yes
- 🏟️ **Small-Market Trust** — can small cities keep up
- 💰 **League Revenue** — total money the league makes

No spreadsheets, no random outcomes. Each decision applies fixed, explainable
effects to these four metrics, so the same path always tells the same story.

## 🌳 How the choices connect

| Decision 1 | New pressure it creates | Decision 2 responds by… |
|---|---|---|
| **Light Sharing** (rich teams keep more) | Superteams form, games go lopsided, fans leave | Saving the product (luxury tax / equal TV split / ride the stars) |
| **Balanced Sharing** (safe middle) | Gap stays stuck, a team nearly relocates | Picking a real direction (tilt to small markets / reward investment / safety net) |
| **Heavy Sharing** (protect small markets) | Big owners threaten to block the TV deal | Keeping owners in (growth bonus / 5-year promise / call their bluff) |

Three Round-1 calls × three Round-2 responses = nine distinct endings, each with
its own headline, fallout, and trade-off.

## 🛠️ Technical Details

Pure static site — no build step, no framework.

```
/
├── index.html        # The full case (8 panels, shown one at a time)
├── css/
│   └── style.css     # Bow / Ringer editorial design system + tokens
├── js/
│   └── lesson.js     # Deterministic decision engine + content
└── README.md
```

### Design system (Bow / Ringer-inspired)
- Editorial masthead with a Track/Module/Lesson dateline and progress rail
- Bold condensed headlines (Oswald) over clean body type (Inter)
- Strong black/white contrast with a single red accent
- Hard-edged "decision cards" with offset drop shadows
- Magazine-style case sections and big "Make the call" moments
- Design tokens live in `:root` (`css/style.css`) — reuse them, don't fork them

## 🚀 Deployment (GitHub Pages)

1. Push to your repository
2. Settings → Pages → select branch + root directory → Save
3. Site goes live at `https://[username].github.io/[repo-name]/`

No internet is required to run the lesson except the Google Fonts link, which
degrades gracefully to system fonts if offline.

## 🎓 For Teachers

**Discussion questions**
1. Why do big-market teams make more money than small-market teams?
2. Is it fair to take money from successful teams and give it to others?
3. What happens to fans if the games stop being close?
4. Where else in life do we share resources to keep things fair (taxes, group projects)?

**Standards touchpoints**
- Economics: trade-offs, incentives, fairness vs. growth
- Math: percentages and comparisons
- Critical thinking: cause-and-effect, defending a decision

---

**Built for young sports-business thinkers — read the room, make the call, defend the plan.**
