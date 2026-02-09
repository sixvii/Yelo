import { format } from 'date-fns';
import { Clock, Trash2, Play } from 'lucide-react';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';

interface TaskListProps {
  tasks: Task[];
  selectedDate: Date;
  onDeleteTask: (taskId: string) => void;
  onStartFocus: (task: Task) => void;
}

export function TaskList({ tasks, selectedDate, onDeleteTask, onStartFocus }: TaskListProps) {
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

  const formatTimeSpent = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-dashed border-border p-6 text-center">
        <p className="text-muted-foreground">
          No tasks for {format(selectedDate, 'MMMM d, yyyy')}
        </p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Click on a date to add a task
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">
        Tasks for {format(selectedDate, 'MMMM d')}
      </h3>
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`task-card ${task.is_completed ? 'opacity-60' : ''}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium text-foreground ${task.is_completed ? 'line-through' : ''}`}>
                {task.title}
              </h4>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getCategoryClass(task.category)}`}>
                  {task.category}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getPriorityClass(task.priority)}`}>
                  {task.priority}
                </span>
                {task.time && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {task.time.slice(0, 5)}
                  </span>
                )}
                {task.is_completed && task.time_spent > 0 && (
                  <span className="text-xs text-success">
                    ✓ {formatTimeSpent(task.time_spent)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {!task.is_completed && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onStartFocus(task)}
                  className="h-8 w-8 text-primary hover:bg-accent"
                >
                  <Play className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteTask(task.id)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
