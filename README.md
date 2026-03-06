# Life RPG

A **privacy-first**, gamified productivity dashboard that turns your schedule into daily quests and rewards.

## What is it?

Life RPG is a browser-based app where you define your life structure in a **schedule JSON file**. The system converts your tasks (coding, exercise, job hunting, etc.) into quests. Completing quests earns **coins**, which you can spend on real-life rewards (e.g. food, gaming time, hobbies). Streaks, progress, and achievements are tracked—all stored **locally** on your device. No backend, no cloud; your data stays yours.

## What it does

- **Schedule → Quests**: Your schedule JSON is turned into daily quests with progress and coin rewards.
- **Coins & daily upkeep**: Complete quests to earn coins; a small daily upkeep is deducted each day.
- **Streaks**: Keep a global streak by completing priority quests; optional shield to protect it.
- **Random rewards**: Finishing quests can trigger bonus coins or weekly chest tokens.
- **Shop**: Spend coins on rewards (early gaming, order food, movie night, custom items) with cooldowns.
- **Save/export**: Progress is saved in the browser (localStorage/IndexedDB) with optional JSON export/import.

## Technologies

- **Frontend**: React 19, TypeScript
- **Build**: Vite 7
- **State**: Zustand
- **Styling**: TailwindCSS 4
- **Validation**: Zod
- **Icons**: Lucide React
- **Persistence**: localStorage, IndexedDB, JSON export/import

## How to install

1. **Clone or download** this repository.

2. **Install dependencies** (the app lives in the `app` folder):

   ```
   cd app
   npm install
   ```

3. **Run the development server**:

   ```
   npm run dev
   ```

4. Open the URL shown in the terminal (usually `http://localhost:5173`) in your browser.

### Other commands

- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`

---