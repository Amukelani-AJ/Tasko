import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import type { Task, Priority, Status } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (task: Task) => void;
}

export default function AddTaskModal({ open, onClose, onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<Status>('todo');
  const [dueDate, setDueDate] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput('');
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    const task: Task = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      tags,
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
      subtasks: [],
    };
    onAdd(task);
    // reset
    setTitle(''); setDescription(''); setPriority('medium');
    setStatus('todo'); setDueDate(''); setTags([]); setTagInput('');
    onClose();
  };

  const inputClass = 'w-full bg-cream border border-cream focus:border-ink/30 rounded-xl px-4 py-2.5 text-sm text-ink placeholder-muted outline-none transition-colors font-sans';
  const labelClass = 'block text-xs font-mono text-muted mb-1.5 uppercase tracking-wider';

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[520px] bg-paper rounded-3xl shadow-2xl z-50 p-6 border border-cream"
            initial={{ opacity: 0, scale: 0.95, y: '-45%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, y: '-45%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl text-ink">New Task</h2>
              <button onClick={onClose} className="p-2 rounded-xl text-muted hover:text-ink hover:bg-cream transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className={labelClass}>Task title *</label>
                <input
                  autoFocus
                  className={inputClass}
                  placeholder="What needs to be done?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>

              {/* Description */}
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  className={`${inputClass} resize-none h-20`}
                  placeholder="Add context or notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Priority + Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Priority</label>
                  <select
                    className={inputClass}
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select
                    className={inputClass}
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Status)}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>

              {/* Due date */}
              <div>
                <label className={labelClass}>Due date</label>
                <input
                  type="date"
                  className={inputClass}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              {/* Tags */}
              <div>
                <label className={labelClass}>Tags</label>
                <div className="flex gap-2">
                  <input
                    className={`${inputClass} flex-1`}
                    placeholder="design, backend, urgent..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <button onClick={handleAddTag} className="px-3 rounded-xl bg-cream hover:bg-ink/10 text-muted transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map((t) => (
                      <span
                        key={t}
                        onClick={() => setTags(tags.filter((x) => x !== t))}
                        className="cursor-pointer text-xs font-mono bg-cream text-muted px-2 py-0.5 rounded-full hover:bg-accent/10 hover:text-accent transition-colors"
                      >
                        {t} ×
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-cream text-muted hover:text-ink hover:border-ink/20 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <motion.button
                onClick={handleSubmit}
                disabled={!title.trim()}
                whileTap={{ scale: 0.97 }}
                className="flex-1 py-2.5 rounded-xl bg-ink text-paper text-sm font-medium hover:bg-ink/80 transition-colors disabled:opacity-40"
              >
                Add Task
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
