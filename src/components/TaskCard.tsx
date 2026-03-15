import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Sparkles, Trash2, Calendar, Tag, Loader2 } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import type { Task, Status } from '../types';
import { generateSubtasks } from '../lib/ai';

interface Props {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityConfig = {
  low: { label: 'Low', color: 'bg-muted/20 text-muted', dot: 'bg-muted' },
  medium: { label: 'Mid', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  high: { label: 'High', color: 'bg-red-100 text-accent', dot: 'bg-accent' },
};

const statusOptions: Status[] = ['todo', 'in-progress', 'done'];
const statusLabel: Record<Status, string> = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };

export default function TaskCard({ task, onUpdate, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const p = priorityConfig[task.priority];
  const isDone = task.status === 'done';

  const toggleSubtask = (subId: string) => {
    onUpdate({
      ...task,
      subtasks: task.subtasks.map((s) => (s.id === subId ? { ...s, done: !s.done } : s)),
    });
  };

  const cycleStatus = () => {
    const next = statusOptions[(statusOptions.indexOf(task.status) + 1) % statusOptions.length];
    onUpdate({ ...task, status: next });
  };

  const handleGenerateSubtasks = async () => {
    if (aiLoading) return;
    setAiLoading(true);
    try {
      const subtasks = await generateSubtasks(task.title, task.description);
      onUpdate({ ...task, subtasks, aiGenerated: true });
      setExpanded(true);
    } catch {
      alert('AI generation failed. Check your API key in .env');
    } finally {
      setAiLoading(false);
    }
  };

  const dueDateColor = () => {
    if (!task.dueDate) return 'text-muted';
    if (isDone) return 'text-muted line-through';
    if (isToday(new Date(task.dueDate))) return 'text-amber-600 font-semibold';
    if (isPast(new Date(task.dueDate))) return 'text-accent font-semibold';
    return 'text-muted';
  };

  const completedSubs = task.subtasks.filter((s) => s.done).length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`group relative bg-paper border border-cream rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow ${isDone ? 'opacity-60' : ''}`}
    >
      {/* Top row */}
      <div className="flex items-start gap-3">
        <button onClick={cycleStatus} className="mt-0.5 flex-shrink-0 text-muted hover:text-accent transition-colors">
          {isDone ? <CheckCircle2 size={20} className="text-accent" /> : <Circle size={20} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`font-display font-bold text-ink text-base leading-tight ${isDone ? 'line-through text-muted' : ''}`}>
              {task.title}
            </h3>
            {task.aiGenerated && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-accent/10 text-accent px-1.5 py-0.5 rounded-full">
                <Sparkles size={10} /> AI
              </span>
            )}
          </div>

          {task.description && (
            <p className="text-sm text-muted mt-1 leading-relaxed line-clamp-2">{task.description}</p>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-3 mt-2.5 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-medium ${p.color}`}>
              {p.label}
            </span>

            <button
              onClick={cycleStatus}
              className="text-xs font-mono text-muted hover:text-ink transition-colors border border-cream rounded-full px-2 py-0.5"
            >
              {statusLabel[task.status]}
            </button>

            {task.dueDate && (
              <span className={`text-xs font-mono flex items-center gap-1 ${dueDateColor()}`}>
                <Calendar size={11} />
                {format(new Date(task.dueDate), 'MMM d')}
              </span>
            )}

            {task.tags.map((tag) => (
              <span key={tag} className="text-xs flex items-center gap-0.5 text-muted/80">
                <Tag size={10} /> {tag}
              </span>
            ))}
          </div>

          {/* Subtask progress */}
          {task.subtasks.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-muted mb-1">
                <span className="font-mono">{completedSubs}/{task.subtasks.length} subtasks</span>
              </div>
              <div className="h-1 bg-cream rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-accent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedSubs / task.subtasks.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleGenerateSubtasks}
            disabled={aiLoading}
            title="AI: generate subtasks"
            className="p-1.5 rounded-lg text-muted hover:text-accent hover:bg-accent/10 transition-colors disabled:opacity-40"
          >
            {aiLoading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-cream transition-colors"
          >
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Expanded subtasks */}
      <AnimatePresence>
        {expanded && task.subtasks.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-cream space-y-2">
              {task.subtasks.map((sub) => (
                <motion.button
                  key={sub.id}
                  onClick={() => toggleSubtask(sub.id)}
                  className="flex items-start gap-2.5 w-full text-left group/sub"
                  whileHover={{ x: 2 }}
                >
                  {sub.done
                    ? <CheckCircle2 size={16} className="text-accent mt-0.5 flex-shrink-0" />
                    : <Circle size={16} className="text-muted mt-0.5 flex-shrink-0 group-hover/sub:text-ink transition-colors" />
                  }
                  <span className={`text-sm ${sub.done ? 'line-through text-muted' : 'text-ink'}`}>
                    {sub.title}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
