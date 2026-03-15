export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'done';

export interface SubTask {
  id: string;
  title: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  tags: string[];
  dueDate: string | null;
  createdAt: string;
  subtasks: SubTask[];
  aiGenerated?: boolean;
}
