# Tasko — AI-Powered Task Manager

> A smart productivity tool built with React, Vite, TypeScript, and the Anthropic Claude API.

![Tasko Preview](https://via.placeholder.com/800x450/f5f0e8/c8522a?text=Tasko+%E2%80%94+Smart+Task+Manager)

## Features

- **AI Subtask Generation** — Click the ✨ icon on any task to let Claude break it down into actionable subtasks via the Anthropic API
- **Full Task CRUD** — Create, update, and delete tasks with priorities, statuses, tags, and due dates
- **Smart Filtering** — Filter by status, priority, or search by title/tag
- **Progress Tracking** — Animated progress bars at task and overview level
- **Persistent Storage** — Tasks saved to localStorage across sessions
- **Smooth Animations** — Framer Motion throughout: card entrances, modal springs, bar transitions

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | React 18 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| AI | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| Icons | Lucide React |
| Date utils | date-fns |
| Persistence | localStorage |

## Getting Started

### Prerequisites
- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com)

### Installation

```bash
# Clone or download the project
git clone https://github.com/yourusername/tasko.git
cd tasko

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

Open `.env.local` and add your key:

```
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── TaskCard.tsx        # Individual task with subtask expansion
│   ├── AddTaskModal.tsx    # Animated modal for creating tasks
│   ├── StatsBar.tsx        # Overview stats + global progress
│   └── FilterBar.tsx       # Status, priority & search filters
├── hooks/
│   └── useLocalStorage.ts  # Typed localStorage hook
├── lib/
│   └── ai.ts               # Anthropic API integration
├── types/
│   └── index.ts            # Shared TypeScript types
├── App.tsx
└── main.tsx
```

## AI Integration

The AI subtask generator sends task title and description to `claude-sonnet-4-20250514` and asks it to return a JSON array of subtask strings. The response is parsed and merged into the task's subtask list.

```ts
// src/lib/ai.ts
const message = await client.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 400,
  messages: [{ role: 'user', content: prompt }],
});
```

Cards with AI-generated subtasks show an `AI` badge.

## Deployment

Deploy to [Vercel](https://vercel.com) in one step:

```bash
npm install -g vercel
vercel
```

Add `VITE_ANTHROPIC_API_KEY` as an environment variable in your Vercel project settings.

> ⚠️ **Note:** The Anthropic SDK is used with `dangerouslyAllowBrowser: true` for demo purposes. In production, proxy API calls through a backend route to protect your key.

## License

MIT
