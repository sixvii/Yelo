import { CheckCircle2, Clock, ListTodo } from 'lucide-react';

interface TaskSummaryProps {
  total: number;
  pending: number;
  completed: number;
}

export function TaskSummary({ total, pending, completed }: TaskSummaryProps) {
  const cards = [
    {
      label: 'Total Tasks',
      value: total,
      icon: ListTodo,
      bgClass: 'bg-info/10',
      iconClass: 'text-info',
    },
    {
      label: 'Pending',
      value: pending,
      icon: Clock,
      bgClass: 'bg-warning/10',
      iconClass: 'text-warning',
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle2,
      bgClass: 'bg-success/10',
      iconClass: 'text-success',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-card rounded-xl border border-dashed border-border p-4 shadow-soft card-hover"
        >
          <div className={`${card.bgClass} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
            <card.icon className={`h-5 w-5 ${card.iconClass}`} />
          </div>
          <p className="text-2xl font-bold text-foreground">{card.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
