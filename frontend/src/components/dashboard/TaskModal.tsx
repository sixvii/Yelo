import { useState } from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TaskFormData, TaskCategory, TaskPriority } from '@/types/task';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<{ error: Error | null }>;
  selectedDate: Date;
}

const categories: TaskCategory[] = ['Work', 'Personal', 'Study', 'Health'];
const priorities: TaskPriority[] = ['Low', 'Medium', 'High'];

export function TaskModal({ isOpen, onClose, onSubmit, selectedDate }: TaskModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    category: 'Personal',
    priority: 'Medium',
    date: format(selectedDate, 'yyyy-MM-dd'),
    time: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);
    const { error } = await onSubmit({
      ...formData,
      date: format(selectedDate, 'yyyy-MM-dd'),
    });
    setLoading(false);

    if (!error) {
      setFormData({
        title: '',
        description: '',
        category: 'Personal',
        priority: 'Medium',
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: '',
      });
      onClose();
    }
  };

  const getPriorityClass = (priority: TaskPriority) => {
    switch (priority) {
      case 'Low': return 'priority-low';
      case 'Medium': return 'priority-medium';
      case 'High': return 'priority-high';
    }
  };

  const getCategoryClass = (category: TaskCategory) => {
    switch (category) {
      case 'Work': return 'category-work';
      case 'Personal': return 'category-personal';
      case 'Study': return 'category-study';
      case 'Health': return 'category-health';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md lg:max-w-2xl bg-card rounded-t-3xl sm:rounded-2xl border border-dashed border-border p-6 lg:p-8 shadow-soft animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">New Task</h2>
            <p className="text-sm text-muted-foreground">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 rounded-lg"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              placeholder="What needs to be done?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="border-dashed lg:h-11 lg:text-base"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Add more details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="border-dashed resize-none h-20 lg:h-28 lg:text-base"
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: TaskCategory) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="border-dashed">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getCategoryClass(cat)}`}>
                        {cat}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: TaskPriority) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger className="border-dashed">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getPriorityClass(priority)}`}>
                        {priority}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label htmlFor="time">Time (optional)</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="border-dashed lg:h-11 lg:text-base"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-dashed"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 text-white"
              style={{ backgroundColor: '#01684A' }}
              disabled={loading || !formData.title.trim()}
            >
              {loading ? 'Saving...' : 'Save Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
