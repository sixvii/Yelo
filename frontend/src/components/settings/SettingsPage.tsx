import { useState, useEffect } from 'react';
import { User, Lock, Bell, Palette, LogOut, ChevronRight, Moon, Sun, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { apiUrl } from '@/lib/api';

export function SettingsPage() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState({ fullName: '', email: '' });
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName || '',
        email: user.email || '',
      });
    }

    // Check initial dark mode
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, [user]);

  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast({
        title: 'Error',
        description: "New passwords don't match",
        variant: 'destructive',
      });
      return;
    }

    if (passwords.new.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    setUpdating(true);
    try {
      const res = await fetch(apiUrl('/api/auth/password'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ password: passwords.new }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update password');
      }
      toast({
        title: 'Success',
        description: 'Password updated successfully',
      });
      setShowPasswordForm(false);
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
    setUpdating(false);
  };

  const handleLogout = async () => {
    await signOut();
  };

  const settingsItems = [
    {
      id: 'profile',
      icon: User,
      label: 'Profile Information',
      description: profile.fullName || 'Not set',
      action: null,
    },
    {
      id: 'password',
      icon: Lock,
      label: 'Change Password',
      description: 'Update your password',
      action: () => setShowPasswordForm(!showPasswordForm),
    },
    {
      id: 'notifications',
      icon: Bell,
      label: 'Notifications',
      description: notifications ? 'Enabled' : 'Disabled',
      toggle: true,
      value: notifications,
      onChange: () => setNotifications(!notifications),
    },
    {
      id: 'theme',
      icon: darkMode ? Moon : Sun,
      label: 'Dark Mode',
      description: darkMode ? 'Dark' : 'Light',
      toggle: true,
      value: darkMode,
      onChange: toggleDarkMode,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card rounded-2xl border border-dashed border-border p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {profile.fullName || 'User'}
            </h2>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="bg-card rounded-2xl border border-dashed border-border overflow-hidden">
        {settingsItems.map((item, index) => (
          <div key={item.id}>
            <button
              onClick={item.action || undefined}
              className={`w-full flex items-center justify-between p-4 ${
                item.action ? 'hover:bg-accent/50' : ''
              } transition-colors`}
              disabled={!item.action && !item.toggle}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
              {item.toggle ? (
                <Switch
                  checked={item.value}
                  onCheckedChange={item.onChange}
                />
              ) : item.action ? (
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              ) : null}
            </button>
            {index < settingsItems.length - 1 && (
              <div className="h-px bg-border mx-4" />
            )}
          </div>
        ))}
      </div>

      {/* Password Form */}
      {showPasswordForm && (
        <div className="bg-card rounded-2xl border border-dashed border-border p-6 animate-slide-up">
          <h3 className="font-semibold text-foreground mb-4">Change Password</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  className="border-dashed pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  className="border-dashed pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPasswordForm(false)}
                className="flex-1 border-dashed"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-gold-dark text-primary-foreground"
                disabled={updating}
              >
                {updating ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Logout Button */}
      <Button
        variant="outline"
        onClick={handleLogout}
        className="w-full h-12 border-dashed text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <LogOut className="h-5 w-5 mr-2" />
        Logout
      </Button>
    </div>
  );
}
