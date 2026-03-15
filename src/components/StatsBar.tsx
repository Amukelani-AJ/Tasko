import { motion } from 'framer-motion';
import type { Task } from '../types';

interface Props {
  tasks: Task[];
}

export default function StatsBar({ tasks }: Props) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'done').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const high = tasks.filter((t) => t.priority === 'high' && t.status !== 'done').length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const stats = [
    { label: 'Total', value: total, color: 'text-ink' },
    { label: 'Done', value: done, color: 'text-accent' },
    { label: 'Active', value: inProgress, color: 'text-amber-600' },
    { label: 'Urgent', value: high, color: 'text-red-500' },
  ];

  return (
    <div className="bg-paper border border-cream rounded-2xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-ink text-lg">Overview</h2>
        <span className="font-mono text-sm text-muted">{pct}% complete</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-cream rounded-full overflow-hidden mb-5">
        <motion.div
          className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="text-center"
          >
            <p className={`font-display font-bold text-2xl ${s.color}`}>{s.value}</p>
            <p className="text-xs font-mono text-muted mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
