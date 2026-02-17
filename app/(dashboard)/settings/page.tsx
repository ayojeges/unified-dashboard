"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Bell, 
  Shield, 
  Palette,
  Globe,
  Database,
  Key,
  Save,
  Check,
  Sun,
  Moon,
  Monitor
} from "lucide-react";

export default function SettingsPage() {
  // Profile state
  const [profile, setProfile] = useState({
    firstName: "Ayo",
    lastName: "Jegede",
    email: "admin@cdlschoolsusa.com",
    phone: "+1 (832) 513-5336",
    bio: ""
  });
  const [profileSaved, setProfileSaved] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    taskReminders: true,
    teamMentions: true,
    weeklyReports: false
  });

  // Appearance state
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [accentColor, setAccentColor] = useState("#3b82f6");
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);

  // Security state
  const [twoFactor, setTwoFactor] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  const handleSaveProfile = () => {
    // In a real app, this would save to backend
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handlePasswordChange = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      alert("Passwords don't match!");
      return;
    }
    // In a real app, this would update password
    alert("Password updated successfully!");
    setPasswordForm({ current: "", new: "", confirm: "" });
  };

  const accentColors = [
    { color: "#3b82f6", name: "Blue" },
    { color: "#10b981", name: "Green" },
    { color: "#f59e0b", name: "Amber" },
    { color: "#ef4444", name: "Red" },
    { color: "#8b5cf6", name: "Purple" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your account preferences and settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto">
          <TabsTrigger value="profile" className="flex items-center gap-1 text-xs sm:text-sm py-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1 text-xs sm:text-sm py-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1 text-xs sm:text-sm py-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-1 text-xs sm:text-sm py-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-1 text-xs sm:text-sm py-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Integrations</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-1 text-xs sm:text-sm py-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Data</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input 
                  id="bio" 
                  placeholder="Tell us about yourself..." 
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                />
              </div>
              <Button onClick={handleSaveProfile}>
                {profileSaved ? <Check className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                {profileSaved ? "Saved!" : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your account
                  </p>
                </div>
                <Switch 
                  checked={notifications.email} 
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications on your devices
                  </p>
                </div>
                <Switch 
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Task Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminders for upcoming tasks and deadlines
                  </p>
                </div>
                <Switch 
                  checked={notifications.taskReminders}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, taskReminders: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Team Mentions</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify when someone mentions you in chat
                  </p>
                </div>
                <Switch 
                  checked={notifications.teamMentions}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, teamMentions: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly performance reports
                  </p>
                </div>
                <Switch 
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input 
                  id="currentPassword" 
                  type="password" 
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword" 
                  type="password" 
                  value={passwordForm.new}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                />
              </div>
              <Button onClick={handlePasswordChange}>
                <Key className="mr-2 h-4 w-4" />
                Update Password
              </Button>
              
              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable 2FA</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch 
                    checked={twoFactor}
                    onCheckedChange={setTwoFactor}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-4">
                  <Button 
                    variant={theme === 'light' ? 'default' : 'outline'} 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setTheme('light')}
                  >
                    <Sun className="h-6 w-6" />
                    Light
                  </Button>
                  <Button 
                    variant={theme === 'dark' ? 'default' : 'outline'} 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setTheme('dark')}
                  >
                    <Moon className="h-6 w-6" />
                    Dark
                  </Button>
                  <Button 
                    variant={theme === 'system' ? 'default' : 'outline'} 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setTheme('system')}
                  >
                    <Monitor className="h-6 w-6" />
                    System
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label>Accent Color</Label>
                <div className="flex gap-3">
                  {accentColors.map((item) => (
                    <button
                      key={item.color}
                      className={`h-10 w-10 rounded-full border-2 transition-all ${
                        accentColor === item.color ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
                      }`}
                      style={{ backgroundColor: item.color }}
                      onClick={() => setAccentColor(item.color)}
                      title={item.name}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Selected: {accentColors.find(c => c.color === accentColor)?.name}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use compact spacing for interface elements
                  </p>
                </div>
                <Switch 
                  checked={compactMode}
                  onCheckedChange={setCompactMode}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable interface animations and transitions
                  </p>
                </div>
                <Switch 
                  checked={animations}
                  onCheckedChange={setAnimations}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>
                Connect your favorite tools and services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Globe className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Google Workspace</p>
                    <p className="text-sm text-muted-foreground">Calendar, Drive, Gmail</p>
                  </div>
                </div>
                <Button variant="outline">Connect</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Database className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Slack</p>
                    <p className="text-sm text-muted-foreground">Team messaging</p>
                  </div>
                </div>
                <Button variant="outline">Connect</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">QuickBooks</p>
                    <p className="text-sm text-muted-foreground">Accounting</p>
                  </div>
                </div>
                <Button variant="outline">Connect</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Manage your data and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg space-y-2">
                <h4 className="font-medium">Export Data</h4>
                <p className="text-sm text-muted-foreground">
                  Download a copy of all your data
                </p>
                <Button variant="outline">Request Export</Button>
              </div>
              <div className="p-4 border rounded-lg border-destructive/50 space-y-2">
                <h4 className="font-medium text-destructive">Delete Account</h4>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
