import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Logo } from '@/components/Logo';
import { TaskSummary } from '@/components/dashboard/TaskSummary';
import { Calendar } from '@/components/dashboard/Calendar';
import { TaskModal } from '@/components/dashboard/TaskModal';
import { TaskList } from '@/components/dashboard/TaskList';
import { BottomNav } from '@/components/dashboard/BottomNav';
import { FocusMode } from '@/components/focus/FocusMode';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types/task';

type NavItem = 'dashboard' | 'focus' | 'settings';

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState<NavItem>('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [focusTask, setFocusTask] = useState<Task | null>(null);

  const { tasks, createTask, deleteTask, completeTask, getTaskStats } = useTasks();
  const stats = getTaskStats();

  // Get unique dates that have tasks
  const taskDates = useMemo(() => {
    return [...new Set(tasks.map((t) => t.date))];
  }, [tasks]);

  // Get tasks for selected date
  const selectedDateTasks = useMemo(() => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return tasks.filter((t) => t.date === dateStr);
  }, [tasks, selectedDate]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleStartFocus = (task: Task) => {
    setFocusTask(task);
    setActiveNav('focus');
  };

  const handleCompleteTask = async (taskId: string, timeSpent: number) => {
    const result = await completeTask(taskId, timeSpent);
    if (!result.error) {
      setFocusTask(null);
      setActiveNav('dashboard');
    }
    return result;
  };

  const handleCancelFocus = () => {
    setFocusTask(null);
  };

  const renderContent = () => {
    switch (activeNav) {
      case 'focus':
        return (
          <FocusMode
            task={focusTask}
            onComplete={handleCompleteTask}
            onCancel={handleCancelFocus}
          />
        );
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <div className="space-y-6">
            {/* Task Summary Cards */}
            <TaskSummary
              total={stats.total}
              pending={stats.pending}
              completed={stats.completed}
            />

            {/* Calendar */}
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              taskDates={taskDates}
            />

            {/* Task List for Selected Date */}
            <TaskList
              tasks={selectedDateTasks}
              selectedDate={selectedDate}
              onDeleteTask={deleteTask}
              onStartFocus={handleStartFocus}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-dashed border-border">
        <div className="container max-w-md lg:max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="sm" />
          <p className="text-sm text-muted-foreground">
            {format(new Date(), 'EEE, MMM d')}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-md lg:max-w-4xl mx-auto px-4 py-6">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeItem={activeNav} onNavigate={setActiveNav} />

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createTask}
        selectedDate={selectedDate}
      />
    </div>
  );
}
