# Miss Rachel or Bust! 🍼

A fun browser game where you help a determined baby crawl across a living room floor to reach Miss Rachel while avoiding dangerous household objects!

## Game Overview

In this game, you control a crawling baby who must navigate through a living room filled with obstacles (scissors and bottles) to reach their favorite person - Miss Rachel! Parents' hands can help lift the baby over obstacles, but be strategic with your stamina usage.

## Features

- 🎮 Simple arrow key controls
- 🙌 Parent hands lifting mechanic with stamina system
- ⚡ Real-time obstacle collision detection
- 🏠 Cozy living room background
- 🎯 Goal-based gameplay (reach Miss Rachel!)

## How to Play

1. **Controls:**
   - ← → Arrow keys: Move the baby left/right
   - ↑ Arrow key: Lift baby (while holding, uses stamina)
   - Stamina recharges when not lifting

2. **Objective:**
   - Help the baby reach Miss Rachel on the right side of the screen
   - Avoid touching scissors and bottles
   - Manage your stamina while lifting over obstacles

## Getting Started

### Prerequisites

- Node.js (version 18.18.0 or higher)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:kpennachio/miss-rachel-or-bust.git
   cd miss-rachel-or-bust
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Technology Stack

- Next.js
- React Three Fiber (3D rendering)
- React Three Rapier (Physics)
- TypeScript
- Tailwind CSS

## Game Tips

- Watch your stamina meter when lifting the baby
- Time your lifts carefully to get over obstacles
- You can't lift forever - the stamina bar will deplete
- Let go of the up arrow to recharge stamina
- The game ends if you touch any obstacles

Have fun helping the baby reach Miss Rachel! 🎮 👶
