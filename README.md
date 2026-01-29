# 🏀 NBA League Commissioner - Revenue Sharing Challenge

An interactive educational game that teaches 5th-6th graders about NBA economics, revenue sharing, and competitive balance.

## 🎯 Learning Objectives

Students will learn:
- How revenue sharing works in professional sports
- The economic challenges facing small vs. big market teams
- Trade-offs between competitive fairness and team incentives
- Real-world NBA business concepts in a fun, interactive way

## 🎮 Game Features

### 5 Progressive Difficulty Levels

1. **🏀 Rookie League** (Target: 70% Fairness)
   - 3 teams: LA Lakers, Memphis Grizzlies, Phoenix Suns
   - Learn basic revenue sharing with equal distribution
   - Simple introduction to the concept

2. **⭐ All-Star Challenge** (Target: 75% Fairness)
   - 4 teams including NY Knicks and Sacramento Kings
   - Unlock distribution method choice (Equal vs Market Weighted)
   - Balance multiple team types

3. **🏆 Conference Finals** (Target: 80% Fairness)
   - 5 teams including Golden State Warriors
   - Luxury tax system introduced
   - More complex revenue dynamics

4. **🎖️ NBA Finals** (Target: 85% Fairness)
   - 6 teams including Boston Celtics and Dallas Mavericks
   - Master all tools together
   - Challenging balancing act

5. **👑 Commissioner Legend** (Target: 88% Fairness)
   - 8 teams - full league complexity
   - Ultimate challenge with all mechanics
   - Expert-level decision making

### Achievement System

**Individual Level Codes:**
- Level 1: `NBA-ROOKIE-2025`
- Level 2: `NBA-ALLSTAR-2025`
- Level 3: `NBA-CONFERENCE-2025`
- Level 4: `NBA-FINALS-2025`
- Level 5: `NBA-LEGEND-2025`

**Milestone Bonuses:**
- Complete 3 Levels: `NBA-RISING-STAR-2025`
- Complete All 5 Levels: `NBA-COMMISSIONER-MASTER-2025`

Total possible claim codes: **7**

## 🎓 Educational Alignment

### Real NBA Concepts Taught

1. **Revenue Sharing**: NBA teams contribute a portion of their local revenue to a shared pool that gets redistributed
2. **Market Size Disparity**: Large market teams (LA, NY) earn more than small markets (Memphis, OKC)
3. **Luxury Tax**: Teams exceeding a payroll threshold pay penalties
4. **Competitive Balance**: The goal of keeping all teams competitive despite revenue differences

### Age-Appropriate Design (5th-6th Grade)

- Colorful, engaging visual design with team icons and animations
- Clear coaching tips that guide learning
- Progressive difficulty that builds understanding
- Interactive sliders for hands-on exploration
- Immediate visual feedback showing cause and effect

## 🛠️ Technical Details

### Technologies Used
- **HTML5** - Semantic structure
- **CSS3** - Modern styling with animations
- **Vanilla JavaScript** - No framework dependencies
- **Chart.js** - Interactive data visualizations
- **LocalStorage** - Progress persistence

### File Structure
```
/
├── index.html              # Main game interface
├── css/
│   └── style.css          # All styling and animations
├── js/
│   ├── parityEngine.js    # Revenue calculation engine
│   ├── gameLogic.js       # Game state and progression
│   └── visualization.js   # Chart.js integration
└── README.md              # This file
```

### NBA-Realistic Data

Team revenues and market sizes are based on real NBA market research:
- **Big Markets**: LA, NY, San Francisco, Chicago (15-20 market size)
- **Mid Markets**: Phoenix, Miami, Denver (8-12 market size)
- **Small Markets**: Memphis, OKC, Salt Lake City (3-6 market size)

Revenue figures scaled appropriately to show realistic disparities.

## 🚀 Deployment to GitHub Pages

1. Push all files to your repository
2. Go to repository Settings
3. Navigate to Pages section
4. Select branch (usually `main` or `claude/interactive-github-pages-activity-0ibxk`)
5. Select root directory
6. Click Save
7. Your site will be live at: `https://[username].github.io/[repo-name]/`

## 🎮 How to Play

1. **Choose a Level** - Start with Rookie League or continue from where you left off
2. **Read the Tutorial** - First-time players get guided instructions
3. **Adjust Revenue Sharing** - Use the slider to set sharing percentage (0-100%)
4. **Choose Distribution** - Equal split or weighted toward small markets (unlocks in Level 2)
5. **Set Luxury Tax** - Control spending limits (unlocks in Level 3)
6. **Watch the Impact** - See real-time changes to team revenues and fairness score
7. **Reach the Goal** - Hit the target fairness percentage to complete the level
8. **Collect Codes** - Get your achievement code and unlock the next challenge!

## 📊 Game Mechanics Explained

### Fairness Score Calculation
```
Fairness Score = (Smallest Team Revenue / Largest Team Revenue) × 100
```

Example: If the smallest team earns $180M and the largest earns $250M:
- Fairness = (180/250) × 100 = 72%

### Revenue Sharing Process

1. **Collection Phase**: Each team contributes X% of their base revenue
2. **Pool Creation**: All contributions go into a shared pot
3. **Distribution Phase**: Money is redistributed based on chosen method
   - **Equal Split**: Every team gets the same amount
   - **Market Weighted**: Smaller markets get proportionally more

### Luxury Tax System (Levels 3-5)
- Teams exceeding the threshold pay 50% tax on the overage
- Simulates NBA's luxury tax penalty system
- Adds complexity to revenue optimization

## 🎯 Educational Tips for Teachers

### Discussion Questions
1. "Why do big market teams earn more money?"
2. "Is it fair to take money from successful teams?"
3. "What happens if there's too much revenue sharing?"
4. "How does this relate to other areas of life (taxes, redistribution)?"

### Extension Activities
- Research real NBA team revenues
- Compare to other leagues (NFL, MLB, Premier League)
- Debate: What's the ideal fairness percentage?
- Create your own revenue sharing system

### Standards Alignment
- **Math**: Percentages, ratios, data analysis
- **Economics**: Supply and demand, fairness, incentives
- **Social Studies**: Geography (market sizes), civic decision-making
- **Critical Thinking**: Trade-offs, optimization, problem-solving

## 🐛 Troubleshooting

**Progress not saving?**
- Check if browser allows localStorage
- Try a different browser
- Clear cache and try again

**Charts not displaying?**
- Ensure internet connection (Chart.js loads from CDN)
- Check browser console for errors
- Try refreshing the page

**Level won't unlock?**
- Must complete previous level first
- Check progress in claim codes section
- Try completing the previous level again

## 📝 License

Educational use encouraged! Created for BOW Sports Capital Track 101 Module 2 Lesson 2.

## 🙏 Credits

- Based on real NBA revenue sharing concepts
- Team data inspired by actual market research
- Designed for 5th-6th grade learning

---

**Built with ❤️ for young sports economics learners!**
