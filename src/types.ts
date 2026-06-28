export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export type TaskStatus = 'pending' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  highPriorityTasks: number;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TasksResponse {
  tasks: Task[];
  pagination: PaginationData;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface UserResponse {
  user: User;
}

export interface TaskResponse {
  task: Task;
}

export interface GeneralResponse {
  message: string;
}
