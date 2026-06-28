import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';
import { Task, TaskStats, PaginationData, TasksResponse, TaskResponse, GeneralResponse } from '../types';
import { useToast } from './ToastContext';

interface TaskContextProps {
  tasks: Task[];
  pagination: PaginationData | null;
  stats: TaskStats | null;
  loading: boolean;
  statsLoading: boolean;
  fetchTasks: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => Promise<void>;
  fetchStats: () => Promise<void>;
  getTask: (id: string) => Promise<Task>;
  createTask: (title: string, description: string, priority: string, dueDate: string) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [statsLoading, setStatsLoading] = useState<boolean>(false);
  const { success, error } = useToast();

  const fetchTasks = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    setLoading(true);
    try {
      const response = await api.get<TasksResponse>('/tasks', { params });
      setTasks(response.data.tasks);
      setPagination(response.data.pagination);
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Failed to fetch tasks.';
      error('Fetch Error', errMsg);
    } finally {
      setLoading(false);
    }
  }, [error]);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await api.get<TaskStats>('/tasks/stats');
      setStats(response.data);
    } catch (err: any) {
      console.error('Failed to fetch statistics:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const getTask = useCallback(async (id: string): Promise<Task> => {
    try {
      const response = await api.get<TaskResponse>(`/tasks/${id}`);
      return response.data.task;
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Failed to fetch task details.';
      error('Task Detail Error', errMsg);
      throw err;
    }
  }, [error]);

  const createTask = useCallback(async (title: string, description: string, priority: string, dueDate: string) => {
    setLoading(true);
    try {
      await api.post<TaskResponse>('/tasks', { title, description, priority, dueDate });
      success('Task Created', 'Your new task has been saved successfully.');
      // Refresh statistics
      fetchStats();
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Failed to create task.';
      error('Create Task Error', errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [success, error, fetchStats]);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    setLoading(true);
    try {
      await api.put<TaskResponse>(`/tasks/${id}`, updates);
      
      // Update local task state inline to avoid a complete hard refresh and ensure silky UI feel
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
      );
      
      success('Task Updated', 'The task has been updated successfully.');
      fetchStats();
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Failed to update task.';
      error('Update Error', errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [success, error, fetchStats]);

  const deleteTask = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await api.delete<GeneralResponse>(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      success('Task Deleted', 'The task has been permanently removed.');
      fetchStats();
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Failed to delete task.';
      error('Delete Error', errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [success, error, fetchStats]);

  const value = {
    tasks,
    pagination,
    stats,
    loading,
    statsLoading,
    fetchTasks,
    fetchStats,
    getTask,
    createTask,
    updateTask,
    deleteTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
