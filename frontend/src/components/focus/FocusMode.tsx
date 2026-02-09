import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Square, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/task';

interface FocusModeProps {
  task: Task | null;
  onComplete: (taskId: string, timeSpent: number) => Promise<{ error: Error | null }>;
  onCancel: () => void;
}

export function FocusMode({ task, onComplete, onCancel }: FocusModeProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Reset when task changes
  useEffect(() => {
    setElapsedTime(0);
    setIsRunning(false);
  }, [task?.id]);

  const formatTime = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  
  const handleComplete = async () => {
    if (!task) return;
    setIsRunning(false);
    setCompleting(true);
    await onComplete(task.id, elapsedTime);
    setCompleting(false);
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'Low': return 'priority-low';
      case 'Medium': return 'priority-medium';
      case 'High': return 'priority-high';
      default: return 'priority-medium';
    }
  };

  const getCategoryClass = (category: string) => {
    switch (category) {
      case 'Work': return 'category-work';
      case 'Personal': return 'category-personal';
      case 'Study': return 'category-study';
      case 'Health': return 'category-health';
      default: return 'category-personal';
    }
  };

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-6">
          <Play className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Focus Mode</h2>
        <p className="text-muted-foreground">
          Select a task from your dashboard to start focusing
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      {/* Task Info */}
      <div className="bg-card rounded-2xl border border-dashed border-border p-6 w-full max-w-sm mb-8 text-center">
        <h2 className="text-lg font-semibold text-foreground mb-2">{task.title}</h2>
        {task.description && (
          <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
        )}
        <div className="flex items-center justify-center gap-2">
          <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getCategoryClass(task.category)}`}>
            {task.category}
          </span>
          <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getPriorityClass(task.priority)}`}>
            {task.priority}
          </span>
        </div>
      </div>

      {/* Timer Display */}
      <div className={`mb-8 ${isRunning ? 'pulse-slow' : ''}`}>
        <div className="timer-display text-foreground">{formatTime(elapsedTime)}</div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          {isRunning ? 'Focusing...' : elapsedTime > 0 ? 'Paused' : 'Ready to start'}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {!isRunning ? (
          <Button
            size="lg"
            onClick={handleStart}
            className="h-14 w-14 rounded-full bg-primary hover:bg-gold-dark text-primary-foreground shadow-gold"
          >
            <Play className="h-6 w-6" />
          </Button>
        ) : (
          <Button
            size="lg"
            variant="outline"
            onClick={handlePause}
            className="h-14 w-14 rounded-full border-dashed"
          >
            <Pause className="h-6 w-6" />
          </Button>
        )}

        {elapsedTime > 0 && (
          <>
            <Button
              size="lg"
              variant="outline"
              onClick={onCancel}
              className="h-14 w-14 rounded-full border-dashed text-muted-foreground"
            >
              <Square className="h-5 w-5" />
            </Button>

            <Button
              size="lg"
              onClick={handleComplete}
              disabled={completing}
              className="h-14 w-14 rounded-full bg-success hover:bg-success/90 text-success-foreground"
            >
              <CheckCircle className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>

      {elapsedTime > 0 && (
        <p className="text-xs text-muted-foreground mt-6">
          Tap the green button to complete the task
        </p>
      )}
    </div>
  );
}
