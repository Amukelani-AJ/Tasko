import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Sparkles } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Task, Status, Priority } from './types';
import TaskCard from './components/TaskCard';
import AddTaskModal from './components/AddTaskModal';
import StatsBar from './components/StatsBar';
import FilterBar from './components/FilterBar';

const SAMPLE_TASKS: Task[] = [
  {
    id: 'demo-1',
    title: 'Design new landing page',
    description: 'Revamp the hero section with modern aesthetics and better CTA placement.',
    priority: 'high',
    status: 'in-progress',
    tags: ['design', 'frontend'],
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    subtasks: [
      { id: 'sub-1', title: 'Sketch wireframes', done: true },
      { id: 'sub-2', title: 'Choose color palette', done: true },
      { id: 'sub-3', title: 'Build responsive layout', done: false },
    ],
    aiGenerated: false,
  },
  {
    id: 'demo-2',
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment.',
    priority: 'medium',
    status: 'todo',
    tags: ['devops', 'backend'],
    dueDate: null,
    createdAt: new Date().toISOString(),
    subtasks: [],
    aiGenerated: false,
  },
  {
    id: 'demo-3',
    title: 'Write API documentation',
    description: '',
    priority: 'low',
    status: 'done',
    tags: ['docs'],
    dueDate: null,
    createdAt: new Date().toISOString(),
    subtasks: [],
    aiGenerated: false,
  },
];

export default function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasko-tasks', SAMPLE_TASKS);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [search, setSearch] = useState('');

  const addTask = (task: Task) => setTasks([task, ...tasks]);
  const updateTask = (updated: Task) => setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
  const deleteTask = (id: string) => setTasks(tasks.filter((t) => t.id !== id));

  const filtered = tasks.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.tags.join(' ').includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-cream font-sans">
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent/5" />
        <div className="absolute bottom-0 -left-20 w-64 h-64 rounded-full bg-accent/3" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-accent" />
                <span className="font-mono text-xs text-muted uppercase tracking-widest">AI-Powered</span>
              </div>
              <h1 className="font-display font-bold text-4xl text-ink">
                Tasko<span className="text-accent">.</span>
              </h1>
              <p className="text-sm text-muted mt-1">Your intelligent task companion</p>
            </div>

            <motion.button
              onClick={() => setModalOpen(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 bg-ink text-paper px-5 py-2.5 rounded-2xl text-sm font-medium shadow-lg hover:bg-ink/80 transition-colors"
            >
              <Plus size={16} />
              New task
            </motion.button>
          </div>

          {/* Decorative rule */}
          <div className="flex items-center gap-3 mt-6">
            <div className="h-px flex-1 bg-gradient-to-r from-accent/40 to-transparent" />
            <span className="font-mono text-[10px] text-muted/60 uppercase tracking-widest">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-accent/40 to-transparent" />
          </div>
        </motion.header>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <StatsBar tasks={tasks} />
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <FilterBar
            status={statusFilter}
            priority={priorityFilter}
            search={search}
            onStatus={setStatusFilter}
            onPriority={setPriorityFilter}
            onSearch={setSearch}
          />
        </motion.div>

        {/* Task list */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-muted"
            >
              <p className="font-display text-2xl italic mb-2">All clear.</p>
              <p className="text-sm font-mono">No tasks match your filters.</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {filtered.map((task) => (
                <TaskCard key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-xs font-mono text-muted/50">
            Click <Sparkles size={10} className="inline" /> on any task to let AI break it into subtasks
          </p>
        </footer>
      </div>

      <AddTaskModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={addTask} />
    </div>
  );
}
