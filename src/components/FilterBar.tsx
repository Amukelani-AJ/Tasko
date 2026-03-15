import { motion } from 'framer-motion';
import type { Status, Priority } from '../types';

interface Props {
  status: Status | 'all';
  priority: Priority | 'all';
  search: string;
  onStatus: (v: Status | 'all') => void;
  onPriority: (v: Priority | 'all') => void;
  onSearch: (v: string) => void;
}

const statuses: (Status | 'all')[] = ['all', 'todo', 'in-progress', 'done'];
const priorities: (Priority | 'all')[] = ['all', 'high', 'medium', 'low'];

const statusLabel: Record<Status | 'all', string> = {
  all: 'All', todo: 'To Do', 'in-progress': 'Active', done: 'Done',
};
const priorityLabel: Record<Priority | 'all', string> = {
  all: 'Any', high: 'High', medium: 'Mid', low: 'Low',
};

export default function FilterBar({ status, priority, search, onStatus, onPriority, onSearch }: Props) {
  return (
    <div className="space-y-3 mb-6">
      {/* Search */}
      <input
        className="w-full bg-paper border border-cream focus:border-ink/30 rounded-xl px-4 py-2.5 text-sm text-ink placeholder-muted outline-none transition-colors font-sans"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />

      <div className="flex gap-4 flex-wrap">
        {/* Status filter */}
        <div className="flex items-center gap-1">
          {statuses.map((s) => (
            <motion.button
              key={s}
              onClick={() => onStatus(s)}
              whileTap={{ scale: 0.95 }}
              className={`text-xs font-mono px-3 py-1.5 rounded-full transition-colors ${
                status === s
                  ? 'bg-ink text-paper'
                  : 'bg-cream text-muted hover:text-ink'
              }`}
            >
              {statusLabel[s]}
            </motion.button>
          ))}
        </div>

        {/* Priority filter */}
        <div className="flex items-center gap-1">
          {priorities.map((p) => (
            <motion.button
              key={p}
              onClick={() => onPriority(p)}
              whileTap={{ scale: 0.95 }}
              className={`text-xs font-mono px-3 py-1.5 rounded-full transition-colors ${
                priority === p
                  ? 'bg-accent text-white'
                  : 'bg-cream text-muted hover:text-ink'
              }`}
            >
              {priorityLabel[p]}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
