import { useState, useEffect } from 'react';
import { Task, TaskFormData } from '@/types/task';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import { apiUrl } from '@/lib/api';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const normalizeTask = (task: any): Task => {
    return {
      id: task.id ?? task._id ?? '',
      user_id: task.user_id ?? task.user ?? '',
      title: task.title ?? '',
      description: task.description ?? '',
      category: task.category ?? 'Personal',
      priority: task.priority ?? 'Medium',
      date: task.date ?? '',
      time: task.time ?? '',
      is_completed: task.is_completed ?? task.completed ?? false,
      time_spent: task.time_spent ?? 0,
      created_at: task.created_at ?? task.createdAt ?? new Date().toISOString(),
      updated_at: task.updated_at ?? task.updatedAt ?? new Date().toISOString(),
    };
  };

  const fetchTasks = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/tasks'), {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      const nextTasks = Array.isArray(data) ? data : data.tasks || [];
      setTasks(nextTasks.map(normalizeTask));
    } catch (error: any) {
      toast({
        title: 'Error fetching tasks',
        description: error.message,
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const createTask = async (formData: TaskFormData) => {
    if (!user) return { error: new Error('Not authenticated') };
    try {
      const res = await fetch(apiUrl('/api/tasks'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create task');
      }
      toast({
        title: 'Task created',
        description: 'Your task has been added successfully.',
      });
      await fetchTasks();
      return { error: null };
    } catch (error: any) {
      toast({
        title: 'Error creating task',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const res = await fetch(apiUrl(`/api/tasks/${taskId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update task');
      }
      await fetchTasks();
      return { error: null };
    } catch (error: any) {
      toast({
        title: 'Error updating task',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const res = await fetch(apiUrl(`/api/tasks/${taskId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete task');
      }
      toast({
        title: 'Task deleted',
        description: 'Your task has been removed.',
      });
      await fetchTasks();
      return { error: null };
    } catch (error: any) {
      toast({
        title: 'Error deleting task',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }
  };

  const completeTask = async (taskId: string, timeSpent: number) => {
    return updateTask(taskId, { is_completed: true, time_spent: timeSpent });
  };

  const getTasksForDate = (date: string) => {
    return tasks.filter(task => task.date === date);
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.is_completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  };

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    getTasksForDate,
    getTaskStats,
    refetch: fetchTasks,
  };
}
