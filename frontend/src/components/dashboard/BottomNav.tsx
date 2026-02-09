import { Home, Timer, Settings } from 'lucide-react';

type NavItem = 'dashboard' | 'focus' | 'settings';

interface BottomNavProps {
  activeItem: NavItem;
  onNavigate: (item: NavItem) => void;
}

export function BottomNav({ activeItem, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard' as NavItem, label: 'Dashboard', icon: Home },
    { id: 'focus' as NavItem, label: 'Focus', icon: Timer },
    { id: 'settings' as NavItem, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-dashed border-border px-4 py-2 safe-area-inset-bottom">
      <div className="flex items-center justify-around max-w-md lg:max-w-4xl mx-auto">
        {navItems.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`bottom-nav-item ${isActive ? 'bottom-nav-item-active' : 'text-muted-foreground'}`}
            >
              <item.icon className={`h-5 w-5 lg:h-6 lg:w-6 ${isActive ? 'bottom-nav-item-active-text' : ''}`} />
              <span className={`text-xs lg:text-[15px] font-medium ${isActive ? 'bottom-nav-item-active-text' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
